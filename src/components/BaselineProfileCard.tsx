import React, { useState, useEffect } from 'react';
import Stepper from './Stepper';
import { SmokingProfile, MONTHS } from '@/types/smoking';
import { getUserId } from '@/lib/auth';
import { getSmokingProfile, saveSmokingProfile } from '@/lib/db';
import { isProfileSet, setProfileSetFlag } from '@/utils/storage';
import { toast } from 'sonner';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => 1970 + i);

const BaselineProfileCard: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  const [expanded, setExpanded] = useState(!isProfileSet());
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SmokingProfile>({
    startMonth: 0,
    startYear: 2015,
    avgPerDay: 10,
    brand: '',
    perPack: 20,
    nicotineMg: 0.8,
    tarMg: 8,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = getUserId();
      if (!userId) return;
      try {
        const saved = await getSmokingProfile(userId);
        if (saved) {
          setProfile(saved);
          setExpanded(false);
          setProfileSetFlag();
        } else {
          setExpanded(true);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const update = (patch: Partial<SmokingProfile>) => setProfile(p => ({ ...p, ...patch }));

  const duration = () => {
    const now = new Date();
    const totalMonths = (now.getFullYear() - profile.startYear) * 12 + (now.getMonth() - profile.startMonth);
    if (totalMonths < 0) return null;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return `${y} years, ${m} months`;
  };

  const handleSave = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("User session not found");
      return;
    }
    try {
      await saveSmokingProfile(userId, profile);
      setProfileSetFlag();
      setExpanded(false);
      toast('Profile saved');
      onSave();
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile");
    }
  };

  if (loading) return <div className="p-4 text-center text-xs text-muted font-body">Loading profile...</div>;

  if (!expanded) {
    return (
      <div className="bg-card rounded-card border border-border p-5 flex items-center justify-between">
        <span className="font-body text-sm text-muted">Baseline Profile</span>
        <button onClick={() => setExpanded(true)} className="font-body text-sm text-primary btn-press">Edit</button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-card border border-border p-5 space-y-4">
      <h2 className="font-heading text-[15px] font-semibold text-foreground">Baseline Profile</h2>
      <p className="text-xs text-muted font-body -mt-2">Used to calculate cumulative health data.</p>

      {/* Smoking start */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Smoking start</label>
        <div className="flex gap-3">
          <select
            value={profile.startMonth}
            onChange={e => update({ startMonth: +e.target.value })}
            className="flex-1 bg-surface border border-border rounded-input px-3 py-3 font-body text-sm text-foreground focus:border-primary outline-none"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={profile.startYear}
            onChange={e => update({ startYear: +e.target.value })}
            className="flex-1 bg-surface border border-border rounded-input px-3 py-3 font-body text-sm text-foreground focus:border-primary outline-none"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {duration() && <p className="font-body text-[13px] text-primary">Duration: {duration()}</p>}
      </div>

      {/* Avg per day */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Average per day</label>
        <Stepper value={profile.avgPerDay} min={1} max={100} onChange={v => update({ avgPerDay: v })} />
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Brand (optional)</label>
        <input
          value={profile.brand}
          onChange={e => update({ brand: e.target.value })}
          placeholder="e.g. Gold Flake Kings"
          className="w-full bg-surface border border-border rounded-input px-4 py-3 font-body text-sm text-foreground placeholder:text-muted focus:border-primary outline-none"
        />
      </div>

      {/* Per pack */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Cigarettes per pack</label>
        <div className="flex gap-2">
          {[10, 20].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => update({ perPack: n })}
              className={`flex-1 py-2 rounded-chip font-body text-sm transition-colors btn-press ${profile.perPack === n
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface border border-border text-muted'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Nicotine */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Nicotine per cigarette (mg)</label>
        <Stepper value={profile.nicotineMg} min={0.1} max={2.0} step={0.1} decimal onChange={v => update({ nicotineMg: v })} />
        <p className="text-[11px] text-muted font-body">Refer to pack label.</p>
      </div>

      {/* Tar */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Tar per cigarette (mg)</label>
        <Stepper value={profile.tarMg} min={1} max={20} onChange={v => update({ tarMg: v })} />
        <p className="text-[11px] text-muted font-body">Refer to pack label.</p>
      </div>

      <button onClick={handleSave} className="w-full h-[52px] bg-primary rounded-btn font-heading text-[15px] font-semibold text-primary-foreground tracking-[0.02em] btn-press">
        Save Profile
      </button>
    </div>
  );
};

export default BaselineProfileCard;
