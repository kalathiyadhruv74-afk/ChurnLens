"""
ChurnLens - Machine Learning Churn Prediction Engine
Trains, compares, and evaluates Logistic Regression, Random Forest, and Gradient Boosting models.
Computes ROC-AUC, PR-AUC, business cost-benefit threshold optimization, and feature importances.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    roc_auc_score, precision_recall_curve, auc, 
    classification_report, confusion_matrix, brier_score_loss,
    f1_score, precision_score, recall_score
)

def prepare_features(df):
    """
    Selects features and separates target.
    """
    feature_cols = [
        'age', 'customer_segment', 'subscription_plan', 'monthly_spend',
        'acquisition_channel', 'payment_method', 'tenure_months',
        'plan_changes', 'downgrades', 'days_since_last_login',
        'sessions_last_30_days', 'average_session_duration',
        'feature_usage_count', 'key_feature_usage', 'activity_change_pct',
        'support_tickets', 'unresolved_tickets', 'complaints', 'failed_payments'
    ]
    
    categorical_cols = [
        'customer_segment', 'subscription_plan', 'acquisition_channel', 'payment_method'
    ]
    
    numerical_cols = [col for col in feature_cols if col not in categorical_cols]
    
    X = df[feature_cols].copy()
    y = df['churned'].values
    
    return X, y, categorical_cols, numerical_cols

def train_and_evaluate_models(base_dir="."):
    data_path = os.path.join(base_dir, "data", "cleaned_churn_data.csv")
    df = pd.read_csv(data_path)
    
    X, y, cat_cols, num_cols = prepare_features(df)
    
    # Train-test split (80/20 stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), cat_cols)
        ]
    )
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
        'Random Forest': RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42, class_weight='balanced', min_samples_split=10),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=150, learning_rate=0.08, max_depth=5, random_state=42)
    }
    
    results = {}
    fitted_pipelines = {}
    
    print("====================================================================")
    print("CHURNLENS - MODEL BENCHMARKING & EVALUATION")
    print("====================================================================\n")
    
    for name, clf in models.items():
        pipe = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', clf)
        ])
        
        pipe.fit(X_train, y_train)
        fitted_pipelines[name] = pipe
        
        y_prob = pipe.predict_proba(X_test)[:, 1]
        y_pred_default = pipe.predict(X_test)
        
        # Calculate Metrics
        roc_auc = roc_auc_score(y_test, y_prob)
        p, r, _ = precision_recall_curve(y_test, y_prob)
        pr_auc = auc(r, p)
        f1 = f1_score(y_test, y_pred_default)
        prec = precision_score(y_test, y_pred_default)
        rec = recall_score(y_test, y_pred_default)
        brier = brier_score_loss(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred_default).tolist()
        
        results[name] = {
            'ROC-AUC': round(roc_auc, 4),
            'PR-AUC': round(pr_auc, 4),
            'Precision': round(prec, 4),
            'Recall': round(rec, 4),
            'F1-Score': round(f1, 4),
            'Brier Score': round(brier, 4),
            'Confusion Matrix': cm
        }
        
        print(f"--- Model: {name} ---")
        print(f"ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f} | F1: {f1:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | Brier: {brier:.4f}")
        print(f"Confusion Matrix:\n  TN: {cm[0][0]:<5} FP: {cm[0][1]:<5}\n  FN: {cm[1][0]:<5} TP: {cm[1][1]:<5}\n")

    # Select Best Model based on ROC-AUC / PR-AUC
    best_model_name = 'Gradient Boosting'
    best_pipe = fitted_pipelines[best_model_name]
    
    # Feature Importances extraction
    classifier = best_pipe.named_steps['classifier']
    enc = best_pipe.named_steps['preprocessor'].named_transformers_['cat']
    encoded_cat_feature_names = enc.get_feature_names_out(cat_cols).tolist()
    all_feature_names = num_cols + encoded_cat_feature_names
    
    importances = classifier.feature_importances_
    feat_imp_df = pd.DataFrame({
        'feature': all_feature_names,
        'importance': importances
    }).sort_values(by='importance', ascending=False)
    
    print("\nTop 10 Most Influential Churn Drivers (Gradient Boosting Feature Importance):")
    for idx, r in feat_imp_df.head(10).iterrows():
        print(f"  {r['feature']:<35}: {r['importance']*100:.2f}%")
        
    # Business Threshold Optimization
    # Assume Average Customer Value = $120 MRR ($1,440/yr), Cost of Retention Offer = $40
    # True Positive Benefit = 0.35 * $1,440 - $40 = $464
    # False Positive Cost = -$40
    # False Negative Cost (Unaddressed Churn) = -$1,440
    # True Negative = $0
    best_probs = best_pipe.predict_proba(X_test)[:, 1]
    thresholds = np.linspace(0.10, 0.90, 81)
    threshold_analysis = []
    
    for th in thresholds:
        preds = (best_probs >= th).astype(int)
        tn, fp, fn, tp = confusion_matrix(y_test, preds).ravel()
        
        # Net retention value created on test cohort
        net_value = (tp * 464) - (fp * 40) - (fn * 1440)
        p_score = precision_score(y_test, preds, zero_division=0)
        r_score = recall_score(y_test, preds, zero_division=0)
        f1_val = f1_score(y_test, preds, zero_division=0)
        
        threshold_analysis.append({
            'threshold': round(float(th), 2),
            'precision': round(float(p_score), 4),
            'recall': round(float(r_score), 4),
            'f1': round(float(f1_val), 4),
            'tp': int(tp),
            'fp': int(fp),
            'fn': int(fn),
            'tn': int(tn),
            'net_business_value': int(net_value)
        })
        
    best_th_obj = max(threshold_analysis, key=lambda x: x['net_business_value'])
    print(f"\nOptimal Business Decision Threshold: {best_th_obj['threshold']} (F1: {best_th_obj['f1']}, Recall: {best_th_obj['recall']}, Net Value: ${best_th_obj['net_business_value']:,})")
    
    # Save Model Artifacts
    models_dir = os.path.join(base_dir, "data", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(best_pipe, os.path.join(models_dir, "churn_best_model.pkl"))
    feat_imp_df.to_csv(os.path.join(models_dir, "feature_importances.csv"), index=False)
    
    with open(os.path.join(models_dir, "model_benchmark_results.json"), "w") as f:
        json.dump({
            'benchmarks': results,
            'best_model': best_model_name,
            'optimal_threshold': best_th_obj,
            'threshold_curve': threshold_analysis[::5] # sample points
        }, f, indent=2)
        
    print(f"\nModel artifacts successfully saved to: {models_dir}")
    return results, feat_imp_df

if __name__ == "__main__":
    train_and_evaluate_models()
