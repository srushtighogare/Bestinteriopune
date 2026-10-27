import { getItem, setItem, STORAGE_KEYS } from './storage';
import { User } from '../types';

export const teamService = {
  async list(): Promise<User[]> {
    return getItem<User[]>(STORAGE_KEYS.USERS, []);
  },

  async get(id: string): Promise<User | null> {
    const users = await this.list();
    return users.find(u => u.id === id) || null;
  },

  async getByPhone(phone: string): Promise<User | null> {
    const users = await this.list();
    const cleanPhone = phone.replace(/\D/g, '');
    return users.find(u => u.phone.replace(/\D/g, '') === cleanPhone) || null;
  },

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const users = await this.list();
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
    };

    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.list();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    setItem(STORAGE_KEYS.USERS, users);
    return updated;
  },

  async deactivate(id: string, currentUserId?: string): Promise<User | null> {
    const user = await this.get(id);
    if (!user) return null;
    if (user.role === 'owner') {
      throw new Error("The studio owner can't be deactivated.");
    }
    if (currentUserId && currentUserId === id) {
      throw new Error("You cannot deactivate your own account.");
    }

    const updated = await this.update(id, { status: 'deactivated' });
    const storedCurrentUserId = getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, '');
    if (storedCurrentUserId === id) {
      setItem(STORAGE_KEYS.CURRENT_USER_ID, '');
    }
    const trustedUserId = getItem<string>('studioos_trusted_user_id', '');
    if (trustedUserId === id) {
      setItem('studioos_trusted_user_id', '');
    }
    return updated;
  },

  async reactivate(id: string): Promise<User | null> {
    return this.update(id, { status: 'active' });
  },

  async resetPin(id: string): Promise<{ user: User; inviteUrl: string } | null> {
    const user = await this.get(id);
    if (!user) return null;

    const oldCode = user.inviteCode;
    const expired = [...(user.expiredInviteCodes || [])];
    if (oldCode && !expired.includes(oldCode)) {
      expired.push(oldCode);
    }

    const slug = user.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCode = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = await this.update(id, { inviteCode: newCode, expiredInviteCodes: expired });
    if (!updated) return null;

    const inviteUrl = this.generateInviteLink(newCode);
    return { user: updated, inviteUrl };
  },

  async updateProjects(id: string, assignedProjectIds: string[]): Promise<User | null> {
    return this.update(id, { assignedProjectIds });
  },

  async setPin(id: string, pin: string): Promise<User | null> {
    return this.update(id, { pin, status: 'active' });
  },

  generateInviteLink(code: string): string {
    const base = window.location.origin;
    return `${base}/invite/${code}`;
  },
};
