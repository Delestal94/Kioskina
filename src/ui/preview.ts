import { addCustomer, addProduct, completeSale, emptyData, openShift, type AppData, type User } from '../domain';

export function previewData(): AppData {
  const owner: User = { id: 'preview-owner', name: 'Alex', role: 'owner', salt: '', passwordHash: '', active: true };
  const data = emptyData('Drugstore de prueba', owner);
  const names = [
    ['779000000001', 'Agua mineral 500 ml', 'Bebidas', 1500, 24],
    ['779000000002', 'Gaseosa cola 1,5 l', 'Bebidas', 2800, 12],
    ['779000000003', 'Alfajor de chocolate', 'Golosinas', 1250, 4],
    ['779000000004', 'Papas fritas', 'Snacks', 2100, 10],
    ['779000000005', 'Café instantáneo', 'Almacén', 4900, 8],
    ['779000000006', 'Caramelos surtidos', 'Golosinas', 300, 40],
    ['779000000007', 'Jugo de naranja', 'Bebidas', 1900, 15],
    ['779000000008', 'Galletitas dulces', 'Almacén', 1750, 12]
  ] as const;
  const products = names.map(([code, name, category, price, stock]) => addProduct(data, owner.id, { code, name, category, priceMinor: price * 100, openingQtyMilli: stock * 1000, minQtyMilli: 5000 }));
  addCustomer(data, owner.id, 'Cliente ficticio');
  openShift(data, owner.id, 10000);
  completeSale(data, owner.id, { idempotencyKey: 'preview-sale-1', lines: [{ productId: products[0].id, qtyMilli: 1000 }, { productId: products[2].id, qtyMilli: 2000 }], payments: [{ method: 'cash', amountMinor: 400000 }] });
  return data;
}
