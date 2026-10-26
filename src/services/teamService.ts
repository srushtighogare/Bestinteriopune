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
      id: `user-${Date.now().toString(36)}`,
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

  async deactivate(id: string): Promise<User | null> {
    return this.update(id, { status: 'deactivated' });
  },

  async setPin(id: string, pin: string): Promise<User | null> {
    return this.update(id, { pin, status: 'active' });
  },

  generateInviteLink(code: string): string {
    const base = window.location.origin;
    return `${base}/invite/${code}`;
  },
};
