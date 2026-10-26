import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Category, Material, MaterialStockBalance, StockMovement } from '../types';
import { computeMaterialStockBalance } from '../utils/calculations';

export interface RecordReceivedInput {
  studioId: string;
  projectId: string;
  materialId: string;
  quantity: number;
  billId?: string;
  workerName?: string;
  note?: string;
}

export interface RecordUsedInput {
  studioId: string;
  projectId: string;
  materialId: string;
  quantity: number;
  workerId: string;
  workerName: string;
  roomId?: string;
  roomName?: string;
  note?: string;
}

export interface RecordAdjustmentInput {
  studioId: string;
  projectId: string;
  materialId: string;
  quantity: number; // positive or negative discrepancy
  workerName: string;
  reason: string;
  note?: string;
}

export const stockService = {
  async listMaterials(): Promise<Material[]> {
    return getItem<Material[]>(STORAGE_KEYS.MATERIALS, []);
  },

  async listCategories(): Promise<Category[]> {
    return getItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  },

  async getMovements(projectId?: string): Promise<StockMovement[]> {
    const movements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    if (!projectId || projectId === 'all') return movements;
    return movements.filter(m => m.projectId === projectId);
  },

  async getStockBalances(projectId?: string): Promise<MaterialStockBalance[]> {
    const materials = await this.listMaterials();
    const categories = await this.listCategories();
    const movements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);

    const categoryMap = new Map<string, string>();
    categories.forEach(c => categoryMap.set(c.id, c.name));

    return materials.map(mat => {
      const balance = computeMaterialStockBalance(mat, movements, projectId);
      balance.categoryName = categoryMap.get(mat.categoryId) || 'General';
      return balance;
    });
  },

  async recordReceived(input: RecordReceivedInput): Promise<StockMovement> {
    const movements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    const newMovement: StockMovement = {
      id: `mov-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      studioId: input.studioId,
      projectId: input.projectId,
      materialId: input.materialId,
      type: 'received',
      quantity: input.quantity,
      billId: input.billId,
      workerName: input.workerName || 'Supervisor',
      date: new Date().toISOString(),
      note: input.note,
    };

    movements.unshift(newMovement);
    setItem(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
    return newMovement;
  },

  async recordUsed(input: RecordUsedInput): Promise<StockMovement> {
    const movements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    const newMovement: StockMovement = {
      id: `mov-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      studioId: input.studioId,
      projectId: input.projectId,
      materialId: input.materialId,
      type: 'used',
      quantity: input.quantity,
      workerId: input.workerId,
      workerName: input.workerName,
      roomId: input.roomId,
      roomName: input.roomName,
      date: new Date().toISOString(),
      note: input.note,
    };

    movements.unshift(newMovement);
    setItem(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
    return newMovement;
  },

  async recordAdjustment(input: RecordAdjustmentInput): Promise<StockMovement> {
    const movements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    const newMovement: StockMovement = {
      id: `mov-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      studioId: input.studioId,
      projectId: input.projectId,
      materialId: input.materialId,
      type: 'adjustment',
      quantity: input.quantity,
      workerName: input.workerName,
      reason: input.reason,
      date: new Date().toISOString(),
      note: input.note,
    };

    movements.unshift(newMovement);
    setItem(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
    return newMovement;
  },
};
