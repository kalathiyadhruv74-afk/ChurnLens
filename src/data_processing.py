"""
ChurnLens - Data Generation and Preprocessing Pipeline
Generates a realistic 10,000+ customer dataset spanning 24 months with realistic
behavioral distributions, friction points, leading indicators, and root-cause churn mechanisms.
"""

import os
import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Set random seed for reproducible realistic data
np.random.seed(42)

def generate_churnlens_dataset(num_customers=10000, reference_date=datetime(2025, 12, 31)):
    """
    Generates a realistic customer subscription dataset with rich activity logs,
    operational friction signals, and true causal mechanisms.
    """
    customer_ids = [f"CUST-{10000 + i}" for i in range(num_customers)]
    
    # 1. Demographics & Acquisition
    ages = np.random.choice(
        np.concatenate([
            np.random.normal(28, 4, int(num_customers * 0.35)),
            np.random.normal(42, 6, int(num_customers * 0.45)),
            np.random.normal(56, 5, int(num_customers * 0.20))
        ]).astype(int),
        size=num_customers
    )
    ages = np.clip(ages, 21, 70)
    
    locations = np.random.choice(
        ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
        size=num_customers,
        p=[0.42, 0.28, 0.16, 0.08, 0.06]
    )
    
    segments = np.random.choice(
        ['Enterprise', 'Mid-Market', 'SMB', 'Startup/Individual'],
        size=num_customers,
        p=[0.12, 0.24, 0.44, 0.20]
    )
    
    channels = np.random.choice(
        ['Organic Search', 'Direct Sales', 'Referral', 'Paid Ads', 'Content / Webinar', 'Partner Affiliate'],
        size=num_customers,
        p=[0.25, 0.15, 0.20, 0.22, 0.10, 0.08]
    )
    
    # Subscription Plans aligned with segment
    plans = []
    monthly_spends = []
    for seg in segments:
        if seg == 'Enterprise':
            plan = np.random.choice(['Enterprise', 'Custom Tier'], p=[0.75, 0.25])
            spend = 249.0 if plan == 'Enterprise' else np.random.uniform(450.0, 850.0)
        elif seg == 'Mid-Market':
            plan = np.random.choice(['Pro', 'Enterprise'], p=[0.60, 0.40])
            spend = 79.0 if plan == 'Pro' else 249.0
        elif seg == 'SMB':
            plan = np.random.choice(['Basic', 'Pro'], p=[0.65, 0.35])
            spend = 29.0 if plan == 'Basic' else 79.0
        else: # Startup/Individual
            plan = np.random.choice(['Basic', 'Pro'], p=[0.85, 0.15])
            spend = 29.0 if plan == 'Basic' else 79.0
        plans.append(plan)
        monthly_spends.append(round(spend, 2))
        
    payment_methods = []
    for seg in segments:
        if seg == 'Enterprise':
            pm = np.random.choice(['Invoicing', 'ACH / Bank Transfer', 'Credit Card'], p=[0.60, 0.30, 0.10])
        elif seg == 'Mid-Market':
            pm = np.random.choice(['Credit Card', 'ACH / Bank Transfer', 'Invoicing'], p=[0.50, 0.35, 0.15])
        else:
            pm = np.random.choice(['Credit Card', 'PayPal', 'ACH / Bank Transfer'], p=[0.70, 0.25, 0.05])
        payment_methods.append(pm)
        
    # Signup Dates spread across 24 months (2024-01-01 to 2025-10-31)
    start_window = datetime(2024, 1, 1)
    end_window = datetime(2025, 10, 31)
    total_days = (end_window - start_window).days
    
    signup_dates = []
    for _ in range(num_customers):
        weight_day = int(np.random.beta(1.4, 1.0) * total_days)
        s_date = start_window + timedelta(days=weight_day)
        signup_dates.append(s_date)
        
    # Tenure calculation (months active relative to reference date)
    tenure_months = []
    for s_date in signup_dates:
        months = max(1, int((reference_date - s_date).days / 30.4375))
        tenure_months.append(months)
        
    # Activity & Behavioral Metrics Generation with Embedded Causal Drivers
    login_freqs = []
    days_since_last_logins = []
    sessions_30d = []
    avg_session_durations = []
    feature_counts = []
    key_feature_adoptions = []
    activity_change_pcts = []
    support_tickets_list = []
    unresolved_tickets_list = []
    complaints_list = []
    failed_payments_list = []
    plan_changes_list = []
    upgrades_list = []
    downgrades_list = []
    churned_list = []
    churn_dates = []
    churn_reasons = []
    
    for i in range(num_customers):
        seg = segments[i]
        channel = channels[i]
        plan = plans[i]
        pm = payment_methods[i]
        tenure = tenure_months[i]
        s_date = signup_dates[i]
        
        # Latent risk drivers (Ground Truth Mechanisms):
        # 1. Onboarding quality
        onboarding_quality = np.random.beta(2.5, 2.0)
        if channel in ['Organic Search', 'Direct Sales', 'Referral']:
            onboarding_quality += 0.15
        elif channel in ['Paid Ads', 'Partner Affiliate']:
            onboarding_quality -= 0.12
            
        onboarding_quality = np.clip(onboarding_quality, 0.05, 0.98)
        
        # 2. Key feature adoption (Automations, Team Sharing, API, Reports)
        key_feature_adopted = 1 if (onboarding_quality > 0.45 and np.random.rand() < 0.78) else 0
        total_features_used = int(np.random.poisson(14 * onboarding_quality) + 1)
        total_features_used = min(25, max(1, total_features_used))
        
        # 3. Operational friction
        p_failed = 0.06
        if pm == 'Credit Card':
            p_failed = 0.14
        elif pm == 'PayPal':
            p_failed = 0.18
        failed_pmt_count = np.random.choice([0, 1, 2, 3], p=[1 - p_failed, p_failed * 0.7, p_failed * 0.22, p_failed * 0.08])
        
        # Support friction & complaints
        support_tickets = int(np.random.poisson(2.2))
        unresolved = 0
        complaints = 0
        if support_tickets > 3:
            unresolved = np.random.choice([0, 1, 2, 3], p=[0.40, 0.35, 0.18, 0.07])
            if unresolved >= 1:
                complaints = np.random.choice([0, 1, 2], p=[0.5, 0.35, 0.15])
                
        # Plan changes
        downgraded = 1 if (onboarding_quality < 0.35 and tenure > 3 and np.random.rand() < 0.22) else 0
        upgraded = 1 if (onboarding_quality > 0.70 and tenure > 4 and np.random.rand() < 0.28) else 0
        plan_changes = downgraded + upgraded
        
        # Causal Churn Probability Calculation
        churn_logit = -2.6  # Base logit
        
        if not key_feature_adopted:
            churn_logit += 1.35
        if onboarding_quality < 0.3:
            churn_logit += 1.20
        if failed_pmt_count >= 1:
            churn_logit += 1.40 + (failed_pmt_count - 1) * 0.8
        if unresolved >= 2:
            churn_logit += 1.50
        if complaints >= 1:
            churn_logit += 1.10
        if downgraded == 1:
            churn_logit += 1.45
        if upgraded == 1:
            churn_logit -= 1.10
        if seg == 'Enterprise':
            churn_logit -= 0.65
        elif seg == 'Startup/Individual':
            churn_logit += 0.35
        if tenure <= 3:
            churn_logit += 0.75 # Early lifecycle cliff
        elif tenure >= 14:
            churn_logit -= 0.60 # Loyalty retention
            
        prob_churn = 1.0 / (1.0 + np.exp(-churn_logit))
        is_churned = 1 if np.random.rand() < prob_churn else 0
        
        # Activity metrics reflecting the trajectory
        if is_churned:
            days_inactive = int(np.clip(np.random.exponential(24) + 12, 4, 90))
            sessions = int(max(0, np.random.normal(5, 4)))
            session_dur = round(max(2.0, np.random.normal(9.5, 4.0)), 1)
            act_change = round(np.clip(np.random.normal(-58, 22), -100.0, 10.0), 1)
            
            # Root cause attribution
            if failed_pmt_count >= 2:
                cause = "Involuntary Billing / Payment Failure"
            elif tenure <= 3 and not key_feature_adopted:
                cause = "Onboarding Dropoff & Low Feature Adoption"
            elif unresolved >= 1 or complaints >= 1:
                cause = "Support Friction & Unresolved Issues"
            elif downgraded == 1:
                cause = "Plan Downgrade / Low Perceived ROI"
            elif seg == 'Startup/Individual' and total_features_used <= 3:
                cause = "Dormancy / No Team Engagement"
            else:
                cause = "Competitor Migration / Natural Attrition"
                
            churn_month_offset = min(tenure, max(1, int(np.random.uniform(1, tenure))))
            c_date = s_date + timedelta(days=int(churn_month_offset * 30.4375))
            if c_date > reference_date:
                c_date = reference_date - timedelta(days=int(np.random.uniform(2, 30)))
        else:
            days_inactive = int(np.clip(np.random.exponential(3.8), 0, 18))
            sessions = int(max(4, np.random.normal(28, 12)))
            session_dur = round(max(6.0, np.random.normal(24.0, 8.5)), 1)
            act_change = round(np.clip(np.random.normal(4.5, 18.0), -40.0, 95.0), 1)
            cause = "Active / Retained"
            c_date = None
            
        login_freqs.append("Daily" if days_inactive <= 2 and sessions >= 25 else
                           "Weekly (3-5x/wk)" if days_inactive <= 6 and sessions >= 12 else
                           "Occasional (1-2x/wk)" if days_inactive <= 14 else
                           "Rare (1-2x/mo)" if days_inactive <= 30 else "Dormant (30+ days)")
        days_since_last_logins.append(days_inactive)
        sessions_30d.append(sessions)
        avg_session_durations.append(session_dur)
        feature_counts.append(total_features_used)
        key_feature_adoptions.append(key_feature_adopted)
        activity_change_pcts.append(act_change)
        support_tickets_list.append(support_tickets)
        unresolved_tickets_list.append(unresolved)
        complaints_list.append(complaints)
        failed_payments_list.append(failed_pmt_count)
        plan_changes_list.append(plan_changes)
        upgrades_list.append(upgraded)
        downgrades_list.append(downgraded)
        churned_list.append(is_churned)
        churn_dates.append(c_date.strftime('%Y-%m-%d') if c_date else None)
        churn_reasons.append(cause)

    total_spends = [round(monthly_spends[i] * tenure_months[i], 2) for i in range(num_customers)]
    renewal_dates = [(signup_dates[i] + timedelta(days=365)).strftime('%Y-%m-%d') for i in range(num_customers)]
    signup_str_dates = [d.strftime('%Y-%m-%d') for d in signup_dates]
    last_login_str = [d.strftime('%Y-%m-%d') for d in [reference_date - timedelta(days=d) for d in days_since_last_logins]]

    df = pd.DataFrame({
        'customer_id': customer_ids,
        'signup_date': signup_str_dates,
        'age': ages,
        'location': locations,
        'customer_segment': segments,
        'subscription_plan': plans,
        'monthly_spend': monthly_spends,
        'total_spend': total_spends,
        'acquisition_channel': channels,
        'payment_method': payment_methods,
        'subscription_start_date': signup_str_dates,
        'renewal_date': renewal_dates,
        'tenure_months': tenure_months,
        'plan_changes': plan_changes_list,
        'upgrades': upgrades_list,
        'downgrades': downgrades_list,
        'last_login_date': last_login_str,
        'login_frequency': login_freqs,
        'days_since_last_login': days_since_last_logins,
        'sessions_last_30_days': sessions_30d,
        'average_session_duration': avg_session_durations,
        'feature_usage_count': feature_counts,
        'key_feature_usage': key_feature_adoptions,
        'activity_change_pct': activity_change_pcts,
        'support_tickets': support_tickets_list,
        'unresolved_tickets': unresolved_tickets_list,
        'complaints': complaints_list,
        'failed_payments': failed_payments_list,
        'churned': churned_list,
        'churn_date': churn_dates,
        'churn_reason_category': churn_reasons
    })
    
    return df

