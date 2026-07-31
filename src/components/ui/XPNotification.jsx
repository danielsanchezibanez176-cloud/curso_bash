import React from 'react'

/**
 * XPNotification — aparece en la esquina inferior derecha
 * cuando el estudiante gana XP. Se destruye a sí mismo tras 3s.
 */
export default function XPNotification({ amount, reason }) {
  return (
    <div className="xp-notification" role="status" aria-live="polite">
      <div className="xp-notification__icon">⚡</div>
      <div className="xp-notification__body">
        <div className="xp-notification__amount">+{amount} XP</div>
        <div className="xp-notification__reason">{reason}</div>
      </div>
      <div className="xp-notification__timer" />
    </div>
  )
}
