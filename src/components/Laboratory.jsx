import React, { useState } from 'react'
import { VIEWS } from '../App.jsx'
import { XP_REWARDS } from '../hooks/useProgress.js'
import { getTerminalActivitySequence, getTerminalActivitySince } from '../utils/storage.js'

export default function Laboratory({ dayData, progress, showXP, navigate }) {
  const lab = dayData?.lab
  const [activeStep, setActiveStep] = useState(0)
  const [shownHints, setShownHints] = useState({})
  const [copied, setCopied] = useState(null)
  const [verificationMessage, setVerificationMessage] = useState('')

  if (!lab) {
    return (
      <div className="lab-view anim-fade-in-up">
        <div className="empty-state">
          <div className="empty-state__icon">🧪</div>
          <div className="empty-state__text">Laboratorio del Día {dayData?.day} próximamente.</div>
        </div>
      </div>
    )
  }

  const steps = lab.steps || []
  const completedSteps = progress.labStepsCompleted?.[dayData.day] || []
  const allDone = completedSteps.length === steps.length && steps.length > 0
  const attemptKey = `la30_lab_attempt_${dayData.day}_${activeStep}`

  function completeStep(idx) {
    if (completedSteps.includes(idx)) return
    const next = [...completedSteps, idx]
    progress.completeLabStep(dayData.day, idx)
    progress.awardXP(20, `lab-step:${dayData.day}:${idx}`)
    if (next.length === steps.length) {
      progress.completeLab(dayData.day)
      progress.awardXP(XP_REWARDS.LAB_COMPLETE, `lab:${dayData.day}`)
      if (showXP && !progress.xpClaims?.includes(`lab:${dayData.day}`)) {
        showXP(XP_REWARDS.LAB_COMPLETE, `Laboratorio Día ${dayData.day} completado`)
      }
    }
    if (idx < steps.length - 1) setActiveStep(idx + 1)
  }

  function beginPractice() {
    sessionStorage.setItem(attemptKey, String(getTerminalActivitySequence()))
    setVerificationMessage('')
    navigate(VIEWS.TERMINAL, dayData.day)
  }

  function verifyStep() {
    const startRaw = sessionStorage.getItem(attemptKey)
    if (startRaw === null) {
      setVerificationMessage('Primero abre la terminal desde este paso y ejecuta los comandos indicados.')
      return
    }

    const history = getTerminalActivitySince(Number(startRaw))
    const required = (steps[activeStep].commands || []).map(item => normalizeCommand(item.cmd))
    const executed = history.map(normalizeCommand)
    const missing = required.filter(command => !executed.includes(command))

    if (missing.length) {
      setVerificationMessage(`Aún falta ejecutar: ${missing.join(' · ')}`)
      return
    }

    sessionStorage.removeItem(attemptKey)
    setVerificationMessage('✓ Actividad verificada correctamente.')
    completeStep(activeStep)
  }

  function copyCmd(cmd, key) {
    navigator.clipboard?.writeText(cmd).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  function toggleHint(stepIdx, level) {
    const key = `${stepIdx}-${level}`
    setShownHints(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="lab-view anim-fade-in-up">
      {/* Header */}
      <div className="lab-header">
        <div className="lab-header__badge">🧪 Laboratorio Guiado — Día {dayData.day}</div>
        <h1 className="lab-header__title">{lab.title}</h1>
        <p className="lab-header__context">{lab.context}</p>
        <div className="lab-header__meta">
          <div className="lab-meta-item"><ClockIcon /> {lab.duration || '20 min'}</div>
          <div className="lab-meta-item"><StarIcon /> +{lab.xp || 150} XP</div>
          <div className="lab-meta-item"><ListIcon /> {steps.length} pasos</div>
          {allDone && <span className="badge badge-green">✓ Completado</span>}
        </div>
      </div>

      {/* Layout */}
      <div className="lab-layout">
        {/* Panel de pasos */}
        <div className="lab-steps">
          <div className="lab-steps__title">
            Pasos
            <span className="lab-steps__count">{completedSteps.length}/{steps.length}</span>
          </div>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`lab-step-item ${activeStep === i ? 'active' : ''} ${completedSteps.includes(i) ? 'completed' : ''}`}
              onClick={() => {
                setActiveStep(i)
                setVerificationMessage('')
              }}
            >
              <div className="step-num">{completedSteps.includes(i) ? '✓' : i + 1}</div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-time">{step.duration || '3 min'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contenido del paso activo */}
        <div className="lab-content">
          {steps[activeStep] && (
            <div className="lab-step-content">
              <div className="lab-step-content__header">
                <div className="lab-step-content__num">{activeStep + 1}</div>
                <div className="lab-step-content__title">{steps[activeStep].title}</div>
              </div>
              <div className="lab-step-content__body">{steps[activeStep].body}</div>

              {/* Comandos del paso */}
              {(steps[activeStep].commands || []).map((cmd, ci) => (
                <div key={ci} className="lab-command">
                  <div className="lab-command__label">Ejecutar en terminal:</div>
                  <div className="lab-command__code">$ {cmd.cmd}</div>
                  {cmd.explanation && (
                    <div style={{ marginTop: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {cmd.explanation}
                    </div>
                  )}
                  <button
                    className="lab-command__copy"
                    onClick={() => copyCmd(cmd.cmd, `${activeStep}-${ci}`)}
                  >
                    {copied === `${activeStep}-${ci}` ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              ))}

              {/* Resultado esperado */}
              {steps[activeStep].expected && (
                <div className="lab-expected">
                  <div className="lab-expected__label">Resultado esperado:</div>
                  <div className="lab-expected__output">{steps[activeStep].expected}</div>
                </div>
              )}

              {/* Explicación técnica */}
              {steps[activeStep].technical && (
                <div style={{
                  background: 'var(--blue-dark)', border: '1px solid var(--border-blue)',
                  borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginTop: 'var(--space-4)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>
                    ¿Qué ocurre internamente?
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {steps[activeStep].technical}
                  </div>
                </div>
              )}

              {/* Pistas */}
              {steps[activeStep].hints?.length > 0 && (
                <div className="lab-hints" style={{ marginTop: 'var(--space-4)' }}>
                  <div className="lab-hints__header">💡 Pistas disponibles</div>
                  {steps[activeStep].hints.map((hint, hi) => {
                    const key = `${activeStep}-${hi}`
                    const colors = ['green', 'yellow', 'red']
                    const labels = ['Pista leve', 'Pista media', 'Solución']
                    return (
                      <div key={hi} className={`hint-level hint-${hi + 1}`}>
                        <button className="hint-level__trigger" onClick={() => toggleHint(activeStep, hi)}>
                          <span className="hint-level__label">
                            <span className="hint-level__badge">{labels[hi] || `Pista ${hi + 1}`}</span>
                          </span>
                          <span>{shownHints[key] ? '▲' : '▼'}</span>
                        </button>
                        {shownHints[key] && (
                          <div className="hint-level__content">{hint}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Acciones */}
              <div className="lab-step-actions">
                {!completedSteps.includes(activeStep) ? (
                  <button className="btn btn-primary" onClick={verifyStep}>
                    Verificar actividad
                  </button>
                ) : (
                  <span className="badge badge-green" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    ✓ Paso completado
                  </span>
                )}
                <button className="btn btn-secondary" onClick={beginPractice}>
                  Practicar en Terminal
                </button>
                {activeStep < steps.length - 1 && (
                  <button className="btn btn-ghost" onClick={() => setActiveStep(activeStep + 1)}>
                    Siguiente paso →
                  </button>
                )}
              </div>
              {verificationMessage && (
                <div
                  className={verificationMessage.startsWith('✓') ? 'lab-expected' : 'lab-errors'}
                  style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)' }}
                >
                  {verificationMessage}
                </div>
              )}
            </div>
          )}

          {/* Errores comunes del lab */}
          {lab.commonErrors?.length > 0 && (
            <div className="lab-errors">
              <div className="lab-errors__title">⚠️ Errores comunes</div>
              {lab.commonErrors.map((e, i) => (
                <div key={i} className="error-item">
                  <div className="error-item__code">{e.error}</div>
                  <div className="error-item__desc">{e.solution}</div>
                </div>
              ))}
            </div>
          )}

          {/* Completado */}
          {allDone && (
            <div style={{
              background: 'var(--green-dark)', border: '1px solid var(--border-green)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--green)', marginBottom: 'var(--space-2)' }}>
                ¡Laboratorio completado!
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                Has ganado +{lab.xp || 150} XP
              </p>
              <button className="btn btn-primary" onClick={() => navigate(VIEWS.QUIZ, dayData.day)}>
                Ir al Quiz →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function normalizeCommand(command = '') {
  return command.trim().replace(/\s+/g, ' ')
}

function ClockIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function StarIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function ListIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }
