import React, { useState, useEffect, useCallback, Component } from 'react'
import Dashboard from './components/Dashboard.jsx'
import Sidebar from './components/Sidebar.jsx'
import Lesson from './components/Lesson.jsx'
import Terminal from './components/Terminal.jsx'
import Laboratory from './components/Laboratory.jsx'
import Quiz from './components/Quiz.jsx'
import MissionPanel from './components/MissionPanel.jsx'
import AchievementPanel from './components/AchievementPanel.jsx'
import XPNotification from './components/ui/XPNotification.jsx'
import { useProgress } from './hooks/useProgress.js'
import { courseData } from './data/courseData.js'

export const VIEWS = {
  DASHBOARD:    'dashboard',
  LESSON:       'lesson',
  TERMINAL:     'terminal',
  LABORATORY:   'laboratory',
  QUIZ:         'quiz',
  MISSIONS:     'missions',
  ACHIEVEMENTS: 'achievements',
}

function getStoredTheme(fallback = 'light') {
  try {
    return localStorage.getItem('la30_theme') || fallback
  } catch {
    return fallback
  }
}

// ── Error Boundary — muestra el error en pantalla en lugar de pantalla en blanco
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('LinuxAcademy Error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0a0b0d', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '40px',
        }}>
          <div style={{ maxWidth: 700, fontFamily: 'monospace' }}>
            <div style={{ color: '#00ff88', fontSize: '1.3rem', marginBottom: 16 }}>
              $ LinuxAcademy — Error detectado
            </div>
            <div style={{ color: '#ff4757', background: '#1a1f2e', padding: 24, borderRadius: 8, border: '1px solid rgba(255,71,87,0.3)', marginBottom: 16 }}>
              <div style={{ color: '#ffd700', marginBottom: 8, fontWeight: 700 }}>
                {this.state.error?.name}: {this.state.error?.message}
              </div>
              <div style={{ color: '#8892a4', fontSize: '0.8rem', whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
                {this.state.error?.stack}
              </div>
            </div>
            <div style={{ color: '#4d9fff', fontSize: '0.9rem', marginBottom: 16 }}>
              💡 Solución: Abre F12 → Console para ver el error completo, luego abre un issue o revisa que todos los archivos estén en su lugar.
            </div>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              style={{ background: '#00ff88', color: '#000', border: 'none', padding: '10px 24px', borderRadius: 6, fontFamily: 'monospace', cursor: 'pointer', fontWeight: 700 }}
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Componente principal ──────────────────────────────────────
export default function App() {
  const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD)
  const [selectedDay,  setSelectedDay]  = useState(1)
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [xpNotification, setXpNotification] = useState(null)
  const [lessonTab,    setLessonTab]    = useState('teoria')
  const [theme, setTheme] = useState(() => getStoredTheme())
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const progress = useProgress()

  const showXP = useCallback((amount, reason) => {
    setXpNotification({ amount, reason, id: Date.now() })
    setTimeout(() => setXpNotification(null), 3000)
  }, [])

  const navigate = useCallback((view, day = null) => {
    setCurrentView(view)
    if (day !== null) setSelectedDay(day)
  }, [])

  const handleDaySelect = useCallback((day) => {
    setSelectedDay(day)
    setCurrentView(VIEWS.LESSON)
    setLessonTab('teoria')
  }, [])

  const currentDayData = courseData.find(d => d.day === selectedDay) || courseData[0]

  const resetAllProgress = useCallback(() => {
    const currentTheme = getStoredTheme(theme)
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('la30_'))
        .forEach(key => localStorage.removeItem(key))
      Object.keys(sessionStorage)
        .filter(key => key.startsWith('la30_'))
        .forEach(key => sessionStorage.removeItem(key))
      localStorage.setItem('la30_theme', currentTheme)
    } catch {
      // El reinicio visual sigue funcionando aunque el almacenamiento esté bloqueado.
    }
    window.location.reload()
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('la30_theme', theme)
    } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#090a0c' : '#f6f4ed'
    )
  }, [theme])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderView = () => {
    const commonProps = { dayData: currentDayData, progress, showXP, navigate, selectedDay }
    switch (currentView) {
      case VIEWS.DASHBOARD:
        return <Dashboard progress={progress} courseData={courseData} navigate={navigate} showXP={showXP} />
      case VIEWS.LESSON:
        return <Lesson {...commonProps} activeTab={lessonTab} setActiveTab={setLessonTab} />
      case VIEWS.TERMINAL:
        return <Terminal progress={progress} showXP={showXP} dayData={currentDayData} />
      case VIEWS.LABORATORY:
        return <Laboratory {...commonProps} />
      case VIEWS.QUIZ:
        return <Quiz {...commonProps} />
      case VIEWS.MISSIONS:
        return <MissionPanel {...commonProps} />
      case VIEWS.ACHIEVEMENTS:
        return <AchievementPanel progress={progress} navigate={navigate} />
      default:
        return <Dashboard progress={progress} courseData={courseData} navigate={navigate} showXP={showXP} />
    }
  }

  return (
    <ErrorBoundary>
      <div className={`app-root ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

        <div className="app-bg" aria-hidden="true">
          <div className="scanlines" />
          <div className="bg-glow bg-glow--1" />
          <div className="bg-glow bg-glow--2" />
        </div>

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(p => !p)}
          currentView={currentView}
          selectedDay={selectedDay}
          progress={progress}
          courseData={courseData}
          onDaySelect={handleDaySelect}
          navigate={navigate}
        />

        <main className="app-main">
          <header className="app-header">
            <button className="hamburger" onClick={() => setSidebarOpen(p => !p)} aria-label="Toggle sidebar">
              <span /><span /><span />
            </button>
            <div className="header-brand">
              <img
                className="header-tux"
                src={`${import.meta.env.BASE_URL}tux-linux-transparent.png`}
                alt=""
              />
              <span className="header-brand__prefix">$</span>
              <span className="header-brand__name">linux_academy</span>
              <span className="header-brand__suffix">--30days</span>
            </div>
            <nav className="header-nav">
              <button
                className="theme-toggle"
                onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
                aria-label={`Cambiar al tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                title={`Tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
              >
                <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
                <span className="theme-toggle__label">{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
              </button>
              <button
                className="reset-progress-btn"
                onClick={() => setShowResetConfirm(true)}
                aria-label="Reiniciar progreso"
                title="Reiniciar progreso"
              >
                <ResetIcon /><span>Reiniciar progreso</span>
              </button>
              <button className={`header-nav__btn ${currentView===VIEWS.TERMINAL?'active':''}`} onClick={() => navigate(VIEWS.TERMINAL)}>
                <TerminalIcon /><span>Terminal</span>
              </button>
              <button className={`header-nav__btn ${currentView===VIEWS.ACHIEVEMENTS?'active':''}`} onClick={() => navigate(VIEWS.ACHIEVEMENTS)}>
                <TrophyIcon /><span>Logros</span>
              </button>
              <div className="header-stats">
                <div className="header-xp">
                  <span className="header-xp__icon">⚡</span>
                  <span className="header-xp__value">{(progress.xp||0).toLocaleString()}</span>
                  <span className="header-xp__label">XP</span>
                </div>
                <div className="header-level">
                  <span className="header-level__num">Nv.{progress.level||1}</span>
                  <span className="header-level__title">{progress.levelTitle||'Novato Linux'}</span>
                </div>
              </div>
            </nav>
          </header>

          <div className="app-content" key={currentView}>
            {renderView()}
          </div>
        </main>

        {xpNotification && (
          <XPNotification key={xpNotification.id} amount={xpNotification.amount} reason={xpNotification.reason} />
        )}

        {showResetConfirm && (
          <div className="reset-modal-backdrop" onClick={() => setShowResetConfirm(false)}>
            <div
              className="reset-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-modal-title"
              onClick={event => event.stopPropagation()}
            >
              <div className="reset-modal__icon">↻</div>
              <h2 id="reset-modal-title">¿Seguro que quieres reiniciar tu progreso?</h2>
              <p>
                Se eliminarán permanentemente tu experiencia, nivel, días completados,
                quizzes, laboratorios, misiones, logros, historial y archivos de la terminal.
              </p>
              <div className="reset-modal__warning">Esta acción no se puede deshacer.</div>
              <div className="reset-modal__actions">
                <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger reset-modal__continue" onClick={resetAllProgress}>
                  Continuar y reiniciar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

function TerminalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
}
function TrophyIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
}
function ResetIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/></svg>
}
