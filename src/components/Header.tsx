import React from 'react';
import { ASSETS } from '../data/initialData';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  unreadAlertsCount: number;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  unreadAlertsCount,
  onOpenSearch,
  onOpenSettings,
  onOpenProfile,
  onNavigateTab,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'today':
        return 'Today';
      case 'tasks':
        return 'Tasks';
      case 'alerts':
        return 'Alerts';
      case 'insights':
        return 'Insights';
      default:
        return 'Today';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#0f131c]/85 backdrop-blur-xl border-b border-white/[0.04] shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
      <div className="max-w-md mx-auto h-16 px-5 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="Aura Brand Logo"
            className="h-8 w-auto object-contain shrink-0 rounded-lg shadow-sm"
            src={ASSETS.logo}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-[#87929a] uppercase tracking-wider truncate">
              Aura Flow
            </span>
            <h1 className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight truncate leading-tight">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#bdc8d1] hover:text-[#dfe2ef] hover:bg-white/[0.05] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          
          <button
            onClick={onOpenSettings}
            aria-label="Filter & settings"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#bdc8d1] hover:text-[#dfe2ef] hover:bg-white/[0.05] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          <button
            onClick={() => onNavigateTab('alerts')}
            aria-label="Notifications"
            className="w-10 h-10 relative flex items-center justify-center rounded-full text-[#bdc8d1] hover:text-[#dfe2ef] hover:bg-white/[0.05] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              {unreadAlertsCount > 0 ? 'notifications' : 'notifications_none'}
            </span>
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#38bdf8] ring-2 ring-[#0f131c] shadow-[0_0_8px_#38bdf8]" />
            )}
          </button>

          <div className="pl-1 flex items-center">
            <button
              onClick={onOpenProfile}
              aria-label="View user profile"
              className="relative rounded-full ring-1 ring-white/15 hover:ring-[#38bdf8]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#38bdf8] active:scale-95"
            >
              <img
                alt="Elena Vance Profile"
                className="w-8 h-8 rounded-full object-cover"
                src={ASSETS.avatar}
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#4ee6aa] ring-1 ring-[#0f131c]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
