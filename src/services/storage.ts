import {
  INITIAL_BILLS,
  INITIAL_CATEGORIES,
  INITIAL_ISSUES,
  INITIAL_MATERIALS,
  INITIAL_PROGRESS_UPDATES,
  INITIAL_PROJECTS,
  INITIAL_SCOPE_CELLS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_STUDIO,
  INITIAL_USERS,
  INITIAL_VENDORS,
} from '../data/initialData';
import {
  Bill,
  Category,
  Issue,
  Material,
  ProgressUpdate,
  Project,
  ScopeGridCell,
  StockMovement,
  Studio,
  User,
  Vendor,
} from '../types';

export const STORAGE_KEYS = {
  VERSION: 'studioos_version',
  STUDIO: 'studioos_studio',
  USERS: 'studioos_users',
  PROJECTS: 'studioos_projects',
  SCOPE_CELLS: 'studioos_scope_cells',
  CATEGORIES: 'studioos_categories',
  MATERIALS: 'studioos_materials',
  VENDORS: 'studioos_vendors',
  STOCK_MOVEMENTS: 'studioos_stock_movements',
  BILLS: 'studioos_bills',
  PROGRESS_UPDATES: 'studioos_progress_updates',
  ISSUES: 'studioos_issues',
  CURRENT_USER_ID: 'studioos_current_user_id',
} as const;

const CURRENT_DATA_VERSION = 'v1.2_uuids_bestinterio';

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch a storage event so reactive hooks in current tab also trigger
    window.dispatchEvent(new CustomEvent('studioos_storage_change', { detail: { key, value } }));
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
  }
}

/**
 * Initializes localStorage with baseline mock data if not already initialized
 */
export function initializeStorage(forceReset = false): void {
  const version = localStorage.getItem(STORAGE_KEYS.VERSION);
  const isInitialized = localStorage.getItem(STORAGE_KEYS.STUDIO);
  if (!isInitialized || version !== CURRENT_DATA_VERSION || forceReset) {
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_DATA_VERSION);
    localStorage.setItem(STORAGE_KEYS.STUDIO, JSON.stringify(INITIAL_STUDIO));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.SCOPE_CELLS, JSON.stringify(INITIAL_SCOPE_CELLS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(INITIAL_VENDORS));
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(INITIAL_STOCK_MOVEMENTS));
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
    localStorage.setItem(STORAGE_KEYS.PROGRESS_UPDATES, JSON.stringify(INITIAL_PROGRESS_UPDATES));
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'b1eebc99-9c0b-4ef8-bb6d-000000000001');

    window.dispatchEvent(new CustomEvent('studioos_storage_reset'));
  }
}

/**
 * Reset demo data back to clean factory state
 */
export function resetDemoData(): void {
  initializeStorage(true);
}
