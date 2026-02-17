import React, { useState } from 'react';
import Stepper from './Stepper';
import Chip from './Chip';
import MoodSelector from './MoodSelector';
import { LOCATIONS, TRIGGERS, SmokeLog } from '@/types/smoking';
import { addLog, generateId, formatTimeIST } from '@/utils/storage';
import { toast } from 'sonner';

const COOLDOWN_MS = 10_000; // 10 second cooldown

const LogCard: React.FC<{ onSaved: () => void }> = ({ onSaved }) => {
  const [count, setCount] = useState(1);
  const [location, setLocation] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);

  const toggleTrigger = (t: string) =>
    setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSave = () => {
    if (cooldown) return;
    const now = new Date();
    const entry: SmokeLog = {
      id: generateId(),
      timestamp: now.toISOString(),
      count,
      location,
      triggers,
      moodBefore: mood,
      notes,
    };
    addLog(entry);
    toast(`Entry saved — ${count} cigarette(s) at ${formatTimeIST(now)}`);
    setCount(1);
    setLocation('');
    setTriggers([]);
    setMood('');
    setNotes('');
    onSaved();

    // Start cooldown
    setCooldown(true);
    let remaining = COOLDOWN_MS / 1000;
    setCooldownSec(remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      setCooldownSec(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setCooldown(false);
      }
    }, 1000);
  };

  return (
    <div className="bg-card rounded-card border border-border p-5 space-y-4">
      <h2 className="font-heading text-[15px] font-semibold text-foreground">Record Session</h2>

      <div className="space-y-1">
        <Stepper value={count} min={1} max={20} onChange={setCount} />
        <p className="text-xs text-muted font-body text-center">cigarettes</p>
      </div>

      <div className="space-y-2">
        <label className="font-body text-sm text-body">Location</label>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map(l => (
            <Chip key={l} label={l} selected={location === l} onClick={() => setLocation(l)} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-body text-sm text-body">Contributing factor</label>
        <div className="flex flex-wrap gap-2">
          {TRIGGERS.map(t => (
            <Chip key={t} label={t} selected={triggers.includes(t)} onClick={() => toggleTrigger(t)} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-body text-sm text-body">Mood prior</label>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      <div className="space-y-1">
        <label className="font-body text-sm text-body">Recorded at</label>
        <span className="font-body text-sm text-foreground">{formatTimeIST(new Date())}</span>
      </div>

      <div className="space-y-2">
        <label className="font-body text-sm text-body">Notes</label>
        <input
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional context"
          className="w-full bg-surface border border-border rounded-input px-4 py-3 font-body text-sm text-foreground placeholder:text-muted focus:border-primary outline-none"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={cooldown}
        className={`w-full h-[52px] rounded-btn font-heading text-[15px] font-semibold tracking-[0.02em] btn-press transition-colors ${
          cooldown
            ? 'bg-muted text-background cursor-not-allowed'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {cooldown ? `Wait ${cooldownSec}s` : 'Save Entry'}
      </button>
    </div>
  );
};

export default LogCard;
