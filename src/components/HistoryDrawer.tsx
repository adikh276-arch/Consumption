import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { SmokeLog } from '@/types/smoking';
import { getLogs, removeLog, formatTimeIST, formatDateDMY } from '@/utils/storage';
import { toast } from 'sonner';

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  refreshKey: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ open, onClose, refreshKey }) => {
  const [search, setSearch] = useState('');
  const [closing, setClosing] = useState(false);

  const logs = getLogs();

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  // Last 7 days chart data
  const chartData = useMemo(() => {
    const result: { day: string; count: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDateDMY(d);
      const dayLogs = logs.filter(l => formatDateDMY(new Date(l.timestamp)) === dateStr);
      const count = dayLogs.reduce((s, l) => s + l.count, 0);
      result.push({ day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], count, isToday: i === 0 });
    }
    return result;
  }, [logs]);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  const avgPerDay = chartData.length > 0
    ? (chartData.reduce((s, d) => s + d.count, 0) / chartData.length).toFixed(1)
    : '0';
  const lowest = Math.min(...chartData.map(d => d.count));
  const highest = Math.max(...chartData.map(d => d.count));

  // Group logs by date
  const filteredLogs = search
    ? logs.filter(l =>
        l.location.toLowerCase().includes(search.toLowerCase()) ||
        l.triggers.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        l.notes.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  const grouped = useMemo(() => {
    const map: Record<string, SmokeLog[]> = {};
    filteredLogs.forEach(l => {
      const key = formatDateDMY(new Date(l.timestamp));
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return Object.entries(map);
  }, [filteredLogs]);

  const handleRemove = (id: string) => {
    removeLog(id);
    toast('Entry removed');
  };

  const handleExport = () => {
    const lines = logs.map(l => {
      const d = new Date(l.timestamp);
      return `${formatDateDMY(d)} ${formatTimeIST(d)} | ${l.count} cigarette(s) | ${l.location} | ${l.triggers.join(', ')} | ${l.notes || '-'}`;
    });
    navigator.clipboard.writeText(lines.join('\n'));
    toast('Summary copied to clipboard');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className={closing ? 'drawer-exit' : 'drawer-enter'} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="font-heading text-[17px] font-bold text-foreground">Consumption Records</h2>
          <button onClick={handleClose} className="btn-press">
            <X size={22} className="text-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
          {/* 7-day chart */}
          <div className="bg-card rounded-card border border-border p-4">
            <div className="flex items-end justify-between gap-2 h-[120px]">
              {chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="font-body text-[10px] text-muted">{d.count}</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${d.isToday ? 'bg-primary' : 'bg-primary/60'}`}
                    style={{ height: `${Math.max(4, (d.count / maxCount) * 80)}px` }}
                  />
                  <span className="font-body text-[10px] text-muted">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              {[
                { label: `Avg ${avgPerDay}/day` },
                { label: `Lowest ${lowest}` },
                { label: `Highest ${highest}` },
              ].map(s => (
                <span key={s.label} className="bg-surface px-3 py-1 rounded-chip font-body text-xs text-body">
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search location, trigger, notes"
            className="w-full bg-surface border border-border rounded-input px-4 py-3 font-body text-sm text-foreground placeholder:text-muted focus:border-primary outline-none"
          />

          {/* Entries */}
          {grouped.map(([date, entries]) => (
            <div key={date} className="space-y-2">
              <p className="font-body text-[13px] text-muted">{date}</p>
              {entries.map(entry => (
                <div key={entry.id} className="bg-card rounded-xl p-3 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-surface px-2 py-1 rounded-chip font-body text-xs text-body">
                        {formatTimeIST(new Date(entry.timestamp))}
                      </span>
                      <span className="bg-primary px-2 py-1 rounded-chip font-body text-xs text-primary-foreground">
                        {entry.count} cig{entry.count > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {entry.location && <span className="font-body text-xs text-muted">{entry.location}</span>}
                      {entry.triggers[0] && <span className="font-body text-xs text-muted">{entry.triggers[0]}</span>}
                    </div>
                  </div>
                  {entry.notes && <p className="font-body text-xs text-muted mt-1 truncate">{entry.notes}</p>}
                </div>
              ))}
            </div>
          ))}

          {grouped.length === 0 && (
            <p className="text-center font-body text-sm text-muted py-8">No entries recorded yet.</p>
          )}
        </div>

        {/* Export */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <button
            onClick={handleExport}
            className="w-full h-[52px] border border-border rounded-btn font-heading text-[15px] font-semibold text-foreground tracking-[0.02em] btn-press"
          >
            Export Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;
