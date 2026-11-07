/**
 * MÓDULO 2: COMPARADOR DE FACTURAS VS. COMPETENCIA ("MODO CISNEROS")
 * Compara albaranes reales contra nuestra tarifa, calcula ahorro y genera mensajes para WhatsApp.
 */

const ComparatorModule = {
  items: [],
  subidaCompetenciaApplied: false,
  envasesMode: 'per_box', // 'per_box' or 'global'
  globalEnvasesAmount: 33.80,
  includeEnvases: true,

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
    this.btnLoadExample = document.getElementById('comp-btn-example');
    this.btnSubida6 = document.getElementById('comp-btn-subida6');
    this.btnCopyWhatsApp = document.getElementById('comp-btn-whatsapp');
    this.btnClear = document.getElementById('comp-btn-clear');

    // Envases controls
    this.checkIncludeEnvases = document.getElementById('comp-check-envases');
    this.inputGlobalEnvases = document.getElementById('comp-input-envases-global');
    this.envasesOptionsWrapper = document.getElementById('comp-envases-options');

    // Totals DOM elements
    this.totalCompSinIVA = document.getElementById('comp-total-comp-sin-iva');
    this.totalOurSinIVA = document.getElementById('comp-total-our-sin-iva');
    this.totalSavingsSinIVA = document.getElementById('comp-total-savings-sin-iva');
    this.totalCompConIVA = document.getElementById('comp-total-comp-con-iva');
    this.totalOurConIVA = document.getElementById('comp-total-our-con-iva');
    this.totalSavingsConIVA = document.getElementById('comp-total-savings-con-iva');
    this.savingsBadge = document.getElementById('comp-savings-badge');
    this.savingsPercent = document.getElementById('comp-savings-percent');
  },

  bindEvents() {
    if (this.btnLoadExample) {
      this.btnLoadExample.addEventListener('click', () => {
        this.loadExampleData();
        AppNotification.show('📋 Albarán de ejemplo de la competencia cargado');
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
        if (this.envasesOptionsWrapper) {
          this.envasesOptionsWrapper.style.display = this.includeEnvases ? 'flex' : 'none';
        }
        this.saveToStorage();
        this.render();
      });
    }

    if (this.inputGlobalEnvases) {
      this.inputGlobalEnvases.addEventListener('input', (e) => {
        this.globalEnvasesAmount = parseFloat(e.target.value) || 0;
        this.saveToStorage();
        this.render();
      });
    }
  },

  loadExampleData() {
    this.subidaCompetenciaApplied = false;
    this.includeEnvases = true;
    this.globalEnvasesAmount = 33.80;

    if (this.checkIncludeEnvases) this.checkIncludeEnvases.checked = true;
    if (this.inputGlobalEnvases) this.inputGlobalEnvases.value = '33.80';
    if (this.btnSubida6) {
      this.btnSubida6.classList.remove('active');
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
        boxes: 3,
        compPrice: 16.00,
        originalCompPrice: 16.00,
        envasePerBox: 4.80
      },
      {
        productId: 'vr-cc-zero-237',
        boxes: 1,
        compPrice: 16.00,
        originalCompPrice: 16.00,
        envasePerBox: 4.80
      },
      {
        productId: 'vr-fanta-naranja-237',
        boxes: 1,
        compPrice: 16.00,
        originalCompPrice: 16.00,
        envasePerBox: 4.80
      },
      {
        productId: 'vr-aquarius-limon-30',
        boxes: 1,
        compPrice: 25.35,
        originalCompPrice: 25.35,
        envasePerBox: 7.20
      },
      {
        productId: 'pet-aquabona-50',
        boxes: 3,
        compPrice: 8.50,
        originalCompPrice: 8.50,
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

  addProductToComparison(product) {
    const existing = this.items.find(i => i.productId === product.id);
    if (existing) {
      existing.boxes += 1;
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
        boxes: 1,
        compPrice: defaultComp,
        originalCompPrice: defaultComp,
        envasePerBox: defaultEnvase
      });
    }
    this.saveToStorage();
    this.render();
  },

  render() {
    if (!this.tableBody) return;
    const channel = AppState.getActiveChannel();
    const options = AppState.getOptions();

    let totalCompSinIVA = 0;
    let totalOurSinIVA = 0;
    let totalIVAComp = 0;
    let totalIVAOur = 0;
    let totalEnvasesAmount = 0;

    if (this.items.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No hay productos en la comparativa.<br>
            <button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="ComparatorModule.loadExampleData()">
              ⚡ Cargar Ejemplo Albarán Competencia
            </button>
          </td>
        </tr>
      `;
      this.updateTotals(0, 0, 0, 0, 0);
      return;
    }

    this.tableBody.innerHTML = this.items.map((item, index) => {
      const product = PRODUCTS_DB.find(p => p.id === item.productId);
      if (!product) return '';

      const discount = (product.discounts && product.discounts[channel] !== undefined)
        ? product.discounts[channel]
        : (product.discounts?.t3 || 0);

      const ourRes = PriceEngine.calculateProduct(product, discount, { includePV: options.includePV, includeIVA: false });
      const ourBoxPrice = ourRes.finalCaja;

      const lineCompSinIVA = item.compPrice * item.boxes;
      const lineOurSinIVA = ourBoxPrice * item.boxes;

      totalCompSinIVA += lineCompSinIVA;
      totalOurSinIVA += lineOurSinIVA;

      // Tax
      const ivaFactor = product.iva / 100;
      totalIVAComp += lineCompSinIVA * ivaFactor;
      totalIVAOur += lineOurSinIVA * ivaFactor;

      if (this.includeEnvases) {
        totalEnvasesAmount += (item.envasePerBox || 0) * item.boxes;
      }

      const diffPerBox = item.compPrice - ourBoxPrice;
      const lineSavings = diffPerBox * item.boxes;
      const weWin = diffPerBox >= 0;

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-main);">${product.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${product.format} · ${product.unitsPerBox} uds · IVA ${product.iva}%</div>
          </td>
          <td style="text-align: center;">
            <input type="number" min="1" max="999" class="comp-input" style="width: 60px; text-align: center;" 
              value="${item.boxes}" onchange="ComparatorModule.updateBoxes(${index}, this.value)">
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" step="0.01" class="comp-input" style="width: 75px; text-align: right;" 
                value="${item.compPrice.toFixed(2)}" onchange="ComparatorModule.updateCompPrice(${index}, this.value)">
              <span style="font-size: 0.8rem; color: var(--text-muted);">€</span>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
              Total: <strong>${PriceEngine.formatCurrency(lineCompSinIVA)}</strong>
            </div>
          </td>
          <td>
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary);">
              ${PriceEngine.formatCurrency(ourBoxPrice)}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
              Dcto ${discount.toFixed(1)}% · Total: <strong>${PriceEngine.formatCurrency(lineOurSinIVA)}</strong>
            </div>
          </td>
          <td>
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
          <td style="text-align: center;">
            <button class="action-icon-btn" style="width: 32px; height: 32px; color: var(--danger); margin: 0 auto;" 
              onclick="ComparatorModule.removeLine(${index})" title="Eliminar línea">
              🗑️
            </button>
          </td>
        </tr>
      `;
    }).join('');

    this.updateTotals(totalCompSinIVA, totalOurSinIVA, totalIVAComp, totalIVAOur, totalEnvasesAmount);
  },

  updateBoxes(index, val) {
    const boxes = parseInt(val, 10) || 1;
    if (this.items[index]) {
      this.items[index].boxes = Math.max(1, boxes);
      this.saveToStorage();
      this.render();
    }
  },

  updateCompPrice(index, val) {
    const price = parseFloat(val) || 0;
    if (this.items[index]) {
      this.items[index].compPrice = price;
      this.items[index].originalCompPrice = this.subidaCompetenciaApplied ? parseFloat((price / 1.06).toFixed(2)) : price;
      this.saveToStorage();
      this.render();
    }
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
        this.savingsBadge.innerHTML = `💡 Con 23,7 cl (+18,5% de producto por botella), el cliente recibe mucho más producto y valor total.`;
        this.savingsBadge.className = 'sales-pitch-banner';
      }
    }
  },

  copyComparisonToWhatsApp() {
    if (this.items.length === 0) {
      AppNotification.show('⚠️ Añade productos a la comparativa primero');
      return;
    }

    const channel = AppState.getActiveChannel();
    const channelLabel = AppState.getChannelLabel();
    let text = `📊 *COMPARATIVA DE FACTURA - TARIFA 2027*\n`;
    text += `🏢 *Canal:* ${channelLabel}\n`;
    text += `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n`;
    text += `------------------------------------\n\n`;

    let totalComp = 0;
    let totalOur = 0;

    this.items.forEach(item => {
      const product = PRODUCTS_DB.find(p => p.id === item.productId);
      if (!product) return;

      const discount = (product.discounts && product.discounts[channel] !== undefined)
        ? product.discounts[channel]
        : (product.discounts?.t3 || 0);

      const ourRes = PriceEngine.calculateProduct(product, discount);
      const ourBox = ourRes.netoCajaSinPV;
      const compBox = item.compPrice;

      const lineComp = compBox * item.boxes;
      const lineOur = ourBox * item.boxes;
      totalComp += lineComp;
      totalOur += lineOur;

      const diffBox = compBox - ourBox;
      const symbol = diffBox >= 0 ? '✅' : '🔴';

      text += `${symbol} *${product.name}*\n`;
      text += `   • Cajas: ${item.boxes} | Comp: ${compBox.toFixed(2)}€ | *Nosotros: ${ourBox.toFixed(2)}€*\n`;
      if (diffBox > 0) {
        text += `   • 💰 *Ganas +${(diffBox * item.boxes).toFixed(2)}€ en esta línea*\n`;
      }
      text += `\n`;
    });

    const savings = totalComp - totalOur;
    text += `------------------------------------\n`;
    text += `🔴 *Total Competencia (Sin IVA):* ${totalComp.toFixed(2)} €\n`;
    text += `🟢 *Total Nuestro (${channelLabel}):* ${totalOur.toFixed(2)} €\n`;

    if (savings > 0) {
      text += `🏆 *AHORRO DIRECTO:* +${savings.toFixed(2)} € (${((savings/totalComp)*100).toFixed(1)}%)\n`;
    } else {
      text += `⚖️ *Diferencia neta:* ${savings.toFixed(2)} €\n`;
    }

    text += `\n💡 *ARGUMENTO CLAVE DE VENTA:*\n`;
    text += `Nuestro Vidrio Retornable es de *23,7 cl* frente a los 200 ml de la competencia.\n`;
    text += `👉 *+18,5% MÁS DE PRODUCTO POR BOTELLA* (casi 1 litro más por caja al mismo precio de consumición en barra).\n\n`;
    text += `_Generado con Tarificador Comercial Pro 2027_`;

    navigator.clipboard.writeText(text).then(() => {
      AppNotification.show('📲 Comparativa copiada para WhatsApp');
    }).catch(() => {
      // Fallback
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

    if (title) title.textContent = 'Añadir Producto a la Comparativa';
    modal.style.display = 'flex';
    if (search) {
      search.value = '';
      search.focus();
    }

    const renderList = (query = '') => {
      const q = query.toLowerCase();
      const filtered = PRODUCTS_DB.filter(p => !q || p.name.toLowerCase().includes(q) || p.format.toLowerCase().includes(q));

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
            AppNotification.show(`Añadido: ${found.name}`);
            modal.style.display = 'none';
          }
        });
      });
    };

    renderList();

    if (search) {
      search.oninput = (e) => renderList(e.target.value);
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
      localStorage.setItem('tarificador_comp_global_envases', this.globalEnvasesAmount.toString());
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
      const savedGlobal = localStorage.getItem('tarificador_comp_global_envases');
      if (savedGlobal) this.globalEnvasesAmount = parseFloat(savedGlobal) || 33.80;
    } catch(e) {
      console.warn('Storage load error', e);
    }
  }
};
