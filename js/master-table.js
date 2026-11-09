/**
 * MÓDULO 4: TABLA MAESTRA DE TARIFAS 2027
 * Consulta completa de los 48 productos con filtrado, ordenación, cálculo dinámico y exportación CSV.
 */

const MasterTableModule = {
  activeCategory: 'all',
  searchQuery: '',
  sortField: 'code',
  sortDirection: 'asc',

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.render();
  },

  cacheDOM() {
    this.tableBody = document.getElementById('master-table-body');
    this.searchInput = document.getElementById('master-search-input');
    this.categoryBar = document.getElementById('master-category-bar');
    this.btnExportCSV = document.getElementById('master-btn-export-csv');
    this.rowCountEl = document.getElementById('master-row-count');
  },

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.render();
      });
    }

    if (this.categoryBar) {
      this.categoryBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.cat-pill');
        if (!pill) return;
        this.categoryBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.dataset.category;
        this.render();
      });
    }

    if (this.btnExportCSV) {
      this.btnExportCSV.addEventListener('click', () => {
        this.exportToCSV();
      });
    }

    // Column headers for sorting
    document.querySelectorAll('.master-th-sortable').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (this.sortField === field) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortField = field;
          this.sortDirection = 'asc';
        }
        this.render();
      });
    });
  },

  render() {
    if (!this.tableBody) return;
    const channel = AppState.getActiveChannel();
    const options = AppState.getOptions();

    let list = PRODUCTS_DB.filter(p => {
      const matchCategory = this.activeCategory === 'all' || 
        p.category === this.activeCategory ||
        (this.activeCategory === 'aguas' && (p.subCategory === 'Aguas' || p.category === 'aguas_pet' || p.category === 'aguas_vr')) ||
        (this.activeCategory === 'mixers_energy' && (p.subCategory === 'Mixers' || p.subCategory === 'Energéticas'));

      const matchSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.brand.toLowerCase().includes(this.searchQuery) ||
        p.format.toLowerCase().includes(this.searchQuery) ||
        (p.code && p.code.toLowerCase().includes(this.searchQuery));

      return matchCategory && matchSearch;
    });

    // Sorting
    list.sort((a, b) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];

      if (this.sortField === 'discount') {
        valA = a.discounts[channel] || a.discounts.t3 || 0;
        valB = b.discounts[channel] || b.discounts.t3 || 0;
      } else if (this.sortField === 'netoCaja') {
        valA = PriceEngine.calculateProduct(a, a.discounts[channel] || 0).netoCajaSinPV;
        valB = PriceEngine.calculateProduct(b, b.discounts[channel] || 0).netoCajaSinPV;
      }

      if (typeof valA === 'string') {
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    if (this.rowCountEl) {
      this.rowCountEl.textContent = `${list.length} productos`;
    }

    if (list.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No se encontraron productos con los criterios de búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    this.tableBody.innerHTML = list.map((p, idx) => {
      const discount = (p.discounts && p.discounts[channel] !== undefined)
        ? p.discounts[channel]
        : (p.discounts?.t3 || 0);

      const res = PriceEngine.calculateProduct(p, discount, options);

      return `
        <tr>
          <td style="font-weight: 700; color: var(--text-muted); font-size: 0.8rem;">
            ${p.code || (idx + 1)}
          </td>
          <td>
            <span class="badge-format">${p.format}</span>
          </td>
          <td>
            <div style="font-weight: 800; color: var(--text-main);">${p.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${p.subCategory} · ${p.brand}</div>
          </td>
          <td style="text-align: center; font-weight: 700;">${p.unitsPerBox}</td>
          <td style="text-align: right; font-weight: 700;">${PriceEngine.formatCurrency(p.tarifaBase)}</td>
          <td style="text-align: right;">
            <span style="font-weight: 800; color: var(--primary);">${PriceEngine.formatPercent(discount)}</span>
          </td>
          <td style="text-align: right; font-weight: 800; color: var(--text-main);">
            ${PriceEngine.formatCurrency(res.netoCajaSinPV)}
          </td>
          <td style="text-align: right; font-weight: 700; color: var(--text-muted);">
            ${PriceEngine.formatUnitCurrency(res.netoUdSinPV)}
          </td>
          <td style="text-align: right; font-size: 0.78rem; color: var(--text-muted);">
            ${p.pvCaja.toFixed(3)} €
          </td>
          <td style="text-align: right; font-weight: 800; color: var(--success-text); background: var(--success-bg);">
            ${PriceEngine.formatCurrency(res.netoCajaConPV)}
          </td>
          <td style="text-align: right; font-weight: 700; color: var(--success-text);">
            ${PriceEngine.formatUnitCurrency(res.netoUdConPV)}
          </td>
          <td style="text-align: center; font-size: 0.78rem; font-weight: 700;">${p.iva}%</td>
          <td style="text-align: center; white-space: nowrap;">
            <button class="btn btn-secondary btn-sm" onclick="MasterTableModule.loadInCalculator('${p.id}')" title="Cargar en Calculadora">
              🧮
            </button>
            <button class="btn btn-secondary btn-sm" onclick="MasterTableModule.addToComparator('${p.id}')" title="Añadir al Comparador">
              ⚔️
            </button>
            <button class="btn btn-primary btn-sm" onclick="MasterTableModule.addToOrder('${p.id}')" title="Añadir 1 caja al pedido">
              🛒
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  loadInCalculator(productId) {
    CalculatorModule.selectProduct(productId);
    AppNavigation.switchTab('tab-calculator');
    AppNotification.show('Producto cargado en Calculadora');
  },

  addToComparator(productId) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;
    ComparatorModule.addProductToComparison(product);
    AppNotification.show(`⚔️ ${product.name} añadido a la Comparativa`);
  },

  addToOrder(productId) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;
    const channel = AppState.getActiveChannel();
    const discount = product.discounts[channel] || product.discounts.t3 || 0;
    OrdersModule.addProductToOrder(product, discount, 1);
    AppNotification.show(`🛒 1 caja de ${product.name} añadida`);
  },

  exportToCSV() {
    const channel = AppState.getActiveChannel();
    const channelLabel = AppState.getChannelLabel();

    const headers = [
      'Cód. CCEP', 'Ref Interna', 'Producto', 'Formato', 'Categoría', 'Uds/Caja',
      'Tarifa Base 2027 (€)', `Dcto ${channelLabel} (%)`, 'Neto Caja Sin PV (€)',
      'Neto Ud Sin PV (€)', 'PV Caja (€)', 'Neto Con PV Caja (€)', 'Neto Con PV Ud (€)', 'IVA (%)'
    ];

    const rows = PRODUCTS_DB.map(p => {
      const discount = p.discounts[channel] !== undefined ? p.discounts[channel] : (p.discounts.t3 || 0);
      const res = PriceEngine.calculateProduct(p, discount);

      return [
        `"${p.ccepCode || ''}"`,
        `"${p.code || ''}"`,
        `"${p.name}"`,
        `"${p.format}"`,
        `"${p.subCategory}"`,
        p.unitsPerBox,
        p.tarifaBase.toFixed(2),
        discount.toFixed(2),
        res.netoCajaSinPV.toFixed(2),
        res.netoUdSinPV.toFixed(3),
        p.pvCaja.toFixed(3),
        res.netoCajaConPV.toFixed(2),
        res.netoUdConPV.toFixed(3),
        p.iva
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Tarifa_Oficial_2027_${channel}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    AppNotification.show('📥 Archivo CSV descargado con éxito');
  }
};
