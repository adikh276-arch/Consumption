import React from 'react';
import { Cigarette, BarChart2 } from 'lucide-react';

interface TopBarProps {
  onOpenHistory: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenHistory }) => (
  <div className="h-14 bg-background border-b border-card flex items-center justify-between px-4 sticky top-0 z-30">
    <div className="flex items-center gap-2">
      <Cigarette size={18} className="text-primary" />
      <span className="font-heading text-[17px] font-bold text-foreground">Consumption Log</span>
    </div>
    <button onClick={onOpenHistory} className="btn-press p-1">
      <BarChart2 size={20} className="text-primary" />
    </button>
  </div>
);

export default TopBar;
