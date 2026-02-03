import React, { useState } from 'react';
import Layout from '@/components/layouts/Layout';
import BottomNavigation from '@/components/ui/BottomNavigation';
import HomePage from '@/components/pages/HomePage';
import MaterialsPage from '@/components/pages/MaterialsPage';
import WeekPlanPage from '@/components/pages/WeekPlanPage';
import CheckInPage from '@/components/pages/CheckInPage';
import IdeasPage from '@/components/pages/IdeasPage';
import SettingsPage from '@/components/pages/SettingsPage';
import { PageType } from '@/types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <Layout>
      {/* 頁面內容 */}
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}
      {currentPage === 'materials' && (
        <MaterialsPage onBack={handleBack} />
      )}
      {currentPage === 'weekplan' && (
        <WeekPlanPage onBack={handleBack} />
      )}
      {currentPage === 'checkin' && (
        <CheckInPage onBack={handleBack} />
      )}
      {currentPage === 'ideas' && (
        <IdeasPage onBack={handleBack} />
      )}
      {currentPage === 'settings' && (
        <SettingsPage onBack={handleBack} />
      )}

      {/* 底部導航 */}
      <BottomNavigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
    </Layout>
  );
}
