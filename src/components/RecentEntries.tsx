import React, { useState, useRef, useCallback } from 'react';
import { SmokeLog } from '@/types/smoking';
import { getLogs, removeLog, formatTimeIST } from '@/utils/storage';
import { toast } from 'sonner';

interface RecentEntriesProps {
  refreshKey: number;
  onViewAll: () => void;
}

const EntryRow: React.FC<{ entry: SmokeLog; onRemove: (id: string) => void }> = ({ entry, onRemove }) => {
  const [offsetX, setOffsetX] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const diff = e.touches[0].clientX - startX.current;
    if (diff < 0) setOffsetX(Math.max(diff, -80));
  };

  const onTouchEnd = () => {
    dragging.current = false;
    if (offsetX < -50) {
      onRemove(entry.id);
    }
    setOffsetX(0);
  };

  const d = new Date(entry.timestamp);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute right-0 top-0 bottom-0 w-[60px] bg-alert flex items-center justify-center rounded-r-xl">
        <span className="font-body text-xs text-primary-foreground font-medium">Remove</span>
      </div>
      <div
        className="bg-card rounded-xl p-3 px-4 relative z-10 transition-transform"
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-surface px-2 py-1 rounded-chip font-body text-xs text-body">{formatTimeIST(d)}</span>
            <span className="bg-primary px-2 py-1 rounded-chip font-body text-xs text-primary-foreground">{entry.count} cig{entry.count > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {entry.location && <span className="font-body text-xs text-muted">{entry.location}</span>}
            {entry.triggers[0] && <span className="font-body text-xs text-muted">{entry.triggers[0]}</span>}
          </div>
        </div>
        {entry.notes && (
          <p className="font-body text-xs text-muted mt-1 truncate">{entry.notes}</p>
        )}
      </div>
    </div>
  );
};

const RecentEntries: React.FC<RecentEntriesProps> = ({ refreshKey, onViewAll }) => {
  const logs = getLogs().slice(0, 5);

  const handleRemove = (id: string) => {
    removeLog(id);
    toast('Entry removed');
  };

  if (logs.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="font-heading text-sm text-muted px-1">Recent Entries</h2>
      <div className="space-y-2">
        {logs.map(l => (
          <EntryRow key={l.id} entry={l} onRemove={handleRemove} />
        ))}
      </div>
      <button onClick={onViewAll} className="w-full text-center font-body text-[13px] text-primary py-2 btn-press">
        View all
      </button>
    </div>
  );
};

export default RecentEntries;
