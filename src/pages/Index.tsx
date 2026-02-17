import React, { useState, useCallback } from 'react';
import TopBar from '@/components/TopBar';
import BaselineProfileCard from '@/components/BaselineProfileCard';
import LogCard from '@/components/LogCard';
import TodaySnapshot from '@/components/TodaySnapshot';
import CumulativeDataCard from '@/components/CumulativeDataCard';
import RecentEntries from '@/components/RecentEntries';
import HistoryDrawer from '@/components/HistoryDrawer';

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onOpenHistory={() => setHistoryOpen(true)} />

      <div className="max-w-[430px] mx-auto px-4 py-3 pb-20 space-y-3">
        <BaselineProfileCard onSave={refresh} />
        <LogCard onSaved={refresh} />
        <TodaySnapshot refreshKey={refreshKey} />
        <CumulativeDataCard />
        <RecentEntries refreshKey={refreshKey} onViewAll={() => setHistoryOpen(true)} />
      </div>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} refreshKey={refreshKey} />
    </div>
  );
};

export default Index;
