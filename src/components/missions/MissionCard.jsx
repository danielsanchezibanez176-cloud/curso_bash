import React from 'react'

/**
 * MissionCard — tarjeta de misión individual en el panel lateral
 * de la terminal. Muestra estado completado/pendiente.
 */
export default function MissionCard({ mission, isDone, onClick }) {
  return (
    <div
      className={`mission-task ${isDone ? 'mission-task--done' : ''}`}
      onClick={!isDone ? onClick : undefined}
      style={{ cursor: isDone ? 'default' : 'pointer' }}
      title={mission.description}
    >
      <div className="mission-task__check">
        {isDone ? '✓' : ''}
      </div>
      <div style={{ flex: 1 }}>
        <div className="mission-task__text">{mission.title}</div>
        {mission.hint && !isDone && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            marginTop: '2px',
          }}>
            💡 {mission.hint}
          </div>
        )}
      </div>
      <div className="mission-task__xp">+{mission.xp}</div>
    </div>
  )
}
