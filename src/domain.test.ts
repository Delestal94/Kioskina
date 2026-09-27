import { describe, expect, it } from 'vitest';
import { addCustomer, addProduct, can, cashOf, closeShift, completeSale, debtOf, emptyData, moveStock, openShift, parseMoney, payDebt, setUserActive, stockOf, validateImport, voidSale, type AppData, type User } from './domain';

const owner: User = { id: 'owner', name: 'Dueño', role: 'owner', salt: '00', passwordHash: '00', active: true };
const cashier: User = { id: 'cashier', name: 'Cajero', role: 'cashier', salt: '00', passwordHash: '00', active: true };
function setup(): AppData { const data = emptyData('Comercio ficticio', { ...owner }); data.users.push({ ...cashier }); return data }

describe('operación local', () => {
  it('registra una venta una sola vez ante doble confirmación', () => {
    const data = setup();
    const product = addProduct(data, owner.id, { code: 'A1', name: 'Agua', category: 'Bebidas', priceMinor: 25000, openingQtyMilli: 5000 });
    const shift = openShift(data, cashier.id, 10000);
    const input = { idempotencyKey: 'misma-operacion', lines: [{ productId: product.id, qtyMilli: 2000 }], payments: [{ method: 'cash' as const, amountMinor: 50000, receivedMinor: 60000 }] };
    const first = completeSale(data, cashier.id, input);
    const second = completeSale(data, cashier.id, input);
    expect(first.id).toBe(second.id);
    expect(data.sales).toHaveLength(1);
    expect(stockOf(data, product.id)).toBe(3000);
    expect(cashOf(data, shift.id)).toBe(60000);
    expect(data.stockMoves.filter(m => m.refId === first.id && m.reason === 'sale')).toHaveLength(1);
    expect(() => completeSale(data, cashier.id, { ...input, lines: [{ productId: product.id, qtyMilli: 1000 }] })).toThrow('ya fue usada');
  });

  it('compensa el faltante exacto y revierte todos los movimientos al anular', () => {
    const data = setup();
    const product = addProduct(data, owner.id, { code: 'A2', name: 'Gaseosa', category: 'Bebidas', priceMinor: 15000, openingQtyMilli: 1000 });
    openShift(data, cashier.id, 0);
    const sale = completeSale(data, cashier.id, { idempotencyKey: 'falta-stock', lines: [{ productId: product.id, qtyMilli: 3000 }], payments: [{ method: 'cash', amountMinor: 45000 }] });
    expect(data.stockMoves.find(m => m.refId === sale.id && m.reason === 'compensation')?.deltaMilli).toBe(2000);
    expect(stockOf(data, product.id)).toBe(0);
    openShift(data, owner.id, 50000);
    voidSale(data, owner.id, sale.id);
    expect(stockOf(data, product.id)).toBe(1000);
    expect(() => voidSale(data, owner.id, sale.id)).toThrow('ya está anulada');
  });

  it('mantiene caja y fiado conciliables incluso después de anular', () => {
    const data = setup();
    const product = addProduct(data, owner.id, { code: 'A3', name: 'Alfajor', category: 'Dulces', priceMinor: 10000, openingQtyMilli: 10000 });
    const customer = addCustomer(data, owner.id, 'Cliente ficticio');
    const shift = openShift(data, cashier.id, 2000);
    const sale = completeSale(data, cashier.id, { idempotencyKey: 'mixto', lines: [{ productId: product.id, qtyMilli: 2000 }], payments: [{ method: 'cash', amountMinor: 5000 }, { method: 'credit', amountMinor: 15000 }], customerId: customer.id });
    expect(cashOf(data, shift.id)).toBe(7000);
    expect(debtOf(data, customer.id)).toBe(15000);
    const ownerShift = openShift(data, owner.id, 20000);
    voidSale(data, owner.id, sale.id);
    expect(cashOf(data, shift.id)).toBe(7000);
    expect(cashOf(data, ownerShift.id)).toBe(15000);
    expect(debtOf(data, customer.id)).toBe(0);
    const closed = closeShift(data, cashier.id, 7000);
    expect(closed.expectedMinor).toBe(7000);
    expect(closed.countedMinor).toBe(7000);
  });

  it('deniega por defecto cambios de catálogo e inventario al cajero', () => {
    const data = setup();
    expect(can(cashier, 'catalog')).toBe(false);
    expect(() => addProduct(data, cashier.id, { code: 'A4', name: 'Producto', category: '', priceMinor: 100 })).toThrow('permiso');
    const product = addProduct(data, owner.id, { code: 'A4', name: 'Producto', category: '', priceMinor: 100 });
    expect(() => moveStock(data, cashier.id, product.id, 1000, 'adjustment')).toThrow('permiso');
    expect(stockOf(data, product.id)).toBe(0);
  });

  it('registra el cobro de fiado en la caja que recibe efectivo', () => {
    const data = setup();
    const customer = addCustomer(data, owner.id, 'Cliente ficticio');
    data.debtMoves.push({ id: 'deuda', at: new Date().toISOString(), customerId: customer.id, amountMinor: 30000, reason: 'sale', actorId: owner.id });
    expect(() => payDebt(data, owner.id, customer.id, 10000, 'cash')).toThrow('Abrí tu turno');
    const shift = openShift(data, owner.id, 0);
    payDebt(data, owner.id, customer.id, 10000, 'cash');
    expect(debtOf(data, customer.id)).toBe(20000);
    expect(cashOf(data, shift.id)).toBe(10000);
  });

  it('rechaza cobros incompletos y cantidades inválidas antes de mutar', () => {
    const data = setup();
    const product = addProduct(data, owner.id, { code: 'A5', name: 'Producto', category: '', priceMinor: 1000, openingQtyMilli: 1000 });
    openShift(data, cashier.id, 0);
    expect(() => completeSale(data, cashier.id, { idempotencyKey: 'mal-pago', lines: [{ productId: product.id, qtyMilli: 1000 }], payments: [{ method: 'cash', amountMinor: 900 }] })).toThrow('sumar exactamente');
    expect(data.sales).toHaveLength(0);
    expect(stockOf(data, product.id)).toBe(1000);
    expect(parseMoney('1.234,56')).toBe(123456);
    expect(() => parseMoney('1.234,567')).toThrow('importe válido');
  });

  it('sólo aplica descuentos con permiso y conserva el subtotal histórico', () => {
    const data = setup();
    const product = addProduct(data, owner.id, { code: 'D1', name: 'Producto', category: '', priceMinor: 10000, openingQtyMilli: 2000 });
    openShift(data, cashier.id, 0);
    expect(() => completeSale(data, cashier.id, { idempotencyKey: 'desc-cajero', lines: [{ productId: product.id, qtyMilli: 1000 }], discountMinor: 1000, payments: [{ method: 'cash', amountMinor: 9000 }] })).toThrow('permiso');
    openShift(data, owner.id, 0);
    const sale = completeSale(data, owner.id, { idempotencyKey: 'desc-owner', lines: [{ productId: product.id, qtyMilli: 1000 }], discountMinor: 1000, payments: [{ method: 'cash', amountMinor: 9000 }] });
    expect(sale.lines[0].totalMinor).toBe(10000);
    expect(sale.totalMinor).toBe(9000);
    expect(data.audit.some(a => a.action === 'sale.discount.applied' && a.entityId === sale.id)).toBe(true);
  });

  it('mantiene un dueño activo y exige cerrar el turno antes de desactivar un usuario', () => {
    const data = setup();
    expect(() => setUserActive(data, owner.id, owner.id, false)).toThrow('propia cuenta');
    openShift(data, cashier.id, 0);
    expect(() => setUserActive(data, owner.id, cashier.id, false)).toThrow('Cerrá el turno');
    closeShift(data, cashier.id, 0);
    setUserActive(data, owner.id, cashier.id, false);
    expect(can(data.users.find(u => u.id === cashier.id), 'sell')).toBe(false);
  });

  it('valida integridad básica antes de restaurar una copia', () => {
    const data = setup();
    const product = addProduct(data, owner.id, { code: 'C1', name: 'Caramelo', category: '', priceMinor: 100, openingQtyMilli: 5000 });
    openShift(data, cashier.id, 0);
    completeSale(data, cashier.id, { idempotencyKey: 'copia', lines: [{ productId: product.id, qtyMilli: 1000 }], payments: [{ method: 'cash', amountMinor: 100 }] });
    const copy = JSON.parse(JSON.stringify(data)) as AppData;
    expect(stockOf(validateImport(copy), product.id)).toBe(4000);
    copy.sales[0].totalMinor = 999;
    expect(() => validateImport(copy)).toThrow('referencias de venta');
  });
});
