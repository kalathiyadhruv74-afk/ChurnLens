-- ====================================================================
-- ChurnLens - Enterprise SQL Customer Churn & Retention Analytics
-- Comprehensive Business Analysis Queries
-- ====================================================================

-- --------------------------------------------------------------------
-- QUERY 1: Overall Churn & Key Performance Metrics
-- --------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_customers,
    SUM(CASE WHEN churned = 0 THEN 1 ELSE 0 END) AS active_customers,
    SUM(CASE WHEN churned = 1 THEN 1 ELSE 0 END) AS churned_customers,
    ROUND(100.0 * AVG(churned), 2) AS overall_churn_rate_pct,
    ROUND(SUM(monthly_spend), 2) AS total_potential_mrr,
    ROUND(SUM(CASE WHEN churned = 1 THEN monthly_spend ELSE 0 END), 2) AS lost_mrr,
    ROUND(100.0 * SUM(CASE WHEN churned = 1 THEN monthly_spend ELSE 0 END) / SUM(monthly_spend), 2) AS revenue_churn_rate_pct,
    ROUND(AVG(tenure_months), 1) AS avg_customer_tenure_months,
    ROUND(AVG(CASE WHEN churned = 1 THEN tenure_months ELSE NULL END), 1) AS avg_tenure_at_churn_months
FROM v_churn_lens_master;


