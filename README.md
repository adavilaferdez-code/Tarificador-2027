# 🍷 Tarificador Comercial Pro 2027

Aplicación Web Progresiva (PWA) de alto rendimiento, 100% responsive y optimizada para uso comercial con una mano en movilidad (teléfono móvil frente al cliente) y en escritorio.

---

## 🚀 Características Principales

### 1. 🧮 Calculadora Bidireccional (Tarificador)
- **Cálculo en tiempo real**: modifica el **% de Descuento**, el **Precio Neto de Caja Objetivo** (ej. "16,00 €" para igualar a la competencia) o el **Precio Neto por Unidad**. La aplicación recalcula instantáneamente los otros dos parámetros sin retraso.
- **4 Cifras clave siempre destacadas**:
  1. **Tarifa Base 2027**
  2. **Descuento Aplicado (%)**
  3. **Caja Final (€)**
  4. **Unidad (€)**
- **Acciones rápidas con 1 toque**:
  - `🎯 Igualar a 16,00 €`: calcula automáticamente el descuento necesario.
  - `🔄 Reset a Tramo 3`: restaura el descuento oficial del tramo.
  - `🛒 Añadir al Pedido`: envía la caja al creador de pedidos.
  - `⚔️ Comparar en Albarán`: traslada el producto al comparador.

### 2. ⚔️ Comparador de Facturas vs. Competencia ("Modo Cisneros")
- **Desmonta albaranes de la competencia en segundos**:
  - Introduce el precio que le cobra la competencia al cliente y compara contra nuestra tarifa oficial.
  - Botón **`⚡ Cargar Ejemplo Albarán`** precarga el caso real:
    - 3 cajas Coca-Cola Regular VR 23,7 cl (Comp: 16,00 € | Nuestro T3: 18,47 €)
    - 1 caja Coca-Cola Zero VR 23,7 cl (Comp: 16,00 € | Nuestro T3: 18,47 €)
    - 1 caja Fanta Naranja VR 23,7 cl (Comp: 16,00 € | Nuestro T3: 14,64 €)
    - 1 caja Aquarius Limón VR 30 cl (Comp: 25,35 € | Nuestro T3: 19,47 €)
    - 3 cajas Agua Aquabona PET 50 cl C/24 (Comp: 8,50 € | Nuestro: 6,99 €)
  - Botón **`📈 +6% Subida Competencia`**: simula la subida de tarifas de noviembre en un solo clic.
  - Casilla opcional para fianza de **Envases**: 4,80 €/caja en VR 23,7 y 7,20 €/caja en VR 30.
  - **Argumento de Venta Destacado**:
    > *"💡 Argumento de venta: Nuestro VR es de 23,7 cl frente al RET 200 ml de la competencia (+18,5% más de producto por botella, casi 1 litro más por caja al mismo precio de venta en barra)"*.
  - Botón **`📲 Copiar para WhatsApp`**: genera un mensaje estructurado con emojis listo para enviar al cliente o al grupo comercial.

### 3. 📋 Creador de Presupuestos / Pedidos
- Registro del nombre del cliente, local/bar, teléfono y observaciones de entrega.
- Ajuste de cajas con botones `+` y `−` y edición de descuentos en línea.
- Desglose contable completo:
  - **Base Imponible**
  - **Punto Verde (PV)**
  - **IVA 10%** (Aguas minerales)
  - **IVA 21%** (Refrescos, mixers, energéticas)
  - **Total Pedido Con IVA**
- Exportación:
  - `📲 Enviar Pedido por WhatsApp` (enlace directo a `wa.me`)
  - `📋 Copiar Resumen`
  - `🖨️ Imprimir / Guardar en PDF` (diseño optimizado para impresión de ticket/folio)

### 4. 📊 Tabla Maestra de Tarifas 2027
- Base de datos completa con los **65 productos oficiales** (17 referencias de Vidrio Retornable + 48 referencias de Latas, PET y Aguas).
- Búsqueda en tiempo real por texto y filtros por categorías (`🍾 Vidrio VR`, `🥫 Latas`, `🧴 PET`, `💧 Aguas`, `⚡ Energéticas / Mixers`).
- Ordenación por cualquier columna.
- Botón **`📥 Exportar a CSV`** para abrir en Excel o Google Sheets.

---

## ⚙️ Fórmulas Matemáticas Integradas

1. **Neto Caja (sin PV):**
   $$\text{Neto Caja} = \text{Tarifa Base} \times \left(1 - \frac{\text{Descuento}}{100}\right)$$

2. **Neto Unidad (sin PV):**
   $$\text{Neto Unidad} = \frac{\text{Neto Caja}}{\text{Unidades por Caja}}$$

3. **Neto Caja con Punto Verde (PV):**
   $$\text{Neto Caja con PV} = \text{Neto Caja} + \text{PV Caja}$$

4. **Neto Unidad con PV:**
   $$\text{Neto Unidad con PV} = \frac{\text{Neto Caja con PV}}{\text{Unidades por Caja}}$$

5. **Cálculo Inverso (Bidireccional):**
   $$\text{Descuento Requerido (\%)} = \left(1 - \frac{\text{Precio Caja Objetivo}}{\text{Tarifa Base}}\right) \times 100$$

6. **Impuestos (IVA):**
   - Refrescos, Mixers y Energéticas: **21%**
   - Aguas minerales (`Aquabona`, `Vilas del Turbón`): **10%**

---

## 📱 Selector Global de Canal / Tramo

Configurado en la cabecera superior y seleccionado **por defecto en Tramo 3**:
- `Tramo 3 (Frame - Máximo)` **[POR DEFECTO]**
- `Tramo 2`
- `Tramo 1`
- `Tramo 4`
- `HORECA Diurno`
- `HORECA Nocturno`
- `Tarifa AT (Alimentación Tradicional)`
- `Descuento 0% (Tarifa Base)`

---

## 💾 Persistencia Offline (PWA)
- Los datos del pedido actual, la comparativa de la competencia, las preferencias de Punto Verde e IVA, y el modo oscuro/claro se guardan de forma segura en `localStorage`.
- El archivo `sw.js` (Service Worker) y `manifest.json` permiten instalar la aplicación en móviles (Android e iOS) o escritorio como una aplicación nativa que funciona **100% sin conexión a internet** (en sótanos, barras sin cobertura, etc.).

---

## 🖥️ Cómo Ejecutar Localmente

No requiere Node.js ni compilación. Puedes abrir directamente `index.html` en cualquier navegador moderno, o servirlo con Python:

```bash
python -m http.server 8080
```

Y abrir en el navegador: `http://localhost:8080`
