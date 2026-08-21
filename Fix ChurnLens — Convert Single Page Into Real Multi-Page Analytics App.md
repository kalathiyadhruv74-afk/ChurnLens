STOP the current single-page redesign.

The current ChurnLens implementation is putting almost everything on one extremely long page. I DO NOT want that.

ChurnLens must feel like a **real analytics application**, not a scrolling SaaS landing page.

## CRITICAL REQUIREMENT

DO NOT put all features, charts, analytics, explanations, simulator, methodology and playbooks on the homepage.

Create a proper **multi-page application architecture** with persistent navigation.

The homepage/dashboard should only provide a high-level executive overview.

Detailed information belongs on dedicated pages.

---

# APPLICATION STRUCTURE

Use a professional persistent sidebar on desktop.

Navigation:

### Overview
`/dashboard`

Purpose:
Give the user an immediate summary of customer churn health.

ONLY show:

- Overall Churn Rate
- Customers Analyzed
- Revenue at Risk
- High-Risk Customers
- Monthly Churn Trend
- Top 3 Churn Drivers
- High-Risk Customer preview
- 2–3 important recommended actions

Do NOT dump every chart here.

The user should understand overall churn health within approximately 10 seconds.

---

### Churn Analysis
`/analysis`

This is the main investigation page.

Include:

- Monthly churn trends
- Churn by tenure
- New vs existing customers
- Churn by subscription/customer type
- Churn by feature usage
- Churn by engagement
- Cohort analysis
- 90-day onboarding churn analysis

Provide proper filters:

Date Range
Customer Type
Plan
Tenure
Risk Level

This page answers:

**Who is churning and when?**

---

### Root Causes
`/root-causes`

Dedicated root-cause investigation.

Show:

**Top Churn Drivers**

Examples:

Low Feature Adoption
Extended Inactivity
Support Friction
Failed Payments
Plan Downgrades

Clicking a driver should reveal:

- customers affected
- churn probability
- revenue exposure
- behavior pattern
- supporting visualization
- recommended intervention

This page answers:

**Why are customers leaving?**

---

### Risk Intelligence
`/risk`

This page handles predictive analysis.

Include:

Customer Risk Simulator

Inputs:

- days inactive
- usage decline
- failed payments
- support tickets
- feature adoption

Output:

Risk Score

Example:

72 / 100
HIGH RISK

Then show explainability:

Inactivity       +21
Usage Decline    +19
Billing          +15
Support          +12
Adoption         +5

Also include:

- Risk Distribution
- Customer Risk Matrix
- Highest-risk customers
- Risk factor breakdown

This page answers:

**Who is likely to churn next?**

---

### Customers
`/customers`

Create a proper customer intelligence table.

Columns:

Customer
Segment
Tenure
Last Active
Usage Trend
Revenue
Risk Score
Risk Level

Features:

Search
Sort
Filter
Pagination

Clicking a customer should open:

`/customers/:id`

Customer detail page:

Customer Overview
Activity Timeline
Usage History
Risk Score
Risk Drivers
Revenue
Support History
Recommended Retention Action

This makes ChurnLens feel like an actual product rather than a static portfolio page.

---

### Playbooks
`/playbooks`

Dedicated retention strategy page.

Show actionable rules.

Example:

IF
Inactive ≥ 7 days

THEN
Send personalized re-engagement campaign

---

IF
High-value customer AND risk > 80

THEN
Assign Customer Success Manager

---

IF
Payment Failed

THEN
Start payment recovery workflow

---

IF
New Customer AND Adoption Low

THEN
Trigger guided onboarding

Allow:

Risk category filtering
Priority
Customer segment
Recommended action

This page answers:

**What should we do about churn?**

---

### Model & Methodology
`/methodology`

Keep technical information away from the main dashboard.

Show:

Data Pipeline

Customer Data
↓
Data Cleaning
↓
Feature Engineering
↓
Model
↓
Risk Prediction
↓
Root Cause Analysis
↓
Retention Recommendation

Then show REAL technologies actually used by the project.

Also show:

Model type
Train/test methodology
Features
Precision
Recall
F1
ROC-AUC

DO NOT fabricate metrics.

If ROC-AUC = 1.000, investigate whether there is data leakage before presenting it as an achievement.

Explain the model in a recruiter-friendly way.

---

# SIDEBAR

Desktop sidebar:

ChurnLens logo

Overview
Analysis
Root Causes
Risk Intelligence
Customers
Playbooks

Bottom:

Methodology
Settings if actually needed

Use icons but keep them subtle.

Current page must have a clear active state.

Sidebar should be collapsible.

---

# TOP BAR

