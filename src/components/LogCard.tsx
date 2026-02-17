import React, { useState, useRef } from 'react';
import Stepper from './Stepper';
import Chip from './Chip';
import MoodSelector from './MoodSelector';
import { LOCATIONS, TRIGGERS, SmokeLog } from '@/types/smoking';
import { addLog, generateId, formatTimeIST } from '@/utils/storage';
import { toast } from 'sonner';

const LogCard: React.FC<{ onSaved: () => void }> = ({ onSaved }) => {
  const [count, setCount] = useState(1);
  const [location, setLocation] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState(new Date());
  const timeRef = useRef<HTMLInputElement>(null);

  const toggleTrigger = (t: string) =>
    setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSave = () => {
    const entry: SmokeLog = {
      id: generateId(),
      timestamp: time.toISOString(),
      count,
      location,
      triggers,
      moodBefore: mood,
      notes,
    };
    addLog(entry);
    toast(`Entry saved — ${count} cigarette(s) at ${formatTimeIST(time)}`);
    setCount(1);
    setLocation('');
    setTriggers([]);
    setMood('');
    setNotes('');
    setTime(new Date());
    onSaved();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m] = e.target.value.split(':').map(Number);
    const d = new Date(time);
    d.setHours(h, m);
    setTime(d);
  };

  return (
    <div className="bg-card rounded-card border border-border p-5 space-y-4">
      <h2 className="font-heading text-[15px] font-semibold text-foreground">Record Session</h2>

      {/* Quantity */}
      <div className="space-y-1">
        <Stepper value={count} min={1} max={20} onChange={setCount} />
        <p className="text-xs text-muted font-body text-center">cigarettes</p>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Location</label>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map(l => (
            <Chip key={l} label={l} selected={location === l} onClick={() => setLocation(l)} />
          ))}
        </div>
      </div>

      {/* Triggers */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Contributing factor</label>
        <div className="flex flex-wrap gap-2">
          {TRIGGERS.map(t => (
            <Chip key={t} label={t} selected={triggers.includes(t)} onClick={() => toggleTrigger(t)} />
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Mood prior</label>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      {/* Time */}
      <div className="space-y-1">
        <label className="font-body text-sm text-body">Recorded at</label>
        <div className="flex items-center gap-3">
          <span className="font-body text-sm text-foreground">{formatTimeIST(time)}</span>
          <button
            type="button"
            onClick={() => timeRef.current?.showPicker?.()}
            className="font-body text-xs text-primary btn-press"
          >
            Edit time
          </button>
          <input
            ref={timeRef}
            type="time"
            className="sr-only"
            onChange={handleTimeChange}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="font-body text-sm text-body">Notes</label>
        <input
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional context"
          className="w-full bg-surface border border-border rounded-input px-4 py-3 font-body text-sm text-foreground placeholder:text-muted focus:border-primary outline-none"
        />
      </div>

      <button onClick={handleSave} className="w-full h-[52px] bg-primary rounded-btn font-heading text-[15px] font-semibold text-primary-foreground tracking-[0.02em] btn-press">
        Save Entry
      </button>
    </div>
  );
};

export default LogCard;
