import React from 'react';
import { MOODS } from '@/types/smoking';

interface MoodSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-5 gap-2">
    {MOODS.map(m => (
      <button
        key={m.value}
        type="button"
        onClick={() => onChange(m.value)}
        className={`flex flex-col items-center gap-1 py-2 rounded-xl bg-surface transition-all duration-150 btn-press ${
          value === m.value ? 'border-2 border-primary bg-[hsl(213_40%_18%)]' : 'border border-transparent'
        }`}
      >
        <span className="text-xl">{m.emoji}</span>
        <span className="text-[10px] font-body text-body">{m.label}</span>
      </button>
    ))}
  </div>
);

export default MoodSelector;