Each page should have its own contextual header.

Example:

Churn Analysis

"Understand when and where customer churn occurs."

Right side:

Date selector
Filters
Export

DO NOT repeat giant marketing navigation on every page.

---

# LANDING PAGE

If you want a public landing page, make `/` a SHORT introduction.

It should contain ONLY:

Hero
3 key capabilities
Small product preview
Technology/project summary
CTA → Explore Dashboard

That's it.

NO:

10-section homepage
pricing
testimonials
fake company logos
huge FAQ
enterprise sales content
fake SOC2 claims
fake SLA claims
fake customer numbers
fake revenue recovered
endless feature sections

The landing page should be short enough that the actual dashboard remains the focus.

---

# VISUAL DESIGN

Do not interpret "premium" as:

Huge text
Huge cards
Everything rounded
Everything floating
Purple gradients
Glassmorphism everywhere
Random glowing backgrounds
Excessive whitespace
Excessive animation

I want a **dense but clean professional analytics application**.

Use:

Warm off-white / very light neutral background
White data surfaces
Near-black typography
Subtle gray borders
Minimal shadows
One restrained accent color
Red/orange for churn risk
Green only for positive/healthy states

Think professional analytics/fintech software.

---

# CARD DESIGN

Stop wrapping absolutely everything in giant cards.

Use cards only when they provide meaningful grouping.

Metric cards should be compact.

Example:

CHURN RATE

18.4%
↓ 2.1% vs last month

Small sparkline

Cards should have:

8–12px radius
1px subtle border
minimal/no shadow
good internal spacing

Not massive rounded rectangles.

---

# DATA VISUALIZATION

Charts should dominate analytical pages.

Each chart should answer ONE business question.

Example:

Monthly Churn Trend
→ Is churn increasing?

Churn by Tenure
→ When do customers leave?

Feature Adoption vs Churn
→ Does product usage predict churn?

Risk Distribution
→ How many customers require intervention?

Never add a chart simply because the page looks empty.

---

# PAGE DENSITY

Do NOT make pages excessively long.

Target:

Dashboard:
approximately 1–2 viewport heights

Analysis:
2–3 viewport heights depending on charts

Root Causes:
1–2 viewport heights

Risk:
1–2 viewport heights

Customers:
primarily table-based

Playbooks:
1–2 viewport heights

Methodology:
1–2 viewport heights

Use tabs, drilldowns, dialogs and dedicated routes instead of endlessly stacking content vertically.

---

# ROUTING

Use proper React routing.

Navigation must change routes WITHOUT full-page reloads.

Use existing routing library if already installed.

Otherwise use React Router.

Create reusable layouts:

AppLayout
Sidebar
Topbar
PageHeader

Then individual pages:

DashboardPage
AnalysisPage
RootCausesPage
RiskPage
CustomersPage
CustomerDetailPage
PlaybooksPage
MethodologyPage

Do NOT implement these as anchor links scrolling to sections on one page.

They must be actual routes/pages.

---

# ANIMATION

Use GSAP sparingly.

Good:

Page entrance
Chart reveal
Number count-up
Sidebar interaction
Risk score transition
Small hover feedback

Bad:

Every section flying into view
Constant parallax
Bouncing cards
Huge text animations
Random movement
Animations delaying access to data

This is analytics software, not an animation showcase.

---

# RESPONSIVE BEHAVIOR

Desktop:
Collapsible sidebar + content

Tablet:
Compact sidebar

Mobile:
Sidebar becomes drawer

Do not turn the mobile application back into one giant scrolling homepage.

Maintain page separation.

---

# IMPORTANT: PRESERVE FUNCTIONALITY

Before changing architecture:

Inspect the existing project.

Identify:

- components
- API calls
- backend
- calculations
- charts
- risk simulator
- data
- existing routing

DO NOT delete working functionality just because you are reorganizing the UI.

Move existing functionality into the correct page.

Refactor rather than rewrite unnecessarily.

---

# FINAL TEST

Before finishing, verify:

1. `/` = short landing page
2. `/dashboard` = executive overview
3. `/analysis` = detailed churn analytics
4. `/root-causes` = root cause investigation
5. `/risk` = predictive risk intelligence
6. `/customers` = customer table
7. `/customers/:id` = customer details
8. `/playbooks` = retention actions
9. `/methodology` = model explanation

Every sidebar item must navigate to a REAL route.

Browser Back/Forward must work.

Refreshing a route must work.

No important existing functionality should be lost.

No giant one-page application.

The finished product should feel like a **real Customer Churn Intelligence platform that a business analyst, product analyst or customer-success team could actually use every day**, not a generic AI-generated portfolio landing page.