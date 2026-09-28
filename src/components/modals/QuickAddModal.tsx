import React, { useState } from 'react';
import { PriorityLevel, Task } from '../../types';
import { useParticleBurst } from '../ParticleBurst';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Partial<Task>) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const { triggerBurst } = useParticleBurst();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [tag, setTag] = useState('#Design');
  const [dueText, setDueText] = useState('Today, 5:00 PM');
  const [subtasksInput, setSubtasksInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const subtasks = subtasksInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((t, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: t,
        completed: false,
      }));

    onAddTask({
      title: title.trim(),
      description: description.trim() || 'Horizon priority task registered via quick capture.',
      priority,
      tag,
      category: priority === 'high' || priority === 'urgent' ? 'high' : 'all',
      status: 'in_progress',
      dueText,
      hasReminder: true,
      isPriorityHorizon: true,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      durationEstimate: '45m',
    });

    const targetEl = e.currentTarget.getBoundingClientRect();
    triggerBurst(targetEl.left + targetEl.width / 2, targetEl.top + 60, 24);

    setTitle('');
    setDescription('');
    setSubtasksInput('');
    onClose();
  };

  const tags = ['#Design', '#Sprint', '#Finance', '#Dev Core', '#Strategy'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div
        className="w-full max-w-md bg-[#181b25] rounded-t-3xl border-t border-white/10 shadow-2xl p-5 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Grab bar affordance */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto -mt-1 cursor-pointer" onClick={onClose} />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#38bdf8]/20 flex items-center justify-center text-[#8ed5ff]">
              <span className="material-symbols-outlined text-[18px]">add_task</span>
            </div>
            <h2 className="text-[18px] font-semibold text-[#dfe2ef]">Create Horizon Task</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#87929a] hover:text-[#dfe2ef]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider block mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Aura Glass visual architecture pass"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0e17] text-[#dfe2ef] border border-white/10 placeholder:text-[#87929a] focus:outline-none focus:ring-1 focus:ring-[#38bdf8] text-[14px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider block mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key deliverables, constraints, or context..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0a0e17] text-[#dfe2ef] border border-white/10 placeholder:text-[#87929a] focus:outline-none focus:ring-1 focus:ring-[#38bdf8] text-[13px] resize-none"
            />
          </div>

          {/* Priority selector */}
          <div>
            <label className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider block mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['urgent', 'high', 'medium', 'low'] as PriorityLevel[]).map((p) => {
                const isSelected = priority === p;
                const colors =
                  p === 'urgent'
                    ? 'border-[#f43f5e] text-[#ffb4ab] bg-[#93000a]/30'
                    : p === 'high'
                    ? 'border-[#f43f5e]/60 text-[#ffb4ab] bg-[#f43f5e]/15'
                    : p === 'medium'
                    ? 'border-[#bdc2ff] text-[#bdc2ff] bg-[#2f3aa3]/30'
                    : 'border-[#38bdf8] text-[#8ed5ff] bg-[#38bdf8]/15';

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 px-2 rounded-xl text-[12px] font-semibold capitalize border transition-all ${
                      isSelected
                        ? colors
                        : 'border-white/5 bg-[#0a0e17] text-[#bdc8d1] hover:text-[#dfe2ef]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider block mb-1.5">
              Category Tag
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    tag === t
                      ? 'bg-[#38bdf8] text-[#00354a]'
                      : 'bg-[#0a0e17] text-[#bdc8d1] hover:text-[#dfe2ef]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Due date picker shortcuts */}
          <div>
            <label className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider block mb-1.5">
              Target Horizon
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Today, 5:00 PM', 'Tomorrow, 11:30 AM', 'Friday'].map((due) => (
                <button
                  key={due}
                  type="button"
                  onClick={() => setDueText(due)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all ${
                    dueText === due
                      ? 'bg-[#262a34] text-[#8ed5ff] border border-[#38bdf8]/40'
                      : 'bg-[#0a0e17] text-[#bdc8d1] border border-white/5'
                  }`}
                >
                  {due}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks breakdown */}
          <div>
            <label className="text-[11px] font-bold text-[#bdc8d1] uppercase tracking-wider block mb-1">
              Subtasks (One per line)
            </label>
            <textarea
              rows={2}
              value={subtasksInput}
              onChange={(e) => setSubtasksInput(e.target.value)}
              placeholder="e.g. Export SVG icon sets&#10;Run WCAG AAA contrast audits"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0a0e17] text-[#dfe2ef] border border-white/10 placeholder:text-[#87929a] focus:outline-none focus:ring-1 focus:ring-[#38bdf8] text-[13px] resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#bdc2ff] text-[#0a0e17] font-bold text-[14px] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
              <span>Register to Horizon</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
