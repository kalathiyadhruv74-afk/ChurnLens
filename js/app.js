/**
 * ChurnLens — Multi-Page Analytics Application Engine
 * Client-Side Router, Dynamic Contextual Topbar, Customer Directory & Dossier,
 * Real-Time 0-100 Risk Engine, 2D Quadrant Matrix Canvas, Chart.js & Native Canvas Engine.
 */

/* ==========================================================================
   CUSTOMER INTELLIGENCE DATASET (20 Real-World Account Records)
   ========================================================================== */
const customerDirectory = [
  { id: 'CUST-1001', name: 'Apex Cloud Systems', segment: 'Enterprise', plan: 'Enterprise', tenure: 2, lastActive: '14 days ago', velocity: -47, mrr: 420, risk: 78, level: 'High', inact: 14, tickets: 2, billing: 1, action: 'VIP 4-Hour CSM Outreach & Smart Dunning' },
  { id: 'CUST-1002', name: 'Quantum Analytics Inc.', segment: 'Enterprise', plan: 'Enterprise', tenure: 1, lastActive: '18 days ago', velocity: -60, mrr: 480, risk: 85, level: 'Critical', inact: 18, tickets: 3, billing: 1, action: 'Executive Escalation & Onboarding Intervention' },
  { id: 'CUST-1003', name: 'HyperFlow Networks', segment: 'Enterprise', plan: 'Enterprise', tenure: 4, lastActive: '9 days ago', velocity: -35, mrr: 380, risk: 68, level: 'High', inact: 9, tickets: 1, billing: 0, action: 'Workflow Audit & Feature Adoption Nudge' },
  { id: 'CUST-1004', name: 'Nexus Logistics Hub', segment: 'Mid-Market', plan: 'Pro', tenure: 3, lastActive: '12 days ago', velocity: -50, mrr: 290, risk: 72, level: 'High', inact: 12, tickets: 2, billing: 1, action: 'Smart Dunning Retry & CSM Check-in' },
  { id: 'CUST-1005', name: 'OmniVanguard Software', segment: 'Enterprise', plan: 'Enterprise', tenure: 5, lastActive: '15 days ago', velocity: -40, mrr: 450, risk: 74, level: 'High', inact: 15, tickets: 2, billing: 0, action: 'VIP Support SLA & Downgrade Prevention' },
  { id: 'CUST-1006', name: 'DevSpark Tools', segment: 'SMB', plan: 'Pro', tenure: 2, lastActive: '16 days ago', velocity: -55, mrr: 59, risk: 79, level: 'High', inact: 16, tickets: 1, billing: 1, action: 'Automated In-App Walkthrough & Dunning' },
  { id: 'CUST-1007', name: 'PixelForge Labs', segment: 'SMB', plan: 'Pro', tenure: 1, lastActive: '22 days ago', velocity: -70, mrr: 79, risk: 88, level: 'Critical', inact: 22, tickets: 2, billing: 2, action: 'Card Update Portal & Emergency Grace Lock' },
  { id: 'CUST-1008', name: 'ByteCraft Studio', segment: 'Startup', plan: 'Custom', tenure: 3, lastActive: '14 days ago', velocity: -48, mrr: 39, risk: 71, level: 'High', inact: 14, tickets: 0, billing: 1, action: 'Personalized Day 14 Re-engagement Email' },
  { id: 'CUST-1009', name: 'SyncBridge App', segment: 'Startup', plan: 'Custom', tenure: 2, lastActive: '11 days ago', velocity: -42, mrr: 29, risk: 65, level: 'High', inact: 11, tickets: 0, billing: 0, action: 'Feature Adoption Spotlight Banner' },
  { id: 'CUST-1010', name: 'PulsePoint Studio', segment: 'Startup', plan: 'Custom', tenure: 14, lastActive: '1 day ago', velocity: 18, mrr: 49, risk: 15, level: 'Low', inact: 1, tickets: 0, billing: 0, action: 'Automated Newsletter & Loyalty Reward' },
  { id: 'CUST-1011', name: 'CloudScale Global', segment: 'Enterprise', plan: 'Enterprise', tenure: 18, lastActive: '1 day ago', velocity: 22, mrr: 490, risk: 14, level: 'Low', inact: 1, tickets: 0, billing: 0, action: 'Quarterly Executive Business Review & Expansion' },
  { id: 'CUST-1012', name: 'Vertex FinTech', segment: 'Enterprise', plan: 'Enterprise', tenure: 12, lastActive: '2 days ago', velocity: 15, mrr: 410, risk: 18, level: 'Low', inact: 2, tickets: 0, billing: 0, action: 'Champion Referral Program Invite' },
  { id: 'CUST-1013', name: 'Aegis Security Labs', segment: 'Mid-Market', plan: 'Pro', tenure: 16, lastActive: '1 day ago', velocity: 28, mrr: 320, risk: 12, level: 'Low', inact: 1, tickets: 0, billing: 0, action: 'Annual Renewal Fast-Track' },
  { id: 'CUST-1014', name: 'Starlight Media SaaS', segment: 'Mid-Market', plan: 'Pro', tenure: 9, lastActive: '3 days ago', velocity: 10, mrr: 260, risk: 22, level: 'Low', inact: 3, tickets: 0, billing: 0, action: 'Tier Expansion Suggestion' },
  { id: 'CUST-1015', name: 'Horizon Cloud Core', segment: 'Enterprise', plan: 'Enterprise', tenure: 20, lastActive: 'Today', velocity: 34, mrr: 440, risk: 9, level: 'Low', inact: 0, tickets: 0, billing: 0, action: 'VIP Customer Advisory Board Invite' },
  { id: 'CUST-1016', name: 'AeroTech Digital', segment: 'SMB', plan: 'Pro', tenure: 15, lastActive: '2 days ago', velocity: 12, mrr: 89, risk: 19, level: 'Low', inact: 2, tickets: 0, billing: 0, action: 'Automated Product Spotlight' },
  { id: 'CUST-1017', name: 'Nordic Wave SaaS', segment: 'Startup', plan: 'Custom', tenure: 8, lastActive: '3 days ago', velocity: 8, mrr: 39, risk: 24, level: 'Low', inact: 3, tickets: 0, billing: 0, action: 'Loyalty Credit Promotion' },
  { id: 'CUST-1018', name: 'VectorSync Lite', segment: 'SMB', plan: 'Pro', tenure: 11, lastActive: '2 days ago', velocity: 5, mrr: 69, risk: 20, level: 'Low', inact: 2, tickets: 0, billing: 0, action: 'Feature Integration Checklist' },
  { id: 'CUST-1019', name: 'Krypton Data Hub', segment: 'Mid-Market', plan: 'Pro', tenure: 6, lastActive: '7 days ago', velocity: -18, mrr: 210, risk: 42, level: 'Medium', inact: 7, tickets: 1, billing: 0, action: 'CSM Check-In Email' },
  { id: 'CUST-1020', name: 'Zenith Payments AI', segment: 'Mid-Market', plan: 'Pro', tenure: 5, lastActive: '8 days ago', velocity: -22, mrr: 230, risk: 48, level: 'Medium', inact: 8, tickets: 1, billing: 0, action: 'Guided Setup Optimization Nudge' }
];

