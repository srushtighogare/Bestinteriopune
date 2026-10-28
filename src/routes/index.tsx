import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConsoleLayout } from '../layouts/ConsoleLayout';
import { SiteAppLayout } from '../layouts/SiteAppLayout';
import { ConsoleGuard, SiteAppGuard } from './RouteGuards';

// Console Pages
import { HomePage } from '../pages/console/HomePage';
import { ProjectsPage } from '../pages/console/ProjectsPage';
import { ProjectDetailPage } from '../pages/console/ProjectDetailPage';
import { NewProjectPage } from '../pages/console/NewProjectPage';
import { ProjectSummaryPage } from '../pages/console/ProjectSummaryPage';
import { InventoryPage } from '../pages/console/InventoryPage';
import { BillsPage } from '../pages/console/BillsPage';
import { TeamPage } from '../pages/console/TeamPage';
import { SettingsPage } from '../pages/console/SettingsPage';
import { LoginPage } from '../pages/console/LoginPage';

// Site App Pages
import { SiteHomePage } from '../pages/site/SiteHomePage';
import { MaterialReceivedPage } from '../pages/site/MaterialReceivedPage';
import { MaterialUsedPage } from '../pages/site/MaterialUsedPage';
import { ProgressUpdatePage } from '../pages/site/ProgressUpdatePage';
import { ReportProblemPage } from '../pages/site/ReportProblemPage';
import { StockCheckPage } from '../pages/site/StockCheckPage';
import { StockListPage } from '../pages/site/StockListPage';
import { SiteMePage } from '../pages/site/SiteMePage';
import { SiteLoginPage } from '../pages/site/SiteLoginPage';
import { InviteOnboardingPage } from '../pages/site/InviteOnboardingPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Login & Onboarding Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app/login" element={<SiteLoginPage />} />
      <Route path="/invite/:code" element={<InviteOnboardingPage />} />

      {/* Studio Console (Protected: Owner / Manager only) */}
      <Route element={<ConsoleGuard />}>
        <Route path="/" element={<ConsoleLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<NewProjectPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="projects/:id/summary" element={<ProjectSummaryPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Site App (Protected: Worker / Supervisor / Owner / Manager) */}
      <Route element={<SiteAppGuard />}>
        <Route path="/app" element={<SiteAppLayout />}>
          <Route index element={<SiteHomePage />} />
          <Route path="received" element={<MaterialReceivedPage />} />
          <Route path="used" element={<MaterialUsedPage />} />
          <Route path="progress" element={<ProgressUpdatePage />} />
          <Route path="problem" element={<ReportProblemPage />} />
          <Route path="stock-check" element={<StockCheckPage />} />
          <Route path="stock" element={<StockListPage />} />
          <Route path="me" element={<SiteMePage />} />
        </Route>
      </Route>

      {/* 404 Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
