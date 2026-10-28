import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Camera, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Sparkles, 
  Trash2,
  HelpCircle,
  Clock,
  PackageX,
  FileQuestion,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { progressService } from '../../services/progressService';
import { Issue, IssueType, Project, Room } from '../../types';
import { getActiveSiteProjectId, setActiveSiteProjectId } from '../../utils/siteState';
import { getSiteLanguage, SiteLanguage, t } from '../../utils/i18n';

interface ProblemTypeOption {
  type: IssueType;
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROBLEM_TYPES: ProblemTypeOption[] = [
  { type: 'material_missing', key: 'prob.type_material_missing', label: 'Material missing', icon: PackageX },
  { type: 'waiting_for_trade', key: 'prob.type_waiting_for_trade', label: 'Waiting for another trade', icon: Clock },
  { type: 'design_question', key: 'prob.type_design_question', label: 'Design question', icon: FileQuestion },
  { type: 'damage', key: 'prob.type_damage', label: 'Damage', icon: AlertTriangle },
  { type: 'other', key: 'prob.type_other', label: 'Other', icon: HelpCircle },
];

const SAMPLE_PROBLEM_PHOTO = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80';

export const ReportProblemPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [lang, setLang] = useState<SiteLanguage>(getSiteLanguage());
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Form State
  const [selectedRoomId, setSelectedRoomId] = useState<string>('entire_site');
  const [selectedRoomName, setSelectedRoomName] = useState<string>('Entire site / General');
  const [selectedType, setSelectedType] = useState<IssueType>('material_missing');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');

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

        const savedProjectId = getActiveSiteProjectId();
        const active = userProjects.find((p) => p.id === savedProjectId) || userProjects[0];
        if (active) {
          setSelectedProjectId(active.id);
        }
      } catch (err) {
        console.error('Failed to load problem report data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser?.id, role]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = () => {
    setPhotoUrl(SAMPLE_PROBLEM_PHOTO);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a site.');
      return;
    }

    if (!description.trim()) {
      setError('Please describe what the problem is.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const effectiveStudioId = activeProject?.studioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      await progressService.createIssue({
        studioId: effectiveStudioId,
        projectId: selectedProjectId,
        roomId: selectedRoomId === 'entire_site' ? undefined : selectedRoomId,
        roomName: selectedRoomId === 'entire_site' ? undefined : selectedRoomName,
        type: selectedType,
        description: description.trim(),
        photoUrl: photoUrl || undefined,
        reportedBy: currentUser?.name || 'Site Member',
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/app');
      }, 900);
    } catch (err: any) {
      console.error('Failed to submit issue:', err);
      setError(err?.message || 'Failed to submit problem report.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto pb-32">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">{t('prob.title', lang)}</h2>
        <p className="text-xs text-muted">
          {t('prob.subtitle', lang)}
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

        {/* 2. Optional Room Chips (>= 48px tap targets) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-muted">
              {t('prob.room_optional', lang)}
            </span>
            <span className="text-xs text-ink font-medium">{selectedRoomName}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {/* General Site Option */}
            <button
              type="button"
              onClick={() => {
                setSelectedRoomId('entire_site');
                setSelectedRoomName('Entire site / General');
              }}
              className={`h-12 min-h-[48px] px-4 rounded-xl text-xs font-medium shrink-0 transition-all border flex items-center justify-center ${
                selectedRoomId === 'entire_site'
                  ? 'bg-ink text-paper border-ink shadow-xs'
                  : 'bg-paper text-ink border-line hover:bg-sand/30'
              }`}
            >
              Whole site
            </button>

            {activeProject?.rooms?.map((room) => {
              const isSelected = selectedRoomId === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setSelectedRoomName(room.name);
                  }}
                  className={`h-12 min-h-[48px] px-4 rounded-xl text-xs font-medium shrink-0 transition-all border flex items-center justify-center ${
                    isSelected
                      ? 'bg-ink text-paper border-ink shadow-xs'
                      : 'bg-paper text-ink border-line hover:bg-sand/30'
                  }`}
                >
                  {room.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Problem Type Chips (>= 48px tap targets) */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-semibold tracking-wider text-muted block px-1">
            {t('prob.type', lang)}
          </span>

          <div className="grid grid-cols-1 gap-2">
            {PROBLEM_TYPES.map((pt) => {
              const isSelected = selectedType === pt.type;
              const Icon = pt.icon;
              return (
                <button
                  key={pt.type}
                  type="button"
                  onClick={() => setSelectedType(pt.type)}
                  className={`w-full min-h-[48px] h-12 px-3.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-rust-soft/60 border-rust/50 text-rust font-semibold shadow-xs'
                      : 'bg-paper border-line text-ink hover:bg-sand/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-muted" />
                    <span>{t(pt.key, lang)}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-rust" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Problem Description / Note */}
        <div className="space-y-1.5 p-4 rounded-2xl bg-paper border border-line">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted block">
            {t('prob.description', lang)} *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what happened or what is blocked so the office can help..."
            rows={3}
            className="w-full p-3 rounded-xl border border-line bg-ivory text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-colors resize-none"
            required
          />
        </div>

        {/* 5. Optional Photo */}
        <div className="space-y-2 p-4 rounded-2xl bg-paper border border-line">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted block">
            {t('prob.photo_optional', lang)}
          </label>

          {photoUrl ? (
            <div className="relative rounded-xl border border-line bg-ivory overflow-hidden p-2 text-center">
              <img
                src={photoUrl}
                alt="Problem evidence"
                className="w-full h-40 object-contain rounded-lg"
              />
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-xs text-muted">Photo attached</span>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-xs text-rust hover:underline font-medium"
                >
                  Remove photo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="w-full h-12 rounded-xl border-2 border-dashed border-line bg-ivory/60 flex items-center justify-center gap-2 text-xs font-medium text-ink hover:bg-sand/30 cursor-pointer active:scale-95 transition-all">
                <Camera className="w-4 h-4" />
                <span>Attach photo of issue</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleUseSamplePhoto}
                className="text-xs font-medium text-olive hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Use sample photo</span>
              </button>
            </div>
          )}
        </div>

        {/* Sticky Primary Button (56px) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-paper/95 backdrop-blur-md border-t border-line max-w-md mx-auto">
          <button
            type="submit"
            disabled={isSubmitting || isSuccess || !description.trim()}
            className="w-full h-14 rounded-2xl bg-rust text-paper text-base font-semibold hover:bg-rust/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-float disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-paper" />
                <span>Problem reported!</span>
              </>
            ) : (
              <span>{t('prob.submit', lang)}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
