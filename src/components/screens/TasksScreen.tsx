import React, { useState } from 'react';
import { Task, Subtask } from '../../types';
import { useParticleBurst } from '../ParticleBurst';

interface TasksScreenProps {
  tasks: Task[];
  onToggleTask: (taskId: string, e?: React.MouseEvent) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

type SegmentFilter = 'all' | 'in_progress' | 'scheduled' | 'archived';
type CategoryChip = 'all' | 'high' | 'client' | 'personal' | 'deadlines';

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onToggleTask,
  onToggleSubtask,
}) => {
  const { triggerBurst } = useParticleBurst();
  const [segment, setSegment] = useState<SegmentFilter>('all');
  const [category, setCategory] = useState<CategoryChip>('all');
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(true);
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({
    'task-main-1': false,
  });

  const toggleSubtaskAccordion = (taskId: string) => {
    setExpandedSubtasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleCheckboxClick = (taskId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
    onToggleTask(taskId, e);
  };

  // Metrics computation
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const activeTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'archived');
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const scheduledCount = tasks.filter((t) => t.status === 'scheduled').length;
  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 78;

  // Filter active tasks
  const filteredActiveTasks = activeTasks.filter((t) => {
    // Filter by segment
    if (segment === 'in_progress' && t.status !== 'in_progress') return false;
    if (segment === 'scheduled' && t.status !== 'scheduled') return false;
    if (segment === 'archived' && t.status !== 'archived') return false;

    // Filter by category chip
    if (category === 'high' && t.priority !== 'urgent' && t.priority !== 'high') return false;
    if (category === 'client' && t.category !== 'client') return false;
    if (category === 'personal' && t.category !== 'personal') return false;
    if (category === 'deadlines' && !t.dueText?.includes('Today') && !t.dueText?.includes('Tomorrow')) return false;

    return true;
  });

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 select-none">
      {/* Ambient Obsidian Hero Metric Pulse */}
      <div className="w-full rounded-2xl bg-[#181b25] p-4 shadow-xl relative overflow-hidden flex flex-col gap-2 border border-white/[0.05]">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#38bdf8]/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-[#bdc2ff]/10 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#bdc8d1]">
              Active Velocity
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[28px] font-bold text-[#dfe2ef] tracking-tight">
                {completedTasks.length + 11}
              </span>
              <span className="text-[13px] text-[#bdc8d1]">/ {totalTasks + 11} Tasks Complete</span>
            </div>
          </div>

          {/* Tactile Fluid Mini Dial */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
              <circle
                className="text-[#31353f]"
                cx="22"
                cy="22"
                fill="none"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <circle
                className="text-[#22c990]"
                cx="22"
                cy="22"
                fill="none"
                r="18"
                stroke="currentColor"
                strokeDasharray="113.1"
                strokeDashoffset={113.1 - (113.1 * completionPercentage) / 100}
                strokeLinecap="round"
                strokeWidth="3.5"
                style={{ filter: 'drop-shadow(0 0 6px #22c990)' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[12px] font-bold text-[#4ee6aa]">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Micro status stream */}
        <div className="flex items-center gap-2 z-10 pt-1">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#31353f]/80 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#4ee6aa] shadow-[0_0_6px_#4ee6aa]" />
            <span className="text-[11px] font-medium text-[#dfe2ef]">{inProgressCount} In Flight</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#31353f]/80 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
            <span className="text-[11px] font-medium text-[#dfe2ef]">{urgentCount} Urgent</span>
          </div>

          <span className="ml-auto text-[11px] text-[#bdc8d1] flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px] text-[#4ee6aa]">bolt</span> +12% vs yesterday
          </span>
        </div>
      </div>

      {/* 1. Segmented View Switchers with Live Counters */}
      <div className="w-full overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#0a0e17]/90 backdrop-blur-xl shadow-inner min-w-max border border-white/[0.04]">
          <button
            onClick={() => setSegment('all')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-[12px] ${
              segment === 'all'
                ? 'bg-gradient-to-r from-[#38bdf8] to-[#bdc2ff] text-[#0a0e17] font-bold shadow-[0_0_16px_-2px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span>All Tasks</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                segment === 'all' ? 'bg-[#0a0e17]/30 text-[#0a0e17]' : 'bg-[#262a34] text-[#bdc8d1]'
              }`}
            >
              {totalTasks}
            </span>
          </button>

          <button
            onClick={() => setSegment('in_progress')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-[12px] ${
              segment === 'in_progress'
                ? 'bg-gradient-to-r from-[#38bdf8] to-[#bdc2ff] text-[#0a0e17] font-bold shadow-[0_0_16px_-2px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span>In Progress</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                segment === 'in_progress' ? 'bg-[#0a0e17]/30 text-[#0a0e17] font-bold' : 'bg-[#262a34] text-[#bdc8d1]'
              }`}
            >
              {inProgressCount}
            </span>
          </button>

          <button
            onClick={() => setSegment('scheduled')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-[12px] ${
              segment === 'scheduled'
                ? 'bg-gradient-to-r from-[#38bdf8] to-[#bdc2ff] text-[#0a0e17] font-bold shadow-[0_0_16px_-2px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span>Scheduled</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                segment === 'scheduled' ? 'bg-[#0a0e17]/30 text-[#0a0e17] font-bold' : 'bg-[#262a34] text-[#bdc8d1]'
              }`}
            >
              {scheduledCount}
            </span>
          </button>

          <button
            onClick={() => setSegment('archived')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-[12px] ${
              segment === 'archived'
                ? 'bg-gradient-to-r from-[#38bdf8] to-[#bdc2ff] text-[#0a0e17] font-bold shadow-[0_0_16px_-2px_rgba(56,189,248,0.4)]'
                : 'text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span>Archived</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                segment === 'archived' ? 'bg-[#0a0e17]/30 text-[#0a0e17] font-bold' : 'bg-[#262a34] text-[#bdc8d1]'
              }`}
            >
              42
            </span>
          </button>
        </div>
      </div>

      {/* 2. Filter Category Chips */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold flex items-center gap-1 shadow-sm transition-all ${
              category === 'all'
                ? 'bg-[#262a34] text-[#8ed5ff] ring-1 ring-[#38bdf8]/30'
                : 'bg-[#181b25] text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              apps
            </span>
            <span>All</span>
          </button>

          <button
            onClick={() => setCategory('high')}
            className={`px-3 py-1 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${
              category === 'high'
                ? 'bg-[#262a34] text-[#ffb4ab] ring-1 ring-[#ffb4ab]/30'
                : 'bg-[#181b25] text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
            <span>High Priority</span>
          </button>

          <button
            onClick={() => setCategory('client')}
            className={`px-3 py-1 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${
              category === 'client'
                ? 'bg-[#262a34] text-[#bdc2ff] ring-1 ring-[#bdc2ff]/30'
                : 'bg-[#181b25] text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#bdc2ff]">domain</span>
            <span>Client Work</span>
          </button>

          <button
            onClick={() => setCategory('personal')}
            className={`px-3 py-1 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${
              category === 'personal'
                ? 'bg-[#262a34] text-[#4ee6aa] ring-1 ring-[#4ee6aa]/30'
                : 'bg-[#181b25] text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#4ee6aa]">spa</span>
            <span>Personal</span>
          </button>

          <button
            onClick={() => setCategory('deadlines')}
            className={`px-3 py-1 rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all ${
              category === 'deadlines'
                ? 'bg-[#262a34] text-[#ffb4ab] ring-1 ring-[#ffb4ab]/30'
                : 'bg-[#181b25] text-[#bdc8d1] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#ffb4ab]">alarm</span>
            <span>Deadlines</span>
          </button>
        </div>
      </div>

      {/* 3. Primary Multi-dimensional Task Cards */}
      <div className="flex flex-col space-y-3 w-full">
        {filteredActiveTasks.map((task) => {
          const isUrgent = task.priority === 'urgent';
          const isMedium = task.priority === 'medium';
          const isAccordionOpen = expandedSubtasks[task.id] || false;

          return (
            <div
              key={task.id}
              className={`w-full rounded-2xl bg-[#181b25]/95 p-4 shadow-lg relative overflow-hidden transition-all duration-300 border border-white/[0.05] ${
                task.status === 'completed' ? 'opacity-65' : ''
              }`}
            >
              {/* Rainbow Specular Gradient Line on Urgent Cards */}
              {isUrgent && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#38bdf8] via-[#bdc2ff] to-[#22c990] opacity-80" />
              )}

              {/* Top Row: Checkmark, Title, Priority */}
              <div className="flex items-start gap-3 w-full">
                <button
                  onClick={(e) => handleCheckboxClick(task.id, e)}
                  aria-label="Mark task done"
                  className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#31353f] flex items-center justify-center text-[#0a0e17] hover:bg-[#4ee6aa] transition-colors shadow-sm active:scale-90"
                >
                  <span className="material-symbols-outlined text-[16px] font-bold opacity-0 hover:opacity-100 transition-opacity">
                    check
                  </span>
                </button>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[17px] text-[#dfe2ef] font-semibold truncate tracking-tight">
                      {task.title}
                    </span>

                    {/* Priority Badge */}
                    {isUrgent ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#f43f5e]/15 text-[#ffb4ab] text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 border border-[#f43f5e]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-ping" />
                        Urgent
                      </span>
                    ) : isMedium ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#2f3aa3]/40 text-[#bdc2ff] text-[11px] font-semibold uppercase tracking-wider shrink-0">
                        Medium
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#8ed5ff] text-[11px] font-semibold uppercase tracking-wider shrink-0">
                        Low
                      </span>
                    )}
                  </div>

                  <p className="text-[13px] text-[#bdc8d1] line-clamp-1 mt-0.5">{task.description}</p>
                </div>
              </div>

              {/* Subtask Progress Tracking Section (if available) */}
              {task.progress && (
                <div className="mt-3.5 w-full rounded-xl bg-[#1c1f29] p-2.5 flex flex-col gap-1.5 border border-white/[0.04]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#bdc8d1] flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px] text-[#8ed5ff]">account_tree</span>
                      Progress
                    </span>
                    <span className="text-[#8ed5ff] font-bold">
                      {task.progress.current} / {task.progress.total} Done (
                      {Math.round((task.progress.current / task.progress.total) * 100)}%)
                    </span>
                  </div>

                  {/* Miniature Progress Track */}
                  <div className="w-full h-1.5 bg-[#31353f] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8ed5ff] to-[#22c990] rounded-full shadow-[0_0_8px_#38bdf8]"
                      style={{
                        width: `${Math.round((task.progress.current / task.progress.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Metadata & Action strip */}
              <div className="mt-2.5 pt-1 flex items-center justify-between gap-1 flex-wrap">
                {/* Due Date & Reminder indicator */}
                <div className="flex items-center gap-2 min-w-0">
                  {task.dueText && (
                    <span className="flex items-center gap-1 text-[#bdc8d1] text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#31353f]">
                      <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">event</span>
                      {task.dueText}
                    </span>
                  )}

                  {task.hasReminder && (
                    <span
                      className="w-6 h-6 rounded-full bg-[#31353f] flex items-center justify-center text-[#8ed5ff]"
                      title="Reminder Active"
                    >
                      <span
                        className="material-symbols-outlined text-[13px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        notifications_active
                      </span>
                    </span>
                  )}

                  {task.tag && !task.progress && (
                    <span className="px-2 py-0.5 rounded-md bg-[#31353f] text-[11px] font-semibold text-[#bdc8d1] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#bdc2ff]">folder</span>
                      {task.tag}
                    </span>
                  )}
                </div>

                {/* Assigned Avatars & Accordion Toggle */}
                <div className="flex items-center gap-2 ml-auto">
                  {task.assignees && (
                    <div className="flex items-center -space-x-1.5">
                      {task.assignees.map((assignee, idx) => (
                        <img
                          key={idx}
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-[#181b25]"
                        />
                      ))}
                      <span className="w-6 h-6 rounded-full bg-[#2f3aa3] text-[#a8afff] text-[10px] flex items-center justify-center ring-2 ring-[#181b25] font-bold">
                        +1
                      </span>
                    </div>
                  )}

                  {task.subtasks && (
                    <button
                      onClick={() => toggleSubtaskAccordion(task.id)}
                      aria-label="Toggle subtasks drawer"
                      className="w-7 h-7 rounded-full bg-[#262a34] flex items-center justify-center text-[#bdc8d1] hover:text-[#dfe2ef] transition-transform"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                          isAccordionOpen ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                  )}

                  {!task.subtasks && !task.assignees && (
                    <div className="flex items-center text-[#87929a] text-[11px] gap-0.5">
                      <span>Swipe</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Subtasks Drawer */}
              {task.subtasks && isAccordionOpen && (
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/[0.06] bg-[#0a0e17]/60 -mx-4 -mb-4 p-4 rounded-b-2xl">
                  <span className="text-[11px] font-bold text-[#87929a] uppercase tracking-wider">
                    Subtask Breakdown
                  </span>
                  <div className="space-y-2">
                    {task.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => onToggleSubtask(task.id, sub.id)}
                        className="flex items-center justify-between text-[13px] cursor-pointer hover:bg-white/[0.02] p-1 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              sub.completed ? 'text-[#4ee6aa]' : 'text-[#8ed5ff]'
                            }`}
                            style={{ fontVariationSettings: sub.completed ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {sub.completed ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span
                            className={`${
                              sub.completed ? 'line-through text-[#bdc8d1]/60' : 'text-[#dfe2ef] font-medium'
                            }`}
                          >
                            {sub.title}
                          </span>
                        </div>
                        {sub.statusLabel ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#8ed5ff] text-[10px] font-semibold">
                            {sub.statusLabel}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#bdc8d1]/50">
                            {sub.completed ? 'Done' : 'Pending'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Collapsible Completed Section with Strikethrough & Muted Glass Styling */}
      <div className="w-full flex flex-col pt-2">
        <button
          onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
          className="w-full flex items-center justify-between py-2 px-1 text-[#bdc8d1] hover:text-[#dfe2ef] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-semibold text-[#dfe2ef] tracking-tight">Completed</span>
            <span className="px-2 py-0.2 rounded-full bg-[#262a34] text-[11px] font-bold text-[#4ee6aa]">
              {completedTasks.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#87929a] text-[11px]">
            <span>{isCompletedExpanded ? 'Hide' : 'Show'}</span>
            <span
              className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                isCompletedExpanded ? 'rotate-0' : 'rotate-180'
              }`}
            >
              keyboard_arrow_up
            </span>
          </div>
        </button>

        {isCompletedExpanded && (
          <div className="flex flex-col space-y-2 mt-1 transition-all duration-300">
            {completedTasks.map((comp) => (
              <div
                key={comp.id}
                className="w-full rounded-xl bg-[#0a0e17]/50 backdrop-blur-md p-3 flex items-center justify-between gap-3 opacity-60 hover:opacity-90 transition-opacity border border-white/[0.03]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={(e) => handleCheckboxClick(comp.id, e)}
                    aria-label="Mark incomplete"
                    className="w-5 h-5 rounded-full bg-[#4ee6aa]/20 flex items-center justify-center text-[#4ee6aa] shrink-0 hover:bg-[#4ee6aa]/40 transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </button>
                  <span className="text-[14px] text-[#bdc8d1] line-through truncate font-medium">
                    {comp.title}
                  </span>
                </div>
                <span className="text-[11px] text-[#bdc8d1]/60 shrink-0 font-medium">
                  {comp.completedAt || 'Today'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
