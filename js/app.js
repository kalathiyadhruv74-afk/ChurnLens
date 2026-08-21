/**
 * ChurnLens Interactive Application Logic
 * UI/UX Pro Max Architecture: Reactive Sliders, Real-Time Risk Engine, Animated KPIs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavbar();
  initRoiCalculator();
  initRiskEngineSandbox();
  initTabs();
  initPricingToggle();
  initFaqAccordion();
  initPlaybookSimulation();
  initDemoModal();
});

/* ==========================================================================
   1. NAVBAR SCROLL & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    // Close mobile menu on clicking any link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE ROI & CHURN SAVINGS CALCULATOR
   ========================================================================== */
function initRoiCalculator() {
  const customersSlider = document.getElementById('calc-customers');
  const mrrSlider = document.getElementById('calc-mrr');
  const churnSlider = document.getElementById('calc-churn');

  const customersVal = document.getElementById('calc-customers-val');
  const mrrVal = document.getElementById('calc-mrr-val');
  const churnVal = document.getElementById('calc-churn-val');

  const arrSavedEl = document.getElementById('calc-arr-saved');
  const lostArrEl = document.getElementById('calc-lost-arr');
  const roiMultipleEl = document.getElementById('calc-roi-multiple');
  const monthlyRetainedEl = document.getElementById('calc-monthly-retained');

  if (!customersSlider || !mrrSlider || !churnSlider) return;

  function updateCalculator() {
    const customers = parseInt(customersSlider.value, 10);
    const mrr = parseFloat(mrrSlider.value);
    const churnRate = parseFloat(churnSlider.value);

    // Update Label Badges
    if (customersVal) customersVal.textContent = customers.toLocaleString();
    if (mrrVal) mrrVal.textContent = `$${mrr.toLocaleString()}`;
    if (churnVal) churnVal.textContent = `${churnRate.toFixed(1)}%`;

    // Core Calculations based on ChurnLens 24-Month Analytical Thesis
    const annualLostRevenue = customers * mrr * (churnRate / 100) * 12;
    // ChurnLens benchmark: 35.4% average retention recovery rate
    const recoveredArr = annualLostRevenue * 0.354;
    const monthlyRetained = recoveredArr / 12;
    
    // Estimated Software Cost (Annual Growth Tier ~$5,988)
    const annualCost = 5988;
    const roiMultiple = Math.max(1, Math.round(recoveredArr / annualCost));

    // Update DOM with formatted values
    if (arrSavedEl) arrSavedEl.textContent = formatCurrency(recoveredArr);
    if (lostArrEl) lostArrEl.textContent = formatCurrency(annualLostRevenue);
    if (monthlyRetainedEl) monthlyRetainedEl.textContent = `${formatCurrency(monthlyRetained)}/mo`;
    if (roiMultipleEl) roiMultipleEl.textContent = `${roiMultiple}x ROI`;
  }

  customersSlider.addEventListener('input', updateCalculator);
  mrrSlider.addEventListener('input', updateCalculator);
  churnSlider.addEventListener('input', updateCalculator);

  // Initial calculation
  updateCalculator();
}

