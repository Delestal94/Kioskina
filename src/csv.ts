import { parseMoney, parseQty } from './domain';

export interface ProductRow { code: string; name: string; category: string; priceMinor: number; openingQtyMilli: number; minQtyMilli: number }
function parseRows(text: string, delimiter: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++ } else quoted = !quoted }
    else if (char === delimiter && !quoted) { row.push(cell.trim()); cell = '' }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && text[i + 1] === '\n') i++; row.push(cell.trim()); if (row.some(value => value)) rows.push(row); row = []; cell = '' }
    else cell += char;
  }
  if (quoted) throw new Error('El CSV tiene una comilla sin cerrar.');
  row.push(cell.trim()); if (row.some(value => value)) rows.push(row);
  return rows;
}
export function parseProductCsv(text: string): ProductRow[] {
  const clean = text.replace(/^\uFEFF/, '');
  const first = clean.split(/\r?\n/, 1)[0];
  const delimiter = first.includes(';') ? ';' : ',';
  const rows = parseRows(clean, delimiter);
  if (rows.length < 2) throw new Error('El CSV debe tener encabezado y al menos un producto.');
  const header = rows.shift()!.map(value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  const index = (name: string) => header.indexOf(name);
  if (['codigo', 'nombre', 'precio'].some(name => index(name) < 0)) throw new Error('El encabezado debe incluir codigo, nombre y precio.');
  return rows.map((row, n) => {
    try {
      const value = (name: string) => index(name) < 0 ? '' : (row[index(name)] ?? '');
      const code = value('codigo'); const name = value('nombre');
      if (!code || !name) throw new Error('Código y nombre son obligatorios.');
      const nonnegativeQty = (text: string) => !text || /^0(?:[.,]0{1,3})?$/.test(text) ? 0 : parseQty(text);
      return { code, name, category: value('categoria'), priceMinor: parseMoney(value('precio')), openingQtyMilli: nonnegativeQty(value('stock')), minQtyMilli: nonnegativeQty(value('minimo')) };
    } catch (error) { throw new Error(`Fila ${n + 2}: ${error instanceof Error ? error.message : 'datos inválidos'}`) }
  });
}
export function downloadProductsCsv(rows: { code: string; name: string; category: string; priceMinor: number; stockMilli: number; minQtyMilli: number }[]) {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const lines = ['codigo;nombre;categoria;precio;stock;minimo', ...rows.map(row => [row.code, row.name, row.category, (row.priceMinor / 100).toFixed(2), (row.stockMilli / 1000).toFixed(3), (row.minQtyMilli / 1000).toFixed(3)].map(escape).join(';'))];
  const blob = new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'kioskina-productos.csv'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
