import { 
  Bill, 
  Material, 
  MaterialStockBalance, 
  ProgressUpdate, 
  Project, 
  ScopeGridCell, 
  StockLevelStatus, 
  StockMovement 
} from '../types';

export const TODAY_BASELINE = new Date();
export const getTodayBaseline = (): Date => new Date();

/**
 * Computes the stock balance for a material at a specific site (or across all sites).
 */
export function computeMaterialStockBalance(
  material: Material,
  movements: StockMovement[],
  projectId?: string
): MaterialStockBalance {
  // Filter movements for this material and optional project
  const relevantMovements = movements.filter(m => {
    const matchesMaterial = m.materialId === material.id;
    const matchesProject = !projectId || m.projectId === projectId;
    return matchesMaterial && matchesProject;
  });

  let received = 0;
  let used = 0;
  let adjustment = 0;

  for (const m of relevantMovements) {
    if (m.type === 'received') {
      received += m.quantity;
    } else if (m.type === 'used') {
      used += m.quantity;
    } else if (m.type === 'adjustment') {
      adjustment += m.quantity;
    }
  }

  const effectiveAvailable = received + adjustment;
  const inStock = Math.max(0, effectiveAvailable - used);
  const hasOveruse = used > effectiveAvailable;
  const overuseQty = hasOveruse ? used - effectiveAvailable : 0;

  let status: StockLevelStatus = 'in_stock';
  if (inStock <= 0) {
    status = 'out_of_stock';
  } else if (inStock <= material.lowStockThreshold) {
    status = 'running_low';
  }

  return {
    materialId: material.id,
    materialName: material.name,
    shadeCode: material.shadeCode,
    unit: material.unit,
    categoryId: material.categoryId,
    categoryName: '', // can be populated by service
    projectId: projectId || 'all',
    received,
    used,
    inStock,
    lowStockThreshold: material.lowStockThreshold,
    status,
    hasOveruse,
    overuseQty,
  };
}

/**
 * Computes overall progress percentage from an array of ScopeGridCells.
 * Not started = 0%, In progress = percentage (or 50 if unset), Done = 100%
 */
export function computeProjectProgress(cells: ScopeGridCell[]): number {
  if (!cells || cells.length === 0) return 0;

  const totalPoints = cells.reduce((sum, cell) => {
    if (cell.status === 'done') return sum + 100;
    if (cell.status === 'in_progress') return sum + (cell.percentage || 50);
    return sum + 0;
  }, 0);

  return Math.round(totalPoints / cells.length);
}

/**
 * Computes progress percentage for a specific room within a project.
 */
export function computeRoomProgress(cells: ScopeGridCell[], roomId: string): number {
  const roomCells = cells.filter(c => c.roomId === roomId);
  return computeProjectProgress(roomCells);
}

/**
 * Computes total spend for a project or all projects from Bills.
 */
export function computeProjectSpend(bills: Bill[], projectId?: string): number {
  const relevantBills = projectId 
    ? bills.filter(b => b.projectId === projectId)
    : bills;

  return relevantBills.reduce((total, bill) => {
    const billSum = bill.items.reduce((itemTotal, item) => {
      return itemTotal + (item.quantity * item.rate);
    }, 0);
    return total + billSum;
  }, 0);
}

/**
 * Computes days since the last progress update for a project.
 */
