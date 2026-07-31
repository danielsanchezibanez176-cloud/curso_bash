import React from 'react'

/**
 * ProgressBar — barra de progreso reutilizable
 * Props:
 *   value      número actual
 *   max        valor máximo
 *   variant    'green' | 'blue' | 'purple' | 'yellow'
 *   height     px
 *   showLabel  boolean
 *   label      string
 *   animated   boolean (shimmer en carga)
 */
export default function ProgressBar({
  value      = 0,
  max        = 100,
  variant    = 'green',
  height     = 6,
  showLabel  = false,
  labelLeft  = '',
  labelRight = '',
  animated   = false,
  className  = '',
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div className={`pb-root ${className}`}>
      {(labelLeft || labelRight || showLabel) && (
        <div className="pb-labels">
          <span className="pb-label-left">{labelLeft}</span>
          <span className="pb-label-right">
            {labelRight || `${Math.round(pct)}%`}
          </span>
        </div>
      )}
      <div
        className="pb-track"
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`pb-fill pb-fill--${variant} ${animated ? 'pb-fill--animated' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
