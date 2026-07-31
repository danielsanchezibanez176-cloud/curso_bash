import React from 'react'

/**
 * TerminalPrompt — muestra el prompt estilo bash:
 * estudiante@linux-academy:~/documentos$
 */
export default function TerminalPrompt({ user, host, path, command = '', dimCommand = false }) {
  return (
    <span className="terminal-prompt-line">
      <span className="prompt-user">{user}</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">{host}</span>
      <span className="prompt-colon">:</span>
      <span className="prompt-path">{path}</span>
      <span className="prompt-dollar">$</span>
      {command && (
        <span className={`prompt-cmd ${dimCommand ? 't-dim' : ''}`}>{command}</span>
      )}
    </span>
  )
}
