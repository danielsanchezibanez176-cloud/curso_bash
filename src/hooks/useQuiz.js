/* ============================================================
   useQuiz.js — Hook de gestión completa del quiz
   Maneja: preguntas, respuestas, feedback, puntuación, XP
   ============================================================ */

import { useState, useCallback, useMemo } from 'react'
import { quizXPReward, quizScoreLabel, quizScoreClass } from '../utils/formatters.js'

// Estados posibles del quiz
export const QUIZ_STATE = {
  IDLE:       'idle',       // No iniciado
  ACTIVE:     'active',     // En curso
  ANSWERED:   'answered',   // Respuesta enviada, mostrando feedback
  COMPLETE:   'complete',   // Todas las preguntas respondidas
}

// Tipos de pregunta
export const QUESTION_TYPE = {
  MULTIPLE:  'multiple',   // Opción múltiple (A, B, C, D)
  TRUE_FALSE:'true_false', // Verdadero / Falso
  FILL:      'fill',       // Completar el comando
  ORDER:     'order',      // Ordenar pasos (no implementado visualmente aún)
}

export function useQuiz({ dayData, onComplete, onXP }) {
  const questions = useMemo(() => dayData?.quiz || [], [dayData])

  const [quizState,    setQuizState]    = useState(QUIZ_STATE.IDLE)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected,     setSelected]     = useState(null)   // respuesta seleccionada
  const [fillAnswer,   setFillAnswer]   = useState('')     // para tipo fill
  const [isCorrect,    setIsCorrect]    = useState(null)   // null | true | false
  const [score,        setScore]        = useState(0)      // respuestas correctas
  const [answers,      setAnswers]      = useState([])     // historial de respuestas
  const [startTime,    setStartTime]    = useState(null)
  const [elapsedSecs,  setElapsedSecs]  = useState(0)

  // Pregunta actual
  const currentQuestion = questions[currentIndex] || null
  const totalQuestions  = questions.length
  const isLastQuestion  = currentIndex === totalQuestions - 1

  // ── Iniciar quiz ──────────────────────────────────────────

  const startQuiz = useCallback(() => {
    setQuizState(QUIZ_STATE.ACTIVE)
    setCurrentIndex(0)
    setSelected(null)
    setFillAnswer('')
    setIsCorrect(null)
    setScore(0)
    setAnswers([])
    setStartTime(Date.now())
    setElapsedSecs(0)
  }, [])

  // ── Normalizar respuesta fill ──────────────────────────────

  function normalizeFill(str) {
    return str.trim().toLowerCase().replace(/\s+/g, ' ')
  }

  // ── Verificar respuesta ───────────────────────────────────

  const submitAnswer = useCallback((answer) => {
    if (!currentQuestion || quizState !== QUIZ_STATE.ACTIVE) return

    let correct = false
    let normalizedAnswer = answer

    switch (currentQuestion.type) {
      case QUESTION_TYPE.MULTIPLE:
      case QUESTION_TYPE.TRUE_FALSE:
        correct = answer === currentQuestion.correct
        normalizedAnswer = answer
        break

      case QUESTION_TYPE.FILL: {
        const userAns     = normalizeFill(typeof answer === 'string' ? answer : fillAnswer)
        const correctAns  = Array.isArray(currentQuestion.correct)
          ? currentQuestion.correct.map(normalizeFill)
          : [normalizeFill(currentQuestion.correct)]
        correct = correctAns.includes(userAns)
        normalizedAnswer = userAns
        break
      }

      default:
        correct = answer === currentQuestion.correct
    }

    setSelected(normalizedAnswer)
    setIsCorrect(correct)
    setQuizState(QUIZ_STATE.ANSWERED)
    if (correct) setScore(prev => prev + 1)

    setAnswers(prev => [...prev, {
      questionIndex: currentIndex,
      question:      currentQuestion.question,
      answer:        normalizedAnswer,
      correct,
      explanation:   currentQuestion.explanation,
    }])
  }, [currentQuestion, currentIndex, quizState, fillAnswer])

  // ── Siguiente pregunta ────────────────────────────────────

  const nextQuestion = useCallback(() => {
    if (isLastQuestion) {
      // Quiz completado
      const finalScore = score + (isCorrect ? 0 : 0) // ya sumado en submitAnswer
      const elapsed    = Math.round((Date.now() - startTime) / 1000)
      setElapsedSecs(elapsed)
      setQuizState(QUIZ_STATE.COMPLETE)

      // Calcular XP
      const xpEarned = quizXPReward(score, totalQuestions)
      if (xpEarned && onXP) {
        const label = quizScoreLabel(score, totalQuestions)
        onXP(xpEarned, `Quiz Día ${dayData?.day}: ${label}`)
      }

      if (onComplete) {
        onComplete({
          score,
          total:     totalQuestions,
          xpEarned,
          elapsed,
          answers,
        })
      }
    } else {
      // Siguiente pregunta
      setCurrentIndex(prev => prev + 1)
      setSelected(null)
      setFillAnswer('')
      setIsCorrect(null)
      setQuizState(QUIZ_STATE.ACTIVE)
    }
  }, [isLastQuestion, score, isCorrect, startTime, totalQuestions, onXP, onComplete, dayData, answers])

  // ── Reiniciar quiz ────────────────────────────────────────

  const resetQuiz = useCallback(() => {
    setQuizState(QUIZ_STATE.IDLE)
    setCurrentIndex(0)
    setSelected(null)
    setFillAnswer('')
    setIsCorrect(null)
    setScore(0)
    setAnswers([])
    setStartTime(null)
    setElapsedSecs(0)
  }, [])

  // ── Derivados ─────────────────────────────────────────────

  const progressPct    = totalQuestions ? Math.round(((currentIndex + (quizState === QUIZ_STATE.COMPLETE ? 1 : 0)) / totalQuestions) * 100) : 0
  const finalScoreClass = quizScoreClass(score, totalQuestions)
  const finalScoreLabel = quizScoreLabel(score, totalQuestions)
  const xpEarned        = quizXPReward(score, totalQuestions)

  // Letra de opción A, B, C, D
  function optionLetter(index) {
    return String.fromCharCode(65 + index) // A=65
  }

  return {
    // Estado
    quizState,
    currentIndex,
    currentQuestion,
    totalQuestions,
    selected,
    fillAnswer,
    isCorrect,
    score,
    answers,
    elapsedSecs,
    isLastQuestion,
    progressPct,
    finalScoreClass,
    finalScoreLabel,
    xpEarned,
    // Setters
    setFillAnswer,
    // Acciones
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    // Helpers
    optionLetter,
    QUIZ_STATE,
    QUESTION_TYPE,
  }
}
