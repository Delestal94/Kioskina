export type Role = 'owner' | 'manager' | 'cashier';
export type PaymentMethod = 'cash' | 'transfer' | 'qr' | 'credit';
export type Permission = 'sell' | 'shift' | 'catalog' | 'stock' | 'customers' | 'reports' | 'discount' | 'void' | 'users' | 'backup';

export interface User { id: string; name: string; role: Role; salt: string; passwordHash: string; active: boolean }
export interface Product { id: string; code: string; name: string; category: string; priceMinor: number; minQtyMilli: number; active: boolean; createdAt: string }
export interface Customer { id: string; name: string; note: string; active: boolean; createdAt: string }
export interface SaleLine { productId: string; name: string; qtyMilli: number; priceMinor: number; totalMinor: number }
export interface Payment { method: PaymentMethod; amountMinor: number; receivedMinor?: number }
export interface Sale { id: string; idempotencyKey: string; requestFingerprint?: string; at: string; userId: string; shiftId: string; customerId?: string; lines: SaleLine[]; payments: Payment[]; discountMinor?: number; totalMinor: number; voidedAt?: string; voidedBy?: string }
export interface Shift { id: string; userId: string; openedAt: string; openingMinor: number; closedAt?: string; countedMinor?: number; expectedMinor?: number }
export interface StockMove { id: string; at: string; productId: string; deltaMilli: number; reason: 'opening' | 'purchase' | 'adjustment' | 'sale' | 'compensation' | 'void'; refId?: string; actorId: string }
export interface CashMove { id: string; at: string; shiftId: string; amountMinor: number; reason: 'sale' | 'void' | 'adjustment' | 'debt-payment'; refId?: string; actorId: string }
export interface DebtMove { id: string; at: string; customerId: string; amountMinor: number; reason: 'sale' | 'payment' | 'void'; refId?: string; actorId: string }
export interface AuditEvent { id: string; at: string; actorId: string; action: string; entityId: string; detail: string }
export interface AppData {
  schemaVersion: 1;
  revision: number;
  storeName: string;
  users: User[];
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  shifts: Shift[];
  stockMoves: StockMove[];
  cashMoves: CashMove[];
  debtMoves: DebtMove[];
  audit: AuditEvent[];
}

export const roleLabel: Record<Role, string> = { owner: 'Dueño', manager: 'Encargado', cashier: 'Cajero' };
const grants: Record<Role, Permission[]> = {
  owner: ['sell', 'shift', 'catalog', 'stock', 'customers', 'reports', 'discount', 'void', 'users', 'backup'],
  manager: ['sell', 'shift', 'catalog', 'stock', 'customers', 'reports', 'discount', 'void'],
  cashier: ['sell', 'shift']
};
export function can(user: User | undefined, permission: Permission): boolean { return !!user?.active && grants[user.role].includes(permission) }
export function requirePermission(data: AppData, actorId: string, permission: Permission): User {
  const user = data.users.find(u => u.id === actorId);
  if (!can(user, permission)) throw new Error('No tenés permiso para esta acción.');
  return user!;
}
export function id(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let time = BigInt(Date.now());
  for (let i = 5; i >= 0; i--) { bytes[i] = Number(time & 255n); time >>= 8n }
  bytes[6] = (bytes[6] & 15) | 0x70;
  bytes[8] = (bytes[8] & 63) | 0x80;
  const s = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}
