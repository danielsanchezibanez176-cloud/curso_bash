import React from 'react'
import { VIEWS } from '../App.jsx'
import { useQuiz, QUIZ_STATE, QUESTION_TYPE } from '../hooks/useQuiz.js'
import { formatSeconds } from '../utils/formatters.js'

export default function Quiz({ dayData, progress, showXP, navigate }) {
  const quiz = useQuiz({
    dayData,
    onComplete: ({ score, total, xpEarned }) => {
      progress.saveQuizScore(dayData.day, score)
      const alreadyRewarded = progress.xpClaims?.includes(`quiz:${dayData.day}`)
      if (xpEarned && !alreadyRewarded) {
        progress.awardXP(xpEarned, `quiz:${dayData.day}`)
        if (showXP) showXP(xpEarned, `Quiz Día ${dayData.day}`)
      }
    },
  })

  if (!dayData?.quiz?.length) {
    return (
      <div className="quiz-view anim-fade-in-up">
        <div className="empty-state">
          <div className="empty-state__icon">📝</div>
          <div className="empty-state__text">Quiz del Día {dayData?.day} disponible próximamente.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-view anim-fade-in-up">
      {quiz.quizState === QUIZ_STATE.IDLE     && <QuizIntro     quiz={quiz} dayData={dayData} />}
      {quiz.quizState === QUIZ_STATE.ACTIVE   && <QuizQuestion  quiz={quiz} />}
      {quiz.quizState === QUIZ_STATE.ANSWERED && <QuizQuestion  quiz={quiz} />}
      {quiz.quizState === QUIZ_STATE.COMPLETE && <QuizResults   quiz={quiz} dayData={dayData} navigate={navigate} />}
    </div>
  )
}

/* ── Pantalla de inicio ────────────────────────────────────── */
function QuizIntro({ quiz, dayData }) {
  const prev = null
  return (
    <div className="quiz-card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📝</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
        Quiz — Día {dayData.day}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', lineHeight: 1.7 }}>
        {dayData.quiz.length} preguntas sobre <strong style={{ color: 'var(--text-primary)' }}>{dayData.title}</strong>
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-6)' }}>
        Tipos: opción múltiple · verdadero/falso · completar comando
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <span className="badge badge-purple">{dayData.quiz.length} preguntas</span>
        <span className="badge badge-yellow">Hasta +100 XP</span>
        <span className="badge badge-green">Feedback inmediato</span>
      </div>
      <button className="btn btn-primary" style={{ fontSize: '1rem', padding: 'var(--space-4) var(--space-8)' }} onClick={quiz.startQuiz}>
        Comenzar Quiz →
      </button>
    </div>
  )
}

