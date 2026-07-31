/* ============================================================
   storage.js — Wrapper de LocalStorage con versionado,
   migración y manejo robusto de errores
   ============================================================ */

const VERSION = '1.0.0'
const PREFIX  = 'la30_'

export const KEYS = {
  PROGRESS:         `${PREFIX}progress`,
  FILESYSTEM:       `${PREFIX}filesystem`,
  TERMINAL_HISTORY: `${PREFIX}terminal_history`,
  TERMINAL_ACTIVITY:`${PREFIX}terminal_activity`,
  SETTINGS:         `${PREFIX}settings`,
  SESSION:          `${PREFIX}session`,
}

// ─── Primitivas ──────────────────────────────────────────────

export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    // Quota exceeded o modo privado sin almacenamiento
    console.warn(`[storage] Cannot write "${key}":`, e.message)
    return false
  }
}

export function storageRemove(key) {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export function storageClear() {
  try {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  } catch {}
}

// ─── Settings ────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  theme:              'light',
  fontSize:           14,
  soundEnabled:       false,
  animationsEnabled:  true,
  terminalFont:       'JetBrains Mono',
  showLineNumbers:    true,
  version:            VERSION,
}

export function getSettings() {
  const saved = storageGet(KEYS.SETTINGS, {})
  return saved && typeof saved === 'object'
    ? { ...DEFAULT_SETTINGS, ...saved }
    : { ...DEFAULT_SETTINGS }
}

export function saveSettings(partial) {
  const current = getSettings()
  storageSet(KEYS.SETTINGS, { ...current, ...partial })
}

// ─── Historial de terminal ───────────────────────────────────

const MAX_HISTORY = 500

export function getTerminalHistory() {
  const saved = storageGet(KEYS.TERMINAL_HISTORY, [])
  if (!Array.isArray(saved)) return []
  return saved.filter(item => typeof item === 'string' && item.trim()).slice(-MAX_HISTORY)
}

export function pushTerminalHistory(cmd) {
  if (!cmd || !cmd.trim()) return
  const history = getTerminalHistory()
  const command = cmd.trim()
  const next = [...history, command].slice(-MAX_HISTORY)
  storageSet(KEYS.TERMINAL_HISTORY, next)
  const activity = getTerminalActivity()
  const sequence = activity.sequence + 1
  storageSet(KEYS.TERMINAL_ACTIVITY, {
    sequence,
    entries: [...activity.entries, { sequence, command }].slice(-MAX_HISTORY),
  })
}

export function clearTerminalHistory() {
  storageSet(KEYS.TERMINAL_HISTORY, [])
  storageSet(KEYS.TERMINAL_ACTIVITY, { sequence: 0, entries: [] })
}

function getTerminalActivity() {
  const saved = storageGet(KEYS.TERMINAL_ACTIVITY, null)
  if (!saved || typeof saved !== 'object') return { sequence: 0, entries: [] }
  const sequence = Math.max(0, Number(saved.sequence) || 0)
  const entries = Array.isArray(saved.entries)
    ? saved.entries.filter(entry => entry && Number.isFinite(Number(entry.sequence)) && typeof entry.command === 'string')
    : []
  return { sequence, entries }
}

export function getTerminalActivitySequence() {
  return getTerminalActivity().sequence
}

export function getTerminalActivitySince(sequence) {
  const start = Math.max(0, Number(sequence) || 0)
  return getTerminalActivity().entries
    .filter(entry => entry.sequence > start)
    .map(entry => entry.command)
}

// ─── Sistema de archivos ─────────────────────────────────────

export function getFilesystem() {
  const saved = storageGet(KEYS.FILESYSTEM, null)
  if (!saved || typeof saved !== 'object') return null
  if (!saved.tree || typeof saved.tree !== 'object' || typeof saved.cwd !== 'string') return null
  return saved
}

export function saveFilesystem(fs) {
  if (fs === null) {
    storageRemove(KEYS.FILESYSTEM)
    return
  }
  storageSet(KEYS.FILESYSTEM, fs)
}

// ─── Sesión actual ───────────────────────────────────────────

export function getSession() {
  const saved = storageGet(KEYS.SESSION, null)
  return saved && typeof saved === 'object'
    ? { startedAt: Date.now(), commandCount: 0, ...saved }
    : { startedAt: Date.now(), commandCount: 0 }
}

export function updateSession(partial) {
  const current = getSession()
  storageSet(KEYS.SESSION, { ...current, ...partial })
}

// ─── Diagnóstico ─────────────────────────────────────────────

export function getStorageInfo() {
  let used = 0
  let keys = []
  try {
    for (const key of Object.values(KEYS)) {
      const val = localStorage.getItem(key)
      if (val) used += val.length * 2 // 2 bytes por char UTF-16
    }
    keys = Object.values(KEYS).filter(k => localStorage.getItem(k) !== null)
  } catch {}
  return {
    usedBytes: used,
    usedKB:    (used / 1024).toFixed(1),
    keys,
  }
}
