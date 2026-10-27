import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Bill, Category, Material, MaterialStockBalance, StockMovement, TradeType } from '../types';
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
  async listMaterials(includeArchived = false): Promise<Material[]> {
    const materials = getItem<Material[]>(STORAGE_KEYS.MATERIALS, []);
    if (includeArchived) return materials;
    return materials.filter(m => !m.isArchived);
  },

  async listCategories(): Promise<Category[]> {
    const categories = getItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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

  // --- Category Management ---
  async createCategory(input: {
    studioId: string;
    name: string;
    trade?: TradeType;
  }): Promise<Category> {
    const categories = getItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order || 0), 0);
    const newCategory: Category = {
      id: crypto.randomUUID(),
      studioId: input.studioId,
      name: input.name.trim(),
      order: maxOrder + 1,
      trade: input.trade,
    };
    categories.push(newCategory);
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const categories = getItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');

    const updated = { ...categories[index], ...updates };
    categories[index] = updated;
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return updated;
  },

  async reorderCategories(reorderedCategories: Category[]): Promise<Category[]> {
    const updated = reorderedCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1,
    }));
    setItem(STORAGE_KEYS.CATEGORIES, updated);
    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = getItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const materials = getItem<Material[]>(STORAGE_KEYS.MATERIALS, []);
    
    // Check if category has materials
    const hasMaterials = materials.some(m => m.categoryId === id);
    if (hasMaterials) {
      throw new Error('Cannot delete category with associated materials. Reassign or delete materials first.');
    }

    const filtered = categories.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },

  // --- Material Management ---
  async createMaterial(input: {
    studioId: string;
    categoryId: string;
    name: string;
    unit: string;
    shadeCode?: string;
    lowStockThreshold: number;
    rate?: number;
  }): Promise<Material> {
    const materials = getItem<Material[]>(STORAGE_KEYS.MATERIALS, []);
    const newMaterial: Material = {
      id: crypto.randomUUID(),
      studioId: input.studioId,
      categoryId: input.categoryId,
      name: input.name.trim(),
      unit: input.unit.trim().toLowerCase(),
      shadeCode: input.shadeCode?.trim() || undefined,
      lowStockThreshold: Number(input.lowStockThreshold) || 5,
      rate: input.rate ? Number(input.rate) : undefined,
    };
    materials.push(newMaterial);
    setItem(STORAGE_KEYS.MATERIALS, materials);
    return newMaterial;
  },

  async updateMaterial(id: string, updates: Partial<Material>): Promise<Material> {
    const materials = getItem<Material[]>(STORAGE_KEYS.MATERIALS, []);
    const index = materials.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Material not found');

    const updated: Material = { 
      ...materials[index], 
      ...updates,
      name: updates.name ? updates.name.trim() : materials[index].name,
      unit: updates.unit ? updates.unit.trim().toLowerCase() : materials[index].unit,
      shadeCode: updates.shadeCode !== undefined ? (updates.shadeCode?.trim() || undefined) : materials[index].shadeCode,
      lowStockThreshold: updates.lowStockThreshold !== undefined ? Number(updates.lowStockThreshold) : materials[index].lowStockThreshold,
      rate: updates.rate !== undefined ? (updates.rate ? Number(updates.rate) : undefined) : materials[index].rate,
    };
    materials[index] = updated;
    setItem(STORAGE_KEYS.MATERIALS, materials);
    return updated;
  },

  async archiveMaterial(id: string): Promise<Material> {
    return this.updateMaterial(id, { isArchived: true });
  },

  async unarchiveMaterial(id: string): Promise<Material> {
    return this.updateMaterial(id, { isArchived: false });
  },

  async deleteMaterial(id: string): Promise<boolean> {
    const movements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    const hasMovements = movements.some(m => m.materialId === id);
    if (hasMovements) {
      throw new Error('Cannot delete a material that has stock movements. Please archive it instead.');
    }

    const materials = getItem<Material[]>(STORAGE_KEYS.MATERIALS, []);
    const filtered = materials.filter(m => m.id !== id);
    setItem(STORAGE_KEYS.MATERIALS, filtered);
    return true;
  },

  async getMaterialRatesMap(): Promise<Record<string, number>> {
    const bills = getItem<Bill[]>(STORAGE_KEYS.BILLS, []);
    const materials = getItem<Material[]>(STORAGE_KEYS.MATERIALS, []);
    const rateMap: Record<string, number> = {};

    // 1. Default rates from materials
    materials.forEach(m => {
      if (m.rate && m.rate > 0) {
        rateMap[m.id] = m.rate;
      }
    });

    // 2. Override/enrich with latest rates from bills
    const sortedBills = [...bills].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    sortedBills.forEach(b => {
      b.items.forEach(item => {
        if (item.materialId && item.rate && !rateMap[item.materialId]) {
          rateMap[item.materialId] = item.rate;
        }
      });
    });

    return rateMap;
  },
};
