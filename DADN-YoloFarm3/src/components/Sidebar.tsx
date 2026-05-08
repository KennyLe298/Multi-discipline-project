import React from 'react';
import { LayoutDashboard, History, Sprout, Download, HelpCircle, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  currentView: 'overview' | 'history';
  onViewChange: (view: 'overview' | 'history') => void;
  onExportClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onExportClick }) => {
  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 sticky top-0 py-8 gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 border-r border-outline-variant/10">
      <div className="px-6 mb-8">
        <div className="text-2xl font-black text-primary font-headline">YoloFarm3</div>
        <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">Digital Agronomist</div>
      </div>
      
      <nav className="flex flex-col gap-1 px-2">
        <button
          onClick={() => onViewChange('overview')}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm w-full text-left",
            currentView === 'overview' 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-on-surface-variant hover:bg-surface-container"
          )}
        >
          <LayoutDashboard size={20} />
          Overview
        </button>
        
        <button
          onClick={() => onViewChange('history')}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm w-full text-left",
            currentView === 'history' 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-on-surface-variant hover:bg-surface-container"
          )}
        >
          <History size={20} />
          History
        </button>

        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm w-full text-left text-on-surface-variant hover:bg-surface-container"
        >
          <Sprout size={20} />
          Fields
        </button>
      </nav>

      <div className="mt-auto px-4 space-y-4">
        <div className="space-y-1">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
            <HelpCircle size={18} />
            Support
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
            <User size={18} />
            Account
          </button>
        </div>
        
        <button 
          onClick={onExportClick}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <Download size={18} />
          Export Data
        </button>
      </div>
    </aside>
  );
};
