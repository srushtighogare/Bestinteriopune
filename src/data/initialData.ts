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
  id: 'studio-bestinterio-001',
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
    id: 'user-owner',
    studioId: 'studio-bestinterio-001',
    name: 'Megha Jadhav',
    phone: '9822054321',
    role: 'owner',
    assignedProjectIds: ['proj-mehta', 'proj-baner', 'proj-kharadi', 'proj-sinha'],
    status: 'active',
    lastActive: '2026-10-26T15:45:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-manager',
    studioId: 'studio-bestinterio-001',
    name: 'Neha Kulkarni',
    phone: '9822187654',
    role: 'manager',
    assignedProjectIds: ['proj-mehta', 'proj-baner', 'proj-kharadi', 'proj-sinha'],
    status: 'active',
    lastActive: '2026-10-26T14:20:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-supervisor',
    studioId: 'studio-bestinterio-001',
    name: 'Rajiv Deshmukh',
    phone: '9850011223',
    role: 'supervisor',
    assignedProjectIds: ['proj-mehta', 'proj-baner', 'proj-kharadi'],
    status: 'active',
    lastActive: '2026-10-26T14:10:00.000Z',
    pin: '1234',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-carpenter',
    studioId: 'studio-bestinterio-001',
    name: 'Gurmukh Singh',
    phone: '9850022334',
    role: 'worker',
    trade: 'carpentry',
    assignedProjectIds: ['proj-mehta', 'proj-baner'],
    status: 'active',
    lastActive: '2026-10-26T13:30:00.000Z',
    pin: '1472',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-electrician',
    studioId: 'studio-bestinterio-001',
    name: 'Imran Shaikh',
    phone: '9850033445',
    role: 'worker',
    trade: 'electrical',
    assignedProjectIds: ['proj-mehta', 'proj-kharadi'],
    status: 'active',
    lastActive: '2026-10-26T11:00:00.000Z',
    pin: '2580',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-civil',
    studioId: 'studio-bestinterio-001',
    name: 'Santosh Pawar',
    phone: '9850044556',
    role: 'worker',
    trade: 'civil',
    assignedProjectIds: ['proj-baner'],
    status: 'active',
    lastActive: '2026-10-25T17:00:00.000Z',
    pin: '3691',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-painter',
    studioId: 'studio-bestinterio-001',
    name: 'Vijay More',
    phone: '9850055667',
    role: 'worker',
    trade: 'painting',
    assignedProjectIds: ['proj-mehta'],
    status: 'invited',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-carpentry', name: 'Carpentry', order: 1, trade: 'carpentry' },
  { id: 'cat-electrical', name: 'Electrical', order: 2, trade: 'electrical' },
  { id: 'cat-civil', name: 'Civil', order: 3, trade: 'civil' },
  { id: 'cat-painting', name: 'Painting', order: 4, trade: 'painting' },
  { id: 'cat-plumbing', name: 'Plumbing', order: 5, trade: 'plumbing' },
  { id: 'cat-false-ceiling', name: 'False ceiling', order: 6, trade: 'false_ceiling' },
];

