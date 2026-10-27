import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Studio, TradeType } from '../types';
import { INITIAL_STUDIO } from '../data/initialData';

export const ROOM_TEMPLATES: Record<string, string[]> = {
  '1BHK': ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Balcony'],
  '2BHK': ['Living & Dining', 'Kitchen', 'Master Bedroom', 'Kids Bedroom', 'Balcony', 'Master Bath', 'Common Bath'],
  '3BHK': ['Living & Dining', 'Kitchen', 'Master Bedroom', 'Kids Bedroom', 'Guest Bedroom', 'Balcony', 'Foyer & Passage', 'Master Bath', 'Common Bath'],
  'Villa': ['Foyer & Living', 'Dining & Dry Kitchen', 'Wet Kitchen', 'Master Suite', 'Ground Guest Room', 'First Floor Lounge', 'Children Suite', 'Terrace & Deck', 'Powder Room'],
  'Office': ['Reception & Waiting', 'Open Work Hall', 'Conference Room', 'Executive Cabin 1', 'Executive Cabin 2', 'Pantry & Breakout', 'Restrooms'],
  'Shop': ['Front Display', 'Checkout Counter', 'Stockroom / Back Area', 'Fitting / Trial Area'],
};

export interface TradeSetting {
  id: TradeType;
  label: string;
  defaultOn: boolean;
  description: string;
}

export const DEFAULT_TRADES: TradeSetting[] = [
  { id: 'carpentry', label: 'Carpentry', defaultOn: true, description: 'Cabinetry, paneling, furniture & doors' },
  { id: 'electrical', label: 'Electrical', defaultOn: true, description: 'Wiring, fixtures, conduits & switches' },
  { id: 'civil', label: 'Civil', defaultOn: true, description: 'Masonry, flooring, tiling & plaster' },
  { id: 'painting', label: 'Painting', defaultOn: true, description: 'Putty, primer, emulsion & textures' },
  { id: 'plumbing', label: 'Plumbing', defaultOn: true, description: 'Sanitary lines, fittings & CPVC' },
  { id: 'false_ceiling', label: 'False ceiling', defaultOn: true, description: 'Gypsum boards, GI channels & lighting cutouts' },
  { id: 'other', label: 'Other', defaultOn: false, description: 'Specialized fabrication or miscellaneous work' },
];

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
    return getItem<Record<string, string[]>>(STORAGE_KEYS.ROOM_TEMPLATES, ROOM_TEMPLATES);
  },

  updateRoomTemplates(templates: Record<string, string[]>): Record<string, string[]> {
    setItem(STORAGE_KEYS.ROOM_TEMPLATES, templates);
    return templates;
  },

  getTradesSettings(): TradeSetting[] {
    return getItem<TradeSetting[]>(STORAGE_KEYS.TRADES_SETTINGS, DEFAULT_TRADES);
  },

  updateTradesSettings(trades: TradeSetting[]): TradeSetting[] {
    setItem(STORAGE_KEYS.TRADES_SETTINGS, trades);
    return trades;
  },
};
