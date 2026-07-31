import React, { useState, useEffect } from 'react'
import { VIEWS } from '../App.jsx'
import { XP_REWARDS } from '../hooks/useProgress.js'
import { categoryIcon, categoryLabel, categoryColor } from '../utils/formatters.js'

export default function Lesson({ dayData, progress, showXP, navigate, activeTab, setActiveTab }) {
  useEffect(() => {
    if (!dayData) return
    progress.viewLesson(dayData.day)
  }, [dayData?.day])

  if (!dayData || !dayData.theory) {
    return (
      <div className="lesson-view anim-fade-in-up">
        <div className="empty-state">
          <div className="empty-state__icon">📚</div>
          <div className="empty-state__text">Contenido del Día {dayData?.day} disponible próximamente.</div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'teoria',   label: 'Teoría',      icon: '📖', count: null },
    { id: 'comandos', label: 'Comandos',     icon: '⌨️', count: dayData.commands?.length },
    { id: 'lab',      label: 'Laboratorio',  icon: '🧪', count: null },
    { id: 'quiz',     label: 'Quiz',         icon: '📝', count: dayData.quiz?.length },
    { id: 'misiones', label: 'Misiones',     icon: '🎯', count: dayData.missions?.length },
  ]
  const labDone = progress.labsCompleted?.includes(dayData.day)
  const quizScore = progress.quizScores?.[dayData.day]
  const quizRequired = Math.ceil((dayData.quiz?.length || 0) * 0.6)
  const quizPassed = typeof quizScore === 'number' && quizScore >= quizRequired
  const missionsDone = progress.missionsCompleted?.[dayData.day]?.length || 0
  const missionsRequired = dayData.missions?.length || 0
  const missionsPassed = missionsDone >= missionsRequired
  const dayAlreadyComplete = progress.completedDays?.includes(dayData.day)
  const canCompleteDay = labDone && quizPassed && missionsPassed

  return (
    <div className="lesson-view anim-fade-in-up">
      {/* Header */}
      <div className="lesson-header">
        <div className="lesson-header__top">
          <div>
            <div className="lesson-header__day">
              {categoryIcon(dayData.category)} DÍA {dayData.day} — {categoryLabel(dayData.category).toUpperCase()}
            </div>
            <h1 className="lesson-header__title">{dayData.title}</h1>
            <div className="lesson-header__tags">
              {(dayData.tags || []).map(tag => (
                <span key={tag} className="badge badge-blue">{tag}</span>
              ))}
            </div>
          </div>
          <div className="lesson-header__xp">
            <div className="lesson-header__xp-value">+{dayData.xp}</div>
            <div className="lesson-header__xp-label">XP<br/>disponibles</div>
          </div>
        </div>
        <div className="lesson-objectives">
          <div className="lesson-objectives__title">Al finalizar esta sesión podrás:</div>
          <div className="lesson-objectives__list">
            {(dayData.objectives || []).map((obj, i) => (
              <div key={i} className="lesson-objective">{obj}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lesson-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`lesson-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
            {tab.count > 0 && (
              <span className="lesson-tab__badge">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido por tab */}
      {activeTab === 'teoria'   && <TheoryTab   dayData={dayData} />}
      {activeTab === 'comandos' && <CommandsTab dayData={dayData} navigate={navigate} />}
      {activeTab === 'lab'      && <LabShortcut dayData={dayData} navigate={navigate} />}
      {activeTab === 'quiz'     && <QuizShortcut dayData={dayData} navigate={navigate} />}
      {activeTab === 'misiones' && <MissionsShortcut dayData={dayData} navigate={navigate} progress={progress} />}

      {/* Navegación */}
      {!dayAlreadyComplete && (
        <div className="card" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)' }}>
          <div style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Requisitos para completar el día</div>
          <div style={{ color: labDone ? 'var(--green)' : 'var(--text-muted)' }}>
            {labDone ? '✓' : '○'} Laboratorio completo
          </div>
          <div style={{ color: quizPassed ? 'var(--green)' : 'var(--text-muted)' }}>
            {quizPassed ? '✓' : '○'} Quiz aprobado ({quizScore ?? 0}/{dayData.quiz?.length || 0}; mínimo {quizRequired})
          </div>
          <div style={{ color: missionsPassed ? 'var(--green)' : 'var(--text-muted)' }}>
            {missionsPassed ? '✓' : '○'} Misiones completadas ({missionsDone}/{missionsRequired})
          </div>
        </div>
      )}
      <div className="lesson-nav">
        <button
          className="lesson-nav__btn"
          onClick={() => navigate(VIEWS.LESSON, Math.max(1, dayData.day - 1))}
          disabled={dayData.day <= 1}
        >
          ← Día anterior
        </button>
        <button
          className="lesson-nav__btn lesson-nav__btn--next"
          disabled={!canCompleteDay && !dayAlreadyComplete}
          title={!canCompleteDay ? 'Completa el laboratorio, aprueba el quiz y termina todas las misiones.' : ''}
          onClick={() => {
            if (dayAlreadyComplete) {
              navigate(VIEWS.LESSON, Math.min(30, dayData.day + 1))
              return
            }
            if (!canCompleteDay) return
            progress.completeDay(dayData.day)
            progress.awardXP(XP_REWARDS.DAY_COMPLETE, `day:${dayData.day}`)
            if (showXP) showXP(XP_REWARDS.DAY_COMPLETE, `Día ${dayData.day} completado`)
            navigate(VIEWS.LESSON, Math.min(30, dayData.day + 1))
          }}
        >
          {dayAlreadyComplete ? 'Continuar →' : canCompleteDay ? 'Completar día y continuar →' : 'Completa los requisitos para continuar'}
        </button>
      </div>
    </div>
  )
}

/* ── Pestaña de Teoría ─────────────────────────────────────── */
function TheoryTab({ dayData }) {
  const { theory } = dayData
  return (
    <div className="theory-content">
      {theory.intro && (
        <div className="card" style={{ borderLeft: '3px solid var(--green)' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{theory.intro}</p>
        </div>
      )}

      {(theory.sections || []).map((sec, i) => (
        <TheorySection key={i} section={sec} />
      ))}

      {theory.realCase && (
        <div className="real-case">
          <div className="real-case__label">🏢 Caso Real</div>
          <div className="real-case__title">{theory.realCase.title}</div>
          <div className="real-case__text">{theory.realCase.body}</div>
        </div>
      )}

      {theory.diagram && (
        <div className="diagram-block">
          <div className="diagram-block__title">📊 {theory.diagram.title}</div>
          <pre className="diagram-tree"
            dangerouslySetInnerHTML={{ __html: colorDiagram(theory.diagram.content) }}
          />
        </div>
      )}

      {dayData.resources && (
        <div className="resource-links">
          <div className="resource-links__title">🔗 Recursos de apoyo</div>
          <div className="resource-grid">
            {dayData.resources.map(r => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                <span className="resource-link__icon">{r.icon}</span>
                <div>
                  <div className="resource-link__name">{r.name}</div>
                  <div className="resource-link__url">{r.url.replace('https://','')}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TheorySection({ section }) {
  if (section.type === 'dual') {
    return (
      <div className="theory-dual">
        <div className="theory-block theory-block--technical">
          <div className="theory-block__label">Técnico</div>
          <div className="theory-block__text">{section.technical}</div>
        </div>
        <div className="theory-block theory-block--simple">
          <div className="theory-block__label">En simple</div>
          <div className="theory-block__text">{section.simple}</div>
        </div>
      </div>
    )
  }
  if (section.type === 'note') {
    return (
      <div className="security-note">
        <div className="security-note__label">🛡️ {section.label || 'Nota de Seguridad'}</div>
        <div className="security-note__text">{section.body}</div>
      </div>
    )
  }
  return (
    <div className="card">
      {section.title && <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>{section.title}</h3>}
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>{section.body}</p>
    </div>
  )
}

/* ── Pestaña de Comandos ───────────────────────────────────── */
function CommandsTab({ dayData, navigate }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div className="command-library">
      <p className="command-library__intro">
        Haz clic en cada comando para ver su documentación completa.
      </p>
      {(dayData.commands || []).map(cmd => (
        <CommandCard
          key={cmd.name}
          cmd={cmd}
          isExpanded={expanded === cmd.name}
          onToggle={() => setExpanded(expanded === cmd.name ? null : cmd.name)}
          onTryIt={() => navigate(VIEWS.TERMINAL)}
        />
      ))}
    </div>
  )
}

function CommandCard({ cmd, isExpanded, onToggle, onTryIt }) {
  return (
    <div className={`command-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="command-card__header" onClick={onToggle}>
        <span className="command-card__name">{cmd.name}</span>
        <span className="command-card__brief">{cmd.brief}</span>
        <span className="command-card__toggle">
          <ChevronIcon />
        </span>
      </div>
      {isExpanded && (
        <div className="command-card__body">
          <div className="cmd-section">
            <div className="cmd-section__title">Descripción técnica</div>
            <div className="cmd-section__text">{cmd.technical}</div>
          </div>
          <div className="cmd-section">
            <div className="cmd-section__title">En simple</div>
            <div className="cmd-section__text">{cmd.simple}</div>
          </div>
          <div className="cmd-section cmd-section--full">
            <div className="cmd-section__title">Sintaxis y ejemplos</div>
            <div className="syntax-block">
              {(cmd.syntax || []).map((s, i) => (
                <div key={i} className="syntax-line">
                  <span className="syntax-cmd">{s.cmd}</span>
                  {s.flag && <span className="syntax-flag">{s.flag}</span>}
                  {s.arg  && <span className="syntax-arg">{s.arg}</span>}
                  <span className="syntax-desc"># {s.desc}</span>
                </div>
              ))}
            </div>
          </div>
          {cmd.errors?.length > 0 && (
            <div className="cmd-section cmd-section--full">
              <div className="cmd-section__title">Errores frecuentes</div>
              <div className="error-list">
                {cmd.errors.map((e, i) => (
                  <div key={i} className="error-item">
                    <div className="error-item__code">{e.msg}</div>
                    <div className="error-item__desc">{e.fix}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cmd.security && (
            <div className="cmd-section cmd-section--full">
              <div className="security-note">
                <div className="security-note__label">🛡️ Relevancia en Ciberseguridad</div>
                <div className="security-note__text">{cmd.security}</div>
              </div>
            </div>
          )}
          <div className="cmd-section cmd-section--full" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={onTryIt}>
              ⌨️ Practicar en terminal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Atajos a Lab / Quiz / Misiones ────────────────────────── */
function LabShortcut({ dayData, navigate }) {
  const lab = dayData.lab
  if (!lab) return <div className="empty-state"><div className="empty-state__icon">🧪</div><div>Sin laboratorio para este día.</div></div>
  return (
    <div className="card card--glow" style={{ maxWidth: 700 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--blue)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        🧪 Laboratorio Guiado
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>{lab.title}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>{lab.context}</p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        <span className="badge badge-blue">⏱ {lab.duration || '20 min'}</span>
        <span className="badge badge-yellow">+{lab.xp || 150} XP</span>
        <span className="badge badge-gray">{lab.steps?.length || 0} pasos</span>
      </div>
      <button className="btn btn-primary" onClick={() => navigate(VIEWS.LABORATORY, dayData.day)}>
        Iniciar Laboratorio →
      </button>
    </div>
  )
}

function QuizShortcut({ dayData, navigate }) {
  return (
    <div className="card" style={{ maxWidth: 700 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--purple)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        📝 Quiz de Evaluación
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
        Quiz — Día {dayData.day}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>
        {dayData.quiz?.length || 5} preguntas sobre {dayData.title}.
        Tipos: opción múltiple, verdadero/falso y completar comandos.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <span className="badge badge-purple">{dayData.quiz?.length || 5} preguntas</span>
        <span className="badge badge-yellow">Hasta +100 XP</span>
      </div>
      <button className="btn btn-primary" onClick={() => navigate(VIEWS.QUIZ, dayData.day)}>
        Iniciar Quiz →
      </button>
    </div>
  )
}

function MissionsShortcut({ dayData, navigate, progress }) {
  const done = progress.getMissionsDone?.(dayData.day) || []
  return (
    <div className="card" style={{ maxWidth: 700 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--green)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        🎯 Misiones de Terminal
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
        Misiones — Día {dayData.day}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {(dayData.missions || []).map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.875rem', color: done.includes(m.id) ? 'var(--green)' : 'var(--text-secondary)' }}>
            <span>{done.includes(m.id) ? '✅' : '⭕'}</span>
            <span>{m.title}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--yellow)' }}>+{m.xp}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={() => navigate(VIEWS.TERMINAL, dayData.day)}>
        Abrir Terminal →
      </button>
    </div>
  )
}

function colorDiagram(text) {
  return text
    .replace(/([├└│─]+)/g, '<span class="tree-branch">$1</span>')
    .replace(/(\/)(?=\s|$|\n)/g, '<span class="tree-root">$1</span>')
    .replace(/(\w+\/)/g, '<span class="tree-dir">$1</span>')
    .replace(/(\w+\.\w+)/g, '<span class="tree-file">$1</span>')
}

function ChevronIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
}
