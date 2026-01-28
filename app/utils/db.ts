const DB_NAME = 'PackTesterDB';
const DB_VERSION = 1;
const STORE_NAME = 'appState';

interface DBItem {
  key: string;
  value: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;
let memoryStore: Map<string, string> = new Map();

// Check if we're in a Cloudflare Worker environment
const isCloudflareWorker = typeof globalThis !== 'undefined' && !globalThis.indexedDB;

function openDB(): Promise<IDBDatabase> {
  if (isCloudflareWorker) {
    // In Cloudflare Worker, return a resolved promise that won't be used
    return Promise.resolve({} as IDBDatabase);
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
    });
  }
  return dbPromise;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (isCloudflareWorker) {
    // Use in-memory store for Cloudflare Workers
    memoryStore.set(key, value);
    return Promise.resolve();
  }

  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const item: DBItem = { key, value };
  store.put(item);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getItem(key: string): Promise<string | null> {
  if (isCloudflareWorker) {
    // Use in-memory store for Cloudflare Workers
    return Promise.resolve(memoryStore.get(key) || null);
  }

  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.value : null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function removeItem(key: string): Promise<void> {
  if (isCloudflareWorker) {
    // Use in-memory store for Cloudflare Workers
    memoryStore.delete(key);
    return Promise.resolve();
  }

  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.delete(key);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}