import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ChevronRight,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { progressService } from '../../services/progressService';
import { Project, ProgressCellStatus, Room, ScopeGridCell, TradeType } from '../../types';
import { getActiveSiteProjectId, setActiveSiteProjectId } from '../../utils/siteState';
import { getSiteLanguage, SiteLanguage, t } from '../../utils/i18n';

const PROGRESS_SCALE: { label: string; value: number; status: ProgressCellStatus }[] = [
  { label: 'Not started', value: 0, status: 'not_started' },
  { label: '25%', value: 25, status: 'in_progress' },
  { label: '50%', value: 50, status: 'in_progress' },
  { label: '75%', value: 75, status: 'in_progress' },
  { label: 'Done', value: 100, status: 'done' },
];

const SAMPLE_WORK_PHOTOS = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=600&auto=format&fit=crop&q=80',
];

export const ProgressUpdatePage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [lang, setLang] = useState<SiteLanguage>(getSiteLanguage());
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [scopeCells, setScopeCells] = useState<ScopeGridCell[]>([]);

  // Selection
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedRoomName, setSelectedRoomName] = useState<string>('');
  const [selectedTrade, setSelectedTrade] = useState<TradeType>('carpentry');
  const [selectedPercentage, setSelectedPercentage] = useState<number>(50);

  // Photos & Notes
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleLang = () => setLang(getSiteLanguage());
    window.addEventListener('studioos_language_change', handleLang);
    return () => window.removeEventListener('studioos_language_change', handleLang);
  }, []);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allProjects = await projectsService.list();
        const activeOnly = allProjects.filter((p) => p.status === 'active');
        let userProjects = activeOnly;

        if (role === 'supervisor') {
          userProjects = activeOnly.filter(
            (p) => p.supervisorId === currentUser?.id || currentUser?.assignedProjectIds?.includes(p.id)
          );
        } else if (role === 'worker') {
          userProjects = activeOnly.filter((p) => currentUser?.assignedProjectIds?.includes(p.id));
        }
        if (userProjects.length === 0) userProjects = activeOnly;

        setProjects(userProjects);

        // Active project
        const savedProjectId = getActiveSiteProjectId();
        const active = userProjects.find((p) => p.id === savedProjectId) || userProjects[0];
        const projId = active ? active.id : '';
        setSelectedProjectId(projId);

        // Preselect Room
        if (active && active.rooms && active.rooms.length > 0) {
          setSelectedRoomId(active.rooms[0].id);
          setSelectedRoomName(active.rooms[0].name);
        }

        // Preselect Trade: if worker has trade, preselect worker's trade!
        if (role === 'worker' && currentUser?.trade) {
          setSelectedTrade(currentUser.trade);
        } else if (active && active.tradesInScope && active.tradesInScope.length > 0) {
          setSelectedTrade(active.tradesInScope[0]);
        }

        // Fetch scope cells for this project
        if (projId) {
          const cells = await progressService.getScopeCells(projId);
          setScopeCells(cells);
        }
      } catch (err) {
        console.error('Failed to load progress update data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser?.id, role]);

  // When project changes, reload scope cells and default rooms
  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchCells = async () => {
      const cells = await progressService.getScopeCells(selectedProjectId);
      setScopeCells(cells);

      const proj = projects.find((p) => p.id === selectedProjectId);
      if (proj && proj.rooms && proj.rooms.length > 0) {
        setSelectedRoomId(proj.rooms[0].id);
        setSelectedRoomName(proj.rooms[0].name);
      }
      if (role === 'worker' && currentUser?.trade) {
        setSelectedTrade(currentUser.trade);
      } else if (proj && proj.tradesInScope && proj.tradesInScope.length > 0) {
        setSelectedTrade(proj.tradesInScope[0]);
      }
    };
    fetchCells();
  }, [selectedProjectId, projects, currentUser?.trade, role]);

  // Current cell status
  const currentCell = useMemo(() => {
    return scopeCells.find(
      (c) => c.roomId === selectedRoomId && c.trade === selectedTrade
    );
  }, [scopeCells, selectedRoomId, selectedTrade]);

  // Sync selectedPercentage when switching room or trade
  useEffect(() => {
    if (currentCell) {
      setSelectedPercentage(currentCell.percentage ?? 0);
    } else {
      setSelectedPercentage(0);
    }
  }, [currentCell, selectedRoomId, selectedTrade]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoomId(room.id);
    setSelectedRoomName(room.name);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 3) {
      setError('You can add up to 3 photos per update.');
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => [...prev, reader.result as string].slice(0, 3));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSamplePhoto = () => {
    if (photos.length >= 3) return;
    const nextPhoto = SAMPLE_WORK_PHOTOS[photos.length % SAMPLE_WORK_PHOTOS.length];
    setPhotos((prev) => [...prev, nextPhoto].slice(0, 3));
    setError(null);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a site.');
      return;
    }

    if (!selectedRoomId) {
      setError('Please select a room.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const effectiveStudioId = activeProject?.studioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      const scaleItem = PROGRESS_SCALE.find((s) => s.value === selectedPercentage) || {
        status: (selectedPercentage === 100 ? 'done' : selectedPercentage > 0 ? 'in_progress' : 'not_started') as ProgressCellStatus,
      };

      await progressService.recordUpdate({
        studioId: effectiveStudioId,
        projectId: selectedProjectId,
        roomId: selectedRoomId,
        roomName: selectedRoomName || 'Room',
        trade: selectedTrade,
        authorId: currentUser?.id || 'worker-user',
        authorName: currentUser?.name || 'Site Lead',
        status: scaleItem.status,
        percentage: selectedPercentage,
        note: notes.trim() || undefined,
        photos: photos.length > 0 ? photos : ['/bills/bill-sample-1.svg'],
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/app');
      }, 900);
    } catch (err: any) {
      console.error('Failed to submit progress update:', err);
      setError(err?.message || 'Failed to submit work update.');
      setIsSubmitting(false);
    }
  };

  // Available Trades in Scope for active project
  const availableTrades = useMemo(() => {
    if (activeProject && activeProject.tradesInScope && activeProject.tradesInScope.length > 0) {
      return activeProject.tradesInScope;
    }
    return ['carpentry', 'electrical', 'civil', 'painting', 'plumbing', 'false_ceiling'] as TradeType[];
  }, [activeProject]);

  return (
    <div className="space-y-5 max-w-md mx-auto pb-32">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">
          {role === 'worker' ? t('prog.title', lang) : t('home.progress_update', lang)}
        </h2>
        <p className="text-xs text-muted">
          {t('prog.subtitle', lang)}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rust-soft/60 border border-rust/30 text-xs text-rust flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Project Selector (if multiple) */}
        {projects.length > 1 ? (
          <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-olive" />
              <span className="text-xs font-medium text-muted">Site:</span>
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setActiveSiteProjectId(e.target.value);
              }}
              className="text-xs font-semibold text-ink bg-transparent focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
            <span className="text-xs text-muted">Site:</span>
            <span className="text-sm font-semibold text-ink">{activeProject?.name}</span>
          </div>
        )}

        {/* 2. Room Chips (>= 48px tap targets) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-muted">
              {t('prog.room', lang)}
            </span>
            <span className="text-xs text-ink font-medium">Selected: {selectedRoomName}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {activeProject?.rooms && activeProject.rooms.length > 0 ? (
              activeProject.rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleRoomSelect(room)}
                    className={`h-12 min-h-[48px] px-4 rounded-xl text-xs font-medium shrink-0 transition-all border flex items-center justify-center ${
                      isSelected
                        ? 'bg-ink text-paper border-ink shadow-xs'
                        : 'bg-paper text-ink border-line hover:bg-sand/30'
                    }`}
                  >
                    {room.name}
                  </button>
                );
              })
            ) : (
              ['Living Room', 'Kitchen', 'Master Bedroom'].map((rName, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedRoomId(`room-${idx}`);
                    setSelectedRoomName(rName);
                  }}
                  className={`h-12 min-h-[48px] px-4 rounded-xl text-xs font-medium shrink-0 transition-all border flex items-center justify-center ${
                    selectedRoomName === rName
                      ? 'bg-ink text-paper border-ink shadow-xs'
                      : 'bg-paper text-ink border-line hover:bg-sand/30'
                  }`}
                >
                  {rName}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 3. Trade Chips (Worker's trade preselected, >= 48px tap targets) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-muted">
              {t('prog.trade', lang)}
            </span>
            {role === 'worker' && currentUser?.trade && (
              <span className="text-[10px] font-semibold text-olive bg-olive-soft border border-olive/30 px-2 py-0.5 rounded-full">
                Your trade
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {availableTrades.map((tr) => {
              const isSelected = selectedTrade === tr;
              const formattedLabel = tr.replace('_', ' ');
              return (
                <button
                  key={tr}
                  type="button"
                  onClick={() => setSelectedTrade(tr)}
                  className={`h-12 min-h-[48px] px-4 rounded-xl text-xs font-medium shrink-0 capitalize transition-all border flex items-center justify-center ${
                    isSelected
                      ? 'bg-ink text-paper border-ink shadow-xs'
                      : 'bg-paper text-ink border-line hover:bg-sand/30'
                  }`}
                >
                  {formattedLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Status Selector: Not started · 25% · 50% · 75% · Done */}
        <div className="p-4 rounded-2xl bg-paper border border-line space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t('prog.status', lang)}
            </label>
            <span className="text-xs text-muted">
              Previously: <strong className="text-ink">{currentCell ? `${currentCell.percentage}%` : '0%'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {PROGRESS_SCALE.map((scale) => {
              const isSelected = selectedPercentage === scale.value;
              return (
                <button
                  key={scale.value}
                  type="button"
                  onClick={() => setSelectedPercentage(scale.value)}
                  className={`min-h-[48px] h-12 rounded-xl text-xs font-semibold transition-all border flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-olive text-paper border-olive shadow-xs scale-100'
                      : 'bg-ivory text-ink border-line hover:bg-sand/30'
                  }`}
                >
                  <span className="leading-tight">{scale.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Photos: 1 to 3 photos */}
        <div className="space-y-2 p-4 rounded-2xl bg-paper border border-line">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t('prog.photos', lang)}
            </label>
            <span className="text-xs text-muted">{photos.length}/3 added</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {photos.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-line group">
                <img src={url} alt={`Work proof ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-ink/70 text-paper flex items-center justify-center hover:bg-rust transition-colors"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {photos.length < 3 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-line bg-ivory/60 flex flex-col items-center justify-center text-muted hover:text-ink hover:bg-sand/30 cursor-pointer active:scale-95 transition-all">
                <Camera className="w-5 h-5 mb-1" strokeWidth={1.5} />
                <span className="text-[10px] font-medium">+ Add</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {photos.length < 3 && (
            <button
              type="button"
              onClick={handleAddSamplePhoto}
              className="text-xs font-medium text-olive hover:underline inline-flex items-center gap-1 pt-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Use sample work photo</span>
            </button>
          )}
        </div>

        {/* 6. Optional Note */}
        <div className="space-y-1.5 p-4 rounded-2xl bg-paper border border-line">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted block">
            {t('prog.notes', lang)}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Completed carcass framing, edge banding, and first coat primer..."
            rows={3}
            className="w-full p-3 rounded-xl border border-line bg-ivory text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-colors resize-none"
          />
        </div>

        {/* Sticky Primary Button (56px) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-paper/95 backdrop-blur-md border-t border-line max-w-md mx-auto">
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full h-14 rounded-2xl bg-ink text-paper text-base font-semibold hover:bg-ink-2 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-float disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-olive" />
                <span>Work updated!</span>
              </>
            ) : (
              <span>{t('prog.submit', lang)} ({selectedPercentage}%)</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
