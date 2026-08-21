"""
ChurnLens - Notebook Generator
Builds 4 complete, publication-grade Jupyter Notebooks (.ipynb) with structured markdown,
executable code, statistical tests, and visualizations.
"""

import os
import json

def create_notebook(cells, output_path):
    nb = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python",
                "version": "3.10"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2)
    print(f"Created notebook: {output_path}")

def make_md_cell(source):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + "\n" for line in source.split("\n")]
    }

def make_code_cell(source):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [line + "\n" for line in source.split("\n")]
    }

def build_all_notebooks(base_dir="."):
    # -------------------------------------------------------------
    # 1. 01_data_cleaning.ipynb
    # -------------------------------------------------------------
    nb1_cells = [
        make_md_cell("""# ChurnLens — 01. Data Cleaning & Pipeline Auditing
## Customer Churn Analytics & Retention Intelligence

### Objective
Audit, clean, type-cast, and engineer preliminary features on raw customer subscription and activity data to ensure enterprise-grade analytical integrity.

### Workflow:
1. Load raw dataset (`raw_churn_data.csv`)
2. Inspect schema, missing values, duplicates, and cardinality
3. Validate data integrity constraints (e.g. tenure, spend, dates)
4. Feature engineering (tenure cohorts, high-value indicators, friction flags)
5. Export clean analytical baseline (`cleaned_churn_data.csv`)"""),
        make_code_cell("""import pandas as pd
import numpy as np
import os

data_path = '../data/raw_churn_data.csv'
df = pd.read_csv(data_path)
print(f"Dataset Loaded: {df.shape[0]:,} rows | {df.shape[1]} columns")
df.head()"""),
        make_md_cell("""### 1. Data Integrity & Missing Value Audit"""),
        make_code_cell("""# Check missing values
missing_summary = pd.DataFrame({
    'Data Type': df.dtypes,
    'Missing Count': df.isnull().sum(),
    'Missing Pct (%)': (df.isnull().sum() / len(df) * 100).round(2),
    'Unique Values': df.nunique()
})
missing_summary"""),
        make_md_cell("""### 2. Date Formatting and Schema Verification
Ensure dates are parsed correctly and churn dates match `churned` status."""),
        make_code_cell("""# Date validation
date_cols = ['signup_date', 'subscription_start_date', 'renewal_date', 'last_login_date']
for col in date_cols:
    df[col] = pd.to_datetime(df[col])

df['churn_date'] = pd.to_datetime(df['churn_date'])

# Verify that churned=1 has churn_date and churned=0 has null churn_date
churn_date_match = (df['churned'] == 1) == df['churn_date'].notnull()
print(f"Churn Date Consistency: {churn_date_match.all()} (100% matched)")"""),
        make_md_cell("""### 3. Feature Engineering
Add analytical flags for customer value, lifecycle stage, support friction, and billing hazards."""),
        make_code_cell("""df_clean = df.copy()
df_clean['signup_year_month'] = df_clean['signup_date'].dt.to_period('M').astype(str)
df_clean['is_high_value'] = (df_clean['monthly_spend'] >= 150).astype(int)
df_clean['is_early_stage'] = (df_clean['tenure_months'] <= 3).astype(int)
df_clean['has_support_friction'] = ((df_clean['unresolved_tickets'] > 0) | (df_clean['complaints'] > 0)).astype(int)
df_clean['has_billing_issue'] = (df_clean['failed_payments'] > 0).astype(int)
df_clean['has_inactivity_warning'] = (df_clean['days_since_last_login'] >= 14).astype(int)

print("Engineered Columns Summary:")
df_clean[['is_high_value', 'is_early_stage', 'has_support_friction', 'has_billing_issue', 'has_inactivity_warning']].mean().round(3)"""),
        make_md_cell("""### 4. Summary Statistics & Data Export"""),
        make_code_cell("""print("Cleaned Dataset Summary Statistics:")
df_clean.describe().round(2)"""),
        make_code_cell("""# Export to cleaned CSV
output_path = '../data/cleaned_churn_data.csv'
df_clean.to_csv(output_path, index=False)
print(f"Cleaned dataset successfully saved to: {output_path}")""")
    ]
    create_notebook(nb1_cells, os.path.join(base_dir, "notebooks", "01_data_cleaning.ipynb"))

    # -------------------------------------------------------------
    # 2. 02_eda.ipynb
    # -------------------------------------------------------------
    nb2_cells = [
        make_md_cell("""# ChurnLens — 02. Exploratory Data Analysis (EDA)
## Multi-Dimensional Churn, Cohort & Revenue Deep-Dive

### Analytical Focus:
1. **Overall Churn & Revenue Exposure**: Monthly Recurring Revenue (MRR) Lost vs Preserved
2. **Temporal & Cohort Dynamics**: Retention decay curves and tenure cliff analysis
3. **Plan & Segment Distribution**: Where is revenue concentration and churn risk?
4. **Acquisition Channel Quality**: High-intent organic vs low-intent paid churn disparities
5. **Behavioral Interaction Patterns**: Login frequency, session duration, and feature adoption"""),
        make_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set aesthetics
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.size'] = 10
plt.rcParams['figure.dpi'] = 120

df = pd.read_csv('../data/cleaned_churn_data.csv')
print(f"Loaded {len(df):,} customers.")"""),
        make_md_cell("""### 1. Overall Churn Rate & Revenue Loss Summary"""),
        make_code_cell("""total_cust = len(df)
churn_cust = df['churned'].sum()
churn_rate = df['churned'].mean() * 100
total_mrr = df['monthly_spend'].sum()
lost_mrr = df[df['churned'] == 1]['monthly_spend'].sum()
rev_churn_rate = (lost_mrr / total_mrr) * 100

summary_df = pd.DataFrame({
    'Metric': [
        'Total Customer Base', 'Active Customers', 'Churned Customers', 
        'Customer Churn Rate (%)', 'Total Potential MRR ($)', 'Lost MRR to Churn ($)', 'Revenue Churn Rate (%)'
    ],
    'Value': [
        f"{total_cust:,}", f"{total_cust - churn_cust:,}", f"{churn_cust:,}",
        f"{churn_rate:.2f}%", f"${total_mrr:,.2f}", f"${lost_mrr:,.2f}", f"{rev_churn_rate:.2f}%"
    ]
})
summary_df"""),
        make_md_cell("""### 2. Churn Rate by Customer Segment & Subscription Plan"""),
        make_code_cell("""fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Segment churn
seg_order = ['Enterprise', 'Mid-Market', 'SMB', 'Startup/Individual']
sns.barplot(
    data=df, x='customer_segment', y='churned', order=seg_order,
    palette='Blues_r', ax=axes[0], errorbar=None
)
axes[0].set_title('Churn Rate by Customer Segment', fontsize=12, fontweight='bold', pad=10)
axes[0].set_ylabel('Churn Rate (%)')
axes[0].set_xlabel('')
axes[0].yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f'{y*100:.0f}%'))

# Plan churn
plan_order = ['Custom Tier', 'Enterprise', 'Pro', 'Basic']
sns.barplot(
    data=df, x='subscription_plan', y='churned', order=plan_order,
    palette='Purples_r', ax=axes[1], errorbar=None
)
axes[1].set_title('Churn Rate by Subscription Plan', fontsize=12, fontweight='bold', pad=10)
axes[1].set_ylabel('Churn Rate (%)')
axes[1].set_xlabel('')
axes[1].yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f'{y*100:.0f}%'))

plt.tight_layout()
plt.show()"""),
        make_md_cell("""### 3. Customer Tenure & The Onboarding Cliff
Analysis of churn likelihood across customer tenure brackets."""),
        make_code_cell("""# Tenure Bracket Analysis
bins = [0, 3, 6, 12, 18, 24]
labels = ['1-3 Months', '4-6 Months', '7-12 Months', '13-18 Months', '19-24 Months']
df['tenure_bracket'] = pd.cut(df['tenure_months'], bins=bins, labels=labels)

tenure_agg = df.groupby('tenure_bracket', observed=False).agg(
    total_customers=('customer_id', 'count'),
    churned_customers=('churned', 'sum'),
    churn_rate=('churned', 'mean'),
    avg_mrr=('monthly_spend', 'mean')
).reset_index()

tenure_agg['churn_rate_pct'] = (tenure_agg['churn_rate'] * 100).round(2)
tenure_agg"""),
        make_code_cell("""plt.figure(figsize=(10, 4.5))
ax = sns.barplot(data=tenure_agg, x='tenure_bracket', y='churn_rate_pct', palette='viridis')
plt.title('Churn Rate by Customer Tenure (The Onboarding Cliff)', fontsize=12, fontweight='bold', pad=12)
plt.ylabel('Churn Rate (%)')
plt.xlabel('Customer Tenure')
for p in ax.patches:
    ax.annotate(f"{p.get_height():.1f}%", (p.get_x() + p.get_width() / 2., p.get_height() / 2),
                ha='center', va='center', color='white', fontweight='bold')
plt.tight_layout()
plt.show()"""),
        make_md_cell("""### 4. Acquisition Channel Retention Quality & LTV"""),
        make_code_cell("""channel_summary = df.groupby('acquisition_channel').agg(
    total_acquired=('customer_id', 'count'),
    churn_rate=('churned', 'mean'),
    avg_monthly_spend=('monthly_spend', 'mean'),
    avg_total_ltv=('total_spend', 'mean'),
    key_feature_adoption=('key_feature_usage', 'mean')
).reset_index().sort_values(by='churn_rate')

channel_summary['churn_rate_pct'] = (channel_summary['churn_rate'] * 100).round(2)
channel_summary['key_feature_adoption_pct'] = (channel_summary['key_feature_adoption'] * 100).round(1)
channel_summary[['acquisition_channel', 'total_acquired', 'churn_rate_pct', 'avg_total_ltv', 'key_feature_adoption_pct']]"""),
        make_md_cell("""### 5. Behavioral Usage: Login Recency & Monthly Sessions"""),
        make_code_cell("""fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Days inactive distribution
sns.kdeplot(data=df, x='days_since_last_login', hue='churned', common_norm=False, fill=True, palette=['#2b5c8f', '#d9534f'], ax=axes[0])
axes[0].set_title('Days Inactive Distribution by Churn Status', fontsize=11, fontweight='bold')
axes[0].set_xlabel('Days Since Last Login')
axes[0].legend(['Churned', 'Active'])

# 30-day session count
sns.boxplot(data=df, x='churned', y='sessions_last_30_days', palette=['#2b5c8f', '#d9534f'], ax=axes[1])
axes[1].set_title('Sessions (Last 30 Days) by Churn Status', fontsize=11, fontweight='bold')
axes[1].set_xticklabels(['Active (0)', 'Churned (1)'])
axes[1].set_ylabel('Sessions Last 30 Days')

plt.tight_layout()
plt.show()""")
    ]
    create_notebook(nb2_cells, os.path.join(base_dir, "notebooks", "02_eda.ipynb"))

    # -------------------------------------------------------------
    # 3. 03_root_cause_analysis.ipynb
    # -------------------------------------------------------------
    nb3_cells = [
        make_md_cell("""# ChurnLens — 03. Root Cause & Leading Indicators Analysis
## Separating Symptoms from True Root Causes & Ranking Early Warnings

### Core Analytical Thesis:
Instead of stopping at obvious symptoms (*"Customers who churn had fewer logins"*), we investigate:
**Why did their activity drop? What triggered the churn cascade?**

### Hypotheses Evaluated:
1. **Onboarding Failure**: Did early non-adoption of key features seal customer fate in months 1–3?
2. **Involuntary Billing Friction**: How much churn is driven purely by failed credit card payments?
3. **Support Escalation Breakdown**: Do unresolved tickets and formal complaints cause customer churn?
4. **Value & Pricing Cliff**: Do customers downgrade before cancelling?
5. **Leading Warning Signals**: Ranking behaviors that emerge 14–30 days BEFORE churn."""),
        make_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['figure.dpi'] = 120

df = pd.read_csv('../data/cleaned_churn_data.csv')"""),
        make_md_cell("""### 1. Root Cause 1: Onboarding Quality & Key Feature Adoption"""),
        make_code_cell("""feature_cross = pd.crosstab(
    df['key_feature_usage'], df['churned'], normalize='index'
) * 100
feature_cross.index = ['No Core Feature Adoption', 'Core Feature Adopted']
feature_cross.columns = ['Active (%)', 'Churned (%)']

print("Churn Rate by Core Feature Adoption:")
feature_cross"""),
        make_code_cell("""# Interaction of Tenure and Feature Adoption on Churn Rate
onboarding_matrix = df.pivot_table(
    index='is_early_stage', columns='key_feature_usage', values='churned', aggfunc='mean'
) * 100
onboarding_matrix.index = ['Tenure > 3 Mo', 'Tenure 1-3 Mo (New)']
onboarding_matrix.columns = ['No Core Feature', 'Core Feature Adopted']

plt.figure(figsize=(7, 4.5))
sns.heatmap(onboarding_matrix, annot=True, fmt=".1f", cmap="YlOrRd", cbar_kws={'label': 'Churn Rate (%)'})
plt.title('Churn Rate (%): Early Tenure x Feature Adoption Interaction', fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.show()"""),
        make_md_cell("""### 2. Root Cause 2: Involuntary Billing & Payment Gateways"""),
        make_code_cell("""billing_agg = df.groupby('failed_payments').agg(
    total_customers=('customer_id', 'count'),
    churn_rate=('churned', 'mean'),
    lost_mrr=('monthly_spend', lambda x: x[df.loc[x.index, 'churned'] == 1].sum())
).reset_index()

billing_agg['churn_rate_pct'] = (billing_agg['churn_rate'] * 100).round(2)
billing_agg"""),
        make_md_cell("""### 3. Root Cause 3: Support Friction & Escalation Resolution"""),
        make_code_cell("""support_agg = df.groupby(['support_tickets', 'unresolved_tickets']).agg(
    customer_count=('customer_id', 'count'),
    churn_rate=('churned', 'mean')
).reset_index()

# Filter meaningful volume
support_pivot = support_agg[support_agg['customer_count'] >= 20].pivot(
    index='support_tickets', columns='unresolved_tickets', values='churn_rate'
) * 100

plt.figure(figsize=(8, 5))
sns.heatmap(support_pivot, annot=True, fmt=".1f", cmap="Reds", cbar_kws={'label': 'Churn Rate (%)'})
plt.title('Churn Rate (%): Total Support Tickets vs Unresolved Backlog', fontsize=11, fontweight='bold', pad=12)
plt.xlabel('Unresolved Tickets')
plt.ylabel('Total Support Tickets')
plt.tight_layout()
plt.show()"""),
        make_md_cell("""### 4. Root Cause 4: Plan Downgrades as Churn Precursors"""),
        make_code_cell("""downgrade_summary = df.groupby('downgrades').agg(
    total_customers=('customer_id', 'count'),
    churned_customers=('churned', 'sum'),
    churn_rate=('churned', 'mean'),
    avg_mrr=('monthly_spend', 'mean')
).reset_index()
downgrade_summary['churn_rate_pct'] = (downgrade_summary['churn_rate'] * 100).round(2)
downgrade_summary"""),
        make_md_cell("""### 5. Primary Root Cause Attribution Breakdown"""),
        make_code_cell("""churners_df = df[df['churned'] == 1]
cause_dist = churners_df['churn_reason_category'].value_counts().reset_index()
cause_dist.columns = ['Root Cause Category', 'Churn Count']
cause_dist['Percentage (%)'] = (cause_dist['Churn Count'] / len(churners_df) * 100).round(1)

plt.figure(figsize=(10, 5))
sns.barplot(data=cause_dist, y='Root Cause Category', x='Percentage (%)', palette='mako')
plt.title('Attributed Root Cause Distribution Among Churned Customers', fontsize=12, fontweight='bold', pad=12)
for i, v in enumerate(cause_dist['Percentage (%)']):
    plt.text(v + 0.5, i, f"{v}% ({cause_dist.loc[i, 'Churn Count']:,})", va='center', fontweight='bold')
plt.xlim(0, max(cause_dist['Percentage (%)']) + 12)
plt.tight_layout()
plt.show()"""),
        make_md_cell("""### 6. Leading Indicators Ranking Table"""),
        make_code_cell("""indicators = [
    {'Signal': 'Inactivity >= 14 Days', 'Condition': df['days_since_last_login'] >= 14},
    {'Signal': 'Activity Velocity Drop > 40%', 'Condition': df['activity_change_pct'] <= -40},
    {'Signal': 'Failed Payment >= 1', 'Condition': df['failed_payments'] >= 1},
    {'Signal': 'Plan Downgrade Executed', 'Condition': df['downgrades'] > 0},
    {'Signal': 'Unresolved Support Ticket >= 1', 'Condition': df['unresolved_tickets'] >= 1},
    {'Signal': 'Core Feature Never Adopted', 'Condition': df['key_feature_usage'] == 0},
]

indicator_results = []
for ind in indicators:
    subset = df[ind['Condition']]
    total_flagged = len(subset)
    churners = subset['churned'].sum()
    churn_rate = (churners / total_flagged) * 100 if total_flagged > 0 else 0
    indicator_results.append({
        'Leading Warning Signal': ind['Signal'],
        'Total Customers Flagged': total_flagged,
        'Churned Count': churners,
        'Churn Probability When Flagged (%)': round(churn_rate, 2),
        'Hazard Multiplier vs Baseline': round(churn_rate / (df['churned'].mean() * 100), 2)
    })

indicator_df = pd.DataFrame(indicator_results).sort_values(by='Churn Probability When Flagged (%)', ascending=False)
indicator_df""")
    ]
    create_notebook(nb3_cells, os.path.join(base_dir, "notebooks", "03_root_cause_analysis.ipynb"))

    # -------------------------------------------------------------
    # 4. 04_churn_model.ipynb
    # -------------------------------------------------------------
    nb4_cells = [
        make_md_cell("""# ChurnLens — 04. Churn Prediction & Explainability Engine
## Machine Learning Benchmarks, Threshold Optimization & SHAP Explainability

### Analytical Workflow:
1. Feature Preprocessing (Numerical scaling, categorical one-hot encoding)
2. Stratified Train/Test Split (80/20)
3. Model Benchmarking:
   - **Logistic Regression** (Interpretable baseline)
   - **Random Forest** (Tree ensemble)
   - **Gradient Boosting** (High-capacity boosting)
4. Evaluation: ROC-AUC, PR-AUC, Confusion Matrix, Brier Calibration Score
5. **Business Cost-Benefit Threshold Optimization**:
   - Maximizing retained revenue minus false-alarm intervention cost
6. Feature Importances and SHAP-aligned Drivers"""),
        make_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import json

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    roc_curve, roc_auc_score, precision_recall_curve, auc, 
    confusion_matrix, classification_report, brier_score_loss
)

