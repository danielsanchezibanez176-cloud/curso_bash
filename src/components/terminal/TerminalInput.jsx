import React, { useRef, useEffect } from 'react'
import TerminalPrompt from './TerminalPrompt.jsx'

/**
 * TerminalInput — barra de entrada de la terminal
 * - Historial con ↑ ↓
 * - Autocompletado con TAB
 * - Foco automático al montar
 */
export default function TerminalInput({
  value,
  onChange,
  onKeyDown,
  prompt,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  disabled = false,
}) {
  const inputRef = useRef(null)

  // Auto-focus al montar y mantener foco
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus()
    }
  }, [disabled])

  // Click en cualquier parte del área → focus al input
  function handleAreaClick() {
    if (inputRef.current && !disabled) inputRef.current.focus()
  }

  return (
    <div className="terminal-input-area" onClick={handleAreaClick}>

      {/* Popup de autocompletado */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="autocomplete-popup">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="autocomplete-item"
              onMouseDown={e => { e.preventDefault(); onSelectSuggestion(s) }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="terminal-input-wrap">
        <div className="terminal-input-prompt">
          {prompt && (
            <TerminalPrompt
              user={prompt.user}
              host={prompt.host}
              path={prompt.path}
            />
          )}
          <span className="prompt-dollar" style={{ marginRight: '6px' }}>&nbsp;$&nbsp;</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          className="terminal-input-field"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={disabled}
          placeholder={disabled ? '' : 'escribe un comando...'}
          aria-label="Entrada de terminal"
        />
      </div>
    </div>
  )
}