export function computeDaysSinceLastUpdate(
  projectId: string, 
  updates: ProgressUpdate[],
  now: Date = TODAY_BASELINE
): number | null {
  const projectUpdates = updates
    .filter(u => u.projectId === projectId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (projectUpdates.length === 0) return null;

  const lastDate = new Date(projectUpdates[0].date);
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export interface AttentionItem {
  id: string;
  type: 'out_of_stock' | 'stale_site' | 'bills_review' | 'overused' | 'running_low';
  text: string;
  link: string;
  projectId?: string;
  severity: 'rust' | 'amber';
}

/**
 * Generates the "Needs your attention" list for the Owner's Home view
 * strictly using plain language rules from Section 7 and matching all cards.
 */
export function computeAttentionItems(
  projects: Project[],
  materials: Material[],
  movements: StockMovement[],
  bills: Bill[],
  updates: ProgressUpdate[],
  now: Date = new Date()
): AttentionItem[] {
  const items: AttentionItem[] = [];
  const activeProjects = projects.filter(p => p.status === 'active');

  // 1. Out of stock & overused items per active project
  activeProjects.forEach(proj => {
    materials.forEach(mat => {
      const balance = computeMaterialStockBalance(mat, movements, proj.id);
      
      // Overused alert
      if (balance.hasOveruse) {
        // Find movement who caused overuse
        const usedMovement = movements
          .filter(m => m.projectId === proj.id && m.materialId === mat.id && m.type === 'used')
          .pop();
        const workerFirstName = usedMovement?.workerName ? usedMovement.workerName.split(' ')[0] : 'A team member';
        const matDisplayName = mat.name.toLowerCase().includes('hinges') ? 'hinges' : mat.name.toLowerCase();
        items.push({
          id: `overuse-${proj.id}-${mat.id}`,
          type: 'overused',
          text: `${workerFirstName} used ${balance.overuseQty} more ${matDisplayName} than were in stock at ${proj.name}`,
          link: `/projects/${proj.id}?tab=inventory`,
          projectId: proj.id,
          severity: 'rust',
        });
      } else if (balance.status === 'out_of_stock' && balance.received > 0) {
        // Out of stock alert
        const shade = mat.shadeCode ? ` (${mat.shadeCode})` : '';
        items.push({
          id: `oos-${proj.id}-${mat.id}`,
          type: 'out_of_stock',
          text: `${mat.name}${shade} is out of stock at ${proj.name}`,
          link: `/projects/${proj.id}?tab=inventory`,
          projectId: proj.id,
          severity: 'rust',
        });
      }
    });
  });

  // 2. Running low items per active project (grouped if > 3)
  const runningLowItems: {
    material: Material;
    project: Project;
    balance: MaterialStockBalance;
  }[] = [];

  activeProjects.forEach(proj => {
    materials.forEach(mat => {
      const balance = computeMaterialStockBalance(mat, movements, proj.id);
      if (balance.status === 'running_low') {
        runningLowItems.push({ material: mat, project: proj, balance });
      }
    });
  });

  if (runningLowItems.length > 0) {
    if (runningLowItems.length > 3) {
      const distinctSites = new Set(runningLowItems.map(i => i.project.id)).size;
      items.push({
        id: 'running-low-grouped-alert',
        type: 'running_low',
        text: `${runningLowItems.length} items are running low across ${distinctSites} site${distinctSites > 1 ? 's' : ''}`,
        link: '/inventory?filter=running_low',
        severity: 'amber',
      });
    } else {
      runningLowItems.forEach(item => {
        const shade = item.material.shadeCode ? ` (${item.material.shadeCode})` : '';
        items.push({
          id: `low-${item.project.id}-${item.material.id}`,
          type: 'running_low',
          text: `${item.material.name}${shade} is running low at ${item.project.name} (${item.balance.inStock} ${item.material.unit} left)`,
          link: `/projects/${item.project.id}?tab=inventory`,
          projectId: item.project.id,
          severity: 'amber',
        });
      });
    }
  }

  // 3. Sites with no update in 3+ days (only for active projects that have started logging updates)
  activeProjects.forEach(proj => {
    const projectUpdates = updates.filter(u => u.projectId === proj.id);
    if (projectUpdates.length === 0) return; // New project with no updates yet must not trigger alert

    const days = computeDaysSinceLastUpdate(proj.id, updates, now);
    if (days !== null && days >= 3) {
      items.push({
        id: `stale-${proj.id}`,
        type: 'stale_site',
        text: `${proj.name} has had no update for ${days} days`,
        link: `/projects/${proj.id}?tab=progress`,
        projectId: proj.id,
        severity: 'amber',
      });
    }
  });

  // 4. Trade lead deliveries needing checking
  const tradeLeadBillsNeedingCheck = bills.filter(b => b.needsTradeLeadCheck && b.status === 'to_review');
  tradeLeadBillsNeedingCheck.forEach(b => {
    const uploaderFirstName = b.uploadedBy ? b.uploadedBy.split(' ')[0] : 'trade lead';
    items.push({
      id: `trade-lead-delivery-${b.id}`,
      type: 'bills_review',
      text: `1 delivery recorded by ${uploaderFirstName} needs checking`,
      link: `/bills?selected=${b.id}`,
      projectId: b.projectId,
      severity: 'amber',
    });
  });

  // 5. Regular bills waiting for review
  const regularPendingBills = bills.filter(b => b.status === 'to_review' && !b.needsTradeLeadCheck);
  if (regularPendingBills.length > 0) {
    items.push({
      id: 'bills-review-alert',
      type: 'bills_review',
      text: `${regularPendingBills.length} bill${regularPendingBills.length > 1 ? 's' : ''} uploaded yesterday ${regularPendingBills.length > 1 ? 'are' : 'is'} waiting for review`,
      link: '/bills?status=to_review',
      severity: 'amber',
    });
  }

  return items;
}

/**
 * Computes count of items running low across active projects.
 */
export function computeItemsRunningLowCount(
  projects: Project[],
  materials: Material[],
  movements: StockMovement[]
): number {
  const activeProjects = projects.filter(p => p.status === 'active');
  const runningLowSet = new Set<string>();
  activeProjects.forEach(proj => {
    materials.forEach(mat => {
      const balance = computeMaterialStockBalance(mat, movements, proj.id);
      if (balance.status === 'running_low') {
        runningLowSet.add(`${proj.id}-${mat.id}`);
      }
    });
  });
  return runningLowSet.size;
}

/**
 * Formats a timestamp into relative plain-language time
 * against the current date.
 */
export function formatRelativeTime(
  dateInput: string | Date,
  baseline: Date = new Date()
): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const diffMs = baseline.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  // Check if calendar yesterday
  const yesterday = new Date(baseline);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isYesterday) return 'Yesterday';

  const isToday = d.toDateString() === baseline.toDateString();
  if (isToday) return `${diffHours}h ago`;

  if (diffDays < 7) return `${diffDays}d ago`;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

/**
 * Formats numbers into Indian Rupee currency (e.g. ₹18,00,000).
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

