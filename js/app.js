/**
 * TARIFICADOR COMERCIAL PRO 2027 - MAIN APPLICATION CONTROLLER
 * State management, theme toggle, channel selection, PWA registration, and routing.
 */

const AppState = {
  activeChannel: 't3', // Tramo 3 by default as required!
  includePV: false,
  includeIVA: false,
  theme: 'light',

  init() {
    // Channel defaults to 't3' (Tramo 3) unless user changed it
    const savedChannel = localStorage.getItem('tarificador_channel');
    this.activeChannel = savedChannel || 't3';

    this.includePV = localStorage.getItem('tarificador_include_pv') === '1';
    this.includeIVA = localStorage.getItem('tarificador_include_iva') === '1';

    // Theme: system preference or saved
    const savedTheme = localStorage.getItem('tarificador_theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }

    this.applyTheme();
    this.syncUI();
  },

  getActiveChannel() {
    return this.activeChannel;
  },

  getChannelLabel() {
    const ch = CHANNELS.find(c => c.id === this.activeChannel);
    return ch ? ch.label : 'Tramo 3';
  },

  getOptions() {
    return {
      includePV: this.includePV,
      includeIVA: this.includeIVA
    };
  },

  setChannel(channelId) {
    this.activeChannel = channelId;
    localStorage.setItem('tarificador_channel', channelId);
    this.notifyModules();
  },

  setIncludePV(val) {
    this.includePV = !!val;
    localStorage.setItem('tarificador_include_pv', this.includePV ? '1' : '0');
    this.notifyModules();
  },

  setIncludeIVA(val) {
    this.includeIVA = !!val;
    localStorage.setItem('tarificador_include_iva', this.includeIVA ? '1' : '0');
    this.notifyModules();
  },

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('tarificador_theme', this.theme);
    this.applyTheme();
  },

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeIcon = document.getElementById('theme-toggle-icon');
    if (themeIcon) {
      themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }
  },

  syncUI() {
    const channelSelect = document.getElementById('global-channel-select');
    if (channelSelect) channelSelect.value = this.activeChannel;

    const checkPV = document.getElementById('global-check-pv');
    if (checkPV) checkPV.checked = this.includePV;

    const checkIVA = document.getElementById('global-check-iva');
    if (checkIVA) checkIVA.checked = this.includeIVA;
  },

  notifyModules() {
    if (typeof CalculatorModule !== 'undefined' && CalculatorModule.onChannelOrOptionChange) {
      CalculatorModule.onChannelOrOptionChange();
    }
    if (typeof ComparatorModule !== 'undefined' && ComparatorModule.render) {
      ComparatorModule.render();
    }
    if (typeof OrdersModule !== 'undefined' && OrdersModule.render) {
      OrdersModule.render();
    }
    if (typeof MasterTableModule !== 'undefined' && MasterTableModule.render) {
      MasterTableModule.render();
    }
  }
};

const AppNavigation = {
  currentTab: 'tab-calculator',

  init() {
    // Desktop tabs
    document.querySelectorAll('.desktop-nav .nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        this.switchTab(tabId);
      });
    });

    // Mobile tabs
    document.querySelectorAll('.mobile-nav .mobile-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        this.switchTab(tabId);
      });
    });

    // Check hash route or default
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      this.switchTab(hash);
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update desktop nav
    document.querySelectorAll('.desktop-nav .nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update mobile nav
    document.querySelectorAll('.mobile-nav .mobile-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Ensure freshly rendered on tab switch
    if (tabId === 'tab-orders' && typeof OrdersModule !== 'undefined' && OrdersModule.render) {
      OrdersModule.render();
    } else if (tabId === 'tab-comparator' && typeof ComparatorModule !== 'undefined' && ComparatorModule.render) {
      ComparatorModule.render();
    } else if (tabId === 'tab-master' && typeof MasterTableModule !== 'undefined' && MasterTableModule.render) {
      MasterTableModule.render();
    }

    // Update hash
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const AppNotification = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, duration = 3000) {
    if (!this.container) this.init();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
  AppNotification.init();
  AppNavigation.init();

  // Populate global channel selector
  const channelSelect = document.getElementById('global-channel-select');
  if (channelSelect) {
    channelSelect.innerHTML = CHANNELS.map(ch => `
      <option value="${ch.id}" ${ch.id === AppState.getActiveChannel() ? 'selected' : ''}>
        ${ch.label}
      </option>
    `).join('');

    channelSelect.addEventListener('change', (e) => {
      AppState.setChannel(e.target.value);
      AppNotification.show(`Canal cambiado a: ${AppState.getChannelLabel()}`);
    });
  }

  // Global switches
  const checkPV = document.getElementById('global-check-pv');
  if (checkPV) {
    checkPV.addEventListener('change', (e) => {
      AppState.setIncludePV(e.target.checked);
      AppNotification.show(e.target.checked ? 'Punto Verde INCLUIDO en precios' : 'Punto Verde EXCLUIDO');
    });
  }

  const checkIVA = document.getElementById('global-check-iva');
  if (checkIVA) {
    checkIVA.addEventListener('change', (e) => {
      AppState.setIncludeIVA(e.target.checked);
      AppNotification.show(e.target.checked ? 'Precios mostrados CON IVA' : 'Precios mostrados SIN IVA');
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      AppState.toggleTheme();
    });
  }

  // Initialize Modules
  CalculatorModule.init();
  ComparatorModule.init();
  OrdersModule.init();
  MasterTableModule.init();

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('PWA ServiceWorker registered with scope:', reg.scope))
        .catch(err => console.log('ServiceWorker registration error:', err));
    });
  }
});
