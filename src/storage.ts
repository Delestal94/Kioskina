import { type AppData, validateImport } from './domain';

const NAME = 'kioskina-internal-v1';
const STORE = 'app';
let dbPromise: Promise<IDBDatabase> | undefined;
const channel = typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(NAME) : null;
export function onDataChanged(listener: () => void): () => void {
  if (!channel) return () => undefined;
  channel.addEventListener('message', listener);
  return () => channel.removeEventListener('message', listener);
}

function db(): Promise<IDBDatabase> {
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onerror = () => reject(request.error ?? new Error('No se pudo abrir el almacenamiento.'));
    request.onsuccess = () => resolve(request.result);
  });
  return dbPromise;
}

export async function loadData(): Promise<AppData | null> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get('state');
    request.onsuccess = () => { try { resolve(request.result ? validateImport(request.result) : null) } catch (error) { reject(error) } };
    request.onerror = () => reject(request.error ?? new Error('No se pudo leer la información.'));
  });
}

export async function changeData<T>(change: (draft: AppData | null) => T, initial?: AppData): Promise<{ data: AppData; result: T }> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    let next: AppData; let result: T;
    const request = store.get('state');
    request.onsuccess = () => {
      try {
        const current: AppData | null = request.result ? validateImport(request.result) : null;
        if (!current && !initial) throw new Error('Configurá el comercio primero.');
        if (current && initial) throw new Error('El comercio ya fue configurado.');
        next = structuredClone(current ?? initial!);
        result = change(next);
        next.revision += 1;
        store.put(next, 'state');
      } catch (error) { tx.abort(); reject(error) }
    };
    request.onerror = () => reject(request.error ?? new Error('No se pudo leer la información.'));
    tx.oncomplete = () => { channel?.postMessage('changed'); resolve({ data: next!, result: result! }) };
    tx.onabort = () => reject(tx.error ?? new Error('No se pudo guardar. No se aplicaron cambios.'));
    tx.onerror = () => reject(tx.error ?? new Error('No se pudo guardar.'));
  });
}

export async function restoreData(value: unknown): Promise<AppData> {
  const imported = validateImport(value);
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(imported, 'state');
    tx.oncomplete = () => { channel?.postMessage('changed'); resolve(imported) };
    tx.onabort = () => reject(tx.error ?? new Error('No se pudo restaurar la copia.'));
    tx.onerror = () => reject(tx.error ?? new Error('No se pudo restaurar la copia.'));
  });
}

export function downloadBackup(data: AppData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `kioskina-copia-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