/* ==========================================================================
   CLIENT-SIDE ROUTING & VIEW CONTROLLER
   ========================================================================== */
const routes = {
  '': { viewId: 'dashboard-page', title: 'Executive Overview', desc: 'High-level summary of customer churn health and revenue exposure.', isAppView: true, navKey: 'dashboard' },
  '/': { viewId: 'dashboard-page', title: 'Executive Overview', desc: 'High-level summary of customer churn health and revenue exposure.', isAppView: true, navKey: 'dashboard' },
  'landing': { viewId: 'landing-page', title: 'ChurnLens', desc: '', isAppView: false },
  '/landing': { viewId: 'landing-page', title: 'ChurnLens', desc: '', isAppView: false },
  '/dashboard': { viewId: 'dashboard-page', title: 'Executive Overview', desc: 'High-level summary of customer churn health and revenue exposure.', isAppView: true, navKey: 'dashboard' },
  '/analysis': { viewId: 'analysis-page', title: 'Churn Analysis', desc: 'Detailed investigation of customer attrition by tenure, segment, and plan.', isAppView: true, navKey: 'analysis' },
  '/root-causes': { viewId: 'root-causes-page', title: 'Root Cause Intelligence', desc: 'Isolate underlying behavioral and operational triggers driving customer departures.', isAppView: true, navKey: 'root-causes' },
  '/risk': { viewId: 'risk-page', title: 'Risk Intelligence', desc: 'Predictive 0–100 risk simulator and 2D customer prioritization matrix.', isAppView: true, navKey: 'risk' },
  '/customers': { viewId: 'customers-page', title: 'Customer Intelligence Directory', desc: 'Explore, search, filter, and inspect risk profiles across all accounts.', isAppView: true, navKey: 'customers' },
  '/playbooks': { viewId: 'playbooks-page', title: 'Retention Playbooks', desc: 'Automated operational countermeasures mapped directly to churn risk drivers.', isAppView: true, navKey: 'playbooks' },
  '/methodology': { viewId: 'methodology-page', title: 'Model & Engineering Methodology', desc: 'Data science pipeline, model benchmarks, and business threshold optimization.', isAppView: true, navKey: 'methodology' }
};

