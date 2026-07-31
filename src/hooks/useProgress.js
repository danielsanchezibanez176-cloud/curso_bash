import { useState, useEffect, useCallback, useRef } from 'react'

/* ============================================================
   useProgress — Sistema completo de progreso, XP y gamificación
   Persiste en LocalStorage bajo la clave 'la30_progress'
   ============================================================ */

export const LEVELS = [
  { level: 1, title: 'Novato Linux',        minXP: 0,     icon: '🐧', color: '#8892a4' },
  { level: 2, title: 'Explorador Linux',    minXP: 500,   icon: '🗺️', color: '#4d9fff' },
  { level: 3, title: 'Operador Linux',      minXP: 1500,  icon: '⚙️', color: '#00d4ff' },
  { level: 4, title: 'Administrador Linux', minXP: 3500,  icon: '🛡️', color: '#00ff88' },
  { level: 5, title: 'Analista Linux',      minXP: 7000,  icon: '🔍', color: '#9b5dff' },
  { level: 6, title: 'Defensor Linux',      minXP: 12000, icon: '⚔️', color: '#ffd700' },
]

export const XP_REWARDS = {
  LESSON_COMPLETE:   50,
  QUIZ_PERFECT:     100,
  QUIZ_GOOD:         50,
  QUIZ_PASS:         25,
  MISSION_COMPLETE:  75,
  LAB_COMPLETE:     150,
  DAY_COMPLETE:     200,
  STREAK_BONUS:     500,
  FIRST_COMMAND:     25,
  TERMINAL_SESSION:  10,
}

const STORAGE_KEY    = 'la30_progress'
const DEFAULT_STATE = {
  currentDay:         1,
  completedDays:      [],      // [1, 2, 3, ...]
  xp:                 0,
  level:              1,
  levelTitle:         'Novato Linux',
  levelIcon:          '🐧',
  studyTimeMinutes:   0,
  achievements:       [],      // ['first_command', 'day1_complete', ...]
  quizScores:         {},      // { 1: 5, 2: 3, ... }
  missionsCompleted:  {},      // { 1: ['m1', 'm2'], ... }
  labsCompleted:      [],      // [1, 2, ...]
  labStepsCompleted:  {},      // { 1: [0, 1, ...] }
  lessonsViewed:      [],      // [1, 2, ...]
  lastLogin:          null,
  streak:             0,
  longestStreak:      0,
  projectsUnlocked:   [],
  commandsExecuted:   0,
  totalSessions:      0,
  firstCommandDone:   false,
  lastCompletionDate: null,
  xpClaims:           [],      // IDs de recompensas ya cobradas
}

// ─── Helpers ────────────────────────────────────────────────

function getLevelFromXP(xp) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.minXP) current = l
  }
  return current
}

function getXPInfo(xp) {
  const currentLvl = getLevelFromXP(xp)
  const nextLvlIdx = LEVELS.findIndex(l => l.level === currentLvl.level + 1)
  if (nextLvlIdx === -1) {
    return { pct: 100, needed: 0, current: xp, range: xp, nextLevel: null, currentLevel: currentLvl }
  }
  const nextLvl  = LEVELS[nextLvlIdx]
  const prevMinXP = currentLvl.minXP
  const range     = nextLvl.minXP - prevMinXP
  const current   = xp - prevMinXP
  return {
    pct: Math.round((current / range) * 100),
    needed: nextLvl.minXP - xp,
    current,
    range,
    nextLevel: nextLvl,
    currentLevel: currentLvl,
  }
}

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dayDifference(from, to) {
  if (!from) return null
  const start = new Date(`${from}T12:00:00`)
  const end = new Date(`${to}T12:00:00`)
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return null
  return Math.round((end - start) / 86_400_000)
}

function uniqueValidDays(value) {
  return [...new Set((Array.isArray(value) ? value : [])
    .map(Number)
    .filter(day => Number.isInteger(day) && day >= 1 && day <= 30))]
    .sort((a, b) => a - b)
}

