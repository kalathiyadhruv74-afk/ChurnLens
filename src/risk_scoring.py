"""
ChurnLens - 0-100 Customer Risk Scoring & Segmentation Engine
Calculates multi-dimensional risk scores, explainable sub-score drivers,
and segments customers into actionable retention cohorts.
"""

import os
import sqlite3
import numpy as np
import pandas as pd

def compute_risk_scores(df):
    """
    Computes a transparent, explainable 0-100 Risk Score for each customer.
    Weights 4 core risk vectors (each up to 25 points):
      1. Inactivity & Recency Hazard (0-25 pts)
      2. Engagement Velocity & Usage Drop (0-25 pts)
      3. Operational & Billing Friction (0-25 pts)
      4. Feature Desertion & Downgrade Risk (0-25 pts)
    """
    scored_df = df.copy()
    
    # 1. Inactivity Subscore (0-25)
    # Days inactive: 0-3d (0 pts), 4-7d (6 pts), 8-14d (14 pts), 15-30d (20 pts), 31+d (25 pts)
    def calc_inactivity_pts(days):
        if days <= 3:
            return 0.0
        elif days <= 7:
            return 6.0 + (days - 3) * 1.5
        elif days <= 14:
            return 12.0 + (days - 7) * 1.2
        elif days <= 30:
            return 18.0 + (days - 14) * 0.35
        else:
            return 25.0
            
    scored_df['score_inactivity'] = scored_df['days_since_last_login'].apply(calc_inactivity_pts)
    
    # 2. Engagement Velocity Subscore (0-25)
    # Based on activity_change_pct: positive growth (0 pts), -1% to -30% (5-12 pts), -30% to -60% (13-20 pts), <-60% (21-25 pts)
    def calc_velocity_pts(row):
        pct = row['activity_change_pct']
        sessions = row['sessions_last_30_days']
        pts = 0.0
        if pct < 0:
            pts += min(20.0, abs(pct) * 0.25)
        if sessions <= 3:
            pts += 5.0
        elif sessions <= 8:
            pts += 2.5
        return min(25.0, pts)
        
    scored_df['score_engagement_velocity'] = scored_df.apply(calc_velocity_pts, axis=1)
    
    # 3. Operational Friction Subscore (0-25)
    # Failed payments (up to 12 pts), Unresolved tickets (up to 8 pts), Complaints (up to 5 pts)
    def calc_friction_pts(row):
        pts = 0.0
        # Failed payments: 1 pmt = 6 pts, 2+ = 12 pts
        pts += min(12.0, row['failed_payments'] * 6.0)
        # Unresolved tickets: 1 = 4 pts, 2+ = 8 pts
        pts += min(8.0, row['unresolved_tickets'] * 4.0)
        # Complaints: 1 = 3 pts, 2+ = 5 pts
        pts += min(5.0, row['complaints'] * 2.5)
        return min(25.0, pts)
        
    scored_df['score_operational_friction'] = scored_df.apply(calc_friction_pts, axis=1)
    
    # 4. Feature Desertion & Downgrade Risk Subscore (0-25)
    # Key feature unadopted (12 pts), Feature count <= 4 (5 pts), Downgrade (8 pts)
    def calc_feature_pts(row):
        pts = 0.0
        if row['key_feature_usage'] == 0:
            pts += 12.0
        if row['feature_usage_count'] <= 4:
            pts += 5.0
        elif row['feature_usage_count'] <= 8:
            pts += 2.5
        if row['downgrades'] > 0:
            pts += 8.0
        return min(25.0, pts)
        
    scored_df['score_feature_adoption'] = scored_df.apply(calc_feature_pts, axis=1)
    
    # Composite Total Risk Score (0 - 100)
    scored_df['churn_risk_score'] = (
        scored_df['score_inactivity'] +
        scored_df['score_engagement_velocity'] +
        scored_df['score_operational_friction'] +
        scored_df['score_feature_adoption']
    ).round(1)
    
    # Risk Tier Classification
    def assign_risk_tier(score):
        if score <= 30.0:
            return 'Low Risk'
        elif score <= 60.0:
            return 'Medium Risk'
        elif score <= 80.0:
            return 'High Risk'
        else:
            return 'Critical Risk'
            
    scored_df['risk_tier'] = scored_df['churn_risk_score'].apply(assign_risk_tier)
    
    # Primary Risk Driver Attribution for Explainability
    def identify_primary_risk_factor(row):
        drivers = {
            'Severe Inactivity': row['score_inactivity'],
            'Activity Dropoff': row['score_engagement_velocity'],
            'Billing & Support Friction': row['score_operational_friction'],
            'Low Feature Adoption / Downgrade': row['score_feature_adoption']
        }
        max_driver = max(drivers, key=drivers.get)
        if row['churn_risk_score'] < 25.0:
            return 'Healthy Customer / No Major Risk'
        return max_driver
        
    scored_df['primary_risk_driver'] = scored_df.apply(identify_primary_risk_factor, axis=1)
    
    # 6 Strategic Customer Segments
    def assign_strategic_segment(row):
        is_churn = row['churned'] == 1
        spend = row['monthly_spend']
        tenure = row['tenure_months']
        score = row['churn_risk_score']
        key_feat = row['key_feature_usage']
        days_inact = row['days_since_last_login']
        
        if is_churn:
            return 'Churned Customer'
        
        # High-Value At-Risk
        if spend >= 150.0 and score >= 60.0:
            return 'High-Value At-Risk'
        # New Customers At-Risk
        elif tenure <= 3 and (key_feat == 0 or score >= 45.0):
            return 'New Customers At-Risk'
        # Champions
        elif spend >= 120.0 and score <= 25.0 and key_feat == 1:
            return 'Champions'
        # Loyal Customers
        elif tenure >= 9 and score <= 40.0:
            return 'Loyal Customers'
        # Dormant Customers
        elif days_inact >= 25 or score >= 75.0:
            return 'Dormant Customers'
        # At-Risk Customers
        elif score >= 40.0:
            return 'At-Risk Customers'
        else:
            return 'Loyal Customers'
            
    scored_df['strategic_segment'] = scored_df.apply(assign_strategic_segment, axis=1)
    
    return scored_df

def run_scoring_pipeline(base_dir="."):
    cleaned_path = os.path.join(base_dir, "data", "cleaned_churn_data.csv")
    output_path = os.path.join(base_dir, "data", "customer_risk_scored.csv")
    db_path = os.path.join(base_dir, "data", "churn_lens.db")
    
    df = pd.read_csv(cleaned_path)
    scored_df = compute_risk_scores(df)
    scored_df.to_csv(output_path, index=False)
    
    # Update SQLite database with scored table
    conn = sqlite3.connect(db_path)
    scored_df.to_sql('customer_risk_scored', conn, if_exists='replace', index=False)
    conn.commit()
    conn.close()
    
    print(f"Risk scoring complete.")
    print(f"Scored records saved to: {output_path}")
    print("\nRisk Tier Breakdown:")
    print(scored_df['risk_tier'].value_counts(normalize=True).mul(100).round(1).astype(str) + '%')
    print("\nStrategic Segment Breakdown:")
    print(scored_df['strategic_segment'].value_counts())

if __name__ == "__main__":
    run_scoring_pipeline()
