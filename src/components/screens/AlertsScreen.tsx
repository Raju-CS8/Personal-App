import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { useParticleBurst } from '../ParticleBurst';

interface AlertsScreenProps {
  alerts: AlertItem[];
  onDismissAlert: (id: string) => void;
  onCompleteAlert: (id: string, e: React.MouseEvent) => void;
  onClearAllAlerts: () => void;
  onOpenChecklistModal?: () => void;
  onViewAnalytics?: () => void;
}

type AlertTab = 'all' | 'due' | 'nudges' | 'milestones';

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onDismissAlert,
  onCompleteAlert,
  onClearAllAlerts,
  onOpenChecklistModal,
  onViewAnalytics,
}) => {
  const { triggerBurst } = useParticleBurst();
  const [activeTab, setActiveTab] = useState<AlertTab>('all');
  const [snoozedAlerts, setSnoozedAlerts] = useState<Record<string, boolean>>({});
  const [quietHoursActive, setQuietHoursActive] = useState(true);

  const handleSnooze = (id: string) => {
    setSnoozedAlerts((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleActionComplete = (id: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    onCompleteAlert(id, e);
  };

  const filteredAlerts = alerts.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const dueSoonCount = alerts.filter((a) => a.category === 'due').length;
  const nudgesCount = alerts.filter((a) => a.category === 'nudges').length;
  const milestonesCount = alerts.filter((a) => a.category === 'milestones').length;

  return (
    <div className="flex flex-col w-full space-y-4 select-none pb-8">
      {/* Quiet Hours Ambient Pill */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-[#181b25] shadow-sm border border-white/[0.04]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="material-symbols-outlined text-[18px] text-[#bdc2ff] shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bedtime
          </span>
          <span className="text-[13px] text-[#bdc8d1] truncate">
            {quietHoursActive ? (
              <>
                Quiet hours active until <strong className="font-semibold text-[#dfe2ef]">8:00 AM</strong>
              </>
            ) : (
              'Quiet hours disabled'
            )}
          </span>
        </div>
        <button
          onClick={() => setQuietHoursActive(!quietHoursActive)}
          aria-label="Adjust quiet hours"
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#31353f] text-[#bdc8d1] hover:text-[#dfe2ef] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
        </button>
      </div>

      {/* Hero Header & Status Cluster */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#93000a]/40 text-[#ffb4ab] border border-[#f43f5e]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-ping" />
            <span className="text-[11px] font-bold tracking-wide uppercase">
              {alerts.length} Actionable
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262a34] text-[#8ed5ff]">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span className="text-[11px] font-semibold">Smart Digest</span>
          </div>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={onClearAllAlerts}
            className="text-[11px] font-semibold text-[#bdc8d1] hover:text-[#8ed5ff] active:scale-95 transition-colors"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 shadow-sm transition-all ${
            activeTab === 'all'
              ? 'bg-[#38bdf8] text-[#00354a]'
              : 'bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef]'
          }`}
        >
          All <span className="ml-1 opacity-80">({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('due')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-all ${
            activeTab === 'due'
              ? 'bg-[#38bdf8] text-[#00354a]'
              : 'bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef]'
          }`}
        >
          Due Soon <span className="ml-1 opacity-60">({dueSoonCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('nudges')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-all ${
            activeTab === 'nudges'
              ? 'bg-[#38bdf8] text-[#00354a]'
              : 'bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef]'
          }`}
        >
          Smart Nudges <span className="ml-1 opacity-60">({nudgesCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-all ${
            activeTab === 'milestones'
              ? 'bg-[#38bdf8] text-[#00354a]'
              : 'bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef]'
          }`}
        >
          Milestones <span className="ml-1 opacity-60">({milestonesCount})</span>
        </button>
      </div>

      {/* Real-Time Alerts Feed */}
      <div className="flex flex-col space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-[#181b25] border border-white/[0.04]">
            <div className="w-14 h-14 rounded-full bg-[#1c1f29] flex items-center justify-center text-[#bdc8d1] mb-3">
              <span className="material-symbols-outlined text-[28px]">notifications_paused</span>
            </div>
            <h3 className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">You're All Caught Up!</h3>
            <p className="text-[13px] text-[#bdc8d1] max-w-xs mt-1">
              No urgent actions pending. Enjoy uninterrupted flow or review your weekly roadmap.
            </p>
          </div>
        ) : (
          filteredAlerts.map((item) => {
            const isSnoozed = snoozedAlerts[item.id];

            // Card 1: Urgent Sprint Review
            if (item.badgeType === 'urgent') {
              return (
                <div
                  key={item.id}
                  className={`group relative w-full rounded-2xl bg-[#1c1f29] p-4 shadow-xl overflow-hidden transition-all duration-300 border border-white/[0.05] ${
                    isSnoozed ? 'opacity-40 scale-[0.98]' : ''
                  }`}
                >
                  {/* Ambient Glow Scrim */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#f43f5e]/15 blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#93000a]/50 text-[#ffb4ab] flex items-center justify-center shrink-0 shadow-sm border border-[#f43f5e]/30">
                          <span className="material-symbols-outlined text-[18px]">alarm</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] uppercase tracking-wide text-[#ffb4ab] font-bold">
                              {item.badgeLabel}
                            </span>
                            <span className="text-[#bdc8d1]">•</span>
                            <span className="text-[11px] text-[#ffb4ab] font-semibold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">schedule</span>
                              {item.badgeSub}
                            </span>
                          </div>
                          <h2 className="text-[18px] font-semibold text-[#dfe2ef] mt-0.5 tracking-tight">
                            {item.title}
                          </h2>
                        </div>
                      </div>

                      <button
                        onClick={() => onDismissAlert(item.id)}
                        aria-label="Dismiss alert"
                        className="text-[#bdc8d1] hover:text-[#dfe2ef] p-1 rounded-full active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    <p className="text-[13px] text-[#bdc8d1] leading-relaxed">{item.description}</p>

                    {/* Contextual Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={(e) => handleActionComplete(item.id, e)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#38bdf8] text-[#00354a] text-[12px] font-bold shadow-sm active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span> Mark Done
                      </button>

                      <button
                        onClick={() => handleSnooze(item.id)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#262a34] text-[#dfe2ef] text-[12px] font-medium active:scale-95 transition-transform hover:bg-[#31353f]"
                      >
                        <span className="material-symbols-outlined text-[16px]">snooze</span>
                        {isSnoozed ? 'Snoozed' : '+15m'}
                      </button>

                      <button
                        onClick={() => handleSnooze(item.id)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#262a34] text-[#dfe2ef] text-[12px] font-medium active:scale-95 transition-transform hover:bg-[#31353f]"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit_calendar</span> Shift
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Card 2: Streak Protection
            if (item.badgeType === 'streak') {
              return (
                <div
                  key={item.id}
                  className="group relative w-full rounded-2xl bg-[#1c1f29] p-4 shadow-xl overflow-hidden transition-all duration-300 border border-white/[0.05]"
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#38bdf8]/15 blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#262a34] text-[#8ed5ff] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                        </div>
                        <div>
                          <span className="text-[11px] uppercase tracking-wide text-[#8ed5ff] font-bold">
                            {item.badgeLabel}
                          </span>
                          <h2 className="text-[18px] font-semibold text-[#dfe2ef] mt-0.5 tracking-tight">
                            {item.title}
                          </h2>
                        </div>
                      </div>

                      <span className="text-[11px] text-[#bdc8d1] font-semibold bg-[#31353f] px-2.5 py-0.5 rounded-full">
                        🔥 {item.streakInfo?.days || 15} Days
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#181b25] p-3 border border-white/[0.03]">
                      <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-[#31353f]"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          />
                          <path
                            className="text-[#38bdf8]"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray="67, 100"
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-bold text-[#8ed5ff]">
                          {item.streakInfo?.current}/{item.streakInfo?.total}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-[#dfe2ef] truncate font-medium">
                          {item.streakInfo?.taskName || 'Deep Work Journaling'}
                        </p>
                        <p className="text-[11px] text-[#bdc8d1] truncate">
                          {item.streakInfo?.subtext || 'Only 1 micro-task away before 9 PM'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <span className="text-[11px] text-[#bdc8d1] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        {item.streakInfo?.resetText || 'Resets at 9:00 PM'}
                      </span>
                      <button
                        onClick={(e) => handleActionComplete(item.id, e)}
                        className="px-4 py-2 rounded-xl bg-[#8ed5ff] text-[#00354a] text-[12px] font-bold shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
                      >
                        <span>Complete Now</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Card 3: Geo-Trigger
            if (item.badgeType === 'geo') {
              return (
                <div
                  key={item.id}
                  className="group relative w-full rounded-2xl bg-[#1c1f29] p-4 shadow-xl overflow-hidden transition-all duration-300 border border-white/[0.05]"
                >
                  <div className="relative z-10 flex flex-col space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#262a34] text-[#bdc2ff] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] uppercase tracking-wide text-[#bdc2ff] font-bold">
                              {item.badgeLabel}
                            </span>
                            <span className="text-[#bdc8d1]">•</span>
                            <span className="text-[11px] text-[#bdc8d1]">{item.badgeSub}</span>
                          </div>
                          <h2 className="text-[18px] font-semibold text-[#dfe2ef] mt-0.5 tracking-tight">
                            {item.title}
                          </h2>
                        </div>
                      </div>

                      <button
                        onClick={() => onDismissAlert(item.id)}
                        aria-label="Dismiss alert"
                        className="text-[#bdc8d1] hover:text-[#dfe2ef] p-1 rounded-full active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    {/* Location Visual Preview via Map Data */}
                    <div
                      className="w-full h-24 rounded-xl bg-cover bg-center overflow-hidden relative shadow-inner border border-white/[0.08]"
                      style={{
                        backgroundImage: `url('${item.geoInfo?.bgImage}')`,
                      }}
                    >
                      <div className="absolute inset-0 bg-[#0a0e17]/50 backdrop-blur-[2px] flex items-center justify-between px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1c1f29]/80 flex items-center justify-center text-[#8ed5ff]">
                            <span className="material-symbols-outlined text-[20px]">storefront</span>
                          </div>
                          <div>
                            <p className="text-[13px] text-[#dfe2ef] font-semibold">
                              {item.geoInfo?.locationName}
                            </p>
                            <p className="text-[11px] text-[#bdc8d1]">{item.geoInfo?.distance}</p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-[#1c1f29]/90 text-[#dfe2ef] text-[11px] font-medium border border-white/10">
                          {item.geoInfo?.itemCount} items
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={onOpenChecklistModal}
                        className="flex-1 py-2 rounded-xl bg-[#262a34] text-[#dfe2ef] text-[12px] font-medium active:scale-95 transition-transform flex items-center justify-center gap-1.5 hover:bg-[#31353f]"
                      >
                        <span className="material-symbols-outlined text-[16px]">checklist</span> Open Checklist
                      </button>
                      <button
                        onClick={() => onDismissAlert(item.id)}
                        className="px-3 py-2 rounded-xl bg-[#31353f] text-[#bdc8d1] hover:text-[#dfe2ef] text-[12px] font-medium active:scale-95 transition-transform"
                      >
                        Mute Location
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Card 4: Daily Insight & Milestone
            return (
              <div
                key={item.id}
                className="group relative w-full rounded-2xl bg-[#1c1f29] p-4 shadow-xl overflow-hidden transition-all duration-300 border border-white/[0.05]"
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#4ee6aa]/15 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#22c990]/25 text-[#4ee6aa] flex items-center justify-center shrink-0 border border-[#4ee6aa]/20">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] uppercase tracking-wide text-[#4ee6aa] font-bold">
                            {item.badgeLabel}
                          </span>
                          <span className="text-[#bdc8d1]">•</span>
                          <span className="text-[11px] text-[#bdc8d1]">{item.badgeSub}</span>
                        </div>
                        <h2 className="text-[18px] font-semibold text-[#dfe2ef] mt-0.5 tracking-tight">
                          {item.title}
                        </h2>
                      </div>
                    </div>

                    <button
                      onClick={() => onDismissAlert(item.id)}
                      aria-label="Dismiss alert"
                      className="text-[#bdc8d1] hover:text-[#dfe2ef] p-1 rounded-full active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <p className="text-[13px] text-[#bdc8d1] leading-relaxed">
                    You cleared 7 high-leverage tasks today. Velocity is{' '}
                    <strong className="text-[#4ee6aa] font-semibold">+24% higher</strong> than your rolling average.
                  </p>

                  {/* Mini Metric Bento */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#181b25] border border-white/[0.03]">
                      <span className="text-[18px] font-bold text-[#8ed5ff]">
                        {item.metrics?.flowHours || '5.8h'}
                      </span>
                      <span className="text-[11px] text-[#bdc8d1]">Deep Flow</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#181b25] border border-white/[0.03]">
                      <span className="text-[18px] font-bold text-[#4ee6aa]">
                        {item.metrics?.tasksMet || '7/8'}
                      </span>
                      <span className="text-[11px] text-[#bdc8d1]">Tasks Met</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#181b25] border border-white/[0.03]">
                      <span className="text-[18px] font-bold text-[#bdc2ff]">
                        {item.metrics?.onTimeRate || '96%'}
                      </span>
                      <span className="text-[11px] text-[#bdc8d1]">On Time</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={onViewAnalytics}
                      className="flex items-center gap-1 text-[12px] text-[#8ed5ff] font-semibold hover:underline"
                    >
                      View Digest Analytics <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
