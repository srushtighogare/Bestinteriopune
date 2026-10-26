import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Bill, BillItem, Vendor } from '../types';
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
    const billId = `bill-${Date.now().toString(36)}`;
    
    const items: BillItem[] = input.items.map((item, idx) => ({
      ...item,
      id: `bi-${billId}-${idx}`,
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
    setItem(STORAGE_KEYS.BILLS, bills);
    return bills[index];
  },

  async listVendors(): Promise<Vendor[]> {
    return getItem<Vendor[]>(STORAGE_KEYS.VENDORS, []);
  },

  async createVendor(name: string, category?: string, phone?: string): Promise<Vendor> {
    const vendors = getItem<Vendor[]>(STORAGE_KEYS.VENDORS, []);
    const newVendor: Vendor = {
      id: `ven-${Date.now().toString(36)}`,
      studioId: 'studio-svara-001',
      name,
      category,
      phone,
    };
    vendors.push(newVendor);
    setItem(STORAGE_KEYS.VENDORS, vendors);
    return newVendor;
  },
};
