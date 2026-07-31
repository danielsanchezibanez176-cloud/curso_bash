import React, { useCallback, useEffect, useRef } from 'react'
import { getFS } from '../utils/filesystem.js'
import TerminalWindow from './terminal/TerminalWindow.jsx'
import MissionCard    from './missions/MissionCard.jsx'
import { useTerminal } from '../hooks/useTerminal.js'
import { XP_REWARDS } from '../hooks/useProgress.js'
import { checkAutoAchievements } from '../data/achievementsDB.js'

// Comandos de referencia rápida para el panel lateral
const CMD_REFERENCE = [
  { name: 'pwd',     desc: 'Directorio actual' },
  { name: 'ls -la',  desc: 'Listar con detalles' },
  { name: 'cd dir',  desc: 'Cambiar directorio' },
  { name: 'mkdir',   desc: 'Crear directorio' },
  { name: 'touch',   desc: 'Crear archivo' },
  { name: 'cat',     desc: 'Ver contenido' },
  { name: 'echo',    desc: 'Imprimir texto' },
  { name: 'grep',    desc: 'Buscar en texto' },
  { name: 'chmod',   desc: 'Cambiar permisos' },
  { name: 'find',    desc: 'Buscar archivos' },
  { name: 'ps aux',  desc: 'Ver procesos' },
  { name: 'df -h',   desc: 'Espacio en disco' },
  { name: 'history', desc: 'Historial' },
  { name: 'man cmd', desc: 'Manual' },
  { name: 'help',    desc: 'Ayuda general' },
]

