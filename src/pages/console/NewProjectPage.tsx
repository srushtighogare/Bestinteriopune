import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Plus, 
  X, 
  Trash2, 
  User as UserIcon, 
  Building2, 
  Calendar, 
  MapPin, 
  Share2, 
  Copy, 
  ExternalLink, 
  Hammer, 
  Layers, 
  Sparkles, 
  RotateCcw,
  Clock,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projectsService';
import { progressService } from '../../services/progressService';
import { stockService } from '../../services/stockService';
import { teamService } from '../../services/teamService';
import { settingsService } from '../../services/settingsService';
import { 
  Category, 
  Material, 
  Project, 
  ProjectType, 
  Room, 
  ScopeGridCell, 
  Studio, 
  TradeType, 
  User 
} from '../../types';
import { formatCurrencyINR } from '../../utils/calculations';

export type ScopeTrade = 'carpentry' | 'electrical' | 'civil' | 'painting' | 'plumbing' | 'false_ceiling';

const DRAFT_STORAGE_KEY = 'studioos_draft_new_project';

const ROOM_PRESETS: Record<string, string[]> = {
  '1BHK': ['Living Room', 'Kitchen', 'Bedroom', 'Balcony', 'Bathroom'],
  '2BHK': ['Living & Dining', 'Kitchen', 'Master Bedroom', 'Kids Bedroom', 'Balcony', 'Master Bath', 'Common Bath'],
  '3BHK': ['Living & Dining', 'Kitchen', 'Master Bedroom', 'Kids Bedroom', 'Guest Bedroom', 'Balcony', 'Master Bath', 'Common Bath'],
  'Villa': ['Foyer & Living', 'Kitchen & Dining', 'Master Suite', 'Ground Guest Room', 'First Floor Lounge', 'Children Suite', 'Terrace & Deck', 'Powder Room'],
  'Office': ['Reception & Waiting', 'Open Work Hall', 'Conference Room', 'Executive Cabin 1', 'Executive Cabin 2', 'Pantry & Breakout', 'Restrooms'],
  'Custom': ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom'],
};

const ALL_TRADES: ScopeTrade[] = [
  'carpentry',
  'electrical',
  'civil',
  'painting',
  'plumbing',
  'false_ceiling',
];

const DEFAULT_COVER_IMAGES: Record<ProjectType, string> = {
  apartment: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  villa: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
  shop: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
  custom: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
};

interface OpeningStockItem {
  id: string;
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number;
}

interface NewlyInvitedPerson {
  id: string;
  name: string;
  phone: string;
  trade: TradeType;
  inviteCode: string;
}

