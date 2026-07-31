/* ============================================================
   formatters.js — Utilidades de formato
   ============================================================ */

// ─── Tiempo ──────────────────────────────────────────────────

/**
 * Formatea minutos totales → "2h 15m" o "45m"
 */
export function formatStudyTime(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return '0m'
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * Formatea segundos → "1:23" o "10:05"
 */
export function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Tiempo relativo desde fecha ISO → "hace 2 días"
 */
export function timeAgo(isoDate) {
  if (!isoDate) return 'nunca'
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours   = Math.floor(diff / 3_600_000)
  const days    = Math.floor(diff / 86_400_000)

  if (minutes < 1)  return 'ahora mismo'
  if (minutes < 60) return `hace ${minutes}m`
  if (hours < 24)   return `hace ${hours}h`
  if (days === 1)   return 'ayer'
  if (days < 7)     return `hace ${days} días`
  return `hace ${Math.floor(days / 7)} semanas`
}

/**
 * Fecha legible corta: "15 Ene 2024"
 */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

// ─── XP y Niveles ────────────────────────────────────────────

/**
 * Formatea número con separadores: 12500 → "12.500"
 */
export function formatXP(xp) {
  if (!xp && xp !== 0) return '0'
  return xp.toLocaleString('es-ES')
}

/**
 * Porcentaje de progreso entre dos valores
 */
export function progressPct(current, total) {
  if (!total) return 0
  return Math.min(100, Math.round((current / total) * 100))
}

/**
 * Clase CSS de color según puntuación del quiz
 */
export function quizScoreClass(score, total) {
  const pct = (score / total) * 100
  if (pct === 100) return 'perfect'
  if (pct >= 60)   return 'good'
  if (pct >= 40)   return 'ok'
  return 'poor'
}

/**
 * Texto descriptivo de puntuación
 */
export function quizScoreLabel(score, total) {
  const pct = (score / total) * 100
  if (pct === 100) return '¡Perfecto!'
  if (pct >= 80)   return '¡Excelente!'
  if (pct >= 60)   return 'Bien hecho'
  if (pct >= 40)   return 'Puedes mejorar'
  return 'Sigue practicando'
}

/**
 * XP ganada por quiz según puntuación
 */
export function quizXPReward(score, total) {
  const pct = (score / total) * 100
  if (pct === 100) return 100
  if (pct >= 60)   return 50
  if (pct >= 40)   return 25
  return 0
}

// ─── Rutas ───────────────────────────────────────────────────

/**
 * Acorta ruta para display: /home/estudiante/docs → ~/docs
 */
export function shortenPath(path) {
  if (!path) return ''
  return path.replace('/home/estudiante', '~')
}

/**
 * Obtiene el nombre del último segmento: /home/foo/bar → bar
 */
export function basename(path) {
  if (!path) return ''
  const parts = path.split('/').filter(Boolean)
  return parts[parts.length - 1] || '/'
}

/**
 * Obtiene el directorio padre: /home/foo/bar → /home/foo
 */
export function dirname(path) {
  if (!path || path === '/') return '/'
  const parts = path.split('/').filter(Boolean)
  parts.pop()
  return '/' + parts.join('/')
}

// ─── Texto ───────────────────────────────────────────────────

/**
 * Capitaliza primera letra
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Trunca con puntos suspensivos
 */
export function truncate(str, maxLen = 40) {
  if (!str || str.length <= maxLen) return str || ''
  return str.slice(0, maxLen - 3) + '...'
}

/**
 * Pluralizar en español: plural(3, 'día', 'días')
 */
export function plural(n, singular, pluralForm) {
  return n === 1 ? singular : pluralForm
}

/**
 * Formatear bytes legibles: 2048 → "2 KB"
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// ─── Categorías del curso ─────────────────────────────────────

/**
 * Color CSS según categoría del día
 */
export function categoryColor(category) {
  const map = {
    linux: 'var(--blue)',
    bash:  'var(--green)',
    cyber: 'var(--purple)',
  }
  return map[category] || 'var(--text-muted)'
}

/**
 * Icono según categoría
 */
export function categoryIcon(category) {
  const map = {
    linux: '🐧',
    bash:  '⚡',
    cyber: '🛡️',
  }
  return map[category] || '📚'
}

/**
 * Label de categoría en español
 */
export function categoryLabel(category) {
  const map = {
    linux: 'Linux',
    bash:  'Bash',
    cyber: 'Ciberseguridad',
  }
  return map[category] || category
}

// ─── Semanas ─────────────────────────────────────────────────

/**
 * Devuelve el número de semana (1-based) para un día (1-30)
 */
export function weekOf(day) {
  return Math.ceil(day / 7)
}

/**
 * Devuelve etiqueta de semana: "Semana 1 — Linux Básico"
 */
export function weekLabel(week) {
  const labels = {
    1: 'Semana 1 — Fundamentos Linux',
    2: 'Semana 2 — Linux Avanzado',
    3: 'Semana 3 — Bash & Automatización',
    4: 'Semana 4 — Ciberseguridad',
    5: 'Semana 5 — Proyecto Final',
  }
  return labels[week] || `Semana ${week}`
}

// ─── Miscelánea ───────────────────────────────────────────────

/**
 * Genera un ID aleatorio simple
 */
export function randomId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Clamp: limita un número entre min y max
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Debounce: retrasa la ejecución de una función
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
