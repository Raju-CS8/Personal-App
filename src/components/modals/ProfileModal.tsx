import React from 'react';
import { ASSETS } from '../../data/initialData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopPreview: boolean;
  onToggleDesktopPreview: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  isDesktopPreview,
  onToggleDesktopPreview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="w-full max-w-sm bg-[#181b25] rounded-3xl border border-white/10 shadow-2xl p-5 flex flex-col space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#87929a] uppercase tracking-wider">
            Executive Profile
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#87929a] hover:text-[#dfe2ef]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#1c1f29] border border-white/[0.04]">
          <div className="relative">
            <img
              src={ASSETS.avatar}
              alt="Elena Vance"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#38bdf8]/40"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#4ee6aa] ring-2 ring-[#181b25]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[17px] font-bold text-[#dfe2ef] truncate tracking-tight">Elena Vance</h3>
            <p className="text-[12px] text-[#bdc8d1]">Executive Systems Architect</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#8ed5ff]">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span>Aura Flow Pro Subscriber</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#0a0e17] border border-white/[0.03]">
            <span className="text-[11px] text-[#87929a] block">Active Streak</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[20px] font-bold text-[#4ee6aa]">14</span>
              <span className="text-[12px] text-[#bdc8d1]">Days 🔥</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0a0e17] border border-white/[0.03]">
            <span className="text-[11px] text-[#87929a] block">Weekly Focus</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[20px] font-bold text-[#8ed5ff]">34.5</span>
              <span className="text-[12px] text-[#bdc8d1]">Hours</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-[#87929a] uppercase tracking-wider block">
            Workspace Mode
          </span>

          <div
            onClick={onToggleDesktopPreview}
            className="flex items-center justify-between p-3 rounded-xl bg-[#1c1f29] hover:bg-[#262a34] cursor-pointer transition-colors border border-white/[0.03]"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#bdc2ff]">
                {isDesktopPreview ? 'stay_current_portrait' : 'fullscreen'}
              </span>
              <div>
                <p className="text-[13px] text-[#dfe2ef] font-medium">
                  {isDesktopPreview ? 'Mobile Frame Shell' : 'Full Canvas Layout'}
                </p>
                <p className="text-[11px] text-[#87929a]">
                  {isDesktopPreview ? 'Constrained phone viewport' : 'Expanded fluid responsive container'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#31353f] text-[#8ed5ff]">
              Toggle
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#262a34] hover:bg-[#31353f] text-[#dfe2ef] font-semibold text-[13px] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
