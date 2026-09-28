import React, { useState } from 'react';
import { ASSETS } from '../../data/initialData';
import { useParticleBurst } from '../ParticleBurst';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  category: string;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose }) => {
  const { triggerBurst } = useParticleBurst();
  const [items, setItems] = useState<GroceryItem[]>([
    { id: '1', name: 'Cold Brew Oat Milk Concentrate', checked: true, category: 'Pantry' },
    { id: '2', name: 'Organic Hass Avocados (x4)', checked: false, category: 'Produce' },
    { id: '3', name: 'Wild Sockeye Salmon Fillets', checked: false, category: 'Seafood' },
    { id: '4', name: 'Sparkling Mineral Electrolytes', checked: true, category: 'Beverage' },
  ]);

  if (!isOpen) return null;

  const toggleItem = (id: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="w-full max-w-sm bg-[#181b25] rounded-3xl border border-white/10 shadow-2xl p-5 flex flex-col space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#262a34] text-[#8ed5ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#dfe2ef]">Organic Market</h3>
              <p className="text-[11px] text-[#bdc8d1]">250m away from current path</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#87929a] hover:text-[#dfe2ef]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Map Mini Banner */}
        <div
          className="w-full h-20 rounded-xl bg-cover bg-center relative overflow-hidden shadow-inner border border-white/[0.06]"
          style={{ backgroundImage: `url('${ASSETS.mapMarket}')` }}
        >
          <div className="absolute inset-0 bg-[#0a0e17]/50 backdrop-blur-[1px] flex items-center justify-between px-4">
            <span className="text-[12px] font-semibold text-white">4 Items Queued</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#4ee6aa]/20 text-[#4ee6aa]">
              {checkedCount}/{items.length} Acquired
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={(e) => toggleItem(item.id, e)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c1f29] hover:bg-[#262a34] transition-colors cursor-pointer border border-white/[0.02]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    item.checked ? 'bg-[#4ee6aa] text-[#003825]' : 'bg-[#31353f] text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span
                  className={`text-[13px] truncate ${
                    item.checked ? 'line-through text-[#bdc8d1]/60' : 'text-[#dfe2ef] font-medium'
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0a0e17] text-[#bdc8d1] shrink-0">
                {item.category}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#38bdf8] text-[#00354a] font-bold text-[13px] shadow-md active:scale-[0.98] transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
