export type UserRole = 'owner' | 'manager' | 'supervisor' | 'worker';

export type TradeType = 
  | 'carpentry'
  | 'electrical'
  | 'civil'
  | 'painting'
  | 'plumbing'
  | 'false_ceiling'
  | 'other';

export interface User {
  id: string;
  studioId: string;
  name: string;
  phone: string;
  role: UserRole;
  trade?: TradeType;
  assignedProjectIds: string[];
  status: 'active' | 'invited' | 'deactivated';
  lastActive?: string;
  avatarUrl?: string;
  pin?: string; // 4-digit PIN for site app
}

export interface Studio {
  id: string;
  name: string;
  ownerName: string;
  city: string;
  address: string;
  phone: string;
  logoUrl: string;
  managerCanSeeAmounts: boolean;
}

export interface Room {
  id: string;
  name: string;
  order: number;
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed';
export type ProjectType = 'apartment' | 'villa' | 'office' | 'shop' | 'custom';

export interface Project {
  id: string;
  studioId: string;
  name: string;
  customerName: string;
  address: string;
  type: ProjectType;
  status: ProjectStatus;
  startDate: string;
  targetDate: string;
  budget?: number; // ₹ (only visible to owner or manager if allowed)
  supervisorId: string;
  coverImage: string;
  currentFocus?: string;
  rooms: Room[];
  tradesInScope: TradeType[];
}

export type ProgressCellStatus = 'not_started' | 'in_progress' | 'done';

export interface ScopeGridCell {
  id: string;
  projectId: string;
  roomId: string;
  trade: TradeType;
  status: ProgressCellStatus;
  percentage: number; // 0, 25, 50, 75, 100
  lastUpdated?: string;
  lastUpdatedBy?: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  trade?: TradeType;
}

export interface Material {
  id: string;
  studioId: string;
  categoryId: string;
  name: string;
  shadeCode?: string;
  unit: string;
  lowStockThreshold: number;
}

export type StockMovementType = 'received' | 'used' | 'adjustment';

export interface StockMovement {
  id: string;
  studioId: string;
  projectId: string;
  materialId: string;
  type: StockMovementType;
  quantity: number;
  billId?: string;
  workerId?: string;
  workerName?: string;
  roomId?: string;
  roomName?: string;
  date: string; // ISO string e.g. "2026-10-25T14:30:00.000Z"
  reason?: string;
  note?: string;
}

export type BillStatus = 'to_review' | 'reviewed';

export interface BillItem {
  id: string;
  billId: string;
  materialId: string;
  materialName: string;
  categoryId: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  addToStock: boolean;
}

export interface Bill {
  id: string;
  studioId: string;
  projectId: string;
  vendorId: string;
  vendorName: string;
  billNumber?: string;
  date: string; // YYYY-MM-DD
  status: BillStatus;
  photoUrl: string;
  uploadedBy: string; // user name
  uploadedById: string;
  createdAt: string; // ISO
  items: BillItem[];
}

export interface Vendor {
  id: string;
  studioId: string;
  name: string;
  category?: string;
  phone?: string;
}

export interface ProgressUpdate {
  id: string;
  studioId: string;
  projectId: string;
  roomId: string;
  roomName: string;
  trade: TradeType;
  authorId: string;
  authorName: string;
  date: string; // ISO
  status: ProgressCellStatus;
  percentage: number;
  note?: string;
  photos: string[];
}

export type IssueType = 
  | 'material_missing'
  | 'waiting_for_trade'
  | 'design_question'
  | 'damage'
  | 'other';

export interface Issue {
  id: string;
  studioId: string;
  projectId: string;
  roomId?: string;
  roomName?: string;
  type: IssueType;
  description: string;
  photoUrl?: string;
  reportedBy: string;
  reportedAt: string; // ISO
  status: 'open' | 'resolved';
  resolvedAt?: string;
}

export type StockLevelStatus = 'in_stock' | 'running_low' | 'out_of_stock';

export interface MaterialStockBalance {
  materialId: string;
  materialName: string;
  shadeCode?: string;
  unit: string;
  categoryId: string;
  categoryName: string;
  projectId: string;
  received: number;
  used: number;
  inStock: number;
  lowStockThreshold: number;
  status: StockLevelStatus;
  hasOveruse: boolean; // used > received
  overuseQty: number;
}