export const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // System master data
  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [studio, setStudio] = useState<Studio | null>(null);

  // STEP 1: BASICS
  const [name, setName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<ProjectType>('apartment');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 4);
    return d.toISOString().split('T')[0];
  });
  const [budget, setBudget] = useState<string>('');
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER_IMAGES['apartment']);

  // STEP 2: ROOMS
  const [selectedPreset, setSelectedPreset] = useState<string>('3BHK');
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>(() => 
    ROOM_PRESETS['3BHK'].map(r => ({ id: crypto.randomUUID(), name: r }))
  );
  const [newRoomInput, setNewRoomInput] = useState('');

  // STEP 3: SCOPE (roomId -> Set of active trades)
  const [scopeMatrix, setScopeMatrix] = useState<Record<string, Record<ScopeTrade, boolean>>>(() => {
    const matrix: Record<string, Record<ScopeTrade, boolean>> = {};
    ROOM_PRESETS['3BHK'].forEach(r => {
      // By default all trades active
      matrix[r] = {
        carpentry: true,
        electrical: true,
        civil: true,
        painting: true,
        plumbing: true,
        false_ceiling: true,
      };
    });
    return matrix;
  });

  // STEP 4: TEAM
  const [supervisorId, setSupervisorId] = useState('');
  const [tradeAssignments, setTradeAssignments] = useState<Record<ScopeTrade, string>>({
    carpentry: '',
    electrical: '',
    civil: '',
    painting: '',
    plumbing: '',
    false_ceiling: '',
  });
  const [newlyInvited, setNewlyInvited] = useState<NewlyInvitedPerson[]>([]);

  // Invite modal inside Step 4
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteTrade, setInviteTrade] = useState<TradeType>('carpentry');
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');

  // STEP 5: OPENING STOCK
  const [openingStock, setOpeningStock] = useState<OpeningStockItem[]>([]);
  const [stockCategoryId, setStockCategoryId] = useState('');
  const [stockMaterialId, setStockMaterialId] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  // SUCCESS SCREEN
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  // Load master data
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [projData, teamData, catData, matData, studioData] = await Promise.all([
          projectsService.list(),
          teamService.list(),
          stockService.listCategories(),
          stockService.listMaterials(),
          settingsService.getStudio(),
        ]);
        setExistingProjects(projData);
        setTeam(teamData);
        setCategories(catData);
        setMaterials(matData);
        setStudio(studioData);

        // Pre-select supervisor if Rajiv Deshmukh exists
        const defaultSupervisor = teamData.find(u => u.role === 'supervisor');
        if (defaultSupervisor && !supervisorId) {
          setSupervisorId(defaultSupervisor.id);
        }

        // Auto-match existing workers to trades
        const initialTradeAssignments: Record<ScopeTrade, string> = {
          carpentry: '',
          electrical: '',
          civil: '',
          painting: '',
          plumbing: '',
          false_ceiling: '',
        };
        ALL_TRADES.forEach(t => {
          const match = teamData.find(u => u.role === 'worker' && u.trade === t);
          if (match) initialTradeAssignments[t] = match.id;
        });
        setTradeAssignments(prev => ({ ...initialTradeAssignments, ...prev }));
      } catch (err) {
        console.error('Failed to load master data for wizard:', err);
      }
    };

    loadMasterData();
  }, []);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (rawDraft) {
        const d = JSON.parse(rawDraft);
        if (d.name) setName(d.name);
        if (d.customerName) setCustomerName(d.customerName);
        if (d.address) setAddress(d.address);
        if (d.type) setType(d.type);
        if (d.startDate) setStartDate(d.startDate);
        if (d.targetDate) setTargetDate(d.targetDate);
        if (d.budget !== undefined) setBudget(d.budget);
        if (d.coverImage) setCoverImage(d.coverImage);
        if (d.rooms && d.rooms.length > 0) setRooms(d.rooms);
        if (d.scopeMatrix) setScopeMatrix(d.scopeMatrix);
        if (d.supervisorId) setSupervisorId(d.supervisorId);
        if (d.tradeAssignments) setTradeAssignments(d.tradeAssignments);
        if (d.openingStock) setOpeningStock(d.openingStock);
        if (d.currentStep) setCurrentStep(d.currentStep);
        if (d.newlyInvited) setNewlyInvited(d.newlyInvited);
        setIsDraftRestored(true);
        setDraftSavedAt('Restored');
      }
    } catch (e) {
      console.error('Failed to restore draft:', e);
    }
  }, []);

  // Autosave draft to localStorage
  useEffect(() => {
    if (createdProject) return; // Do not save if project created

    const draft = {
      name,
      customerName,
      address,
      type,
      startDate,
      targetDate,
      budget,
      coverImage,
      rooms,
      scopeMatrix,
      supervisorId,
      tradeAssignments,
      openingStock,
      currentStep,
      newlyInvited,
      savedAt: new Date().toISOString(),
    };

    const handler = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setDraftSavedAt('Just now');
    }, 500);

    return () => clearTimeout(handler);
  }, [
    name,
    customerName,
    address,
    type,
    startDate,
    targetDate,
    budget,
    coverImage,
    rooms,
    scopeMatrix,
    supervisorId,
    tradeAssignments,
    openingStock,
    currentStep,
    newlyInvited,
    createdProject,
  ]);

  // Can see amounts permission
  const canSeeAmounts = useMemo(() => {
    if (role === 'owner') return true;
    if (role === 'manager' && studio?.managerCanSeeAmounts) return true;
    return false;
  }, [role, studio]);

  // "Start from a previous project"
  const handleStartFromPrevious = async (projectId: string) => {
    if (!projectId) return;
    const proj = existingProjects.find(p => p.id === projectId);
    if (!proj) return;

    // Load cells of that project
    const projCells = await progressService.getScopeCells(projectId);

    // Copy basics
    setType(proj.type);
    setCoverImage(proj.coverImage || DEFAULT_COVER_IMAGES[proj.type]);

    // Copy rooms with new IDs
    const newRooms = proj.rooms.map(r => ({
      id: crypto.randomUUID(),
      name: r.name,
    }));
    setRooms(newRooms);

    // Copy scope matrix
    const newMatrix: Record<string, Record<ScopeTrade, boolean>> = {};
    newRooms.forEach((newR, idx) => {
      const origRoom = proj.rooms[idx];
      newMatrix[newR.id] = {
        carpentry: false,
        electrical: false,
        civil: false,
        painting: false,
        plumbing: false,
        false_ceiling: false,
      };

      ALL_TRADES.forEach(t => {
        const hasCell = projCells.some((c: ScopeGridCell) => c.roomId === origRoom?.id && c.trade === t);
        newMatrix[newR.id][t] = hasCell;
      });
    });
    setScopeMatrix(newMatrix);

    // Copy supervisor
    setSupervisorId(proj.supervisorId);

    alert(`Copied rooms, scope, and team settings from ${proj.name}.`);
  };

  // Discard draft
  const handleDiscardDraft = () => {
    if (confirm('Discard draft and start fresh?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setName('');
      setCustomerName('');
      setAddress('');
      setType('apartment');
      setBudget('');
      setRooms(ROOM_PRESETS['3BHK'].map(r => ({ id: crypto.randomUUID(), name: r })));
      setCurrentStep(1);
      setIsDraftRestored(false);
      setDraftSavedAt(null);
    }
  };

  // Room presets change
  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const presetRooms = ROOM_PRESETS[presetKey] || [];
    const newRooms = presetRooms.map(r => ({ id: crypto.randomUUID(), name: r }));
    setRooms(newRooms);

    // Initialize scope matrix for new rooms
    const matrix: Record<string, Record<ScopeTrade, boolean>> = {};
    newRooms.forEach(r => {
      matrix[r.id] = {
        carpentry: true,
        electrical: true,
        civil: true,
        painting: true,
        plumbing: true,
        false_ceiling: true,
      };
    });
    setScopeMatrix(matrix);
  };

  // Add custom room
  const handleAddRoom = () => {
    if (!newRoomInput.trim()) return;
    const newRoom = { id: crypto.randomUUID(), name: newRoomInput.trim() };
    setRooms(prev => [...prev, newRoom]);
    setScopeMatrix(prev => ({
      ...prev,
      [newRoom.id]: {
        carpentry: true,
        electrical: true,
        civil: true,
        painting: true,
        plumbing: true,
        false_ceiling: true,
      },
    }));
    setNewRoomInput('');
  };

  // Remove room
  const handleRemoveRoom = (roomId: string) => {
    if (rooms.length <= 1) {
      alert('A project must have at least one room.');
      return;
    }
    setRooms(prev => prev.filter(r => r.id !== roomId));
    setScopeMatrix(prev => {
      const copy = { ...prev };
      delete copy[roomId];
      return copy;
    });
  };

  // Rename room inline
  const handleRenameRoom = (roomId: string, newName: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, name: newName } : r));
  };

  // Toggle single cell
  const handleToggleCell = (roomId: string, trade: ScopeTrade) => {
    setScopeMatrix(prev => {
      const roomScope = prev[roomId] || {
        carpentry: false,
        electrical: false,
        civil: false,
        painting: false,
        plumbing: false,
        false_ceiling: false,
      };
      return {
        ...prev,
        [roomId]: {
          ...roomScope,
          [trade]: !roomScope[trade],
        },
      };
    });
  };

  // Toggle row all
  const handleToggleRowAll = (roomId: string, targetValue: boolean) => {
    setScopeMatrix(prev => ({
      ...prev,
      [roomId]: {
        carpentry: targetValue,
        electrical: targetValue,
        civil: targetValue,
        painting: targetValue,
        plumbing: targetValue,
        false_ceiling: targetValue,
      },
    }));
  };

  // Toggle column all
  const handleToggleColAll = (trade: ScopeTrade, targetValue: boolean) => {
    setScopeMatrix(prev => {
      const copy = { ...prev };
      rooms.forEach(r => {
        copy[r.id] = {
          ...(copy[r.id] || {}),
          [trade]: targetValue,
        };
      });
      return copy;
    });
  };

  // Active trades across all rooms
  const activeTradesInScope = useMemo((): ScopeTrade[] => {
    const set = new Set<ScopeTrade>();
    rooms.forEach(r => {
      const row = scopeMatrix[r.id];
      if (row) {
        ALL_TRADES.forEach(t => {
          if (row[t]) set.add(t);
        });
      }
    });
    return Array.from(set);
  }, [rooms, scopeMatrix]);

  // Handle inline invite submission
  const handleInviteSubmit = async () => {
    if (!inviteName.trim() || !invitePhone.trim()) {
      alert('Please provide name and phone number.');
      return;
    }
    const cleanPhone = invitePhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const inviteCode = inviteName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
      const newUser = await teamService.create({
        studioId: studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: inviteName.trim(),
        phone: cleanPhone,
        role: 'worker',
        trade: inviteTrade,
        status: 'invited',
        assignedProjectIds: [],
        inviteCode,
      });

      // Add to team list in state
      setTeam(prev => [...prev, newUser]);

      // Assign to this trade
      setTradeAssignments(prev => ({ ...prev, [inviteTrade]: newUser.id }));

      // Track newly invited for WhatsApp share on success screen
      setNewlyInvited(prev => [
        ...prev,
        {
          id: newUser.id,
          name: newUser.name,
          phone: cleanPhone,
          trade: inviteTrade,
          inviteCode,
        },
      ]);

      setIsInviteModalOpen(false);
      setInviteName('');
      setInvitePhone('');
    } catch (err) {
      console.error('Failed to invite user:', err);
    }
  };

  // Add opening stock item
  const handleAddOpeningStock = () => {
    if (!stockMaterialId || !stockQuantity || parseFloat(stockQuantity) <= 0) {
      alert('Please select a material and enter a valid quantity.');
      return;
    }
    const mat = materials.find(m => m.id === stockMaterialId);
    if (!mat) return;

    setOpeningStock(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        materialId: mat.id,
        materialName: mat.shadeCode ? `${mat.name} (${mat.shadeCode})` : mat.name,
        unit: mat.unit,
        quantity: parseFloat(stockQuantity),
      },
    ]);

    setStockMaterialId('');
    setStockQuantity('');
  };

  // Remove opening stock item
  const handleRemoveOpeningStock = (id: string) => {
    setOpeningStock(prev => prev.filter(i => i.id !== id));
  };

  // Validation before advancing
  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        alert('Please enter a project name.');
        return;
      }
      if (!customerName.trim()) {
        alert('Please enter customer name.');
        return;
      }
      if (!address.trim()) {
        alert('Please enter site address.');
        return;
      }
    } else if (currentStep === 2) {
      if (rooms.length === 0) {
        alert('Please add at least one room.');
        return;
      }
    } else if (currentStep === 3) {
      if (activeTradesInScope.length === 0) {
        alert('Please select at least one trade cell in scope.');
        return;
      }
    } else if (currentStep === 4) {
      if (!supervisorId) {
        alert('Please select a site supervisor.');
        return;
      }
    }

    setCurrentStep(prev => Math.min(6, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // CREATE PROJECT (FINAL STEP)
  const handleCreateProject = async () => {
    try {
      const studioId = studio?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      // 1. Build ScopeGridCells
      const finalCells: ScopeGridCell[] = [];
      rooms.forEach(r => {
        const row = scopeMatrix[r.id];
        if (row) {
          ALL_TRADES.forEach(t => {
            if (row[t]) {
              finalCells.push({
                id: crypto.randomUUID(),
                studioId,
                projectId: '', // will be set by service
                roomId: r.id,
                trade: t,
                status: 'not_started',
                percentage: 0,
                lastUpdated: new Date().toISOString(),
                lastUpdatedBy: 'Project setup',
              });
            }
          });
        }
      });

      // 2. Build Room objects
      const finalRooms: Room[] = rooms.map((r, idx) => ({
        id: r.id,
        studioId,
        projectId: '',
        name: r.name,
        order: idx + 1,
      }));

      // 3. Create Project record
      const newProject = await projectsService.create(
        {
          studioId,
          name: name.trim(),
          customerName: customerName.trim(),
          address: address.trim(),
          type,
          status: 'active',
          startDate,
          targetDate,
          budget: budget ? parseFloat(budget) : undefined,
          supervisorId,
          coverImage: coverImage || DEFAULT_COVER_IMAGES[type],
          currentFocus: 'Site mobilization',
          rooms: finalRooms,
          tradesInScope: activeTradesInScope,
        },
        finalCells
      );

      // 4. Update team members' assignedProjectIds
      const assignedUserIds = new Set<string>();
      if (supervisorId) assignedUserIds.add(supervisorId);
      activeTradesInScope.forEach(t => {
        const uid = tradeAssignments[t];
        if (uid) assignedUserIds.add(uid);
      });

      for (const uid of Array.from(assignedUserIds)) {
        const u = team.find(member => member.id === uid);
        if (u) {
          const updatedProjects = Array.from(new Set([...u.assignedProjectIds, newProject.id]));
          await teamService.update(u.id, { assignedProjectIds: updatedProjects });
        }
      }

      // 5. Record opening stock movements if any
      for (const item of openingStock) {
        await stockService.recordReceived({
          studioId,
          projectId: newProject.id,
          materialId: item.materialId,
          quantity: item.quantity,
          workerName: 'Initial setup',
          note: 'Opening site stock recorded during project setup',
        });
      }

      // 6. Clear saved draft
      localStorage.removeItem(DRAFT_STORAGE_KEY);

      // 7. Show success screen
      setCreatedProject(newProject);
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create project. Please check the form and try again.');
    }
  };

  const formatTradeName = (t: string) => {
    return t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // SUCCESS SCREEN RENDER
  if (createdProject) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
        <div className="p-8 rounded-card bg-paper border border-line shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-olive-soft text-olive mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-medium text-ink">
              {createdProject.name} is ready
            </h1>
            <p className="text-sm text-muted">
              Project created with {createdProject.rooms.length} rooms and {activeTradesInScope.length} trades in scope.
            </p>
          </div>

          {/* Invited Workers WhatsApp Share Section */}
          {newlyInvited.length > 0 && (
            <div className="p-6 rounded-2xl bg-ivory border border-line text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-medium text-ink text-base">
                    Invites ready for {newlyInvited.length} new {newlyInvited.length > 1 ? 'people' : 'person'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Send them their direct link so they can set their 4-digit PIN
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sand text-ink-2">
                  Action ready
                </span>
              </div>

              <div className="space-y-3">
                {newlyInvited.map(person => {
                  const inviteUrl = `${window.location.origin}/invite/${person.inviteCode}`;
                  const waText = encodeURIComponent(
                    `Hi ${person.name}, you have been invited to work on ${createdProject.name} with Bestinterio on StudioOS. Open your site app here to set your PIN: ${inviteUrl}`
                  );
                  const waUrl = `https://wa.me/91${person.phone}?text=${waText}`;

                  return (
                    <div 
                      key={person.id}
                      className="p-4 rounded-xl border border-line bg-paper flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-ink">{person.name}</span>
                          <span className="text-xs text-muted capitalize">· {person.trade}</span>
                        </div>
                        <span className="text-xs text-muted tabular-nums block mt-0.5">
                          +91 {person.phone}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Copy Link Button */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(inviteUrl);
                            setCopiedInviteId(person.id);
                            setTimeout(() => setCopiedInviteId(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-ink hover:bg-sand/40 transition-colors inline-flex items-center gap-1.5"
                        >
                          {copiedInviteId === person.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-olive" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-muted" />
                              <span>Copy link</span>
                            </>
                          )}
                        </button>

                        {/* WhatsApp Share Button */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:bg-[#20BD5A] transition-all inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/projects')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-line text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
            >
              Go to Projects list
            </button>
            <button
              onClick={() => navigate(`/projects/${createdProject.id}`)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft transition-all"
            >
              Open project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* 1. Header with Back button and Draft notification */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => currentStep > 1 ? handleBack() : navigate('/projects')}
            className="w-9 h-9 rounded-xl border border-line bg-paper flex items-center justify-center text-muted hover:text-ink hover:bg-sand/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif text-3xl font-medium text-ink tracking-tight">
              New project
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Set up project details, rooms, scope grid, and trade team
            </p>
          </div>
        </div>

        {/* Draft Indicator & Discard */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {draftSavedAt && (
            <span className="text-[11px] text-muted inline-flex items-center gap-1.5 bg-sand/40 px-2.5 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-muted" />
              <span>Draft autosaved ({draftSavedAt})</span>
            </span>
          )}
          {isDraftRestored && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="text-[11px] text-muted hover:text-rust underline transition-colors"
            >
              Discard draft
            </button>
          )}
        </div>
      </div>

      {/* 2. Step Indicator (1 to 6) */}
      <div className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-6 gap-2 text-center">
          {[
            { num: 1, label: 'Basics' },
            { num: 2, label: 'Rooms' },
            { num: 3, label: 'Scope' },
            { num: 4, label: 'Team' },
            { num: 5, label: 'Opening stock' },
            { num: 6, label: 'Review' },
          ].map(s => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                onClick={() => isCompleted && setCurrentStep(s.num)}
                className={`flex flex-col items-center gap-1.5 select-none ${
                  isCompleted ? 'cursor-pointer' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  isCurrent 
                    ? 'bg-ink text-paper ring-4 ring-sand-dark/50' 
                    : isCompleted 
                    ? 'bg-olive text-paper' 
                    : 'bg-sand/60 text-muted'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.num}
                </div>
                <span className={`text-[11px] truncate max-w-full ${
                  isCurrent ? 'font-semibold text-ink' : isCompleted ? 'text-ink-2' : 'text-muted'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Step Content Area */}
      <div className="bg-paper border border-line rounded-card p-6 sm:p-8 shadow-card space-y-8">

        {/* STEP 1: BASICS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Start from previous project option */}
            {existingProjects.length > 0 && (
              <div className="p-4 rounded-xl bg-ivory border border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber shrink-0" />
                  <span className="text-xs font-medium text-ink">
                    Want to save time? Start from a previous project
                  </span>
                </div>

                <select
                  defaultValue=""
                  onChange={(e) => handleStartFromPrevious(e.target.value)}
                  className="p-1.5 rounded-lg border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                >
                  <option value="">Choose previous project...</option>
                  {existingProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Project name <span className="text-rust">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Koregaon Park Apartment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-ink block mb-1">
                    Customer name <span className="text-rust">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anil & Priya Mehta"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-ink block mb-1">
                    Site address / Location <span className="text-rust">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 402, Signature One, Senapati Bapat Road, Pune"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Project Type Chips */}
              <div>
                <label className="text-xs font-medium text-ink block mb-2">
                  Project type
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['apartment', 'villa', 'office', 'shop', 'custom'] as ProjectType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setType(t);
                        setCoverImage(DEFAULT_COVER_IMAGES[t]);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${
                        type === t 
                          ? 'bg-ink text-paper border-ink' 
                          : 'bg-paper text-muted border-line hover:border-sand-dark'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-ink block mb-1">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-line bg-paper text-sm text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-ink block mb-1">
                    Target handover date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-line bg-paper text-sm text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Budget (Owner / Permitted Manager only) */}
              {canSeeAmounts && (
                <div className="pt-2">
                  <label className="text-xs font-medium text-ink block mb-1">
                    Project budget (₹) <span className="text-muted font-normal">(optional, visible only to studio management)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1800000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-3 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink tabular-nums"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: ROOMS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-ink">
                Room list
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Choose a preset layout or add custom rooms. These will become the rows of your scope grid.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs text-muted font-medium block">Layout presets:</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(ROOM_PRESETS).map(key => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePresetSelect(key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      selectedPreset === key 
                        ? 'bg-ink text-paper border-ink' 
                        : 'bg-paper text-muted border-line hover:border-sand-dark'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Room Chips */}
            <div className="space-y-3 pt-2">
              <span className="text-xs text-ink font-medium block">
                Rooms in this project ({rooms.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {rooms.map((room, idx) => (
                  <div
                    key={room.id}
                    className="p-3 rounded-xl border border-line bg-sand/30 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-muted tabular-nums w-5 font-mono">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={room.name}
                        onChange={(e) => handleRenameRoom(room.id, e.target.value)}
                        className="bg-transparent text-xs font-medium text-ink w-full focus:outline-none focus:bg-paper focus:px-2 focus:py-1 focus:rounded border-transparent focus:border-line border transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRoom(room.id)}
                      className="text-muted hover:text-rust p-1 transition-colors"
                      title="Remove room"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Room input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add room name (e.g. Pooja Room, Study, Walk-in Wardrobe)..."
                value={newRoomInput}
                onChange={(e) => setNewRoomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRoom())}
                className="flex-1 p-2.5 rounded-xl border border-line bg-paper text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink"
              />
              <button
                type="button"
                onClick={handleAddRoom}
                className="px-4 py-2.5 rounded-xl bg-paper border border-line text-xs font-medium text-ink hover:bg-sand/40 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add room</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCOPE (Room × Trade Toggle Matrix) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl font-medium text-ink">
                  Room × Trade Scope
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Tap cells to include/exclude trades per room. This initializes your project progress grid.
                </p>
              </div>

              <span className="text-xs text-muted">
                {activeTradesInScope.length} trades active
              </span>
            </div>

            {/* Grid of Toggles */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2 border border-line rounded-xl">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-sand/40 text-muted font-medium">
                    <th className="py-3 px-4 w-44">Room</th>
                    {ALL_TRADES.map(t => (
                      <th key={t} className="py-2.5 px-2 text-center min-w-[100px]">
                        <div>{formatTradeName(t)}</div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleColAll(t, true)}
                            className="text-[10px] text-muted hover:text-ink underline"
                          >
                            All
                          </button>
                          <span className="text-[10px] text-muted">·</span>
                          <button
                            type="button"
                            onClick={() => handleToggleColAll(t, false)}
                            className="text-[10px] text-muted hover:text-rust underline"
                          >
                            None
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="py-3 px-4 text-center w-24">Row action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {rooms.map(room => {
                    const roomScope = scopeMatrix[room.id] || {
                      carpentry: false,
                      electrical: false,
                      civil: false,
                      painting: false,
                      plumbing: false,
                      false_ceiling: false,
                    };

                    return (
                      <tr key={room.id} className="hover:bg-sand/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-xs text-ink">
                          {room.name}
                        </td>

                        {ALL_TRADES.map(t => {
                          const isActive = roomScope[t];

                          return (
                            <td key={t} className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleCell(room.id, t)}
                                className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                                  isActive
                                    ? 'bg-olive text-paper shadow-xs'
                                    : 'bg-sand/30 text-muted hover:bg-sand/60'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <Check className="w-3 h-3 stroke-[2.5]" />
                                    <span>In scope</span>
                                  </>
                                ) : (
                                  <span>—</span>
                                )}
                              </button>
                            </td>
                          );
                        })}

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleRowAll(room.id, true)}
                              className="text-[10px] text-muted hover:text-ink underline"
                            >
                              All
                            </button>
                            <span className="text-[10px] text-muted">·</span>
                            <button
                              type="button"
                              onClick={() => handleToggleRowAll(room.id, false)}
                              className="text-[10px] text-muted hover:text-rust underline"
                            >
                              None
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 4: TEAM */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-ink">
                Team assignment
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Assign a site supervisor and team members per trade. You can also invite new people via phone.
              </p>
            </div>

            {/* Supervisor Picker */}
            <div className="p-4 rounded-xl border border-line bg-sand/20 space-y-2">
              <label className="text-xs font-medium text-ink block">
                Site Supervisor <span className="text-rust">*</span>
              </label>
              <select
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
              >
                <option value="">Select supervisor...</option>
                {team
                  .filter(u => u.role === 'supervisor' || u.role === 'manager' || u.role === 'owner')
                  .map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.charAt(0).toUpperCase() + u.role.slice(1)})
                    </option>
                  ))}
              </select>
            </div>

            {/* One row per trade in scope */}
            <div className="space-y-3">
              <span className="text-xs font-medium text-ink block">
                Assign workers for active trades:
              </span>

              {activeTradesInScope.map(t => {
                const assignedUserId = tradeAssignments[t];

                return (
                  <div
                    key={t}
                    className="p-3.5 rounded-xl border border-line bg-paper flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-44">
                      <div className="w-7 h-7 rounded-lg bg-sand flex items-center justify-center text-ink text-xs font-medium">
                        {t.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-serif font-medium text-xs text-ink">
                        {formatTradeName(t)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <select
                        value={assignedUserId}
                        onChange={(e) => setTradeAssignments(prev => ({ ...prev, [t]: e.target.value }))}
                        className="p-2 rounded-xl border border-line bg-paper text-xs text-ink flex-1 sm:max-w-xs focus:outline-none focus:border-ink"
                      >
                        <option value="">Unassigned (can assign later)</option>
                        {team
                          .filter(u => u.role === 'worker')
                          .map(u => (
                            <option key={u.id} value={u.id}>
                              {u.name} {u.trade ? `(${u.trade})` : ''}
                            </option>
                          ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setInviteTrade(t);
                          setIsInviteModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl border border-line bg-sand/30 hover:bg-sand/60 text-xs font-medium text-ink transition-colors shrink-0 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Invite new</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: OPENING STOCK */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl font-medium text-ink">
                  Opening stock (Optional)
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Record materials already delivered to the site before construction starts. You can skip this step.
                </p>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="text-xs text-muted hover:text-ink underline self-start sm:self-auto"
              >
                Skip opening stock
              </button>
            </div>

            {/* Add Opening Material Form */}
            <div className="p-4 rounded-xl border border-line bg-sand/20 space-y-3">
              <span className="text-xs font-medium text-ink block">
                Add material at site:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category select */}
                <div>
                  <select
                    value={stockCategoryId}
                    onChange={(e) => {
                      setStockCategoryId(e.target.value);
                      setStockMaterialId('');
                    }}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                  >
                    <option value="">Select category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Material select */}
                <div>
                  <select
                    value={stockMaterialId}
                    onChange={(e) => setStockMaterialId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                  >
                    <option value="">Select material...</option>
                    {materials
                      .filter(m => !stockCategoryId || m.categoryId === stockCategoryId)
                      .map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.shadeCode ? `(${m.shadeCode})` : ''} · {m.unit}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Quantity + Add button */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-24 p-2.5 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={handleAddOpeningStock}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of Opening Stock Items */}
            {openingStock.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-medium text-ink block">
                  Items to record on creation ({openingStock.length}):
                </span>
                <div className="border border-line rounded-xl overflow-hidden divide-y divide-line/60">
                  {openingStock.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-paper flex items-center justify-between text-xs"
                    >
                      <div className="font-medium text-ink">
                        {item.materialName}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="tabular-nums font-serif text-sm">
                          {item.quantity} {item.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOpeningStock(item.id)}
                          className="text-muted hover:text-rust p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted border border-dashed border-line rounded-xl bg-ivory/50">
                No opening materials added yet. You can click "Next" or "Skip opening stock" to proceed.
              </div>
            )}
          </div>
        )}

        {/* STEP 6: REVIEW */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-ink">
                Review & Confirm
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Review your configuration before creating the project. You can jump back to edit any section.
              </p>
            </div>

            <div className="space-y-4">
              {/* Basics card */}
              <div className="p-4 rounded-xl border border-line bg-paper space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted font-medium">
                    1. Basics
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-muted hover:text-ink underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-muted block">Project name:</span>
                    <span className="font-medium text-ink">{name}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Customer:</span>
                    <span className="font-medium text-ink">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Type:</span>
                    <span className="font-medium text-ink capitalize">{type}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted block">Site address:</span>
                    <span className="font-medium text-ink">{address}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Schedule:</span>
                    <span className="font-medium text-ink">{startDate} → {targetDate}</span>
                  </div>
                  {canSeeAmounts && budget && (
                    <div>
                      <span className="text-muted block">Budget:</span>
                      <span className="font-medium text-ink">{formatCurrencyINR(parseFloat(budget))}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rooms card */}
              <div className="p-4 rounded-xl border border-line bg-paper space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted font-medium">
                    2. Rooms ({rooms.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-muted hover:text-ink underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rooms.map(r => (
                    <span key={r.id} className="px-2.5 py-1 rounded-lg bg-sand/60 text-ink text-xs font-medium">
                      {r.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scope card */}
              <div className="p-4 rounded-xl border border-line bg-paper space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted font-medium">
                    3. Scope
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-muted hover:text-ink underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-ink-2">
                  <strong className="text-ink">{activeTradesInScope.length} trades</strong> active in scope: {activeTradesInScope.map(formatTradeName).join(', ')}.
                </p>
              </div>

              {/* Team card */}
              <div className="p-4 rounded-xl border border-line bg-paper space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted font-medium">
                    4. Team
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-xs text-muted hover:text-ink underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1 pt-1">
                  <p>
                    <span className="text-muted">Lead Supervisor:</span>{' '}
                    <strong className="text-ink">{team.find(u => u.id === supervisorId)?.name || 'Unassigned'}</strong>
                  </p>
                  <p className="text-muted">
                    Assigned workers: {activeTradesInScope.map(t => {
                      const u = team.find(member => member.id === tradeAssignments[t]);
                      return `${formatTradeName(t)}: ${u ? u.name : 'Unassigned'}`;
                    }).join(' · ')}
                  </p>
                </div>
              </div>

              {/* Opening Stock card */}
              <div className="p-4 rounded-xl border border-line bg-paper space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted font-medium">
                    5. Opening Stock
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="text-xs text-muted hover:text-ink underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-muted">
                  {openingStock.length > 0 
                    ? `${openingStock.length} items recorded to initial site stock.`
                    : 'None specified.'}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Wizard Footer Actions (ONE primary button) */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-line bg-paper text-xs font-medium text-ink hover:bg-sand/30 disabled:opacity-40 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2 shadow-soft active:scale-[0.98] transition-all inline-flex items-center gap-1.5"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          /* EXACTLY ONE Primary Action Button on final step */
          <button
            type="button"
            onClick={handleCreateProject}
            className="px-7 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink-2 shadow-soft active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Create project</span>
          </button>
        )}
      </div>

      {/* Invite Modal for Step 4 */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper rounded-2xl max-w-md w-full p-6 space-y-5 border border-line shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h4 className="font-serif text-lg font-medium text-ink">
                  Invite new team member
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Trade: <strong className="text-ink">{formatTradeName(inviteTrade)}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-muted hover:text-ink text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Full name <span className="text-rust">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deepak Sharma"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Phone number <span className="text-rust">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted font-medium bg-sand px-2.5 py-2.5 rounded-xl border border-line">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9850066778"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-line bg-paper text-xs text-ink focus:outline-none focus:border-ink tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-line text-xs font-medium text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInviteSubmit}
                className="px-4 py-2 rounded-xl bg-ink text-paper text-xs font-medium hover:bg-ink-2"
              >
                Add & Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
