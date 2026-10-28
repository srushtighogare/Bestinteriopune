import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES: { pattern: RegExp; title: string }[] = [
  { pattern: /^\/login$/, title: 'Sign In' },
  { pattern: /^\/app\/login$/, title: 'Site Login' },
  { pattern: /^\/invite\/.*$/, title: 'Join Studio' },
  { pattern: /^\/projects\/new$/, title: 'New Project' },
  { pattern: /^\/projects\/[^/]+\/summary$/, title: 'Summary Sheet' },
  { pattern: /^\/projects\/[^/]+$/, title: 'Project Details' },
  { pattern: /^\/projects$/, title: 'Projects' },
  { pattern: /^\/inventory$/, title: 'Inventory' },
  { pattern: /^\/bills$/, title: 'Bills' },
  { pattern: /^\/team$/, title: 'Team' },
  { pattern: /^\/settings$/, title: 'Settings' },
  { pattern: /^\/app\/received$/, title: 'Material Received' },
  { pattern: /^\/app\/used$/, title: 'Material Used' },
  { pattern: /^\/app\/progress$/, title: 'Progress Update' },
  { pattern: /^\/app\/problem$/, title: 'Report a Problem' },
  { pattern: /^\/app\/stock-check$/, title: 'Stock Check' },
  { pattern: /^\/app\/stock$/, title: 'Site Stock' },
  { pattern: /^\/app\/me$/, title: 'My Profile' },
  { pattern: /^\/app$/, title: 'Site Home' },
  { pattern: /^\/$/, title: 'Home' },
];

export const TitleManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const match = ROUTE_TITLES.find((r) => r.pattern.test(location.pathname));
    if (match) {
      document.title = `${match.title} · Bestinterio`;
    } else {
      document.title = 'Bestinterio · StudioOS';
    }
  }, [location.pathname]);

  return null;
};
