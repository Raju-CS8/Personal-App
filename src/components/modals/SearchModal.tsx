import React, { useState, useMemo } from 'react';
import { Task, AlertItem, CalendarEvent } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  alerts: AlertItem[];
  syncEvents: CalendarEvent[];
  onSelectTask: (taskId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  alerts,
  syncEvents,
  onSelectTask,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { tasks: [], alerts: [], syncs: [] };
    const q = query.toLowerCase();

    return {
      tasks: tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q)
      ),
      alerts: alerts.filter(
        (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.badgeLabel.toLowerCase().includes(q)
      ),
      syncs: syncEvents.filter((s) => s.title.toLowerCase().includes(q)),
    };
  }, [query, tasks, alerts, syncEvents]);

  if (!isOpen) return null;

  const totalResults =
    searchResults.tasks.length + searchResults.alerts.length + searchResults.syncs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-md transition-all">
      <div
        className="w-full max-w-md bg-[#181b25] rounded-2xl border border-white/10 shadow-2xl p-4 flex flex-col space-y-3 max-h-[80vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#0a0e17] border border-white/10 focus-within:border-[#38bdf8]">
          <span className="material-symbols-outlined text-[20px] text-[#8ed5ff]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, syncs, insights..."
            className="w-full bg-transparent text-[14px] text-[#dfe2ef] placeholder:text-[#87929a] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#87929a] hover:text-[#dfe2ef] p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[12px] text-[#bdc8d1] font-semibold hover:text-[#dfe2ef] px-1.5 py-0.5 rounded bg-[#262a34]"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-[#87929a] space-y-2">
              <span className="material-symbols-outlined text-[28px] text-[#31353f]">manage_search</span>
              <p className="text-[13px]">Type keywords like "Design", "Sprint", "Review", or "Sync"</p>
              <div className="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
                {['#Design', 'Sprint Review', 'Quarterly', 'Tokens'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-[#87929a]">
              <p className="text-[14px]">No matches found for "{query}"</p>
            </div>
          ) : (
            <>
              {/* Tasks Matches */}
              {searchResults.tasks.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#8ed5ff] uppercase tracking-wider block">
                    Tasks ({searchResults.tasks.length})
                  </span>
                  {searchResults.tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectTask(t.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-[#1c1f29] hover:bg-[#262a34] transition-colors cursor-pointer flex items-center justify-between gap-2 border border-white/[0.03]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#31353f] text-[#bdc8d1]">
                            {t.tag}
                          </span>
                          <span className="text-[13px] text-[#dfe2ef] font-medium truncate">
                            {t.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#87929a] truncate mt-0.5">{t.description}</p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-[#87929a]">
                        chevron_right
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sync Events Matches */}
              {searchResults.syncs.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#bdc2ff] uppercase tracking-wider block">
                    Syncs ({searchResults.syncs.length})
                  </span>
                  {searchResults.syncs.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-xl bg-[#1c1f29] flex items-center justify-between gap-2 border border-white/[0.03]"
                    >
                      <div>
                        <span className="text-[13px] text-[#dfe2ef] font-medium">{s.title}</span>
                        <p className="text-[11px] text-[#bdc8d1]">{s.time} • {s.duration}</p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-[#bdc2ff]">event</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts Matches */}
              {searchResults.alerts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#ffb4ab] uppercase tracking-wider block">
                    Alerts ({searchResults.alerts.length})
                  </span>
                  {searchResults.alerts.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-xl bg-[#1c1f29] flex items-center justify-between gap-2 border border-white/[0.03]"
                    >
                      <div className="min-w-0">
                        <span className="text-[13px] text-[#dfe2ef] font-medium truncate block">
                          {a.title}
                        </span>
                        <p className="text-[11px] text-[#87929a] truncate">{a.description}</p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">notifications</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
