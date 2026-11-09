/**
 * MÓDULO 3: CREADOR DE PRESUPUESTOS Y PEDIDOS
 * Generación rápida de pedidos, desglose de impuestos y exportación a WhatsApp / Impresión.
 */

const OrdersModule = {
  items: [],
  customer: {
    name: '',
    barName: '',
    phone: '',
    notes: ''
  },

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
    this.container = document.getElementById('order-items-list');
    this.emptyState = document.getElementById('order-empty-state');
    this.customerNameInput = document.getElementById('order-cust-name');
    this.barNameInput = document.getElementById('order-bar-name');
    this.phoneInput = document.getElementById('order-phone');
    this.notesInput = document.getElementById('order-notes');

    // Totals
    this.totalBoxesEl = document.getElementById('order-total-boxes');
    this.baseImponibleEl = document.getElementById('order-base-imponible');
    this.totalPVEl = document.getElementById('order-total-pv');
    this.iva10El = document.getElementById('order-iva-10');
    this.iva21El = document.getElementById('order-iva-21');
    this.grandTotalEl = document.getElementById('order-grand-total');
    this.totalLabelEl = document.getElementById('order-total-label');
    this.totalSubtextEl = document.getElementById('order-total-subtext');

    // Action buttons
    this.btnWhatsApp = document.getElementById('order-btn-whatsapp');
    this.btnCopy = document.getElementById('order-btn-copy');
    this.btnPrint = document.getElementById('order-btn-print');
    this.btnClear = document.getElementById('order-btn-clear');
    this.btnAddProduct = document.getElementById('order-btn-add-product');
    this.btnExample = document.getElementById('order-btn-example');
  },

  bindEvents() {
    // Customer form inputs
    const inputs = [
      { el: this.customerNameInput, key: 'name' },
      { el: this.barNameInput, key: 'barName' },
      { el: this.phoneInput, key: 'phone' },
      { el: this.notesInput, key: 'notes' }
    ];

    inputs.forEach(({ el, key }) => {
      if (el) {
        el.addEventListener('input', (e) => {
          this.customer[key] = e.target.value;
          this.saveToStorage();
        });
      }
    });

    if (this.btnExample) {
      this.btnExample.addEventListener('click', () => {
        this.loadExampleData();
        AppNotification.show('📋 Pedido de ejemplo cargado');
      });
    }

    if (this.btnAddProduct) {
      this.btnAddProduct.addEventListener('click', () => {
        this.showAddProductModal();
      });
    }

    if (this.btnWhatsApp) {
      this.btnWhatsApp.addEventListener('click', () => {
        this.sendWhatsApp();
      });
    }

    if (this.btnCopy) {
      this.btnCopy.addEventListener('click', () => {
        this.copyOrderText();
      });
    }

    if (this.btnPrint) {
      this.btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    if (this.btnClear) {
      this.btnClear.addEventListener('click', () => {
        if (confirm('¿Deseas vaciar todas las líneas del pedido?')) {
          this.items = [];
          this.saveToStorage();
          this.render();
          AppNotification.show('🗑️ Pedido vaciado');
        }
      });
    }
  },

  loadExampleData() {
    this.customer = {
      name: 'Antonio Gómez',
      barName: 'Café Bar Central',
      phone: '612345678',
      notes: 'Entrega por la mañana antes de las 12h'
    };
    this.items = [
      { productId: 'vr-cc-regular-237', boxes: 5, discount: 32.50 },
      { productId: 'vr-cc-zero-237', boxes: 2, discount: 32.50 },
      { productId: 'vr-fanta-naranja-237', boxes: 2, discount: 46.50 },
      { productId: 'vr-aquarius-limon-30', boxes: 1, discount: 48.00 },
      { productId: 'pet-aquabona-50', boxes: 3, discount: 69.00 }
    ];
    this.saveToStorage();
    this.render();
  },

  showAddProductModal() {
    const modal = document.getElementById('product-picker-modal');
    const list = document.getElementById('modal-picker-list');
    const search = document.getElementById('modal-picker-search');
    const closeBtn = document.getElementById('modal-picker-close');
    const title = document.getElementById('modal-picker-title');

    if (!modal || !list) return;

    if (title) title.textContent = 'Añadir Producto al Pedido';
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
        const options = AppState.getOptions();
        const res = PriceEngine.calculateProduct(p, discount, options);

        return `
          <div class="modal-product-item" data-id="${p.id}">
            <div>
              <div style="font-weight: 800; font-size: 0.9rem; color: var(--text-main);">${p.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${p.format} · ${p.unitsPerBox} uds/caja</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; color: var(--primary);">${PriceEngine.formatCurrency(res.finalCaja)}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${PriceEngine.formatUnitCurrency(res.finalUd)}/ud · Dcto ${discount.toFixed(1)}%</div>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.modal-product-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          const found = PRODUCTS_DB.find(p => p.id === id);
          if (found) {
            const channel = AppState.getActiveChannel();
            const discount = (found.discounts && found.discounts[channel] !== undefined) ? found.discounts[channel] : (found.discounts?.t3 || 0);
            this.addProductToOrder(found, discount, 1);
            AppNotification.show(`🛒 1 caja de ${found.name} añadida`);
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

  addProductToOrder(product, discountPercent, boxes = 1, bonification = null) {
    const existing = this.items.find(i => i.productId === product.id && JSON.stringify(i.bonification || null) === JSON.stringify(bonification || null));
    if (existing) {
      existing.boxes += boxes;
      existing.discount = discountPercent;
    } else {
      this.items.push({
        productId: product.id,
        boxes: boxes,
        discount: discountPercent,
        bonification: bonification
      });
    }

    this.saveToStorage();
    this.render();
  },

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].boxes += delta;
      if (this.items[index].boxes <= 0) {
        this.items.splice(index, 1);
      }
      this.saveToStorage();
      this.render();
    }
  },

  updateDiscount(index, val) {
    const d = parseFloat(val) || 0;
    if (this.items[index]) {
      this.items[index].discount = Math.min(100, Math.max(0, d));
      this.saveToStorage();
      this.render();
    }
  },

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveToStorage();
    this.render();
  },

  render() {
    if (!this.container) return;

    if (this.customerNameInput) this.customerNameInput.value = this.customer.name || '';
    if (this.barNameInput) this.barNameInput.value = this.customer.barName || '';
    if (this.phoneInput) this.phoneInput.value = this.customer.phone || '';
    if (this.notesInput) this.notesInput.value = this.customer.notes || '';

    if (this.items.length === 0) {
      if (this.emptyState) this.emptyState.style.display = 'block';
      this.container.innerHTML = '';
      this.updateTotals(0, 0, 0, 0, 0);
      return;
    }

    if (this.emptyState) this.emptyState.style.display = 'none';

    let totalBoxesBilled = 0;
    let totalBoxesDelivered = 0;
    let baseImponible = 0;
    let totalPV = 0;
    let iva10Total = 0;
    let iva21Total = 0;
    let totalGiftValue = 0;

    const options = AppState.getOptions();

    this.container.innerHTML = this.items.map((item, index) => {
      const product = PRODUCTS_DB.find(p => p.id === item.productId);
      if (!product) return '';

      totalBoxesBilled += item.boxes;
      let freeBoxes = 0;
      let bonifBadge = '';

      if (item.bonification) {
        if (item.bonification.type === 'promo') {
          freeBoxes = item.bonification.free || 0;
          bonifBadge = `<span style="background: var(--success-bg); color: var(--success-text); font-size: 0.74rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; margin-left: 6px;">🎁 +${freeBoxes} GRATIS (${item.bonification.label})</span>`;
        } else if (item.bonification.type === 'rappel') {
          bonifBadge = `<span style="background: rgba(59, 130, 246, 0.15); color: #2563eb; font-size: 0.74rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; margin-left: 6px;">💶 ${item.bonification.label}</span>`;
        }
      }

      totalBoxesDelivered += item.boxes + freeBoxes;

      const calc = PriceEngine.calculateProduct(product, item.discount, options);
      
      let lineBase = calc.netoCajaSinPV * item.boxes;
      if (item.bonification && item.bonification.type === 'rappel') {
        const rappelTotal = (item.bonification.rappel || 0) * item.boxes;
        lineBase = Math.max(0, lineBase - rappelTotal);
        totalGiftValue += rappelTotal;
      }

      const linePV = product.pvCaja * (item.boxes + freeBoxes);

      if (freeBoxes > 0) {
        totalGiftValue += freeBoxes * calc.netoCajaSinPV;
      }

      baseImponible += lineBase;
      totalPV += linePV;

      const lineTotalSinIVA = lineBase + (options.includePV ? linePV : 0);
      const lineTax = lineTotalSinIVA * (product.iva / 100);
      if (product.iva === 10) {
        iva10Total += lineTax;
      } else {
        iva21Total += lineTax;
      }

      // Live prices for box and unit honoring user's global toggles (Con IVA / Con Punto Verde)
      const displayBoxPrice = calc.finalCaja;
      const displayUdPrice = calc.finalUd;

      // Effective price with free boxes
      const lineDisplayTotal = options.includeIVA ? (lineTotalSinIVA + lineTax) : lineTotalSinIVA;
      const effectiveBox = (item.boxes + freeBoxes > 0) ? (lineDisplayTotal / (item.boxes + freeBoxes)) : displayBoxPrice;

      // Status indicator tags
      const taxTag = options.includeIVA ? 'con IVA' : 'sin IVA';
      const pvTag = options.includePV ? '+PV' : '';
      const optionTags = [pvTag, taxTag].filter(Boolean).join(' · ');

      return `
        <div class="order-line-item">
          <div style="flex: 1;">
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
              ${product.name}
              ${bonifBadge}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
              ${product.format} · Tarifa: ${PriceEngine.formatCurrency(product.tarifaBase)} · Dcto: 
              <input type="number" step="0.5" min="0" max="100" class="comp-input" style="width: 55px; padding: 2px 4px; font-size: 0.8rem;" 
                value="${item.discount.toFixed(1)}" onchange="OrdersModule.updateDiscount(${index}, this.value)">%
            </div>
            <div style="font-size: 0.8rem; color: var(--primary); font-weight: 700; margin-top: 3px;">
              ${PriceEngine.formatCurrency(displayBoxPrice)}/caja (${PriceEngine.formatUnitCurrency(displayUdPrice)}/ud)
              ${freeBoxes > 0 ? `· <span style="color: var(--success); font-weight: 800;">Efectivo regalo: ${PriceEngine.formatCurrency(effectiveBox)}/caja</span>` : ''}
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600; margin-left: 4px;">(${optionTags})</span>
            </div>
          </div>

          <div class="order-qty-control">
            <button class="qty-btn" onclick="OrdersModule.updateQuantity(${index}, -1)">−</button>
            <span style="font-weight: 800; min-width: 28px; text-align: center; font-size: 1rem;">${item.boxes}</span>
            <button class="qty-btn" onclick="OrdersModule.updateQuantity(${index}, 1)">+</button>
          </div>

          <div style="text-align: right; min-width: 85px;">
            <div style="font-weight: 900; font-size: 1.05rem; color: var(--text-main);">
              ${PriceEngine.formatCurrency(lineDisplayTotal)}
            </div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">
              ${options.includeIVA ? 'Total con IVA' : 'Subtotal neto'}
            </div>
            <button class="action-icon-btn" style="width: 24px; height: 24px; font-size: 12px; margin-left: auto; margin-top: 4px; color: var(--danger);" 
              onclick="OrdersModule.removeItem(${index})" title="Eliminar producto">
              ✕
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.updateTotals(totalBoxesBilled, totalBoxesDelivered, baseImponible, totalPV, iva10Total, iva21Total, totalGiftValue);
  },

  updateTotals(totalBoxesBilled, totalBoxesDelivered, baseImponible, totalPV, iva10, iva21, totalGiftValue = 0) {
    const options = AppState.getOptions();
    const subtotalWithPV = baseImponible + (options.includePV ? totalPV : 0);
    const grandTotal = subtotalWithPV + iva10 + iva21;

    if (this.totalBoxesEl) {
      if (totalBoxesDelivered > totalBoxesBilled) {
        this.totalBoxesEl.innerHTML = `<strong>${totalBoxesBilled} cajas cobradas</strong> <span style="color: var(--success); font-size: 0.78rem;">(${totalBoxesDelivered} entregadas con regalo)</span>`;
      } else {
        this.totalBoxesEl.textContent = `${totalBoxesBilled} cajas`;
      }
    }
    if (this.baseImponibleEl) this.baseImponibleEl.textContent = PriceEngine.formatCurrency(baseImponible);
    if (this.totalPVEl) this.totalPVEl.textContent = PriceEngine.formatCurrency(totalPV);
    if (this.iva10El) this.iva10El.textContent = PriceEngine.formatCurrency(iva10);
    if (this.iva21El) this.iva21El.textContent = PriceEngine.formatCurrency(iva21);

    if (options.includeIVA) {
      if (this.totalLabelEl) this.totalLabelEl.textContent = 'TOTAL FACTURA (Con IVA):';
      if (this.grandTotalEl) this.grandTotalEl.textContent = PriceEngine.formatCurrency(grandTotal);
      if (this.totalSubtextEl) this.totalSubtextEl.textContent = `Base + PV: ${PriceEngine.formatCurrency(subtotalWithPV)} · IVA total: ${PriceEngine.formatCurrency(iva10 + iva21)}`;
    } else {
      if (this.totalLabelEl) this.totalLabelEl.textContent = 'TOTAL PEDIDO (Sin IVA):';
      if (this.grandTotalEl) this.grandTotalEl.textContent = PriceEngine.formatCurrency(subtotalWithPV);
      if (this.totalSubtextEl) this.totalSubtextEl.textContent = `Total estimado con IVA: ${PriceEngine.formatCurrency(grandTotal)}`;
    }
  },

  generateOrderText() {
    const options = AppState.getOptions();
    const channelLabel = AppState.getChannelLabel();
    let text = `📦 *PEDIDO / PRESUPUESTO COMERCIAL 2027*\n`;
    text += `🏢 *Cliente / Local:* ${this.customer.barName || this.customer.name || 'Cliente'}\n`;
    if (this.customer.name && this.customer.barName) {
      text += `👤 *Contacto:* ${this.customer.name}\n`;
    }
    text += `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n`;
    text += `🏷️ *Canal / Tramo:* ${channelLabel}\n`;
    text += `------------------------------------\n\n`;

    let totalBoxesBilled = 0;
    let totalBoxesDelivered = 0;
    let baseTotal = 0;
    let pvTotal = 0;
    let ivaTotal = 0;
    let totalGifts = 0;

    this.items.forEach(item => {
      const product = PRODUCTS_DB.find(p => p.id === item.productId);
      if (!product) return;

      totalBoxesBilled += item.boxes;
      let freeBoxes = 0;
      let bonifTag = '';

      if (item.bonification) {
        if (item.bonification.type === 'promo') {
          freeBoxes = item.bonification.free || 0;
          bonifTag = ` (+${freeBoxes} GRATIS 🎁)`;
        } else if (item.bonification.type === 'rappel') {
          bonifTag = ` (💶 ${item.bonification.label})`;
        }
      }

      totalBoxesDelivered += item.boxes + freeBoxes;

      const calc = PriceEngine.calculateProduct(product, item.discount, options);
      let lineBase = calc.netoCajaSinPV * item.boxes;
      if (item.bonification && item.bonification.type === 'rappel') {
        lineBase = Math.max(0, lineBase - (item.bonification.rappel * item.boxes));
      }

      const linePV = product.pvCaja * (item.boxes + freeBoxes);
      baseTotal += lineBase;
      pvTotal += linePV;

      const lineTax = (lineBase + (options.includePV ? linePV : 0)) * (product.iva / 100);
      ivaTotal += lineTax;

      const lineDisplayAmount = options.includeIVA ? (lineBase + (options.includePV ? linePV : 0) + lineTax) : lineBase;
      const effectiveBox = (item.boxes + freeBoxes > 0) ? (lineDisplayAmount / (item.boxes + freeBoxes)) : calc.finalCaja;

      text += `▫️ *${item.boxes}x*${bonifTag} ${product.name}\n`;
      text += `   ${calc.finalCaja.toFixed(2)}€/caja (${calc.finalUd.toFixed(3)}€/ud ${options.includeIVA ? 'con IVA' : 'sin IVA'}) -> *${lineDisplayAmount.toFixed(2)}€*`;
      if (freeBoxes > 0) {
        text += `\n   👉 *Coste efectivo con regalo: ${effectiveBox.toFixed(2)}€/caja*`;
        totalGifts += freeBoxes;
      }
      text += `\n\n`;
    });

    const finalTotal = baseTotal + (options.includePV ? pvTotal : 0) + ivaTotal;
    const netTotal = baseTotal + (options.includePV ? pvTotal : 0);

    text += `------------------------------------\n`;
    text += `📦 *Cajas Cobradas:* ${totalBoxesBilled}\n`;
    if (totalGifts > 0) {
      text += `🎁 *Cajas Bonificadas:* +${totalGifts} GRATIS (Total: ${totalBoxesDelivered} cajas)\n`;
    }
    text += `💵 *Base Imponible:* ${baseTotal.toFixed(2)} €\n`;
    if (options.includePV) {
      text += `♻️ *Punto Verde:* ${pvTotal.toFixed(2)} €\n`;
    }
    text += `🏛️ *IVA:* ${ivaTotal.toFixed(2)} €\n`;
    if (options.includeIVA) {
      text += `💰 *TOTAL FACTURA (CON IVA):* *${finalTotal.toFixed(2)} €*\n`;
    } else {
      text += `💰 *TOTAL PEDIDO (SIN IVA):* *${netTotal.toFixed(2)} €* (Total con IVA: ${finalTotal.toFixed(2)} €)\n`;
    }

    if (this.customer.notes) {
      text += `\n📝 *Observaciones:* ${this.customer.notes}\n`;
    }
    text += `\n_Generado con Presupuesto 2027 Pro · Plataforma Comercial Oficial_`;

    return text;
  },

  sendWhatsApp() {
    if (this.items.length === 0) {
      AppNotification.show('⚠️ El pedido está vacío');
      return;
    }

    const text = this.generateOrderText();
    let url = `https://wa.me/`;
    if (this.customer.phone) {
      const cleanPhone = this.customer.phone.replace(/[^0-9]/g, '');
      url += (cleanPhone.startsWith('34') ? cleanPhone : '34' + cleanPhone);
    }
    url += `?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
  },

  copyOrderText() {
    if (this.items.length === 0) {
      AppNotification.show('⚠️ El pedido está vacío');
      return;
    }

    const text = this.generateOrderText();
    navigator.clipboard.writeText(text).then(() => {
      AppNotification.show('📋 Resumen de pedido copiado');
    }).catch(() => {
      prompt('Copia el texto del pedido:', text);
    });
  },

  saveToStorage() {
    try {
      localStorage.setItem('tarificador_order_items', JSON.stringify(this.items));
      localStorage.setItem('tarificador_order_customer', JSON.stringify(this.customer));
    } catch(e) {
      console.warn('Storage save error', e);
    }
  },

  loadFromStorage() {
    try {
      const savedItems = localStorage.getItem('tarificador_order_items');
      if (savedItems) this.items = JSON.parse(savedItems);
      const savedCust = localStorage.getItem('tarificador_order_customer');
      if (savedCust) this.customer = JSON.parse(savedCust);
    } catch(e) {
      console.warn('Storage load error', e);
    }
  }
};
