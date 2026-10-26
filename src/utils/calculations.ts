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

export const TODAY_BASELINE = new Date('2026-10-26T16:00:00.000Z');

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
  type: 'out_of_stock' | 'stale_site' | 'bills_review' | 'overused';
  text: string;
  link: string;
  projectId?: string;
  severity: 'rust' | 'amber';
}

/**
 * Generates the "Needs your attention" list for the Owner's Home view
 * strictly using plain language rules from Section 7.
 */
export function computeAttentionItems(
  projects: Project[],
  materials: Material[],
  movements: StockMovement[],
  bills: Bill[],
  updates: ProgressUpdate[],
  now: Date = TODAY_BASELINE
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
        const workerName = usedMovement?.workerName || 'A team member';
        items.push({
          id: `overuse-${proj.id}-${mat.id}`,
          type: 'overused',
          text: `${workerName} used ${balance.overuseQty} more ${mat.name.toLowerCase()} than were in stock at ${proj.name}`,
          link: `/projects/${proj.id}?tab=inventory`,
          projectId: proj.id,
          severity: 'rust',
        });
      }

      // Out of stock alert
      if (balance.status === 'out_of_stock' && balance.received > 0) {
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

  // 2. Sites with no update in 3+ days
  activeProjects.forEach(proj => {
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

  // 3. Bills waiting for review
  const pendingBills = bills.filter(b => b.status === 'to_review');
  if (pendingBills.length > 0) {
    items.push({
      id: 'bills-review-alert',
      type: 'bills_review',
      text: `${pendingBills.length} bill${pendingBills.length > 1 ? 's' : ''} uploaded yesterday ${pendingBills.length > 1 ? 'are' : 'is'} waiting for review`,
      link: '/bills?status=to_review',
      severity: 'amber',
    });
  }

  return items;
}
