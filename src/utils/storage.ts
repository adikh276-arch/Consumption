import { SmokingProfile, SmokeLog } from '@/types/smoking';

export function getProfile(): SmokingProfile | null {
  const raw = localStorage.getItem('smokingProfile');
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(p: SmokingProfile) {
  localStorage.setItem('smokingProfile', JSON.stringify(p));
  localStorage.setItem('smokeProfileSet', 'true');
}

export function isProfileSet(): boolean {
  return localStorage.getItem('smokeProfileSet') === 'true';
}

export function getLogs(): SmokeLog[] {
  const raw = localStorage.getItem('smokeLogs');
  return raw ? JSON.parse(raw) : [];
}

export function saveLogs(logs: SmokeLog[]) {
  localStorage.setItem('smokeLogs', JSON.stringify(logs));
}

export function addLog(log: SmokeLog) {
  const logs = getLogs();
  logs.unshift(log);
  saveLogs(logs);
}

export function removeLog(id: string) {
  const logs = getLogs().filter(l => l.id !== id);
  saveLogs(logs);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function formatTimeIST(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

export function formatDateDMY(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatIndianNumber(n: number): string {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  let result = s.slice(-3);
  let remaining = s.slice(0, -3);
  while (remaining.length > 2) {
    result = remaining.slice(-2) + ',' + result;
    remaining = remaining.slice(0, -2);
  }
  if (remaining.length > 0) result = remaining + ',' + result;
  return result;
}

export function getTodayLogs(): SmokeLog[] {
  const today = new Date();
  const todayStr = formatDateDMY(today);
  return getLogs().filter(l => formatDateDMY(new Date(l.timestamp)) === todayStr);
}

export function getSmokingDurationMonths(profile: SmokingProfile): number {
  const now = new Date();
  return (now.getFullYear() - profile.startYear) * 12 + (now.getMonth() - profile.startMonth);
}
