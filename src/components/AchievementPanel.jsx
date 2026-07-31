import React, { useState, useMemo } from 'react'
import { VIEWS } from '../App.jsx'
import { achievementsDB } from '../data/achievementsDB.js'
import { LEVELS } from '../hooks/useProgress.js'
import { formatXP } from '../utils/formatters.js'
import ProgressBar from './ProgressBar.jsx'

const CATEGORIES = [
  { key: 'all',      label: 'Todos',        icon: '🏆' },
  { key: 'progress', label: 'Progreso',     icon: '📅' },
  { key: 'terminal', label: 'Terminal',     icon: '⌨️' },
  { key: 'bash',     label: 'Bash',         icon: '⚡' },
  { key: 'quiz',     label: 'Quizzes',      icon: '📝' },
  { key: 'lab',      label: 'Laboratorios', icon: '🧪' },
  { key: 'cyber',    label: 'Cyber',        icon: '🛡️' },
  { key: 'streak',   label: 'Racha',        icon: '🔥' },
  { key: 'xp',       label: 'XP',           icon: '⭐' },
]

export default function AchievementPanel({ progress, navigate }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const unlockedSet = useMemo(() => new Set(progress.achievements || []), [progress.achievements])

  const filtered = useMemo(() => {
    const base = activeCategory === 'all'
      ? achievementsDB
      : achievementsDB.filter(a => a.category === activeCategory)
    // Desbloqueados primero
    return [...base].sort((a, b) => {
      const aU = unlockedSet.has(a.id) ? 0 : 1
      const bU = unlockedSet.has(b.id) ? 0 : 1
      return aU - bU
    })
  }, [activeCategory, unlockedSet])

  const unlockedCount = unlockedSet.size
  const totalCount    = achievementsDB.length
  const xpInfo        = progress.xpInfo || {}

  // Índice del nivel actual para roadmap
  const currentLevelIdx = LEVELS.findIndex(l => l.level === progress.level)

  return (
    <div className="achievements-view anim-fade-in-up">

      {/* Header */}
      <div className="achievements-header">
        <h1 className="achievements-header__title">Logros e Insignias</h1>
        <p className="achievements-header__sub">
          {unlockedCount} de {totalCount} logros desbloqueados
        </p>
      </div>

      {/* Banner de nivel actual */}
      <div className="current-level-banner">
        <div className="level-emblem">
          <div className="level-emblem__num">{progress.level || 1}</div>
          <div className="level-emblem__label">NIVEL</div>
        </div>
        <div className="level-info">
          <div className="level-info__title">{progress.levelTitle || 'Novato Linux'}</div>
          <div className="level-info__sub">
            {xpInfo.nextLevel
              ? `Faltan ${(xpInfo.needed||0).toLocaleString()} XP para alcanzar ${xpInfo.nextLevel.title}`
              : '¡Has alcanzado el nivel máximo!'
            }
          </div>
          <div className="level-xp-bar">
            <div className="level-xp-label">
              <span>{(xpInfo.current||0).toLocaleString()} XP</span>
              <span>{(xpInfo.range||0).toLocaleString()} XP</span>
            </div>
            <div className="level-xp-track">
              <div className="level-xp-fill" style={{ width: `${xpInfo.pct||0}%` }} />
            </div>
          </div>
          <div className="level-next">
            XP total: <span>{formatXP(progress.xp||0)}</span>
          </div>
        </div>
        <div style={{textAlign:'center',flexShrink:0}}>
          <div style={{fontSize:'4rem',lineHeight:1}}>{progress.levelIcon || '🐧'}</div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--text-muted)',marginTop:'var(--space-2)'}}>
            {unlockedCount}/{totalCount} logros
          </div>
        </div>
      </div>

      {/* Roadmap de niveles */}
      <div className="levels-roadmap">
        <div className="levels-roadmap__title">Ruta de niveles</div>
        <div className="levels-track">
          {LEVELS.map((lvl, i) => {
            const reached = progress.level > lvl.level
            const current = progress.level === lvl.level
            return (
              <React.Fragment key={lvl.level}>
                <div className={`level-node ${reached?'reached':''} ${current?'current':''}`}>
                  <div className="level-node__circle">
                    {reached ? '✓' : lvl.level}
                  </div>
                  <div className="level-node__name">{lvl.title}</div>
                  <div className="level-node__xp">{lvl.minXP.toLocaleString()} XP</div>
                </div>
                {i < LEVELS.length - 1 && (
                  <div className={`level-connector ${reached ? 'filled' : ''}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="achievements-section">
        <div className="achievements-section__header">
          <div className="achievements-section__title">
            🏆 Colección de Logros
          </div>
          <div className="achievements-section__count">
            {unlockedCount} / {totalCount}
          </div>
        </div>

        {/* Tabs de categoría */}
        <div style={{display:'flex',gap:'var(--space-1)',flexWrap:'wrap',marginBottom:'var(--space-5)'}}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`btn ${activeCategory === cat.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{padding:'6px 14px',fontSize:'0.78rem',borderRadius:'var(--radius-pill)'}}
            >
              {cat.icon} {cat.label}
              <span style={{
                marginLeft:'4px',
                fontFamily:'var(--font-mono)',
                fontSize:'0.65rem',
                opacity:0.7,
              }}>
                {achievementsDB
                  .filter(a => cat.key === 'all' || a.category === cat.key)
                  .filter(a => unlockedSet.has(a.id)).length}
                /{achievementsDB.filter(a => cat.key === 'all' || a.category === cat.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid de logros */}
        <div className="achievements-grid">
          {filtered.map((achievement, i) => {
            const unlocked = unlockedSet.has(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`achievement-card
                  achievement-card--${achievement.rarity}
                  ${unlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}
                  anim-fade-in-up anim-delay-${Math.min(i % 8 + 1, 8)}
                `.replace(/\s+/,' ').trim()}
                title={unlocked ? achievement.description : `🔒 ${achievement.description}`}
              >
                <div className="achievement-card__icon">
                  {unlocked ? achievement.icon : '❓'}
                  {achievement.rarity !== 'common' && (
                    <div className={`achievement-card__rarity rarity--${achievement.rarity}`}>
                      {achievement.rarity === 'legendary' ? '★' : '◆'}
                    </div>
                  )}
                </div>

                <div className="achievement-card__name">
                  {unlocked ? achievement.name : '???'}
                </div>

                <div className="achievement-card__desc">
                  {unlocked ? achievement.description : 'Logro bloqueado'}
                </div>

                {achievement.xp > 0 && (
                  <div className="achievement-card__xp">+{achievement.xp} XP</div>
                )}

                {!unlocked && (
                  <div className="achievement-card__lock">🔒</div>
                )}

                {/* Rareza badge */}
                <div style={{marginTop:'auto'}}>
                  <span className={`badge ${
                    achievement.rarity === 'legendary' ? 'badge-yellow'
                    : achievement.rarity === 'rare'    ? 'badge-purple'
                    : 'badge-gray'
                  }`}>
                    {achievement.rarity === 'legendary' ? '★ Legendario'
                     : achievement.rarity === 'rare'    ? '◆ Raro'
                     : 'Común'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats resumen */}
      <div className="card" style={{marginTop:'var(--space-4)'}}>
        <h3 style={{fontFamily:'var(--font-display)',marginBottom:'var(--space-5)',fontSize:'1rem'}}>
          📊 Estadísticas de logros
        </h3>
        <div className="grid-4" style={{gap:'var(--space-3)'}}>
          {[
            { label: 'Comunes',     count: achievementsDB.filter(a=>a.rarity==='common').filter(a=>unlockedSet.has(a.id)).length,    total: achievementsDB.filter(a=>a.rarity==='common').length,    color: 'var(--text-secondary)' },
            { label: 'Raros',       count: achievementsDB.filter(a=>a.rarity==='rare').filter(a=>unlockedSet.has(a.id)).length,      total: achievementsDB.filter(a=>a.rarity==='rare').length,      color: 'var(--purple)' },
            { label: 'Legendarios', count: achievementsDB.filter(a=>a.rarity==='legendary').filter(a=>unlockedSet.has(a.id)).length, total: achievementsDB.filter(a=>a.rarity==='legendary').length, color: 'var(--yellow)' },
            { label: 'XP de logros',count: achievementsDB.filter(a=>unlockedSet.has(a.id)).reduce((acc,a)=>acc+a.xp,0),             total: null,                                                    color: 'var(--green)', unit: 'XP' },
          ].map(({ label, count, total, color, unit }) => (
            <div key={label} style={{background:'var(--bg-elevated)',borderRadius:'var(--radius-md)',padding:'var(--space-4)',textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'1.4rem',fontWeight:800,color,lineHeight:1}}>
                {count.toLocaleString()}{unit ? ` ${unit}` : ''}
              </div>
              {total && <div style={{fontSize:'0.7rem',color:'var(--text-muted)',marginTop:2}}>de {total}</div>}
              <div style={{fontSize:'0.75rem',color:'var(--text-secondary)',marginTop:'var(--space-1)'}}>{label}</div>
              {total && (
                <ProgressBar
                  value={count} max={total}
                  variant={color.includes('purple') ? 'purple' : color.includes('yellow') ? 'yellow' : 'green'}
                  height={4}
                  className="mt-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