document.addEventListener('DOMContentLoaded', () => {
  initAppRouter();
  initSidebar();
  initCustomerTable();
  initRiskEngineSandbox();
  initRootCauseInspector();
  initPlaybookSimulation();
  initRiskMatrixCanvas();
});

function initAppRouter() {
  function handleRoute() {
    let hash = window.location.hash.replace(/^#/, '').trim();
    if (!hash) hash = '/dashboard';

    // Handle parameterized routes like /customers/:id
    if (hash.startsWith('/customers/')) {
      const custId = hash.split('/customers/')[1];
      showCustomerDetail(custId);
      return;
    }

    const routeConfig = routes[hash] || routes['/dashboard'];

    // Toggle Landing Page vs App Layout
    const landingEl = document.getElementById('landing-page');
    const appLayoutEl = document.getElementById('app-layout');

    if (routeConfig.viewId === 'landing-page') {
      if (landingEl) landingEl.style.display = 'block';
      if (appLayoutEl) appLayoutEl.style.display = 'none';
      return;
    } else {
      if (landingEl) landingEl.style.display = 'none';
      if (appLayoutEl) appLayoutEl.style.display = 'flex';
    }

    // Hide all app views, display target view
    document.querySelectorAll('.app-content .page-view').forEach(view => {
      view.classList.remove('active-route');
    });

    const targetView = document.getElementById(routeConfig.viewId);
    if (targetView) {
      targetView.classList.add('active-route');
    }

    // Update Contextual Topbar
    const titleEl = document.getElementById('page-header-title');
    const descEl = document.getElementById('page-header-desc');
    if (titleEl) titleEl.textContent = routeConfig.title;
    if (descEl) descEl.textContent = routeConfig.desc;

    // Update Active Nav Link in Sidebar
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-route') === routeConfig.navKey) {
        link.classList.add('active');
      }
    });

    // Close mobile drawer on route change
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Scroll to top
    window.scrollTo(0, 0);

    // Initialize/Render Charts & Data for Active Page
    renderActivePageData(routeConfig.navKey);
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

/* ==========================================================================
   SIDEBAR & DRAWER INTERACTION
   ========================================================================= */
function initSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  const appMain = document.getElementById('app-main');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');

  if (toggleBtn && sidebar && appMain) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      appMain.classList.toggle('sidebar-collapsed');
    });
  }

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
}

/* ==========================================================================
   CHARTS & DATA RENDERING (Dark Slate Palette with Chart.js + Fallback)
   ========================================================================== */
let overviewTrendChartInstance = null;
let analysisTenureChartInstance = null;
let analysisSegmentChartInstance = null;

function renderActivePageData(navKey) {
  if (navKey === 'dashboard') {
    renderOverviewHighRiskTable();
    renderOverviewTrendChart();
  } else if (navKey === 'analysis') {
    renderAnalysisTenureChart();
    renderAnalysisSegmentChart();
  } else if (navKey === 'risk') {
    if (window.renderRiskMatrix) window.renderRiskMatrix();
  } else if (navKey === 'customers') {
    renderCustomerTable();
  }
}

function renderOverviewHighRiskTable() {
  const tbody = document.getElementById('overview-high-risk-tbody');
  if (!tbody) return;

  const highRiskSubset = customerDirectory.filter(c => c.risk >= 70).slice(0, 4);
  tbody.innerHTML = highRiskSubset.map(c => `
    <tr onclick="window.location.hash='#/customers/${c.id}'">
      <td><strong>${c.name}</strong></td>
      <td>${c.segment}</td>
      <td class="tnum" style="color: var(--text-primary); font-weight: 600;">$${c.mrr}.00</td>
      <td><span class="kpi-badge danger tnum">Risk: ${c.risk}/100</span></td>
      <td><a href="#/customers/${c.id}" class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">Inspect</a></td>
    </tr>
  `).join('');
}

