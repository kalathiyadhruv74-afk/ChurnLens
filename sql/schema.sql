-- ====================================================================
-- ChurnLens Database Schema (DDL)
-- Enterprise Subscription & Customer Retention Intelligence Architecture
-- ====================================================================

-- 1. Dimension Table: Customers (Demographics & Channels)
CREATE TABLE IF NOT EXISTS dim_customers (
    customer_id VARCHAR(32) PRIMARY KEY,
    age INT,
    location VARCHAR(64),
    customer_segment VARCHAR(32),
    acquisition_channel VARCHAR(64),
    payment_method VARCHAR(32)
);

CREATE INDEX IF NOT EXISTS idx_dim_cust_segment ON dim_customers(customer_segment);
CREATE INDEX IF NOT EXISTS idx_dim_cust_channel ON dim_customers(acquisition_channel);

-- 2. Fact Table: Subscriptions & Lifecycle
CREATE TABLE IF NOT EXISTS fact_subscriptions (
    customer_id VARCHAR(32) PRIMARY KEY,
    subscription_plan VARCHAR(32),
    subscription_start_date DATE,
    renewal_date DATE,
    tenure_months INT,
    monthly_spend DECIMAL(10,2),
    total_spend DECIMAL(10,2),
    plan_changes INT,
    upgrades INT,
    downgrades INT,
    churned INT,
    churn_date DATE,
    churn_reason_category VARCHAR(128),
    FOREIGN KEY (customer_id) REFERENCES dim_customers(customer_id)
);

CREATE INDEX IF NOT EXISTS idx_sub_churned ON fact_subscriptions(churned);
CREATE INDEX IF NOT EXISTS idx_sub_plan ON fact_subscriptions(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_sub_tenure ON fact_subscriptions(tenure_months);
CREATE INDEX IF NOT EXISTS idx_sub_start ON fact_subscriptions(subscription_start_date);

-- 3. Fact Table: Product Activity Metrics
CREATE TABLE IF NOT EXISTS fact_activity_metrics (
    customer_id VARCHAR(32) PRIMARY KEY,
    last_login_date DATE,
    login_frequency VARCHAR(32),
    days_since_last_login INT,
    sessions_last_30_days INT,
    average_session_duration DECIMAL(6,2),
    feature_usage_count INT,
    key_feature_usage INT,
    activity_change_pct DECIMAL(6,2),
    FOREIGN KEY (customer_id) REFERENCES dim_customers(customer_id)
);

CREATE INDEX IF NOT EXISTS idx_act_inactivity ON fact_activity_metrics(days_since_last_login);
CREATE INDEX IF NOT EXISTS idx_act_sessions ON fact_activity_metrics(sessions_last_30_days);
CREATE INDEX IF NOT EXISTS idx_act_key_feature ON fact_activity_metrics(key_feature_usage);

-- 4. Fact Table: Operational Friction (Support & Billing)
CREATE TABLE IF NOT EXISTS fact_operational_friction (
    customer_id VARCHAR(32) PRIMARY KEY,
    support_tickets INT,
    unresolved_tickets INT,
    complaints INT,
    failed_payments INT,
    FOREIGN KEY (customer_id) REFERENCES dim_customers(customer_id)
);

CREATE INDEX IF NOT EXISTS idx_fric_failed_pmt ON fact_operational_friction(failed_payments);
CREATE INDEX IF NOT EXISTS idx_fric_unresolved ON fact_operational_friction(unresolved_tickets);

-- 5. Analytical View: Comprehensive Denormalized Customer Churn View
CREATE VIEW IF NOT EXISTS v_churn_lens_master AS
SELECT 
    c.customer_id,
    c.age,
    c.location,
    c.customer_segment,
    c.acquisition_channel,
    c.payment_method,
    s.subscription_plan,
    s.subscription_start_date,
    s.renewal_date,
    s.tenure_months,
    s.monthly_spend,
    s.total_spend,
    s.plan_changes,
    s.upgrades,
    s.downgrades,
    s.churned,
    s.churn_date,
    s.churn_reason_category,
    a.last_login_date,
    a.login_frequency,
    a.days_since_last_login,
    a.sessions_last_30_days,
    a.average_session_duration,
    a.feature_usage_count,
    a.key_feature_usage,
    a.activity_change_pct,
    f.support_tickets,
    f.unresolved_tickets,
    f.complaints,
    f.failed_payments,
    CASE WHEN s.monthly_spend >= 150 THEN 1 ELSE 0 END AS is_high_value,
    CASE WHEN s.tenure_months <= 3 THEN 1 ELSE 0 END AS is_early_stage,
    CASE WHEN (f.unresolved_tickets > 0 OR f.complaints > 0) THEN 1 ELSE 0 END AS has_support_friction,
    CASE WHEN f.failed_payments > 0 THEN 1 ELSE 0 END AS has_billing_hazard
FROM dim_customers c
JOIN fact_subscriptions s ON c.customer_id = s.customer_id
JOIN fact_activity_metrics a ON c.customer_id = a.customer_id
JOIN fact_operational_friction f ON c.customer_id = f.customer_id;