const now = () => new Date().toISOString();
const whole = (value: number, label: string) => { if (!Number.isSafeInteger(value)) throw new Error(`${label} no es válido.`) };
const positive = (value: number, label: string) => { whole(value, label); if (value <= 0) throw new Error(`${label} debe ser mayor que cero.`) };
function audit(data: AppData, actorId: string, action: string, entityId: string, detail = '') {
  data.audit.push({ id: id(), at: now(), actorId, action, entityId, detail });
}
export function emptyData(storeName: string, owner: User): AppData {
  if (!storeName.trim()) throw new Error('Ingresá el nombre del comercio.');
  const data: AppData = { schemaVersion: 1, revision: 0, storeName: storeName.trim(), users: [owner], products: [], customers: [], sales: [], shifts: [], stockMoves: [], cashMoves: [], debtMoves: [], audit: [] };
  audit(data, owner.id, 'store.created', owner.id);
  return data;
}
export function stockOf(data: AppData, productId: string): number { return data.stockMoves.filter(m => m.productId === productId).reduce((n, m) => n + m.deltaMilli, 0) }
export function debtOf(data: AppData, customerId: string): number { return data.debtMoves.filter(m => m.customerId === customerId).reduce((n, m) => n + m.amountMinor, 0) }
export function cashOf(data: AppData, shiftId: string): number { const shift = data.shifts.find(s => s.id === shiftId); return (shift?.openingMinor ?? 0) + data.cashMoves.filter(m => m.shiftId === shiftId).reduce((n, m) => n + m.amountMinor, 0) }
export function activeShift(data: AppData, userId: string): Shift | undefined { return data.shifts.find(s => s.userId === userId && !s.closedAt) }
export function money(minor: number): string { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(minor / 100) }
export function parseMoney(input: string): number {
  const raw = input.trim();
  const value = /^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(raw) ? raw.replaceAll('.', '').replace(',', '.') : raw.replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error('Ingresá un importe válido, con hasta dos decimales.');
  const [units, cents = ''] = value.split('.');
  const minor = Number(units) * 100 + Number(cents.padEnd(2, '0'));
  whole(minor, 'El importe');
  return minor;
}
export function parseQty(input: string): number {
  const value = input.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,3})?$/.test(value)) throw new Error('Ingresá una cantidad válida, con hasta tres decimales.');
  const [units, fraction = ''] = value.split('.');
  const milli = Number(units) * 1000 + Number(fraction.padEnd(3, '0'));
  positive(milli, 'La cantidad');
  return milli;
}
export function formatQty(milli: number): string { return (milli / 1000).toLocaleString('es-AR', { maximumFractionDigits: 3 }) }

