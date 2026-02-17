import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  decimal?: boolean;
}

const Stepper: React.FC<StepperProps> = ({ value, min, max, step = 1, onChange, decimal }) => {
  const decrement = () => {
    const next = Math.max(min, parseFloat((value - step).toFixed(1)));
    onChange(next);
  };

  const increment = () => {
    const next = Math.min(max, parseFloat((value + step).toFixed(1)));
    onChange(next);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={decrement}
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center btn-press"
      >
        <Minus size={18} className="text-primary" />
      </button>
      <span className="font-heading text-[32px] font-bold text-primary min-w-[60px] text-center">
        {decimal ? value.toFixed(1) : value}
      </span>
      <button
        type="button"
        onClick={increment}
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center btn-press"
      >
        <Plus size={18} className="text-primary" />
      </button>
    </div>
  );
};

export default Stepper;
