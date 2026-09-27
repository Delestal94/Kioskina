import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { addProduct, emptyData, stockOf, type User } from './domain';
import { changeData, loadData, restoreData } from './storage';

const owner: User = { id: 'owner-storage-test', name: 'Dueño ficticio', role: 'owner', salt: '00', passwordHash: '00', active: true };

describe('persistencia local', () => {
  it('guarda cambios completos, aborta errores y restaura una copia validada', async () => {
    expect(await loadData()).toBeNull();
    const initial = emptyData('Comercio ficticio', owner);
    await changeData(() => undefined, initial);
    const created = await changeData(data => addProduct(data!, owner.id, { code: 'A1', name: 'Agua', category: '', priceMinor: 12000, openingQtyMilli: 3000 }));
    expect(stockOf(created.data, created.result.id)).toBe(3000);
    const before = await loadData();
    await expect(changeData(data => { addProduct(data!, owner.id, { code: 'A2', name: 'Gaseosa', category: '', priceMinor: 15000 }); throw new Error('Fallo simulado') })).rejects.toThrow('Fallo simulado');
    expect((await loadData())?.products).toHaveLength(1);
    await expect(restoreData({ schemaVersion: 1, storeName: 'Copia inválida' })).rejects.toThrow('formato');
    expect((await loadData())?.products).toHaveLength(1);
    await changeData(data => addProduct(data!, owner.id, { code: 'A3', name: 'Caramelo', category: '', priceMinor: 100 }));
    await restoreData(before);
    expect((await loadData())?.products.map(product => product.code)).toEqual(['A1']);
  });
});
