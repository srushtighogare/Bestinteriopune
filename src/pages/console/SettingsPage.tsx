import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Package, 
  Layers, 
  Hammer, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Upload, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Studio, TradeType } from '../../types';
import { settingsService, TradeSetting, DEFAULT_TRADES, ROOM_TEMPLATES } from '../../services/settingsService';
import { resetDemoData, STORAGE_KEYS } from '../../services/storage';
import { CatalogueManagement } from '../../components/catalogue/CatalogueManagement';

type SettingsSection = 'profile' | 'catalogue' | 'rooms' | 'trades' | 'permissions' | 'demo';

const SECTIONS: { id: SettingsSection; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'profile', label: 'Studio profile', icon: Building2 },
  { id: 'catalogue', label: 'Material catalogue', icon: Package },
  { id: 'rooms', label: 'Room templates', icon: Layers },
  { id: 'trades', label: 'Trades', icon: Hammer },
  { id: 'permissions', label: 'Permissions', icon: ShieldCheck },
  { id: 'demo', label: 'Demo controls', icon: RotateCcw },
];

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = (searchParams.get('section') as SettingsSection) || 'profile';

  const setSection = (section: SettingsSection) => {
    setSearchParams({ section });
  };

  // 1. Studio Profile State
  const [studio, setStudio] = useState<Studio | null>(null);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // 2. Room Templates State
  const [roomTemplates, setRoomTemplates] = useState<Record<string, string[]>>({});
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('3BHK');
  const [newRoomName, setNewRoomName] = useState('');
  const [roomsSaved, setRoomsSaved] = useState(false);

  // 3. Trades Settings State
  const [trades, setTrades] = useState<TradeSetting[]>([]);
  const [tradesSaved, setTradesSaved] = useState(false);

  // 4. Permissions State
  const [managerCanSeeAmounts, setManagerCanSeeAmounts] = useState(true);
  const [tradeLeadsCanRecordDeliveries, setTradeLeadsCanRecordDeliveries] = useState(true);
  const [permissionsSaved, setPermissionsSaved] = useState(false);

  // 5. Demo Controls State
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Load all initial settings data
  const loadData = async () => {
    try {
      const s = await settingsService.getStudio();
      setStudio(s);
      setName(s.name);
      setOwnerName(s.ownerName);
      setCity(s.city);
      setAddress(s.address);
      setPhone(s.phone);
      setLogoUrl(s.logoUrl);
      setManagerCanSeeAmounts(s.managerCanSeeAmounts ?? true);
      setTradeLeadsCanRecordDeliveries(s.tradeLeadsCanRecordDeliveries ?? true);

      const templates = settingsService.getRoomTemplates();
      setRoomTemplates(templates);

      const tList = settingsService.getTradesSettings();
      setTrades(tList);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageReset = () => {
      loadData();
    };
    window.addEventListener('studioos_storage_reset', handleStorageReset);
    return () => {
      window.removeEventListener('studioos_storage_reset', handleStorageReset);
    };
  }, []);

  // ----------------------------------------------------------------
  // Handlers: Studio Profile
  // ----------------------------------------------------------------
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studio) return;

    try {
      const updated = await settingsService.updateStudio({
        name: name.trim(),
        ownerName: ownerName.trim(),
        city: city.trim(),
        address: address.trim(),
        phone: phone.trim(),
        logoUrl: logoUrl.trim(),
      });
      setStudio(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save studio profile:', err);
    }
  };

  // ----------------------------------------------------------------
  // Handlers: Room Templates
  // ----------------------------------------------------------------
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newRoomName.trim();
    if (!clean) return;

    const currentRooms = roomTemplates[activeTemplateKey] || [];
    const nextRooms = [...currentRooms, clean];
    const nextTemplates = { ...roomTemplates, [activeTemplateKey]: nextRooms };

    setRoomTemplates(nextTemplates);
    settingsService.updateRoomTemplates(nextTemplates);
    setNewRoomName('');
  };

  const handleRemoveRoom = (index: number) => {
    const currentRooms = roomTemplates[activeTemplateKey] || [];
    if (currentRooms.length <= 1) {
      alert('A template must contain at least one room.');
      return;
    }
    const nextRooms = currentRooms.filter((_, idx) => idx !== index);
    const nextTemplates = { ...roomTemplates, [activeTemplateKey]: nextRooms };

    setRoomTemplates(nextTemplates);
    settingsService.updateRoomTemplates(nextTemplates);
  };

  const handleMoveRoom = (index: number, direction: 'up' | 'down') => {
    const currentRooms = [...(roomTemplates[activeTemplateKey] || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= currentRooms.length) return;

    const temp = currentRooms[index];
    currentRooms[index] = currentRooms[target];
    currentRooms[target] = temp;

    const nextTemplates = { ...roomTemplates, [activeTemplateKey]: currentRooms };
    setRoomTemplates(nextTemplates);
    settingsService.updateRoomTemplates(nextTemplates);
  };

  const handleRenameRoom = (index: number, nextName: string) => {
    const currentRooms = [...(roomTemplates[activeTemplateKey] || [])];
    currentRooms[index] = nextName;
    const nextTemplates = { ...roomTemplates, [activeTemplateKey]: currentRooms };
    setRoomTemplates(nextTemplates);
  };

  const handleSaveRoomTemplates = () => {
    settingsService.updateRoomTemplates(roomTemplates);
    setRoomsSaved(true);
    setTimeout(() => setRoomsSaved(false), 3000);
  };

  const handleResetTemplateDefaults = () => {
    if (window.confirm(`Reset "${activeTemplateKey}" room template back to studio defaults?`)) {
      const defaultRooms = ROOM_TEMPLATES[activeTemplateKey] || ['Living Room', 'Kitchen', 'Bedroom'];
      const nextTemplates = { ...roomTemplates, [activeTemplateKey]: defaultRooms };
      setRoomTemplates(nextTemplates);
      settingsService.updateRoomTemplates(nextTemplates);
    }
  };

  // ----------------------------------------------------------------
  // Handlers: Trades Settings
  // ----------------------------------------------------------------
  const handleToggleTradeDefault = (tradeId: TradeType) => {
    setTrades(prev =>
      prev.map(t => (t.id === tradeId ? { ...t, defaultOn: !t.defaultOn } : t))
    );
  };

  const handleSaveTrades = () => {
    settingsService.updateTradesSettings(trades);
    setTradesSaved(true);
    setTimeout(() => setTradesSaved(false), 3000);
  };

  // ----------------------------------------------------------------
  // Handlers: Permissions
  // ----------------------------------------------------------------
  const handleSavePermissions = async () => {
    try {
      const updated = await settingsService.updateStudio({
        managerCanSeeAmounts,
        tradeLeadsCanRecordDeliveries,
      });
      setStudio(updated);
      setPermissionsSaved(true);
      setTimeout(() => setPermissionsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save permissions:', err);
    }
  };

  // ----------------------------------------------------------------
  // Handlers: Demo Reset
  // ----------------------------------------------------------------
  const handleConfirmResetDemo = () => {
    resetDemoData();
    setShowResetConfirm(false);
    setResetSuccess(true);
    loadData();
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">Settings</h1>
        <p className="text-sm text-muted mt-1">
          Studio profile, catalogues, room templates, trades, and permissions
        </p>
      </div>

      {/* Main Layout: Left Sub-nav + Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Sub-nav (3 cols) */}
        <div className="md:col-span-3 space-y-1 bg-paper/60 p-2 rounded-2xl border border-line">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-ink-2 hover:bg-sand/30 hover:text-ink'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-paper' : 'text-muted'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area (9 cols) */}
        <div className="md:col-span-9 space-y-6">

          {/* ======================================================== */}
          {/* 1. STUDIO PROFILE                                         */}
          {/* ======================================================== */}
          {activeSection === 'profile' && (
            <div className="p-6 rounded-card bg-paper border border-line space-y-6 shadow-xs">
              <div className="border-b border-line pb-4">
                <h2 className="font-serif text-2xl font-medium text-ink">Studio Profile</h2>
                <p className="text-xs text-muted mt-0.5">
                  Used on client summary sheets, PDF headers, PWA icon, and login screen
                </p>
              </div>

              {profileSaved && (
                <div className="p-3.5 rounded-xl bg-olive-soft border border-olive/30 text-xs text-ink flex items-center gap-2">
                  <Check className="w-4 h-4 text-olive shrink-0" />
                  <span>Studio profile changes saved successfully.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                {/* Logo Upload Strip */}
                <div className="space-y-2 p-4 rounded-xl border border-line bg-ivory/40">
                  <label className="font-medium text-ink block">Studio Logo</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl border border-line bg-paper flex items-center justify-center p-2 shrink-0 shadow-xs">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-serif text-sm font-medium text-muted">Logo</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-1.5 rounded-lg border border-line bg-paper text-ink font-medium hover:bg-sand/30 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                          <Upload className="w-3.5 h-3.5 text-muted" />
                          <span>Upload new logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                        {logoUrl !== '/logo.png' && (
                          <button
                            type="button"
                            onClick={() => setLogoUrl('/logo.png')}
                            className="px-3 py-1.5 rounded-lg border border-line text-muted hover:text-ink transition-colors"
                          >
                            Revert to default
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-muted">
                        Recommended: PNG or SVG with transparent background. Appears in top-left sidebar and export documents.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Studio & Owner Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-medium text-ink block">Studio Name <span className="text-rust">*</span></label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-ink block">Studio Owner <span className="text-rust">*</span></label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>

                {/* City & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-medium text-ink block">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-ink block">Studio Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink font-mono"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="font-medium text-ink block">Studio Registered Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-line bg-paper text-ink focus:outline-none focus:border-ink leading-relaxed"
                  />
                  <p className="text-[11px] text-muted">
                    Printed on summary sheets and formal PDF project handovers.
                  </p>
                </div>

                {/* Exactly one primary button in this sub-view */}
                <div className="pt-3 border-t border-line flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-ink text-paper font-medium hover:bg-ink-2 shadow-soft transition-all"
                  >
                    Save profile changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. MATERIAL CATALOGUE                                     */}
          {/* ======================================================== */}
          {activeSection === 'catalogue' && (
            <div className="space-y-4">
              <CatalogueManagement onUpdated={() => loadData()} />
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. ROOM TEMPLATES                                         */}
          {/* ======================================================== */}
          {activeSection === 'rooms' && (
            <div className="p-6 rounded-card bg-paper border border-line space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-ink">Room Templates</h2>
                  <p className="text-xs text-muted mt-0.5">
                    Pre-fills rooms when creating a project in the New Project wizard
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetTemplateDefaults}
                  className="text-xs text-muted hover:text-ink underline self-start sm:self-auto"
                >
                  Reset {activeTemplateKey} to defaults
                </button>
              </div>

              {roomsSaved && (
                <div className="p-3.5 rounded-xl bg-olive-soft border border-olive/30 text-xs text-ink flex items-center gap-2">
                  <Check className="w-4 h-4 text-olive shrink-0" />
                  <span>Room templates updated. New projects will automatically use this layout.</span>
                </div>
              )}

              {/* Template Selectors */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted uppercase tracking-wider block">
                  Select Template:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(roomTemplates).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTemplateKey(key)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                        activeTemplateKey === key
                          ? 'bg-ink text-paper border-ink shadow-xs'
                          : 'bg-paper text-ink border-line hover:bg-sand/30'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Template Room List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>
                    Rooms in <strong className="text-ink">{activeTemplateKey}</strong> ({roomTemplates[activeTemplateKey]?.length || 0})
                  </span>
                  <span>Drag or click arrows to reorder</span>
                </div>

                <div className="space-y-2">
                  {(roomTemplates[activeTemplateKey] || []).map((room, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-line bg-paper hover:bg-sand/10 transition-colors"
                    >
                      {/* Reorder Buttons */}
                      <div className="flex items-center border border-line rounded-lg bg-ivory p-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveRoom(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-muted hover:text-ink disabled:opacity-25 transition-colors"
                          title="Move room up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveRoom(idx, 'down')}
                          disabled={idx === (roomTemplates[activeTemplateKey]?.length || 0) - 1}
                          className="p-1 rounded text-muted hover:text-ink disabled:opacity-25 transition-colors"
                          title="Move room down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] font-mono text-muted w-6 text-center select-none">
                        #{idx + 1}
                      </span>

                      {/* Room Name Input */}
                      <input
                        type="text"
                        value={room}
                        onChange={e => handleRenameRoom(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-line/80 bg-paper text-xs text-ink font-medium focus:outline-none focus:border-ink transition-colors"
                      />

                      {/* Remove Room Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(idx)}
                        className="p-1.5 rounded-lg border border-line text-muted hover:text-rust hover:bg-rust-soft/40 transition-colors"
                        title="Remove room"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Room to Template */}
                <form onSubmit={handleAddRoom} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder={`Add new room to ${activeTemplateKey}...`}
                    value={newRoomName}
                    onChange={e => setNewRoomName(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors inline-flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add room</span>
                  </button>
                </form>
              </div>

              {/* Exactly one primary button in this sub-view */}
              <div className="pt-4 border-t border-line flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveRoomTemplates}
                  className="px-5 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft transition-all"
                >
                  Save room templates
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. TRADES & DEFAULT SCOPE                                 */}
          {/* ======================================================== */}
          {activeSection === 'trades' && (
            <div className="p-6 rounded-card bg-paper border border-line space-y-6 shadow-xs">
              <div className="border-b border-line pb-4">
                <h2 className="font-serif text-2xl font-medium text-ink">Trades & Default Scope</h2>
                <p className="text-xs text-muted mt-0.5">
                  Configure trade specializations and choose which are enabled by default in new projects
                </p>
              </div>

              {tradesSaved && (
                <div className="p-3.5 rounded-xl bg-olive-soft border border-olive/30 text-xs text-ink flex items-center gap-2">
                  <Check className="w-4 h-4 text-olive shrink-0" />
                  <span>Trade defaults saved. New projects will automatically populate these active columns.</span>
                </div>
              )}

              <div className="space-y-3">
                {trades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-line bg-paper hover:bg-sand/10 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-ink">{trade.label}</span>
                        {trade.defaultOn && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-olive-soft text-olive">
                            Active by default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted">{trade.description}</p>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleTradeDefault(trade.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        trade.defaultOn ? 'bg-olive' : 'bg-sand'
                      }`}
                      role="switch"
                      aria-checked={trade.defaultOn}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-paper shadow-md ring-0 transition duration-200 ease-in-out ${
                          trade.defaultOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Exactly one primary button in this sub-view */}
              <div className="pt-3 border-t border-line flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveTrades}
                  className="px-5 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft transition-all"
                >
                  Save trade defaults
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. PERMISSIONS                                            */}
          {/* ======================================================== */}
          {activeSection === 'permissions' && (
            <div className="p-6 rounded-card bg-paper border border-line space-y-6 shadow-xs">
              <div className="border-b border-line pb-4">
                <h2 className="font-serif text-2xl font-medium text-ink">Roles & Studio Permissions</h2>
                <p className="text-xs text-muted mt-0.5">
                  Set financial visibility and site material delivery recording rules
                </p>
              </div>

              {permissionsSaved && (
                <div className="p-3.5 rounded-xl bg-olive-soft border border-olive/30 text-xs text-ink flex items-center gap-2">
                  <Check className="w-4 h-4 text-olive shrink-0" />
                  <span>Permissions updated successfully.</span>
                </div>
              )}

              <div className="space-y-4">
                {/* 1. Managers can see amounts toggle */}
                <div className="p-4 rounded-xl border border-line bg-paper flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-medium text-xs text-ink block">
                      Managers can see amounts
                    </span>
                    <p className="text-[11px] text-muted leading-relaxed max-w-xl">
                      When enabled, studio managers can view unit rates, line item costs, total bill amounts, and project budgets. If disabled, all financial figures are strictly hidden for managers and visible only to the studio owner.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setManagerCanSeeAmounts(!managerCanSeeAmounts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      managerCanSeeAmounts ? 'bg-olive' : 'bg-sand'
                    }`}
                    role="switch"
                    aria-checked={managerCanSeeAmounts}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-paper shadow-md ring-0 transition duration-200 ease-in-out ${
                        managerCanSeeAmounts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Trade leads can record deliveries toggle (new in brief!) */}
                <div className="p-4 rounded-xl border border-line bg-paper flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-ink block">
                        Trade leads can record deliveries
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber/15 text-amber border border-amber/30">
                        Default On
                      </span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed max-w-xl">
                      Allows trade leads on site (e.g. carpenter lead Gurmukh) to record material deliveries with bill photos when no supervisor is present. The delivery is tagged <strong className="text-ink">"Recorded by trade lead — check on next visit"</strong> and flagged for supervisor/office review before final confirmation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTradeLeadsCanRecordDeliveries(!tradeLeadsCanRecordDeliveries)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      tradeLeadsCanRecordDeliveries ? 'bg-olive' : 'bg-sand'
                    }`}
                    role="switch"
                    aria-checked={tradeLeadsCanRecordDeliveries}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-paper shadow-md ring-0 transition duration-200 ease-in-out ${
                        tradeLeadsCanRecordDeliveries ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Exactly one primary button in this sub-view */}
              <div className="pt-3 border-t border-line flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-5 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft transition-all"
                >
                  Save permissions
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. DEMO CONTROLS (with in-page confirmation step)        */}
          {/* ======================================================== */}
          {activeSection === 'demo' && (
            <div className="p-6 rounded-card bg-paper border border-line space-y-6 shadow-xs">
              <div className="border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-olive" strokeWidth={1.5} />
                  <h2 className="font-serif text-2xl font-medium text-ink">Demo Management</h2>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Manage local prototype persistence and restore clean factory state
                </p>
              </div>

              {resetSuccess && (
                <div className="p-4 rounded-xl bg-olive-soft border border-olive/30 text-xs text-ink flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-olive shrink-0" />
                  <div>
                    <p className="font-semibold text-ink">Demo data restored</p>
                    <p className="text-ink-2 text-[11px] mt-0.5">
                      Mehta Residence, Baner Villa, and Kharadi Office have been reset to the baseline October 2026 data.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4 text-xs text-ink-2 leading-relaxed">
                <p>
                  StudioOS runs in local prototype mode. All recorded materials, uploaded bills, project progress grid cells, and created team members persist in your browser's local storage.
                </p>
                <p className="text-muted text-[11px]">
                  If you made demo modifications during a meeting or trial run and want to return to the initial pristine baseline, use the button below.
                </p>
              </div>

              {/* In-page Confirmation Step */}
              {showResetConfirm ? (
                <div className="p-4 rounded-xl border border-rust/30 bg-rust-soft/50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rust shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-rust text-xs">Reset all demo data back to clean factory state?</p>
                      <p className="text-ink-2 text-[11px] mt-1 leading-relaxed">
                        Any new bills, team members, inventory movements, or projects created during this session will be replaced by the default October 2026 dataset. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-rust/20">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3.5 py-1.5 rounded-lg border border-line bg-paper text-ink text-xs font-medium hover:bg-sand/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmResetDemo}
                      className="px-4 py-1.5 rounded-lg bg-rust text-paper text-xs font-medium hover:bg-rust/90 shadow-soft transition-all"
                    >
                      Confirm reset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-line flex items-center justify-between gap-4">
                  <div className="text-[11px] text-muted">
                    Restores all projects, stock, and bills to October 2026 baseline.
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-ivory hover:bg-sand/40 text-ink text-xs font-medium transition-all shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4 text-muted" />
                    <span>Reset demo data</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