def save_and_export_all(df, base_dir="."):
    """
    Saves raw & cleaned CSVs and creates relational SQLite database with tables & views.
    """
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    
    raw_path = os.path.join(data_dir, "raw_churn_data.csv")
    cleaned_path = os.path.join(data_dir, "cleaned_churn_data.csv")
    db_path = os.path.join(data_dir, "churn_lens.db")
    
    df.to_csv(raw_path, index=False)
    
    # Feature engineering for cleaned data
    df_clean = df.copy()
    df_clean['signup_year_month'] = pd.to_datetime(df_clean['signup_date']).dt.to_period('M').astype(str)
    df_clean['is_high_value'] = (df_clean['monthly_spend'] >= 150).astype(int)
    df_clean['is_early_stage'] = (df_clean['tenure_months'] <= 3).astype(int)
    df_clean['has_support_friction'] = ((df_clean['unresolved_tickets'] > 0) | (df_clean['complaints'] > 0)).astype(int)
    df_clean['has_billing_issue'] = (df_clean['failed_payments'] > 0).astype(int)
    df_clean['has_inactivity_warning'] = (df_clean['days_since_last_login'] >= 14).astype(int)
    
    df_clean.to_csv(cleaned_path, index=False)
    
    # Build relational tables in SQLite
    conn = sqlite3.connect(db_path)
    
    # 1. Dim Customers
    dim_customers = df_clean[[
        'customer_id', 'age', 'location', 'customer_segment', 
        'acquisition_channel', 'payment_method'
    ]]
    dim_customers.to_sql('dim_customers', conn, if_exists='replace', index=False)
    
    # 2. Fact Subscriptions
    fact_subscriptions = df_clean[[
        'customer_id', 'subscription_plan', 'subscription_start_date', 
        'renewal_date', 'tenure_months', 'monthly_spend', 'total_spend',
        'plan_changes', 'upgrades', 'downgrades', 'churned', 'churn_date', 'churn_reason_category'
    ]]
    fact_subscriptions.to_sql('fact_subscriptions', conn, if_exists='replace', index=False)
    
    # 3. Fact Activity Metrics
    fact_activity = df_clean[[
        'customer_id', 'last_login_date', 'login_frequency', 'days_since_last_login',
        'sessions_last_30_days', 'average_session_duration', 'feature_usage_count',
        'key_feature_usage', 'activity_change_pct'
    ]]
    fact_activity.to_sql('fact_activity_metrics', conn, if_exists='replace', index=False)
    
    # 4. Fact Operational Friction (Support & Billing)
    fact_friction = df_clean[[
        'customer_id', 'support_tickets', 'unresolved_tickets', 'complaints', 'failed_payments'
    ]]
    fact_friction.to_sql('fact_operational_friction', conn, if_exists='replace', index=False)
    
    # Also save the full flat denormalized table for queries
    df_clean.to_sql('customer_churn_analytics', conn, if_exists='replace', index=False)
    
    conn.commit()
    conn.close()
    
    print(f"Data generation complete.")
    print(f"Total customers: {len(df):,}")
    print(f"Overall Churn Rate: {df['churned'].mean():.2%}")
    print(f"Saved: {raw_path}")
    print(f"Saved: {cleaned_path}")
    print(f"Populated SQLite: {db_path}")

if __name__ == "__main__":
    df = generate_churnlens_dataset(num_customers=10000)
    save_and_export_all(df)
