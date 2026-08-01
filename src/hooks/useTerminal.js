/* ============================================================
   useTerminal.js — Hook completo del simulador de terminal
   Gestiona: comandos, filesystem, historial, autocompletado,
   evaluación de misiones y persistencia.
   ============================================================ */

import { useState, useCallback, useRef, useEffect } from 'react'
import { executeCommand, OUT } from '../utils/commandEngine.js'
import { getFS }               from '../utils/filesystem.js'
import { evaluateAllMissions } from '../utils/missionEvaluator.js'
import { pushTerminalHistory, getTerminalHistory } from '../utils/storage.js'

// Mensaje de bienvenida al iniciar la terminal
const BOOT_MESSAGES = [
  { text: 'Ubuntu 22.04.3 LTS linux-academy tty1', type: OUT.SYSTEM },
  { text: '', type: OUT.TEXT },
  { text: 'Linux linux-academy 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux', type: OUT.TEXT },
  { text: '', type: OUT.TEXT },
  { text: '  ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗', type: OUT.INFO },
  { text: '  ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝', type: OUT.INFO },
  { text: '  ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝ ', type: OUT.INFO },
  { text: '  ██║     ██║██║╚██╗██║██║   ██║ ██╔██╗ ', type: OUT.INFO },
  { text: '  ███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗', type: OUT.INFO },
  { text: '  ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝', type: OUT.INFO },
  { text: '       A C A D E M Y  —  30 días', type: OUT.SUCCESS },
  { text: '', type: OUT.TEXT },
  { text: '  Bienvenido, estudiante. Escribe "help" para ver los comandos.', type: OUT.TEXT },
  { text: '  Usa TAB para autocompletar y ↑↓ para navegar el historial.', type: OUT.SYSTEM },
  { text: '', type: OUT.TEXT },
]

const MAX_OUTPUT_LINES = 2000
const MAX_HISTORY      = 500