export function addProduct(data: AppData, actorId: string, input: { code: string; name: string; category: string; priceMinor: number; openingQtyMilli?: number; minQtyMilli?: number }): Product {
  requirePermission(data, actorId, 'catalog');
  const code = input.code.trim(); const name = input.name.trim();
  if (!code || !name) throw new Error('Código y nombre son obligatorios.');
  if (data.products.some(p => p.active && p.code.toLowerCase() === code.toLowerCase())) throw new Error('Ese código ya está en uso.');
  whole(input.priceMinor, 'El precio'); if (input.priceMinor < 0) throw new Error('El precio no puede ser negativo.');
  const openingQtyMilli = input.openingQtyMilli ?? 0; const minQtyMilli = input.minQtyMilli ?? 0;
  whole(openingQtyMilli, 'El stock inicial'); whole(minQtyMilli, 'El mínimo');
  if (openingQtyMilli < 0 || minQtyMilli < 0) throw new Error('Las cantidades no pueden ser negativas.');
  const product: Product = { id: id(), code, name, category: input.category.trim(), priceMinor: input.priceMinor, minQtyMilli, active: true, createdAt: now() };
  data.products.push(product);
  if (openingQtyMilli) data.stockMoves.push({ id: id(), at: now(), productId: product.id, deltaMilli: openingQtyMilli, reason: 'opening', actorId });
  audit(data, actorId, 'product.created', product.id, code);
  return product;
}
export function setPrice(data: AppData, actorId: string, productId: string, priceMinor: number) {
  requirePermission(data, actorId, 'catalog'); whole(priceMinor, 'El precio'); if (priceMinor < 0) throw new Error('El precio no puede ser negativo.');
  const product = data.products.find(p => p.id === productId && p.active); if (!product) throw new Error('Producto no encontrado.');
  const previous = product.priceMinor; product.priceMinor = priceMinor;
  audit(data, actorId, 'product.price.changed', productId, `${previous} → ${priceMinor}`);
}
export function moveStock(data: AppData, actorId: string, productId: string, deltaMilli: number, reason: 'purchase' | 'adjustment') {
  requirePermission(data, actorId, 'stock'); whole(deltaMilli, 'La cantidad'); if (!deltaMilli) throw new Error('La cantidad debe ser distinta de cero.');
  if (!data.products.some(p => p.id === productId && p.active)) throw new Error('Producto no encontrado.');
  if (stockOf(data, productId) + deltaMilli < 0) throw new Error('El ajuste dejaría stock negativo.');
  data.stockMoves.push({ id: id(), at: now(), productId, deltaMilli, reason, actorId });
  audit(data, actorId, `stock.${reason}`, productId, String(deltaMilli));
}
export function addCustomer(data: AppData, actorId: string, name: string, note = ''): Customer {
  requirePermission(data, actorId, 'customers');
  if (!name.trim()) throw new Error('Ingresá el nombre del cliente.');
  const customer: Customer = { id: id(), name: name.trim(), note: note.trim(), active: true, createdAt: now() };
  data.customers.push(customer); audit(data, actorId, 'customer.created', customer.id); return customer;
}
export function payDebt(data: AppData, actorId: string, customerId: string, amountMinor: number, method: 'cash' | 'transfer' | 'qr') {
  requirePermission(data, actorId, 'customers'); positive(amountMinor, 'El pago');
  if (!data.customers.some(c => c.id === customerId && c.active)) throw new Error('Cliente no encontrado.');
  if (amountMinor > debtOf(data, customerId)) throw new Error('El pago supera la deuda.');
  const shift = method === 'cash' ? activeShift(data, actorId) : undefined;
  if (method === 'cash' && !shift) throw new Error('Abrí tu turno antes de recibir efectivo.');
  const debtMove: DebtMove = { id: id(), at: now(), customerId, amountMinor: -amountMinor, reason: 'payment', actorId };
  data.debtMoves.push(debtMove);
  if (shift) data.cashMoves.push({ id: id(), at: now(), shiftId: shift.id, amountMinor, reason: 'debt-payment', refId: debtMove.id, actorId });
  audit(data, actorId, 'customer.debt.paid', customerId, `${amountMinor};${method}`);
}
export function openShift(data: AppData, actorId: string, openingMinor: number): Shift {
  requirePermission(data, actorId, 'shift'); whole(openingMinor, 'El fondo inicial'); if (openingMinor < 0) throw new Error('El fondo no puede ser negativo.');
  if (activeShift(data, actorId)) throw new Error('Ya tenés un turno abierto.');
  const shift: Shift = { id: id(), userId: actorId, openedAt: now(), openingMinor };
  data.shifts.push(shift); audit(data, actorId, 'shift.opened', shift.id, String(openingMinor)); return shift;
}
export function closeShift(data: AppData, actorId: string, countedMinor: number): Shift {
  requirePermission(data, actorId, 'shift'); whole(countedMinor, 'El efectivo contado'); if (countedMinor < 0) throw new Error('El contado no puede ser negativo.');
  const shift = activeShift(data, actorId); if (!shift) throw new Error('No tenés un turno abierto.');
  shift.expectedMinor = cashOf(data, shift.id); shift.countedMinor = countedMinor; shift.closedAt = now();
  audit(data, actorId, 'shift.closed', shift.id, `esperado=${shift.expectedMinor};contado=${countedMinor}`); return shift;
}
export function setUserActive(data: AppData, actorId: string, targetId: string, active: boolean) {
  requirePermission(data, actorId, 'users');
  const target = data.users.find(u => u.id === targetId); if (!target) throw new Error('Usuario no encontrado.');
  if (!active && target.id === actorId) throw new Error('No podés desactivar tu propia cuenta.');
  if (!active && target.role === 'owner' && data.users.filter(u => u.active && u.role === 'owner').length <= 1) throw new Error('Debe quedar al menos un dueño activo.');
  if (!active && activeShift(data, target.id)) throw new Error('Cerrá el turno de este usuario antes de desactivarlo.');
  target.active = active;
  audit(data, actorId, active ? 'user.activated' : 'user.deactivated', target.id);
}
export interface CartInput { productId: string; qtyMilli: number }
export function completeSale(data: AppData, actorId: string, input: { idempotencyKey: string; lines: CartInput[]; payments: Payment[]; customerId?: string; discountMinor?: number }): Sale {
  requirePermission(data, actorId, 'sell');
  const fingerprint = JSON.stringify([actorId, input.lines, input.payments, input.customerId ?? null, input.discountMinor ?? 0]);
  const existing = data.sales.find(s => s.idempotencyKey === input.idempotencyKey);
  if (existing) {
    if (existing.requestFingerprint && existing.requestFingerprint !== fingerprint) throw new Error('Esta operación ya fue usada con otros datos. Iniciá una venta nueva.');
    return existing;
  }
  const shift = activeShift(data, actorId); if (!shift) throw new Error('Abrí tu turno antes de vender.');
  if (!input.lines.length) throw new Error('Agregá al menos un producto.');
  if (!input.idempotencyKey) throw new Error('No se pudo identificar la operación.');
  const lines: SaleLine[] = input.lines.map(line => {
    positive(line.qtyMilli, 'La cantidad');
    const product = data.products.find(p => p.id === line.productId && p.active); if (!product) throw new Error('Producto no disponible.');
    const totalMinor = Math.round(product.priceMinor * line.qtyMilli / 1000); whole(totalMinor, 'El total de línea');
    return { productId: product.id, name: product.name, qtyMilli: line.qtyMilli, priceMinor: product.priceMinor, totalMinor };
  });
  const subtotalMinor = lines.reduce((n, line) => n + line.totalMinor, 0);
  const discountMinor = input.discountMinor ?? 0; whole(discountMinor, 'El descuento');
  if (discountMinor < 0 || discountMinor >= subtotalMinor) throw new Error('El descuento debe ser menor que el subtotal.');
  if (discountMinor) requirePermission(data, actorId, 'discount');
  const totalMinor = subtotalMinor - discountMinor; positive(totalMinor, 'El total');
  if (!input.payments.length) throw new Error('Elegí al menos un medio de pago.');
  for (const payment of input.payments) { positive(payment.amountMinor, 'El pago'); if (payment.receivedMinor !== undefined && payment.receivedMinor < payment.amountMinor) throw new Error('El efectivo recibido es insuficiente.'); }
  if (input.payments.reduce((n, p) => n + p.amountMinor, 0) !== totalMinor) throw new Error('Los pagos deben sumar exactamente el total.');
  const credit = input.payments.filter(p => p.method === 'credit').reduce((n, p) => n + p.amountMinor, 0);
  if (credit && !data.customers.some(c => c.id === input.customerId && c.active)) throw new Error('Elegí un cliente para el fiado.');
  const sale: Sale = { id: id(), idempotencyKey: input.idempotencyKey, requestFingerprint: fingerprint, at: now(), userId: actorId, shiftId: shift.id, customerId: input.customerId, lines, payments: input.payments, discountMinor, totalMinor };
  data.sales.push(sale);
  for (const line of lines) {
    const shortage = Math.max(0, line.qtyMilli - stockOf(data, line.productId));
    if (shortage) data.stockMoves.push({ id: id(), at: now(), productId: line.productId, deltaMilli: shortage, reason: 'compensation', refId: sale.id, actorId });
    data.stockMoves.push({ id: id(), at: now(), productId: line.productId, deltaMilli: -line.qtyMilli, reason: 'sale', refId: sale.id, actorId });
  }
  const cash = input.payments.filter(p => p.method === 'cash').reduce((n, p) => n + p.amountMinor, 0);
  if (cash) data.cashMoves.push({ id: id(), at: now(), shiftId: shift.id, amountMinor: cash, reason: 'sale', refId: sale.id, actorId });
  if (credit) data.debtMoves.push({ id: id(), at: now(), customerId: input.customerId!, amountMinor: credit, reason: 'sale', refId: sale.id, actorId });
  audit(data, actorId, 'sale.completed', sale.id, String(totalMinor));
  if (discountMinor) audit(data, actorId, 'sale.discount.applied', sale.id, String(discountMinor));
  return sale;
}
export function voidSale(data: AppData, actorId: string, saleId: string): Sale {
  requirePermission(data, actorId, 'void');
  const sale = data.sales.find(s => s.id === saleId); if (!sale) throw new Error('Venta no encontrada.');
  if (sale.voidedAt) throw new Error('La venta ya está anulada.');
  const cash = sale.payments.filter(p => p.method === 'cash').reduce((n, p) => n + p.amountMinor, 0);
  const refundShift = cash ? activeShift(data, actorId) : undefined;
  if (cash && !refundShift) throw new Error('Abrí tu turno antes de devolver efectivo.');
  sale.voidedAt = now(); sale.voidedBy = actorId;
  for (const line of sale.lines) data.stockMoves.push({ id: id(), at: now(), productId: line.productId, deltaMilli: line.qtyMilli, reason: 'void', refId: sale.id, actorId });
  for (const compensation of data.stockMoves.filter(m => m.refId === sale.id && m.reason === 'compensation')) {
    data.stockMoves.push({ id: id(), at: now(), productId: compensation.productId, deltaMilli: -compensation.deltaMilli, reason: 'void', refId: sale.id, actorId });
  }
  if (cash) data.cashMoves.push({ id: id(), at: now(), shiftId: refundShift!.id, amountMinor: -cash, reason: 'void', refId: sale.id, actorId });
  const credit = sale.payments.filter(p => p.method === 'credit').reduce((n, p) => n + p.amountMinor, 0);
  if (credit && sale.customerId) data.debtMoves.push({ id: id(), at: now(), customerId: sale.customerId, amountMinor: -credit, reason: 'void', refId: sale.id, actorId });
  audit(data, actorId, 'sale.voided', sale.id); return sale;
}
export function validateImport(value: unknown): AppData {
  if (!value || typeof value !== 'object') throw new Error('El archivo no contiene una copia válida.');
  const data = value as Partial<AppData>;
  if (data.schemaVersion !== 1 || typeof data.storeName !== 'string' || !Array.isArray(data.users) || !Array.isArray(data.products) || !Array.isArray(data.sales) || !Array.isArray(data.shifts) || !Array.isArray(data.stockMoves) || !Array.isArray(data.cashMoves) || !Array.isArray(data.debtMoves) || !Array.isArray(data.audit) || !Array.isArray(data.customers)) throw new Error('La copia tiene un formato desconocido o incompleto.');
  if (!data.storeName.trim() || !Number.isSafeInteger(data.revision) || data.revision! < 0) throw new Error('La copia tiene datos generales inválidos.');
  const records = [data.users, data.products, data.customers, data.sales, data.shifts, data.stockMoves, data.cashMoves, data.debtMoves, data.audit];
  for (const items of records) {
    const ids = new Set<string>();
    for (const item of items) {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id || ids.has(item.id)) throw new Error('La copia tiene identificadores inválidos o repetidos.');
      ids.add(item.id);
    }
  }
  if (!data.users.some(user => user.active && user.role === 'owner')) throw new Error('La copia no tiene un dueño activo.');
  if (data.products.some(product => typeof product.code !== 'string' || typeof product.name !== 'string' || !Number.isSafeInteger(product.priceMinor) || product.priceMinor < 0 || !Number.isSafeInteger(product.minQtyMilli) || product.minQtyMilli < 0)) throw new Error('La copia tiene productos inválidos.');
  if (data.sales.some(sale => !Array.isArray(sale.lines) || !Array.isArray(sale.payments) || !Number.isSafeInteger(sale.totalMinor) || sale.totalMinor < 0 || sale.lines.some(line => !Number.isSafeInteger(line.qtyMilli) || line.qtyMilli <= 0 || !Number.isSafeInteger(line.totalMinor)) || sale.payments.some(payment => !Number.isSafeInteger(payment.amountMinor) || payment.amountMinor <= 0))) throw new Error('La copia tiene ventas inválidas.');
  if (data.stockMoves.some(move => !Number.isSafeInteger(move.deltaMilli)) || data.cashMoves.some(move => !Number.isSafeInteger(move.amountMinor)) || data.debtMoves.some(move => !Number.isSafeInteger(move.amountMinor))) throw new Error('La copia tiene movimientos inválidos.');
  const userIds = new Set(data.users.map(user => user.id)); const productIds = new Set(data.products.map(product => product.id)); const customerIds = new Set(data.customers.map(customer => customer.id)); const shiftIds = new Set(data.shifts.map(shift => shift.id));
  if (data.shifts.some(shift => !userIds.has(shift.userId) || !Number.isSafeInteger(shift.openingMinor))) throw new Error('La copia tiene turnos inválidos.');
  if (data.sales.some(sale => !userIds.has(sale.userId) || !shiftIds.has(sale.shiftId) || (sale.customerId && !customerIds.has(sale.customerId)) || sale.lines.some(line => !productIds.has(line.productId)) || !Number.isSafeInteger(sale.discountMinor ?? 0) || (sale.discountMinor ?? 0) < 0 || sale.lines.reduce((n, line) => n + line.totalMinor, 0) - (sale.discountMinor ?? 0) !== sale.totalMinor || sale.payments.reduce((n, payment) => n + payment.amountMinor, 0) !== sale.totalMinor)) throw new Error('La copia tiene referencias de venta inválidas.');
  if (data.stockMoves.some(move => !productIds.has(move.productId)) || data.cashMoves.some(move => !shiftIds.has(move.shiftId)) || data.debtMoves.some(move => !customerIds.has(move.customerId))) throw new Error('La copia tiene referencias de movimiento inválidas.');
  return data as AppData;
}
