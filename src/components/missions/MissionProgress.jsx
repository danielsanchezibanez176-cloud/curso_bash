import React from 'react'

/**
 * MissionProgress — barra de progreso de misiones del día
 * usada en la cabecera de la terminal y en MissionPanel
 */
export default function MissionProgress({ missions = [], doneMissions = [] }) {
  const total  = missions.length
  const done   = doneMissions.length
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0

  if (total === 0) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <div style={{
        flex: 1,
        height: 6,
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--green-dim), var(--green))',
          borderRadius: 'var(--radius-pill)',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 6px var(--green-glow)',
        }} />
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: done === total ? 'var(--green)' : 'var(--text-muted)',
        flexShrink: 0,
      }}>
        {done}/{total}
      </span>
    </div>
  )
}