export function useTerminal({ dayData, completedMissionIds = [], onMissionComplete, onFirstCommand }) {
  const fs = getFS()

  // ── Estado ────────────────────────────────────────────────
  const [lines,      setLines]      = useState(BOOT_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Historial en memoria (también en localStorage)
  const [cmdHistory, setCmdHistory] = useState(() => getTerminalHistory())

  // Misiones completadas en esta sesión
  const [sessionMissions, setSessionMissions] = useState([])

  // Ref al contenedor de output para auto-scroll
  const outputRef = useRef(null)

  // Auto-scroll al añadir líneas
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  // ── Helpers ───────────────────────────────────────────────

  const appendLines = useCallback((newLines) => {
    setLines(prev => {
      const combined = [...prev, ...newLines.filter(Boolean)]
      // Truncar si excede el máximo para no colapsar memoria
      return combined.length > MAX_OUTPUT_LINES
        ? combined.slice(combined.length - MAX_OUTPUT_LINES)
        : combined
    })
  }, [])

  const appendPromptEcho = useCallback((cmd) => {
    const prompt = fs.getPrompt()
    appendLines([{
      type: 'prompt_echo',
      user: prompt.user,
      host: prompt.host,
      path: prompt.path,
      cmd,
    }])
  }, [appendLines, fs])

  // ── Ejecutar comando ──────────────────────────────────────

  const runCommand = useCallback((raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    // Eco del prompt con el comando
    appendPromptEcho(trimmed)

    // Guardar en historial
    setCmdHistory(prev => {
      const next = [...prev.filter(c => c !== trimmed), trimmed].slice(-MAX_HISTORY)
      pushTerminalHistory(trimmed)
      return next
    })
    setHistoryIdx(-1)

    // Procesar comando
    const output = executeCommand(trimmed)

    // Contexto para evaluador de misiones
    const parts      = trimmed.split(/\s+/)
    const lastCommand = parts[0]
    const lastArgs    = parts.slice(1)
    const lastOutput  = output.map(l => l.text || '').join('\n')

    const context = { lastCommand: trimmed, lastArgs, lastOutput }

    // Evaluar misiones del día activo
    if (dayData?.missions?.length) {
      const alreadyDone   = [...new Set([...completedMissionIds, ...sessionMissions])]
      const justCompleted = evaluateAllMissions(dayData.missions, alreadyDone, context)

      if (justCompleted.length) {
        setSessionMissions(prev => [...prev, ...justCompleted])
        justCompleted.forEach(missionId => {
          const mission = dayData.missions.find(m => m.id === missionId)
          if (onMissionComplete) onMissionComplete(missionId, mission)
          // Feedback visual en terminal
          appendLines([
            { text: '', type: OUT.TEXT },
            { text: `✅ ¡Misión completada: "${mission?.title || missionId}"!`, type: OUT.SUCCESS },
            { text: `   +${mission?.xp || 75} XP`, type: OUT.SUCCESS },
            { text: '', type: OUT.TEXT },
          ])
        })
      }
    }

    // Primer comando — logro y XP
    if (onFirstCommand && trimmed !== 'help') {
      onFirstCommand()
    }

    // Evaluar clear antes de limpiar la vista: de otro modo el retorno
    // temprano impedía que la misión asociada se completara.
    if (output.length === 1 && output[0]?.type === 'clear') {
      setLines(BOOT_MESSAGES)
      return
    }

    appendLines(output)

  }, [appendLines, appendPromptEcho, dayData, completedMissionIds, sessionMissions, onMissionComplete, onFirstCommand])

  // ── Manejar Enter ─────────────────────────────────────────

  const handleEnter = useCallback(() => {
    const cmd = inputValue
    setInputValue('')
    setSuggestions([])
    setShowSuggestions(false)
    runCommand(cmd)
  }, [inputValue, runCommand])

  // ── Historial con ↑ ↓ ────────────────────────────────────

  const handleArrowUp = useCallback(() => {
    if (!cmdHistory.length) return
    setHistoryIdx(prev => {
      const next = prev === -1 ? cmdHistory.length - 1 : Math.max(0, prev - 1)
      setInputValue(cmdHistory[next] || '')
      return next
    })
  }, [cmdHistory])

  const handleArrowDown = useCallback(() => {
    setHistoryIdx(prev => {
      if (prev === -1) return -1
      const next = prev + 1
      if (next >= cmdHistory.length) {
        setInputValue('')
        return -1
      }
      setInputValue(cmdHistory[next] || '')
      return next
    })
  }, [cmdHistory])

  // ── Autocompletado TAB ────────────────────────────────────

  const handleTab = useCallback(() => {
    const tokens = inputValue.split(/\s+/)
    const last   = tokens[tokens.length - 1] || ''

    // Si es el primer token → completar comando
    if (tokens.length === 1) {
      const commands = [
        'ls', 'cd', 'pwd', 'mkdir', 'touch', 'cp', 'mv', 'rm',
        'cat', 'echo', 'grep', 'find', 'chmod', 'chown', 'history',
        'whoami', 'uname', 'ps', 'df', 'du', 'date', 'clear', 'help',
        'man', 'head', 'tail', 'sort', 'wc', 'tree', 'stat', 'file',
        'env', 'export', 'id', 'groups', 'ping', 'ssh', 'curl',
        'systemctl', 'crontab', 'tar', 'free', 'top', 'nano',
      ]
      const matches = commands.filter(c => c.startsWith(last))
      if (matches.length === 1) {
        setInputValue(matches[0] + ' ')
        setSuggestions([])
        setShowSuggestions(false)
      } else if (matches.length > 1) {
        setSuggestions(matches)
        setShowSuggestions(true)
      }
      return
    }

    // Completar rutas de archivos/dirs
    const pathMatches = fs.autocomplete(last)
    if (pathMatches.length === 1) {
      const newTokens = [...tokens]
      newTokens[newTokens.length - 1] = pathMatches[0]
      setInputValue(newTokens.join(' '))
      setSuggestions([])
      setShowSuggestions(false)
    } else if (pathMatches.length > 1) {
      // Encontrar prefijo común
      const common = commonPrefix(pathMatches)
      if (common.length > last.length) {
        const newTokens = [...tokens]
        newTokens[newTokens.length - 1] = common
        setInputValue(newTokens.join(' '))
      }
      setSuggestions(pathMatches)
      setShowSuggestions(true)
    }
  }, [inputValue, fs])

  // ── Manejar teclas especiales ─────────────────────────────

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        handleEnter()
        break
      case 'ArrowUp':
        e.preventDefault()
        handleArrowUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        handleArrowDown()
        break
      case 'Tab':
        e.preventDefault()
        handleTab()
        break
      case 'Escape':
        setSuggestions([])
        setShowSuggestions(false)
        break
      case 'c':
        if (e.ctrlKey) {
          appendLines([
            appendPromptEcho(inputValue),
            { text: '', type: OUT.TEXT },
          ])
          setInputValue('')
          setSuggestions([])
          setShowSuggestions(false)
        }
        break
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault()
          // Ctrl+L se enseña como equivalente de clear; usa el mismo flujo
          // para que la misión también quede registrada.
          runCommand('clear')
        }
        break
      default:
        // Ocultar sugerencias al escribir
        if (showSuggestions && e.key.length === 1) {
          setSuggestions([])
          setShowSuggestions(false)
        }
    }
  }, [handleEnter, handleArrowUp, handleArrowDown, handleTab, inputValue, showSuggestions, appendLines, appendPromptEcho, runCommand])

  // ── Seleccionar sugerencia ────────────────────────────────

  const selectSuggestion = useCallback((suggestion) => {
    const tokens = inputValue.split(/\s+/)
    tokens[tokens.length - 1] = suggestion
    setInputValue(tokens.join(' '))
    setSuggestions([])
    setShowSuggestions(false)
  }, [inputValue])

  // ── Limpiar terminal ──────────────────────────────────────

  const clearTerminal = useCallback(() => {
    setLines(BOOT_MESSAGES)
  }, [])

  // ── Añadir mensaje del sistema ────────────────────────────

  const addSystemMessage = useCallback((text, type = OUT.INFO) => {
    appendLines([{ text, type }])
  }, [appendLines])

  // ── Prompt actual ─────────────────────────────────────────

  const currentPrompt = fs.getPrompt()

  return {
    // Estado
    lines,
    inputValue,
    suggestions,
    showSuggestions,
    isProcessing,
    cmdHistory,
    currentPrompt,
    sessionMissions,
    outputRef,
    // Setters
    setInputValue,
    // Handlers
    handleKeyDown,
    handleEnter,
    handleTab,
    handleArrowUp,
    handleArrowDown,
    selectSuggestion,
    // Acciones
    runCommand,
    clearTerminal,
    addSystemMessage,
  }
}

// ─── Helper: prefijo común de un array de strings ────────────

function commonPrefix(strs) {
  if (!strs.length) return ''
  let prefix = strs[0]
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
}