function renderOverviewTrendChart() {
  const canvas = document.getElementById('overviewTrendCanvas');
  if (!canvas) return;

  const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M23', 'M24'];
  const churnRates = [12.4, 11.2, 8.2, 7.8, 7.5, 7.1, 6.2, 5.8, 5.5, 5.1, 4.9, 4.5, 4.2, 4.0, 3.9, 3.8, 3.7, 3.5, 3.4, 3.3, 3.2, 3.1, 3.1, 3.0];

  if (typeof Chart !== 'undefined') {
    try {
      if (overviewTrendChartInstance) overviewTrendChartInstance.destroy();
      overviewTrendChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Monthly Churn Rate (%)',
            data: churnRates,
            borderColor: '#F43F5E',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#F43F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1E293B',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: 1,
              padding: 10,
              callbacks: { label: ctx => `Churn Rate: ${ctx.parsed.y}%` }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94A3B8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94A3B8', callback: v => v + '%' } }
          }
        }
      });
      return;
    } catch (e) {
      console.warn('Chart.js render exception, using native canvas fallback', e);
    }
  }

  drawNativeLineChart(canvas, months, churnRates, '#F43F5E');
}

function renderAnalysisTenureChart() {
  const canvas = document.getElementById('analysisTenureCanvas');
  if (!canvas) return;

  const labels = ['M1–3 (Cliff)', 'M4–6', 'M7–12', 'M13–18', 'M19–24'];
  const values = [31.8, 22.4, 17.1, 12.8, 9.6];

  if (typeof Chart !== 'undefined') {
    try {
      if (analysisTenureChartInstance) analysisTenureChartInstance.destroy();
      analysisTenureChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#F43F5E', '#F59E0B', '#6366F1', '#3B82F6', '#10B981'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#94A3B8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94A3B8', callback: v => v + '%' } }
          }
        }
      });
      return;
    } catch (e) {
      console.warn('Chart.js render exception, using native canvas fallback', e);
    }
  }

  drawNativeBarChart(canvas, labels, values);
}

function renderAnalysisSegmentChart() {
  const canvas = document.getElementById('analysisSegmentCanvas');
  if (!canvas) return;

  const labels = ['Enterprise (32.2%)', 'Mid-Market (28.4%)', 'SMB (20.8%)', 'Startup (7.8%)'];
  const values = [73.8, 65.0, 47.5, 17.8];

  if (typeof Chart !== 'undefined') {
    try {
      if (analysisSegmentChartInstance) analysisSegmentChartInstance.destroy();
      analysisSegmentChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#3B82F6', '#6366F1', '#F59E0B', '#64748B'],
            borderWidth: 2,
            borderColor: '#121927'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { font: { family: 'Inter', size: 11 }, color: '#CBD5E1', boxWidth: 12 } }
          }
        }
      });
      return;
    } catch (e) {
      console.warn('Chart.js render exception, using native canvas fallback', e);
    }
  }

  drawNativeDonutChart(canvas, labels, values);
}

/* ==========================================================================
   NATIVE CANVAS CHARTING ENGINE (HIGH CONTRAST DARK PALETTE)
   ========================================================================== */
function drawNativeLineChart(canvas, labels, values, strokeColor) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 260 * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = 260;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  ctx.clearRect(0, 0, w, h);

  // Background Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padTop + (i / 4) * (h - padTop - padBottom);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'right';
    const val = (15 - i * 3.75).toFixed(1);
    ctx.fillText(`${val}%`, padLeft - 6, y + 3);
  }

  // Draw Line
  const stepX = (w - padLeft - padRight) / (values.length - 1);
  const maxVal = 15;
  const minVal = 0;

  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5;

  values.forEach((v, i) => {
    const x = padLeft + i * stepX;
    const y = padTop + (1 - (v - minVal) / (maxVal - minVal)) * (h - padTop - padBottom);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Area Fill
  ctx.lineTo(padLeft + (values.length - 1) * stepX, h - padBottom);
  ctx.lineTo(padLeft, h - padBottom);
  ctx.closePath();
  ctx.fillStyle = 'rgba(244, 63, 94, 0.1)';
  ctx.fill();

  // Draw X Ticks
  ctx.fillStyle = '#94A3B8';
  ctx.font = '10px JetBrains Mono';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    if (i % 3 === 0 || i === labels.length - 1) {
      const x = padLeft + i * stepX;
      ctx.fillText(l, x, h - 10);
    }
  });
}

function drawNativeBarChart(canvas, labels, values) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 260 * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = 260;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40;

  ctx.clearRect(0, 0, w, h);

  const colors = ['#F43F5E', '#F59E0B', '#6366F1', '#3B82F6', '#10B981'];
  const maxVal = 35;
  const plotW = w - padLeft - padRight;
  const barWidth = (plotW / values.length) * 0.55;
  const step = plotW / values.length;

  values.forEach((v, i) => {
    const x = padLeft + i * step + (step - barWidth) / 2;
    const barH = (v / maxVal) * (h - padTop - padBottom);
    const y = h - padBottom - barH;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`${v}%`, x + barWidth / 2, y - 6);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Inter';
    ctx.fillText(labels[i], x + barWidth / 2, h - padBottom + 16);
  });
}

