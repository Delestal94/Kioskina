import { describe, expect, it } from 'vitest';
import { parseProductCsv } from './csv';

describe('importación de catálogo', () => {
  it('acepta CSV de Excel con separador punto y coma, texto entrecomillado y stock cero', () => {
    const rows = parseProductCsv('codigo;nombre;categoria;precio;stock;minimo\r\nA1;"Agua; mineral";Bebidas;1200,50;0.000;0.000\r\n');
    expect(rows).toEqual([{ code: 'A1', name: 'Agua; mineral', category: 'Bebidas', priceMinor: 120050, openingQtyMilli: 0, minQtyMilli: 0 }]);
  });
  it('rechaza una fila inválida antes de importar el lote', () => {
    expect(() => parseProductCsv('codigo;nombre;precio\nA1;Agua;100\nA2;Gaseosa;no es precio')).toThrow('Fila 3');
  });
});
