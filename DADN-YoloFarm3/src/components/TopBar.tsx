import React from 'react';
import { UserCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TopBarProps {
  currentView: 'overview' | 'history';
  onViewChange: (view: 'overview' | 'history') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-surface/70 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant/10">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-extrabold text-primary font-headline md:hidden">YoloFarm3</div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onViewChange('overview')}
            className={cn(
              "font-medium transition-all pb-1",
              currentView === 'overview' 
                ? "text-on-surface border-b-2 border-primary" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => onViewChange('history')}
            className={cn(
              "font-medium transition-all pb-1",
              currentView === 'history' 
                ? "text-on-surface border-b-2 border-primary" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            History
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <UserCircle className="text-on-surface" size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
