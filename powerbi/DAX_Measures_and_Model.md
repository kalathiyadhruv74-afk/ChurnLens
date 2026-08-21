# ChurnLens — Power BI Enterprise Data Model & DAX Measure Blueprint

## 1. Enterprise Star Schema Architecture

The Power BI data model is organized into a clean star schema with shared dimensions and transactional fact tables.

```
                  ┌──────────────────────┐
                  │     Dim_Date         │
                  │ (Date, Month, Qtr)   │
                  └──────────┬───────────┘
                             │ 1
                             │
                             │ *
┌──────────────────────┐  ┌──┴───────────────────┐  ┌───────────────────────────┐
│     Dim_Customer     │  │  Fact_Subscriptions   │  │ Fact_Operational_Friction │
│ (CustID, Age, Loc,   ├──┤ (CustID, Plan, MRR,  ├──┤ (CustID, SupportTickets,  │
│  Segment, Channel)   │1 │  TotalSpend, Churn)  │1 │  Unresolved, FailedPmts)  │
└──────────────────────┘  └──┬───────────────────┘  └───────────────────────────┘
                             │ 1
                             │
                             │ 1
                  ┌──────────┴───────────┐
                  │ Fact_Activity_Metrics│
                  │ (CustID, Inactivity, │
                  │  Sessions, Features) │
                  └──────────────────────┘
```

---

## 2. Complete DAX Measures Library

### Core Volume & Churn Measures

```dax
// Total Customer Base
Total Customers = 
COUNTROWS(Dim_Customer)

// Active Customer Count
Active Customers = 
CALCULATE(
    COUNTROWS(Dim_Customer),
    Fact_Subscriptions[churned] = 0
)

// Churned Customer Count
Churned Customers = 
CALCULATE(
    COUNTROWS(Dim_Customer),
    Fact_Subscriptions[churned] = 1
)

// Customer Churn Rate %
Customer Churn Rate % = 
DIVIDE([Churned Customers], [Total Customers], 0)
```

### Financial & MRR Measures

```dax
// Total Monthly Recurring Revenue (MRR)
Total MRR = 
SUM(Fact_Subscriptions[monthly_spend])

// Active MRR
Active MRR = 
CALCULATE(
    SUM(Fact_Subscriptions[monthly_spend]),
    Fact_Subscriptions[churned] = 0
)

// Lost MRR to Churn
Lost MRR = 
CALCULATE(
    SUM(Fact_Subscriptions[monthly_spend]),
    Fact_Subscriptions[churned] = 1
)

// Revenue Churn Rate %
Revenue Churn Rate % = 
DIVIDE([Lost MRR], [Total MRR], 0)

// Average Revenue Per User (ARPU)
ARPU = 
DIVIDE([Total MRR], [Total Customers], 0)

// Average Customer Lifetime Value (LTV)
Customer Lifetime Value = 
AVERAGE(Fact_Subscriptions[total_spend])
```

### Risk & Exposure Measures

```dax
// Monthly Revenue Currently at Risk (High + Critical Risk)
MRR at Risk = 
CALCULATE(
    SUM(Fact_Subscriptions[monthly_spend]),
    Fact_Risk[risk_tier] IN {"High Risk", "Critical Risk"},
    Fact_Subscriptions[churned] = 0
)

// Annual Revenue at Risk (ARR at Risk)
ARR at Risk = 
[MRR at Risk] * 12

// High-Value Customers at Risk (Spend >= $150 & Risk Score >= 60)
High Value Customers At Risk = 
CALCULATE(
    COUNTROWS(Dim_Customer),
    Fact_Subscriptions[monthly_spend] >= 150,
    Fact_Risk[churn_risk_score] >= 60,
    Fact_Subscriptions[churned] = 0
)
```

### What-If Retention Scenario Modeling

```dax
// Scenario: 5% High-Risk Retention Annual Benefit
Annual Savings (5% Retained) = 
[ARR at Risk] * 0.05

// Scenario: 10% High-Risk Retention Annual Benefit
Annual Savings (10% Retained) = 
[ARR at Risk] * 0.10

// Scenario: 20% High-Risk Retention Annual Benefit
Annual Savings (20% Retained) = 
[ARR at Risk] * 0.20
```

---

## 3. Power Query (M-Code) Ingestion Script

```powerquery
let
    Source = Csv.Document(File.Contents("C:\Users\DELL\Downloads\ChurnLens\data\cleaned_churn_data.csv"),[Delimiter=",", Columns=34, Encoding=65001, QuoteStyle=QuoteStyle.None]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"customer_id", type text},
        {"age", Int64.Type},
        {"monthly_spend", type number},
        {"total_spend", type number},
        {"tenure_months", Int64.Type},
        {"churned", Int64.Type},
        {"days_since_last_login", Int64.Type},
        {"sessions_last_30_days", Int64.Type},
        {"activity_change_pct", type number},
        {"support_tickets", Int64.Type},
        {"failed_payments", Int64.Type}
    })
in
    #"Changed Type"
```

---

## 4. Power BI Dashboard Layout Specification

### Page 1: Executive Overview
- **Header KPI Cards**:
  - `[Total Customers]` | `[Customer Churn Rate %]` (21.4%) | `[Total MRR]` | `[Lost MRR]` | `[ARR at Risk]`
- **Visuals**:
  - *Monthly Churn Trend (Line & Clustered Column)*: MoM Churn Count and Lost MRR.
  - *Revenue Churn by Segment (Donut Chart)*: Revenue lost across Enterprise, Mid-Market, SMB, Startup.
  - *Tenure Lifecycle Dropoff (Bar Chart)*: Churn rate across tenure brackets (0-3 mo onboarding cliff).

### Page 2: Churn & Cohort Intelligence
- **Cohort Retention Heatmap (Matrix Visual)**: Signup Cohort Month on Rows, Months Since Signup on Columns, `[Retention Rate %]` in Values.
- **Acquisition Channel Quality (Scatter / Bubble Plot)**: X: CAC/Volume, Y: Churn Rate %, Bubble Size: Total LTV.
- **Plan Migration & Downgrades (Sankey / Matrix)**: Impact of downgrade events on cancellation hazard.

### Page 3: Behavioral & Root Cause Explorer
- **Inactivity Danger Curve**: Churn rate by `days_since_last_login` buckets.
- **Core Feature Adoption Funnel**: Churn difference between customers adopting key features vs non-adopters.
- **Operational Friction Matrix**: Cross-tabulation of `unresolved_tickets` and `failed_payments`.

### Page 4: Risk Scoring & Retention Action Simulator
- **Risk Score Distribution (Histogram)**: 0-100 score distribution colored by risk tier.
- **High-Value At-Risk Action Table**: Priority ranked active customers with spend >= $150 and risk score >= 60.
- **What-If ROI Calculator (Interactive Slicer)**: Real-time calculation of revenue preserved at 5%, 10%, 20% retention lift.
