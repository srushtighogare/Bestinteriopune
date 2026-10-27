import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Bill, BillItem, StockMovement, Vendor } from '../types';
import { stockService } from './stockService';

export interface CreateBillInput {
  studioId: string;
  projectId: string;
  vendorId: string;
  vendorName: string;
  billNumber?: string;
  date: string;
  photoUrl: string;
  uploadedBy: string;
  uploadedById: string;
  items: Omit<BillItem, 'id' | 'billId'>[];
  needsTradeLeadCheck?: boolean;
}

export const billsService = {
  async list(projectId?: string, status?: 'to_review' | 'reviewed'): Promise<Bill[]> {
    const bills = getItem<Bill[]>(STORAGE_KEYS.BILLS, []);
    return bills.filter(b => {
      const matchProject = !projectId || projectId === 'all' || b.projectId === projectId;
      const matchStatus = !status || b.status === status;
      return matchProject && matchStatus;
    });
  },

  async get(id: string): Promise<Bill | null> {
    const bills = await this.list();
    return bills.find(b => b.id === id) || null;
  },

  async upload(input: CreateBillInput): Promise<Bill> {
    const bills = getItem<Bill[]>(STORAGE_KEYS.BILLS, []);
    const billId = crypto.randomUUID();
    
    const items: BillItem[] = input.items.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      studioId: input.studioId,
      billId,
    }));

    const newBill: Bill = {
      id: billId,
      studioId: input.studioId,
      projectId: input.projectId,
      vendorId: input.vendorId,
      vendorName: input.vendorName,
      billNumber: input.billNumber,
      date: input.date,
      status: 'to_review',
      photoUrl: input.photoUrl,
      uploadedBy: input.uploadedBy,
      uploadedById: input.uploadedById,
      createdAt: new Date().toISOString(),
      items,
      needsTradeLeadCheck: input.needsTradeLeadCheck || false,
    };

    bills.unshift(newBill);
    setItem(STORAGE_KEYS.BILLS, bills);

    // If items have addToStock = true, record received movements immediately
    for (const item of items) {
      if (item.addToStock) {
        await stockService.recordReceived({
          studioId: input.studioId,
          projectId: input.projectId,
          materialId: item.materialId,
          quantity: item.quantity,
          billId: newBill.id,
          workerName: input.uploadedBy,
          note: `Received from Bill ${newBill.billNumber || newBill.id}`,
        });
      }
    }

    return newBill;
  },

  async markReviewed(id: string): Promise<Bill | null> {
    const bills = getItem<Bill[]>(STORAGE_KEYS.BILLS, []);
    const index = bills.findIndex(b => b.id === id);
    if (index === -1) return null;

    bills[index].status = 'reviewed';
    bills[index].needsTradeLeadCheck = false;
    bills[index].tradeLeadCheckClearedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.BILLS, bills);
    return bills[index];
  },

  async confirmTradeLeadDelivery(id: string, confirmedBy: string = 'Office'): Promise<Bill | null> {
    return this.updateBill(id, {
      needsTradeLeadCheck: false,
      tradeLeadCheckClearedAt: new Date().toISOString(),
      tradeLeadCheckClearedBy: confirmedBy,
    });
  },

  async updateBill(id: string, updates: Partial<Bill>): Promise<Bill> {
    const bills = getItem<Bill[]>(STORAGE_KEYS.BILLS, []);
    const index = bills.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bill not found');

    const existing = bills[index];
    const updated = { ...existing, ...updates };

    // If items were updated, reconcile stock movements for this bill
    if (updates.items) {
      const allMovements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
      // Remove previous movements from this bill
      const remainingMovements = allMovements.filter(m => m.billId !== id);
      
      // Re-create movements for items with addToStock = true
      const newMovements: StockMovement[] = [];
      for (const item of updates.items) {
        if (item.addToStock) {
          newMovements.push({
            id: crypto.randomUUID(),
            studioId: updated.studioId,
            projectId: updated.projectId,
            materialId: item.materialId,
            type: 'received',
            quantity: item.quantity,
            billId: updated.id,
            workerName: updated.uploadedBy || 'Supervisor',
            date: new Date().toISOString(),
            note: `Received from Bill ${updated.billNumber || updated.id}`,
          });
        }
      }

      setItem(STORAGE_KEYS.STOCK_MOVEMENTS, [...newMovements, ...remainingMovements]);
    }

    bills[index] = updated;
    setItem(STORAGE_KEYS.BILLS, bills);
    return updated;
  },

  async deleteBill(id: string): Promise<boolean> {
    const bills = getItem<Bill[]>(STORAGE_KEYS.BILLS, []);
    const filtered = bills.filter(b => b.id !== id);
    setItem(STORAGE_KEYS.BILLS, filtered);

    // Also remove stock movements associated with this bill
    const allMovements = getItem<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    const remainingMovements = allMovements.filter(m => m.billId !== id);
    setItem(STORAGE_KEYS.STOCK_MOVEMENTS, remainingMovements);
    return true;
  },

  async listVendors(): Promise<Vendor[]> {
    return getItem<Vendor[]>(STORAGE_KEYS.VENDORS, []);
  },

  async createVendor(name: string, category?: string, phone?: string): Promise<Vendor> {
    const vendors = getItem<Vendor[]>(STORAGE_KEYS.VENDORS, []);
    const newVendor: Vendor = {
      id: `ven-${Date.now().toString(36)}`,
      studioId: 'studio-bestinterio-001',
      name,
      category,
      phone,
    };
    vendors.push(newVendor);
    setItem(STORAGE_KEYS.VENDORS, vendors);
    return newVendor;
  },
};