export default function Terminal({ progress, showXP, dayData }) {
  const firstCommandHandled = useRef(Boolean(progress.firstCommandDone))
  const doneMissions = progress.getMissionsDone?.(dayData?.day || 1) || []

  // Callback: misión completada desde la terminal
  const handleMissionComplete = useCallback((missionId, mission) => {
    const alreadyDone = progress.missionsCompleted?.[dayData?.day || 1] || []
    if (alreadyDone.includes(missionId)) return
    progress.completeMission(dayData?.day || 1, missionId)
    const reward = mission?.xp || XP_REWARDS.MISSION_COMPLETE
    progress.awardXP(reward, `mission:${dayData?.day || 1}:${missionId}`)
    if (showXP) showXP(reward, `Misión: ${mission?.title || missionId}`)
  }, [progress, dayData, showXP])

  // Callback: primer comando ejecutado
  const handleFirstCommand = useCallback(() => {
    progress.recordCommand()
    if (!firstCommandHandled.current) {
      firstCommandHandled.current = true
      progress.awardXP(XP_REWARDS.FIRST_COMMAND, 'first-command')
      progress.unlockAchievement('first_command')
      if (showXP) showXP(XP_REWARDS.FIRST_COMMAND, '¡Primer comando!')
    }
  }, [progress, showXP])

  // Hook de terminal
  const terminal = useTerminal({
    dayData,
    completedMissionIds: doneMissions,
    onMissionComplete: handleMissionComplete,
    onFirstCommand:    handleFirstCommand,
  })

  // Verificar logros automáticos cada vez que cambia el progreso
  useEffect(() => {
    const toUnlock = checkAutoAchievements(progress)
    toUnlock.forEach(id => progress.unlockAchievement(id))
  }, [progress.xp, progress.commandsExecuted, progress.completedDays?.length])

  // Misiones del día activo
  const missions    = dayData?.missions || []
  const allDone      = missions.length > 0 && missions.every(m => doneMissions.includes(m.id))

  // Handler: botón help en titlebar
  const handleHelp = useCallback(() => {
    terminal.runCommand('help')
  }, [terminal])

  return (
    <div className="terminal-view anim-fade-in">

      {/* Header */}
      <div className="terminal-view__header">
        <h2 className="terminal-view__title">
          Terminal Linux
          {dayData && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 400,
              marginLeft: 'var(--space-3)',
            }}>
              — Día {dayData.day}: {dayData.title}
            </span>
          )}
        </h2>
        <p className="terminal-view__sub">
          Sistema de archivos virtual · TAB para autocompletar · ↑↓ para historial
        </p>
      </div>

      {/* Layout: terminal + panel lateral */}
      <div className="terminal-layout">

        {/* Ventana de terminal */}
        <TerminalWindow
          lines={terminal.lines}
          outputRef={terminal.outputRef}
          inputValue={terminal.inputValue}
          setInputValue={terminal.setInputValue}
          onKeyDown={terminal.handleKeyDown}
          prompt={terminal.currentPrompt}
          suggestions={terminal.suggestions}
          showSuggestions={terminal.showSuggestions}
          onSelectSuggestion={terminal.selectSuggestion}
          onClear={terminal.clearTerminal}
          onHelp={handleHelp}
        />

        {/* Panel lateral */}
        <div className="terminal-panel">

          {/* Misiones del día */}
          {missions.length > 0 && (
            <div className="terminal-missions">
              <div className="terminal-missions__title">
                <span>🎯</span>
                Misiones — Día {dayData?.day}
                {allDone && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.7rem',
                    color: 'var(--green)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    ¡TODO LISTO!
                  </span>
                )}
              </div>

              {missions.map(mission => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isDone={doneMissions.includes(mission.id)}
                />
              ))}

              {/* XP total de misiones */}
              <div style={{
                marginTop: 'var(--space-3)',
                paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {doneMissions.length}/{missions.length} completadas
                </span>
                <span style={{ color: 'var(--yellow)' }}>
                  +{missions.reduce((a, m) => a + (m.xp || 0), 0)} XP total
                </span>
              </div>
            </div>
          )}

          {/* Stats de sesión */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)',
            }}>
              📊 Sesión actual
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              {[
                { label: 'Comandos', value: progress.commandsExecuted || 0, color: 'var(--green)' },
                { label: 'Misiones', value: doneMissions.length, color: 'var(--blue)' },
                { label: 'Nivel',    value: `N${progress.level}`, color: 'var(--yellow)' },
                { label: 'XP',       value: (progress.xp || 0).toLocaleString(), color: 'var(--purple)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, color }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referencia rápida de comandos */}
          <div className="cmd-reference">
            <div className="cmd-reference__title">📖 Referencia rápida</div>
            {CMD_REFERENCE.map(({ name, desc }) => (
              <div
                key={name}
                className="cmd-ref-item"
                onClick={() => terminal.setInputValue(name.split(' ')[0] + ' ')}
                style={{ cursor: 'pointer' }}
                title={`Insertar: ${name}`}
              >
                <span className="cmd-ref-name">{name}</span>
                <span className="cmd-ref-desc">{desc}</span>
              </div>
            ))}
          </div>

          {/* Árbol del sistema de archivos */}
          <FSExplorer terminal={terminal} />

        </div>
      </div>
    </div>
  )
}

// ── Explorador del sistema de archivos ────────────────────────

function FSExplorer({ terminal }) {

  const fs  = getFS()
  const cwd = terminal.currentPrompt?.path || '~'

  function goToDir(cmd) {
    terminal.runCommand(cmd)
  }

  // Listar directorio actual
  const result = fs.listDir(fs.cwd, false)
  const entries = result.entries || []

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-3)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}>
        <span>📁</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontSize: '0.78rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {cwd}
        </span>
      </div>

      {/* Botón subir directorio */}
      <div
        className="cmd-ref-item"
        onClick={() => goToDir('cd ..')}
        style={{ cursor: 'pointer', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-1)' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--blue)' }}>../</span>
        <span className="cmd-ref-desc">subir directorio</span>
      </div>

      {entries.slice(0, 12).map(node => (
        <div
          key={node.name}
          className="cmd-ref-item"
          onClick={() => {
            if (node.type === 'dir') goToDir(`cd ${node.name}`)
            else goToDir(`cat ${node.name}`)
          }}
          style={{ cursor: 'pointer' }}
          title={node.type === 'dir' ? `cd ${node.name}` : `cat ${node.name}`}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: node.type === 'dir' ? 'var(--blue)' : node.permissions?.includes('x') ? 'var(--green)' : 'var(--text-secondary)',
            minWidth: '80px',
          }}>
            {node.name}{node.type === 'dir' ? '/' : ''}
          </span>
          <span className="cmd-ref-desc" style={{ fontSize: '0.68rem' }}>
            {node.type === 'dir' ? 'dir' : formatFileSize(node.size || 0)}
          </span>
        </div>
      ))}

      {entries.length === 0 && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', padding: 'var(--space-2) 0' }}>
          (directorio vacío)
        </div>
      )}

      {entries.length > 12 && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>
          +{entries.length - 12} más — usa ls para ver todos
        </div>
      )}
    </div>
  )
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0B'
  if (bytes < 1024) return `${bytes}B`
  return `${(bytes / 1024).toFixed(0)}K`
}
