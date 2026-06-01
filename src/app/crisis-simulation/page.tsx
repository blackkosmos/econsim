import React from 'react';
import AppLayout from '@/components/AppLayout';
import CrisisSimulationShell from './components/CrisisSimulationShell';

export default function CrisisSimulationPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-950">
        <CrisisSimulationShell />
      </div>
    </AppLayout>
  );
}
