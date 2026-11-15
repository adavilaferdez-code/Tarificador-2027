/**
 * TARIFICADOR COMERCIAL PRO 2027 - MAIN APPLICATION CONTROLLER
 * State management, theme toggle, channel selection, PWA registration, and routing.
 */

const AppState = {
  activeChannel: 't3', // Tramo 3 by default as required!
  includePV: false,
  includeIVA: false,
  theme: 'light',
  clientMode: false,

  init() {
    // Channel defaults to 't3' (Tramo 3) unless user changed it
    const savedChannel = localStorage.getItem('tarificador_channel');
    this.activeChannel = savedChannel || 't3';

    this.includePV = localStorage.getItem('tarificador_include_pv') === '1';
    this.includeIVA = localStorage.getItem('tarificador_include_iva') === '1';
    this.clientMode = localStorage.getItem('tarificador_client_mode') === '1';

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
    this.applyClientMode();
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

  toggleClientMode() {
    this.clientMode = !this.clientMode;
    localStorage.setItem('tarificador_client_mode', this.clientMode ? '1' : '0');
    this.applyClientMode();
    if (typeof AppNotification !== 'undefined') {
      AppNotification.show(
        this.clientMode
          ? '👁️ Vista Cliente ACTIVADA: descuentos y tramos internos ocultos'
          : '🔓 Vista Comercial restaurada'
      );
    }
  },

  applyClientMode() {
    document.documentElement.setAttribute('data-client-mode', this.clientMode ? 'true' : 'false');
    const btn = document.getElementById('client-mode-toggle-btn');
    const icon = document.getElementById('client-mode-icon');
    const label = document.getElementById('client-mode-label');
    if (btn) {
      btn.classList.toggle('active', this.clientMode);
      btn.setAttribute('aria-pressed', this.clientMode ? 'true' : 'false');
    }
    if (icon) icon.textContent = this.clientMode ? '🔒' : '👁️';
    if (label) label.textContent = this.clientMode ? 'Vista Cliente ON' : 'Vista Cliente';
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
    try { if (typeof CalculatorModule !== 'undefined' && CalculatorModule.onChannelOrOptionChange) CalculatorModule.onChannelOrOptionChange(); } catch (e) { console.error(e); }
    try { if (typeof ComparatorModule !== 'undefined' && ComparatorModule.render) ComparatorModule.render(); } catch (e) { console.error(e); }
    try { if (typeof OrdersModule !== 'undefined' && OrdersModule.render) OrdersModule.render(); } catch (e) { console.error(e); }
    try { if (typeof MasterTableModule !== 'undefined' && MasterTableModule.render) MasterTableModule.render(); } catch (e) { console.error(e); }
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

const ProductPickerHelper = {
  TOP_IDS: [
    'vr-cc-regular-237',
    'vr-cc-zero-237',
    'vr-fanta-naranja-237',
    'vr-fanta-limon-frambuesa-237',
    'vr-aquarius-limon-30',
    'pet-aquabona-50',
    'lata-cc-33',
    'pet-cc-2l'
  ],

  BLOCKS: [
    { id: 'top', icon: '⭐', label: 'Top Ventas', match: (p) => ProductPickerHelper.TOP_IDS.includes(p.id) },
    { id: 'vr', icon: '🍾', label: 'Vidrio VR', match: (p) => p.category === 'vidrio_vr' },
    { id: 'latas', icon: '🥫', label: 'Latas', match: (p) => p.category === 'latas' },
    { id: 'pet500', icon: '🧴', label: 'PET 500', match: (p) => p.category === 'pet' && (p.format.includes('50 cl') || p.format.includes('575') || p.format.includes('35 cl')) },
    { id: 'pet2l', icon: '🍾', label: 'PET 1L-2L', match: (p) => p.category === 'pet' && (p.format.includes('1 L') || p.format.includes('1,25') || p.format.includes('1,5') || p.format.includes('2 L')) },
    { id: 'aguas', icon: '💧', label: 'Aguas', match: (p) => (p.subCategory || '').toLowerCase().includes('agua') },
    { id: 'mixers', icon: '⚡', label: 'Mixers/Energ.', match: (p) => { const s = (p.subCategory || '').toLowerCase(); return s.includes('mixer') || s.includes('energ'); } },
    { id: 'all', icon: '📋', label: 'Todos', match: () => true }
  ],

  normalizeText(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[-_]/g, ' ')
      .trim();
  },

  open({ title, getQty, onAdd, onDecrement, getSummaryText, onDone, useGlobalOptions = true }) {
    const modal = document.getElementById('product-picker-modal');
    const titleEl = document.getElementById('modal-picker-title');
    const blocksEl = document.getElementById('modal-picker-blocks');
    const search = document.getElementById('modal-picker-search');
    const list = document.getElementById('modal-picker-list');
    const summaryEl = document.getElementById('modal-picker-summary');
    const doneBtn = document.getElementById('modal-picker-done');
    const closeBtn = document.getElementById('modal-picker-close');
    if (!modal || !list) return;

    if (titleEl && title) titleEl.textContent = title;
    modal.style.display = 'flex';

    let activeBlock = 'top';
    if (search) search.value = '';

    const updateSummary = () => {
      if (summaryEl && getSummaryText) {
        summaryEl.textContent = getSummaryText();
      }
    };

    const renderBlocks = () => {
      if (!blocksEl) return;
      blocksEl.innerHTML = this.BLOCKS.map(b => `
        <button type="button" class="picker-block-btn ${b.id === activeBlock ? 'active' : ''}" data-block="${b.id}">
          <span class="picker-block-icon">${b.icon}</span>
          <span class="picker-block-label">${b.label}</span>
        </button>
      `).join('');

      blocksEl.querySelectorAll('.picker-block-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeBlock = btn.dataset.block;
          if (search) search.value = '';
          renderBlocks();
          renderList();
        });
      });
    };

    const renderList = () => {
      const q = this.normalizeText(search ? search.value : '');
      const blockDef = this.BLOCKS.find(b => b.id === activeBlock) || this.BLOCKS[0];

      const filtered = PRODUCTS_DB.filter(p => {
        if (q) {
          return this.normalizeText(p.name).includes(q)
            || this.normalizeText(p.format).includes(q)
            || this.normalizeText(p.brand || '').includes(q)
            || this.normalizeText(p.category || '').includes(q);
        }
        return blockDef.match(p);
      });

      if (filtered.length === 0) {
        list.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            🔍 No hay productos que coincidan con "<strong>${search ? search.value : ''}</strong>"
          </div>
        `;
      updateSummary();
        return;
      }

      const prevScroll = list.scrollTop;
      const channel = AppState.getActiveChannel();
      const options = useGlobalOptions ? AppState.getOptions() : { includePV: false, includeIVA: false };

      list.innerHTML = filtered.map(p => {
        const discount = (p.discounts && p.discounts[channel] !== undefined) ? p.discounts[channel] : (p.discounts?.t3 || 0);
        const res = PriceEngine.calculateProduct(p, discount, options);
        const qty = getQty ? getQty(p.id) : 0;

        return `
          <div class="modal-product-item ${qty > 0 ? 'in-cart' : ''}" data-id="${p.id}">
            <div class="picker-prod-info">
              <div style="font-weight: 800; font-size: 0.9rem; color: var(--text-main);">${p.name}</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">${p.format} · ${p.unitsPerBox} uds/caja</div>
            </div>
            <div class="picker-prod-right">
              <div style="text-align: right;">
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary);">${PriceEngine.formatCurrency(useGlobalOptions ? res.finalCaja : res.netoCajaSinPV)}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">${PriceEngine.formatUnitCurrency(useGlobalOptions ? res.finalUd : res.netoUdSinPV)}/ud<span class="internal-only"> · Dcto ${discount.toFixed(1)}%</span></div>
              </div>
              <div class="picker-stepper">
                ${qty > 0 ? `
                  <button type="button" class="picker-step-btn picker-dec-btn" data-id="${p.id}" title="Quitar 1 caja">−</button>
                  <span class="picker-qty-badge">${qty}</span>
                  <button type="button" class="picker-step-btn picker-inc-btn" data-id="${p.id}" title="Añadir 1 caja">+</button>
                ` : `
                  <button type="button" class="picker-add-one-btn picker-inc-btn" data-id="${p.id}" title="Añadir 1 caja">+1</button>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.modal-product-item').forEach(row => {
        row.addEventListener('click', () => {
          const found = PRODUCTS_DB.find(p => p.id === row.dataset.id);
          if (found && onAdd) {
            onAdd(found);
            renderList();
          }
        });
      });

      list.querySelectorAll('.picker-inc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const found = PRODUCTS_DB.find(p => p.id === btn.dataset.id);
          if (found && onAdd) {
            onAdd(found);
            renderList();
          }
        });
      });

      list.querySelectorAll('.picker-dec-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const found = PRODUCTS_DB.find(p => p.id === btn.dataset.id);
          if (found && onDecrement) {
            onDecrement(found);
            renderList();
          }
        });
      });

      list.scrollTop = prevScroll;
      updateSummary();
    };

    renderBlocks();
    renderList();

    if (search) {
      search.oninput = () => renderList();
      if (window.innerWidth >= 768) {
        setTimeout(() => { try { search.focus(); } catch (e) {} }, 50);
      }
    }

    const closeModal = () => {
      modal.style.display = 'none';
      if (onDone) onDone();
    };
    if (doneBtn) doneBtn.onclick = closeModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
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

  // Client View Mode toggle
  const clientModeBtn = document.getElementById('client-mode-toggle-btn');
  if (clientModeBtn) {
    clientModeBtn.addEventListener('click', () => {
      AppState.toggleClientMode();
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
  try { CalculatorModule.init(); } catch (e) { console.error('CalculatorModule init error:', e); }
  try { ComparatorModule.init(); } catch (e) { console.error('ComparatorModule init error:', e); }
  try { OrdersModule.init(); } catch (e) { console.error('OrdersModule init error:', e); }
  try { MasterTableModule.init(); } catch (e) { console.error('MasterTableModule init error:', e); }

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('PWA ServiceWorker registered with scope:', reg.scope))
        .catch(err => console.log('ServiceWorker registration error:', err));
    });
  }
});
