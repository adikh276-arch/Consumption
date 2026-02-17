import { supabase, setUserContext } from './supabase';

export async function upsertUser(userId: number): Promise<void> {
  await setUserContext(userId);
  const { error } = await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
  if (error) throw error;
}

import { SmokingProfile, SmokeLog } from '@/types/smoking';

export async function saveSmokingProfile(userId: number, profile: SmokingProfile) {
  await setUserContext(userId);
  const { error } = await supabase
    .from('smoking_profiles')
    .upsert({
      user_id: userId,
      start_month: profile.startMonth,
      start_year: profile.startYear,
      avg_per_day: profile.avgPerDay,
      brand: profile.brand,
      per_pack: profile.perPack,
      nicotine_mg: profile.nicotineMg,
      tar_mg: profile.tarMg
    }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function getSmokingProfile(userId: number): Promise<SmokingProfile | null> {
  await setUserContext(userId);
  const { data, error } = await supabase
    .from('smoking_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    startMonth: data.start_month,
    startYear: data.start_year,
    avgPerDay: data.avg_per_day,
    brand: data.brand,
    perPack: data.per_pack,
    nicotineMg: Number(data.nicotine_mg),
    tarMg: Number(data.tar_mg)
  };
}

export async function saveSmokingLog(userId: number, log: SmokeLog) {
  await setUserContext(userId);
  const { error } = await supabase
    .from('smoke_logs')
    .insert({
      user_id: userId,
      logged_at: log.timestamp,
      count: log.count,
      location: log.location,
      triggers: log.triggers,
      mood_before: log.moodBefore,
      notes: log.notes
    });
  if (error) throw error;
}

export async function getSmokeLogs(userId: number): Promise<SmokeLog[]> {
  await setUserContext(userId);
  const { data, error } = await supabase
    .from('smoke_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });
  if (error) throw error;
  return data.map(d => ({
    id: d.id,
    timestamp: d.logged_at,
    count: d.count,
    location: d.location,
    triggers: d.triggers,
    moodBefore: d.mood_before,
    notes: d.notes
  }));
}

export async function deleteSmokingLog(userId: number, id: string) {
  await setUserContext(userId);
  const { error } = await supabase
    .from('smoke_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}
