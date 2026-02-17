import React, { useState, useEffect } from 'react';
import { SmokingProfile, SmokeLog } from '@/types/smoking';
import { getUserId } from '@/lib/auth';
import { getSmokeLogs, getSmokingProfile } from '@/lib/db';
import { formatDateDMY } from '@/utils/storage';

interface TodaySnapshotProps {
  refreshKey: number;
}

const TodaySnapshot: React.FC<TodaySnapshotProps> = ({ refreshKey }) => {
  const [logs, setLogs] = useState<SmokeLog[]>([]);
  const [profile, setProfile] = useState<SmokingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId();
      if (!userId) return;
      try {
        const [logsData, profileData] = await Promise.all([
          getSmokeLogs(userId),
          getSmokingProfile(userId)
        ]);
        const todayStr = formatDateDMY(new Date());
        const todayLogs = logsData.filter(l => formatDateDMY(new Date(l.timestamp)) === todayStr);
        setLogs(todayLogs);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch today data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  if (loading) return <div className="p-4 text-center text-xs text-muted font-body">Loading today's snapshots...</div>;

  const totalToday = logs.reduce((s, l) => s + l.count, 0);
  const nicotine = profile ? (totalToday * profile.nicotineMg).toFixed(1) : '0';
  const tar = profile ? (totalToday * profile.tarMg).toFixed(1) : '0';
  const packEquiv = profile ? (totalToday / profile.perPack).toFixed(1) : '0';
  const avg = profile?.avgPerDay || 10;
  const diff = totalToday - avg;

  let barColor = 'bg-success';
  if (diff >= 0) barColor = 'bg-alert';
  else if (diff >= -1) barColor = 'bg-warning';

  const barWidth = Math.min(100, (totalToday / Math.max(avg, 1)) * 100);

  const stats = [
    { label: 'Recorded today', value: totalToday },
    { label: 'Nicotine est.', value: `${nicotine} mg` },
    { label: 'Tar est.', value: `${tar} mg` },
    { label: 'Pack equiv.', value: packEquiv },
  ];

  return (
    <div className="bg-card rounded-card border border-border p-5 space-y-4">
      <h2 className="font-heading text-[15px] font-semibold text-foreground">Today</h2>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-surface rounded-xl p-3">
            <p className="font-body text-xs text-muted">{s.label}</p>
            <p className="font-heading text-xl font-bold text-primary mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="w-full h-[6px] bg-surface rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${barWidth}%` }} />
        </div>
        <p className="font-body text-xs text-muted">
          {diff <= 0 ? `${Math.abs(diff)} fewer than your daily average` : `${diff} above your daily average`}
        </p>
      </div>
    </div>
  );
};

export default TodaySnapshot;
