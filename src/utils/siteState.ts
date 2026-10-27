/**
 * Site App State Helpers
 * Stores the currently selected active project ID for phone-first site operations.
 */

const STORAGE_ACTIVE_PROJECT = 'studioos_active_site_project_id';

export function getActiveSiteProjectId(): string | null {
  try {
    return localStorage.getItem(STORAGE_ACTIVE_PROJECT);
  } catch {
    return null;
  }
}

export function setActiveSiteProjectId(projectId: string): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_PROJECT, projectId);
    window.dispatchEvent(new CustomEvent('studioos_active_project_change', { detail: { projectId } }));
  } catch (err) {
    console.error('Failed to set active site project id:', err);
  }
}