-- --------------------------------------------------------------------
-- QUERY 2: Month-over-Month Churn Dynamics & Rolling 3-Month Trend
-- --------------------------------------------------------------------
WITH monthly_churn_summary AS (
    SELECT 
        SUBSTR(churn_date, 1, 7) AS churn_month,
        COUNT(*) AS monthly_churn_count,
        ROUND(SUM(monthly_spend), 2) AS monthly_mrr_lost,
        ROUND(AVG(tenure_months), 1) AS avg_tenure_lost
    FROM v_churn_lens_master
    WHERE churned = 1 AND churn_date IS NOT NULL
    GROUP BY SUBSTR(churn_date, 1, 7)
)
SELECT 
    churn_month,
    monthly_churn_count,
    monthly_mrr_lost,
    avg_tenure_lost,
    LAG(monthly_churn_count, 1) OVER (ORDER BY churn_month) AS prev_month_churn_count,
    ROUND(
        100.0 * (monthly_churn_count - LAG(monthly_churn_count, 1) OVER (ORDER BY churn_month)) 
        / NULLIF(LAG(monthly_churn_count, 1) OVER (ORDER BY churn_month), 0), 2
    ) AS mom_churn_count_growth_pct,
    ROUND(
        AVG(monthly_churn_count) OVER (
            ORDER BY churn_month 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 1
    ) AS rolling_3mo_avg_churn_count
FROM monthly_churn_summary
ORDER BY churn_month;


-- --------------------------------------------------------------------
-- QUERY 3: Customer Segment Retention & Revenue Exposure
-- --------------------------------------------------------------------
SELECT 
    c.customer_segment,
    COUNT(*) AS total_customers,
    SUM(s.churned) AS churned_customers,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    ROUND(AVG(s.monthly_spend), 2) AS avg_monthly_spend,
    ROUND(SUM(s.monthly_spend), 2) AS total_segment_mrr,
    ROUND(SUM(CASE WHEN s.churned = 1 THEN s.monthly_spend ELSE 0 END), 2) AS lost_segment_mrr,
    ROUND(100.0 * SUM(CASE WHEN s.churned = 1 THEN s.monthly_spend ELSE 0 END) / SUM(s.monthly_spend), 2) AS segment_revenue_churn_pct,
    ROUND(AVG(s.tenure_months), 1) AS avg_tenure_months
FROM dim_customers c
JOIN fact_subscriptions s ON c.customer_id = s.customer_id
GROUP BY c.customer_segment
ORDER BY lost_segment_mrr DESC;


-- --------------------------------------------------------------------
-- QUERY 4: Customer Lifecycle & Tenure Cliff Analysis
-- --------------------------------------------------------------------
SELECT 
    CASE 
        WHEN s.tenure_months <= 3 THEN '01. Onboarding Cliff (1-3 Mo)'
        WHEN s.tenure_months <= 6 THEN '02. Early Stage (4-6 Mo)'
        WHEN s.tenure_months <= 12 THEN '03. Mid Lifecycle (7-12 Mo)'
        WHEN s.tenure_months <= 18 THEN '04. Mature Customer (13-18 Mo)'
        ELSE '05. Brand Loyal (19-24 Mo)'
    END AS tenure_bracket,
    COUNT(*) AS total_customers,
    SUM(s.churned) AS churned_count,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    ROUND(SUM(CASE WHEN s.churned = 1 THEN s.monthly_spend ELSE 0 END), 2) AS lost_mrr,
    ROUND(AVG(a.sessions_last_30_days), 1) AS avg_sessions_30d,
    ROUND(AVG(a.key_feature_usage) * 100, 1) AS key_feature_adoption_pct
FROM fact_subscriptions s
JOIN fact_activity_metrics a ON s.customer_id = a.customer_id
GROUP BY tenure_bracket
ORDER BY tenure_bracket;


-- --------------------------------------------------------------------
-- QUERY 5: Subscription Plan Performance & Downgrade Churn Hazard
-- --------------------------------------------------------------------
SELECT 
    s.subscription_plan,
    COUNT(*) AS total_customers,
    SUM(s.churned) AS churned_count,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    SUM(s.downgrades) AS total_downgrades,
    ROUND(100.0 * SUM(CASE WHEN s.downgrades > 0 THEN s.churned ELSE 0 END) / NULLIF(SUM(CASE WHEN s.downgrades > 0 THEN 1 ELSE 0 END), 0), 2) AS churn_rate_among_downgraded_pct,
    ROUND(100.0 * SUM(CASE WHEN s.downgrades = 0 THEN s.churned ELSE 0 END) / NULLIF(SUM(CASE WHEN s.downgrades = 0 THEN 1 ELSE 0 END), 0), 2) AS churn_rate_non_downgraded_pct,
    ROUND(SUM(s.monthly_spend), 2) AS plan_total_mrr
FROM fact_subscriptions s
GROUP BY s.subscription_plan
ORDER BY plan_total_mrr DESC;


-- --------------------------------------------------------------------
-- QUERY 6: Acquisition Channel Retention Quality & LTV
-- --------------------------------------------------------------------
SELECT 
    c.acquisition_channel,
    COUNT(*) AS total_acquired,
    SUM(s.churned) AS churned_customers,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    ROUND(AVG(s.total_spend), 2) AS avg_customer_ltv,
    ROUND(AVG(s.monthly_spend), 2) AS avg_arpu,
    ROUND(AVG(a.key_feature_usage) * 100, 1) AS onboarding_feature_adoption_pct,
    ROUND(AVG(a.days_since_last_login), 1) AS avg_inactivity_days
FROM dim_customers c
JOIN fact_subscriptions s ON c.customer_id = s.customer_id
JOIN fact_activity_metrics a ON c.customer_id = a.customer_id
GROUP BY c.acquisition_channel
ORDER BY churn_rate_pct ASC;


-- --------------------------------------------------------------------
-- QUERY 7: Inactivity & Days Since Last Login Risk Buckets
-- --------------------------------------------------------------------
SELECT 
    CASE 
        WHEN a.days_since_last_login <= 3 THEN '01. Active (0-3 Days)'
        WHEN a.days_since_last_login <= 7 THEN '02. Mild Inactivity (4-7 Days)'
        WHEN a.days_since_last_login <= 14 THEN '03. Warning Zone (8-14 Days)'
        WHEN a.days_since_last_login <= 30 THEN '04. High Danger (15-30 Days)'
        ELSE '05. Severe Dormancy (31+ Days)'
    END AS inactivity_tier,
    COUNT(*) AS total_customers,
    SUM(s.churned) AS churned_count,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    ROUND(AVG(a.sessions_last_30_days), 1) AS avg_monthly_sessions,
    ROUND(AVG(a.activity_change_pct), 1) AS avg_activity_velocity_pct
FROM fact_activity_metrics a
JOIN fact_subscriptions s ON a.customer_id = s.customer_id
GROUP BY inactivity_tier
ORDER BY inactivity_tier;


-- --------------------------------------------------------------------
-- QUERY 8: Core Feature Adoption Impact on Retention
-- --------------------------------------------------------------------
SELECT 
    CASE WHEN a.key_feature_usage = 1 THEN 'Adopted Core Features' ELSE 'No Core Feature Adoption' END AS adoption_status,
    COUNT(*) AS customer_count,
    SUM(s.churned) AS churned_count,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    ROUND(AVG(s.tenure_months), 1) AS avg_tenure_months,
    ROUND(AVG(s.total_spend), 2) AS avg_customer_lifetime_value
FROM fact_activity_metrics a
JOIN fact_subscriptions s ON a.customer_id = s.customer_id
GROUP BY key_feature_usage;


-- --------------------------------------------------------------------
-- QUERY 9: Support Tickets, Unresolved Issues & Complaints Hazard
-- --------------------------------------------------------------------
SELECT 
    CASE 
        WHEN f.support_tickets = 0 THEN '0 Tickets (Zero Friction)'
        WHEN f.support_tickets <= 2 THEN '1-2 Tickets (Normal Inquiry)'
        WHEN f.support_tickets <= 4 THEN '3-4 Tickets (Moderate Needs)'
        ELSE '5+ Tickets (High Friction)'
    END AS ticket_volume_group,
    COUNT(*) AS customer_count,
    SUM(s.churned) AS churned_count,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    ROUND(100.0 * SUM(CASE WHEN f.unresolved_tickets > 0 THEN s.churned ELSE 0 END) / NULLIF(SUM(CASE WHEN f.unresolved_tickets > 0 THEN 1 ELSE 0 END), 0), 2) AS churn_rate_with_unresolved_pct,
    ROUND(100.0 * SUM(CASE WHEN f.complaints > 0 THEN s.churned ELSE 0 END) / NULLIF(SUM(CASE WHEN f.complaints > 0 THEN 1 ELSE 0 END), 0), 2) AS churn_rate_with_complaints_pct
FROM fact_operational_friction f
JOIN fact_subscriptions s ON f.customer_id = s.customer_id
GROUP BY ticket_volume_group
ORDER BY ticket_volume_group;


-- --------------------------------------------------------------------
-- QUERY 10: Involuntary Churn & Payment Failure Cascade
-- --------------------------------------------------------------------
SELECT 
    f.failed_payments AS failed_payment_count,
    COUNT(*) AS total_customers,
    SUM(s.churned) AS churned_count,
    ROUND(100.0 * AVG(s.churned), 2) AS churn_rate_pct,
    ROUND(SUM(s.monthly_spend), 2) AS total_mrr_impact,
    ROUND(SUM(CASE WHEN s.churned = 1 THEN s.monthly_spend ELSE 0 END), 2) AS lost_mrr_impact
FROM fact_operational_friction f
JOIN fact_subscriptions s ON f.customer_id = s.customer_id
GROUP BY f.failed_payments
ORDER BY f.failed_payments;


-- --------------------------------------------------------------------
-- QUERY 11: High-Value Customers Currently at Risk (Action Queue)
-- --------------------------------------------------------------------
WITH high_value_risk_queue AS (
    SELECT 
        v.customer_id,
        v.customer_segment,
        v.subscription_plan,
        v.monthly_spend,
        v.tenure_months,
        v.days_since_last_login,
        v.activity_change_pct,
        v.unresolved_tickets,
        v.failed_payments,
        v.key_feature_usage,
        (
            CASE WHEN v.days_since_last_login >= 14 THEN 30 ELSE 0 END +
            CASE WHEN v.activity_change_pct <= -40 THEN 25 ELSE 0 END +
            CASE WHEN v.failed_payments >= 1 THEN 25 ELSE 0 END +
            CASE WHEN v.unresolved_tickets >= 1 THEN 20 ELSE 0 END +
            CASE WHEN v.key_feature_usage = 0 THEN 15 ELSE 0 END
        ) AS preliminary_friction_score
    FROM v_churn_lens_master v
    WHERE v.churned = 0 -- currently active
      AND v.monthly_spend >= 150 -- high-value
)
SELECT 
    customer_id,
    customer_segment,
    subscription_plan,
    monthly_spend,
    tenure_months,
    days_since_last_login,
    activity_change_pct,
    unresolved_tickets,
    failed_payments,
    preliminary_friction_score,
    RANK() OVER (ORDER BY preliminary_friction_score DESC, monthly_spend DESC) AS risk_priority_rank
FROM high_value_risk_queue
WHERE preliminary_friction_score >= 40
ORDER BY risk_priority_rank
LIMIT 25;


-- --------------------------------------------------------------------
-- QUERY 12: Cohort Signup Month Retention Matrix
-- --------------------------------------------------------------------
WITH cohort_base AS (
    SELECT 
        SUBSTR(subscription_start_date, 1, 7) AS cohort_month,
        COUNT(*) AS cohort_size,
        SUM(CASE WHEN churned = 0 THEN 1 ELSE 0 END) AS active_now,
        SUM(churned) AS churned_total,
        ROUND(100.0 * SUM(CASE WHEN churned = 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS current_retention_rate_pct,
        ROUND(AVG(tenure_months), 1) AS avg_tenure,
        ROUND(SUM(monthly_spend), 2) AS cohort_mrr
    FROM fact_subscriptions
    GROUP BY SUBSTR(subscription_start_date, 1, 7)
)
SELECT 
    cohort_month,
    cohort_size,
    active_now,
    churned_total,
    current_retention_rate_pct,
    avg_tenure,
    cohort_mrr
FROM cohort_base
ORDER BY cohort_month;


-- --------------------------------------------------------------------
-- QUERY 13: Leading Warning Indicators Ranking Table
-- --------------------------------------------------------------------
SELECT 
    'Inactivity >= 14 Days' AS warning_indicator,
    COUNT(*) AS total_flagged_customers,
    SUM(churned) AS churners_flagged,
    ROUND(100.0 * AVG(churned), 2) AS churn_rate_when_flagged_pct
FROM v_churn_lens_master WHERE days_since_last_login >= 14
UNION ALL
SELECT 
    'Activity Drop > 40%',
    COUNT(*),
    SUM(churned),
    ROUND(100.0 * AVG(churned), 2)
FROM v_churn_lens_master WHERE activity_change_pct <= -40
UNION ALL
SELECT 
    'Failed Payment >= 1',
    COUNT(*),
    SUM(churned),
    ROUND(100.0 * AVG(churned), 2)
FROM v_churn_lens_master WHERE failed_payments >= 1
UNION ALL
SELECT 
    'Plan Downgraded',
    COUNT(*),
    SUM(churned),
    ROUND(100.0 * AVG(churned), 2)
FROM v_churn_lens_master WHERE downgrades > 0
UNION ALL
SELECT 
    'Unresolved Support Ticket >= 1',
    COUNT(*),
    SUM(churned),
    ROUND(100.0 * AVG(churned), 2)
FROM v_churn_lens_master WHERE unresolved_tickets >= 1
UNION ALL
SELECT 
    'Core Feature Not Adopted',
    COUNT(*),
    SUM(churned),
    ROUND(100.0 * AVG(churned), 2)
FROM v_churn_lens_master WHERE key_feature_usage = 0
ORDER BY churn_rate_when_flagged_pct DESC;
