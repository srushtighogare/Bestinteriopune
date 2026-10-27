export const STUDIO_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

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
  Vendor 
} from '../types';

/**
 * Date generation helpers relative to a reference base date.
 * Allows the entire prototype mock data to remain perpetual and accurate
 * regardless of what day or year the app is loaded or reset.
 */
export function getRelativeDate(daysOffset: number, hours = 10, minutes = 0, baseDate: Date = new Date()): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export function getRelativeDateString(daysOffset: number, baseDate: Date = new Date()): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface InitialDataBundle {
  studio: Studio;
  users: User[];
  categories: Category[];
  materials: Material[];
  vendors: Vendor[];
  projects: Project[];
  scopeCells: ScopeGridCell[];
  stockMovements: StockMovement[];
  bills: Bill[];
  progressUpdates: ProgressUpdate[];
  issues: Issue[];
}

export function generateInitialData(baseDate: Date = new Date()): InitialDataBundle {
  const studio: Studio = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Bestinterio',
    ownerName: 'Megha Jadhav',
    city: 'Pune',
    address: '402, Signature One, Senapati Bapat Road, Pune 411016',
    phone: '+91 98220 54321',
    logoUrl: '/logo.png',
    managerCanSeeAmounts: true,
    tradeLeadsCanRecordDeliveries: true,
  };

  const users: User[] = [
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000001',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Megha Jadhav',
      phone: '9822054321',
      role: 'owner',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-000000000003', 'c2eebc99-9c0b-4ef8-bb6d-000000000004'],
      status: 'active',
      lastActive: getRelativeDate(0, 15, 45, baseDate),
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000002',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Neha Kulkarni',
      phone: '9822187654',
      role: 'manager',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-000000000003', 'c2eebc99-9c0b-4ef8-bb6d-000000000004'],
      status: 'active',
      lastActive: getRelativeDate(0, 14, 20, baseDate),
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Rajiv Deshmukh',
      phone: '9850011223',
      role: 'supervisor',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-000000000003'],
      status: 'active',
      lastActive: getRelativeDate(0, 14, 10, baseDate),
      pin: '1234',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Gurmukh Singh',
      phone: '9850022334',
      role: 'worker',
      trade: 'carpentry',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-000000000002'],
      status: 'active',
      lastActive: getRelativeDate(0, 13, 30, baseDate),
      pin: '1472',
      inviteCode: 'gurmukh-singh',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000005',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Imran Shaikh',
      phone: '9850033445',
      role: 'worker',
      trade: 'electrical',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-000000000003'],
      status: 'active',
      lastActive: getRelativeDate(0, 11, 0, baseDate),
      pin: '2580',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000006',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Santosh Pawar',
      phone: '9850044556',
      role: 'worker',
      trade: 'civil',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000002'],
      status: 'active',
      lastActive: getRelativeDate(-1, 16, 30, baseDate),
      pin: '3691',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000007',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Vijay More',
      phone: '9850055667',
      role: 'worker',
      trade: 'painting',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-000000000002'],
      status: 'invited',
      inviteCode: 'vijay-more',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'b1eebc99-9c0b-4ef8-bb6d-000000000008',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Arun Shinde',
      phone: '9850099999',
      role: 'worker',
      trade: 'carpentry',
      assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001'],
      status: 'deactivated',
      pin: '8888',
      lastActive: getRelativeDate(-14, 10, 0, baseDate),
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const categories: Category[] = [
    { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Carpentry', order: 1, trade: 'carpentry' },
    { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Electrical', order: 2, trade: 'electrical' },
    { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Civil', order: 3, trade: 'civil' },
    { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Painting', order: 4, trade: 'painting' },
    { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Plumbing', order: 5, trade: 'plumbing' },
    { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'False ceiling', order: 6, trade: 'false_ceiling' },
  ];

  const materials: Material[] = [
    // Carpentry
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Plywood 18mm BWP', unit: 'sheet', lowStockThreshold: 10 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Plywood 12mm', unit: 'sheet', lowStockThreshold: 8 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'MDF 18mm', unit: 'sheet', lowStockThreshold: 5 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Laminate 1mm', shadeCode: 'Oak 5512', unit: 'sheet', lowStockThreshold: 6 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Laminate 1mm', shadeCode: 'White Matte 1101', unit: 'sheet', lowStockThreshold: 6 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Laminate 0.8mm', shadeCode: 'Walnut 7720', unit: 'sheet', lowStockThreshold: 4 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Edge band tape', unit: 'roll', lowStockThreshold: 5 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Soft-close hinges', unit: 'piece', lowStockThreshold: 10 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Drawer channels 18"', unit: 'pair', lowStockThreshold: 6 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000000a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Handles – profile', unit: 'piece', lowStockThreshold: 15 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000000b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Fevicol SH 5kg', unit: 'tin', lowStockThreshold: 3 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000000c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Screws 1.5"', unit: 'box', lowStockThreshold: 4 },

    // Electrical
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Wire 1.5 sq mm', unit: 'coil', lowStockThreshold: 4 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000000e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Wire 2.5 sq mm', unit: 'coil', lowStockThreshold: 3 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Modular switch 6A', unit: 'piece', lowStockThreshold: 20 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Socket 16A', unit: 'piece', lowStockThreshold: 10 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Switch plate 4-module', unit: 'piece', lowStockThreshold: 8 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'LED panel light 12W', unit: 'piece', lowStockThreshold: 12 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'LED bulb 9W', unit: 'piece', lowStockThreshold: 10 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Ceiling fan', unit: 'piece', lowStockThreshold: 2 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Profile light 1m', unit: 'piece', lowStockThreshold: 8 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', name: 'PVC conduit 25mm', unit: 'length', lowStockThreshold: 15 },

    // Civil
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Cement 50kg', unit: 'bag', lowStockThreshold: 10 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000018', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Sand', unit: 'brass', lowStockThreshold: 2 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000019', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Tile adhesive', unit: 'bag', lowStockThreshold: 5 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000001a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Floor tiles 600×600', unit: 'box', lowStockThreshold: 12 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000001b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Wall tiles 300×600', unit: 'box', lowStockThreshold: 12 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000001c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Grout', unit: 'kg', lowStockThreshold: 8 },

    // Painting
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000001d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Wall putty 20kg', unit: 'bag', lowStockThreshold: 6 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000001e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Primer', unit: 'litre', lowStockThreshold: 10 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-00000000001f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Emulsion – white', unit: 'litre', lowStockThreshold: 20 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000020', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Emulsion – accent', unit: 'litre', lowStockThreshold: 10 },

    // Plumbing
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000021', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', name: 'CPVC pipe ¾"', unit: 'length', lowStockThreshold: 8 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000022', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', name: 'Basin mixer', unit: 'piece', lowStockThreshold: 2 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000023', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', name: 'Health faucet', unit: 'piece', lowStockThreshold: 3 },

    // False ceiling
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000024', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000006', name: 'Gypsum board', unit: 'sheet', lowStockThreshold: 15 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000025', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000006', name: 'GI channels', unit: 'piece', lowStockThreshold: 20 },
    { id: 'f5eebc99-9c0b-4ef8-bb6d-000000000026', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000006', name: 'Ceiling screws', unit: 'box', lowStockThreshold: 5 },
  ];

  const vendors: Vendor[] = [
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Shree Plywood & Laminates', category: 'Carpentry', phone: '98220 11990' },
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Om Electricals', category: 'Electrical', phone: '98220 22880' },
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Sai Hardware', category: 'Hardware', phone: '98220 33770' },
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Mahalaxmi Cement Depot', category: 'Civil', phone: '98220 44660' },
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Asian Paints dealer (City Colours)', category: 'Painting', phone: '98220 55550' },
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Jaquar dealer (Aqua Bath Studio)', category: 'Plumbing', phone: '98220 66440' },
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Royal Stone Gallery', category: 'Civil', phone: '98220 77330' },
    { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Apex Commercial Interiors & Fitouts', category: 'Civil', phone: '98220 88220' },
  ];

  const projects: Project[] = [
    {
      id: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Mehta Residence',
      customerName: 'Anil & Priya Mehta',
      address: 'Flat 902, Tower B, Panchshil Towers, Kharadi, Pune',
      type: 'apartment',
      status: 'active',
      startDate: getRelativeDateString(-55, baseDate),
      targetDate: getRelativeDateString(50, baseDate),
      budget: 1800000,
      supervisorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      currentFocus: 'Kitchen carpentry & bedroom wardrobes',
      tradesInScope: ['civil', 'electrical', 'carpentry', 'false_ceiling', 'painting', 'plumbing'],
      rooms: [
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Living & Dining', order: 1 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Kitchen', order: 2 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Master Bedroom', order: 3 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Kids Bedroom', order: 4 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Guest Bedroom', order: 5 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', name: 'Balcony', order: 6 },
      ],
    },
    {
      id: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Baner Villa',
      customerName: 'Sharma family',
      address: 'Plot 44, Beverly Hills, Baner-Pashan Link Road, Pune',
      type: 'villa',
      status: 'active',
      startDate: getRelativeDateString(-75, baseDate),
      targetDate: getRelativeDateString(95, baseDate),
      budget: 4200000,
      supervisorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      currentFocus: 'Electrical conduits & ground floor civil finishing',
      tradesInScope: ['civil', 'electrical', 'plumbing', 'false_ceiling', 'carpentry', 'painting'],
      rooms: [
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Foyer & Living', order: 1 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Kitchen & Dining', order: 2 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Master Suite', order: 3 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Ground Guest Room', order: 4 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', name: 'First Floor Lounge', order: 5 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Children Suite', order: 6 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', name: 'Terrace & Deck', order: 7 },
      ],
    },
    {
      id: 'c2eebc99-9c0b-4ef8-bb6d-000000000003',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Kharadi Office',
      customerName: 'Lumen Analytics',
      address: '6th Floor, World Trade Center, Tower 3, Kharadi, Pune',
      type: 'office',
      status: 'active',
      startDate: getRelativeDateString(-25, baseDate),
      targetDate: getRelativeDateString(25, baseDate),
      budget: 1200000,
      supervisorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      currentFocus: 'Demolition & floor marking',
      tradesInScope: ['civil', 'electrical', 'false_ceiling', 'carpentry', 'painting'],
      rooms: [
        { id: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Reception & Waiting', order: 1 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Open Work Hall', order: 2 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Conference Room', order: 3 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Executive Cabin 1', order: 4 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Executive Cabin 2', order: 5 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', name: 'Pantry & Breakout', order: 6 },
      ],
    },
    {
      id: 'c2eebc99-9c0b-4ef8-bb6d-000000000004',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Sinha Apartment',
      customerName: 'Vikram & Radhika Sinha',
      address: 'Flat 403, Rohan Tarang, Wakad, Pune',
      type: 'apartment',
      status: 'completed',
      startDate: getRelativeDateString(-175, baseDate),
      targetDate: getRelativeDateString(-65, baseDate),
      budget: 1400000,
      supervisorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
      tradesInScope: ['civil', 'electrical', 'carpentry', 'false_ceiling', 'painting', 'plumbing'],
      rooms: [
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Living Room', order: 1 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Master Bedroom', order: 2 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Guest Bedroom', order: 3 },
        { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000017', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Kitchen', order: 4 },
      ],
    },
  ];

  const scopeCells: ScopeGridCell[] = [
    // --- Mehta Residence (~58% progress) ---
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-45, 10, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'electrical', status: 'in_progress', percentage: 75, lastUpdated: getRelativeDate(-2, 11, 30, baseDate), lastUpdatedBy: 'Imran Shaikh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'carpentry', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-4, 16, 0, baseDate), lastUpdatedBy: 'Gurmukh Singh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-8, 12, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'painting', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-40, 15, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-35, 11, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'electrical', status: 'in_progress', percentage: 75, lastUpdated: getRelativeDate(-3, 14, 0, baseDate), lastUpdatedBy: 'Imran Shaikh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'carpentry', status: 'in_progress', percentage: 75, lastUpdated: getRelativeDate(0, 13, 30, baseDate), lastUpdatedBy: 'Gurmukh Singh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-6, 17, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'painting', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-30, 16, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-35, 12, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'electrical', status: 'in_progress', percentage: 60, lastUpdated: getRelativeDate(-5, 10, 0, baseDate), lastUpdatedBy: 'Imran Shaikh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'carpentry', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-1, 15, 0, baseDate), lastUpdatedBy: 'Gurmukh Singh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-10, 14, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'painting', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-25, 11, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-30, 10, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-7, 16, 0, baseDate), lastUpdatedBy: 'Imran Shaikh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'false_ceiling', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-12, 10, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000017', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'painting', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000018', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-20, 14, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000019', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-28, 11, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'electrical', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'false_ceiling', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-15, 16, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'painting', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-18, 12, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-25, 10, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000020', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'electrical', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-10, 15, 0, baseDate), lastUpdatedBy: 'Imran Shaikh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000021', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000022', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-12, 11, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000023', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'painting', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000024', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-20, 15, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },

    // --- Baner Villa (~38% progress) ---
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000025', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-40, 10, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000026', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-38, 14, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000027', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-1, 11, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000028', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'false_ceiling', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-3, 15, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000029', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'carpentry', status: 'in_progress', percentage: 25, lastUpdated: getRelativeDate(0, 10, 0, baseDate), lastUpdatedBy: 'Gurmukh Singh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-35, 10, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-30, 12, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-2, 16, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000030', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000031', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-28, 14, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000032', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-24, 10, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000033', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-4, 14, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000034', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000035', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000036', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000037', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-21, 12, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000038', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-18, 15, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000039', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: getRelativeDate(-6, 10, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-1, 16, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'plumbing', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'electrical', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000040', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000041', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000042', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000043', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-2, 12, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000044', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-1, 10, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000045', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: getRelativeDate(-1, 14, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000046', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000047', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000048', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000049', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-14, 16, 0, baseDate), lastUpdatedBy: 'Santosh Pawar' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-12, 11, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'electrical', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'painting', status: 'not_started', percentage: 0 },

    // --- Kharadi Office (~13% progress, no update for 4 days) ---
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-5, 10, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000050', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'electrical', status: 'in_progress', percentage: 35, lastUpdated: getRelativeDate(-4, 14, 30, baseDate), lastUpdatedBy: 'Imran Shaikh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000051', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000052', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000053', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000054', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'civil', status: 'done', percentage: 100, lastUpdated: getRelativeDate(-6, 16, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000055', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'electrical', status: 'in_progress', percentage: 35, lastUpdated: getRelativeDate(-4, 11, 0, baseDate), lastUpdatedBy: 'Imran Shaikh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000056', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000057', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000058', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000059', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'civil', status: 'in_progress', percentage: 70, lastUpdated: getRelativeDate(-8, 12, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'electrical', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000011', trade: 'civil', status: 'in_progress', percentage: 60, lastUpdated: getRelativeDate(-8, 15, 0, baseDate), lastUpdatedBy: 'Rajiv Deshmukh' },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000011', trade: 'electrical', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000060', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000011', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000061', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000011', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000062', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000011', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000063', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000012', trade: 'civil', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000064', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000012', trade: 'electrical', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000065', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000012', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000066', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000012', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000067', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000012', trade: 'painting', status: 'not_started', percentage: 0 },

    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000068', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000013', trade: 'civil', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000069', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000013', trade: 'electrical', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000006a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000013', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000006b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000013', trade: 'carpentry', status: 'not_started', percentage: 0 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000006c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000013', trade: 'painting', status: 'not_started', percentage: 0 },

    // --- Sinha Apartment (100% completed) ---
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000006d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', trade: 'civil', status: 'done', percentage: 100 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000006e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', trade: 'electrical', status: 'done', percentage: 100 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000006f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', trade: 'carpentry', status: 'done', percentage: 100 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000070', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', trade: 'false_ceiling', status: 'done', percentage: 100 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000071', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', trade: 'painting', status: 'done', percentage: 100 },
    { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000072', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', trade: 'plumbing', status: 'done', percentage: 100 },
  ];

  const stockMovements: StockMovement[] = [
    // --- Mehta Residence ---
    // Laminate 1mm Oak 5512: received 12 from Bill 1, used 12 -> 0 left -> Out of stock
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', type: 'received', quantity: 12, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-44, 10, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', type: 'used', quantity: 6, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: getRelativeDate(-8, 14, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', type: 'used', quantity: 6, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', roomName: 'Master Bedroom', date: getRelativeDate(-2, 16, 0, baseDate) },

    // Soft-close hinges: received 40 from Bill 1, used 31 -> 9 left (threshold 10) -> Running low
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'received', quantity: 40, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-44, 10, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'used', quantity: 20, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: getRelativeDate(-6, 11, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'used', quantity: 11, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', roomName: 'Master Bedroom', date: getRelativeDate(-1, 15, 30, baseDate) },

    // Plywood 18mm: received 30 from Bill 1 & Bill 3, used 18 -> 12 left
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'received', quantity: 20, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-44, 10, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'received', quantity: 10, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-21, 11, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'used', quantity: 12, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: getRelativeDate(-14, 16, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'used', quantity: 6, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', roomName: 'Master Bedroom', date: getRelativeDate(-4, 10, 0, baseDate) },

    // Wire 1.5 sq mm: received 8, used 4 -> 4 left
    { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', type: 'received', quantity: 8, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000002', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-41, 12, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', type: 'used', quantity: 4, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005', workerName: 'Imran Shaikh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', roomName: 'Living & Dining', date: getRelativeDate(-5, 14, 0, baseDate) },

    // Fevicol SH 5kg: received 6, used 4 -> 2 left (threshold 3) -> Running low
    { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000b', type: 'received', quantity: 6, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-44, 10, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000b', type: 'used', quantity: 4, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: getRelativeDate(-3, 11, 0, baseDate) },

    // --- Baner Villa ---
    // Wire 2.5 sq mm: received 10, used 7 -> 3 left (threshold 3) -> Running low
    { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000e', type: 'received', quantity: 10, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000005', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-46, 11, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000e', type: 'used', quantity: 7, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003', workerName: 'Rajiv Deshmukh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', roomName: 'Foyer & Living', date: getRelativeDate(-4, 15, 0, baseDate) },

    // Cement: received 60, used 52 -> 8 left (threshold 10) -> Running low
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', type: 'received', quantity: 60, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-67, 10, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', type: 'used', quantity: 52, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000006', workerName: 'Santosh Pawar', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', roomName: 'Foyer & Living', date: getRelativeDate(-2, 17, 0, baseDate) },

    // Hinges overuse at Baner Villa: received 10, but Gurmukh logged using 13! (3 overused alert)
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'received', quantity: 10, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000007', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-16, 12, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'used', quantity: 13, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', roomName: 'Foyer & Living', date: getRelativeDate(0, 9, 30, baseDate) },

    // --- Kharadi Office ---
    // PVC Conduit 25mm: received 30, used 10 -> 20 left
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', type: 'received', quantity: 30, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000008', workerName: 'Rajiv Deshmukh', date: getRelativeDate(-14, 14, 0, baseDate) },
    { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', type: 'used', quantity: 10, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005', workerName: 'Imran Shaikh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', roomName: 'Open Work Hall', date: getRelativeDate(-4, 10, 0, baseDate) },
  ];

  const bills: Bill[] = [
    // --- Mehta Residence Bills (Budget: ₹18,00,000 | Total Spend: ₹9,44,060 -> ~52.4%) ---
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000001',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorName: 'Shree Plywood & Laminates',
      billNumber: 'SPL/26/0481',
      date: getRelativeDateString(-44, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-44, 11, 20, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', materialName: 'Plywood 18mm BWP', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 20, unit: 'sheet', rate: 2800, amount: 56000, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', materialName: 'Laminate 1mm (Oak 5512)', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 12, unit: 'sheet', rate: 1450, amount: 17400, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', materialName: 'Soft-close hinges', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 40, unit: 'piece', rate: 180, amount: 7200, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000b', materialName: 'Fevicol SH 5kg', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 6, unit: 'tin', rate: 1250, amount: 7500, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000002',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorName: 'Om Electricals',
      billNumber: 'OM/SEP/112',
      date: getRelativeDateString(-41, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-2.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-41, 14, 15, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', materialName: 'Wire 1.5 sq mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 8, unit: 'coil', rate: 1650, amount: 13200, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', materialName: 'PVC conduit 25mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 25, unit: 'length', rate: 140, amount: 3500, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000003',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorName: 'Shree Plywood & Laminates',
      billNumber: 'SPL/26/0590',
      date: getRelativeDateString(-21, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-21, 16, 0, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', materialName: 'Plywood 18mm BWP', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 10, unit: 'sheet', rate: 2800, amount: 28000, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000002', materialName: 'Plywood 12mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 15, unit: 'sheet', rate: 2100, amount: 31500, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000009', materialName: 'Drawer channels 18"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 12, unit: 'pair', rate: 450, amount: 5400, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000007',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000003',
      vendorName: 'Sai Hardware',
      billNumber: 'SH-8819',
      date: getRelativeDateString(-16, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-16, 13, 0, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000007', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', materialName: 'Soft-close hinges', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 10, unit: 'piece', rate: 180, amount: 1800, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000007', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000c', materialName: 'Screws 1.5"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 8, unit: 'box', rate: 220, amount: 1760, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-00000000000b',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorName: 'Shree Plywood & Laminates',
      billNumber: 'SPL/26/0612',
      date: getRelativeDateString(-18, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-18, 14, 0, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000001a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000b', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', materialName: 'Modular kitchen BWR carcass panels', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 28, unit: 'sheet', rate: 4200, amount: 117600, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000001b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000b', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', materialName: 'Acrylic kitchen shutter facings', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 18, unit: 'sheet', rate: 3600, amount: 64800, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000001c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000b', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000003', materialName: 'Wardrobe HDHMR 18mm boards', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 35, unit: 'sheet', rate: 3200, amount: 112000, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000001d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000b', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000009', materialName: 'Premium tandem pantry pullout units', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 2, unit: 'set', rate: 24500, amount: 49000, addToStock: false },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-00000000000c',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000005',
      vendorName: 'Asian Paints dealer (City Colours)',
      billNumber: 'CC/2026/0994',
      date: getRelativeDateString(-10, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-2.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-10, 15, 30, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000001e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000c', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000001a', materialName: 'Designer Italian composite marble tiles', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 650, unit: 'sq ft', rate: 420, amount: 273000, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000001f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000c', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000024', materialName: 'Concealed grid false ceiling channels & gypsum boards', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000006', quantity: 85, unit: 'sheet', rate: 820, amount: 69700, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000020', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000c', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000015', materialName: 'LED magnetic track lighting rail & spot lights', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 1, unit: 'package', rate: 68500, amount: 68500, addToStock: false },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000009',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000005',
      vendorName: 'Asian Paints dealer (City Colours)',
      billNumber: 'CC/2026/1092',
      date: getRelativeDateString(-1, baseDate),
      status: 'to_review',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-1, 11, 45, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000009', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000001d', materialName: 'Wall putty 20kg', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', quantity: 15, unit: 'bag', rate: 820, amount: 12300, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000017', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000009', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000001e', materialName: 'Primer', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', quantity: 20, unit: 'litre', rate: 195, amount: 3900, addToStock: true },
      ],
    },

    // --- Baner Villa Bills (Budget: ₹42,00,000 | Total Spend: ₹16,37,110 -> ~39.0%) ---
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000004',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000004',
      vendorName: 'Mahalaxmi Cement Depot',
      billNumber: 'MCD-994',
      date: getRelativeDateString(-67, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-2.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-67, 11, 0, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000000a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000004', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', materialName: 'Cement 50kg', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 60, unit: 'bag', rate: 400, amount: 24000, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000000b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000004', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000018', materialName: 'Sand', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 3, unit: 'brass', rate: 7500, amount: 22500, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000005',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorName: 'Om Electricals',
      billNumber: 'OM/SEP/089',
      date: getRelativeDateString(-46, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-2.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-46, 12, 0, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000000c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000005', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000e', materialName: 'Wire 2.5 sq mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 10, unit: 'coil', rate: 2300, amount: 23000, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000000d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000005', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000f', materialName: 'Modular switch 6A', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 40, unit: 'piece', rate: 85, amount: 3400, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000000e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000005', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000010', materialName: 'Socket 16A', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 15, unit: 'piece', rate: 160, amount: 2400, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000006',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000006',
      vendorName: 'Jaquar dealer (Aqua Bath Studio)',
      billNumber: 'ABS/2026/304',
      date: getRelativeDateString(-28, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-28, 15, 40, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000006', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000021', materialName: 'CPVC pipe ¾"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', quantity: 20, unit: 'length', rate: 320, amount: 6400, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000006', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000022', materialName: 'Basin mixer', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', quantity: 4, unit: 'piece', rate: 3850, amount: 15400, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000006', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000023', materialName: 'Health faucet', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', quantity: 5, unit: 'piece', rate: 1200, amount: 6000, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-00000000000d',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000004',
      vendorName: 'Mahalaxmi Cement Depot',
      billNumber: 'MCD-1082',
      date: getRelativeDateString(-45, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-2.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-45, 10, 30, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000021', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000d', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', materialName: 'RMC Concrete Grade M25 (slab deck)', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 18, unit: 'cu m', rate: 5800, amount: 104400, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000022', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000d', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000018', materialName: 'TMT Steel bars Fe500D (reinforcement)', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 35, unit: 'quintal', rate: 6200, amount: 217000, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000023', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000d', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000018', materialName: 'River sand & aggregates', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 12, unit: 'brass', rate: 7800, amount: 93600, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000024', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000d', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000019', materialName: 'External waterproofing compound & curing membranes', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 8, unit: 'barrel', rate: 14500, amount: 116000, addToStock: false },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-00000000000e',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000007',
      vendorName: 'Royal Stone Gallery',
      billNumber: 'RSG/2026/89',
      date: getRelativeDateString(-25, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-25, 16, 15, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000025', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000e', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000001a', materialName: 'Imported Botticino Italian marble flooring slabs', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 1200, unit: 'sq ft', rate: 650, amount: 780000, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000026', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000e', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000019', materialName: 'Marble adhesive & epoxy grout', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 25, unit: 'bag', rate: 1450, amount: 36250, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000027', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000e', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000021', materialName: 'Concealed copper HVAC refrigerant piping & drain lines', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', quantity: 1, unit: 'lot', rate: 175000, amount: 175000, addToStock: false },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-00000000000a',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000003',
      vendorName: 'Sai Hardware',
      billNumber: 'SH-9012',
      date: getRelativeDateString(-1, baseDate),
      status: 'to_review',
      photoUrl: '/bills/bill-sample-2.svg',
      uploadedBy: 'Gurmukh Singh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
      needsTradeLeadCheck: true,
      createdAt: getRelativeDate(-1, 16, 20, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000018', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000a', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000a', materialName: 'Handles – profile', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 24, unit: 'piece', rate: 340, amount: 8160, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000019', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000a', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000009', materialName: 'Drawer channels 18"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 8, unit: 'pair', rate: 450, amount: 3600, addToStock: true },
      ],
    },

    // --- Kharadi Office Bills (Budget: ₹12,00,000 | Total Spend: ₹1,68,140 -> ~14.0%) ---
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-000000000008',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000002',
      vendorName: 'Om Electricals',
      billNumber: 'OM/OCT/044',
      date: getRelativeDateString(-14, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-2.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-14, 15, 0, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000008', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', materialName: 'PVC conduit 25mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 30, unit: 'length', rate: 140, amount: 4200, addToStock: true },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000008', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', materialName: 'Wire 1.5 sq mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 6, unit: 'coil', rate: 1650, amount: 9900, addToStock: true },
      ],
    },
    {
      id: 'b7eebc99-9c0b-4ef8-bb6d-00000000000f',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003',
      vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000008',
      vendorName: 'Apex Commercial Interiors & Fitouts',
      billNumber: 'APEX/2026/042',
      date: getRelativeDateString(-18, baseDate),
      status: 'reviewed',
      photoUrl: '/bills/bill-sample-1.svg',
      uploadedBy: 'Rajiv Deshmukh',
      uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      createdAt: getRelativeDate(-18, 11, 0, baseDate),
      items: [
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000028', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000f', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', materialName: 'Commercial hacking, wall removal & nighttime debris carting', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', quantity: 1, unit: 'turnkey lot', rate: 78000, amount: 78000, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000029', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000f', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', materialName: 'Floor raceway galvanized conduits & main server cable trays', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 45, unit: 'length', rate: 680, amount: 30600, addToStock: false },
        { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000002a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000f', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000024', materialName: 'Perimeter wall framing studs & acoustic glass partition channels', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000006', quantity: 32, unit: 'section', rate: 1420, amount: 45440, addToStock: false },
      ],
    },
  ];

  const progressUpdates: ProgressUpdate[] = [
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000001',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002',
      roomName: 'Kitchen',
      trade: 'carpentry',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
      authorName: 'Gurmukh Singh',
      date: getRelativeDate(0, 13, 30, baseDate),
      status: 'in_progress',
      percentage: 75,
      note: 'Tall unit framework completed. Fitting drawer channels in lower run.',
      photos: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000002',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003',
      roomName: 'Master Bedroom',
      trade: 'carpentry',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
      authorName: 'Gurmukh Singh',
      date: getRelativeDate(-1, 15, 0, baseDate),
      status: 'in_progress',
      percentage: 50,
      note: 'Wardrobe carcass assembled. Need oak laminate for sliding shutter.',
      photos: [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000003',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001',
      roomName: 'Living & Dining',
      trade: 'electrical',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005',
      authorName: 'Imran Shaikh',
      date: getRelativeDate(-2, 11, 30, baseDate),
      status: 'in_progress',
      percentage: 75,
      note: 'Cove lighting profile aluminum channels fixed in ceiling.',
      photos: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000004',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002',
      roomName: 'Kitchen',
      trade: 'electrical',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005',
      authorName: 'Imran Shaikh',
      date: getRelativeDate(-3, 14, 0, baseDate),
      status: 'in_progress',
      percentage: 75,
      note: 'Under-cabinet wiring and chimney power point wired.',
      photos: [
        'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000005',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007',
      roomName: 'Foyer & Living',
      trade: 'carpentry',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
      authorName: 'Gurmukh Singh',
      date: getRelativeDate(0, 10, 0, baseDate),
      status: 'in_progress',
      percentage: 25,
      note: 'Foyer shoe console frame marked and anchor fasteners placed.',
      photos: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000006',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007',
      roomName: 'Foyer & Living',
      trade: 'electrical',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
      authorName: 'Rajiv Deshmukh',
      date: getRelativeDate(-1, 11, 0, baseDate),
      status: 'in_progress',
      percentage: 50,
      note: 'Chandelier box reinforcement completed in high ceiling.',
      photos: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000007',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b',
      roomName: 'First Floor Lounge',
      trade: 'civil',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000006',
      authorName: 'Santosh Pawar',
      date: getRelativeDate(-1, 16, 0, baseDate),
      status: 'in_progress',
      percentage: 75,
      note: 'Italian marble screed layer leveled and curing in progress.',
      photos: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000008',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e',
      roomName: 'Reception & Waiting',
      trade: 'electrical',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005',
      authorName: 'Imran Shaikh',
      date: getRelativeDate(-4, 14, 30, baseDate),
      status: 'in_progress',
      percentage: 25,
      note: 'Floor raceway conduit laying started from server room.',
      photos: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'f1eebc99-9c0b-4ef8-bb6d-000000000009',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f',
      roomName: 'Open Work Hall',
      trade: 'electrical',
      authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005',
      authorName: 'Imran Shaikh',
      date: getRelativeDate(-4, 11, 0, baseDate),
      status: 'in_progress',
      percentage: 25,
      note: 'Marked workstation switch box drops from ceiling trunking.',
      photos: [
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
      ],
    },
  ];

  const issues: Issue[] = [
    {
      id: 'faeebc99-9c0b-4ef8-bb6d-000000000001',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002',
      roomName: 'Kitchen',
      type: 'design_question',
      description: 'Customer to confirm laminate shade for overhead cabinet contrast groove.',
      status: 'open',
      reportedBy: 'Gurmukh Singh',
      reportedAt: getRelativeDate(-3, 14, 30, baseDate),
    },
    {
      id: 'faeebc99-9c0b-4ef8-bb6d-000000000002',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007',
      roomName: 'Foyer & Living',
      type: 'waiting_for_trade',
      description: 'Waiting for electrician to complete chandelier reinforcement before ceiling closing.',
      status: 'open',
      reportedBy: 'Gurmukh Singh',
      reportedAt: getRelativeDate(-2, 10, 15, baseDate),
    },
    {
      id: 'faeebc99-9c0b-4ef8-bb6d-000000000003',
      studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003',
      roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e',
      roomName: 'Reception & Waiting',
      type: 'other',
      description: 'Building management permits raceway core cutting only between 8 PM and 6 AM.',
      status: 'open',
      reportedBy: 'Imran Shaikh',
      reportedAt: getRelativeDate(-1, 16, 45, baseDate),
    },
  ];

  return {
    studio,
    users,
    categories,
    materials,
    vendors,
    projects,
    scopeCells,
    stockMovements,
    bills,
    progressUpdates,
    issues,
  };
}

const defaultBundle = generateInitialData();
export const INITIAL_STUDIO = defaultBundle.studio;
export const INITIAL_USERS = defaultBundle.users;
export const INITIAL_CATEGORIES = defaultBundle.categories;
export const INITIAL_MATERIALS = defaultBundle.materials;
export const INITIAL_VENDORS = defaultBundle.vendors;
export const INITIAL_PROJECTS = defaultBundle.projects;
export const INITIAL_SCOPE_CELLS = defaultBundle.scopeCells;
export const INITIAL_STOCK_MOVEMENTS = defaultBundle.stockMovements;
export const INITIAL_BILLS = defaultBundle.bills;
export const INITIAL_PROGRESS_UPDATES = defaultBundle.progressUpdates;
export const INITIAL_ISSUES = defaultBundle.issues;
