import { useEffect } from 'react';

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    const fullTitle = pageTitle ? `${pageTitle} · Bestinterio` : 'Bestinterio · StudioOS';
    document.title = fullTitle;
  }, [pageTitle]);
}
