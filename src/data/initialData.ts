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

export const INITIAL_STUDIO: Studio = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Bestinterio',
  ownerName: 'Megha Jadhav',
  city: 'Pune',
  address: '402, Signature One, Senapati Bapat Road, Pune 411016',
  phone: '+91 98220 54321',
  logoUrl: '/logo.svg',
  managerCanSeeAmounts: true,
};

export const INITIAL_USERS: User[] = [
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000001',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Megha Jadhav',
    phone: '9822054321',
    role: 'owner',
    assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001', 'c2eebc99-9c0b-4ef8-bb6d-000000000002', 'c2eebc99-9c0b-4ef8-bb6d-000000000003', 'c2eebc99-9c0b-4ef8-bb6d-000000000004'],
    status: 'active',
    lastActive: '2026-10-26T15:45:00.000Z',
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
    lastActive: '2026-10-26T14:20:00.000Z',
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
    lastActive: '2026-10-26T14:10:00.000Z',
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
    lastActive: '2026-10-26T13:30:00.000Z',
    pin: '1472',
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
    lastActive: '2026-10-26T11:00:00.000Z',
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
    lastActive: '2026-10-25T17:00:00.000Z',
    pin: '3691',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-000000000007',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Vijay More',
    phone: '9850055667',
    role: 'worker',
    trade: 'painting',
    assignedProjectIds: ['c2eebc99-9c0b-4ef8-bb6d-000000000001'],
    status: 'invited',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Carpentry', order: 1, trade: 'carpentry' },
  { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Electrical', order: 2, trade: 'electrical' },
  { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Civil', order: 3, trade: 'civil' },
  { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Painting', order: 4, trade: 'painting' },
  { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Plumbing', order: 5, trade: 'plumbing' },
  { id: 'd3eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'False ceiling', order: 6, trade: 'false_ceiling' },
];

export const INITIAL_MATERIALS: Material[] = [
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

export const INITIAL_VENDORS: Vendor[] = [
  { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Shree Plywood & Laminates', category: 'Carpentry', phone: '98220 11990' },
  { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Om Electricals', category: 'Electrical', phone: '98220 22880' },
  { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Sai Hardware', category: 'Hardware', phone: '98220 33770' },
  { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Mahalaxmi Cement Depot', category: 'Civil', phone: '98220 44660' },
  { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Asian Paints dealer (City Colours)', category: 'Painting', phone: '98220 55550' },
  { id: 'e4eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Jaquar dealer (Aqua Bath Studio)', category: 'Plumbing', phone: '98220 66440' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Mehta Residence',
    customerName: 'Anil & Priya Mehta',
    address: 'Flat 902, Tower B, Panchshil Towers, Kharadi, Pune',
    type: 'apartment',
    status: 'active',
    startDate: '2026-09-01',
    targetDate: '2026-12-15',
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
    startDate: '2026-08-10',
    targetDate: '2027-01-30',
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
    startDate: '2026-10-01',
    targetDate: '2026-11-20',
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
    startDate: '2026-05-01',
    targetDate: '2026-08-20',
    budget: 1400000,
    supervisorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    tradesInScope: ['civil', 'electrical', 'carpentry', 'false_ceiling', 'painting', 'plumbing'],
    rooms: [
      { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Living Room', order: 1 },
      { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Master Bedroom', order: 2 },
      { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Guest Bedroom', order: 3 },
      { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000017', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Kitchen', order: 4 },
      { id: 'a6eebc99-9c0b-4ef8-bb6d-000000000018', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000004', name: 'Balcony', order: 5 },
    ],
  },
];

/**
 * Scope Grid Cells (Room x Trade grid):
 * Mehta Residence: ~55% progress
 * Baner Villa: ~40% progress
 * Kharadi Office: ~15% progress
 * Sinha Apartment: 100% progress
 */
export const INITIAL_SCOPE_CELLS: ScopeGridCell[] = [
  // --- Mehta Residence (6 rooms x 6 trades = 36 cells) ---
  // Living & Dining
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-20T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'electrical', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-24T11:30:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: '2026-10-15T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'carpentry', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-26T12:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-18T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Kitchen
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-22T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-25T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'electrical', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-23T14:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'false_ceiling', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-20T17:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'carpentry', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-26T13:30:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', trade: 'painting', status: 'not_started', percentage: 0 },

  // Master Bedroom
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-24T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-22T16:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: '2026-10-18T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'carpentry', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-25T15:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-26T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Kids Bedroom
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-26T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-21T10:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'false_ceiling', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-19T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'carpentry', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-24T16:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000017', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000018', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000004', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-28T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Guest Bedroom
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000019', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-28T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-20T14:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000005', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-30T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Balcony
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000001f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-10-02T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000020', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'electrical', status: 'done', percentage: 100, lastUpdated: '2026-10-18T14:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000021', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000022', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000023', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000024', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000006', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-04T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // --- Baner Villa (~40% progress) ---
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000025', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-15T10:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000026', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-18T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000027', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-25T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000028', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'false_ceiling', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-23T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000029', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'carpentry', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-26T10:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-20T10:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-25T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-24T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000002f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000030', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000008', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000031', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-28T14:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000032', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-02T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000033', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-22T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000034', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000035', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000036', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000009', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000037', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-10-05T12:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000038', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-08T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000039', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-20T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000a', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'civil', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-25T16:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'plumbing', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000003f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000040', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000041', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000042', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000043', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'civil', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-24T12:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000044', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'plumbing', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000045', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000046', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000047', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000048', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000c', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000049', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-10-12T16:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-14T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000d', trade: 'painting', status: 'not_started', percentage: 0 },

  // --- Kharadi Office (~15% progress, no update for 4 days since 22 Oct) ---
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000004f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'civil', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-21T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000050', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-22T14:30:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000051', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000052', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000053', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000e', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000054', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'civil', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-20T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000055', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-22T11:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000056', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000057', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000058', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-000000000059', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'civil', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000010', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c8eebc99-9c0b-4ef8-bb6d-00000000005e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000011', trade: 'civil', status: 'not_started', percentage: 0 },
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

/**
 * Stock movements (Section 8 rules):
 * Mehta Residence:
 * - Laminate Oak 5512: received 12, used 12 -> 0 left -> Out of stock
 * - Soft-close hinges: received 40, used 31 -> 9 left (low level 10) -> Running low
 * - Plywood 18mm: received 30, used 18 -> 12 in stock
 * Baner Villa:
 * - Wire 2.5 sq mm: received 10, used 7 -> 3 left (low level 3) -> Running low
 * - Cement: received 60, used 52 -> 8 left
 * - Gurmukh used 3 more hinges than were in stock at Baner Villa (received 10, used 13 -> overuse alert)
 */
export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  // --- Mehta Residence ---
  // Laminate 1mm Oak 5512: received 12 from Bill 1, used 12
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000001', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', type: 'received', quantity: 12, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000002', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', type: 'used', quantity: 6, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: '2026-10-18T14:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000003', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000004', type: 'used', quantity: 6, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', roomName: 'Master Bedroom', date: '2026-10-24T16:00:00.000Z' },

  // Soft-close hinges: received 40 from Bill 1, used 31 -> 9 left (threshold 10)
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000004', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'received', quantity: 40, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000005', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'used', quantity: 20, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: '2026-10-20T11:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000006', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'used', quantity: 11, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', roomName: 'Master Bedroom', date: '2026-10-25T15:30:00.000Z' },

  // Plywood 18mm: received 30 from Bill 1 & Bill 3, used 18 -> 12 left
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'received', quantity: 20, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'received', quantity: 10, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', workerName: 'Rajiv Deshmukh', date: '2026-10-05T11:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'used', quantity: 12, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: '2026-10-12T16:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000a', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', type: 'used', quantity: 6, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003', roomName: 'Master Bedroom', date: '2026-10-22T10:00:00.000Z' },

  // Wire 1.5 sq mm: received 8, used 4 -> 4 left
  { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000b', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', type: 'received', quantity: 8, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000002', workerName: 'Rajiv Deshmukh', date: '2026-09-15T12:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000c', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', type: 'used', quantity: 4, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005', workerName: 'Imran Shaikh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000001', roomName: 'Living & Dining', date: '2026-10-21T14:00:00.000Z' },

  // Fevicol SH 5kg: received 6, used 4 -> 2 left (threshold 3) -> Running low
  { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000d', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000b', type: 'received', quantity: 6, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000e', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000b', type: 'used', quantity: 4, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002', roomName: 'Kitchen', date: '2026-10-23T11:00:00.000Z' },

  // --- Baner Villa ---
  // Wire 2.5 sq mm: received 10, used 7 -> 3 left (threshold 3) -> Running low
  { id: 'd9eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000e', type: 'received', quantity: 10, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000005', workerName: 'Rajiv Deshmukh', date: '2026-09-10T11:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000e', type: 'used', quantity: 7, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000003', workerName: 'Rajiv Deshmukh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', roomName: 'Foyer & Living', date: '2026-10-22T15:00:00.000Z' },

  // Cement: received 60, used 52 -> 8 left (threshold 10) -> Running low
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', type: 'received', quantity: 60, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Rajiv Deshmukh', date: '2026-08-20T10:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000017', type: 'used', quantity: 52, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000006', workerName: 'Santosh Pawar', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', roomName: 'Foyer & Living', date: '2026-10-24T17:00:00.000Z' },

  // Hinges overuse at Baner Villa: received 10, but Gurmukh logged using 13! (3 overused alert)
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'received', quantity: 10, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000007', workerName: 'Rajiv Deshmukh', date: '2026-10-10T12:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', type: 'used', quantity: 13, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004', workerName: 'Gurmukh Singh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000007', roomName: 'Foyer & Living', date: '2026-10-26T09:30:00.000Z' },

  // --- Kharadi Office ---
  // PVC Conduit 25mm: received 30, used 10 -> 20 left
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', type: 'received', quantity: 30, billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000008', workerName: 'Rajiv Deshmukh', date: '2026-10-12T14:00:00.000Z' },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', type: 'used', quantity: 10, workerId: 'b1eebc99-9c0b-4ef8-bb6d-000000000005', workerName: 'Imran Shaikh', roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000f', roomName: 'Open Work Hall', date: '2026-10-22T10:00:00.000Z' },
];

/**
 * Bills (10–14 realistic bills with Indian GST items):
 * Two bills uploaded "yesterday" (25 Oct 2026) with status 'to_review'.
 */
export const INITIAL_BILLS: Bill[] = [
  {
    id: 'b7eebc99-9c0b-4ef8-bb6d-000000000001',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
    vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000001',
    vendorName: 'Shree Plywood & Laminates',
    billNumber: 'SPL/26/0481',
    date: '2026-09-12',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-09-12T11:20:00.000Z',
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
    date: '2026-09-15',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-09-15T14:15:00.000Z',
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
    date: '2026-10-05',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-10-05T16:00:00.000Z',
    items: [
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000007', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000001', materialName: 'Plywood 18mm BWP', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 10, unit: 'sheet', rate: 2800, amount: 28000, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000008', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000002', materialName: 'Plywood 12mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 15, unit: 'sheet', rate: 2100, amount: 31500, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000009', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000003', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000009', materialName: 'Drawer channels 18"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 12, unit: 'pair', rate: 450, amount: 5400, addToStock: true },
    ],
  },
  {
    id: 'b7eebc99-9c0b-4ef8-bb6d-000000000004',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
    vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000004',
    vendorName: 'Mahalaxmi Cement Depot',
    billNumber: 'MCD-994',
    date: '2026-08-20',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-08-20T11:00:00.000Z',
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
    date: '2026-09-10',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-09-10T12:00:00.000Z',
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
    date: '2026-09-28',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-09-28T15:40:00.000Z',
    items: [
      { id: 'e0eebc99-9c0b-4ef8-bb6d-00000000000f', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000006', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000021', materialName: 'CPVC pipe ¾"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', quantity: 20, unit: 'length', rate: 320, amount: 6400, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000010', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000006', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000022', materialName: 'Basin mixer', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', quantity: 4, unit: 'piece', rate: 3850, amount: 15400, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000011', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000006', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000023', materialName: 'Health faucet', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000005', quantity: 5, unit: 'piece', rate: 1200, amount: 6000, addToStock: true },
    ],
  },
  {
    id: 'b7eebc99-9c0b-4ef8-bb6d-000000000007',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
    vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000003',
    vendorName: 'Sai Hardware',
    billNumber: 'SH-8819',
    date: '2026-10-10',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-10-10T13:00:00.000Z',
    items: [
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000012', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000007', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000008', materialName: 'Soft-close hinges', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 10, unit: 'piece', rate: 180, amount: 1800, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000013', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000007', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000c', materialName: 'Screws 1.5"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 8, unit: 'box', rate: 220, amount: 1760, addToStock: true },
    ],
  },
  {
    id: 'b7eebc99-9c0b-4ef8-bb6d-000000000008',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000003',
    vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000002',
    vendorName: 'Om Electricals',
    billNumber: 'OM/OCT/044',
    date: '2026-10-12',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-10-12T15:00:00.000Z',
    items: [
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000014', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000008', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000016', materialName: 'PVC conduit 25mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 30, unit: 'length', rate: 140, amount: 4200, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000015', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000008', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000d', materialName: 'Wire 1.5 sq mm', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000002', quantity: 6, unit: 'coil', rate: 1650, amount: 9900, addToStock: true },
    ],
  },

  // --- Two bills uploaded "yesterday" (25 Oct 2026) waiting for review ---
  {
    id: 'b7eebc99-9c0b-4ef8-bb6d-000000000009',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
    vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000005',
    vendorName: 'Asian Paints dealer (City Colours)',
    billNumber: 'CC/2026/1092',
    date: '2026-10-25',
    status: 'to_review', // TO REVIEW
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-10-25T11:45:00.000Z',
    items: [
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000016', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000009', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000001d', materialName: 'Wall putty 20kg', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', quantity: 15, unit: 'bag', rate: 820, amount: 12300, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000017', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-000000000009', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000001e', materialName: 'Primer', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000004', quantity: 20, unit: 'litre', rate: 195, amount: 3900, addToStock: true },
    ],
  },
  {
    id: 'b7eebc99-9c0b-4ef8-bb6d-00000000000a',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
    vendorId: 'e4eebc99-9c0b-4ef8-bb6d-000000000003',
    vendorName: 'Sai Hardware',
    billNumber: 'SH-9012',
    date: '2026-10-25',
    status: 'to_review', // TO REVIEW
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'b1eebc99-9c0b-4ef8-bb6d-000000000003',
    createdAt: '2026-10-25T16:20:00.000Z',
    items: [
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000018', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000a', materialId: 'f5eebc99-9c0b-4ef8-bb6d-00000000000a', materialName: 'Handles – profile', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 24, unit: 'piece', rate: 340, amount: 8160, addToStock: true },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-000000000019', studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', billId: 'b7eebc99-9c0b-4ef8-bb6d-00000000000a', materialId: 'f5eebc99-9c0b-4ef8-bb6d-000000000009', materialName: 'Drawer channels 18"', categoryId: 'd3eebc99-9c0b-4ef8-bb6d-000000000001', quantity: 8, unit: 'pair', rate: 450, amount: 3600, addToStock: true },
    ],
  },
];

/**
 * Progress updates across projects:
 * Notice Kharadi Office's latest update is 22 Oct 2026 (4 days ago).
 */
export const INITIAL_PROGRESS_UPDATES: ProgressUpdate[] = [
  {
    id: 'f1eebc99-9c0b-4ef8-bb6d-000000000001',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
    roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002',
    roomName: 'Kitchen',
    trade: 'carpentry',
    authorId: 'b1eebc99-9c0b-4ef8-bb6d-000000000004',
    authorName: 'Gurmukh Singh',
    date: '2026-10-26T13:30:00.000Z',
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
    date: '2026-10-25T15:00:00.000Z',
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
    date: '2026-10-24T11:30:00.000Z',
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
    date: '2026-10-23T14:00:00.000Z',
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
    date: '2026-10-26T10:00:00.000Z',
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
    date: '2026-10-25T11:00:00.000Z',
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
    date: '2026-10-25T16:00:00.000Z',
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
    date: '2026-10-22T14:30:00.000Z', // 4 days ago
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
    date: '2026-10-22T11:00:00.000Z', // 4 days ago
    status: 'in_progress',
    percentage: 25,
    note: 'Marked workstation switch box drops from ceiling trunking.',
    photos: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    ],
  },
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'a2eebc99-9c0b-4ef8-bb6d-000000000001',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
    roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000002',
    roomName: 'Kitchen',
    type: 'waiting_for_trade',
    description: 'Waiting for electrician before closing kitchen ceiling GI framing',
    reportedBy: 'Rajiv Deshmukh',
    reportedAt: '2026-10-24T16:00:00.000Z',
    status: 'open',
  },
  {
    id: 'a2eebc99-9c0b-4ef8-bb6d-000000000002',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000001',
    roomId: 'a6eebc99-9c0b-4ef8-bb6d-000000000003',
    roomName: 'Master Bedroom',
    type: 'design_question',
    description: 'Customer to confirm laminate shade for master wardrobe shutters',
    reportedBy: 'Gurmukh Singh',
    reportedAt: '2026-10-25T11:30:00.000Z',
    status: 'open',
  },
  {
    id: 'a2eebc99-9c0b-4ef8-bb6d-000000000003',
    studioId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    projectId: 'c2eebc99-9c0b-4ef8-bb6d-000000000002',
    roomId: 'a6eebc99-9c0b-4ef8-bb6d-00000000000b',
    roomName: 'First Floor Lounge',
    type: 'material_missing',
    description: 'Tile adhesive shipment short by 3 bags for terrace skirting',
    reportedBy: 'Santosh Pawar',
    reportedAt: '2026-10-25T14:00:00.000Z',
    status: 'open',
  },
];