function drawNativeDonutChart(canvas, labels, values) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 260 * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = 260;
  ctx.clearRect(0, 0, w, h);

  const total = values.reduce((a, b) => a + b, 0);
  const colors = ['#3B82F6', '#6366F1', '#F59E0B', '#64748B'];
  const cx = w * 0.35;
  const cy = h / 2;
  const radius = 80;
  const innerRadius = 50;

  let startAngle = -Math.PI / 2;
  values.forEach((v, i) => {
    const sliceAngle = (v / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = '#121927';
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += sliceAngle;
  });

  ctx.textAlign = 'left';
  labels.forEach((l, i) => {
    const legX = w * 0.62;
    const legY = 60 + i * 36;
    ctx.fillStyle = colors[i];
    ctx.fillRect(legX, legY - 8, 10, 10);
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '11px Inter';
    ctx.fillText(l, legX + 16, legY);
  });
}

/* ==========================================================================
   CUSTOMER DIRECTORY TABLE & DETAIL DOSSIER
   ========================================================================== */
let custSearchQuery = '';
let custSegmentFilter = 'all';
let custRiskFilter = 'all';
let custCurrentPage = 1;
const custPageSize = 10;

function initCustomerTable() {
  const searchInput = document.getElementById('cust-table-search');
  const segmentSelect = document.getElementById('cust-filter-segment');
  const riskSelect = document.getElementById('cust-filter-risk');
  const prevBtn = document.getElementById('btn-prev-page');
  const nextBtn = document.getElementById('btn-next-page');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      custSearchQuery = e.target.value.toLowerCase().trim();
      custCurrentPage = 1;
      renderCustomerTable();
    });
  }

  if (segmentSelect) {
    segmentSelect.addEventListener('change', (e) => {
      custSegmentFilter = e.target.value;
      custCurrentPage = 1;
      renderCustomerTable();
    });
  }

  if (riskSelect) {
    riskSelect.addEventListener('change', (e) => {
      custRiskFilter = e.target.value;
      custCurrentPage = 1;
      renderCustomerTable();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (custCurrentPage > 1) {
        custCurrentPage--;
        renderCustomerTable();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredCustomers();
      if (custCurrentPage * custPageSize < filtered.length) {
        custCurrentPage++;
        renderCustomerTable();
      }
    });
  }

  renderCustomerTable();
}

function getFilteredCustomers() {
  return customerDirectory.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(custSearchQuery) || c.id.toLowerCase().includes(custSearchQuery);
    const matchesSegment = custSegmentFilter === 'all' || c.segment === custSegmentFilter;
    const matchesRisk = custRiskFilter === 'all' || c.level === custRiskFilter;
    return matchesSearch && matchesSegment && matchesRisk;
  });
}

function renderCustomerTable() {
  const tbody = document.getElementById('customers-directory-tbody');
  const startEl = document.getElementById('pag-start');
  const endEl = document.getElementById('pag-end');
  const totalEl = document.getElementById('pag-total');

  if (!tbody) return;

  const filtered = getFilteredCustomers();
  const total = filtered.length;
  const startIndex = (custCurrentPage - 1) * custPageSize;
  const pageItems = filtered.slice(startIndex, startIndex + custPageSize);

  if (startEl) startEl.textContent = total === 0 ? '0' : String(startIndex + 1);
  if (endEl) endEl.textContent = String(Math.min(startIndex + custPageSize, total));
  if (totalEl) totalEl.textContent = String(total);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2rem; color: var(--text-muted);">No accounts matched your criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(c => {
    let badgeClass = 'good';
    if (c.risk > 75) badgeClass = 'danger';
    else if (c.risk > 50) badgeClass = 'warning';
    else if (c.risk > 25) badgeClass = 'neutral';

    const velColor = c.velocity < 0 ? 'var(--risk-critical)' : 'var(--health-good)';

    return `
      <tr onclick="window.location.hash='#/customers/${c.id}'">
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${c.name}</div>
          <div style="font-size: 0.6875rem; color: var(--text-muted);">${c.id}</div>
        </td>
        <td>${c.segment}</td>
        <td class="tnum">Month ${c.tenure}</td>
        <td>${c.lastActive}</td>
        <td class="tnum" style="font-weight: 700; color: ${velColor};">${c.velocity > 0 ? '+' : ''}${c.velocity}%</td>
        <td class="tnum" style="font-weight: 600; color: var(--text-primary);">$${c.mrr}.00</td>
        <td class="tnum" style="font-weight: 700;">${c.risk}/100</td>
        <td><span class="kpi-badge ${badgeClass}">${c.level}</span></td>
        <td><button class="btn btn-secondary btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">Inspect &rarr;</button></td>
      </tr>
    `;
  }).join('');
}

