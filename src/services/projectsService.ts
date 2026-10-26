import { getItem, setItem, STORAGE_KEYS } from './storage';
import { Project, ScopeGridCell } from '../types';
import { computeProjectProgress } from '../utils/calculations';

export const projectsService = {
  async list(): Promise<Project[]> {
    return getItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
  },

  async get(id: string): Promise<Project | null> {
    const projects = await this.list();
    return projects.find(p => p.id === id) || null;
  },

  async create(projectData: Omit<Project, 'id'>, cells?: ScopeGridCell[]): Promise<Project> {
    const projects = await this.list();
    const newId = `proj-${Date.now().toString(36)}`;
    const newProject: Project = {
      ...projectData,
      id: newId,
    };

    projects.unshift(newProject);
    setItem(STORAGE_KEYS.PROJECTS, projects);

    if (cells && cells.length > 0) {
      const allCells = getItem<ScopeGridCell[]>(STORAGE_KEYS.SCOPE_CELLS, []);
      const mappedCells = cells.map(c => ({
        ...c,
        id: `cell-${Math.random().toString(36).substring(2, 9)}`,
        projectId: newId,
      }));
      setItem(STORAGE_KEYS.SCOPE_CELLS, [...allCells, ...mappedCells]);
    }

    return newProject;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const projects = await this.list();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated = { ...projects[index], ...updates };
    projects[index] = updated;
    setItem(STORAGE_KEYS.PROJECTS, projects);
    return updated;
  },

  async getProjectWithProgress(id: string): Promise<{ project: Project; progress: number } | null> {
    const project = await this.get(id);
    if (!project) return null;

    const allCells = getItem<ScopeGridCell[]>(STORAGE_KEYS.SCOPE_CELLS, []);
    const projectCells = allCells.filter(c => c.projectId === id);
    const progress = computeProjectProgress(projectCells);

    return { project, progress };
  },
};
