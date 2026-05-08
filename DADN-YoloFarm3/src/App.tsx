import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Overview } from './components/Overview';
import { HistoryView } from './components/History';
import { ExportModal } from './components/ExportModal';
import { LayoutDashboard, History as HistoryIcon, Settings } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = React.useState<'overview' | 'history'>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onExportClick={() => setIsExportModalOpen(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto w-full">
          {currentView === 'overview' ? <Overview /> : <HistoryView />}
        </main>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl flex justify-around py-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-outline-variant/10">
        <button 
          onClick={() => setCurrentView('overview')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'overview' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('history')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'history' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <HistoryIcon size={20} />
          <span className="text-[10px] font-bold uppercase">History</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <Settings size={20} />
          <span className="text-[10px] font-bold uppercase">Settings</span>
        </button>
      </nav>
    </div>
  );
}