function showCustomerDetail(custId) {
  const customer = customerDirectory.find(c => c.id === custId) || customerDirectory[0];

  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('app-layout').style.display = 'flex';

  document.querySelectorAll('.app-content .page-view').forEach(view => {
    view.classList.remove('active-route');
  });

  const detailView = document.getElementById('customer-detail-page');
  if (detailView) detailView.classList.add('active-route');

  document.getElementById('page-header-title').textContent = `${customer.name} — Customer Dossier`;
  document.getElementById('page-header-desc').textContent = `Account ID: ${customer.id} • Real-time telemetry signals & retention intervention.`;

  document.getElementById('dossier-name').textContent = customer.name;
  document.getElementById('dossier-meta').textContent = `ID: ${customer.id} • ${customer.segment} Tier • Month ${customer.tenure} Tenure`;
  document.getElementById('dossier-mrr').textContent = `$${customer.mrr}.00 / mo`;

  const badge = document.getElementById('dossier-risk-badge');
  if (badge) {
    badge.textContent = `Risk: ${customer.risk}/100 (${customer.level})`;
    badge.className = customer.risk > 70 ? 'kpi-badge danger' : (customer.risk > 40 ? 'kpi-badge warning' : 'kpi-badge good');
  }

  document.getElementById('dossier-inact').textContent = `${customer.inact} Days Inactive`;
  document.getElementById('dossier-vel').textContent = `${customer.velocity > 0 ? '+' : ''}${customer.velocity}% Velocity`;
  document.getElementById('dossier-billing').textContent = `${customer.billing} Failed Payments`;
  document.getElementById('dossier-tickets').textContent = `${customer.tickets} Open Tickets`;
  document.getElementById('dossier-action-title').textContent = customer.action;

  const actionBtn = document.getElementById('btn-trigger-dossier-action');
  if (actionBtn) {
    actionBtn.onclick = () => {
      alert(`Retention action dispatched for ${customer.name}:\n\n"${customer.action}"\n\nTask created in CRM & Slack notification dispatched.`);
    };
  }
}

/* ==========================================================================
   0-100 RISK ENGINE SIMULATOR (DEDICATED PAGE /risk)
   ========================================================================== */
function initRiskEngineSandbox() {
  const inactSlider = document.getElementById('page-sim-inact-slider');
  const velSlider = document.getElementById('page-sim-vel-slider');
  const inactVal = document.getElementById('page-sim-inact-val');
  const velVal = document.getElementById('page-sim-vel-val');

  let failedPmts = 0;
  let unresTickets = 0;
  let featureAdopted = 1;

  function bindToggle(selector, attr, cb) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll(selector).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cb(parseInt(btn.getAttribute(attr), 10));
        recalculate();
      });
    });
  }

  bindToggle('[data-page-billing]', 'data-page-billing', v => { failedPmts = v; });
  bindToggle('[data-page-support]', 'data-page-support', v => { unresTickets = v; });
  bindToggle('[data-page-adoption]', 'data-page-adoption', v => { featureAdopted = v; });

  if (inactSlider) {
    inactSlider.addEventListener('input', () => {
      if (inactVal) inactVal.textContent = `${inactSlider.value} days`;
      recalculate();
    });
  }

  if (velSlider) {
    velSlider.addEventListener('input', () => {
      const v = parseInt(velSlider.value, 10);
      if (velVal) velVal.textContent = v > 0 ? `+${v}%` : `${v}%`;
      recalculate();
    });
  }

  function recalculate() {
    const days = parseInt(inactSlider ? inactSlider.value : 5, 10);
    const vel = parseInt(velSlider ? velSlider.value : -20, 10);

    let sInact = days <= 3 ? 0 : (days <= 7 ? 6 + (days - 3) * 1.5 : (days <= 14 ? 12 + (days - 7) * 1.2 : 25));
    sInact = Math.min(25, sInact);

    let sVel = vel < 0 ? Math.min(20, Math.abs(vel) * 0.25) : 0;
    if (vel < -40) sVel += 5;
    sVel = Math.min(25, sVel);

    let sBill = failedPmts === 1 ? 8 : (failedPmts >= 2 ? 15 : 0);
    let sSupp = unresTickets === 1 ? 5 : (unresTickets >= 2 ? 10 : 0);
    let sAdopt = featureAdopted === 0 ? 18 : 0;

    const total = Math.min(100, Math.round(sInact + sVel + sBill + sSupp + sAdopt));

    const scorePill = document.getElementById('page-sim-score-pill');
    const badge = document.getElementById('page-sim-tier-badge');
    if (scorePill) scorePill.textContent = `Score: ${total} / 100`;

    if (badge) {
      if (total > 75) {
        badge.textContent = 'Critical Risk';
        badge.className = 'kpi-badge danger';
      } else if (total > 50) {
        badge.textContent = 'High Risk';
        badge.className = 'kpi-badge warning';
      } else if (total > 25) {
        badge.textContent = 'Moderate Risk';
        badge.className = 'kpi-badge neutral';
      } else {
        badge.textContent = 'Low Risk';
        badge.className = 'kpi-badge good';
      }
    }

    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setTxt('page-sub-inact', `+${sInact.toFixed(1)} pts`);
    setTxt('page-sub-vel', `+${sVel.toFixed(1)} pts`);
    setTxt('page-decomp-inact', `+${sInact.toFixed(1)} pts`);
    setTxt('page-decomp-vel', `+${sVel.toFixed(1)} pts`);
    setTxt('page-decomp-bill', `+${sBill.toFixed(1)} pts`);
    setTxt('page-decomp-supp', `+${sSupp.toFixed(1)} pts`);
    setTxt('page-decomp-adopt', `+${sAdopt.toFixed(1)} pts`);
  }

  recalculate();
}