function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${Math.round(amount).toLocaleString()}`;
  } else {
    return `$${amount.toFixed(0)}`;
  }
}

/* ==========================================================================
   3. REAL-TIME 0–100 RISK SCORING ENGINE SANDBOX
   ========================================================================== */
function initRiskEngineSandbox() {
  const inactivitySlider = document.getElementById('risk-inactivity');
  const velocitySlider = document.getElementById('risk-velocity');
  
  const inactivityVal = document.getElementById('risk-inactivity-val');
  const velocityVal = document.getElementById('risk-velocity-val');

  const failedPmtsBtns = document.querySelectorAll('.friction-pmt-btn');
  const ticketsBtns = document.querySelectorAll('.friction-ticket-btn');
  const featureBtns = document.querySelectorAll('.feature-btn');

  const subInactivityEl = document.getElementById('sub-inactivity');
  const subVelocityEl = document.getElementById('sub-velocity');
  const subFrictionEl = document.getElementById('sub-friction');
  const subFeatureEl = document.getElementById('sub-feature');

  const gaugeScoreEl = document.getElementById('gauge-score-val');
  const gaugeProgressEl = document.getElementById('gauge-progress-circle');
  const tierBadgeEl = document.getElementById('risk-tier-badge');
  const actionTitleEl = document.getElementById('prescribed-action-title');
  const actionDescEl = document.getElementById('prescribed-action-desc');

  let failedPayments = 0;
  let unresolvedTickets = 0;
  let keyFeatureAdopted = 1; // 1 = yes, 0 = no

  function setupToggleButtons(buttonGroup, onSelect) {
    buttonGroup.forEach(btn => {
      btn.addEventListener('click', () => {
        buttonGroup.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onSelect(btn.getAttribute('data-val'));
        calculateRiskScore();
      });
    });
  }

  setupToggleButtons(failedPmtsBtns, (val) => { failedPayments = parseInt(val, 10); });
  setupToggleButtons(ticketsBtns, (val) => { unresolvedTickets = parseInt(val, 10); });
  setupToggleButtons(featureBtns, (val) => { keyFeatureAdopted = parseInt(val, 10); });

  if (inactivitySlider) {
    inactivitySlider.addEventListener('input', () => {
      if (inactivityVal) inactivityVal.textContent = `${inactivitySlider.value} days`;
      calculateRiskScore();
    });
  }

  if (velocitySlider) {
    velocitySlider.addEventListener('input', () => {
      const val = parseInt(velocitySlider.value, 10);
      if (velocityVal) velocityVal.textContent = val > 0 ? `+${val}%` : `${val}%`;
      calculateRiskScore();
    });
  }

  function calculateRiskScore() {
    const days = parseInt(inactivitySlider ? inactivitySlider.value : 5, 10);
    const velocityChange = parseInt(velocitySlider ? velocitySlider.value : -20, 10);

    // 1. Inactivity Subscore (0-25 pts) from src/risk_scoring.py
    let scoreInactivity = 0;
    if (days <= 3) {
      scoreInactivity = 0.0;
    } else if (days <= 7) {
      scoreInactivity = 6.0 + (days - 3) * 1.5;
    } else if (days <= 14) {
      scoreInactivity = 12.0 + (days - 7) * 1.2;
    } else if (days <= 30) {
      scoreInactivity = 18.0 + (days - 14) * 0.35;
    } else {
      scoreInactivity = 25.0;
    }

    // 2. Engagement Velocity Subscore (0-25 pts)
    let scoreVelocity = 0;
    if (velocityChange < 0) {
      scoreVelocity += Math.min(20.0, Math.abs(velocityChange) * 0.25);
    }
    // Estimated sessions penalty
    if (velocityChange < -40) {
      scoreVelocity += 5.0;
    } else if (velocityChange < -15) {
      scoreVelocity += 2.5;
    }
    scoreVelocity = Math.min(25.0, scoreVelocity);

    // 3. Operational Friction Subscore (0-25 pts)
    let scoreFriction = Math.min(12.0, failedPayments * 6.0) + Math.min(8.0, unresolvedTickets * 4.0);
    scoreFriction = Math.min(25.0, scoreFriction);

    // 4. Feature Adoption Subscore (0-25 pts)
    let scoreFeature = 0;
    if (keyFeatureAdopted === 0) {
      scoreFeature += 12.0;
    }
    if (keyFeatureAdopted === 0) {
      scoreFeature += 5.0; // unadopted feature penalty
    }
    scoreFeature = Math.min(25.0, scoreFeature);

    // Composite Total Score (0 - 100)
    const totalRiskScore = Math.min(100, Math.round(scoreInactivity + scoreVelocity + scoreFriction + scoreFeature));

    // Update Subscore Indicators
    if (subInactivityEl) subInactivityEl.textContent = `${scoreInactivity.toFixed(1)}/25`;
    if (subVelocityEl) subVelocityEl.textContent = `${scoreVelocity.toFixed(1)}/25`;
    if (subFrictionEl) subFrictionEl.textContent = `${scoreFriction.toFixed(1)}/25`;
    if (subFeatureEl) subFeatureEl.textContent = `${scoreFeature.toFixed(1)}/25`;

    // Update Gauge Number
    if (gaugeScoreEl) gaugeScoreEl.textContent = totalRiskScore;

    // SVG Gauge Dashoffset: circumference = 2 * PI * 70 ≈ 440
    const circumference = 440;
    const offset = circumference - (totalRiskScore / 100) * circumference;
    if (gaugeProgressEl) {
      gaugeProgressEl.style.strokeDashoffset = offset;
    }

    // Determine Tier & Prescribed Action
    let tier = 'Low Risk';
    let tierClass = 'tier-low';
    let strokeColor = '#10B981'; // Emerald
    let actionTitle = 'Automated Loyalty & Value Delivery';
    let actionDesc = 'Account is healthy. Routine product newsletters and feature spotlight workflows.';

    if (totalRiskScore <= 30) {
      tier = 'Low Risk (Score: ' + totalRiskScore + ')';
      tierClass = 'tier-low';
      strokeColor = '#10B981';
      actionTitle = 'Automated Loyalty & Value Expansion';
      actionDesc = 'Healthy customer. Eligible for automated quarterly expansion suggestions and champion rewards.';
    } else if (totalRiskScore <= 60) {
      tier = 'Medium Risk (Score: ' + totalRiskScore + ')';
      tierClass = 'tier-medium';
      strokeColor = '#F59E0B';
      actionTitle = 'Automated In-App Setup Nudge & Check-in';
      actionDesc = 'Trigger personalized email nudge highlighting unadopted core integrations + in-app walkthrough banner.';
    } else if (totalRiskScore <= 80) {
      tier = 'High Risk (Score: ' + totalRiskScore + ')';
      tierClass = 'tier-high';
      strokeColor = '#F43F5E';
      actionTitle = 'Proactive 4-Hour CSM Outreach & Smart Dunning';
      actionDesc = 'Escalate account to dedicated Account Executive. Deploy smart payment dunning retry sequence.';
    } else {
      tier = 'Critical Risk (Score: ' + totalRiskScore + ')';
      tierClass = 'tier-critical';
      strokeColor = '#FF4D6D';
      actionTitle = 'Executive Intervention & SLA VIP Fast-Track';
      actionDesc = 'Immediate Slack emergency alert to VP of Customer Success. Schedule emergency retention strategy call.';
    }

    if (gaugeProgressEl) gaugeProgressEl.style.stroke = strokeColor;
    if (tierBadgeEl) {
      tierBadgeEl.className = `risk-tier-badge ${tierClass}`;
      tierBadgeEl.textContent = tier;
    }
    if (actionTitleEl) actionTitleEl.textContent = actionTitle;
    if (actionDescEl) actionDescEl.textContent = actionDesc;
  }

  // Initial run
  calculateRiskScore();
}

/* ==========================================================================
   4. TAB NAVIGATION MODULE
   ========================================================================== */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const targetGroup = container.getAttribute('data-tabs');
    const contents = document.querySelectorAll(`[data-tab-content="${targetGroup}"]`);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const selectedId = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(content => {
          if (content.id === selectedId) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  });
}

/* ==========================================================================
   5. PRICING TOGGLE (MONTHLY / ANNUAL)
   ========================================================================== */
function initPricingToggle() {
  const switchEl = document.getElementById('billing-toggle');
  const priceStartup = document.getElementById('price-startup');
  const priceGrowth = document.getElementById('price-growth');
  const priceEnterprise = document.getElementById('price-enterprise');
  const cycleLabels = document.querySelectorAll('.plan-cycle');

  if (!switchEl) return;

  let isAnnual = true;

  switchEl.addEventListener('click', () => {
    isAnnual = !isAnnual;
    switchEl.classList.toggle('annual', isAnnual);

    if (isAnnual) {
      if (priceStartup) priceStartup.textContent = '$159';
      if (priceGrowth) priceGrowth.textContent = '$399';
      if (priceEnterprise) priceEnterprise.textContent = '$959';
      cycleLabels.forEach(lbl => lbl.textContent = '/month, billed annually');
    } else {
      if (priceStartup) priceStartup.textContent = '$199';
      if (priceGrowth) priceGrowth.textContent = '$499';
      if (priceEnterprise) priceEnterprise.textContent = '$1,199';
      cycleLabels.forEach(lbl => lbl.textContent = '/month, billed monthly');
    }
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive);
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE PLAYBOOK SIMULATION
   ========================================================================== */
function initPlaybookSimulation() {
  const simulateBtn = document.getElementById('btn-simulate-playbook');
  const toastContainer = document.getElementById('simulation-toast');

  if (!simulateBtn || !toastContainer) return;

  simulateBtn.addEventListener('click', () => {
    simulateBtn.disabled = true;
    simulateBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Executing Playbook Sequence...
    `;

    setTimeout(() => {
      toastContainer.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 1rem; border-radius: 0.75rem; color: #10B981; font-size: 0.875rem; display: flex; align-items: center; gap: 0.75rem; animation: fadeIn 0.3s ease;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
          <div>
            <strong>Playbook Executed Successfully!</strong><br>
            Dispatched Slack emergency notification to <code>#retention-war-room</code> & scheduled Stripe smart dunning retry in 24h.
          </div>
        </div>
      `;
      simulateBtn.disabled = false;
      simulateBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Re-Run Playbook Simulation
      `;
    }, 1200);
  });
}

/* ==========================================================================
   8. DEMO & LIVE SANDBOX MODAL
   ========================================================================== */
function initDemoModal() {
  const openModalBtns = document.querySelectorAll('[data-open-modal="demo-modal"]');
  const modal = document.getElementById('demo-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const demoForm = document.getElementById('demo-form');
  const demoSuccess = document.getElementById('demo-success-state');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('demo-email')?.value;
      const company = document.getElementById('demo-company')?.value;

      const submitBtn = demoForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Generating Retention Audit...';
      }

      setTimeout(() => {
        demoForm.style.display = 'none';
        if (demoSuccess) {
          demoSuccess.style.display = 'block';
          const targetEmail = document.getElementById('target-demo-email');
          if (targetEmail) targetEmail.textContent = email || 'your work email';
        }
      }, 1000);
    });
  }
}
