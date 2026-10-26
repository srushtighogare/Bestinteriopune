import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Studio } from '../types';
import { INITIAL_STUDIO } from '../data/initialData';

export const ROOM_TEMPLATES: Record<string, string[]> = {
  '1BHK': ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Balcony'],
  '2BHK': ['Living & Dining', 'Kitchen', 'Master Bedroom', 'Guest Bedroom', 'Balcony'],
  '3BHK': ['Living & Dining', 'Kitchen', 'Master Bedroom', 'Kids Bedroom', 'Guest Bedroom', 'Balcony', 'Foyer & Passage'],
  'Villa': ['Foyer & Living', 'Dining & Dry Kitchen', 'Wet Kitchen', 'Master Suite', 'Bedroom 2', 'Bedroom 3', 'Family Lounge', 'Terrace'],
  'Office': ['Reception & Waiting', 'Open Work Hall', 'Conference Room', 'Executive Cabin 1', 'Executive Cabin 2', 'Pantry & Breakout'],
  'Shop': ['Front Display', 'Checkout Counter', 'Stockroom / Back Area', 'Fitting / Trial Area'],
};

export const settingsService = {
  async getStudio(): Promise<Studio> {
    return getItem<Studio>(STORAGE_KEYS.STUDIO, INITIAL_STUDIO);
  },

  async updateStudio(updates: Partial<Studio>): Promise<Studio> {
    const current = await this.getStudio();
    const updated = { ...current, ...updates };
    setItem(STORAGE_KEYS.STUDIO, updated);
    return updated;
  },

  getRoomTemplates(): Record<string, string[]> {
    return ROOM_TEMPLATES;
  },
};
