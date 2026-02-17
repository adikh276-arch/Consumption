import React from 'react';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-[7px] px-[14px] rounded-chip text-[13px] font-body min-h-[36px] border transition-colors duration-150 btn-press ${
      selected
        ? 'bg-primary border-primary text-primary-foreground'
        : 'bg-card border-border text-muted'
    }`}
  >
    {label}
  </button>
);

export default Chip;
