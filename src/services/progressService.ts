import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Issue, ProgressCellStatus, ProgressUpdate, ScopeGridCell, TradeType } from '../types';

export interface RecordProgressUpdateInput {
  studioId: string;
  projectId: string;
  roomId: string;
  roomName: string;
  trade: TradeType;
  authorId: string;
  authorName: string;
  status: ProgressCellStatus;
  percentage: number;
  note?: string;
  photos: string[];
}

export interface CreateIssueInput {
  studioId: string;
  projectId: string;
  roomId?: string;
  roomName?: string;
  type: Issue['type'];
  description: string;
  photoUrl?: string;
  reportedBy: string;
  needsCustomerAction?: boolean;
}

export const progressService = {
  async getScopeCells(projectId: string): Promise<ScopeGridCell[]> {
    const allCells = getItem<ScopeGridCell[]>(STORAGE_KEYS.SCOPE_CELLS, []);
    return allCells.filter(c => c.projectId === projectId);
  },

  async updateCell(
    projectId: string,
    roomId: string,
    trade: TradeType,
    status: ProgressCellStatus,
    percentage: number,
    authorName: string,
    studioId?: string
  ): Promise<ScopeGridCell | null> {
    const allCells = getItem<ScopeGridCell[]>(STORAGE_KEYS.SCOPE_CELLS, []);
    const index = allCells.findIndex(
      c => c.projectId === projectId && c.roomId === roomId && c.trade === trade
    );

    const now = new Date().toISOString();
    if (index === -1) {
      const newCell: ScopeGridCell = {
        id: crypto.randomUUID(),
        studioId: studioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        projectId,
        roomId,
        trade,
        status,
        percentage,
        lastUpdated: now,
        lastUpdatedBy: authorName,
      };
      allCells.push(newCell);
      setItem(STORAGE_KEYS.SCOPE_CELLS, allCells);
      return newCell;
    }

    allCells[index] = {
      ...allCells[index],
      status,
      percentage,
      lastUpdated: now,
      lastUpdatedBy: authorName,
    };
    setItem(STORAGE_KEYS.SCOPE_CELLS, allCells);
    return allCells[index];
  },

  async listUpdates(projectId?: string): Promise<ProgressUpdate[]> {
    const updates = getItem<ProgressUpdate[]>(STORAGE_KEYS.PROGRESS_UPDATES, []);
    if (!projectId || projectId === 'all') return updates;
    return updates.filter(u => u.projectId === projectId);
  },

  async recordUpdate(input: RecordProgressUpdateInput): Promise<ProgressUpdate> {
    const updates = getItem<ProgressUpdate[]>(STORAGE_KEYS.PROGRESS_UPDATES, []);
    const newUpdate: ProgressUpdate = {
      id: crypto.randomUUID(),
      ...input,
      date: new Date().toISOString(),
    };

    updates.unshift(newUpdate);
    setItem(STORAGE_KEYS.PROGRESS_UPDATES, updates);

    // Sync corresponding scope cell
    await this.updateCell(
      input.projectId,
      input.roomId,
      input.trade,
      input.status,
      input.percentage,
      input.authorName,
      input.studioId
    );

    return newUpdate;
  },

  async listIssues(projectId?: string): Promise<Issue[]> {
    const issues = getItem<Issue[]>(STORAGE_KEYS.ISSUES, []);
    if (!projectId || projectId === 'all') return issues;
    return issues.filter(i => i.projectId === projectId);
  },

  async createIssue(input: CreateIssueInput): Promise<Issue> {
    const issues = getItem<Issue[]>(STORAGE_KEYS.ISSUES, []);
    const newIssue: Issue = {
      id: crypto.randomUUID(),
      studioId: input.studioId,
      projectId: input.projectId,
      roomId: input.roomId,
      roomName: input.roomName,
      type: input.type,
      description: input.description,
      photoUrl: input.photoUrl,
      reportedBy: input.reportedBy,
      reportedAt: new Date().toISOString(),
      status: 'open',
      needsCustomerAction: input.needsCustomerAction || false,
    };

    issues.unshift(newIssue);
    setItem(STORAGE_KEYS.ISSUES, issues);
    return newIssue;
  },

  async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue | null> {
    const issues = getItem<Issue[]>(STORAGE_KEYS.ISSUES, []);
    const index = issues.findIndex(i => i.id === id);
    if (index === -1) return null;

    issues[index] = { ...issues[index], ...updates };
    setItem(STORAGE_KEYS.ISSUES, issues);
    return issues[index];
  },

  async resolveIssue(id: string): Promise<Issue | null> {
    const issues = getItem<Issue[]>(STORAGE_KEYS.ISSUES, []);
    const index = issues.findIndex(i => i.id === id);
    if (index === -1) return null;

    issues[index] = {
      ...issues[index],
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.ISSUES, issues);
    return issues[index];
  },
};
