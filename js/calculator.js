/**
 * MÓDULO 1: CALCULADORA BIDIRECCIONAL (TARIFICADOR COMERCIAL)
 * Permite cambiar % Dcto, Precio Caja o Precio Ud con recálculo instantáneo.
 */

const CalculatorModule = {
  currentProduct: null,
  currentDiscount: 0,
  activeCategory: 'all',
  searchQuery: '',

  init() {
    this.cacheDOM();
    this.bindEvents();

    // Load saved or default product
    const savedProductId = localStorage.getItem('tarificador_selected_product') || 'vr-cc-regular-237';
    this.selectProduct(savedProductId);
    this.renderProductGrid();
  },

  cacheDOM() {
    this.categoryBar = document.getElementById('calc-category-bar');
    this.searchInput = document.getElementById('calc-search-input');
    this.searchClearBtn = document.getElementById('calc-search-clear');
    this.productGrid = document.getElementById('calc-product-grid');

    // 4 Key Figures
    this.keyTarifaBase = document.getElementById('key-tarifa-base');
    this.keyDiscount = document.getElementById('key-discount');
    this.keyCajaFinal = document.getElementById('key-caja-final');
    this.keyUnidadFinal = document.getElementById('key-unidad-final');
    this.keyCajaSubtext = document.getElementById('key-caja-subtext');
    this.keyUnidadSubtext = document.getElementById('key-unidad-subtext');

    // Calculator Inputs
    this.calcProdName = document.getElementById('calc-prod-name');
    this.calcProdCode = document.getElementById('calc-prod-code');
    this.calcProdFormat = document.getElementById('calc-prod-format');
    this.calcProdUnits = document.getElementById('calc-prod-units');
    this.calcProdPV = document.getElementById('calc-prod-pv');
    this.calcProdIVA = document.getElementById('calc-prod-iva');

    this.inputDiscount = document.getElementById('calc-input-discount');
    this.sliderDiscount = document.getElementById('calc-slider-discount');
    this.inputBoxPrice = document.getElementById('calc-input-box');
    this.inputUnitPrice = document.getElementById('calc-input-unit');

    // Pitch banner
    this.pitchBanner = document.getElementById('calc-pitch-banner');
    this.pitchText = document.getElementById('calc-pitch-text');

    // Buttons
    this.btnTarget16 = document.getElementById('calc-btn-target16');
    this.btnResetT3 = document.getElementById('calc-btn-reset-t3');
    this.btnAddToOrder = document.getElementById('calc-btn-add-order');
    this.btnCompare = document.getElementById('calc-btn-compare');
  },

  bindEvents() {
    // Category pills
    if (this.categoryBar) {
      this.categoryBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.cat-pill');
        if (!pill) return;
        this.categoryBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.dataset.category;
        this.renderProductGrid();
      });
    }

    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (this.searchClearBtn) {
          this.searchClearBtn.style.display = this.searchQuery ? 'block' : 'none';
        }
        this.renderProductGrid();
      });
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.searchClearBtn.style.display = 'none';
        this.renderProductGrid();
      });
    }

    // Bidirectional event listeners
    // 1. Discount change
    if (this.inputDiscount) {
      this.inputDiscount.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        this.currentDiscount = Math.min(100, Math.max(0, val));
        if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;
        this.recalculateAll('discount');
      });
    }

    if (this.sliderDiscount) {
      this.sliderDiscount.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        this.currentDiscount = val;
        if (this.inputDiscount) this.inputDiscount.value = val.toFixed(2);
        this.recalculateAll('discount');
      });
    }

    // Step buttons (+1, -1, +5, -5)
    document.querySelectorAll('.calc-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const delta = parseFloat(e.target.dataset.delta) || 0;
        this.currentDiscount = Math.min(100, Math.max(0, this.currentDiscount + delta));
        if (this.inputDiscount) this.inputDiscount.value = this.currentDiscount.toFixed(2);
        if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;
        this.recalculateAll('discount');
      });
    });

    // 2. Box price change (REVERSE CALCULATION)
    if (this.inputBoxPrice) {
      this.inputBoxPrice.addEventListener('input', (e) => {
        const targetBoxPrice = parseFloat(e.target.value);
        if (!isNaN(targetBoxPrice) && this.currentProduct) {
          // Adjust for Punto Verde / IVA if enabled
          const options = AppState.getOptions();
          let baseTarget = targetBoxPrice;

          if (options.includeIVA) {
            baseTarget = baseTarget / (1 + this.currentProduct.iva / 100);
          }
          if (options.includePV) {
            baseTarget = Math.max(0, baseTarget - this.currentProduct.pvCaja);
          }

          const newDiscount = PriceEngine.getDiscountFromTargetBox(this.currentProduct.tarifaBase, baseTarget);
          this.currentDiscount = Math.min(100, Math.max(0, newDiscount));
          if (this.inputDiscount) this.inputDiscount.value = this.currentDiscount.toFixed(2);
          if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;
          this.recalculateAll('box');
        }
      });
    }

    // 3. Unit price change (REVERSE CALCULATION)
    if (this.inputUnitPrice) {
      this.inputUnitPrice.addEventListener('input', (e) => {
        const targetUnitPrice = parseFloat(e.target.value);
        if (!isNaN(targetUnitPrice) && this.currentProduct) {
          const options = AppState.getOptions();
          let baseUnitTarget = targetUnitPrice;

          if (options.includeIVA) {
            baseUnitTarget = baseUnitTarget / (1 + this.currentProduct.iva / 100);
          }
          if (options.includePV) {
            const unitPV = this.currentProduct.pvCaja / this.currentProduct.unitsPerBox;
            baseUnitTarget = Math.max(0, baseUnitTarget - unitPV);
          }

          const targetBox = baseUnitTarget * this.currentProduct.unitsPerBox;
          const newDiscount = PriceEngine.getDiscountFromTargetBox(this.currentProduct.tarifaBase, targetBox);
          this.currentDiscount = Math.min(100, Math.max(0, newDiscount));
          if (this.inputDiscount) this.inputDiscount.value = this.currentDiscount.toFixed(2);
          if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;
          this.recalculateAll('unit');
        }
      });
    }

    // Quick Actions
    // "Igualar a 16,00 €"
    if (this.btnTarget16) {
      this.btnTarget16.addEventListener('click', () => {
        this.setTargetBoxPrice(16.00);
        AppNotification.show('🎯 Precio fijado a 16,00 €/caja');
      });
    }

    // "Reset a Tramo 3"
    if (this.btnResetT3) {
      this.btnResetT3.addEventListener('click', () => {
        if (!this.currentProduct) return;
        const channel = AppState.getActiveChannel();
        const defaultDiscount = this.currentProduct.discounts[channel] !== undefined 
          ? this.currentProduct.discounts[channel] 
          : (this.currentProduct.discounts.t3 || 0);

        this.currentDiscount = defaultDiscount;
        if (this.inputDiscount) this.inputDiscount.value = this.currentDiscount.toFixed(2);
        if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;
        this.recalculateAll('discount');
        AppNotification.show(`🔄 Restaurado a ${AppState.getChannelLabel()}`);
      });
    }

    // "Añadir a Pedido"
    if (this.btnAddToOrder) {
      this.btnAddToOrder.addEventListener('click', () => {
        if (!this.currentProduct) return;
        OrdersModule.addProductToOrder(this.currentProduct, this.currentDiscount, 1);
        AppNavigation.switchTab('tab-orders');
        AppNotification.show(`🛒 1 caja de ${this.currentProduct.name} añadida al pedido`);
      });
    }

    // "Comparar en Albarán"
    if (this.btnCompare) {
      this.btnCompare.addEventListener('click', () => {
        if (!this.currentProduct) return;
        ComparatorModule.addProductToComparison(this.currentProduct);
        AppNavigation.switchTab('tab-comparator');
        AppNotification.show(`⚔️ Producto añadido al Comparador`);
      });
    }
  },

  setTargetBoxPrice(targetPrice) {
    if (!this.currentProduct) return;
    const options = AppState.getOptions();
    let baseTarget = targetPrice;

    if (options.includeIVA) {
      baseTarget = baseTarget / (1 + this.currentProduct.iva / 100);
    }
    if (options.includePV) {
      baseTarget = Math.max(0, baseTarget - this.currentProduct.pvCaja);
    }

    this.currentDiscount = Math.min(100, Math.max(0, PriceEngine.getDiscountFromTargetBox(this.currentProduct.tarifaBase, baseTarget)));
    if (this.inputDiscount) this.inputDiscount.value = this.currentDiscount.toFixed(2);
    if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;
    this.recalculateAll('discount');
  },

  selectProduct(productId) {
    const product = PRODUCTS_DB.find(p => p.id === productId) || PRODUCTS_DB[0];
    this.currentProduct = product;
    localStorage.setItem('tarificador_selected_product', product.id);

    // Apply active channel discount
    const channel = AppState.getActiveChannel();
    this.currentDiscount = (product.discounts && product.discounts[channel] !== undefined)
      ? product.discounts[channel]
      : (product.discounts?.t3 || 0);

    // Update UI
    if (this.calcProdName) this.calcProdName.textContent = product.name;
    if (this.calcProdCode) this.calcProdCode.textContent = product.code || 'REF';
    if (this.calcProdFormat) this.calcProdFormat.textContent = product.format;
    if (this.calcProdUnits) this.calcProdUnits.textContent = `${product.unitsPerBox} uds/caja`;
    if (this.calcProdPV) this.calcProdPV.textContent = `${product.pvCaja.toFixed(3)} € PV/caja`;
    if (this.calcProdIVA) this.calcProdIVA.textContent = `IVA ${product.iva}%`;

    if (this.inputDiscount) this.inputDiscount.value = this.currentDiscount.toFixed(2);
    if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;

    // Pitch banner
    if (this.pitchBanner && this.pitchText) {
      if (product.highlightSalesPitch) {
        this.pitchBanner.style.display = 'flex';
        this.pitchText.textContent = product.highlightSalesPitch;
      } else {
        this.pitchBanner.style.display = 'none';
      }
    }

    this.recalculateAll('discount');
    this.highlightSelectedCard();
  },

  onChannelOrOptionChange() {
    if (!this.currentProduct) return;
    const channel = AppState.getActiveChannel();
    this.currentDiscount = (this.currentProduct.discounts && this.currentProduct.discounts[channel] !== undefined)
      ? this.currentProduct.discounts[channel]
      : (this.currentProduct.discounts?.t3 || 0);

    if (this.inputDiscount) this.inputDiscount.value = this.currentDiscount.toFixed(2);
    if (this.sliderDiscount) this.sliderDiscount.value = this.currentDiscount;

    this.recalculateAll('discount');
    this.renderProductGrid();
  },

  recalculateAll(origin = 'discount') {
    if (!this.currentProduct) return;
    const options = AppState.getOptions();
    const result = PriceEngine.calculateProduct(this.currentProduct, this.currentDiscount, options);

    // Update 4 Key Figures
    if (this.keyTarifaBase) {
      this.keyTarifaBase.textContent = PriceEngine.formatCurrency(result.tarifaBase);
    }
    if (this.keyDiscount) {
      this.keyDiscount.textContent = PriceEngine.formatPercent(result.discount);
    }
    if (this.keyCajaFinal) {
      this.keyCajaFinal.textContent = PriceEngine.formatCurrency(result.finalCaja);
      if (this.keyCajaSubtext) {
        this.keyCajaSubtext.textContent = `${options.includeIVA ? 'Con IVA' : 'Sin IVA'} · ${options.includePV ? 'Con PV' : 'Sin PV'}`;
      }
    }
    if (this.keyUnidadFinal) {
      this.keyUnidadFinal.textContent = PriceEngine.formatUnitCurrency(result.finalUd);
      if (this.keyUnidadSubtext) {
        this.keyUnidadSubtext.textContent = `Por botella/lata (${this.currentProduct.unitsPerBox} uds)`;
      }
    }

    // Update Box Price input if not actively typed in
    if (origin !== 'box' && this.inputBoxPrice) {
      this.inputBoxPrice.value = result.finalCaja.toFixed(2);
    }

    // Update Unit Price input if not actively typed in
    if (origin !== 'unit' && this.inputUnitPrice) {
      this.inputUnitPrice.value = result.finalUd.toFixed(3);
    }
  },

  renderProductGrid() {
    if (!this.productGrid) return;
    const options = AppState.getOptions();
    const channel = AppState.getActiveChannel();

    const filtered = PRODUCTS_DB.filter(p => {
      const matchCategory = this.activeCategory === 'all' || 
        p.category === this.activeCategory ||
        (this.activeCategory === 'aguas' && (p.subCategory === 'Aguas' || p.category === 'aguas_pet' || p.category === 'aguas_vr')) ||
        (this.activeCategory === 'mixers_energy' && (p.subCategory === 'Mixers' || p.subCategory === 'Energéticas'));

      const matchSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.brand.toLowerCase().includes(this.searchQuery) ||
        p.format.toLowerCase().includes(this.searchQuery);

      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      this.productGrid.innerHTML = `
        <div style="grid-column: 1/-1; padding: 30px; text-align: center; color: var(--text-muted);">
          🔍 No se encontraron productos con el filtro aplicado.
        </div>
      `;
      return;
    }

    this.productGrid.innerHTML = filtered.map(product => {
      const isSelected = this.currentProduct && this.currentProduct.id === product.id;
      const discount = (product.discounts && product.discounts[channel] !== undefined)
        ? product.discounts[channel]
        : (product.discounts?.t3 || 0);

      const res = PriceEngine.calculateProduct(product, discount, options);

      return `
        <div class="product-picker-card ${isSelected ? 'selected' : ''}" data-id="${product.id}">
          <div class="card-head">
            <span class="card-title">${product.name}</span>
            <span class="badge-format">${product.format}</span>
          </div>
          <div class="card-meta">
            <span>Dcto: <strong>${discount.toFixed(1)}%</strong></span>
            <span class="card-price-highlight">${PriceEngine.formatCurrency(res.finalCaja)}</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events
    this.productGrid.querySelectorAll('.product-picker-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.selectProduct(id);
      });
    });
  },

  highlightSelectedCard() {
    if (!this.productGrid || !this.currentProduct) return;
    this.productGrid.querySelectorAll('.product-picker-card').forEach(card => {
      if (card.dataset.id === this.currentProduct.id) {
        card.classList.add('selected');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('selected');
      }
    });
  }
};
