import React, { forwardRef } from 'react'
import TerminalPrompt from './TerminalPrompt.jsx'
import { OUT } from '../../utils/commandEngine.js'

/**
 * TerminalOutput — renderiza todas las líneas del historial
 * Tipos soportados: text, error, success, info, warning, system,
 *                   dir, prompt_echo, ls_grid, clear
 */
const TerminalOutput = forwardRef(function TerminalOutput({ lines }, ref) {
  return (
    <div className="terminal-body" ref={ref}>
      {lines.map((line, i) => (
        <OutputLine key={i} line={line} />
      ))}
    </div>
  )
})

export default TerminalOutput

function OutputLine({ line }) {
  if (!line) return null

  // Prompt echo — línea de comando enviado
  if (line.type === 'prompt_echo') {
    return (
      <div className="terminal-line terminal-line--prompt" style={{ marginTop: '6px' }}>
        <TerminalPrompt
          user={line.user}
          host={line.host}
          path={line.path}
          command={line.cmd}
        />
      </div>
    )
  }

  // Grid de ls (formato corto)
  if (line.type === 'ls_grid') {
    return <LsGrid items={line.items} />
  }

  // Línea de texto normal con tipo de color
  const cls = typeToClass(line.type)
  const text = line.text ?? ''

  // Línea vacía
  if (text === '') return <div className="terminal-line" style={{ height: '4px' }} />

  return (
    <div className={`terminal-line terminal-line--${line.type || 'text'}`}>
      <span className={cls} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {colorizeText(text, line.type)}
      </span>
    </div>
  )
}

// Grid para salida de ls sin flags -l
function LsGrid({ items }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2px 0',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.875rem',
      padding: '2px 0',
    }}>
      {items.map((item, i) => (
        <span
          key={i}
          className={item.isDir ? 'ls-dir' : 'ls-file'}
          style={{ minWidth: '160px', paddingRight: '16px' }}
        >
          {item.text}
        </span>
      ))}
    </div>
  )
}

// Mapear tipo de línea a clase CSS
function typeToClass(type) {
  switch (type) {
    case OUT.ERROR:   return 'terminal-error'
    case OUT.SUCCESS: return 'terminal-success'
    case OUT.INFO:    return 'terminal-info'
    case OUT.WARNING: return 'terminal-warning'
    case OUT.SYSTEM:  return 'terminal-system'
    case OUT.DIR:     return 'ls-dir'
    default:          return 'terminal-output'
  }
}

// Colorizar partes específicas del texto (permisos ls -l, etc.)
function colorizeText(text, type) {
  // Para salida de ls -l: colorear permisos, propietarios, tamaños
  if (type === OUT.TEXT && /^[d\-lrwx]{10}/.test(text)) {
    return <LsLongLine text={text} />
  }
  return text
}

// Línea de ls -l con colores en cada campo
function LsLongLine({ text }) {
  // drwxr-xr-x 1 estudiante estudiante   4096 Jan  1 08:00 documentos/
  const match = text.match(
    /^([d\-lrwxst]{10})\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\w{3}\s+\d+\s+[\d:]+)\s+(.+)$/
  )
  if (!match) return <span className="terminal-output">{text}</span>

  const [, perms, links, owner, group, size, date, name] = match
  const isDir  = perms.startsWith('d')
  const isExec = perms.includes('x') && !isDir

  return (
    <span>
      <span className="ls-perm">{perms}</span>
      <span className="terminal-output"> {links} </span>
      <span style={{ color: 'var(--cyan)' }}>{owner}</span>
      <span className="terminal-output"> </span>
      <span style={{ color: 'var(--text-muted)' }}>{group}</span>
      <span className="terminal-output"> </span>
      <span className="ls-size">{size}</span>
      <span className="terminal-output"> </span>
      <span className="ls-date">{date}</span>
      <span className="terminal-output"> </span>
      <span className={isDir ? 'ls-dir' : isExec ? 'ls-exec' : 'ls-file'}>
        {name}
      </span>
    </span>
  )
}