/* ==========================================================================
   2D QUADRANT CUSTOMER RISK MATRIX (CANVAS)
   ========================================================================== */
function initRiskMatrixCanvas() {
  const canvas = document.getElementById('pageMatrixCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 320 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawMatrix();
  }

  window.addEventListener('resize', resize);

  function drawMatrix() {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, width, height);

    const padding = 35;
    const midX = padding + ((0 - (-80)) / (40 - (-80))) * (width - padding * 2);
    const midY = height - padding - ((200 - 20) / (520 - 20)) * (height - padding * 2);

    // High Risk Zone Tint
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.fillRect(padding, padding, midX - padding, midY - padding);

    // Healthy Growth Zone Tint
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fillRect(midX, padding, width - padding - midX, midY - padding);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(midX, padding);
    ctx.lineTo(midX, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, midY);
    ctx.lineTo(width - padding, midY);
    ctx.stroke();

    ctx.setLineDash([]);

    // Axis Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('← High Usage Decline (%)', padding + 70, height - 10);
    ctx.fillText('Healthy Growth (%) →', width - padding - 70, height - 10);

    // Draw Points
    customerDirectory.forEach(acc => {
      const xNorm = (acc.velocity - (-80)) / (40 - (-80));
      const x = padding + xNorm * (width - padding * 2);
      const yNorm = (acc.mrr - 20) / (520 - 20);
      const y = height - padding - yNorm * (height - padding * 2);

      let color = acc.risk > 70 ? '#F43F5E' : (acc.risk > 40 ? '#F59E0B' : '#10B981');
      const r = 5 + (acc.mrr / 500) * 6;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  window.renderRiskMatrix = resize;
  setTimeout(resize, 100);

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const padding = 35;

    customerDirectory.forEach(acc => {
      const xNorm = (acc.velocity - (-80)) / (40 - (-80));
      const x = padding + xNorm * (width - padding * 2);
      const yNorm = (acc.mrr - 20) / (520 - 20);
      const y = height - padding - yNorm * (height - padding * 2);

      if (Math.hypot(x - mouseX, y - mouseY) <= 12) {
        window.location.hash = `#/customers/${acc.id}`;
      }
    });
  });
}

/* ==========================================================================
   ROOT CAUSE INSPECTOR (PAGE: /root-causes)
   ========================================================================== */
