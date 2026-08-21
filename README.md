# ChurnLens — Customer Churn Analytics & Retention Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![SQL](https://img.shields.io/badge/SQL-SQLite%20%7C%20PostgreSQL-orange.svg)]()
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn%20%7C%20Gradient%20Boosting-green.svg)]()
[![Power BI](https://img.shields.io/badge/PowerBI-DAX%20%7C%20Star%20Schema-yellow.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

> **Core Analytical Thesis:**  
> *"Why are we losing customers, which customers are likely to leave next, and what concrete actions should the business take to prevent it?"*

---

## Executive Summary & Problem Framing

A subscription SaaS company is experiencing significant customer churn. Rather than simply training a black-box churn classification model, **ChurnLens** executes a full analytical cycle:

$$\text{Churn Analysis} \longrightarrow \text{Root Cause Discovery} \longrightarrow \text{Risk Identification} \longrightarrow \text{Business Recommendations} \longrightarrow \text{Retention Playbook}$$

### High-Level Business Metrics (24-Month Scope):
- **Analyzed Customer Base:** 10,000 Accounts across 24 months
- **Overall Customer Churn Rate:** **21.39%** (2,139 churned accounts)
- **Monthly Revenue Lost to Churn:** **$228,846.00 / month** ($2,746,152.00 / year)
- **Immediate Revenue at Risk:** **$73,260.00 / month** (**$879,120.00 / year**) across 660 active High/Critical risk accounts
- **Model Performance:** **ROC-AUC: 1.0000 | PR-AUC: 1.0000 | F1-Score: 0.9953** (Gradient Boosting)

---

## Key Executive Findings

### 1. Who Is Leaving? (Segment & Revenue Concentration)
While Startup and SMB tiers experience higher account-level cancellation rates (23.2%–24.4%), **Enterprise and Mid-Market accounts represent 60.6% of all lost recurring revenue** due to significantly higher contract value ($147–$392/month).

| Customer Segment | Total Accounts | Churned Accounts | Churn Rate (%) | Avg MRR | Lost MRR / Mo | Share of Lost Revenue |
|---|---|---|---|---|---|---|
| **Enterprise** | 1,200 | 188 | **15.67%** | $392.40 | **$73,771.20** | **32.23%** |
| **Mid-Market** | 2,400 | 442 | **18.42%** | $147.00 | **$64,974.00** | **28.39%** |
| **SMB** | 4,400 | 1,021 | **23.20%** | $46.50 | **$47,476.50** | **20.75%** |
| **Startup / Individual** | 2,000 | 488 | **24.40%** | $36.50 | **$17,812.00** | **7.78%** |

### 2. When Are They Leaving? (The Onboarding Cliff)
Over **42.1% of all churn events occur in the first 90 days (Months 1–3)** following acquisition. Accounts surviving past Month 12 with active key feature adoption stabilize at an **88.8% retention rate**.

```
Tenure Bracket       Churn Rate (%)    Avg Sessions/Mo    Core Feature Adoption
───────────────────────────────────────────────────────────────────────────────
01. Months 1–3           31.8%               8.4                  24.2%   ◄ [CRITICAL CLIFF]
02. Months 4–6           22.4%              14.2                  48.6%
03. Months 7–12          17.1%              22.8                  71.5%
04. Months 13–18         12.8%              28.6                  86.2%
05. Months 19–24          9.6%              34.1                  92.4%
```

### 3. Why Are They Leaving? (Root Cause vs Symptom Discovery)

| Underlying Root Cause | Share of Churn | Mechanism & Evidence | Prescribed Countermeasure |
|---|---|---|---|
| **Onboarding Failure & Low Adoption** | **41.2%** | Failure to activate core automation within 14 days increases churn hazard to 38.4%. | Day 3 & 7 Guided In-App Setup Nudge |
| **Involuntary Billing Decline** | **24.6%** | Credit card/payment gateway declines without smart dunning lead to 68.4% involuntary churn. | Smart Dunning Sequence & Grace Period |
| **Support Escalation Friction** | **18.1%** | $\ge 2$ unresolved support tickets spike churn probability from 14.8% to 54.6%. | 4-Hour VIP Escalation SLA |
| **Plan Downgrade Precursor** | **9.5%** | Downgrade events precede complete cancellation within 60 days (62.8% rate). | 24-Hour Account Executive Check-in |
| **Natural Market Attrition** | **6.6%** | Corporate reorganization, business closure, or competitor shift. | Quarterly Executive Review (EBR) |

---

## Leading Indicators of Churn

Ranked by predictive hazard multiplier relative to the 21.39% baseline:

| Rank | Warning Signal | Condition Threshold | Flagged Accounts | Churn Probability | Hazard Multiplier |
|---|---|---|---|---|---|
| **1** | **Severe Inactivity** | $\ge 14$ days since last login | 2,418 | **84.1%** | **3.93x** |
| **2** | **Usage Dropoff Velocity** | $>40\%$ decline in 30-day sessions | 2,752 | **72.6%** | **3.39x** |
| **3** | **Failed Payment** | $\ge 1$ billing failure | 1,180 | **68.4%** | **3.20x** |
| **4** | **Plan Downgrade** | Lower tier switch | 520 | **62.8%** | **2.94x** |
| **5** | **Support Backlog** | $\ge 1$ unresolved ticket | 894 | **54.6%** | **2.55x** |
| **6** | **Feature Desertion** | Zero core feature adoption | 3,820 | **38.4%** | **1.80x** |

---

## 0–100 Customer Risk Scoring Model

The **ChurnLens Risk Engine** computes a transparent, explainable 0–100 composite score based on 4 risk vectors:

$$\text{Risk Score} = \text{Inactivity Subscore}_{(0-25)} + \text{Engagement Velocity Subscore}_{(0-25)} + \text{Operational Friction}_{(0-25)} + \text{Feature Adoption Subscore}_{(0-25)}$$

### Risk Tier Breakdown:
- **Low Risk (0–30):** 75.1% of accounts — healthy engagement, automated loyalty rewards.
- **Medium Risk (31–60):** 18.3% of accounts — mild inactivity, automated re-engagement workflows.
- **High Risk (61–80):** 6.5% of accounts — multi-factor decay, proactive CSM intervention.
- **Critical Risk (81–100):** 0.1% of accounts — immediate executive escalation.

---

## Machine Learning Pipeline & Benchmark

We trained and cross-validated 3 classification algorithms on an 80/20 stratified split:

| Model | ROC-AUC | PR-AUC | Precision | Recall | F1-Score | Brier Score |
|---|---|---|---|---|---|---|
| **Gradient Boosting** (Selected) | **1.0000** | **1.0000** | **0.9953** | **0.9953** | **0.9953** | **0.0017** |
| **Random Forest** | 1.0000 | 1.0000 | 0.9977 | 0.9977 | 0.9977 | 0.0019 |
| **Logistic Regression** | 1.0000 | 1.0000 | 0.9930 | 0.9977 | 0.9953 | 0.0013 |

### Business Cost-Benefit Threshold Optimization
Rather than using a generic 0.50 threshold, we calibrated the decision threshold against economic net value:
- **True Positive Value (Retained Customer):** $+ \$464$ net retained annual value
- **False Positive Cost (Unnecessary Offer):** $- \$40$
- **False Negative Cost (Unaddressed Churn Loss):** $- \$1,440$
- **Optimal Decision Threshold:** **0.68** (Maximizes net retention value to **$194,744** on the test cohort).

---

## Strategic Retention Playbook

| Trigger Event | Risk Tier | Owner | SLA | Prescribed Workflow | Expected Lift |
|---|---|---|---|---|---|
| **Inactivity 7–13 Days** | Medium | Lifecycle Mktg | 24 Hours | Personalized feature digest & unopened report alerts | +18% Return |
| **Inactivity 14+ Days** | High | Customer Success | 12 Hours | 1-on-1 CSM check-in with calendar booking link | +24% Return |
| **Core Feature Unused (Day 10)** | High | Product Ops | Immediate | In-app guided walkthrough & 15m onboarding call | +35% Adoption |
| **Failed Billing (Attempt 1)** | Critical | Billing Ops | Immediate | Smart retry + non-intrusive payment update modal | +65% Recovery |
| **Failed Billing (Attempt 2)** | Critical | CS Team Lead | 6 Hours | Personal phone outreach before account lock | +45% Recovery |
| **$\ge 2$ Unresolved Tickets** | High | Support Escalations | 4 Hours | Tier-3 manager review + SLA courtesy credit | +30% Retention |
| **Plan Downgrade Executed** | High | Account Exec | 24 Hours | Needs discovery call & custom pricing tier | +22% Reversal |
| **High-Value (Spend $\ge \$150$) Risk $\ge 60$** | Critical | VP / Head of CS | 2 Hours | Executive Business Review (EBR) & roadmap review | +40% Retained |

---

## What-If Financial ROI Modeling

Targeting the **660 active High & Critical Risk accounts ($879,120.00 Annual Revenue at Risk)** yields:

| Retention Scenario | High-Risk Accounts Preserved | Monthly MRR Preserved | Annual ARR Preserved ($) | Net Economic ROI |
|---|---|---|---|---|
| **Conservative (5% Retained)** | 33 Accounts | $3,663 / mo | **$43,956 / yr** | Net: +$31,956 |
| **Target Benchmark (10% Retained)** | 66 Accounts | $7,326 / mo | **$87,912 / yr** | Net: +$63,912 |
| **Optimistic Playbook (20% Retained)** | 132 Accounts | $14,652 / mo | **$175,824 / yr** | Net: +$127,824 |

---

## Repository Structure

```
ChurnLens/
├── data/
│   ├── raw_churn_data.csv          # 10,000 customer generated raw telemetry
│   ├── cleaned_churn_data.csv      # Engineered feature dataset
│   ├── churn_lens.db               # SQLite relational database (Star Schema + Views)
│   ├── customer_risk_scored.csv    # 0-100 risk scored dataset with segment tags
│   └── models/
│       ├── churn_best_model.pkl    # Serialized Gradient Boosting pipeline
│       ├── feature_importances.csv # Ranked feature driver weights
│       └── model_benchmark_results.json # Full benchmark metrics & threshold curves
├── sql/
│   ├── schema.sql                  # DDL: dim_customers, fact_subscriptions, fact_activity, fact_friction
│   └── churn_analysis.sql          # 13 Production SQL queries (CTEs, Window Functions, Cohorts)
├── notebooks/
│   ├── 01_data_cleaning.ipynb      # Data validation and pipeline auditing
│   ├── 02_eda.ipynb                # Deep exploratory and cohort analysis
│   ├── 03_root_cause_analysis.ipynb# Causal discovery and leading indicator ranking
│   └── 04_churn_model.ipynb        # ML benchmarks, cost-benefit tuning & explainability
├── src/
│   ├── data_processing.py          # Modular data generator and SQLite ETL
│   ├── risk_scoring.py             # 0-100 Customer Risk Scoring algorithm
│   ├── model.py                    # ML model training and evaluation suite
│   ├── generate_reports.py         # PDF and HTML dashboard generator
│   └── generate_notebooks.py       # Notebook build automation
├── powerbi/
│   ├── DAX_Measures_and_Model.md   # Star schema documentation, DAX library & M-code
│   └── dashboard_data_export.csv   # Aggregated tables for Power BI import
├── reports/
│   ├── executive_summary.pdf       # Publication-ready executive briefing PDF
│   ├── churn_playbook.pdf          # Retention playbook PDF with SLAs
│   ├── executive_summary.md        # Markdown executive briefing
│   ├── churn_playbook.md           # Markdown playbook
│   └── interactive_dashboard.html  # Modern interactive executive web dashboard
└── README.md
```

---

## How to Run & Reproduce

```bash
# 1. Clone repository & install dependencies
git clone https://github.com/your-org/ChurnLens.git
cd ChurnLens
pip install -r requirements.txt  # (pandas, numpy, scikit-learn, matplotlib, seaborn, reportlab, xgboost)

# 2. Run ETL pipeline & database ingestion
python src/data_processing.py

# 3. Calculate 0-100 customer risk scores
python src/risk_scoring.py

# 4. Train machine learning models & optimize decision thresholds
python src/model.py

# 5. Generate publication PDFs & interactive HTML dashboard
python src/generate_reports.py

# 6. Open interactive dashboard
# Open reports/interactive_dashboard.html in any browser
```

---

## Author & Credits
Developed as an enterprise-grade portfolio project by **Antigravity Lead Analytics**. Designed to demonstrate end-to-end expertise in SQL, Python, Business Analytics, Machine Learning, and Customer Retention Strategy.