export function normalizeProgress(saved = {}) {
  const completedDays = uniqueValidDays(saved.completedDays)
  const labsCompleted = uniqueValidDays(saved.labsCompleted)
  const lessonsViewed = uniqueValidDays(saved.lessonsViewed)
  const achievements = [...new Set(Array.isArray(saved.achievements) ? saved.achievements.filter(Boolean) : [])]
  const projectsUnlocked = [...new Set(Array.isArray(saved.projectsUnlocked) ? saved.projectsUnlocked.filter(Boolean) : [])]
  const missionsCompleted = saved.missionsCompleted && typeof saved.missionsCompleted === 'object'
    ? Object.fromEntries(Object.entries(saved.missionsCompleted)
      .filter(([day]) => Number(day) >= 1 && Number(day) <= 30)
      .map(([day, ids]) => [day, [...new Set(Array.isArray(ids) ? ids.filter(id => typeof id === 'string' && id) : [])]]))
    : {}
  const labStepsCompleted = saved.labStepsCompleted && typeof saved.labStepsCompleted === 'object'
    ? Object.fromEntries(Object.entries(saved.labStepsCompleted)
      .filter(([day]) => Number(day) >= 1 && Number(day) <= 30)
      .map(([day, steps]) => [day, [...new Set((Array.isArray(steps) ? steps : []).map(Number).filter(step => Number.isInteger(step) && step >= 0))]]))
    : {}
  const quizScores = saved.quizScores && typeof saved.quizScores === 'object'
    ? Object.fromEntries(Object.entries(saved.quizScores)
      .filter(([day, score]) => Number(day) >= 1 && Number(day) <= 30 && Number.isFinite(Number(score)))
      .map(([day, score]) => [day, Math.min(5, Math.max(0, Number(score)))]))
    : {}
  const inferredClaims = [
    ...(saved.firstCommandDone ? ['first-command'] : []),
    ...completedDays.map(day => `day:${day}`),
    ...labsCompleted.map(day => `lab:${day}`),
    ...Object.entries(labStepsCompleted).flatMap(([day, steps]) => steps.map(step => `lab-step:${day}:${step}`)),
    ...Object.entries(missionsCompleted).flatMap(([day, ids]) => ids.map(id => `mission:${day}:${id}`)),
    ...Object.entries(quizScores).filter(([, score]) => score >= 2).map(([day]) => `quiz:${day}`),
  ]
  const xp = Math.max(0, Number(saved.xp) || 0)
  const lvl = getLevelFromXP(xp)
  const storedStreak = Math.max(0, Number(saved.streak) || 0)
  const streakExpired = saved.lastCompletionDate && dayDifference(saved.lastCompletionDate, dateKey()) > 1
  const streak = streakExpired ? 0 : storedStreak
  return {
    ...DEFAULT_STATE,
    ...saved,
    completedDays,
    labsCompleted,
    lessonsViewed,
    achievements,
    projectsUnlocked,
    missionsCompleted,
    labStepsCompleted,
    quizScores,
    xp,
    level: lvl.level,
    levelTitle: lvl.title,
    levelIcon: lvl.icon,
    currentDay: Math.min(30, Math.max(1, Number(saved.currentDay) || 1)),
    studyTimeMinutes: Math.max(0, Number(saved.studyTimeMinutes) || 0),
    commandsExecuted: Math.max(0, Number(saved.commandsExecuted) || 0),
    totalSessions: Math.max(0, Number(saved.totalSessions) || 0),
    streak,
    longestStreak: Math.max(streak, Number(saved.longestStreak) || 0),
    lastCompletionDate: /^\d{4}-\d{2}-\d{2}$/.test(saved.lastCompletionDate || '') ? saved.lastCompletionDate : null,
    xpClaims: [...new Set([...(Array.isArray(saved.xpClaims) ? saved.xpClaims.filter(claim => typeof claim === 'string' && claim) : []), ...inferredClaims])],
    lastLogin: new Date().toISOString(),
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }
}

// ─── Hook principal ──────────────────────────────────────────

