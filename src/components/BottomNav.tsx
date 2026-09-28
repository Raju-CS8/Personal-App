import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenQuickAdd: () => void;
  alertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
  alertsCount = 0,
}) => {
  return (
    <div className="fixed bottom-0 w-full z-40 pointer-events-none pb-safe">
      <div className="px-5 pb-4 w-full flex justify-center">
        <nav
          className="pointer-events-auto w-full max-w-md h-16 rounded-full bg-[#0a0e17]/85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between px-4 ring-1 ring-white/10"
          role="navigation"
          aria-label="Main Navigation"
        >
          {/* Left items: Today & Tasks */}
          <div className="flex items-center justify-around flex-1">
            <button
              onClick={() => onSelectTab('today')}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-all ${
                activeTab === 'today'
                  ? 'text-[#8ed5ff] font-semibold scale-105'
                  : 'text-[#87929a] hover:text-[#dfe2ef]'
              }`}
              aria-current={activeTab === 'today' ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'today' ? "'FILL' 1" : "'FILL' 0" }}
              >
                wb_sunny
              </span>
              <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Today</span>
            </button>

            <button
              onClick={() => onSelectTab('tasks')}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-all ${
                activeTab === 'tasks'
                  ? 'text-[#8ed5ff] font-semibold scale-105'
                  : 'text-[#87929a] hover:text-[#dfe2ef]'
              }`}
              aria-current={activeTab === 'tasks' ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'tasks' ? "'FILL' 1" : "'FILL' 0" }}
              >
                check_circle
              </span>
              <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Tasks</span>
            </button>
          </div>

          {/* Center Quick Add Action */}
          <div className="flex items-center justify-center px-2">
            <button
              onClick={onOpenQuickAdd}
              aria-label="Quick Add Task or Thought"
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#bdc2ff] flex items-center justify-center text-[#0a0e17] shadow-[0_0_24px_-4px_rgba(56,189,248,0.6)] hover:shadow-[0_0_28px_rgba(56,189,248,0.8)] active:scale-95 transition-all group"
            >
              <span className="material-symbols-outlined text-[24px] font-bold group-hover:rotate-90 transition-transform duration-200">
                add
              </span>
            </button>
          </div>

          {/* Right items: Alerts & Insights */}
          <div className="flex items-center justify-around flex-1">
            <button
              onClick={() => onSelectTab('alerts')}
              className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-all ${
                activeTab === 'alerts'
                  ? 'text-[#8ed5ff] font-semibold scale-105'
                  : 'text-[#87929a] hover:text-[#dfe2ef]'
              }`}
              aria-current={activeTab === 'alerts' ? 'page' : undefined}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: activeTab === 'alerts' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  notifications_active
                </span>
                {alertsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-1 rounded-full bg-[#f43f5e] text-white text-[9px] font-bold flex items-center justify-center">
                    {alertsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Alerts</span>
            </button>

            <button
              onClick={() => onSelectTab('insights')}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-all ${
                activeTab === 'insights'
                  ? 'text-[#8ed5ff] font-semibold scale-105'
                  : 'text-[#87929a] hover:text-[#dfe2ef]'
              }`}
              aria-current={activeTab === 'insights' ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'insights' ? "'FILL' 1" : "'FILL' 0" }}
              >
                insights
              </span>
              <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Insights</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};
