import React from 'react';
import AppLayout from '@/components/AppLayout';
import HubHeader from './components/HubHeader';
import FeaturedScenario from './components/FeaturedScenario';
import ScenarioGrid from './components/ScenarioGrid';
import LeaderboardPanel from './components/LeaderboardPanel';

export default function ScenarioHubPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-6">
          <HubHeader />
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <FeaturedScenario />
              <ScenarioGrid />
            </div>
            <div className="xl:col-span-1">
              <LeaderboardPanel />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}