/* ── Pregunta activa ───────────────────────────────────────── */
function QuizQuestion({ quiz }) {
  const q = quiz.currentQuestion
  if (!q) return null
  const answered = quiz.quizState === QUIZ_STATE.ANSWERED

  return (
    <>
      {/* Header con progreso */}
      <div className="quiz-header">
        <div className="quiz-header__info">
          <div className="quiz-header__day">PREGUNTA {quiz.currentIndex + 1} DE {quiz.totalQuestions}</div>
          <h2 className="quiz-header__title">
            {q.type === QUESTION_TYPE.MULTIPLE  && 'Opción múltiple'}
            {q.type === QUESTION_TYPE.TRUE_FALSE && 'Verdadero o Falso'}
            {q.type === QUESTION_TYPE.FILL       && 'Completar el comando'}
          </h2>
        </div>
        <div className="quiz-progress-wrap">
          <div className="quiz-progress-label">
            <span>Progreso</span>
            <span>{quiz.score} correctas</span>
          </div>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${quiz.progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Pregunta */}
      <div className="quiz-card">
        <div className="quiz-card__meta">
          <span className={`badge ${q.type === QUESTION_TYPE.FILL ? 'badge-green' : q.type === QUESTION_TYPE.TRUE_FALSE ? 'badge-blue' : 'badge-purple'}`}>
            {q.type === QUESTION_TYPE.MULTIPLE  ? 'Opción múltiple'
           : q.type === QUESTION_TYPE.TRUE_FALSE ? 'Verdadero/Falso'
           : 'Completar'}
          </span>
          <span className="quiz-card__num">#{quiz.currentIndex + 1}</span>
        </div>

        <div className="quiz-card__question"
          dangerouslySetInnerHTML={{ __html: q.question.replace(/`([^`]+)`/g, '<code>$1</code>') }}
        />

        {/* Opciones según tipo */}
        {q.type === QUESTION_TYPE.MULTIPLE && (
          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let cls = ''
              if (answered) {
                if (i === q.correct)                cls = 'correct'
                else if (i === quiz.selected)       cls = 'incorrect'
              } else if (i === quiz.selected)       cls = 'selected'
              return (
                <button
                  key={i}
                  className={`quiz-option ${cls}`}
                  onClick={() => !answered && quiz.submitAnswer(i)}
                  disabled={answered}
                >
                  <span className="option-letter">{quiz.optionLetter(i)}</span>
                  <span dangerouslySetInnerHTML={{ __html: opt.replace(/`([^`]+)`/g, '<code>$1</code>') }} />
                </button>
              )
            })}
          </div>
        )}

        {q.type === QUESTION_TYPE.TRUE_FALSE && (
          <div className="quiz-tf-options">
            {[true, false].map(val => {
              let cls = ''
              if (answered) {
                if (val === q.correct)        cls = 'correct'
                else if (val === quiz.selected) cls = 'incorrect'
              }
              return (
                <button
                  key={String(val)}
                  className={`quiz-tf-btn quiz-tf-btn--${val ? 'true' : 'false'} ${cls}`}
                  onClick={() => !answered && quiz.submitAnswer(val)}
                  disabled={answered}
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', borderRadius: 'var(--radius-lg)' }}
                >
                  {val ? '✓ Verdadero' : '✗ Falso'}
                </button>
              )
            })}
          </div>
        )}

        {q.type === QUESTION_TYPE.FILL && (
          <div>
            <div className="quiz-fill-blank">
              <span style={{ color: 'var(--text-muted)' }}>$ </span>
              <input
                className={`fill-input ${answered ? (quiz.isCorrect ? 'correct' : 'incorrect') : ''}`}
                type="text"
                value={quiz.fillAnswer}
                onChange={e => !answered && quiz.setFillAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !answered && quiz.submitAnswer(quiz.fillAnswer)}
                placeholder="escribe aquí..."
                disabled={answered}
                autoFocus
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', minWidth: 200, background: 'transparent', borderBottom: '2px solid var(--purple)', outline: 'none', color: 'var(--green)', padding: '4px 8px' }}
              />
            </div>
            {!answered && (
              <button className="btn btn-primary" style={{ marginTop: 'var(--space-3)' }} onClick={() => quiz.submitAnswer(quiz.fillAnswer)}>
                Verificar
              </button>
            )}
          </div>
        )}

        {/* Feedback */}
        {answered && (
          <div className={`quiz-feedback quiz-feedback--${quiz.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="quiz-feedback__header">
              {quiz.isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </div>
            <div className="quiz-feedback__explanation">{q.explanation}</div>
            {!quiz.isCorrect && q.type === QUESTION_TYPE.FILL && (
              <div style={{ marginTop: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)' }}>
                Respuesta correcta: {Array.isArray(q.correct) ? q.correct[0] : q.correct}
              </div>
            )}
          </div>
        )}

        {/* Botón siguiente */}
        {answered && (
          <div className="quiz-actions">
            <button className="btn btn-primary" onClick={quiz.nextQuestion}>
              {quiz.isLastQuestion ? 'Ver resultados →' : 'Siguiente →'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

/* ── Resultados finales ─────────────────────────────────────── */
function QuizResults({ quiz, dayData, navigate }) {
  const pct = Math.round((quiz.score / quiz.totalQuestions) * 100)
  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '⭐' : pct >= 60 ? '👍' : '📚'

  return (
    <div className="quiz-results anim-scale-in">
      <div className="quiz-results__emoji">{emoji}</div>
      <div className={`quiz-results__score quiz-results__score--${quiz.finalScoreClass}`}>
        {quiz.score}/{quiz.totalQuestions}
      </div>
      <div className="quiz-results__label">{quiz.finalScoreLabel}</div>

      {quiz.xpEarned > 0 && (
        <div className="quiz-results__xp">⚡ +{quiz.xpEarned} XP ganados</div>
      )}

      <div className="quiz-results__breakdown">
        <div className="breakdown-item">
          <div className="breakdown-item__value" style={{ color: 'var(--green)' }}>{quiz.score}</div>
          <div className="breakdown-item__label">Correctas</div>
        </div>
        <div className="breakdown-item">
          <div className="breakdown-item__value" style={{ color: 'var(--red)' }}>{quiz.totalQuestions - quiz.score}</div>
          <div className="breakdown-item__label">Incorrectas</div>
        </div>
        <div className="breakdown-item">
          <div className="breakdown-item__value" style={{ color: 'var(--blue)' }}>{pct}%</div>
          <div className="breakdown-item__label">Porcentaje</div>
        </div>
      </div>

      {/* Revisión de respuestas */}
      <div style={{ width: '100%', marginBottom: 'var(--space-6)', textAlign: 'left' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>Revisión de respuestas</h3>
        {quiz.answers.map((a, i) => (
          <div key={i} style={{
            padding: 'var(--space-3) var(--space-4)',
            background: a.correct ? 'var(--green-dark)' : 'var(--red-glow)',
            border: `1px solid ${a.correct ? 'var(--border-green)' : 'rgba(255,71,87,.3)'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-2)',
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0 }}>{a.correct ? '✅' : '❌'}</span>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}
                  dangerouslySetInnerHTML={{ __html: a.question.replace(/`([^`]+)`/g, '<code>$1</code>') }}
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{a.explanation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-results__actions">
        <button className="btn btn-secondary" onClick={quiz.resetQuiz}>Reintentar</button>
        <button className="btn btn-primary" onClick={() => navigate(VIEWS.LESSON, dayData.day)}>
          Continuar →
        </button>
      </div>
    </div>
  )
}
