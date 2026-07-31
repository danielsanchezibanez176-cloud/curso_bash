/* ============================================================
   achievementsDB.js — Base de datos completa de logros
   ============================================================ */

export const achievementsDB = [
  // ── Primeros pasos ─────────────────────────────────────────
  {
    id:          'first_command',
    name:        'Primer Comando',
    description: 'Ejecutaste tu primer comando en la terminal',
    icon:        '⌨️',
    xp:          25,
    rarity:      'common',
    category:    'terminal',
    condition:   { type: 'command_executed', command: 'any' },
  },
  {
    id:          'hello_linux',
    name:        'Hola, Linux',
    description: 'Completaste el Día 1 del curso',
    icon:        '🐧',
    xp:          100,
    rarity:      'common',
    category:    'progress',
  },
  {
    id:          'navigator',
    name:        'Navegador',
    description: 'Usaste cd, ls y pwd en la misma sesión',
    icon:        '🗺️',
    xp:          50,
    rarity:      'common',
    category:    'terminal',
  },
  {
    id:          'file_creator',
    name:        'Creador de Archivos',
    description: 'Creaste tu primer archivo con touch',
    icon:        '📄',
    xp:          30,
    rarity:      'common',
    category:    'terminal',
  },
  {
    id:          'dir_maker',
    name:        'Arquitecto de Directorios',
    description: 'Creaste tu primer directorio con mkdir',
    icon:        '📁',
    xp:          30,
    rarity:      'common',
    category:    'terminal',
  },

  // ── Progreso del curso ─────────────────────────────────────
  {
    id:          'week1_done',
    name:        'Semana 1 Completa',
    description: 'Completaste los primeros 7 días del curso',
    icon:        '📅',
    xp:          200,
    rarity:      'common',
    category:    'progress',
  },
  {
    id:          'week2_done',
    name:        'Semana 2 Completa',
    description: 'Completaste 14 días del curso',
    icon:        '🗓️',
    xp:          300,
    rarity:      'rare',
    category:    'progress',
  },
  {
    id:          'week3_done',
    name:        'Semana 3 Completa',
    description: 'Completaste 21 días del curso',
    icon:        '🎯',
    xp:          400,
    rarity:      'rare',
    category:    'progress',
  },
  {
    id:          'week4_done',
    name:        'Semana 4 Completa',
    description: 'Completaste 28 días del curso',
    icon:        '🔥',
    xp:          600,
    rarity:      'rare',
    category:    'progress',
  },
  {
    id:          'course_complete',
    name:        'Graduado Linux',
    description: '¡Completaste los 30 días del curso!',
    icon:        '🎓',
    xp:          2000,
    rarity:      'legendary',
    category:    'progress',
  },

  // ── Terminal ───────────────────────────────────────────────
  {
    id:          'grep_master',
    name:        'Maestro del Grep',
    description: 'Usaste grep para buscar en archivos',
    icon:        '🔍',
    xp:          50,
    rarity:      'common',
    category:    'terminal',
  },
  {
    id:          'permission_keeper',
    name:        'Guardián de Permisos',
    description: 'Usaste chmod para cambiar permisos',
    icon:        '🔐',
    xp:          75,
    rarity:      'common',
    category:    'terminal',
  },
  {
    id:          'pipe_wizard',
    name:        'Mago de Pipes',
    description: 'Encadenaste dos comandos con pipe |',
    icon:        '🪄',
    xp:          100,
    rarity:      'rare',
    category:    'terminal',
  },
  {
    id:          'script_writer',
    name:        'Escritor de Scripts',
    description: 'Creaste un archivo .sh y lo ejecutaste',
    icon:        '📜',
    xp:          150,
    rarity:      'rare',
    category:    'bash',
  },
  {
    id:          'hundred_commands',
    name:        'Centurión del Terminal',
    description: 'Ejecutaste 100 comandos en el simulador',
    icon:        '💯',
    xp:          200,
    rarity:      'rare',
    category:    'terminal',
  },
  {
    id:          'five_hundred_commands',
    name:        'Maestro del Terminal',
    description: 'Ejecutaste 500 comandos en total',
    icon:        '⚡',
    xp:          500,
    rarity:      'legendary',
    category:    'terminal',
  },

  // ── Quizzes ────────────────────────────────────────────────
  {
    id:          'first_quiz',
    name:        'Primer Examen',
    description: 'Completaste tu primer quiz',
    icon:        '📝',
    xp:          50,
    rarity:      'common',
    category:    'quiz',
  },
  {
    id:          'quiz_perfect',
    name:        'Perfeccionista',
    description: 'Sacaste 5/5 en un quiz',
    icon:        '⭐',
    xp:          150,
    rarity:      'rare',
    category:    'quiz',
  },
  {
    id:          'quiz_streak_3',
    name:        'Trío Perfecto',
    description: 'Sacaste 5/5 en 3 quizzes seguidos',
    icon:        '🎯',
    xp:          300,
    rarity:      'rare',
    category:    'quiz',
  },
  {
    id:          'quiz_all',
    name:        'Examinado Completo',
    description: 'Completaste todos los quizzes del curso',
    icon:        '🏅',
    xp:          500,
    rarity:      'legendary',
    category:    'quiz',
  },

  // ── Laboratorios ───────────────────────────────────────────
  {
    id:          'first_lab',
    name:        'Primer Laboratorio',
    description: 'Completaste tu primer laboratorio',
    icon:        '🧪',
    xp:          150,
    rarity:      'common',
    category:    'lab',
  },
  {
    id:          'lab_master',
    name:        'Científico Linux',
    description: 'Completaste 10 laboratorios',
    icon:        '🔬',
    xp:          400,
    rarity:      'rare',
    category:    'lab',
  },
  {
    id:          'all_labs',
    name:        'Doctor en Linux',
    description: 'Completaste todos los laboratorios',
    icon:        '🎓',
    xp:          800,
    rarity:      'legendary',
    category:    'lab',
  },

  // ── Rachas ─────────────────────────────────────────────────
  {
    id:          'streak_3',
    name:        'Constante',
    description: '3 días de estudio consecutivos',
    icon:        '📈',
    xp:          100,
    rarity:      'common',
    category:    'streak',
  },
  {
    id:          'streak_7',
    name:        'Semana Imparable',
    description: '7 días de estudio consecutivos',
    icon:        '🔥',
    xp:          300,
    rarity:      'rare',
    category:    'streak',
  },
  {
    id:          'streak_14',
    name:        'Dos Semanas Fuerte',
    description: '14 días de estudio consecutivos',
    icon:        '💪',
    xp:          600,
    rarity:      'rare',
    category:    'streak',
  },
  {
    id:          'streak_30',
    name:        'Leyenda',
    description: '30 días de estudio consecutivos',
    icon:        '👑',
    xp:          2000,
    rarity:      'legendary',
    category:    'streak',
  },

  // ── Ciberseguridad ─────────────────────────────────────────
  {
    id:          'cyber_start',
    name:        'Aprendiz de Seguridad',
    description: 'Completaste el Día 20 — Introducción a Ciberseguridad',
    icon:        '🛡️',
    xp:          300,
    rarity:      'rare',
    category:    'cyber',
  },
  {
    id:          'log_analyst',
    name:        'Analista de Logs',
    description: 'Analizaste logs del sistema en el laboratorio',
    icon:        '📋',
    xp:          200,
    rarity:      'rare',
    category:    'cyber',
  },
  {
    id:          'hardener',
    name:        'Hardener',
    description: 'Completaste el laboratorio de Hardening Linux',
    icon:        '🔒',
    xp:          300,
    rarity:      'rare',
    category:    'cyber',
  },
  {
    id:          'defender',
    name:        'Defensor Linux',
    description: 'Completaste el módulo de ciberseguridad completo (Días 20-29)',
    icon:        '⚔️',
    xp:          800,
    rarity:      'legendary',
    category:    'cyber',
  },

  // ── Proyecto Final ─────────────────────────────────────────
  {
    id:          'project_started',
    name:        'En Construcción',
    description: 'Iniciaste el proyecto final',
    icon:        '🏗️',
    xp:          200,
    rarity:      'rare',
    category:    'project',
  },
  {
    id:          'project_complete',
    name:        'Centro de Monitoreo',
    description: 'Completaste el proyecto final del Centro de Monitoreo Linux',
    icon:        '🖥️',
    xp:          1000,
    rarity:      'legendary',
    category:    'project',
  },

  // ── XP milestones ──────────────────────────────────────────
  {
    id:          'xp_500',
    name:        'Explorador',
    description: 'Acumulaste 500 XP',
    icon:        '🗺️',
    xp:          0,
    rarity:      'common',
    category:    'xp',
  },
  {
    id:          'xp_1500',
    name:        'Operador',
    description: 'Acumulaste 1,500 XP',
    icon:        '⚙️',
    xp:          0,
    rarity:      'rare',
    category:    'xp',
  },
  {
    id:          'xp_3500',
    name:        'Administrador',
    description: 'Acumulaste 3,500 XP',
    icon:        '🛡️',
    xp:          0,
    rarity:      'rare',
    category:    'xp',
  },
  {
    id:          'xp_7000',
    name:        'Analista',
    description: 'Acumulaste 7,000 XP',
    icon:        '🔍',
    xp:          0,
    rarity:      'legendary',
    category:    'xp',
  },
  {
    id:          'xp_12000',
    name:        'Defensor Élite',
    description: 'Alcanzaste el nivel máximo con 12,000 XP',
    icon:        '👑',
    xp:          0,
    rarity:      'legendary',
    category:    'xp',
  },
]