export const INITIAL_MATERIALS: Material[] = [
  // Carpentry
  { id: 'mat-ply-18', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Plywood 18mm BWP', unit: 'sheet', lowStockThreshold: 10 },
  { id: 'mat-ply-12', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Plywood 12mm', unit: 'sheet', lowStockThreshold: 8 },
  { id: 'mat-mdf-18', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'MDF 18mm', unit: 'sheet', lowStockThreshold: 5 },
  { id: 'mat-lam-oak', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Laminate 1mm', shadeCode: 'Oak 5512', unit: 'sheet', lowStockThreshold: 6 },
  { id: 'mat-lam-white', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Laminate 1mm', shadeCode: 'White Matte 1101', unit: 'sheet', lowStockThreshold: 6 },
  { id: 'mat-lam-walnut', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Laminate 0.8mm', shadeCode: 'Walnut 7720', unit: 'sheet', lowStockThreshold: 4 },
  { id: 'mat-edgeband', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Edge band tape', unit: 'roll', lowStockThreshold: 5 },
  { id: 'mat-hinges', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Soft-close hinges', unit: 'piece', lowStockThreshold: 10 },
  { id: 'mat-channels', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Drawer channels 18"', unit: 'pair', lowStockThreshold: 6 },
  { id: 'mat-handles', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Handles – profile', unit: 'piece', lowStockThreshold: 15 },
  { id: 'mat-fevicol', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Fevicol SH 5kg', unit: 'tin', lowStockThreshold: 3 },
  { id: 'mat-screws-1-5', studioId: 'studio-bestinterio-001', categoryId: 'cat-carpentry', name: 'Screws 1.5"', unit: 'box', lowStockThreshold: 4 },

  // Electrical
  { id: 'mat-wire-1-5', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'Wire 1.5 sq mm', unit: 'coil', lowStockThreshold: 4 },
  { id: 'mat-wire-2-5', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'Wire 2.5 sq mm', unit: 'coil', lowStockThreshold: 3 },
  { id: 'mat-switch-6a', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'Modular switch 6A', unit: 'piece', lowStockThreshold: 20 },
  { id: 'mat-socket-16a', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'Socket 16A', unit: 'piece', lowStockThreshold: 10 },
  { id: 'mat-switch-plate-4', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'Switch plate 4-module', unit: 'piece', lowStockThreshold: 8 },
  { id: 'mat-led-panel-12w', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'LED panel light 12W', unit: 'piece', lowStockThreshold: 12 },
  { id: 'mat-led-bulb-9w', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'LED bulb 9W', unit: 'piece', lowStockThreshold: 10 },
  { id: 'mat-ceiling-fan', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'Ceiling fan', unit: 'piece', lowStockThreshold: 2 },
  { id: 'mat-profile-light', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'Profile light 1m', unit: 'piece', lowStockThreshold: 8 },
  { id: 'mat-pvc-conduit-25', studioId: 'studio-bestinterio-001', categoryId: 'cat-electrical', name: 'PVC conduit 25mm', unit: 'length', lowStockThreshold: 15 },

  // Civil
  { id: 'mat-cement-50kg', studioId: 'studio-bestinterio-001', categoryId: 'cat-civil', name: 'Cement 50kg', unit: 'bag', lowStockThreshold: 10 },
  { id: 'mat-sand', studioId: 'studio-bestinterio-001', categoryId: 'cat-civil', name: 'Sand', unit: 'brass', lowStockThreshold: 2 },
  { id: 'mat-tile-adhesive', studioId: 'studio-bestinterio-001', categoryId: 'cat-civil', name: 'Tile adhesive', unit: 'bag', lowStockThreshold: 5 },
  { id: 'mat-floor-tiles', studioId: 'studio-bestinterio-001', categoryId: 'cat-civil', name: 'Floor tiles 600×600', unit: 'box', lowStockThreshold: 12 },
  { id: 'mat-wall-tiles', studioId: 'studio-bestinterio-001', categoryId: 'cat-civil', name: 'Wall tiles 300×600', unit: 'box', lowStockThreshold: 12 },
  { id: 'mat-grout', studioId: 'studio-bestinterio-001', categoryId: 'cat-civil', name: 'Grout', unit: 'kg', lowStockThreshold: 8 },

  // Painting
  { id: 'mat-wall-putty', studioId: 'studio-bestinterio-001', categoryId: 'cat-painting', name: 'Wall putty 20kg', unit: 'bag', lowStockThreshold: 6 },
  { id: 'mat-primer', studioId: 'studio-bestinterio-001', categoryId: 'cat-painting', name: 'Primer', unit: 'litre', lowStockThreshold: 10 },
  { id: 'mat-emulsion-white', studioId: 'studio-bestinterio-001', categoryId: 'cat-painting', name: 'Emulsion – white', unit: 'litre', lowStockThreshold: 20 },
  { id: 'mat-emulsion-accent', studioId: 'studio-bestinterio-001', categoryId: 'cat-painting', name: 'Emulsion – accent', unit: 'litre', lowStockThreshold: 10 },

  // Plumbing
  { id: 'mat-cpvc-pipe', studioId: 'studio-bestinterio-001', categoryId: 'cat-plumbing', name: 'CPVC pipe ¾"', unit: 'length', lowStockThreshold: 8 },
  { id: 'mat-basin-mixer', studioId: 'studio-bestinterio-001', categoryId: 'cat-plumbing', name: 'Basin mixer', unit: 'piece', lowStockThreshold: 2 },
  { id: 'mat-health-faucet', studioId: 'studio-bestinterio-001', categoryId: 'cat-plumbing', name: 'Health faucet', unit: 'piece', lowStockThreshold: 3 },

  // False ceiling
  { id: 'mat-gypsum-board', studioId: 'studio-bestinterio-001', categoryId: 'cat-false-ceiling', name: 'Gypsum board', unit: 'sheet', lowStockThreshold: 15 },
  { id: 'mat-gi-channels', studioId: 'studio-bestinterio-001', categoryId: 'cat-false-ceiling', name: 'GI channels', unit: 'piece', lowStockThreshold: 20 },
  { id: 'mat-ceiling-screws', studioId: 'studio-bestinterio-001', categoryId: 'cat-false-ceiling', name: 'Ceiling screws', unit: 'box', lowStockThreshold: 5 },
];

export const INITIAL_VENDORS: Vendor[] = [
  { id: 'ven-shree-ply', studioId: 'studio-bestinterio-001', name: 'Shree Plywood & Laminates', category: 'Carpentry', phone: '98220 11990' },
  { id: 'ven-om-elec', studioId: 'studio-bestinterio-001', name: 'Om Electricals', category: 'Electrical', phone: '98220 22880' },
  { id: 'ven-sai-hard', studioId: 'studio-bestinterio-001', name: 'Sai Hardware', category: 'Hardware', phone: '98220 33770' },
  { id: 'ven-mahalaxmi-cem', studioId: 'studio-bestinterio-001', name: 'Mahalaxmi Cement Depot', category: 'Civil', phone: '98220 44660' },
  { id: 'ven-city-colours', studioId: 'studio-bestinterio-001', name: 'Asian Paints dealer (City Colours)', category: 'Painting', phone: '98220 55550' },
  { id: 'ven-aqua-bath', studioId: 'studio-bestinterio-001', name: 'Jaquar dealer (Aqua Bath Studio)', category: 'Plumbing', phone: '98220 66440' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-mehta',
    studioId: 'studio-bestinterio-001',
    name: 'Mehta Residence',
    customerName: 'Anil & Priya Mehta',
    address: 'Flat 902, Tower B, Panchshil Towers, Kharadi, Pune',
    type: 'apartment',
    status: 'active',
    startDate: '2026-09-01',
    targetDate: '2026-12-15',
    budget: 1800000,
    supervisorId: 'user-supervisor',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    currentFocus: 'Kitchen carpentry & bedroom wardrobes',
    tradesInScope: ['civil', 'electrical', 'carpentry', 'false_ceiling', 'painting', 'plumbing'],
    rooms: [
      { id: 'room-m-living', name: 'Living & Dining', order: 1 },
      { id: 'room-m-kitchen', name: 'Kitchen', order: 2 },
      { id: 'room-m-master', name: 'Master Bedroom', order: 3 },
      { id: 'room-m-kids', name: 'Kids Bedroom', order: 4 },
      { id: 'room-m-guest', name: 'Guest Bedroom', order: 5 },
      { id: 'room-m-balcony', name: 'Balcony', order: 6 },
    ],
  },
  {
    id: 'proj-baner',
    studioId: 'studio-bestinterio-001',
    name: 'Baner Villa',
    customerName: 'Sharma family',
    address: 'Plot 44, Beverly Hills, Baner-Pashan Link Road, Pune',
    type: 'villa',
    status: 'active',
    startDate: '2026-08-10',
    targetDate: '2027-01-30',
    budget: 4200000,
    supervisorId: 'user-supervisor',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    currentFocus: 'Electrical conduits & ground floor civil finishing',
    tradesInScope: ['civil', 'electrical', 'plumbing', 'false_ceiling', 'carpentry', 'painting'],
    rooms: [
      { id: 'room-b-living', name: 'Foyer & Living', order: 1 },
      { id: 'room-b-kitchen', name: 'Kitchen & Dining', order: 2 },
      { id: 'room-b-master', name: 'Master Suite', order: 3 },
      { id: 'room-b-guest1', name: 'Ground Guest Room', order: 4 },
      { id: 'room-b-lounge', name: 'First Floor Lounge', order: 5 },
      { id: 'room-b-bed2', name: 'Children Suite', order: 6 },
      { id: 'room-b-terrace', name: 'Terrace & Deck', order: 7 },
    ],
  },
  {
    id: 'proj-kharadi',
    studioId: 'studio-bestinterio-001',
    name: 'Kharadi Office',
    customerName: 'Lumen Analytics',
    address: '6th Floor, World Trade Center, Tower 3, Kharadi, Pune',
    type: 'office',
    status: 'active',
    startDate: '2026-10-01',
    targetDate: '2026-11-20',
    budget: 1200000,
    supervisorId: 'user-supervisor',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    currentFocus: 'Demolition & floor marking',
    tradesInScope: ['civil', 'electrical', 'false_ceiling', 'carpentry', 'painting'],
    rooms: [
      { id: 'room-k-reception', name: 'Reception & Waiting', order: 1 },
      { id: 'room-k-hall', name: 'Open Work Hall', order: 2 },
      { id: 'room-k-conf', name: 'Conference Room', order: 3 },
      { id: 'room-k-cabin1', name: 'Executive Cabin 1', order: 4 },
      { id: 'room-k-cabin2', name: 'Executive Cabin 2', order: 5 },
      { id: 'room-k-pantry', name: 'Pantry & Breakout', order: 6 },
    ],
  },
  {
    id: 'proj-sinha',
    studioId: 'studio-bestinterio-001',
    name: 'Sinha Apartment',
    customerName: 'Vikram & Radhika Sinha',
    address: 'Flat 403, Rohan Tarang, Wakad, Pune',
    type: 'apartment',
    status: 'completed',
    startDate: '2026-05-01',
    targetDate: '2026-08-20',
    budget: 1400000,
    supervisorId: 'user-supervisor',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    tradesInScope: ['civil', 'electrical', 'carpentry', 'false_ceiling', 'painting', 'plumbing'],
    rooms: [
      { id: 'room-s-living', name: 'Living Room', order: 1 },
      { id: 'room-s-master', name: 'Master Bedroom', order: 2 },
      { id: 'room-s-guest', name: 'Guest Bedroom', order: 3 },
      { id: 'room-s-kitchen', name: 'Kitchen', order: 4 },
      { id: 'room-s-balcony', name: 'Balcony', order: 5 },
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
  { id: 'c-m-1', projectId: 'proj-mehta', roomId: 'room-m-living', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-20T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-2', projectId: 'proj-mehta', roomId: 'room-m-living', trade: 'electrical', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-24T11:30:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-m-3', projectId: 'proj-mehta', roomId: 'room-m-living', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: '2026-10-15T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-4', projectId: 'proj-mehta', roomId: 'room-m-living', trade: 'carpentry', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-26T12:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c-m-5', projectId: 'proj-mehta', roomId: 'room-m-living', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c-m-6', projectId: 'proj-mehta', roomId: 'room-m-living', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-18T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Kitchen
  { id: 'c-m-7', projectId: 'proj-mehta', roomId: 'room-m-kitchen', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-22T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-8', projectId: 'proj-mehta', roomId: 'room-m-kitchen', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-25T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-9', projectId: 'proj-mehta', roomId: 'room-m-kitchen', trade: 'electrical', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-23T14:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-m-10', projectId: 'proj-mehta', roomId: 'room-m-kitchen', trade: 'false_ceiling', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-20T17:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-11', projectId: 'proj-mehta', roomId: 'room-m-kitchen', trade: 'carpentry', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-26T13:30:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c-m-12', projectId: 'proj-mehta', roomId: 'room-m-kitchen', trade: 'painting', status: 'not_started', percentage: 0 },

  // Master Bedroom
  { id: 'c-m-13', projectId: 'proj-mehta', roomId: 'room-m-master', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-24T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-14', projectId: 'proj-mehta', roomId: 'room-m-master', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-22T16:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-m-15', projectId: 'proj-mehta', roomId: 'room-m-master', trade: 'false_ceiling', status: 'done', percentage: 100, lastUpdated: '2026-10-18T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-16', projectId: 'proj-mehta', roomId: 'room-m-master', trade: 'carpentry', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-25T15:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c-m-17', projectId: 'proj-mehta', roomId: 'room-m-master', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c-m-18', projectId: 'proj-mehta', roomId: 'room-m-master', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-26T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Kids Bedroom
  { id: 'c-m-19', projectId: 'proj-mehta', roomId: 'room-m-kids', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-26T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-20', projectId: 'proj-mehta', roomId: 'room-m-kids', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-21T10:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-m-21', projectId: 'proj-mehta', roomId: 'room-m-kids', trade: 'false_ceiling', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-19T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-22', projectId: 'proj-mehta', roomId: 'room-m-kids', trade: 'carpentry', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-24T16:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c-m-23', projectId: 'proj-mehta', roomId: 'room-m-kids', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c-m-24', projectId: 'proj-mehta', roomId: 'room-m-kids', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-28T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Guest Bedroom
  { id: 'c-m-25', projectId: 'proj-mehta', roomId: 'room-m-guest', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-28T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-26', projectId: 'proj-mehta', roomId: 'room-m-guest', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-20T14:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-m-27', projectId: 'proj-mehta', roomId: 'room-m-guest', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-m-28', projectId: 'proj-mehta', roomId: 'room-m-guest', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-m-29', projectId: 'proj-mehta', roomId: 'room-m-guest', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c-m-30', projectId: 'proj-mehta', roomId: 'room-m-guest', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-30T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // Balcony
  { id: 'c-m-31', projectId: 'proj-mehta', roomId: 'room-m-balcony', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-10-02T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-m-32', projectId: 'proj-mehta', roomId: 'room-m-balcony', trade: 'electrical', status: 'done', percentage: 100, lastUpdated: '2026-10-18T14:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-m-33', projectId: 'proj-mehta', roomId: 'room-m-balcony', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-m-34', projectId: 'proj-mehta', roomId: 'room-m-balcony', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-m-35', projectId: 'proj-mehta', roomId: 'room-m-balcony', trade: 'painting', status: 'not_started', percentage: 0 },
  { id: 'c-m-36', projectId: 'proj-mehta', roomId: 'room-m-balcony', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-04T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },

  // --- Baner Villa (~40% progress) ---
  { id: 'c-b-1', projectId: 'proj-baner', roomId: 'room-b-living', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-15T10:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c-b-2', projectId: 'proj-baner', roomId: 'room-b-living', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-18T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-3', projectId: 'proj-baner', roomId: 'room-b-living', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-25T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-4', projectId: 'proj-baner', roomId: 'room-b-living', trade: 'false_ceiling', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-23T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-5', projectId: 'proj-baner', roomId: 'room-b-living', trade: 'carpentry', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-26T10:00:00.000Z', lastUpdatedBy: 'Gurmukh Singh' },
  { id: 'c-b-6', projectId: 'proj-baner', roomId: 'room-b-living', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-b-7', projectId: 'proj-baner', roomId: 'room-b-kitchen', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-20T10:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c-b-8', projectId: 'proj-baner', roomId: 'room-b-kitchen', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-09-25T12:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-9', projectId: 'proj-baner', roomId: 'room-b-kitchen', trade: 'electrical', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-24T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-10', projectId: 'proj-baner', roomId: 'room-b-kitchen', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-b-11', projectId: 'proj-baner', roomId: 'room-b-kitchen', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-b-12', projectId: 'proj-baner', roomId: 'room-b-kitchen', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-b-13', projectId: 'proj-baner', roomId: 'room-b-master', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-09-28T14:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c-b-14', projectId: 'proj-baner', roomId: 'room-b-master', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-02T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-15', projectId: 'proj-baner', roomId: 'room-b-master', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-22T14:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-16', projectId: 'proj-baner', roomId: 'room-b-master', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-b-17', projectId: 'proj-baner', roomId: 'room-b-master', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-b-18', projectId: 'proj-baner', roomId: 'room-b-master', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-b-19', projectId: 'proj-baner', roomId: 'room-b-guest1', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-10-05T12:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c-b-20', projectId: 'proj-baner', roomId: 'room-b-guest1', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-08T15:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-21', projectId: 'proj-baner', roomId: 'room-b-guest1', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-20T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-22', projectId: 'proj-baner', roomId: 'room-b-guest1', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-b-23', projectId: 'proj-baner', roomId: 'room-b-guest1', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-b-24', projectId: 'proj-baner', roomId: 'room-b-guest1', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-b-25', projectId: 'proj-baner', roomId: 'room-b-lounge', trade: 'civil', status: 'in_progress', percentage: 75, lastUpdated: '2026-10-25T16:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c-b-26', projectId: 'proj-baner', roomId: 'room-b-lounge', trade: 'plumbing', status: 'not_started', percentage: 0 },
  { id: 'c-b-27', projectId: 'proj-baner', roomId: 'room-b-lounge', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c-b-28', projectId: 'proj-baner', roomId: 'room-b-lounge', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-b-29', projectId: 'proj-baner', roomId: 'room-b-lounge', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-b-30', projectId: 'proj-baner', roomId: 'room-b-lounge', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-b-31', projectId: 'proj-baner', roomId: 'room-b-bed2', trade: 'civil', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-24T12:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c-b-32', projectId: 'proj-baner', roomId: 'room-b-bed2', trade: 'plumbing', status: 'not_started', percentage: 0 },
  { id: 'c-b-33', projectId: 'proj-baner', roomId: 'room-b-bed2', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c-b-34', projectId: 'proj-baner', roomId: 'room-b-bed2', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-b-35', projectId: 'proj-baner', roomId: 'room-b-bed2', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-b-36', projectId: 'proj-baner', roomId: 'room-b-bed2', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-b-37', projectId: 'proj-baner', roomId: 'room-b-terrace', trade: 'civil', status: 'done', percentage: 100, lastUpdated: '2026-10-12T16:00:00.000Z', lastUpdatedBy: 'Santosh Pawar' },
  { id: 'c-b-38', projectId: 'proj-baner', roomId: 'room-b-terrace', trade: 'plumbing', status: 'done', percentage: 100, lastUpdated: '2026-10-14T11:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-b-39', projectId: 'proj-baner', roomId: 'room-b-terrace', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c-b-40', projectId: 'proj-baner', roomId: 'room-b-terrace', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-b-41', projectId: 'proj-baner', roomId: 'room-b-terrace', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-b-42', projectId: 'proj-baner', roomId: 'room-b-terrace', trade: 'painting', status: 'not_started', percentage: 0 },

  // --- Kharadi Office (~15% progress, no update for 4 days since 22 Oct) ---
  { id: 'c-k-1', projectId: 'proj-kharadi', roomId: 'room-k-reception', trade: 'civil', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-21T10:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-k-2', projectId: 'proj-kharadi', roomId: 'room-k-reception', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-22T14:30:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-k-3', projectId: 'proj-kharadi', roomId: 'room-k-reception', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-k-4', projectId: 'proj-kharadi', roomId: 'room-k-reception', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-k-5', projectId: 'proj-kharadi', roomId: 'room-k-reception', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-k-6', projectId: 'proj-kharadi', roomId: 'room-k-hall', trade: 'civil', status: 'in_progress', percentage: 50, lastUpdated: '2026-10-20T16:00:00.000Z', lastUpdatedBy: 'Rajiv Deshmukh' },
  { id: 'c-k-7', projectId: 'proj-kharadi', roomId: 'room-k-hall', trade: 'electrical', status: 'in_progress', percentage: 25, lastUpdated: '2026-10-22T11:00:00.000Z', lastUpdatedBy: 'Imran Shaikh' },
  { id: 'c-k-8', projectId: 'proj-kharadi', roomId: 'room-k-hall', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-k-9', projectId: 'proj-kharadi', roomId: 'room-k-hall', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-k-10', projectId: 'proj-kharadi', roomId: 'room-k-hall', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-k-11', projectId: 'proj-kharadi', roomId: 'room-k-conf', trade: 'civil', status: 'not_started', percentage: 0 },
  { id: 'c-k-12', projectId: 'proj-kharadi', roomId: 'room-k-conf', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c-k-13', projectId: 'proj-kharadi', roomId: 'room-k-conf', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-k-14', projectId: 'proj-kharadi', roomId: 'room-k-conf', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-k-15', projectId: 'proj-kharadi', roomId: 'room-k-conf', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-k-16', projectId: 'proj-kharadi', roomId: 'room-k-cabin1', trade: 'civil', status: 'not_started', percentage: 0 },
  { id: 'c-k-17', projectId: 'proj-kharadi', roomId: 'room-k-cabin1', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c-k-18', projectId: 'proj-kharadi', roomId: 'room-k-cabin1', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-k-19', projectId: 'proj-kharadi', roomId: 'room-k-cabin1', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-k-20', projectId: 'proj-kharadi', roomId: 'room-k-cabin1', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-k-21', projectId: 'proj-kharadi', roomId: 'room-k-cabin2', trade: 'civil', status: 'not_started', percentage: 0 },
  { id: 'c-k-22', projectId: 'proj-kharadi', roomId: 'room-k-cabin2', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c-k-23', projectId: 'proj-kharadi', roomId: 'room-k-cabin2', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-k-24', projectId: 'proj-kharadi', roomId: 'room-k-cabin2', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-k-25', projectId: 'proj-kharadi', roomId: 'room-k-cabin2', trade: 'painting', status: 'not_started', percentage: 0 },

  { id: 'c-k-26', projectId: 'proj-kharadi', roomId: 'room-k-pantry', trade: 'civil', status: 'not_started', percentage: 0 },
  { id: 'c-k-27', projectId: 'proj-kharadi', roomId: 'room-k-pantry', trade: 'electrical', status: 'not_started', percentage: 0 },
  { id: 'c-k-28', projectId: 'proj-kharadi', roomId: 'room-k-pantry', trade: 'false_ceiling', status: 'not_started', percentage: 0 },
  { id: 'c-k-29', projectId: 'proj-kharadi', roomId: 'room-k-pantry', trade: 'carpentry', status: 'not_started', percentage: 0 },
  { id: 'c-k-30', projectId: 'proj-kharadi', roomId: 'room-k-pantry', trade: 'painting', status: 'not_started', percentage: 0 },

  // --- Sinha Apartment (100% completed) ---
  { id: 'c-s-1', projectId: 'proj-sinha', roomId: 'room-s-living', trade: 'civil', status: 'done', percentage: 100 },
  { id: 'c-s-2', projectId: 'proj-sinha', roomId: 'room-s-living', trade: 'electrical', status: 'done', percentage: 100 },
  { id: 'c-s-3', projectId: 'proj-sinha', roomId: 'room-s-living', trade: 'carpentry', status: 'done', percentage: 100 },
  { id: 'c-s-4', projectId: 'proj-sinha', roomId: 'room-s-living', trade: 'false_ceiling', status: 'done', percentage: 100 },
  { id: 'c-s-5', projectId: 'proj-sinha', roomId: 'room-s-living', trade: 'painting', status: 'done', percentage: 100 },
  { id: 'c-s-6', projectId: 'proj-sinha', roomId: 'room-s-living', trade: 'plumbing', status: 'done', percentage: 100 },
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
  { id: 'mov-m-1', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-lam-oak', type: 'received', quantity: 12, billId: 'bill-001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'mov-m-2', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-lam-oak', type: 'used', quantity: 6, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-m-kitchen', roomName: 'Kitchen', date: '2026-10-18T14:00:00.000Z' },
  { id: 'mov-m-3', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-lam-oak', type: 'used', quantity: 6, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-m-master', roomName: 'Master Bedroom', date: '2026-10-24T16:00:00.000Z' },

  // Soft-close hinges: received 40 from Bill 1, used 31 -> 9 left (threshold 10)
  { id: 'mov-m-4', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-hinges', type: 'received', quantity: 40, billId: 'bill-001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'mov-m-5', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-hinges', type: 'used', quantity: 20, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-m-kitchen', roomName: 'Kitchen', date: '2026-10-20T11:00:00.000Z' },
  { id: 'mov-m-6', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-hinges', type: 'used', quantity: 11, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-m-master', roomName: 'Master Bedroom', date: '2026-10-25T15:30:00.000Z' },

  // Plywood 18mm: received 30 from Bill 1 & Bill 3, used 18 -> 12 left
  { id: 'mov-m-7', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-ply-18', type: 'received', quantity: 20, billId: 'bill-001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'mov-m-8', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-ply-18', type: 'received', quantity: 10, billId: 'bill-003', workerName: 'Rajiv Deshmukh', date: '2026-10-05T11:00:00.000Z' },
  { id: 'mov-m-9', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-ply-18', type: 'used', quantity: 12, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-m-kitchen', roomName: 'Kitchen', date: '2026-10-12T16:00:00.000Z' },
  { id: 'mov-m-10', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-ply-18', type: 'used', quantity: 6, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-m-master', roomName: 'Master Bedroom', date: '2026-10-22T10:00:00.000Z' },

  // Wire 1.5 sq mm: received 8, used 4 -> 4 left
  { id: 'mov-m-11', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-wire-1-5', type: 'received', quantity: 8, billId: 'bill-002', workerName: 'Rajiv Deshmukh', date: '2026-09-15T12:00:00.000Z' },
  { id: 'mov-m-12', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-wire-1-5', type: 'used', quantity: 4, workerId: 'user-electrician', workerName: 'Imran Shaikh', roomId: 'room-m-living', roomName: 'Living & Dining', date: '2026-10-21T14:00:00.000Z' },

  // Fevicol SH 5kg: received 6, used 4 -> 2 left (threshold 3) -> Running low
  { id: 'mov-m-13', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-fevicol', type: 'received', quantity: 6, billId: 'bill-001', workerName: 'Rajiv Deshmukh', date: '2026-09-12T10:00:00.000Z' },
  { id: 'mov-m-14', studioId: 'studio-bestinterio-001', projectId: 'proj-mehta', materialId: 'mat-fevicol', type: 'used', quantity: 4, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-m-kitchen', roomName: 'Kitchen', date: '2026-10-23T11:00:00.000Z' },

  // --- Baner Villa ---
  // Wire 2.5 sq mm: received 10, used 7 -> 3 left (threshold 3) -> Running low
  { id: 'mov-b-1', studioId: 'studio-bestinterio-001', projectId: 'proj-baner', materialId: 'mat-wire-2-5', type: 'received', quantity: 10, billId: 'bill-005', workerName: 'Rajiv Deshmukh', date: '2026-09-10T11:00:00.000Z' },
  { id: 'mov-b-2', studioId: 'studio-bestinterio-001', projectId: 'proj-baner', materialId: 'mat-wire-2-5', type: 'used', quantity: 7, workerId: 'user-supervisor', workerName: 'Rajiv Deshmukh', roomId: 'room-b-living', roomName: 'Foyer & Living', date: '2026-10-22T15:00:00.000Z' },

  // Cement: received 60, used 52 -> 8 left (threshold 10) -> Running low
  { id: 'mov-b-3', studioId: 'studio-bestinterio-001', projectId: 'proj-baner', materialId: 'mat-cement-50kg', type: 'received', quantity: 60, billId: 'bill-004', workerName: 'Rajiv Deshmukh', date: '2026-08-20T10:00:00.000Z' },
  { id: 'mov-b-4', studioId: 'studio-bestinterio-001', projectId: 'proj-baner', materialId: 'mat-cement-50kg', type: 'used', quantity: 52, workerId: 'user-civil', workerName: 'Santosh Pawar', roomId: 'room-b-living', roomName: 'Foyer & Living', date: '2026-10-24T17:00:00.000Z' },

  // Hinges overuse at Baner Villa: received 10, but Gurmukh logged using 13! (3 overused alert)
  { id: 'mov-b-5', studioId: 'studio-bestinterio-001', projectId: 'proj-baner', materialId: 'mat-hinges', type: 'received', quantity: 10, billId: 'bill-007', workerName: 'Rajiv Deshmukh', date: '2026-10-10T12:00:00.000Z' },
  { id: 'mov-b-6', studioId: 'studio-bestinterio-001', projectId: 'proj-baner', materialId: 'mat-hinges', type: 'used', quantity: 13, workerId: 'user-carpenter', workerName: 'Gurmukh Singh', roomId: 'room-b-living', roomName: 'Foyer & Living', date: '2026-10-26T09:30:00.000Z' },

  // --- Kharadi Office ---
  // PVC Conduit 25mm: received 30, used 10 -> 20 left
  { id: 'mov-k-1', studioId: 'studio-bestinterio-001', projectId: 'proj-kharadi', materialId: 'mat-pvc-conduit-25', type: 'received', quantity: 30, billId: 'bill-008', workerName: 'Rajiv Deshmukh', date: '2026-10-12T14:00:00.000Z' },
  { id: 'mov-k-2', studioId: 'studio-bestinterio-001', projectId: 'proj-kharadi', materialId: 'mat-pvc-conduit-25', type: 'used', quantity: 10, workerId: 'user-electrician', workerName: 'Imran Shaikh', roomId: 'room-k-hall', roomName: 'Open Work Hall', date: '2026-10-22T10:00:00.000Z' },
];

/**
 * Bills (10–14 realistic bills with Indian GST items):
 * Two bills uploaded "yesterday" (25 Oct 2026) with status 'to_review'.
 */
export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-001',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    vendorId: 'ven-shree-ply',
    vendorName: 'Shree Plywood & Laminates',
    billNumber: 'SPL/26/0481',
    date: '2026-09-12',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-09-12T11:20:00.000Z',
    items: [
      { id: 'bi-1', billId: 'bill-001', materialId: 'mat-ply-18', materialName: 'Plywood 18mm BWP', categoryId: 'cat-carpentry', quantity: 20, unit: 'sheet', rate: 2800, amount: 56000, addToStock: true },
      { id: 'bi-2', billId: 'bill-001', materialId: 'mat-lam-oak', materialName: 'Laminate 1mm (Oak 5512)', categoryId: 'cat-carpentry', quantity: 12, unit: 'sheet', rate: 1450, amount: 17400, addToStock: true },
      { id: 'bi-3', billId: 'bill-001', materialId: 'mat-hinges', materialName: 'Soft-close hinges', categoryId: 'cat-carpentry', quantity: 40, unit: 'piece', rate: 180, amount: 7200, addToStock: true },
      { id: 'bi-4', billId: 'bill-001', materialId: 'mat-fevicol', materialName: 'Fevicol SH 5kg', categoryId: 'cat-carpentry', quantity: 6, unit: 'tin', rate: 1250, amount: 7500, addToStock: true },
    ],
  },
  {
    id: 'bill-002',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    vendorId: 'ven-om-elec',
    vendorName: 'Om Electricals',
    billNumber: 'OM/SEP/112',
    date: '2026-09-15',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-09-15T14:15:00.000Z',
    items: [
      { id: 'bi-5', billId: 'bill-002', materialId: 'mat-wire-1-5', materialName: 'Wire 1.5 sq mm', categoryId: 'cat-electrical', quantity: 8, unit: 'coil', rate: 1650, amount: 13200, addToStock: true },
      { id: 'bi-6', billId: 'bill-002', materialId: 'mat-pvc-conduit-25', materialName: 'PVC conduit 25mm', categoryId: 'cat-electrical', quantity: 25, unit: 'length', rate: 140, amount: 3500, addToStock: true },
    ],
  },
  {
    id: 'bill-003',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    vendorId: 'ven-shree-ply',
    vendorName: 'Shree Plywood & Laminates',
    billNumber: 'SPL/26/0590',
    date: '2026-10-05',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-10-05T16:00:00.000Z',
    items: [
      { id: 'bi-7', billId: 'bill-003', materialId: 'mat-ply-18', materialName: 'Plywood 18mm BWP', categoryId: 'cat-carpentry', quantity: 10, unit: 'sheet', rate: 2800, amount: 28000, addToStock: true },
      { id: 'bi-8', billId: 'bill-003', materialId: 'mat-ply-12', materialName: 'Plywood 12mm', categoryId: 'cat-carpentry', quantity: 15, unit: 'sheet', rate: 2100, amount: 31500, addToStock: true },
      { id: 'bi-9', billId: 'bill-003', materialId: 'mat-channels', materialName: 'Drawer channels 18"', categoryId: 'cat-carpentry', quantity: 12, unit: 'pair', rate: 450, amount: 5400, addToStock: true },
    ],
  },
  {
    id: 'bill-004',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    vendorId: 'ven-mahalaxmi-cem',
    vendorName: 'Mahalaxmi Cement Depot',
    billNumber: 'MCD-994',
    date: '2026-08-20',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-08-20T11:00:00.000Z',
    items: [
      { id: 'bi-10', billId: 'bill-004', materialId: 'mat-cement-50kg', materialName: 'Cement 50kg', categoryId: 'cat-civil', quantity: 60, unit: 'bag', rate: 400, amount: 24000, addToStock: true },
      { id: 'bi-11', billId: 'bill-004', materialId: 'mat-sand', materialName: 'Sand', categoryId: 'cat-civil', quantity: 3, unit: 'brass', rate: 7500, amount: 22500, addToStock: true },
    ],
  },
  {
    id: 'bill-005',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    vendorId: 'ven-om-elec',
    vendorName: 'Om Electricals',
    billNumber: 'OM/SEP/089',
    date: '2026-09-10',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-09-10T12:00:00.000Z',
    items: [
      { id: 'bi-12', billId: 'bill-005', materialId: 'mat-wire-2-5', materialName: 'Wire 2.5 sq mm', categoryId: 'cat-electrical', quantity: 10, unit: 'coil', rate: 2300, amount: 23000, addToStock: true },
      { id: 'bi-13', billId: 'bill-005', materialId: 'mat-switch-6a', materialName: 'Modular switch 6A', categoryId: 'cat-electrical', quantity: 40, unit: 'piece', rate: 85, amount: 3400, addToStock: true },
      { id: 'bi-14', billId: 'bill-005', materialId: 'mat-socket-16a', materialName: 'Socket 16A', categoryId: 'cat-electrical', quantity: 15, unit: 'piece', rate: 160, amount: 2400, addToStock: true },
    ],
  },
  {
    id: 'bill-006',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    vendorId: 'ven-aqua-bath',
    vendorName: 'Jaquar dealer (Aqua Bath Studio)',
    billNumber: 'ABS/2026/304',
    date: '2026-09-28',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-09-28T15:40:00.000Z',
    items: [
      { id: 'bi-15', billId: 'bill-006', materialId: 'mat-cpvc-pipe', materialName: 'CPVC pipe ¾"', categoryId: 'cat-plumbing', quantity: 20, unit: 'length', rate: 320, amount: 6400, addToStock: true },
      { id: 'bi-16', billId: 'bill-006', materialId: 'mat-basin-mixer', materialName: 'Basin mixer', categoryId: 'cat-plumbing', quantity: 4, unit: 'piece', rate: 3850, amount: 15400, addToStock: true },
      { id: 'bi-17', billId: 'bill-006', materialId: 'mat-health-faucet', materialName: 'Health faucet', categoryId: 'cat-plumbing', quantity: 5, unit: 'piece', rate: 1200, amount: 6000, addToStock: true },
    ],
  },
  {
    id: 'bill-007',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    vendorId: 'ven-sai-hard',
    vendorName: 'Sai Hardware',
    billNumber: 'SH-8819',
    date: '2026-10-10',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-10-10T13:00:00.000Z',
    items: [
      { id: 'bi-18', billId: 'bill-007', materialId: 'mat-hinges', materialName: 'Soft-close hinges', categoryId: 'cat-carpentry', quantity: 10, unit: 'piece', rate: 180, amount: 1800, addToStock: true },
      { id: 'bi-19', billId: 'bill-007', materialId: 'mat-screws-1-5', materialName: 'Screws 1.5"', categoryId: 'cat-carpentry', quantity: 8, unit: 'box', rate: 220, amount: 1760, addToStock: true },
    ],
  },
  {
    id: 'bill-008',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-kharadi',
    vendorId: 'ven-om-elec',
    vendorName: 'Om Electricals',
    billNumber: 'OM/OCT/044',
    date: '2026-10-12',
    status: 'reviewed',
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-10-12T15:00:00.000Z',
    items: [
      { id: 'bi-20', billId: 'bill-008', materialId: 'mat-pvc-conduit-25', materialName: 'PVC conduit 25mm', categoryId: 'cat-electrical', quantity: 30, unit: 'length', rate: 140, amount: 4200, addToStock: true },
      { id: 'bi-21', billId: 'bill-008', materialId: 'mat-wire-1-5', materialName: 'Wire 1.5 sq mm', categoryId: 'cat-electrical', quantity: 6, unit: 'coil', rate: 1650, amount: 9900, addToStock: true },
    ],
  },

  // --- Two bills uploaded "yesterday" (25 Oct 2026) waiting for review ---
  {
    id: 'bill-009',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    vendorId: 'ven-city-colours',
    vendorName: 'Asian Paints dealer (City Colours)',
    billNumber: 'CC/2026/1092',
    date: '2026-10-25',
    status: 'to_review', // TO REVIEW
    photoUrl: '/bills/bill-sample-1.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-10-25T11:45:00.000Z',
    items: [
      { id: 'bi-22', billId: 'bill-009', materialId: 'mat-wall-putty', materialName: 'Wall putty 20kg', categoryId: 'cat-painting', quantity: 15, unit: 'bag', rate: 820, amount: 12300, addToStock: true },
      { id: 'bi-23', billId: 'bill-009', materialId: 'mat-primer', materialName: 'Primer', categoryId: 'cat-painting', quantity: 20, unit: 'litre', rate: 195, amount: 3900, addToStock: true },
    ],
  },
  {
    id: 'bill-010',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    vendorId: 'ven-sai-hard',
    vendorName: 'Sai Hardware',
    billNumber: 'SH-9012',
    date: '2026-10-25',
    status: 'to_review', // TO REVIEW
    photoUrl: '/bills/bill-sample-2.svg',
    uploadedBy: 'Rajiv Deshmukh',
    uploadedById: 'user-supervisor',
    createdAt: '2026-10-25T16:20:00.000Z',
    items: [
      { id: 'bi-24', billId: 'bill-010', materialId: 'mat-handles', materialName: 'Handles – profile', categoryId: 'cat-carpentry', quantity: 24, unit: 'piece', rate: 340, amount: 8160, addToStock: true },
      { id: 'bi-25', billId: 'bill-010', materialId: 'mat-channels', materialName: 'Drawer channels 18"', categoryId: 'cat-carpentry', quantity: 8, unit: 'pair', rate: 450, amount: 3600, addToStock: true },
    ],
  },
];

/**
 * Progress updates across projects:
 * Notice Kharadi Office's latest update is 22 Oct 2026 (4 days ago).
 */
export const INITIAL_PROGRESS_UPDATES: ProgressUpdate[] = [
  {
    id: 'upd-01',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    roomId: 'room-m-kitchen',
    roomName: 'Kitchen',
    trade: 'carpentry',
    authorId: 'user-carpenter',
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
    id: 'upd-02',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    roomId: 'room-m-master',
    roomName: 'Master Bedroom',
    trade: 'carpentry',
    authorId: 'user-carpenter',
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
    id: 'upd-03',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    roomId: 'room-m-living',
    roomName: 'Living & Dining',
    trade: 'electrical',
    authorId: 'user-electrician',
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
    id: 'upd-04',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    roomId: 'room-m-kitchen',
    roomName: 'Kitchen',
    trade: 'electrical',
    authorId: 'user-electrician',
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
    id: 'upd-05',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    roomId: 'room-b-living',
    roomName: 'Foyer & Living',
    trade: 'carpentry',
    authorId: 'user-carpenter',
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
    id: 'upd-06',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    roomId: 'room-b-living',
    roomName: 'Foyer & Living',
    trade: 'electrical',
    authorId: 'user-supervisor',
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
    id: 'upd-07',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    roomId: 'room-b-lounge',
    roomName: 'First Floor Lounge',
    trade: 'civil',
    authorId: 'user-civil',
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
    id: 'upd-08',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-kharadi',
    roomId: 'room-k-reception',
    roomName: 'Reception & Waiting',
    trade: 'electrical',
    authorId: 'user-electrician',
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
    id: 'upd-09',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-kharadi',
    roomId: 'room-k-hall',
    roomName: 'Open Work Hall',
    trade: 'electrical',
    authorId: 'user-electrician',
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
    id: 'iss-01',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    roomId: 'room-m-kitchen',
    roomName: 'Kitchen',
    type: 'waiting_for_trade',
    description: 'Waiting for electrician before closing kitchen ceiling GI framing',
    reportedBy: 'Rajiv Deshmukh',
    reportedAt: '2026-10-24T16:00:00.000Z',
    status: 'open',
  },
  {
    id: 'iss-02',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-mehta',
    roomId: 'room-m-master',
    roomName: 'Master Bedroom',
    type: 'design_question',
    description: 'Customer to confirm laminate shade for master wardrobe shutters',
    reportedBy: 'Gurmukh Singh',
    reportedAt: '2026-10-25T11:30:00.000Z',
    status: 'open',
  },
  {
    id: 'iss-03',
    studioId: 'studio-bestinterio-001',
    projectId: 'proj-baner',
    roomId: 'room-b-lounge',
    roomName: 'First Floor Lounge',
    type: 'material_missing',
    description: 'Tile adhesive shipment short by 3 bags for terrace skirting',
    reportedBy: 'Santosh Pawar',
    reportedAt: '2026-10-25T14:00:00.000Z',
    status: 'open',
  },
];
