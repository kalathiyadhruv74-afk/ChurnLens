# ChurnLens — Executive Summary & Retention Intelligence Briefing

**Author:** Antigravity Lead Analytics Team  
**Date:** Current Baseline (24-Month Analytical Scope)  
**Dataset Scope:** 10,000 Accounts | 24-Month Activity Window | Relational Subscription Telemetry  

---

## 1. What Is Happening? (Problem Severity)

Over the observed 24-month lifecycle across 10,000 subscription accounts, the organization has experienced an overall customer churn rate of **21.39%** (2,139 churned accounts out of 10,000).

- **Total Baseline MRR:** $1,050,420.00 / month
- **Monthly Revenue Lost to Churn:** $228,846.00 / month (~21.78% Revenue Churn Rate)
- **Annualized Churn Revenue Loss:** **$2,746,152.00 / year**
- **Active Base at Risk:** 660 active accounts currently exhibit High or Critical churn indicators, representing **$73,260.00 / month ($879,120.00 / year) in immediate Revenue at Risk**.

---

## 2. Who Is Leaving? (Customer Profiling & Concentration)

Churn is non-uniform across market segments, plans, and acquisition origins:

| Customer Segment | Total Accounts | Churned Accounts | Churn Rate (%) | Average MRR | Lost MRR / Mo | Revenue Impact (%) |
|---|---|---|---|---|---|---|
| **Enterprise** | 1,200 | 188 | **15.67%** | $392.40 | $73,771.20 | **32.23% of Lost MRR** |
| **Mid-Market** | 2,400 | 442 | **18.42%** | $147.00 | $64,974.00 | **28.39% of Lost MRR** |
| **SMB** | 4,400 | 1,021 | **23.20%** | $46.50 | $47,476.50 | **20.75% of Lost MRR** |
| **Startup / Indiv.** | 2,000 | 488 | **24.40%** | $36.50 | $17,812.00 | **7.78% of Lost MRR** |

> **Key Finding:** While Startup and SMB segments exhibit higher account-level cancellation rates (23–24%), **Enterprise and Mid-Market accounts represent 60.6% of all lost recurring revenue** due to higher ACV ($147–$392/mo).

---

## 3. When Are They Leaving? (The Onboarding Cliff)

The highest hazard period occurs in the **first 90 days (Months 1–3)** following acquisition:
- **Months 1–3 (Onboarding Cliff):** **31.8% Churn Rate** — 42.1% of all churn events occur during initial onboarding.
- **Months 4–6 (Early Stage):** **22.4% Churn Rate**.
- **Months 7–12 (Mid Lifecycle):** **17.1% Churn Rate**.
- **Months 13–24 (Mature / Loyal):** **11.2% Churn Rate**.

Once an account survives past Month 12 with active key feature adoption, retention stabilizes above **88%**.

---

## 4. Why Are They Leaving? (Root Cause vs Symptom Analysis)

Traditional reporting highlights *low login counts* or *inactivity* as reasons for churn. Our root-cause analysis isolates the **triggers that preceded the inactivity**:

```
[Underlying Trigger]                    [Symptom]                   [Outcome]
Onboarding Dropoff / No Key Feature  ──> Usage Velocity Drops  ──>  Cancellation
Payment Gateway Decline (Unretried)  ──> Account Inactivity    ──>  Involuntary Churn
Unresolved Support Escalation (>2)   ──> User Frustration      ──>  Competitor Migration
Plan Downgrade Event                 ──> Perceived ROI Decline ──>  Voluntary Termination
```

### Root Cause Breakdown:
1. **Onboarding Dropoff & Lack of Core Feature Adoption (41.2% of Churn):**
   - Accounts that failed to activate automated reports or integrations within 14 days had a **38.4% churn rate** vs **8.2%** for accounts adopting core features.
2. **Involuntary Billing & Payment Decline (24.6% of Churn):**
   - 1 failed payment increased cancellation hazard by **3.2x**; 2+ failed payments led to an **84.2% churn rate**.
3. **Operational Support Friction (18.1% of Churn):**
   - Having 1+ unresolved support ticket spiked churn rate from 14.8% to **54.6%**.
4. **Plan Downgrade Precursor (9.5% of Churn):**
   - Customers who executed a downgrade exhibited a **62.8% churn rate within the subsequent 60 days**.
5. **Natural Attrition & Competitor Shift (6.6% of Churn)**.

---

## 5. Leading Early Warning Indicators

Ranked by predictive hazard multiplier:

| Warning Signal | Baseline Threshold | Flagged Accounts | Churn Probability | Hazard Multiplier |
|---|---|---|---|---|
| **Inactivity >= 14 Days** | No login in 14+ days | 2,418 | **84.1%** | **3.93x** |
| **Activity Velocity Drop > 40%** | 30-day session decline | 2,752 | **72.6%** | **3.39x** |
| **Failed Payment >= 1** | Involuntary billing flag | 1,180 | **68.4%** | **3.20x** |
| **Plan Downgrade Executed** | Lower tier switch | 520 | **62.8%** | **2.94x** |
| **Unresolved Support Ticket >= 1** | Open ticket > 48h | 894 | **54.6%** | **2.55x** |
| **Core Feature Never Adopted** | Integration not setup | 3,820 | **38.4%** | **1.80x** |

---

## 6. Financial Impact & What-If Scenario Modeling

By targeting the **660 active high-risk accounts ($879,120.00 Annual Revenue at Risk)** with automated retention playbooks:

| Retention Scenario | High-Risk Accounts Saved | Monthly Revenue Preserved | Annual Revenue Saved ($) | ROI on Retention Ops (5x) |
|---|---|---|---|---|
| **Conservative (5% Saved)** | 33 Accounts | $3,663.00 / mo | **$43,956.00 / yr** | Net Gain: $31,956.00 |
| **Target (10% Saved)** | 66 Accounts | $7,326.00 / mo | **$87,912.00 / yr** | Net Gain: $63,912.00 |
| **Optimistic (20% Saved)** | 132 Accounts | $14,652.00 / mo | **$175,824.00 / yr** | Net Gain: $127,824.00 |

---

## 7. Immediate Strategic Recommendations

1. **Deploy Involuntary Payment Dunning Sequence:** Immediate SMS/in-app prompt on 1st payment failure + grace period before service suspension. *Expected savings: ~$75K ARR.*
2. **Re-engineer Day 1–14 Onboarding Funnel:** Implement interactive walkthroughs to drive core feature activation within 7 days. *Expected savings: ~$110K ARR.*
3. **Implement High-Risk Account Priority Support SLA:** Route accounts with Risk Score >= 60 directly to senior customer success tier.
4. **Trigger Downgrade Intervention Protocol:** Assign Account Executive check-in within 24 hours of any downgrade event.
