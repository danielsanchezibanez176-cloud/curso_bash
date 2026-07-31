import React from 'react'
import TerminalOutput from './TerminalOutput.jsx'
import TerminalInput  from './TerminalInput.jsx'

/**
 * TerminalWindow — la ventana completa de la terminal
 * Incluye: barra de título estilo macOS, área de output, barra de input
 */
export default function TerminalWindow({
  lines,
  outputRef,
  inputValue,
  setInputValue,
  onKeyDown,
  prompt,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  onClear,
  onHelp,
  title = 'bash — linux-academy',
}) {
  return (
    <div className="terminal-window">

      {/* Barra de título */}
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <div className="terminal-dot terminal-dot--red"    title="Cerrar" />
          <div className="terminal-dot terminal-dot--yellow" title="Minimizar" />
          <div className="terminal-dot terminal-dot--green"  title="Maximizar" />
        </div>

        <div className="terminal-title">
          {prompt ? `${prompt.user}@${prompt.host}: ${prompt.path}` : title}
        </div>

        <div className="terminal-actions">
          <button
            className="terminal-action-btn"
            onClick={onHelp}
            title="Ver comandos disponibles"
          >
            help
          </button>
          <button
            className="terminal-action-btn"
            onClick={onClear}
            title="Limpiar terminal (Ctrl+L)"
          >
            clear
          </button>
        </div>
      </div>

      {/* Área de output */}
      <TerminalOutput lines={lines} ref={outputRef} />

      {/* Input */}
      <TerminalInput
        value={inputValue}
        onChange={setInputValue}
        onKeyDown={onKeyDown}
        prompt={prompt}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSelectSuggestion={onSelectSuggestion}
      />
    </div>
  )
}