const rootCauseData = {
  onboarding: {
    tag: 'Driver 01 • 41.2% Share',
    title: 'Low Feature Adoption & Onboarding Cliff',
    desc: 'Accounts failing to activate core automations within 14 days exhibit an extreme hazard spike.',
    affected: '3,820 accounts',
    hazard: '38.4%',
    revenue: '$1,131,414 / yr',
    behavior: 'User logs in 2–3 times in Week 1 without setting up integrations. Activity interval extends past 10 days by Week 3.',
    actionTitle: 'Day 3 & 7 Guided Setup Walkthrough',
    actionDesc: 'Trigger contextual checklist on next session. If inactive at Day 7, dispatch 1-click CSM onboarding assistance.'
  },
  billing: {
    tag: 'Driver 02 • 24.6% Share',
    title: 'Involuntary Billing & Payment Declines',
    desc: 'Credit card expiration and gateway declines without automated dunning lead to silent involuntary cancellations.',
    affected: '1,180 accounts',
    hazard: '68.4%',
    revenue: '$675,553 / yr',
    behavior: 'Monthly charge fails. Account remains active for 3 days before automated access restriction causes user abandonment.',
    actionTitle: 'Smart Dunning Retry Sequence & 7-Day Grace Window',
    actionDesc: 'Deploy 4-stage intelligent dunning schedule with 1-click frictionless card update portal.'
  },
  support: {
    tag: 'Driver 03 • 18.1% Share',
    title: 'Operational Support Friction & Escalations',
    desc: 'Accounts with unresolved technical tickets experience rapid sentiment erosion, spiking churn to 54.6%.',
    affected: '894 accounts',
    hazard: '54.6%',
    revenue: '$497,053 / yr',
    behavior: 'Customer files 2+ high-priority tickets within 30 days without SLA resolution. Product usage drops by 60%.',
    actionTitle: 'VIP 4-Hour CSM Support Escalation SLA',
    actionDesc: 'Route accounts with Risk Score >= 60 directly to senior technical success leads with mandatory 4-hour callback.'
  },
  downgrade: {
    tag: 'Driver 04 • 9.5% Share',
    title: 'Precursor Plan Downgrades',
    desc: 'Customers who execute a tier downgrade exhibit a 62.8% churn rate within the following 60 days.',
    affected: '520 accounts',
    hazard: '62.8%',
    revenue: '$260,884 / yr',
    behavior: 'Customer moves from Pro/Enterprise to lower tier. 4 weeks later, feature utilization drops below viable threshold.',
    actionTitle: 'Executive Downgrade Intervention Protocol',
    actionDesc: 'Assign dedicated Account Executive check-in within 24 hours of downgrade trigger to offer custom usage-based packages.'
  },
  attrition: {
    tag: 'Driver 05 • 6.6% Share',
    title: 'Natural Market Attrition & Competitor Shift',
    desc: 'Baseline industry churn driven by client restructuring and direct competitor procurement.',
    affected: '380 accounts',
    hazard: '18.2%',
    revenue: '$181,248 / yr',
    behavior: 'Gradual low-frequency usage without explicit support tickets or billing failures. Termination requested at renewal.',
    actionTitle: 'Quarterly Executive Value Review & NPS Pulse',
    actionDesc: 'Automate quarterly business review summaries demonstrating cumulative hours saved and ROI delivered.'
  }
};

function initRootCauseInspector() {
  const items = document.querySelectorAll('#rc-driver-list .driver-bar-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      const key = item.getAttribute('data-driver');
      const data = rootCauseData[key];
      if (!data) return;

      const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setTxt('rc-inspector-tag', data.tag);
      setTxt('rc-inspector-title', data.title);
      setTxt('rc-inspector-desc', data.desc);
      setTxt('rc-inspector-affected', data.affected);
      setTxt('rc-inspector-hazard', data.hazard);
      setTxt('rc-inspector-revenue', data.revenue);
      setTxt('rc-inspector-behavior', data.behavior);
      setTxt('rc-inspector-action-title', data.actionTitle);
      setTxt('rc-inspector-action-desc', data.actionDesc);
    });
  });
}

/* ==========================================================================
   PLAYBOOK DISPATCH SIMULATION (PAGE: /playbooks)
   ========================================================================== */
function initPlaybookSimulation() {
  const btn = document.getElementById('btn-page-run-sim');
  const toastContainer = document.getElementById('playbook-toast-container');

  if (!btn || !toastContainer) return;

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <span>Evaluating 660 Active Accounts...</span>
    `;

    setTimeout(() => {
      toastContainer.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--health-good-border); border-left: 4px solid var(--health-good); border-radius: var(--radius-md); padding: 0.85rem 1rem; text-align: left; box-shadow: 0 0 16px rgba(16, 185, 129, 0.15); animation: page-entrance 0.3s ease;">
          <div style="color: var(--health-good-text); font-weight: 700; font-size: 0.8125rem; margin-bottom: 0.2rem;">
            Playbook Automation Dispatched Successfully
          </div>
          <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
            Triggered <strong>18 VIP Slack alerts</strong> to <code>#retention-war-room</code>, scheduled <strong>42 Smart Dunning retries</strong> with 7-day grace locks, and delivered <strong>112 in-app setup checklists</strong>.
          </p>
        </div>
      `;

      btn.disabled = false;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Re-Run Playbook Simulation</span>
      `;
    }, 900);
  });
}
