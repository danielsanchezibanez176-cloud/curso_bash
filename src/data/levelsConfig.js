/* ============================================================
   levelsConfig.js — Tabla de niveles, XP y recompensas
   ============================================================ */

export const LEVELS_CONFIG = [
  {
    level:       1,
    title:       'Novato Linux',
    icon:        '🐧',
    color:       '#8892a4',
    minXP:       0,
    description: 'Acabas de empezar tu camino en Linux.',
    perks:       ['Acceso a Días 1-7', 'Terminal básica'],
  },
  {
    level:       2,
    title:       'Explorador Linux',
    icon:        '🗺️',
    color:       '#4d9fff',
    minXP:       500,
    description: 'Ya navegas el sistema de archivos con confianza.',
    perks:       ['Acceso a Días 8-14', 'Laboratorios nivel 2'],
  },
  {
    level:       3,
    title:       'Operador Linux',
    icon:        '⚙️',
    color:       '#00d4ff',
    minXP:       1500,
    description: 'Manejas scripts y automatización sin problema.',
    perks:       ['Acceso a Días 15-20', 'Challenges extra'],
  },
  {
    level:       4,
    title:       'Administrador Linux',
    icon:        '🛡️',
    color:       '#00ff88',
    minXP:       3500,
    description: 'Puedes administrar sistemas Linux en producción.',
    perks:       ['Acceso a Días 21-25', 'Modo Ciberseguridad'],
  },
  {
    level:       5,
    title:       'Analista Linux',
    icon:        '🔍',
    color:       '#9b5dff',
    minXP:       7000,
    description: 'Detectas amenazas y analizas sistemas comprometidos.',
    perks:       ['Acceso a Días 26-29', 'Laboratorios avanzados'],
  },
  {
    level:       6,
    title:       'Defensor Linux',
    icon:        '⚔️',
    color:       '#ffd700',
    minXP:       12000,
    description: 'Dominas Linux, Bash y fundamentos de Ciberseguridad.',
    perks:       ['Acceso al Día 30', 'Proyecto Final desbloqueado', 'Certificado digital'],
  },
]

// XP necesaria para pasar de un nivel al siguiente
export function xpToNextLevel(currentLevel) {
  const next = LEVELS_CONFIG.find(l => l.level === currentLevel + 1)
  const curr = LEVELS_CONFIG.find(l => l.level === currentLevel)
  if (!next || !curr) return 0
  return next.minXP - curr.minXP
}

// Porcentaje de progreso dentro del nivel actual
export function levelProgress(xp) {
  const curr = LEVELS_CONFIG.slice().reverse().find(l => xp >= l.minXP) || LEVELS_CONFIG[0]
  const next = LEVELS_CONFIG.find(l => l.level === curr.level + 1)
  if (!next) return { pct: 100, current: curr, next: null, xpIn: xp - curr.minXP, xpNeeded: 0 }
  const range  = next.minXP - curr.minXP
  const xpIn   = xp - curr.minXP
  return {
    pct:      Math.round((xpIn / range) * 100),
    current:  curr,
    next,
    xpIn,
    xpNeeded: next.minXP - xp,
    range,
  }
}

// Tabla de recompensas XP por acción
export const XP_TABLE = {
  // Lecciones
  LESSON_VIEW:       25,
  LESSON_COMPLETE:   50,

  // Quizzes
  QUIZ_PASS:         25,    // ≥40%
  QUIZ_GOOD:         50,    // ≥60%
  QUIZ_PERFECT:      100,   // 100%

  // Laboratorios
  LAB_STEP:          20,    // por paso completado
  LAB_COMPLETE:      150,   // lab entero

  // Terminal
  FIRST_COMMAND:     25,
  TERMINAL_SESSION:  10,    // por sesión

  // Misiones
  MISSION_COMPLETE:  75,

  // Día completo (todos los módulos)
  DAY_COMPLETE:      200,

  // Rachas
  STREAK_3:          100,
  STREAK_7:          300,
  STREAK_14:         600,
  STREAK_30:         2000,

  // Bonos especiales
  QUIZ_STREAK_3:     200,   // 3 quizzes perfectos seguidos
  ALL_MISSIONS_DAY:  100,   // todas las misiones de un día
}