export function useProgress() {
  const [state, setState] = useState(() => {
    const saved = loadFromStorage()
    return normalizeProgress(saved || {})
  })

  // Persistir cada vez que cambia el estado
  useEffect(() => { saveToStorage(state) }, [state])

  // Contar una sola sesión por pestaña, incluso con StrictMode.
  useEffect(() => {
    try {
      const sessionKey = 'la30_session_counted'
      if (sessionStorage.getItem(sessionKey)) return
      sessionStorage.setItem(sessionKey, '1')
      setState(prev => ({ ...prev, totalSessions: prev.totalSessions + 1 }))
    } catch {}
  }, [])

  // ── Temporizador de sesión ────────────────────────────────
  const timerRef = useRef(null)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setState(prev => ({ ...prev, studyTimeMinutes: prev.studyTimeMinutes + 1 }))
    }, 60_000)
    return () => clearInterval(timerRef.current)
  }, [])

  // ── Acciones ──────────────────────────────────────────────

  const addXP = useCallback((amount) => {
    setState(prev => {
      const safeAmount = Number(amount)
      if (!Number.isFinite(safeAmount) || safeAmount <= 0) return prev
      const newXP = prev.xp + safeAmount
      const lvl   = getLevelFromXP(newXP)
      return {
        ...prev,
        xp:         newXP,
        level:      lvl.level,
        levelTitle: lvl.title,
        levelIcon:  lvl.icon,
      }
    })
  }, [])

  const awardXP = useCallback((amount, claimId) => {
    setState(prev => {
      const safeAmount = Number(amount)
      if (!claimId || !Number.isFinite(safeAmount) || safeAmount <= 0 || prev.xpClaims.includes(claimId)) return prev
      const newXP = prev.xp + safeAmount
      const lvl = getLevelFromXP(newXP)
      return {
        ...prev,
        xp: newXP,
        level: lvl.level,
        levelTitle: lvl.title,
        levelIcon: lvl.icon,
        xpClaims: [...prev.xpClaims, claimId],
      }
    })
  }, [])

  const completeDay = useCallback((day) => {
    setState(prev => {
      if (prev.completedDays.includes(day)) return prev
      const completedDays = [...prev.completedDays, day].sort((a, b) => a - b)
      const currentDay    = Math.min(30, Math.max(prev.currentDay, day + 1))
      const today = dateKey()
      const diff = dayDifference(prev.lastCompletionDate, today)
      const newStreak = diff === 0 ? prev.streak : diff === 1 ? prev.streak + 1 : 1
      const longestStreak = Math.max(prev.longestStreak, newStreak)
      return { ...prev, completedDays, currentDay, streak: newStreak, longestStreak, lastCompletionDate: today }
    })
  }, [])

  const viewLesson = useCallback((day) => {
    setState(prev => {
      if (prev.lessonsViewed.includes(day)) return prev
      return { ...prev, lessonsViewed: [...prev.lessonsViewed, day] }
    })
  }, [])

  const saveQuizScore = useCallback((day, score) => {
    setState(prev => {
      const safeScore = Math.max(0, Number(score) || 0)
      const previous = Number(prev.quizScores[day])
      if (Number.isFinite(previous) && previous >= safeScore) return prev
      return { ...prev, quizScores: { ...prev.quizScores, [day]: safeScore } }
    })
  }, [])

  const completeMission = useCallback((day, missionId) => {
    setState(prev => {
      const existing = prev.missionsCompleted[day] || []
      if (existing.includes(missionId)) return prev
      return {
        ...prev,
        missionsCompleted: {
          ...prev.missionsCompleted,
          [day]: [...existing, missionId],
        },
      }
    })
  }, [])

  const completeLab = useCallback((day) => {
    setState(prev => {
      if (prev.labsCompleted.includes(day)) return prev
      return { ...prev, labsCompleted: [...prev.labsCompleted, day] }
    })
  }, [])

  const completeLabStep = useCallback((day, stepIndex) => {
    setState(prev => {
      const existing = prev.labStepsCompleted?.[day] || []
      if (existing.includes(stepIndex)) return prev
      return {
        ...prev,
        labStepsCompleted: {
          ...(prev.labStepsCompleted || {}),
          [day]: [...existing, stepIndex],
        },
      }
    })
  }, [])

  const unlockAchievement = useCallback((id) => {
    setState(prev => {
      if (prev.achievements.includes(id)) return prev
      return { ...prev, achievements: [...prev.achievements, id] }
    })
  }, [])

  const recordCommand = useCallback(() => {
    setState(prev => ({
      ...prev,
      commandsExecuted: prev.commandsExecuted + 1,
      firstCommandDone: true,
    }))
  }, [])

  const unlockProject = useCallback((id) => {
    setState(prev => {
      if (prev.projectsUnlocked.includes(id)) return prev
      return { ...prev, projectsUnlocked: [...prev.projectsUnlocked, id] }
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ ...DEFAULT_STATE, lastLogin: new Date().toISOString() })
  }, [])

  // ── Derivados ─────────────────────────────────────────────
  const xpInfo        = getXPInfo(state.xp)
  const completionPct = Math.round((state.completedDays.length / 30) * 100)
  const isDayUnlocked = (day) => day === 1 || state.completedDays.includes(day - 1) || day <= state.currentDay
  const isDayComplete = (day) => state.completedDays.includes(day)
  const getMissionsDone = (day) => state.missionsCompleted[day] || []
  const getQuizScore    = (day) => state.quizScores[day] ?? null
  const studyHours      = Math.floor(state.studyTimeMinutes / 60)
  const studyMins       = state.studyTimeMinutes % 60

  return {
    // Estado
    ...state,
    // Derivados
    xpInfo,
    completionPct,
    studyHours,
    studyMins,
    levels: LEVELS,
    totalDays: 30,
    // Checkers
    isDayUnlocked,
    isDayComplete,
    getMissionsDone,
    getQuizScore,
    // Acciones
    addXP,
    awardXP,
    completeDay,
    viewLesson,
    saveQuizScore,
    completeMission,
    completeLab,
    completeLabStep,
    unlockAchievement,
    recordCommand,
    unlockProject,
    reset,
    XP_REWARDS,
  }
}