// Helper: obtener logro por ID
export function getAchievement(id) {
  return achievementsDB.find(a => a.id === id) || null
}

// Helper: logros por categoría
export function getAchievementsByCategory(category) {
  return achievementsDB.filter(a => a.category === category)
}

// Helper: verificar si un logro debe desbloquearse automáticamente
export function checkAutoAchievements(progress) {
  const toUnlock = []
  const already  = new Set(progress.achievements || [])

  const check = (id, condition) => {
    if (!already.has(id) && condition) toUnlock.push(id)
  }

  check('hello_linux',       progress.completedDays?.includes(1))
  check('week1_done',        progress.completedDays?.length >= 7)
  check('week2_done',        progress.completedDays?.length >= 14)
  check('week3_done',        progress.completedDays?.length >= 21)
  check('week4_done',        progress.completedDays?.length >= 28)
  check('course_complete',   progress.completedDays?.length >= 30)
  check('first_lab',         progress.labsCompleted?.length >= 1)
  check('lab_master',        progress.labsCompleted?.length >= 10)
  check('all_labs',          progress.labsCompleted?.length >= 30)
  check('first_quiz',        Object.keys(progress.quizScores || {}).length >= 1)
  check('quiz_all',          Object.keys(progress.quizScores || {}).length >= 30)
  check('streak_3',          progress.streak >= 3)
  check('streak_7',          progress.streak >= 7)
  check('streak_14',         progress.streak >= 14)
  check('streak_30',         progress.streak >= 30)
  check('hundred_commands',  progress.commandsExecuted >= 100)
  check('five_hundred_commands', progress.commandsExecuted >= 500)
  check('cyber_start',       progress.completedDays?.includes(20))
  check('defender',          progress.completedDays?.filter(d => d >= 20 && d <= 29).length >= 10)
  check('project_complete',  progress.completedDays?.includes(30))
  check('xp_500',            progress.xp >= 500)
  check('xp_1500',           progress.xp >= 1500)
  check('xp_3500',           progress.xp >= 3500)
  check('xp_7000',           progress.xp >= 7000)
  check('xp_12000',          progress.xp >= 12000)

  return toUnlock
}
