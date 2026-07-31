import React, { useState } from 'react'
import { VIEWS } from '../App.jsx'
import { XP_REWARDS } from '../hooks/useProgress.js'
import { categoryIcon, categoryLabel } from '../utils/formatters.js'

export default function MissionPanel({ dayData, progress, showXP, navigate }) {
  const [expandedDay, setExpandedDay] = useState(dayData?.day || 1)

  // Construir lista de días con misiones, solo desbloqueados
  const daysWithMissions = []
  // (courseData no está disponible aquí — usamos dayData + historial de días completados)
  // Por ahora mostramos el día activo y los completados cercanos

  const currentDay  = dayData?.day || 1
  const missions    = dayData?.missions || []
  const doneMissions = progress.getMissionsDone?.(currentDay) || []

  const totalXP     = missions.reduce((a, m) => a + (m.xp || 0), 0)
  const earnedXP    = missions
    .filter(m => doneMissions.includes(m.id))
    .reduce((a, m) => a + (m.xp || 0), 0)

  function handleRunInTerminal(hint) {
    navigate(VIEWS.TERMINAL, currentDay)
  }

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>

      {/* Header */}
      <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800 }}>
          🎯 Misiones del Día {currentDay}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
          {dayData?.title} — Completa las misiones en la terminal para ganar XP
        </p>
      </div>

      {/* Resumen de XP */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-green)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        marginBottom: 'var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-6)',
        flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 900, color: 'var(--yellow)', lineHeight: 1 }}>
            {earnedXP}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
            XP ganado
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>{doneMissions.length}/{missions.length} misiones completadas</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--yellow)' }}>{earnedXP}/{totalXP} XP</span>
          </div>
          <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${missions.length ? (doneMissions.length / missions.length) * 100 : 0}%`,
              background: 'linear-gradient(90deg, var(--green-dim), var(--green))',
              borderRadius: 'var(--radius-pill)',
              transition: 'width 0.6s ease',
              boxShadow: '0 0 8px var(--green-glow)',
            }} />
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate(VIEWS.TERMINAL, currentDay)}
          style={{ flexShrink: 0 }}
        >
          <TermIcon /> Abrir Terminal
        </button>
      </div>

      {/* Lista de misiones */}
      {missions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🎯</div>
          <div className="empty-state__text">Este día no tiene misiones de terminal.</div>
          <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }} onClick={() => navigate(VIEWS.LESSON, currentDay)}>
            Ver lección del día
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {missions.map((mission, i) => {
            const done = doneMissions.includes(mission.id)
            return (
              <div
                key={mission.id}
                className={`card ${done ? '' : 'card--glow'}`}
                style={{
                  border: done ? '1px solid var(--border-green)' : '1px solid var(--border)',
                  background: done ? 'rgba(0,255,136,0.03)' : 'var(--bg-card)',
                  opacity: done ? 0.85 : 1,
                }}
              >
                {/* Header de misión */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: done ? 0 : 'var(--space-4)' }}>
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    borderRadius: 'var(--radius-md)',
                    background: done ? 'var(--green-dark)' : 'var(--bg-elevated)',
                    border: `2px solid ${done ? 'var(--green)' : 'var(--border-bright)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}>
                    {done ? '✅' : `M${i + 1}`}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: done ? 'var(--green)' : 'var(--text-primary)',
                        textDecoration: done ? 'line-through' : 'none',
                        opacity: done ? 0.7 : 1,
                      }}>
                        {mission.title}
                      </h3>
                      <span className={`badge ${done ? 'badge-green' : 'badge-yellow'}`}>
                        +{mission.xp} XP
                      </span>
                      {done && <span className="badge badge-green">✓ Completada</span>}
                    </div>
                    {mission.description && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 'var(--space-1)', lineHeight: 1.6 }}>
                        {mission.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contenido expandido si no está completada */}
                {!done && (
                  <>
                    {/* Pista / hint */}
                    {mission.hint && (
                      <div style={{
                        background: 'rgba(255,215,0,0.05)',
                        border: '1px solid rgba(255,215,0,0.2)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-3) var(--space-4)',
                        marginBottom: 'var(--space-3)',
                      }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--yellow)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                          💡 Pista
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {mission.hint}
                        </div>
                      </div>
                    )}

                    {/* Comando de ejemplo si lo tiene */}
                    {mission.exampleCmd && (
                      <div style={{
                        background: '#050709',
                        border: '1px solid var(--border-green)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-3) var(--space-4)',
                        marginBottom: 'var(--space-3)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: 'var(--green)',
                      }}>
                        $ {mission.exampleCmd}
                      </div>
                    )}

                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem' }}
                      onClick={() => handleRunInTerminal(mission.hint)}
                    >
                      <TermIcon /> Ir a la terminal para completar
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Botón de navegación al quiz */}
      {doneMissions.length > 0 && (
        <div style={{
          marginTop: 'var(--space-8)',
          padding: 'var(--space-5)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              ¿Listo para el quiz?
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Pon a prueba lo que aprendiste hoy
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(VIEWS.QUIZ, currentDay)}>
            Ir al Quiz →
          </button>
        </div>
      )}
    </div>
  )
}

function TermIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: 4 }}>
      <polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  )
}
