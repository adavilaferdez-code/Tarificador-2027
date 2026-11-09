/**
 * MÓDULO 2: COMPARADOR DE FACTURAS VS. COMPETENCIA ("MODO CISNEROS")
 * Compara albaranes y facturas reales de competidores / distribuidores piratas
 * contra nuestra tarifa oficial o precios negociados, calcula ahorro y genera mensajes para WhatsApp.
 * Permite cambiar MANUALMENTE cualquier precio de la factura pirata (caja o unidad) y nuestro precio.
 */

const ComparatorModule = {
  items: [],
  subidaCompetenciaApplied: false,
  distributorName: 'Distribuidor Pirata / Competencia',
  includeEnvases: true,
  globalEnvasesAmount: 33.80,

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.loadFromStorage();

    if (this.items.length === 0) {
      this.loadExampleData();
    } else {
      this.render();
    }
  },

  cacheDOM() {
    this.tableBody = document.getElementById('comp-table-body');
    this.btnAddLine = document.getElementById('comp-btn-add-line');
    this.btnAddCustom = document.getElementById('comp-btn-add-custom');
    this.btnLoadExample = document.getElementById('comp-btn-example');
    this.btnSubida6 = document.getElementById('comp-btn-subida6');
    this.btnCopyWhatsApp = document.getElementById('comp-btn-whatsapp');
    this.btnClear = document.getElementById('comp-btn-clear');

    // Distributor name & headers
    this.inputDistributorName = document.getElementById('comp-distributor-name');
    this.thPirataTitle = document.getElementById('comp-th-pirata-title');
    this.summaryPirataTitle = document.getElementById('comp-summary-pirata-title');

    // Envases controls
    this.checkIncludeEnvases = document.getElementById('comp-check-envases');

    // Totals DOM elements
    this.totalCompSinIVA = document.getElementById('comp-total-comp-sin-iva');
    this.totalOurSinIVA = document.getElementById('comp-total-our-sin-iva');
    this.totalSavingsSinIVA = document.getElementById('comp-total-savings-sin-iva');
    this.totalCompConIVA = document.getElementById('comp-total-comp-con-iva');
    this.totalOurConIVA = document.getElementById('comp-total-our-con-iva');
    this.totalSavingsConIVA = document.getElementById('comp-total-savings-con-iva');
    this.savingsBadge = document.getElementById('comp-savings-badge');
    this.savingsPercent = document.getElementById('comp-savings-percent');

    // Custom modal elements
    this.customModal = document.getElementById('comp-custom-modal');
    this.customModalClose = document.getElementById('comp-custom-modal-close');
    this.customModalCancel = document.getElementById('comp-custom-btn-cancel');
  },

  bindEvents() {
    if (this.btnLoadExample) {
      this.btnLoadExample.addEventListener('click', () => {
        this.loadExampleData();
        AppNotification.show('📋 Factura de ejemplo de la competencia cargada');
      });
    }

    if (this.btnSubida6) {
      this.btnSubida6.addEventListener('click', () => {
        this.toggleSubida6();
      });
    }

    if (this.btnAddLine) {
      this.btnAddLine.addEventListener('click', () => {
        this.showAddProductModal();
      });
    }

    if (this.btnAddCustom) {
      this.btnAddCustom.addEventListener('click', () => {
        this.showAddCustomModal();
      });
    }

    if (this.btnClear) {
      this.btnClear.addEventListener('click', () => {
        if (confirm('¿Deseas vaciar la comparativa actual?')) {
          this.items = [];
          this.saveToStorage();
          this.render();
          AppNotification.show('🗑️ Comparativa vaciada');
        }
      });
    }

    if (this.btnCopyWhatsApp) {
      this.btnCopyWhatsApp.addEventListener('click', () => {
        this.copyComparisonToWhatsApp();
      });
    }

    if (this.checkIncludeEnvases) {
      this.checkIncludeEnvases.addEventListener('change', (e) => {
        this.includeEnvases = e.target.checked;
        this.saveToStorage();
        this.recalculateAndRenderTotals();
      });
    }

    if (this.inputDistributorName) {
      this.inputDistributorName.addEventListener('input', (e) => {
        this.distributorName = e.target.value.trim() || 'Distribuidor Pirata';
        this.updateDistributorLabels();
        this.saveToStorage();
      });
    }

    if (this.customModalClose) {
      this.customModalClose.addEventListener('click', () => {
        if (this.customModal) this.customModal.style.display = 'none';
      });
    }

    if (this.customModalCancel) {
      this.customModalCancel.addEventListener('click', () => {
        if (this.customModal) this.customModal.style.display = 'none';
      });
    }

    if (this.customModal) {
      this.customModal.addEventListener('click', (e) => {
        if (e.target === this.customModal) this.customModal.style.display = 'none';
      });
    }
  },

  updateDistributorLabels() {
    const title = this.distributorName || 'Distribuidor Pirata';
    if (this.thPirataTitle) {
      this.thPirataTitle.textContent = `🔴 Factura ${title} (€/caja y €/ud)`;
    }
    if (this.summaryPirataTitle) {
      this.summaryPirataTitle.textContent = `🔴 Factura ${title}`;
    }
  },

  loadExampleData() {
    this.subidaCompetenciaApplied = false;
    this.includeEnvases = true;
    this.distributorName = 'Distribuidor Pirata / Competencia';

    if (this.checkIncludeEnvases) this.checkIncludeEnvases.checked = true;
    if (this.inputDistributorName) this.inputDistributorName.value = this.distributorName;
    this.updateDistributorLabels();

    if (this.btnSubida6) {
      this.btnSubida6.classList.remove('active', 'btn-primary');
      this.btnSubida6.classList.add('btn-secondary');
      this.btnSubida6.innerHTML = '📈 +6% Subida Competencia';
    }

    // Official example case from specifications:
    // - 3 cajas Coca-Cola Normal VR (Competencia: 16,00 € | Nuestro Tramo 3: 18,47 €)
    // - 1 caja Coca-Cola Zero VR (Competencia: 16,00 € | Nuestro Tramo 3: 18,47 €)
    // - 1 caja Fanta Naranja VR (Competencia: 16,00 € | Nuestro Tramo 3: 14,64 €)
    // - 1 caja Aquarius Limón VR 30 (Competencia: 25,35 € | Nuestro Tramo 3: 19,47 €)
    // - 3 cajas Agua PET 50 cl C/24 (Competencia: 8,50 € | Nuestro: 6,99 €)
    this.items = [
      {
        productId: 'vr-cc-regular-237',
        isCustom: false,
        boxes: 3,
        compPrice: 16.00,
        originalCompPrice: 16.00,
        customOurPrice: null,
        envasePerBox: 4.80
      },
      {
        productId: 'vr-cc-zero-237',
        isCustom: false,
        boxes: 1,
        compPrice: 16.00,
        originalCompPrice: 16.00,
        customOurPrice: null,
        envasePerBox: 4.80
      },
      {
        productId: 'vr-fanta-naranja-237',
        isCustom: false,
        boxes: 1,
        compPrice: 16.00,
        originalCompPrice: 16.00,
        customOurPrice: null,
        envasePerBox: 4.80
      },
      {
        productId: 'vr-aquarius-limon-30',
        isCustom: false,
        boxes: 1,
        compPrice: 25.35,
        originalCompPrice: 25.35,
        customOurPrice: null,
        envasePerBox: 7.20
      },
      {
        productId: 'pet-aquabona-50',
        isCustom: false,
        boxes: 3,
        compPrice: 8.50,
        originalCompPrice: 8.50,
        customOurPrice: null,
        envasePerBox: 0.00
      }
    ];

    this.saveToStorage();
    this.render();
  },

  toggleSubida6() {
    this.subidaCompetenciaApplied = !this.subidaCompetenciaApplied;

    this.items.forEach(item => {
      if (this.subidaCompetenciaApplied) {
        item.compPrice = parseFloat((item.originalCompPrice * 1.06).toFixed(2));
      } else {
        item.compPrice = item.originalCompPrice;
      }
    });

    if (this.btnSubida6) {
      if (this.subidaCompetenciaApplied) {
        this.btnSubida6.classList.add('active', 'btn-primary');
        this.btnSubida6.classList.remove('btn-secondary');
        this.btnSubida6.innerHTML = '✅ +6% Aplicado (Noviembre)';
      } else {
        this.btnSubida6.classList.remove('active', 'btn-primary');
        this.btnSubida6.classList.add('btn-secondary');
        this.btnSubida6.innerHTML = '📈 +6% Subida Competencia';
      }
    }

    this.saveToStorage();
    this.render();
    AppNotification.show(this.subidaCompetenciaApplied ? '📈 Simulación +6% aplicada a la competencia' : 'Revertida subida del 6%');
  },

  getItemProduct(item) {
    if (item.isCustom) {
      return {
        id: 'custom-' + (item.customName || 'pirata'),
        name: item.customName || 'Producto Personalizado',
        format: item.customFormat || 'Vidrio 20 cl',
        unitsPerBox: item.customUnitsPerBox || 24,
        iva: item.customIva || 21,
        isCustom: true
      };
    }
    return PRODUCTS_DB.find(p => p.id === item.productId);
  },

  getItemUnits(item) {
    if (item.isCustom) return item.customUnitsPerBox || 24;
    const p = PRODUCTS_DB.find(prod => prod.id === item.productId);
    return (p && p.unitsPerBox) ? p.unitsPerBox : 24;
  },

  getOurDefaultPrice(item) {
    if (item.isCustom) {
      return item.defaultOurPrice || 0;
    }
    const product = PRODUCTS_DB.find(p => p.id === item.productId);
    if (!product) return 0;
    const channel = AppState.getActiveChannel();
    const options = AppState.getOptions();
    const discount = (product.discounts && product.discounts[channel] !== undefined)
      ? product.discounts[channel]
      : (product.discounts?.t3 || 0);
    const ourRes = PriceEngine.calculateProduct(product, discount, { includePV: options.includePV, includeIVA: false });
    return ourRes.finalCaja;
  },

  addProductToComparison(product) {
    const existing = this.items.find(i => !i.isCustom && i.productId === product.id);
    if (existing) {
      existing.boxes += 1;
      this.saveToStorage();
      this.render();
      AppNotification.show(`Sumada 1 caja a ${product.name}`);
    } else {
      let defaultComp = 16.00;
      let defaultEnvase = 0;
      if (product.format.includes('23,7') || product.format.includes('20 cl')) {
        defaultEnvase = 4.80;
      } else if (product.format.includes('30 cl') || product.format.includes('35 cl')) {
        defaultEnvase = 7.20;
      }

      const res = PriceEngine.calculateProduct(product, product.discounts?.t3 || 0);
      defaultComp = parseFloat((res.netoCajaSinPV * 1.05).toFixed(2));

      this.items.push({
        productId: product.id,
        isCustom: false,
        boxes: 1,
        compPrice: defaultComp,
        originalCompPrice: defaultComp,
        customOurPrice: null,
        envasePerBox: defaultEnvase
      });

      this.saveToStorage();
      this.render();
      AppNotification.show(`Añadido: ${product.name}`);
    }

    const newIndex = existing ? this.items.indexOf(existing) : this.items.length - 1;
    setTimeout(() => {
      const input = document.getElementById(`comp-box-input-${newIndex}`);
      if (input) {
        input.focus();
        input.select();
      }
    }, 120);
  },

  showAddCustomModal() {
    if (!this.customModal) return;
    this.customModal.style.display = 'flex';
    const nameInput = document.getElementById('comp-custom-name');
    if (nameInput) {
      nameInput.value = '';
      nameInput.focus();
    }
  },

  onCustomUnitsChange(unitsVal) {
    const units = parseInt(unitsVal, 10) || 24;
    const boxInput = document.getElementById('comp-custom-price-box');
    const unitInput = document.getElementById('comp-custom-price-unit');
    if (boxInput && unitInput && boxInput.value) {
      const boxPrice = parseFloat(boxInput.value) || 0;
      unitInput.value = units > 0 ? (boxPrice / units).toFixed(3) : '0.000';
    }
  },

  onCustomModalBoxPriceInput(boxVal) {
    const unitsInput = document.getElementById('comp-custom-units');
    const units = parseInt(unitsInput ? unitsInput.value : 24, 10) || 24;
    const unitInput = document.getElementById('comp-custom-price-unit');
    const val = parseFloat(boxVal) || 0;
    if (unitInput) {
      unitInput.value = units > 0 ? (val / units).toFixed(3) : '0.000';
    }
  },

  onCustomModalUnitPriceInput(unitVal) {
    const unitsInput = document.getElementById('comp-custom-units');
    const units = parseInt(unitsInput ? unitsInput.value : 24, 10) || 24;
    const boxInput = document.getElementById('comp-custom-price-box');
    const val = parseFloat(unitVal) || 0;
    if (boxInput) {
      boxInput.value = (val * units).toFixed(2);
    }
  },

  submitCustomProduct() {
    const name = document.getElementById('comp-custom-name')?.value.trim() || 'Producto Pirata';
    const format = document.getElementById('comp-custom-format')?.value.trim() || 'Vidrio 20 cl';
    const units = parseInt(document.getElementById('comp-custom-units')?.value, 10) || 24;
    const boxes = parseInt(document.getElementById('comp-custom-boxes')?.value, 10) || 1;
    const iva = parseInt(document.getElementById('comp-custom-iva')?.value, 10) || 21;
    const compPrice = parseFloat(document.getElementById('comp-custom-price-box')?.value) || 15.00;
    const ourPrice = parseFloat(document.getElementById('comp-custom-our-price')?.value) || 18.00;
    const envase = parseFloat(document.getElementById('comp-custom-envase')?.value) || 0;

    this.items.push({
      isCustom: true,
      customName: name,
      customFormat: format,
      customUnitsPerBox: units,
      customIva: iva,
      boxes: Math.max(1, boxes),
      compPrice: compPrice,
      originalCompPrice: compPrice,
      customOurPrice: ourPrice,
      defaultOurPrice: ourPrice,
      envasePerBox: envase
    });

    if (this.customModal) this.customModal.style.display = 'none';
    this.saveToStorage();
    this.render();
    AppNotification.show(`➕ Añadido: ${name}`);
  },

  onBoxesInput(index, val) {
    const boxes = parseInt(val, 10) || 1;
    if (!this.items[index]) return;
    this.items[index].boxes = Math.max(1, boxes);
    this.updateRowCalculations(index);
  },

  onBoxesBlur(index) {
    this.saveToStorage();
  },

  onCompPriceInput(index, val, isUnit = false) {
    const item = this.items[index];
    if (!item) return;

    const units = this.getItemUnits(item);

    if (isUnit) {
      const unitVal = parseFloat(val) || 0;
      item.compPrice = parseFloat((unitVal * units).toFixed(2));
      const boxInput = document.getElementById(`comp-box-input-${index}`);
      if (boxInput) boxInput.value = item.compPrice.toFixed(2);
    } else {
      item.compPrice = parseFloat(val) || 0;
      const unitInput = document.getElementById(`comp-unit-input-${index}`);
      if (unitInput) unitInput.value = units > 0 ? (item.compPrice / units).toFixed(3) : '0.000';
    }

    item.originalCompPrice = this.subidaCompetenciaApplied
      ? parseFloat((item.compPrice / 1.06).toFixed(2))
      : item.compPrice;

    this.updateRowCalculations(index);
  },

  onCompPriceBlur(index) {
    const item = this.items[index];
    if (!item) return;
    const units = this.getItemUnits(item);

    const boxInput = document.getElementById(`comp-box-input-${index}`);
    if (boxInput && !isNaN(item.compPrice)) {
      boxInput.value = item.compPrice.toFixed(2);
    }
    const unitInput = document.getElementById(`comp-unit-input-${index}`);
    if (unitInput && units > 0) {
      unitInput.value = (item.compPrice / units).toFixed(3);
    }

    this.saveToStorage();
  },

  enableCustomOurPrice(index) {
    const item = this.items[index];
    if (!item) return;
    item.customOurPrice = this.getOurDefaultPrice(item);
    this.saveToStorage();
    this.render();
    setTimeout(() => {
      const input = document.getElementById(`comp-our-input-${index}`);
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
    AppNotification.show('✏️ Precio manual habilitado para nuestra oferta');
  },

  onOurPriceInput(index, val) {
    const item = this.items[index];
    if (!item) return;
    item.customOurPrice = parseFloat(val) || 0;
    this.updateRowCalculations(index);
  },

  onOurPriceBlur(index) {
    const item = this.items[index];
    if (!item) return;
    const ourInput = document.getElementById(`comp-our-input-${index}`);
    if (ourInput && item.customOurPrice != null) {
      ourInput.value = item.customOurPrice.toFixed(2);
    }
    this.saveToStorage();
  },

  resetOurPrice(index) {
    const item = this.items[index];
    if (!item) return;
    item.customOurPrice = null;
    this.saveToStorage();
    this.render();
    AppNotification.show('↺ Restaurado precio de tarifa oficial');
  },

  updateRowCalculations(index) {
    const item = this.items[index];
    if (!item) return;

    const compBoxPrice = item.compPrice;
    const ourBoxPrice = item.customOurPrice != null ? item.customOurPrice : this.getOurDefaultPrice(item);

    const lineCompSinIVA = compBoxPrice * item.boxes;
    const lineOurSinIVA = ourBoxPrice * item.boxes;

    const diffPerBox = compBoxPrice - ourBoxPrice;
    const lineSavings = diffPerBox * item.boxes;
    const weWin = diffPerBox >= 0;

    const compTotalEl = document.getElementById(`comp-line-total-comp-${index}`);
    if (compTotalEl) {
      compTotalEl.textContent = PriceEngine.formatCurrency(lineCompSinIVA);
    }

    const ourTotalEl = document.getElementById(`comp-line-total-our-${index}`);
    if (ourTotalEl) {
      ourTotalEl.textContent = PriceEngine.formatCurrency(lineOurSinIVA);
    }

    const diffEl = document.getElementById(`comp-cell-diff-${index}`);
    if (diffEl) {
      diffEl.innerHTML = weWin ? `
        <span class="tag-win">
          ⭐ Ganas +${PriceEngine.formatCurrency(diffPerBox)}/caja
        </span>
        <div style="font-size: 0.75rem; color: var(--success); font-weight: 700; margin-top: 3px;">
          Ahorro línea: +${PriceEngine.formatCurrency(lineSavings)}
        </div>
      ` : `
        <span class="tag-comp-lower">
          -${PriceEngine.formatCurrency(Math.abs(diffPerBox))}/caja
        </span>
        <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
          Diferencia: ${PriceEngine.formatCurrency(lineSavings)}
        </div>
      `;
    }

    this.recalculateAndRenderTotals();
  },

  render() {
    if (!this.tableBody) return;
    const channel = AppState.getActiveChannel();
    this.updateDistributorLabels();

    if (this.items.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No hay productos en la comparativa.<br>
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 14px;">
              <button class="btn btn-primary btn-sm" onclick="ComparatorModule.loadExampleData()">
                ⚡ Cargar Factura de Ejemplo
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ComparatorModule.showAddProductModal()">
                ➕ Añadir Catálogo
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ComparatorModule.showAddCustomModal()">
                ➕ Producto Pirata / Libre
              </button>
            </div>
          </td>
        </tr>
      `;
      this.updateTotals(0, 0, 0, 0, 0);
      return;
    }

    let totalCompSinIVA = 0;
    let totalOurSinIVA = 0;
    let totalIVAComp = 0;
    let totalIVAOur = 0;
    let totalEnvasesAmount = 0;

    this.tableBody.innerHTML = this.items.map((item, index) => {
      const product = this.getItemProduct(item);
      if (!product) return '';

      const unitsPerBox = this.getItemUnits(item);
      const isCustomProduct = item.isCustom;
      const isCustomOurPrice = item.customOurPrice != null;

      let discount = 0;
      if (!isCustomProduct) {
        discount = (product.discounts && product.discounts[channel] !== undefined)
          ? product.discounts[channel]
          : (product.discounts?.t3 || 0);
      }

      const defaultOurBox = this.getOurDefaultPrice(item);
      const ourBoxPrice = isCustomOurPrice ? item.customOurPrice : defaultOurBox;

      const compBoxPrice = item.compPrice;
      const unitCompPrice = unitsPerBox > 0 ? (compBoxPrice / unitsPerBox) : 0;
      const unitOurPrice = unitsPerBox > 0 ? (ourBoxPrice / unitsPerBox) : 0;

      const lineCompSinIVA = compBoxPrice * item.boxes;
      const lineOurSinIVA = ourBoxPrice * item.boxes;

      totalCompSinIVA += lineCompSinIVA;
      totalOurSinIVA += lineOurSinIVA;

      // Tax
      const ivaFactor = (product.iva || 21) / 100;
      totalIVAComp += lineCompSinIVA * ivaFactor;
      totalIVAOur += lineOurSinIVA * ivaFactor;

      if (this.includeEnvases) {
        totalEnvasesAmount += (item.envasePerBox || 0) * item.boxes;
      }

      const diffPerBox = compBoxPrice - ourBoxPrice;
      const lineSavings = diffPerBox * item.boxes;
      const weWin = diffPerBox >= 0;

      return `
        <tr data-index="${index}">
          <td>
            <div style="font-weight: 700; color: var(--text-main);">${product.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${product.format} · ${unitsPerBox} uds · IVA ${product.iva}%</div>
            ${isCustomProduct ? `<span class="comp-badge-manual" style="margin-top: 4px;">Producto Pirata / Libre</span>` : ''}
          </td>

          <!-- Nº Cajas -->
          <td style="text-align: center;">
            <input type="number" min="1" max="999" class="comp-input" style="width: 65px; text-align: center; font-weight: 800;" 
              value="${item.boxes}" 
              oninput="ComparatorModule.onBoxesInput(${index}, this.value)"
              onblur="ComparatorModule.onBoxesBlur(${index})"
              title="Cambiar número de cajas compradas">
          </td>

          <!-- Precio Competencia / Factura Pirata (Editable en vivo) -->
          <td>
            <div class="comp-price-cell-box">
              <div class="comp-price-input-row" title="Precio por caja de la factura del distribuidor pirata (puedes cambiarlo directamente)">
                <input type="number" step="0.01" class="comp-price-field" id="comp-box-input-${index}"
                  value="${compBoxPrice.toFixed(2)}" 
                  oninput="ComparatorModule.onCompPriceInput(${index}, this.value, false)"
                  onblur="ComparatorModule.onCompPriceBlur(${index})">
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--danger);">€/caja</span>
              </div>
              <div class="comp-price-input-row" title="Precio por unidad / botella (calculado automáticamente o editable)">
                <input type="number" step="0.001" class="comp-unit-price-field" id="comp-unit-input-${index}"
                  value="${unitCompPrice.toFixed(3)}" 
                  oninput="ComparatorModule.onCompPriceInput(${index}, this.value, true)"
                  onblur="ComparatorModule.onCompPriceBlur(${index})">
                <span style="font-size: 0.72rem; color: var(--text-muted);">€/ud</span>
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                Total: <strong id="comp-line-total-comp-${index}" style="color: var(--text-main);">${PriceEngine.formatCurrency(lineCompSinIVA)}</strong>
              </div>
            </div>
          </td>

          <!-- Nuestra Tarifa / Oferta (Con opción de editar precio manual) -->
          <td>
            <div class="comp-price-cell-box">
              ${isCustomOurPrice ? `
                <div class="comp-price-input-row" title="Precio manual ofertado para esta línea">
                  <input type="number" step="0.01" class="our-custom-price-field" id="comp-our-input-${index}"
                    value="${item.customOurPrice.toFixed(2)}"
                    oninput="ComparatorModule.onOurPriceInput(${index}, this.value)"
                    onblur="ComparatorModule.onOurPriceBlur(${index})">
                  <span style="font-size: 0.78rem; font-weight: 700; color: var(--primary);">€/caja</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                  <span class="comp-badge-manual">Pactado</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">${PriceEngine.formatCurrency(unitOurPrice)}/ud</span>
                  <button type="button" class="btn-link" style="font-size: 0.7rem; color: var(--text-muted); text-decoration: underline; background: none; border: none; cursor: pointer; padding: 0;"
                    onclick="ComparatorModule.resetOurPrice(${index})" title="Volver al precio de tarifa oficial">
                    ↺ Tarifa oficial
                  </button>
                </div>
              ` : `
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: 800; font-size: 0.95rem; color: var(--primary);" id="comp-our-price-label-${index}">
                    ${PriceEngine.formatCurrency(ourBoxPrice)}
                  </span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">/caja</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 1px;">
                  ${PriceEngine.formatCurrency(unitOurPrice)}/ud ${discount > 0 ? `· Dcto ${discount.toFixed(1)}%` : ''}
                </div>
                <button type="button" class="btn-link" style="font-size: 0.72rem; color: var(--primary); text-align: left; background: none; border: none; cursor: pointer; padding: 0; margin-top: 3px; font-weight: 600;"
                  onclick="ComparatorModule.enableCustomOurPrice(${index})" title="Cambiar manualmente nuestro precio para negociar contra el pirata">
                  ✏️ Cambiar nuestro precio manual
                </button>
              `}
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                Total: <strong id="comp-line-total-our-${index}" style="color: var(--text-main);">${PriceEngine.formatCurrency(lineOurSinIVA)}</strong>
              </div>
            </div>
          </td>

          <!-- Diferencia / Balance -->
          <td id="comp-cell-diff-${index}">
            ${weWin ? `
              <span class="tag-win">
                ⭐ Ganas +${PriceEngine.formatCurrency(diffPerBox)}/caja
              </span>
              <div style="font-size: 0.75rem; color: var(--success); font-weight: 700; margin-top: 3px;">
                Ahorro línea: +${PriceEngine.formatCurrency(lineSavings)}
              </div>
            ` : `
              <span class="tag-comp-lower">
                -${PriceEngine.formatCurrency(Math.abs(diffPerBox))}/caja
              </span>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                Diferencia: ${PriceEngine.formatCurrency(lineSavings)}
              </div>
            `}
          </td>

          <!-- Acción -->
          <td style="text-align: center;">
            <button class="action-icon-btn" style="width: 32px; height: 32px; color: var(--danger); margin: 0 auto;" 
              onclick="ComparatorModule.removeLine(${index})" title="Eliminar línea de la comparativa">
              🗑️
            </button>
          </td>
        </tr>
      `;
    }).join('');

    this.updateTotals(totalCompSinIVA, totalOurSinIVA, totalIVAComp, totalIVAOur, totalEnvasesAmount);
  },

  recalculateAndRenderTotals() {
    let totalCompSinIVA = 0;
    let totalOurSinIVA = 0;
    let totalIVAComp = 0;
    let totalIVAOur = 0;
    let totalEnvasesAmount = 0;

    this.items.forEach(item => {
      const compBoxPrice = item.compPrice;
      const ourBoxPrice = item.customOurPrice != null ? item.customOurPrice : this.getOurDefaultPrice(item);

      const lineCompSinIVA = compBoxPrice * item.boxes;
      const lineOurSinIVA = ourBoxPrice * item.boxes;

      totalCompSinIVA += lineCompSinIVA;
      totalOurSinIVA += lineOurSinIVA;

      // Tax
      const product = this.getItemProduct(item);
      const ivaFactor = (product ? product.iva : 21) / 100;
      totalIVAComp += lineCompSinIVA * ivaFactor;
      totalIVAOur += lineOurSinIVA * ivaFactor;

      if (this.includeEnvases) {
        totalEnvasesAmount += (item.envasePerBox || 0) * item.boxes;
      }
    });

    this.updateTotals(totalCompSinIVA, totalOurSinIVA, totalIVAComp, totalIVAOur, totalEnvasesAmount);
  },

  removeLine(index) {
    this.items.splice(index, 1);
    this.saveToStorage();
    this.render();
    AppNotification.show('Línea eliminada');
  },

  updateTotals(totalCompSinIVA, totalOurSinIVA, totalIVAComp, totalIVAOur, totalEnvases) {
    const savingsSinIVA = totalCompSinIVA - totalOurSinIVA;

    // Con IVA + Envases
    const totalCompConIVA = totalCompSinIVA + totalIVAComp + (this.includeEnvases ? totalEnvases : 0);
    const totalOurConIVA = totalOurSinIVA + totalIVAOur + (this.includeEnvases ? totalEnvases : 0);
    const savingsConIVA = totalCompConIVA - totalOurConIVA;

    if (this.totalCompSinIVA) this.totalCompSinIVA.textContent = PriceEngine.formatCurrency(totalCompSinIVA);
    if (this.totalOurSinIVA) this.totalOurSinIVA.textContent = PriceEngine.formatCurrency(totalOurSinIVA);
    if (this.totalSavingsSinIVA) {
      this.totalSavingsSinIVA.textContent = (savingsSinIVA >= 0 ? '+' : '') + PriceEngine.formatCurrency(savingsSinIVA);
      this.totalSavingsSinIVA.style.color = savingsSinIVA >= 0 ? 'var(--success)' : 'var(--danger)';
    }

    if (this.totalCompConIVA) this.totalCompConIVA.textContent = PriceEngine.formatCurrency(totalCompConIVA);
    if (this.totalOurConIVA) this.totalOurConIVA.textContent = PriceEngine.formatCurrency(totalOurConIVA);
    if (this.totalSavingsConIVA) {
      this.totalSavingsConIVA.textContent = (savingsConIVA >= 0 ? '+' : '') + PriceEngine.formatCurrency(savingsConIVA);
      this.totalSavingsConIVA.style.color = savingsConIVA >= 0 ? 'var(--success)' : 'var(--danger)';
    }

    const savingsRatio = totalCompSinIVA > 0 ? (savingsSinIVA / totalCompSinIVA) * 100 : 0;
    if (this.savingsPercent) {
      this.savingsPercent.textContent = (savingsRatio >= 0 ? '+' : '') + savingsRatio.toFixed(1) + '%';
    }

    if (this.savingsBadge) {
      if (savingsSinIVA > 0) {
        this.savingsBadge.innerHTML = `🎉 <strong>¡Ahorro total para el cliente: ${PriceEngine.formatCurrency(savingsConIVA)}!</strong>`;
        this.savingsBadge.className = 'sales-pitch-banner';
        this.savingsBadge.style.borderLeftColor = 'var(--success)';
      } else {
        this.savingsBadge.innerHTML = `💡 Con 23,7 cl (+18,5% de producto por botella), el cliente recibe casi 1 litro más por caja al mismo precio de consumición en barra.`;
        this.savingsBadge.className = 'sales-pitch-banner';
        this.savingsBadge.style.borderLeftColor = 'var(--primary)';
      }
    }
  },

  copyComparisonToWhatsApp() {
    if (this.items.length === 0) {
      AppNotification.show('⚠️ Añade productos a la comparativa primero');
      return;
    }

    const channelLabel = AppState.getChannelLabel();
    const distName = this.distributorName || 'Distribuidor Pirata';
    let text = `📊 *COMPARATIVA DE FACTURA - TARIFA 2027*\n`;
    text += `🏢 *Factura analizada:* ${distName}\n`;
    text += `💼 *Nuestro Canal / Oferta:* ${channelLabel}\n`;
    text += `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n`;
    text += `------------------------------------\n\n`;

    let totalComp = 0;
    let totalOur = 0;

    this.items.forEach(item => {
      const product = this.getItemProduct(item);
      const units = this.getItemUnits(item);
      const compBox = item.compPrice;
      const ourBox = item.customOurPrice != null ? item.customOurPrice : this.getOurDefaultPrice(item);
      const isCustomPrice = item.customOurPrice != null;

      const lineComp = compBox * item.boxes;
      const lineOur = ourBox * item.boxes;
      totalComp += lineComp;
      totalOur += lineOur;

      const diffBox = compBox - ourBox;
      const symbol = diffBox >= 0 ? '✅' : '🔴';

      text += `${symbol} *${product.name}*\n`;
      text += `   • Cantidad: ${item.boxes} cajas (${item.boxes * units} uds)\n`;
      text += `   • *${distName}:* ${compBox.toFixed(2)}€/caja (${(compBox/units).toFixed(3)}€/ud)\n`;
      text += `   • *Nosotros:* ${ourBox.toFixed(2)}€/caja (${(ourBox/units).toFixed(3)}€/ud)${isCustomPrice ? ' [Oferta Especial Pactada]' : ''}\n`;
      if (diffBox > 0) {
        text += `   • 💰 *Ganas +${(diffBox * item.boxes).toFixed(2)}€ en esta línea*\n`;
      } else if (diffBox < 0) {
        text += `   • ⚖️ Diferencia: ${(diffBox * item.boxes).toFixed(2)}€\n`;
      }
      text += `\n`;
    });

    const savings = totalComp - totalOur;
    text += `------------------------------------\n`;
    text += `🔴 *Total ${distName} (Sin IVA):* ${totalComp.toFixed(2)} €\n`;
    text += `🟢 *Total Nuestro:* ${totalOur.toFixed(2)} €\n`;

    if (savings > 0) {
      text += `🏆 *AHORRO DIRECTO:* +${savings.toFixed(2)} € (${((savings/totalComp)*100).toFixed(1)}%)\n`;
    } else {
      text += `⚖️ *Diferencia neta:* ${savings.toFixed(2)} €\n`;
    }

    text += `\n💡 *ARGUMENTO CLAVE DE VENTA:*\n`;
    text += `Nuestro Vidrio Retornable es de *23,7 cl* frente a los 200 ml de la competencia.\n`;
    text += `👉 *+18,5% MÁS DE PRODUCTO POR BOTELLA* (casi 1 litro más por caja al mismo precio de venta en barra).\n\n`;
    text += `_Generado con Presupuesto 2027 Pro · Plataforma Comercial Oficial_`;

    navigator.clipboard.writeText(text).then(() => {
      AppNotification.show('📲 Comparativa copiada para WhatsApp');
    }).catch(() => {
      prompt('Copia el texto para WhatsApp:', text);
    });
  },

  showAddProductModal() {
    const modal = document.getElementById('product-picker-modal');
    const list = document.getElementById('modal-picker-list');
    const search = document.getElementById('modal-picker-search');
    const closeBtn = document.getElementById('modal-picker-close');
    const title = document.getElementById('modal-picker-title');

    if (!modal || !list) return;

    if (title) title.textContent = 'Añadir Producto del Catálogo a la Comparativa';
    modal.style.display = 'flex';

    const clearBtn = document.getElementById('modal-picker-search-clear');
    if (clearBtn) clearBtn.style.display = 'none';

    if (search) {
      search.value = '';
      setTimeout(() => {
        try {
          search.focus();
        } catch(e) {}
      }, 50);
    }

    const normalizeText = (str) => {
      return (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[-_]/g, ' ')
        .trim();
    };

    const renderList = (query = '') => {
      const q = normalizeText(query);
      const filtered = PRODUCTS_DB.filter(p => {
        if (!q) return true;
        const normName = normalizeText(p.name);
        const normFormat = normalizeText(p.format);
        const normBrand = normalizeText(p.brand || '');
        const normCategory = normalizeText(p.category || '');
        return normName.includes(q) || normFormat.includes(q) || normBrand.includes(q) || normCategory.includes(q);
      });

      if (filtered.length === 0) {
        list.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            🔍 No hay productos que coincidan con "<strong>${query}</strong>"
          </div>
        `;
        return;
      }

      list.innerHTML = filtered.map(p => {
        const channel = AppState.getActiveChannel();
        const discount = (p.discounts && p.discounts[channel] !== undefined) ? p.discounts[channel] : (p.discounts?.t3 || 0);
        const res = PriceEngine.calculateProduct(p, discount);

        return `
          <div class="modal-product-item" data-id="${p.id}">
            <div>
              <div style="font-weight: 800; font-size: 0.9rem; color: var(--text-main);">${p.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${p.format} · ${p.unitsPerBox} uds/caja</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; color: var(--primary);">${PriceEngine.formatCurrency(res.netoCajaSinPV)}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Dcto ${discount.toFixed(1)}%</div>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.modal-product-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          const found = PRODUCTS_DB.find(p => p.id === id);
          if (found) {
            this.addProductToComparison(found);
            modal.style.display = 'none';
          }
        });
      });
    };

    renderList('');

    const onSearchChange = (e) => {
      const val = (e && e.target) ? e.target.value : (search ? search.value : '');
      if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
      renderList(val);
    };

    if (search) {
      search.oninput = onSearchChange;
      search.onkeyup = onSearchChange;
    }

    if (clearBtn) {
      clearBtn.onclick = () => {
        if (search) {
          search.value = '';
          search.focus();
        }
        clearBtn.style.display = 'none';
        renderList('');
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => { modal.style.display = 'none'; };
    }

    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  },

  saveToStorage() {
    try {
      localStorage.setItem('tarificador_comp_items', JSON.stringify(this.items));
      localStorage.setItem('tarificador_comp_subida6', this.subidaCompetenciaApplied ? '1' : '0');
      localStorage.setItem('tarificador_comp_envases', this.includeEnvases ? '1' : '0');
      localStorage.setItem('tarificador_comp_distributor_name', this.distributorName || '');
    } catch(e) {
      console.warn('Storage save error', e);
    }
  },

  loadFromStorage() {
    try {
      const savedItems = localStorage.getItem('tarificador_comp_items');
      if (savedItems) {
        this.items = JSON.parse(savedItems);
      }
      this.subidaCompetenciaApplied = localStorage.getItem('tarificador_comp_subida6') === '1';
      this.includeEnvases = localStorage.getItem('tarificador_comp_envases') !== '0';
      const savedDistName = localStorage.getItem('tarificador_comp_distributor_name');
      if (savedDistName) {
        this.distributorName = savedDistName;
      }
      if (this.inputDistributorName) {
        this.inputDistributorName.value = this.distributorName;
      }
      this.updateDistributorLabels();
    } catch(e) {
      console.warn('Storage load error', e);
    }
  }
};
