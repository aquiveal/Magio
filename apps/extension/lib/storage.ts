const STORAGE_KEY = 'magio_enabled';
const HOST_KEY = 'magio_host';
const TOKEN_KEY = 'magio_token';
const USER_KEY = 'magio_username';

const DEFAULT_HOST = process.env.PLASMO_PUBLIC_API_URL || 'http://localhost:3000';

let cachedValue: boolean | null = null;
let cachedHost: string | null = null;
let cachedToken: string | null = null;
let cachedUsername: string | null = null;

export async function getTrackingEnabled(): Promise<boolean> {
  if (cachedValue !== null) return cachedValue;
  const result = await chrome.storage.local.get(STORAGE_KEY);
  cachedValue = result[STORAGE_KEY] === undefined ? true : result[STORAGE_KEY];
  return cachedValue;
}

export function getTrackingEnabledSync(): boolean {
  return cachedValue ?? true;
}

export async function setTrackingEnabled(enabled: boolean): Promise<void> {
  cachedValue = enabled;
  await chrome.storage.local.set({ [STORAGE_KEY]: enabled });
}

export type ApiConfig = {
  host: string;
  token: string;
  username: string;
};

export function normalizeHost(host: string): string {
  return host.trim().replace(/\/+$/, '');
}

export async function getApiConfig(): Promise<ApiConfig> {
  const result = await chrome.storage.local.get([HOST_KEY, TOKEN_KEY, USER_KEY]);
  cachedHost = result[HOST_KEY] ? normalizeHost(result[HOST_KEY]) : DEFAULT_HOST;
  cachedToken = result[TOKEN_KEY] ?? '';
  cachedUsername = result[USER_KEY] ?? '';
  return { host: cachedHost, token: cachedToken, username: cachedUsername };
}

export function getApiConfigSync(): ApiConfig {
  return {
    host: cachedHost ?? DEFAULT_HOST,
    token: cachedToken ?? '',
    username: cachedUsername ?? '',
  };
}

/** Persist the server host (called before/after auth). */
export async function setHost(host: string): Promise<void> {
  const clean = normalizeHost(host) || DEFAULT_HOST;
  cachedHost = clean;
  await chrome.storage.local.set({ [HOST_KEY]: clean });
}

/** Persist the signed-in session (API token + username). */
export async function setSession(token: string, username: string): Promise<void> {
  cachedToken = token;
  cachedUsername = username;
  await chrome.storage.local.set({ [TOKEN_KEY]: token, [USER_KEY]: username });
}

export async function clearSession(): Promise<void> {
  cachedToken = '';
  cachedUsername = '';
  await chrome.storage.local.remove([TOKEN_KEY, USER_KEY]);
}

export function initStorageListener(onToggle: (enabled: boolean) => void) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes[HOST_KEY]) {
      cachedHost = changes[HOST_KEY].newValue ? normalizeHost(changes[HOST_KEY].newValue) : DEFAULT_HOST;
    }
    if (changes[TOKEN_KEY]) cachedToken = changes[TOKEN_KEY].newValue ?? '';
    if (changes[USER_KEY]) cachedUsername = changes[USER_KEY].newValue ?? '';
    if (changes[STORAGE_KEY]) {
      cachedValue = changes[STORAGE_KEY].newValue;
      onToggle(cachedValue!);
    }
  });
}

export async function loadInitialState(): Promise<boolean> {
  const [enabled] = await Promise.all([getTrackingEnabled(), getApiConfig()]);
  cachedValue = enabled;
  return enabled;
}
