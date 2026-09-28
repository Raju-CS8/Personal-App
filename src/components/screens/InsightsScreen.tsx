import React, { useState } from 'react';
import { TimeHorizon } from '../../types';

interface DayOutput {
  day: string;
  hours: number;
  tasks: number;
  isPeak?: boolean;
}

const WEEK_DATA: DayOutput[] = [
  { day: 'M', hours: 5.2, tasks: 8 },
  { day: 'T', hours: 8.6, tasks: 12, isPeak: true },
  { day: 'W', hours: 6.8, tasks: 9 },
  { day: 'T', hours: 7.4, tasks: 10 },
  { day: 'F', hours: 4.8, tasks: 6 },
  { day: 'S', hours: 2.1, tasks: 2 },
  { day: 'S', hours: 1.6, tasks: 1 },
];

export const InsightsScreen: React.FC = () => {
  const [horizon, setHorizon] = useState<TimeHorizon>('week');
  const [selectedDay, setSelectedDay] = useState<DayOutput>(WEEK_DATA[1]); // Default to Tue Peak
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Dynamic values depending on selected horizon
  const metrics =
    horizon === 'month'
      ? {
          completion: '89%',
          completionDelta: '+2.1% vs last month',
          tasksDone: '194',
          tasksSub: '14 above monthly target',
          focusHours: '142',
          focusSub: '4.7h daily avg',
          peakWindow: '1:30 – 4:30',
        }
      : horizon === 'all'
      ? {
          completion: '94%',
          completionDelta: 'All-time benchmark',
          tasksDone: '1.2k',
          tasksSub: '124 total sprints',
          focusHours: '840',
          focusSub: '5.1h daily avg',
          peakWindow: '2:00 – 5:00',
        }
      : {
          completion: '92%',
          completionDelta: '+4.8% vs last week',
          tasksDone: '48',
          tasksSub: '8 above weekly target',
          focusHours: '34.5',
          focusSub: '4.9h daily avg',
          peakWindow: '2:00 – 5:00',
        };

  const handleOptimize = () => {
    if (isOptimized) return;
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setIsOptimized(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full space-y-4 select-none pb-8">
      {/* Subtle Ambient Glow Background Layer */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-[#181b25] p-4 shadow-xl border border-white/[0.05]">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#bdc2ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Time Horizon Selector */}
        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#8ed5ff] uppercase tracking-wider">
                Executive Performance
              </span>
              <p className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">Weekly Synchrony</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#262a34] text-[#4ee6aa] shadow-sm border border-white/[0.04]">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span className="text-[11px] font-semibold">High Momentum</span>
            </div>
          </div>

          {/* Time Horizon Pill Picker */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0a0e17] mt-1 border border-white/[0.04]">
            <button
              type="button"
              onClick={() => setHorizon('week')}
              className={`py-1.5 px-3 rounded-lg text-center text-[12px] transition-all duration-200 ${
                horizon === 'week'
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-md'
                  : 'text-[#bdc8d1] hover:text-[#dfe2ef]'
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setHorizon('month')}
              className={`py-1.5 px-3 rounded-lg text-center text-[12px] transition-all duration-200 ${
                horizon === 'month'
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-md'
                  : 'text-[#bdc8d1] hover:text-[#dfe2ef]'
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setHorizon('all')}
              className={`py-1.5 px-3 rounded-lg text-center text-[12px] transition-all duration-200 ${
                horizon === 'all'
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-md'
                  : 'text-[#bdc8d1] hover:text-[#dfe2ef]'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Bento Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Completion Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1c1f29] p-4 shadow-md flex flex-col justify-between border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider">
              Completion
            </span>
            <div className="w-8 h-8 rounded-full bg-[#22c990]/20 flex items-center justify-center text-[#4ee6aa]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#dfe2ef] tracking-tight leading-none">
              {metrics.completion}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[#4ee6aa]">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span className="text-[11px] font-semibold">{metrics.completionDelta}</span>
            </div>
          </div>
          <div className="w-full bg-[#31353f] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#4ee6aa] h-full rounded-full transition-all duration-500" style={{ width: metrics.completion }} />
          </div>
        </div>

        {/* Metric 2: Tasks Done */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1c1f29] p-4 shadow-md flex flex-col justify-between border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider">
              Tasks Done
            </span>
            <div className="w-8 h-8 rounded-full bg-[#38bdf8]/20 flex items-center justify-center text-[#8ed5ff]">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#dfe2ef] tracking-tight leading-none">
              {metrics.tasksDone}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[#8ed5ff]">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span className="text-[11px] font-semibold">{metrics.tasksSub}</span>
            </div>
          </div>
          <div className="w-full bg-[#31353f] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#38bdf8] h-full rounded-full transition-all duration-500" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Metric 3: Focus Hours */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1c1f29] p-4 shadow-md flex flex-col justify-between border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider">
              Deep Focus
            </span>
            <div className="w-8 h-8 rounded-full bg-[#2f3aa3]/30 flex items-center justify-center text-[#bdc2ff]">
              <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#dfe2ef] tracking-tight leading-none">
              {metrics.focusHours}
              <span className="text-[18px] ml-1 text-[#bdc8d1] font-semibold">h</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[#bdc2ff]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span className="text-[11px] font-semibold">{metrics.focusSub}</span>
            </div>
          </div>
          <div className="w-full bg-[#31353f] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#bdc2ff] h-full rounded-full transition-all duration-500" style={{ width: '86%' }} />
          </div>
        </div>

        {/* Metric 4: Peak Velocity Window */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1c1f29] p-4 shadow-md flex flex-col justify-between border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider">
              Peak Velocity
            </span>
            <div className="w-8 h-8 rounded-full bg-[#31353f] flex items-center justify-center text-[#7bd0ff]">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[20px] font-bold text-[#dfe2ef] tracking-tight">
              {metrics.peakWindow}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[#bdc8d1]">
              <span className="material-symbols-outlined text-[14px] text-[#4ee6aa]">wb_twilight</span>
              <span className="text-[11px] font-semibold">Afternoon Surge</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="h-1.5 flex-1 rounded-full bg-[#31353f]" />
            <span className="h-1.5 flex-1 rounded-full bg-[#31353f]" />
            <span className="h-2 flex-[2] rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span className="h-1.5 flex-1 rounded-full bg-[#31353f]" />
          </div>
        </div>
      </div>

      {/* Interactive Weekly Velocity Bar Chart */}
      <div className="rounded-2xl bg-[#1c1f29] p-4 shadow-md relative overflow-hidden border border-white/[0.04]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider">
              Velocity Dynamics
            </span>
            <h2 className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">
              Daily Output vs Benchmark
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
              <span className="text-[11px] text-[#bdc8d1]">Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#87929a]" />
              <span className="text-[11px] text-[#bdc8d1]">Goal</span>
            </div>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="relative w-full h-44 mt-2">
          {/* Milestone Reference Dash line */}
          <div className="absolute inset-x-0 top-[35%] flex items-center gap-1 z-10 pointer-events-none">
            <div className="flex-1 border-t border-dashed border-[#3e484f]" />
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#262a34] text-[#bdc8d1]">
              Target: 7.0h
            </span>
          </div>

          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 140">
            <defs>
              <linearGradient id="velocityGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#bdc2ff" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="velocityGlowPeak" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#4ee6aa" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>
              <filter height="140%" id="glowFilter" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Vertical bars (Mon - Sun) */}
            {WEEK_DATA.map((item, index) => {
              const xPositions = [14, 58, 102, 146, 190, 234, 278];
              const heights = [72, 110, 88, 96, 64, 32, 24];
              const yPositions = [58, 20, 42, 34, 66, 98, 106];
              const x = xPositions[index];
              const h = heights[index];
              const y = yPositions[index];
              const isSelected = selectedDay.day === item.day;

              return (
                <g
                  key={index}
                  className="cursor-pointer group"
                  onClick={() => setSelectedDay(item)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={22}
                    height={h}
                    rx={6}
                    fill={item.isPeak ? 'url(#velocityGlowPeak)' : 'url(#velocityGlow)'}
                    filter={item.isPeak ? 'url(#glowFilter)' : undefined}
                    opacity={isSelected ? 1 : item.isPeak ? 0.95 : 0.75}
                    className={`transition-all duration-300 group-hover:opacity-100 ${
                      isSelected ? 'stroke-2 stroke-white/50' : ''
                    }`}
                  />
                  {item.isPeak && <circle cx={x + 11} cy={y - 6} r={3} fill="#4ee6aa" />}
                  <text
                    x={x + 11}
                    y={136}
                    textAnchor="middle"
                    fill={isSelected ? '#8ed5ff' : '#87929a'}
                    className={`text-[10px] ${isSelected || item.isPeak ? 'font-bold' : ''}`}
                  >
                    {item.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Micro-interaction feedback strip */}
        <div className="mt-2 p-2.5 rounded-xl bg-[#0a0e17] flex items-center justify-between text-[#dfe2ef] border border-white/[0.04]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#4ee6aa]">touch_app</span>
            <span className="text-[13px] text-[#bdc8d1]">
              {selectedDay.day} output: {selectedDay.tasks} completed
            </span>
          </div>
          <span className="text-[12px] text-[#8ed5ff] font-bold">
            {selectedDay.isPeak ? 'Tue Peak: ' : ''}
            {selectedDay.hours}h
          </span>
        </div>
      </div>

      {/* Category Breakdown Horizontal Split Bar & Legend */}
      <div className="rounded-2xl bg-[#1c1f29] p-4 shadow-md space-y-3 border border-white/[0.04]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider">
            Time Allocation
          </span>
          <span className="text-[12px] text-[#bdc2ff] font-semibold">100% Accounted</span>
        </div>

        {/* Segmented Fluid Bar */}
        <div className="w-full h-3.5 rounded-full overflow-hidden flex gap-1 p-0.5 bg-[#0a0e17] border border-white/[0.04]">
          <div className="h-full rounded-full bg-[#38bdf8] shadow-sm transition-all duration-300" style={{ width: '45%' }} title="Work 45%" />
          <div className="h-full rounded-full bg-[#bdc2ff] shadow-sm transition-all duration-300" style={{ width: '25%' }} title="Learning 25%" />
          <div className="h-full rounded-full bg-[#4ee6aa] shadow-sm transition-all duration-300" style={{ width: '18%' }} title="Fitness 18%" />
          <div className="h-full rounded-full bg-[#353943] transition-all duration-300" style={{ width: '12%' }} title="Admin 12%" />
        </div>

        {/* Badges Row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181b25] border border-white/[0.03]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shrink-0" />
              <span className="text-[13px] text-[#dfe2ef] truncate font-medium">Deep Work</span>
            </div>
            <span className="text-[12px] text-[#8ed5ff] font-bold">45%</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181b25] border border-white/[0.03]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bdc2ff] shrink-0" />
              <span className="text-[13px] text-[#dfe2ef] truncate font-medium">Learning</span>
            </div>
            <span className="text-[12px] text-[#bdc2ff] font-bold">25%</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181b25] border border-white/[0.03]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ee6aa] shrink-0" />
              <span className="text-[13px] text-[#dfe2ef] truncate font-medium">Fitness & Well</span>
            </div>
            <span className="text-[12px] text-[#4ee6aa] font-bold">18%</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181b25] border border-white/[0.03]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#87929a] shrink-0" />
              <span className="text-[13px] text-[#dfe2ef] truncate font-medium">Admin & Ops</span>
            </div>
            <span className="text-[12px] text-[#bdc8d1] font-bold">12%</span>
          </div>
        </div>
      </div>

      {/* AI Productivity Coach Insight Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#262a34] via-[#1c1f29] to-[#181b25] p-4 shadow-xl border border-white/[0.05]">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#38bdf8]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#38bdf8]/20 flex items-center justify-center text-[#8ed5ff]">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
              </div>
              <span className="text-[12px] text-[#8ed5ff] tracking-wide uppercase font-bold">
                Aura AI Synthesizer
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0a0e17] text-[#4ee6aa] font-medium border border-white/[0.05]">
              98% Confidence
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">
              Circadian Rhythm Alignment
            </h3>
            <p className="text-[14px] text-[#bdc8d1] leading-relaxed">
              Your focus velocity systematically peaks on{' '}
              <span className="text-[#dfe2ef] font-semibold">Tuesday mornings</span>. Consider auto-blocking
              high-effort architectural tasks between{' '}
              <span className="text-[#8ed5ff] font-semibold">9:00 AM & 11:30 AM</span> to leverage neural prime time.
            </p>
          </div>

          {/* Action Prompt */}
          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={handleOptimize}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all ${
                isOptimized
                  ? 'bg-[#22c990] text-[#003825]'
                  : 'bg-gradient-to-r from-[#38bdf8] to-[#bdc2ff] text-[#0a0e17]'
              }`}
            >
              {isOptimizing ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  <span>Syncing Calendar...</span>
                </>
              ) : isOptimized ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Calendar Optimized!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                  <span>Optimize Tomorrow</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Bookmark insight"
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                isBookmarked ? 'bg-[#38bdf8]/20 text-[#8ed5ff]' : 'bg-[#0a0e17] text-[#bdc8d1] hover:text-[#dfe2ef]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Micro Visual: Habit & Recovery Balance */}
      <div className="rounded-2xl bg-[#1c1f29] p-4 shadow-md flex items-center justify-between border border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#181b25] flex items-center justify-center text-[#4ee6aa]">
            <span className="material-symbols-outlined text-[26px]">self_improvement</span>
          </div>
          <div>
            <p className="text-[17px] font-semibold text-[#dfe2ef]">Cognitive Recovery</p>
            <p className="text-[13px] text-[#bdc8d1]">Fatigue index remains low (14%)</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[20px] text-[#4ee6aa] font-bold">Optimal</span>
          <p className="text-[11px] text-[#bdc8d1]">Sleep link sync'd</p>
        </div>
      </div>
    </div>
  );
};
