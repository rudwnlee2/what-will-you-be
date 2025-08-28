'use client';

export type Profile = {
  name: string;
  email: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  school?: string;
  avatarDataUrl?: string; // base64 data url
};

export type HistorySession = {
  id: string; // timestamp id
  date: string; // ISO string
  careers: { id: string; name: string; image?: string }[];
  confirmedCareerId?: string;
};

const PROFILE_KEY = 'wwub_profile';
const HISTORY_KEY = 'wwub_reco_history';
const FINAL_CAREER_KEY = 'finalCareer'; // keep parity with existing session key

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}
export function setProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}
export function upsertProfile(partial: Partial<Profile>) {
  const cur = getProfile() || ({} as Profile);
  setProfile({ ...cur, ...partial });
}

export function getHistory(): HistorySession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr = raw ? (JSON.parse(raw) as HistorySession[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
export function addHistory(session: Omit<HistorySession, 'id' | 'date'>) {
  const list = getHistory();
  const item: HistorySession = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    ...session,
  };
  const next = [item, ...list].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return item;
}
export function markConfirmedInHistory(careerId: string) {
  const list = getHistory();
  if (list.length === 0) return;
  list[0].confirmedCareerId = careerId;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function deleteHistorySession(sessionId: string): boolean {
  try {
    const list = getHistory();
    const filtered = list.filter((session) => session.id !== sessionId);
    if (filtered.length !== list.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function setFinalCareerPersistent(career: any) {
  sessionStorage.setItem(FINAL_CAREER_KEY, JSON.stringify(career));
  localStorage.setItem(FINAL_CAREER_KEY, JSON.stringify(career));
}
export function getFinalCareerPersistent(): any | null {
  try {
    const raw = localStorage.getItem(FINAL_CAREER_KEY) || sessionStorage.getItem(FINAL_CAREER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAllPersonalData() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(FINAL_CAREER_KEY);
    sessionStorage.removeItem(FINAL_CAREER_KEY);
    sessionStorage.removeItem('careerForm');
    sessionStorage.removeItem('recommendationResult');
  } catch {}
}

export function computeAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
