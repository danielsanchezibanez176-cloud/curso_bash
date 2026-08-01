import React, { useMemo } from 'react'
import { VIEWS } from '../App.jsx'
import ProgressBar from './ProgressBar.jsx'
import { formatStudyTime, categoryIcon, weekLabel, weekOf } from '../utils/formatters.js'

export default function Sidebar({
  isOpen, onToggle, currentView, selectedDay,
  progress, courseData, onDaySelect, navigate,
}) {
  const weeks = useMemo(() => {
    const map = {}
    for (const day of courseData) {
      const w = weekOf(day.day)
      if (!map[w]) map[w] = []
      map[w].push(day)
    }
    return Object.entries(map).map(([w, days]) => ({ week: Number(w), days }))
  }, [courseData])

  const xpInfo = progress.xpInfo || {}
  const xpPct  = xpInfo.pct || 0

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>

      <div className="sidebar-logo">
        <div className="sidebar-logo__icon">$_</div>
        <div>
          <div className="sidebar-logo__text">LinuxAcademy</div>
          <div className="sidebar-logo__sub">30 DÍAS · BASH · LINUX · CYBER</div>
        </div>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-profile__level">
          <span className="sidebar-profile__title">{progress.levelIcon} {progress.levelTitle}</span>
          <span className="sidebar-profile__xp">{(progress.xp||0).toLocaleString()} XP</span>
        </div>
        <div className="sidebar-profile__bar">
          <div className="sidebar-profile__fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="sidebar-profile__stats">
          <div className="sidebar-stat">
            <div className="sidebar-stat__value">{progress.completedDays?.length || 0}</div>
            <div className="sidebar-stat__label">Días</div>
          </div>
          <div className="sidebar-stat">
            <div className="sidebar-stat__value">{progress.streak || 0}</div>
            <div className="sidebar-stat__label">Racha</div>
          </div>
          <div className="sidebar-stat">
            <div className="sidebar-stat__value">{formatStudyTime(progress.studyTimeMinutes || 0)}</div>
            <div className="sidebar-stat__label">Tiempo</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className={`sidebar-nav__item ${currentView===VIEWS.DASHBOARD?'active':''}`} onClick={()=>navigate(VIEWS.DASHBOARD)}>
          <DashIcon /> Inicio
        </button>
        <button className={`sidebar-nav__item ${currentView===VIEWS.TERMINAL?'active':''}`} onClick={()=>navigate(VIEWS.TERMINAL)}>
          <TermIcon /> Terminal
        </button>
        <button className={`sidebar-nav__item ${currentView===VIEWS.ACHIEVEMENTS?'active':''}`} onClick={()=>navigate(VIEWS.ACHIEVEMENTS)}>
          <TrophyIcon /> Logros
        </button>
        <button className={`sidebar-nav__item ${currentView===VIEWS.MISSIONS?'active':''}`} onClick={()=>navigate(VIEWS.MISSIONS)}>
          <MissionIcon /> Misiones
        </button>
      </nav>

      <div className="sidebar-days">
        <div className="sidebar-days__heading">Programa del curso</div>

        {weeks.map(({ week, days }) => (
          <div key={week} className="sidebar-week">
            <div className="sidebar-week__label">{weekLabel(week)}</div>

            {days.map(day => {
              const isCompleted = progress.completedDays?.includes(day.day)
              const isActive    = selectedDay === day.day
              const isUnlocked  = progress.isDayUnlocked ? progress.isDayUnlocked(day.day) : day.day <= (progress.currentDay||1)

              return (
                <button
                  key={day.day}
                  className={`sidebar-day ${isActive?'active':''} ${isCompleted?'completed':''}`}
                  onClick={() => isUnlocked && onDaySelect(day.day)}
                  disabled={!isUnlocked}
                  title={!isUnlocked ? 'Completa el día anterior primero' : day.title}
                >
                  <span className="day-num">{day.day}</span>
                  <div className="day-info">
                    <div className="day-title">{day.title}</div>
                    <div className="day-category">{categoryIcon(day.category)} {day.category?.toUpperCase()}</div>
                  </div>
                  <div className="day-right">
                    {isCompleted && <span className="day-check">✓</span>}
                    {!isCompleted && isUnlocked && <span className="day-xp">+{day.xp}</span>}
                    {!isUnlocked && <span className="day-lock" style={{opacity:0.3,fontSize:'0.7rem'}}>🔒</span>}
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer__version">LinuxAcademy v1.0 · {progress.completionPct||0}% completado</div>
      </div>
    </aside>
  )
}

function DashIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }
function TermIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> }
function TrophyIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> }
function MissionIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
