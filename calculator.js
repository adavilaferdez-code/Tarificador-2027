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

    // Bonificación & Rappel DOM elements (Opción 2)
    this.bonifPillsBar = document.getElementById('bonif-pills-bar');
    this.bonifCustomForm = document.getElementById('bonif-custom-form');
    this.bonifCustomBuy = document.getElementById('bonif-custom-buy');
    this.bonifCustomFree = document.getElementById('bonif-custom-free');
    this.bonifCustomRappel = document.getElementById('bonif-custom-rappel');

    this.bonifEffectiveBox = document.getElementById('bonif-effective-box');
    this.bonifBoxDiff = document.getElementById('bonif-box-diff');
    this.bonifEffectiveUnit = document.getElementById('bonif-effective-unit');
    this.bonifUnitDiff = document.getElementById('bonif-unit-diff');
    this.bonifTotalDiscount = document.getElementById('bonif-total-discount');
    this.bonifEquivText = document.getElementById('bonif-equiv-text');
    this.bonifGiftValue = document.getElementById('bonif-gift-value');
    this.bonifGiftSubtext = document.getElementById('bonif-gift-subtext');
    this.bonifPitchText = document.getElementById('bonif-pitch-text');
    this.bonifBtnApplyOrder = document.getElementById('bonif-btn-apply-order');

    this.bonifState = {
      type: 'none',
      buy: 10,
      free: 1,
      rappel: 0,
      label: 'Sin Bonificación'
    };

    // Margen & Rentabilidad del Hostelero (Opción 1)
    this.marginCostRef = document.getElementById('margin-cost-ref');
    this.marginInputPvp = document.getElementById('margin-input-pvp');
    this.marginPvpPills = document.getElementById('margin-pvp-pills');
    this.marginInputBoxesMonth = document.getElementById('margin-input-boxes-month');
    this.marginBoxesPills = document.getElementById('margin-boxes-pills');
    this.marginProfitUnit = document.getElementById('margin-profit-unit');
    this.marginPercentUnit = document.getElementById('margin-percent-unit');
    this.marginProfitBox = document.getElementById('margin-profit-box');
    this.marginProfitBoxSub = document.getElementById('margin-profit-box-sub');
    this.marginProfitMonth = document.getElementById('margin-profit-month');
    this.marginProfitYear = document.getElementById('margin-profit-year');
    this.marginDiffCents = document.getElementById('margin-diff-cents');
    this.marginPitchBadge = document.getElementById('margin-pitch-badge');
    this.marginBtnCopyPitch = document.getElementById('margin-btn-copy-pitch');

    this.marginPvp = 2.50;
    this.marginBoxesMonth = 15;
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

    // Step buttons (+1, -1, +5, -5) with direct binding for iOS
    document.querySelectorAll('.calc-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.dataset.delta) || 0;
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

    // Bonificación & Rappel Pill Click Events (Direct binding for mobile / iPad Safari)
    if (this.bonifPillsBar) {
      this.bonifPillsBar.querySelectorAll('.bonif-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.bonifPillsBar.querySelectorAll('.bonif-type-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const type = btn.dataset.type;
          if (type === 'none') {
            this.bonifState = { type: 'none', buy: 10, free: 0, rappel: 0, label: 'Sin Bonificación' };
            if (this.bonifCustomForm) this.bonifCustomForm.style.display = 'none';
          } else if (type === 'promo') {
            const buy = parseInt(btn.dataset.buy, 10) || 10;
            const free = parseInt(btn.dataset.free, 10) || 1;
            this.bonifState = { type: 'promo', buy, free, rappel: 0, label: `${buy}+${free}` };
            if (this.bonifCustomForm) this.bonifCustomForm.style.display = 'none';
          } else if (type === 'rappel') {
            const rappel = parseFloat(btn.dataset.rappel) || 1.00;
            this.bonifState = { type: 'rappel', buy: 1, free: 0, rappel, label: `Rappel ${rappel.toFixed(2)}€` };
            if (this.bonifCustomForm) this.bonifCustomForm.style.display = 'none';
          } else if (type === 'custom') {
            if (this.bonifCustomForm) this.bonifCustomForm.style.display = 'block';
            const buy = parseInt(this.bonifCustomBuy?.value, 10) || 10;
            const free = parseInt(this.bonifCustomFree?.value, 10) || 1;
            const rappel = parseFloat(this.bonifCustomRappel?.value) || 0;
            this.bonifState = { type: 'custom', buy, free, rappel, label: 'Personalizado' };
          }

          this.recalculateBonification();
        });
      });
    }

    // Custom inputs change
    const updateCustomBonif = () => {
      const buy = Math.max(1, parseInt(this.bonifCustomBuy?.value, 10) || 10);
      const free = Math.max(0, parseInt(this.bonifCustomFree?.value, 10) || 0);
      const rappel = Math.max(0, parseFloat(this.bonifCustomRappel?.value) || 0);
      this.bonifState = { type: 'custom', buy, free, rappel, label: 'Personalizado' };
      this.recalculateBonification();
    };

    if (this.bonifCustomBuy) {
      this.bonifCustomBuy.addEventListener('input', updateCustomBonif);
      this.bonifCustomBuy.addEventListener('change', updateCustomBonif);
    }
    if (this.bonifCustomFree) {
      this.bonifCustomFree.addEventListener('input', updateCustomBonif);
      this.bonifCustomFree.addEventListener('change', updateCustomBonif);
    }
    if (this.bonifCustomRappel) {
      this.bonifCustomRappel.addEventListener('input', updateCustomBonif);
      this.bonifCustomRappel.addEventListener('change', updateCustomBonif);
    }

    // Apply Bonification to Order
    if (this.bonifBtnApplyOrder) {
      this.bonifBtnApplyOrder.addEventListener('click', () => {
        if (!this.currentProduct) return;
        const state = this.bonifState || { type: 'none' };
        if (state.type === 'promo' || (state.type === 'custom' && state.free > 0)) {
          OrdersModule.addProductToOrder(this.currentProduct, this.currentDiscount, state.buy, {
            type: 'promo',
            buy: state.buy,
            free: state.free,
            label: `${state.buy}+${state.free}`
          });
          AppNavigation.switchTab('tab-orders');
          AppNotification.show(`🛒 ${state.buy} cajas (+${state.free} GRATIS) añadidas al pedido`);
        } else if (state.type === 'rappel' || (state.type === 'custom' && state.rappel > 0)) {
          OrdersModule.addProductToOrder(this.currentProduct, this.currentDiscount, state.buy || 1, {
            type: 'rappel',
            rappel: state.rappel,
            label: `Rappel ${state.rappel.toFixed(2)}€/caja`
          });
          AppNavigation.switchTab('tab-orders');
          AppNotification.show(`🛒 Pedido añadido con Rappel de ${state.rappel.toFixed(2)}€/caja`);
        } else {
          OrdersModule.addProductToOrder(this.currentProduct, this.currentDiscount, 1);
          AppNavigation.switchTab('tab-orders');
          AppNotification.show(`🛒 1 caja de ${this.currentProduct.name} añadida`);
        }
      });
    }

    // Margen & Rentabilidad Event Listeners (Opción 1)
    if (this.marginInputPvp) {
      this.marginInputPvp.addEventListener('input', (e) => {
        this.marginPvp = Math.max(0.1, parseFloat(e.target.value) || 2.50);
        if (this.marginPvpPills) {
          this.marginPvpPills.querySelectorAll('.margin-pill').forEach(p => {
            p.classList.toggle('active', parseFloat(p.dataset.pvp) === this.marginPvp);
          });
        }
        this.recalculateMarginProfit();
      });
    }

    if (this.marginPvpPills) {
      this.marginPvpPills.querySelectorAll('.margin-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.marginPvpPills.querySelectorAll('.margin-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.marginPvp = parseFloat(pill.dataset.pvp) || 2.50;
          if (this.marginInputPvp) this.marginInputPvp.value = this.marginPvp.toFixed(2);
          this.recalculateMarginProfit();
        });
      });
    }

    if (this.marginInputBoxesMonth) {
      this.marginInputBoxesMonth.addEventListener('input', (e) => {
        this.marginBoxesMonth = Math.max(1, parseInt(e.target.value, 10) || 15);
        if (this.marginBoxesPills) {
          this.marginBoxesPills.querySelectorAll('.margin-pill').forEach(p => {
            p.classList.toggle('active', parseInt(p.dataset.boxes, 10) === this.marginBoxesMonth);
          });
        }
        this.recalculateMarginProfit();
      });
    }

    if (this.marginBoxesPills) {
      this.marginBoxesPills.querySelectorAll('.margin-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.marginBoxesPills.querySelectorAll('.margin-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.marginBoxesMonth = parseInt(pill.dataset.boxes, 10) || 15;
          if (this.marginInputBoxesMonth) this.marginInputBoxesMonth.value = this.marginBoxesMonth;
          this.recalculateMarginProfit();
        });
      });
    }

    if (this.marginBtnCopyPitch) {
      this.marginBtnCopyPitch.addEventListener('click', () => {
        this.copyMarginPitchToWhatsApp();
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

    // Recalculate Bonification & Rappel Simulator (Opción 2)
    this.recalculateBonification();

    // Recalculate Margen & Rentabilidad del Hostelero (Opción 1)
    this.recalculateMarginProfit();
  },

  recalculateBonification() {
    if (!this.currentProduct) return;
    const options = AppState.getOptions();
    const result = PriceEngine.calculateProduct(this.currentProduct, this.currentDiscount, options);
    const state = this.bonifState || { type: 'none', buy: 10, free: 0, rappel: 0 };

    let effectiveBox = result.finalCaja;
    let effectiveUnit = result.finalUd;
    let totalDiscount = result.discount;
    let giftValue = 0;
    let extraDiscount = 0;
    let pitch = '';

    if (state.type === 'promo') {
      const totalBoxes = state.buy + state.free;
      const totalPaid = state.buy * result.finalCaja;
      effectiveBox = totalPaid / totalBoxes;
      effectiveUnit = effectiveBox / this.currentProduct.unitsPerBox;
      giftValue = state.free * result.finalCaja;
      extraDiscount = (state.free / totalBoxes) * 100;
      totalDiscount = ((1 - (effectiveBox / this.currentProduct.tarifaBase)) * 100);
      pitch = `💡 Con la oferta ${state.buy}+${state.free}, el cliente recibe ${state.free} caja gratis valorada en ${PriceEngine.formatCurrency(giftValue)}. ¡El coste real por botella baja a solo ${PriceEngine.formatUnitCurrency(effectiveUnit)}!`;
    } else if (state.type === 'rappel') {
      effectiveBox = Math.max(0, result.finalCaja - state.rappel);
      effectiveUnit = effectiveBox / this.currentProduct.unitsPerBox;
      giftValue = state.rappel;
      extraDiscount = (state.rappel / result.finalCaja) * 100;
      totalDiscount = ((1 - (effectiveBox / this.currentProduct.tarifaBase)) * 100);
      pitch = `💡 Con ${state.rappel.toFixed(2)}€ de rappel por caja, el hostelero amortiza el coste y paga efectivamente ${PriceEngine.formatCurrency(effectiveBox)} por caja.`;
    } else if (state.type === 'custom') {
      const totalBoxes = state.buy + state.free;
      const totalPaid = (state.buy * result.finalCaja) - (state.buy * state.rappel);
      effectiveBox = Math.max(0, totalPaid / totalBoxes);
      effectiveUnit = effectiveBox / this.currentProduct.unitsPerBox;
      giftValue = (state.free * result.finalCaja) + (state.buy * state.rappel);
      totalDiscount = ((1 - (effectiveBox / this.currentProduct.tarifaBase)) * 100);
      pitch = `💡 Oferta personalizada: ${state.buy} compradas + ${state.free} gratis ${state.rappel > 0 ? '+ ' + state.rappel.toFixed(2) + '€ rappel' : ''}. Ahorro total cliente: ${PriceEngine.formatCurrency(giftValue)}.`;
    } else {
      pitch = `💡 Selecciona una bonificación (ej. 10+1) para ver cómo se derrumba el coste real por botella frente al cliente.`;
    }

    const boxSavings = result.finalCaja - effectiveBox;
    const unitSavings = result.finalUd - effectiveUnit;

    if (this.bonifEffectiveBox) this.bonifEffectiveBox.textContent = PriceEngine.formatCurrency(effectiveBox);
    if (this.bonifBoxDiff) {
      this.bonifBoxDiff.textContent = boxSavings > 0 ? `Ahorro: -${PriceEngine.formatCurrency(boxSavings)}/caja` : 'Tarifa neta estándar';
      this.bonifBoxDiff.style.color = boxSavings > 0 ? 'var(--success-text)' : 'var(--text-muted)';
    }

    if (this.bonifEffectiveUnit) this.bonifEffectiveUnit.textContent = PriceEngine.formatUnitCurrency(effectiveUnit);
    if (this.bonifUnitDiff) {
      this.bonifUnitDiff.textContent = unitSavings > 0 ? `Ahorro: -${PriceEngine.formatUnitCurrency(unitSavings)}/ud` : `Por botella/lata`;
      this.bonifUnitDiff.style.color = unitSavings > 0 ? 'var(--success-text)' : 'var(--text-muted)';
    }

    if (this.bonifTotalDiscount) this.bonifTotalDiscount.textContent = PriceEngine.formatPercent(totalDiscount);
    if (this.bonifEquivText) {
      this.bonifEquivText.textContent = extraDiscount > 0 ? `+${extraDiscount.toFixed(1)}% extra en especie` : 'Descuento del tramo activo';
    }

    if (this.bonifGiftValue) this.bonifGiftValue.textContent = PriceEngine.formatCurrency(giftValue);
    if (this.bonifGiftSubtext) {
      if (state.type === 'promo') {
        this.bonifGiftSubtext.textContent = `${state.free} caja(s) gratis para el cliente`;
      } else if (state.type === 'rappel') {
        this.bonifGiftSubtext.textContent = `${state.rappel.toFixed(2)} € abono por caja`;
      } else if (state.type === 'custom') {
        this.bonifGiftSubtext.textContent = `Abono y producto de cortesía`;
      } else {
        this.bonifGiftSubtext.textContent = `Sin bonificación activa`;
      }
    }

    if (this.bonifPitchText) {
      this.bonifPitchText.textContent = pitch;
    }
  },

  recalculateMarginProfit() {
    if (!this.currentProduct) return;
    const options = AppState.getOptions();
    const result = PriceEngine.calculateProduct(this.currentProduct, this.currentDiscount, options);

    const u = this.currentProduct.unitsPerBox || 24;
    const unitCost = result.finalUd;
    const pvp = this.marginPvp || 2.50;
    const profitUnit = Math.max(0, pvp - unitCost);
    const marginPercent = pvp > 0 ? (profitUnit / pvp) * 100 : 0;
    const profitBox = profitUnit * u;
    const boxesMonth = this.marginBoxesMonth || 15;
    const profitMonth = profitBox * boxesMonth;
    const profitYear = profitMonth * 12;
    const diffPerCent = 1.00 / u;

    if (this.marginCostRef) {
      this.marginCostRef.textContent = `Coste bar: ${PriceEngine.formatUnitCurrency(unitCost)}/ud`;
    }

    if (this.marginProfitUnit) {
      this.marginProfitUnit.textContent = `+${PriceEngine.formatUnitCurrency(profitUnit)}`;
    }

    if (this.marginPercentUnit) {
      this.marginPercentUnit.textContent = `Margen: ${marginPercent.toFixed(1)}% sobre PVP`;
    }

    if (this.marginProfitBox) {
      this.marginProfitBox.textContent = `+${PriceEngine.formatCurrency(profitBox)}`;
    }

    if (this.marginProfitBoxSub) {
      this.marginProfitBoxSub.textContent = `Por cada caja de ${u} uds vendida`;
    }

    if (this.marginProfitMonth) {
      this.marginProfitMonth.textContent = `+${PriceEngine.formatCurrency(profitMonth)}`;
    }

    if (this.marginProfitYear) {
      this.marginProfitYear.textContent = `+${PriceEngine.formatCurrency(profitYear, 0)} beneficio anual`;
    }

    if (this.marginDiffCents) {
      this.marginDiffCents.textContent = `${diffPerCent.toFixed(2)} €/ud`;
    }

    if (this.marginPitchBadge) {
      this.marginPitchBadge.innerHTML = `
        💡 <strong>Argumento de cierre:</strong> En una botella donde el bar se embolsa <strong>+${PriceEngine.formatUnitCurrency(profitUnit)} limpios</strong>, discutir por ${diffPerCent.toFixed(2)}€ de la competencia no tiene sentido frente a la marca líder nº1 que fideliza clientes y ofrece 23,7 cl (+18,5% más de producto).
      `;
    }
  },

  copyMarginPitchToWhatsApp() {
    if (!this.currentProduct) return;
    const options = AppState.getOptions();
    const result = PriceEngine.calculateProduct(this.currentProduct, this.currentDiscount, options);
    const u = this.currentProduct.unitsPerBox;
    const profitUnit = Math.max(0, this.marginPvp - result.finalUd);
    const marginPercent = this.marginPvp > 0 ? (profitUnit / this.marginPvp) * 100 : 0;
    const profitBox = profitUnit * u;
    const profitMonth = profitBox * this.marginBoxesMonth;
    const profitYear = profitMonth * 12;
    const diffCent = (1.00 / u).toFixed(2);

    let text = `📊 *ESTUDIO DE RENTABILIDAD PARA HOSTELERÍA*\n`;
    text += `🍹 *Producto:* ${this.currentProduct.name} (${this.currentProduct.format})\n`;
    text += `💵 *PVP en Barra / Terraza:* ${this.marginPvp.toFixed(2)} €\n`;
    text += `💰 *Tu Coste por Botella:* ${result.finalUd.toFixed(3)} €\n`;
    text += `------------------------------------\n`;
    text += `🏆 *TUS BENEFICIOS LIMPIOS:*\n`;
    text += `👉 *Ganas por Botella:* *+${profitUnit.toFixed(3)} €* (${marginPercent.toFixed(1)}% margen)\n`;
    text += `👉 *Ganas por Caja (${u} uds):* *+${profitBox.toFixed(2)} €*\n`;
    text += `👉 *Tu Beneficio al Mes (${this.marginBoxesMonth} cajas):* *+${profitMonth.toFixed(2)} €* limpios (+${profitYear.toFixed(0)} €/año)\n`;
    text += `------------------------------------\n`;
    text += `💡 *DATO CLAVE:* 1€ de diferencia en la caja son solo ${diffCent}€ por consumición.\n`;
    text += `No arriesgues la satisfacción de tus clientes por céntimos cuando te ganas más de ${profitBox.toFixed(0)}€ limpios por caja con la marca líder (+18,5% más de producto en 23,7 cl).\n\n`;
    text += `_Generado con Presupuesto 2027 Pro · Plataforma Comercial Oficial_`;

    navigator.clipboard.writeText(text).then(() => {
      AppNotification.show('📲 Argumento de rentabilidad copiado para WhatsApp');
    }).catch(() => {
      prompt('Copia el texto de rentabilidad:', text);
    });
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
