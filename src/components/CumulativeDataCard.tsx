import React, { useState, useEffect } from 'react';
import { SmokingProfile } from '@/types/smoking';
import { getUserId } from '@/lib/auth';
import { getSmokingProfile } from '@/lib/db';
import { getSmokingDurationMonths, formatIndianNumber } from '@/utils/storage';
import { HEALTH_FACTS } from '@/types/smoking';

const CumulativeDataCard: React.FC = () => {
  const [profile, setProfile] = useState<SmokingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [factIndex, setFactIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = getUserId();
      if (!userId) return;
      try {
        const data = await getSmokingProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch cumulative data profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setFactIndex(i => (i + 1) % HEALTH_FACTS.length);
        setFadingOut(false);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4 text-center text-xs text-muted font-body">Calculating cumulative data...</div>;
  if (!profile) return null;

  const months = getSmokingDurationMonths(profile);
  const totalDays = Math.max(0, months * 30.44);
  const totalCigs = Math.round(totalDays * profile.avgPerDay);
  const packEquiv = Math.round(totalCigs / profile.perPack);
  const nicotineG = ((totalCigs * profile.nicotineMg) / 1000).toFixed(1);
  const tarG = ((totalCigs * profile.tarMg) / 1000).toFixed(1);

  const rows = [
    { label: 'Total cigarettes (est.)', value: formatIndianNumber(totalCigs) },
    { label: 'Pack equivalents (est.)', value: formatIndianNumber(packEquiv) },
    { label: 'Nicotine absorbed (est.)', value: `${nicotineG} g` },
    { label: 'Tar absorbed (est.)', value: `${tarG} g` },
  ];

  return (
    <div className="bg-card rounded-card border border-border p-5 space-y-4">
      <h2 className="font-heading text-[15px] font-semibold text-foreground">Cumulative Data</h2>
      <p className="text-xs text-muted font-body -mt-2">Estimated from your baseline profile.</p>

      <div className="space-y-0">
        {rows.map((r, i) => (
          <div key={r.label} className={`flex items-center justify-between py-3 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
            <span className="font-body text-sm text-body">{r.label}</span>
            <span className="font-heading text-lg font-bold text-primary">{r.value}</span>
          </div>
        ))}
      </div>

      <p
        className={`font-body text-[13px] text-muted transition-opacity duration-400 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}
      >
        {HEALTH_FACTS[factIndex]}
      </p>
    </div>
  );
};

export default CumulativeDataCard;
