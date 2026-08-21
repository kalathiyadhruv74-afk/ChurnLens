# ChurnLens — Customer Retention & Anti-Churn Playbook

## 1. Playbook Purpose & Operating Model
This playbook provides an actionable, trigger-based operational protocol for Customer Success (CS), Product Marketing, Support, and Billing teams to proactively intervene and arrest customer churn before cancellation occurs.

---

## 2. Retention Matrix & Escalation Protocol

| Trigger Event | Risk Tier | Primary Owner | Channel & Method | SLA | Prescribed Action | Expected Retention Uplift |
|---|---|---|---|---|---|---|
| **Inactivity 7–13 Days** | Medium (31–60) | Growth / Lifecycle | Automated In-App & Email | 24 Hours | Send customized "What You Missed" digest highlighting new updates and unopened reports. | +18% Re-engagement |
| **Inactivity 14+ Days** | High (61–80) | Customer Success | Email + Retargeting Banner | 12 Hours | Trigger 1-on-1 proactive check-in from dedicated onboarding specialist with calendar link. | +24% Re-engagement |
| **Core Feature Not Used by Day 10** | High (61–80) | Product Ops | In-App Guided Tooltip | Immediate | Launch interactive onboarding checklist; offer 15-minute quickstart setup call. | +35% Feature Adoption |
| **Failed Billing Attempt (1st)** | Critical (81–100) | Billing Ops | In-App Banner + SMS + Email | Immediate | Non-intrusive payment update modal with 1-click update link and 7-day grace period. | +65% Payment Recovery |
| **Failed Billing Attempt (2nd)** | Critical (81–100) | CS Team Lead | Direct Phone Outreach / WhatsApp | 6 Hours | Manual outreach to billing contact before account lock to avoid involuntary churn. | +45% Involuntary Saved |
| **2+ Unresolved Tickets or Complaint** | High (61–80) | Support Escalations | Dedicated Video Call | 4 Hours | Escalate ticket to Tier-3 support manager; issue courtesy credit or priority SLA flag. | +30% Friction Recovery |
| **Plan Downgrade Executed** | High (61–80) | Account Executive | Personal Video Email / Call | 24 Hours | Conduct discovery on unmet needs, feature gaps, or ROI mismatch; offer custom pricing tier. | +22% Downgrade Reversal |
| **High-Value Account (Spend >= $150) Risk Score >= 60** | Critical (81–100) | Head of CS / VP | Executive Business Review (EBR) | 2 Hours | Assign dedicated Senior CSM; schedule urgent quarterly business review and roadmap alignment. | +40% Enterprise Retained |

---

## 3. Workflow Diagrams

### Workflow A: Involuntary Billing Recovery Pipeline
```
[Payment Failed]
       │
       ├──> Auto-Trigger Smart Retry (Day 1, 3, 5)
       │
       ├──> In-App Top Banner (Non-blocking): "Update Payment Details"
       │
       ├──> If unresolved after 72 hrs ──> Route to CS Lead for Direct Phone Outreach
       │
       └──> Resolved? ──> Log Success & Send Confirmation
```

### Workflow B: High-Value At-Risk CS Escalation
```
[Customer Score >= 60 & Spend >= $150]
       │
       ├──> Instant Slack Alert to #cs-critical-risk-alerts
       │
       ├──> CSM reviews last 30-day activity, open tickets & usage drop
       │
       ├──> Outbound Executive Touchpoint within 2 Hours
       │
       └──> Post-call Action Plan: Training, bug fix, or tailored commercial review
```

---

## 4. Segment-Specific Retention Campaigns

### 1. Champions (Low Risk, High Spend)
- **Goal:** Advocacy, Referral, Expansion
- **Strategy:** Invite to Product Advisory Council, early beta feature access, case studies.

### 2. Loyal Customers (Tenure >= 9 Mo, Stable)
- **Goal:** Long-term Renewal & Upgrades
- **Strategy:** Annual prepayment discounts (15% off), loyalty milestones.

### 3. High-Value At-Risk (Spend >= $150, Score >= 60)
- **Goal:** Immediate Churn Prevention
- **Strategy:** Executive outreach, tailored workflow audit, custom integration assistance.

### 4. New Customers At-Risk (Tenure <= 3 Mo, Low Adoption)
- **Goal:** Fast Time-to-Value (TTV)
- **Strategy:** Guided onboarding wizards, automated email nurture tracks, live office hours.

### 5. Dormant Accounts (30+ Days Inactive)
- **Goal:** Reactivation or Clean Sunset
- **Strategy:** "Is there anything we can do?" survey with reactivation incentives ($50 credit).
