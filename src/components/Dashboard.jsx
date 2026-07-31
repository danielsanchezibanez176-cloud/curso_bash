import React, { useMemo } from 'react'
import { VIEWS } from '../App.jsx'
import ProgressBar from './ProgressBar.jsx'
import {
  formatStudyTime, formatXP, categoryIcon, categoryLabel,
  categoryColor, weekLabel, weekOf, plural,
} from '../utils/formatters.js'
import { achievementsDB } from '../data/achievementsDB.js'

export default function Dashboard({ progress, courseData, navigate, showXP }) {
  const completedCount = progress.completedDays?.length || 0
  const totalDays      = 30
  const pct            = Math.round((completedCount / totalDays) * 100)
  const xpInfo         = progress.xpInfo || {}

  // Próxima lección recomendada
  const nextDay = useMemo(
    () => courseData.find(d => !progress.completedDays?.includes(d.day)) || courseData[0],
    [courseData, progress.completedDays]
  )

  // Logros recientes (últimos 3 desbloqueados)
  const recentAchievements = useMemo(() => {
    const unlocked = progress.achievements || []
    return achievementsDB.filter(a => unlocked.includes(a.id)).slice(-3).reverse()
  }, [progress.achievements])

  // Stats de categorías
  const categoryStats = useMemo(() => {
    const cats = { linux: 0, bash: 0, cyber: 0 }
    ;(progress.completedDays || []).forEach(d => {
      const day = courseData.find(c => c.day === d)
      if (day?.category) cats[day.category]++
    })
    return cats
  }, [progress.completedDays, courseData])

  return (
    <div className="dashboard anim-fade-in-up">

      {/* ── HERO ── */}
      <div className="dashboard-hero">
        <div className="dashboard-hero__content">
          <div className="dashboard-hero__greeting">
            whoami — {getGreeting()}, estudiante
          </div>
          <h1 className="dashboard-hero__title">
            Tu camino hacia <span>Linux</span> y la Ciberseguridad
          </h1>
          <p className="dashboard-hero__sub">
            {completedCount === 0
              ? 'Empieza hoy. Tux te acompaña durante 30 días de práctica real.'
              : `Llevas ${completedCount} ${plural(completedCount,'día','días')} completados. ¡Tux y tú hacen buen equipo!`
            }
          </p>
          <div className="dashboard-cta">
            <button className="btn-cta" onClick={() => navigate(VIEWS.LESSON, nextDay.day)}>
              <PlayIcon />
              {completedCount === 0 ? 'Comenzar Día 1' : `Continuar Día ${nextDay.day}`}
            </button>
            <button className="btn-cta-secondary" onClick={() => navigate(VIEWS.TERMINAL)}>
              <TerminalIcon /> Abrir Terminal
            </button>
          </div>
        </div>
        <div className="dashboard-tux" aria-label="Tux, mascota de Linux">
          <img src="/tux-linux-transparent.png" alt="Tux, el pingüino de Linux" />
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="stats-grid anim-fade-in-up anim-delay-1">

        <div className="stat-card stat-card--green">
          <div className="stat-card__icon">📅</div>
          <div className="stat-card__body">
            <div className="stat-card__value">{completedCount}<span style={{fontSize:'1rem',opacity:.5}}>/30</span></div>
            <div className="stat-card__label">Días completados</div>
            <div className="stat-card__sub">{pct}% del curso</div>
          </div>
        </div>

        <div className="stat-card stat-card--yellow">
          <div className="stat-card__icon">⚡</div>
          <div className="stat-card__body">
            <div className="stat-card__value">{formatXP(progress.xp || 0)}</div>
            <div className="stat-card__label">XP acumulado</div>
            <div className="stat-card__sub">Nivel {progress.level} — {progress.levelTitle}</div>
          </div>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon">🔥</div>
          <div className="stat-card__body">
            <div className="stat-card__value">{progress.streak || 0}</div>
            <div className="stat-card__label">Racha actual</div>
            <div className="stat-card__sub">Récord: {progress.longestStreak || 0} días</div>
          </div>
        </div>

        <div className="stat-card stat-card--purple">
          <div className="stat-card__icon">⏱️</div>
          <div className="stat-card__body">
            <div className="stat-card__value">{formatStudyTime(progress.studyTimeMinutes || 0)}</div>
            <div className="stat-card__label">Tiempo de estudio</div>
            <div className="stat-card__sub">{progress.commandsExecuted || 0} comandos ejecutados</div>
          </div>
        </div>

      </div>

      {/* ── NIVEL XP ── */}
      <div className="level-card anim-fade-in-up anim-delay-2">
        <div className="level-card__header">
          <div className="level-info">
            <div className="level-badge-big">N{progress.level || 1}</div>
            <div>
              <div className="level-name">{progress.levelTitle || 'Novato Linux'}</div>
              <div className="level-sub">
                {xpInfo.nextLevel
                  ? `Faltan ${(xpInfo.needed||0).toLocaleString()} XP para ${xpInfo.nextLevel.title}`
                  : '¡Nivel máximo alcanzado!'
                }
              </div>
            </div>
          </div>
          <div className="xp-to-next">
            <div style={{fontSize:'1.5rem',fontWeight:800,color:'var(--blue)'}}>
              {formatXP(progress.xp||0)}
            </div>
            <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>XP total</div>
          </div>
        </div>
        <div className="xp-bar-wrap">
          <div
            className="xp-bar-fill"
            style={{ width: `${xpInfo.pct || 0}%` }}
          />
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'var(--space-2)',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--text-muted)'}}>
          <span>{(xpInfo.current||0).toLocaleString()} / {(xpInfo.range||0).toLocaleString()} XP</span>
          <span>{xpInfo.pct||0}%</span>
        </div>
      </div>

      {/* ── SIGUIENTE LECCIÓN ── */}
      <div className="next-lesson anim-fade-in-up anim-delay-2" onClick={() => navigate(VIEWS.LESSON, nextDay.day)} style={{cursor:'pointer'}}>
        <div className="next-lesson__badge">{nextDay.day}</div>
        <div className="next-lesson__content">
          <div className="next-lesson__label">
            {completedCount === 0 ? '▶ COMENZAR AQUÍ' : '▶ CONTINUAR'}
          </div>
          <div className="next-lesson__title">{nextDay.title}</div>
          <div className="next-lesson__meta">
            <div className="next-lesson__meta-item">
              {categoryIcon(nextDay.category)} {categoryLabel(nextDay.category)}
            </div>
            <div className="next-lesson__meta-item">
              ⚡ +{nextDay.xp} XP disponibles
            </div>
            <div className="next-lesson__meta-item">
              📖 Teoría · Lab · Quiz · Misiones
            </div>
          </div>
        </div>
        <div className="next-lesson__actions">
          <button className="btn btn-primary" onClick={e => { e.stopPropagation(); navigate(VIEWS.LESSON, nextDay.day) }}>
            Ir a la lección →
          </button>
          <button className="btn btn-secondary" onClick={e => { e.stopPropagation(); navigate(VIEWS.LABORATORY, nextDay.day) }}>
            Ir al laboratorio
          </button>
        </div>
      </div>

      {/* ── PROGRESO GENERAL ── */}
      <div className="progress-section anim-fade-in-up anim-delay-3">
        <div className="progress-overview">
          <div className="progress-overview__header">
            <div className="progress-overview__title">Mapa de progreso — 30 días</div>
            <div className="progress-overview__pct">{pct}%</div>
          </div>

          <ProgressBar
            value={completedCount}
            max={totalDays}
            variant="green"
            height={8}
            labelLeft={`${completedCount} completados`}
            labelRight={`${totalDays - completedCount} restantes`}
            showLabel
          />

          <div className="days-map" style={{marginTop:'var(--space-5)'}}>
            {courseData.map(day => {
              const done      = progress.completedDays?.includes(day.day)
              const isCurrent = day.day === (progress.currentDay || 1)
              const locked    = !done && !isCurrent && day.day > (progress.currentDay || 1)
              return (
                <div
                  key={day.day}
                  className={`day-dot
                    ${done      ? 'day-dot--completed' : ''}
                    ${isCurrent ? 'day-dot--active'    : ''}
                    ${locked    ? 'day-dot--locked'    : ''}
                    ${!done && !isCurrent && !locked ? 'day-dot--available' : ''}
                    ${day.category === 'cyber' ? 'day-dot--cyber' : ''}
                  `.replace(/\s+/,' ').trim()}
                  onClick={() => !locked && navigate(VIEWS.LESSON, day.day)}
                  data-tooltip={`Día ${day.day}: ${day.title}`}
                  title={`Día ${day.day}: ${day.title}`}
                >
                  {done ? '✓' : day.day}
                </div>
              )
            })}
          </div>

          {/* Leyenda */}
          <div style={{display:'flex',gap:'var(--space-4)',marginTop:'var(--space-4)',flexWrap:'wrap'}}>
            {[
              { cls: 'day-dot--completed', label: 'Completado' },
              { cls: 'day-dot--active',    label: 'Actual' },
              { cls: 'day-dot--available', label: 'Disponible' },
              { cls: 'day-dot--locked',    label: 'Bloqueado' },
            ].map(({ cls, label }) => (
              <div key={cls} style={{display:'flex',alignItems:'center',gap:'var(--space-2)',fontSize:'0.75rem',color:'var(--text-muted)'}}>
                <div className={`day-dot ${cls}`} style={{width:16,height:16,fontSize:'0.5rem',position:'static',cursor:'default'}} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PANEL INFERIOR: LOGROS + ESTADÍSTICAS ── */}
      <div className="activity-section anim-fade-in-up anim-delay-4">

        {/* Logros recientes */}
        <div className="activity-card">
          <div className="activity-card__title">
            <TrophyIcon /> Logros recientes
          </div>
          {recentAchievements.length > 0 ? (
            <div className="achievement-list">
              {recentAchievements.map(a => (
                <div key={a.id} className="achievement-item">
                  <div className="achievement-item__icon">{a.icon}</div>
                  <div>
                    <div className="achievement-item__name">{a.name}</div>
                    <div className="achievement-item__desc">{a.description}</div>
                  </div>
                  <div style={{marginLeft:'auto',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--yellow)'}}>+{a.xp} XP</div>
                </div>
              ))}
              <button className="btn btn-ghost text-sm" style={{marginTop:'var(--space-2)'}} onClick={() => navigate(VIEWS.ACHIEVEMENTS)}>
                Ver todos los logros →
              </button>
            </div>
          ) : (
            <div className="empty-state" style={{padding:'var(--space-8)'}}>
              <div className="empty-state__icon">🏆</div>
              <div className="empty-state__text">Completa lecciones para desbloquear logros</div>
            </div>
          )}
        </div>

        {/* Estadísticas por categoría */}
        <div className="activity-card">
          <div className="activity-card__title">
            <ChartIcon /> Progreso por área
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
            {[
              { key: 'linux', label: 'Linux',            total: 10, icon: '🐧' },
              { key: 'bash',  label: 'Bash & Scripting', total: 10, icon: '⚡' },
              { key: 'cyber', label: 'Ciberseguridad',   total: 10, icon: '🛡️' },
            ].map(({ key, label, total, icon }) => (
              <div key={key}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'var(--space-2)',fontSize:'0.85rem'}}>
                  <span>{icon} {label}</span>
                  <span style={{fontFamily:'var(--font-mono)',color:'var(--text-muted)',fontSize:'0.75rem'}}>
                    {categoryStats[key]}/{total} días
                  </span>
                </div>
                <ProgressBar
                  value={categoryStats[key]}
                  max={total}
                  variant={key === 'linux' ? 'blue' : key === 'bash' ? 'green' : 'purple'}
                  height={8}
                />
              </div>
            ))}
          </div>

          <div style={{marginTop:'var(--space-6)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-3)'}}>
            <MiniStat label="Quiz promedio" value={avgQuizScore(progress.quizScores)} unit="%" color="var(--blue)" />
            <MiniStat label="Labs completos" value={progress.labsCompleted?.length||0} unit={`/${totalDays}`} color="var(--green)" />
            <MiniStat label="Misiones" value={countMissions(progress.missionsCompleted)} unit="hechas" color="var(--purple)" />
            <MiniStat label="Logros" value={progress.achievements?.length||0} unit="desbloqueados" color="var(--yellow)" />
          </div>
        </div>

      </div>

      {/* ── RACHA ── */}
      {(progress.streak || 0) > 0 && (
        <div className="activity-card anim-fade-in-up anim-delay-5" style={{marginBottom:'var(--space-8)'}}>
          <div className="streak-display">
            <div className="streak-flames">{'🔥'.repeat(Math.min(progress.streak, 7))}</div>
            <div className="streak-number">{progress.streak}</div>
            <div className="streak-label">días de racha consecutiva</div>
            {progress.longestStreak > progress.streak && (
              <div style={{marginTop:'var(--space-2)',fontSize:'0.8rem',color:'var(--text-muted)'}}>
                Récord personal: {progress.longestStreak} días
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

// ── Sub-componentes ────────────────────────────────────────────

function MiniStat({ label, value, unit, color }) {
  return (
    <div style={{background:'var(--bg-elevated)',borderRadius:'var(--radius-md)',padding:'var(--space-3)',textAlign:'center'}}>
      <div style={{fontFamily:'var(--font-mono)',fontSize:'1.3rem',fontWeight:800,color,lineHeight:1}}>{value}</div>
      <div style={{fontSize:'0.65rem',color:'var(--text-muted)',marginTop:'var(--space-1)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{unit}</div>
      <div style={{fontSize:'0.72rem',color:'var(--text-secondary)',marginTop:2}}>{label}</div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function avgQuizScore(quizScores = {}) {
  const entries = Object.values(quizScores)
  if (!entries.length) return 0
  const total = entries.reduce((a, b) => a + b, 0)
  return Math.round((total / (entries.length * 5)) * 100)
}

function countMissions(missionsCompleted = {}) {
  return Object.values(missionsCompleted).reduce((acc, arr) => acc + arr.length, 0)
}

// ── Íconos ────────────────────────────────────────────────────
function PlayIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function TerminalIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> }
function TrophyIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> }
function ChartIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
