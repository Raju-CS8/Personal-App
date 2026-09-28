import React, { useState, useEffect } from 'react';
import { Task, CalendarEvent, PriorityLevel } from '../../types';
import { DAYS_HORIZON } from '../../data/initialData';
import { useParticleBurst } from '../ParticleBurst';

interface TodayScreenProps {
  tasks: Task[];
  onToggleTask: (taskId: string, e?: React.MouseEvent) => void;
  onAddTask: (task: Partial<Task>) => void;
  syncEvents: CalendarEvent[];
  onToggleChime: (eventId: string) => void;
  activeDay: string;
  onSelectDay: (date: string) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  syncEvents,
  onToggleChime,
  activeDay,
  onSelectDay,
}) => {
  const { triggerBurst } = useParticleBurst();

  // Pomodoro state
  const [pomoSeconds, setPomoSeconds] = useState(1488); // 24m 48s
  const [isPomoRunning, setIsPomoRunning] = useState(true);

  // Quick intent capture state
  const [quickInput, setQuickInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>('medium');
  const [inputFeedback, setInputFeedback] = useState<string | null>(null);

  // Pomodoro interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomoRunning && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomoRunning, pomoSeconds]);

  const formatPomoTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const horizonTasks = tasks.filter((t) => t.isPriorityHorizon || t.priority === 'urgent' || t.priority === 'high');

  // Calculate flow percentage based on completed tasks
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const flowPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 78;
  const strokeOffset = 188.5 - (188.5 * Math.min(Math.max(flowPercentage, 20), 100)) / 100;

  const handleTaskCheckboxClick = (taskId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
    onToggleTask(taskId, e);
  };

  const handleQuickSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickInput.trim()) return;

    onAddTask({
      title: quickInput.trim(),
      description: 'Captured via Natural Language intent horizon.',
      priority: selectedPriority,
      tag: selectedTag || '#Design',
      category: 'all',
      status: 'in_progress',
      isPriorityHorizon: true,
      durationEstimate: '30m',
    });

    setQuickInput('');
    setSelectedTag(null);
    setInputFeedback('Task registered to horizon.');
    setTimeout(() => setInputFeedback(null), 2200);
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsVoiceActive(!isVoiceActive);
      if (!isVoiceActive) {
        setQuickInput('Refine responsive touch gesture animations');
      }
      return;
    }

    try {
      // @ts-expect-error - webkitSpeechRecognition is standard in webkit
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      if (!isVoiceActive) {
        setIsVoiceActive(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuickInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsVoiceActive(false);
        };
        recognition.onerror = () => setIsVoiceActive(false);
        recognition.onend = () => setIsVoiceActive(false);
      } else {
        recognition.stop();
        setIsVoiceActive(false);
      }
    } catch {
      setIsVoiceActive(!isVoiceActive);
    }
  };

  return (
    <div className="flex flex-col w-full pb-6 space-y-6 select-none">
      {/* Interactive Horizon Day Scroller */}
      <section className="flex flex-col w-full pt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">Thursday</span>
            <span className="text-[13px] text-[#bdc8d1] font-medium">Oct 24</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#262a34] text-[#8ed5ff] border border-white/[0.04]">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="text-[11px] font-semibold tracking-normal">Optimal Rhythm</span>
          </div>
        </div>

        {/* Day Strip with completion dots */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 px-0.5 no-scrollbar">
          {DAYS_HORIZON.map((item) => {
            const isSelected = activeDay === item.date;
            return (
              <button
                key={item.date}
                onClick={() => onSelectDay(item.date)}
                className={`flex flex-col items-center flex-1 py-2 rounded-xl transition-all active:scale-95 ${
                  isSelected
                    ? 'relative bg-gradient-to-b from-[#38bdf8]/25 to-[#262a34] text-[#8ed5ff] shadow-lg shadow-[#38bdf8]/10 ring-1 ring-[#38bdf8]/40'
                    : 'bg-[#181b25] text-[#bdc8d1] hover:bg-[#1c1f29]'
                }`}
              >
                <span className={`text-[11px] uppercase ${isSelected ? 'font-bold text-[#8ed5ff]' : 'opacity-60'}`}>
                  {item.day}
                </span>
                <span className={`text-[18px] my-0.5 ${isSelected ? 'font-bold text-[#8ed5ff]' : 'text-[#dfe2ef]'}`}>
                  {item.date}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected
                      ? 'bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]'
                      : item.completed
                      ? 'bg-[#4ee6aa]'
                      : 'bg-[#3e484f]/40'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Flow State & Pomodoro Bento */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1c1f29] p-4 shadow-xl border border-white/[0.05]">
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#38bdf8]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-[#bdc2ff]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col space-y-4">
          {/* Top Row: Metrics & Progress Ring */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[#bdc2ff] mb-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  spa
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#bdc2ff]">
                  Flow State
                </span>
              </div>
              <span className="text-[32px] font-bold text-[#dfe2ef] tracking-tight leading-none">
                {flowPercentage}%
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[13px] text-[#bdc8d1]">Day Horizon</span>
                <span className="text-[#3e484f]">•</span>
                <span className="text-[11px] font-semibold text-[#4ee6aa] flex items-center gap-0.5">
                  14d streak <span className="text-[12px]">🔥</span>
                </span>
              </div>
            </div>

            {/* Glowing Progress Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
                <circle
                  className="text-[#31353f]"
                  cx="36"
                  cy="36"
                  fill="transparent"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <circle
                  className="text-[#38bdf8] transition-all duration-700 ease-out"
                  cx="36"
                  cy="36"
                  fill="transparent"
                  r="30"
                  stroke="currentColor"
                  strokeDasharray="188.5"
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  strokeWidth="5"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.45))' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span
                  className="material-symbols-outlined text-[#8ed5ff] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cyclone
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Deep Focus Pomodoro Controller */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181b25] border border-white/[0.04]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#2f3aa3]/40 flex items-center justify-center text-[#bdc2ff] shrink-0">
                <span className="material-symbols-outlined text-[18px]">timer</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#bdc8d1]">Deep Focus Session</span>
                <span className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight tabular-nums">
                  {formatPomoTime(pomoSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPomoSeconds(1500)}
                title="Reset to 25m"
                className="w-7 h-7 rounded-full bg-[#262a34] flex items-center justify-center text-[#87929a] hover:text-[#dfe2ef] active:scale-90 transition-all text-xs"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
              </button>
              <button
                onClick={() => setIsPomoRunning(!isPomoRunning)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-[12px] active:scale-95 transition-all shadow-md ${
                  isPomoRunning
                    ? 'bg-[#8ed5ff] text-[#00354a] shadow-[#38bdf8]/20'
                    : 'bg-[#262a34] text-[#bdc8d1] hover:text-[#dfe2ef]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPomoRunning ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPomoRunning ? 'Active' : 'Resume'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Horizon Three Cards */}
      <section className="flex flex-col w-full space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">Priority Horizon</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#262a34] text-[#bdc8d1] text-[11px] font-semibold">
              {horizonTasks.length} Essential
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#8ed5ff]">All Aligned</span>
        </div>

        {/* Task Cards */}
        <div className="flex flex-col space-y-2.5">
          {horizonTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const priorityBadge =
              task.priority === 'urgent' || task.priority === 'high'
                ? { bg: 'bg-[#93000a]/30 text-[#ffb4ab]', text: 'High' }
                : task.priority === 'medium'
                ? { bg: 'bg-[#2f3aa3]/40 text-[#bdc2ff]', text: 'Medium' }
                : { bg: 'bg-[#262a34] text-[#bdc8d1]', text: 'Low' };

            const tagColor =
              task.tag === '#Design'
                ? 'bg-[#262a34] text-[#8ed5ff]'
                : task.tag === '#Sprint'
                ? 'bg-[#262a34] text-[#bdc2ff]'
                : 'bg-[#262a34] text-[#4ee6aa]';

            return (
              <div
                key={task.id}
                className={`group relative flex items-start gap-3 p-3.5 rounded-xl bg-[#1c1f29] hover:bg-[#262a34] transition-all shadow-md border border-white/[0.04] ${
                  isCompleted ? 'opacity-65' : ''
                }`}
              >
                {/* Circular Checkbox */}
                <button
                  onClick={(e) => handleTaskCheckboxClick(task.id, e)}
                  aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                    isCompleted
                      ? 'bg-[#4ee6aa] text-[#003825] shadow-[0_0_10px_#4ee6aa]'
                      : 'bg-[#31353f] text-[#0a0e17] hover:bg-[#38bdf8]/40'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[16px] font-bold transition-opacity ${
                      isCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    }`}
                  >
                    check
                  </span>
                </button>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${priorityBadge.bg}`}>
                      {priorityBadge.text}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${tagColor}`}>
                      {task.tag}
                    </span>
                    {task.durationEstimate && (
                      <span className="text-[13px] text-[#bdc8d1] ml-auto flex items-center gap-0.5 tabular-nums">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {task.durationEstimate}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[15px] font-medium truncate ${
                      isCompleted ? 'line-through text-[#bdc8d1]' : 'text-[#dfe2ef]'
                    }`}
                  >
                    {task.title}
                  </span>
                  <p className="text-[13px] text-[#bdc8d1] mt-0.5 line-clamp-1">{task.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Timeline Syncs */}
      <section className="flex flex-col w-full space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">Upcoming Syncs</h2>
          <span className="text-[11px] font-semibold text-[#bdc8d1]">{syncEvents.length} Sessions Today</span>
        </div>

        <div className="space-y-2">
          {syncEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#1c1f29] shadow-md border border-white/[0.04]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-1.5 h-10 rounded-full shrink-0 ${
                    event.colorType === 'primary' ? 'bg-[#38bdf8]' : 'bg-[#bdc2ff]'
                  }`}
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-semibold ${
                        event.colorType === 'primary' ? 'text-[#8ed5ff]' : 'text-[#bdc2ff]'
                      }`}
                    >
                      {event.time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#3e484f]" />
                    <span className="text-[11px] text-[#bdc8d1]">{event.duration}</span>
                  </div>
                  <span className="text-[15px] text-[#dfe2ef] font-medium truncate">{event.title}</span>
                </div>
              </div>

              <button
                onClick={() => onToggleChime(event.id)}
                aria-label="Toggle sync chime"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  event.chimeActive
                    ? 'bg-[#262a34] text-[#8ed5ff] shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                    : 'bg-[#181b25] text-[#87929a] hover:text-[#dfe2ef]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: event.chimeActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {event.chimeActive ? 'notifications_active' : 'notifications_none'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Task Capture Bar */}
      <section className="flex flex-col w-full space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#bdc8d1]">Intent Capture</span>
          <span className="text-[11px] font-semibold text-[#bdc2ff]">Natural Language</span>
        </div>

        <form
          onSubmit={handleQuickSubmit}
          className="flex flex-col p-2.5 rounded-xl bg-[#262a34] shadow-lg border border-white/[0.06] space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8ed5ff] text-[20px] ml-1">add_circle</span>
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder={
                inputFeedback ||
                (isVoiceActive ? 'Listening for intent...' : 'Capture fleeting thought or horizon task...')
              }
              className="w-full bg-transparent text-[14px] text-[#dfe2ef] placeholder:text-[#87929a] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVoiceToggle}
              aria-label="Voice capture"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isVoiceActive
                  ? 'bg-[#f43f5e]/20 text-[#ffb4ab] ring-1 ring-[#f43f5e] animate-pulse'
                  : 'bg-[#1c1f29] text-[#bdc2ff] hover:text-[#8ed5ff] active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
          </div>

          {/* Quick Chips & Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setQuickInput((prev) => (prev ? `${prev} [Due Today]` : 'Due Today: '))}
                className="px-2.5 py-1 rounded-full bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef] text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[12px]">calendar_today</span> Due Today
              </button>

              <button
                type="button"
                onClick={() => {
                  const tags = ['#Design', '#Sprint', '#Finance', '#Dev'];
                  const nextIndex = selectedTag ? (tags.indexOf(selectedTag) + 1) % tags.length : 0;
                  setSelectedTag(tags[nextIndex]);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all ${
                  selectedTag ? 'bg-[#38bdf8]/20 text-[#8ed5ff]' : 'bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef]'
                }`}
              >
                <span className="material-symbols-outlined text-[12px]">sell</span>
                {selectedTag ? selectedTag : '+Tag'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPriority((prev) => (prev === 'high' ? 'urgent' : prev === 'medium' ? 'high' : 'medium'));
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all ${
                  selectedPriority === 'high' || selectedPriority === 'urgent'
                    ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                    : 'bg-[#1c1f29] text-[#bdc8d1] hover:text-[#dfe2ef]'
                }`}
              >
                <span className="material-symbols-outlined text-[12px]">flag</span>
                {selectedPriority === 'urgent' ? 'Urgent' : selectedPriority === 'high' ? 'High' : 'Priority'}
              </button>
            </div>

            <button
              type="submit"
              disabled={!quickInput.trim()}
              aria-label="Save Task"
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0 ml-2 ${
                quickInput.trim()
                  ? 'bg-[#38bdf8] text-[#0a0e17] cursor-pointer'
                  : 'bg-[#31353f] text-[#87929a] cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">arrow_upward</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