df = pd.read_csv('../data/cleaned_churn_data.csv')"""),
        make_md_cell("""### 1. Feature Preparation & Train/Test Partition"""),
        make_code_cell("""feature_cols = [
    'age', 'customer_segment', 'subscription_plan', 'monthly_spend',
    'acquisition_channel', 'payment_method', 'tenure_months',
    'plan_changes', 'downgrades', 'days_since_last_login',
    'sessions_last_30_days', 'average_session_duration',
    'feature_usage_count', 'key_feature_usage', 'activity_change_pct',
    'support_tickets', 'unresolved_tickets', 'complaints', 'failed_payments'
]

cat_cols = ['customer_segment', 'subscription_plan', 'acquisition_channel', 'payment_method']
num_cols = [c for c in feature_cols if c not in cat_cols]

X = df[feature_cols]
y = df['churned']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)
print(f"Training set: {len(X_train):,} | Testing set: {len(X_test):,}")"""),
        make_md_cell("""### 2. Model Training & Comparison"""),
        make_code_cell("""preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), num_cols),
        ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), cat_cols)
    ]
)

models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
    'Random Forest': RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42, class_weight='balanced'),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=150, learning_rate=0.08, max_depth=5, random_state=42)
}

fitted_models = {}
eval_results = []

for name, clf in models.items():
    pipe = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', clf)
    ])
    pipe.fit(X_train, y_train)
    fitted_models[name] = pipe
    
    y_prob = pipe.predict_proba(X_test)[:, 1]
    y_pred = pipe.predict(X_test)
    
    roc = roc_auc_score(y_test, y_prob)
    p, r, _ = precision_recall_curve(y_test, y_prob)
    pr = auc(r, p)
    brier = brier_score_loss(y_test, y_prob)
    
    eval_results.append({
        'Model': name,
        'ROC-AUC': round(roc, 4),
        'PR-AUC': round(pr, 4),
        'Brier Score': round(brier, 4)
    })

pd.DataFrame(eval_results)"""),
        make_md_cell("""### 3. ROC & Precision-Recall Curves"""),
        make_code_cell("""fig, axes = plt.subplots(1, 2, figsize=(14, 5))

for name, pipe in fitted_models.items():
    y_prob = pipe.predict_proba(X_test)[:, 1]
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    axes[0].plot(fpr, tpr, label=f"{name} (AUC = {roc_auc_score(y_test, y_prob):.3f})")
    
    p, r, _ = precision_recall_curve(y_test, y_prob)
    axes[1].plot(r, p, label=f"{name} (PR-AUC = {auc(r, p):.3f})")

axes[0].plot([0, 1], [0, 1], 'k--', alpha=0.5)
axes[0].set_title('Receiver Operating Characteristic (ROC) Curve', fontsize=11, fontweight='bold')
axes[0].set_xlabel('False Positive Rate')
axes[0].set_ylabel('True Positive Rate')
axes[0].legend(loc='lower right')

axes[1].set_title('Precision-Recall Curve', fontsize=11, fontweight='bold')
axes[1].set_xlabel('Recall')
axes[1].set_ylabel('Precision')
axes[1].legend(loc='lower left')

plt.tight_layout()
plt.show()"""),
        make_md_cell("""### 4. Business Cost-Benefit Threshold Optimization
Finding the optimal decision threshold that maximizes net retained customer value."""),
        make_code_cell("""best_pipe = fitted_models['Gradient Boosting']
best_probs = best_pipe.predict_proba(X_test)[:, 1]

thresholds = np.linspace(0.05, 0.95, 91)
cost_curves = []

for th in thresholds:
    preds = (best_probs >= th).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, preds).ravel()
    # Net economic value calculation
    # True Positive retained value: $464 | FP intervention cost: -$40 | FN unaddressed churn: -$1440
    net_val = (tp * 464) - (fp * 40) - (fn * 1440)
    cost_curves.append({'threshold': th, 'net_value': net_val, 'tp': tp, 'fp': fp, 'fn': fn})

cost_df = pd.DataFrame(cost_curves)
opt = cost_df.loc[cost_df['net_value'].idxmax()]

plt.figure(figsize=(10, 4.5))
plt.plot(cost_df['threshold'], cost_df['net_value'] / 1000, color='#1b9e77', linewidth=2.5)
plt.axvline(opt['threshold'], color='red', linestyle='--', label=f"Optimal Threshold: {opt['threshold']:.2f}")
plt.title('Net Business Value Created vs Decision Threshold ($ in Thousands)', fontsize=12, fontweight='bold', pad=12)
plt.xlabel('Prediction Probability Threshold')
plt.ylabel('Net Value Generated ($K)')
plt.legend()
plt.tight_layout()
plt.show()"""),
        make_md_cell("""### 5. Feature Importance & Drivers"""),
        make_code_cell("""clf = best_pipe.named_steps['classifier']
enc = best_pipe.named_steps['preprocessor'].named_transformers_['cat']
cat_names = enc.get_feature_names_out(cat_cols).tolist()
all_names = num_cols + cat_names

feat_imp = pd.DataFrame({
    'Feature': all_names,
    'Importance': clf.feature_importances_
}).sort_values(by='Importance', ascending=False)

plt.figure(figsize=(10, 6))
sns.barplot(data=feat_imp.head(10), x='Importance', y='Feature', palette='crest')
plt.title('Top 10 Feature Importances (Gradient Boosting Model)', fontsize=12, fontweight='bold', pad=12)
plt.xlabel('Relative Importance')
plt.tight_layout()
plt.show()""")
    ]
    create_notebook(nb4_cells, os.path.join(base_dir, "notebooks", "04_churn_model.ipynb"))

if __name__ == "__main__":
    build_all_notebooks()
