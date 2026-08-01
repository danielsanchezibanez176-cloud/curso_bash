/* ============================================================
   missionEvaluator.js — Evaluador automático de misiones
   Detecta si el estudiante completó un objetivo en la terminal
   ============================================================ */

import { getFS } from './filesystem.js'

/**
 * Tipos de condición que puede tener una misión:
 *
 * { type: 'command_executed', command: 'mkdir' }
 *   → Se ejecutó el comando 'mkdir' (cualquier variación)
 *
 * { type: 'path_exists', path: '/home/estudiante/laboratorios/lab1' }
 *   → Existe el archivo o directorio en esa ruta
 *
 * { type: 'dir_exists', path: '/home/estudiante/proyectos/empresa' }
 *   → Existe un directorio en esa ruta
 *
 * { type: 'file_exists', path: '/home/estudiante/documentos/nota.txt' }
 *   → Existe un archivo en esa ruta
 *
 * { type: 'file_contains', path: '...', pattern: 'texto' }
 *   → El archivo existe y contiene ese texto
 *
 * { type: 'command_with_flag', command: 'ls', flag: '-la' }
 *   → Se ejecutó 'ls' incluyendo la flag '-la'
 *
 * { type: 'cwd_is', path: '/home/estudiante/scripts' }
 *   → El directorio actual es exactamente ese
 *
 * { type: 'permission_set', path: '...', permission: '755' }
 *   → El archivo tiene esos permisos
 *
 * { type: 'any_of', conditions: [...] }
 *   → Al menos una de las condiciones se cumple
 *
 * { type: 'all_of', conditions: [...] }
 *   → Todas las condiciones se cumplen
 */

// ─── Evaluador principal ─────────────────────────────────────

/**
 * Evalúa si una misión está completada.
 * @param {object} mission  — objeto misión del courseData
 * @param {object} context  — { lastCommand, lastArgs, output }
 * @returns {boolean}
 */
export function evaluateMission(mission, context = {}) {
  if (!mission || !mission.condition) return false
  return checkCondition(mission.condition, context)
}

/**
 * Evalúa una lista de misiones del día y devuelve cuáles
 * se acaban de completar (no estaban completadas antes).
 *
 * @param {array}  missions          — misiones del día
 * @param {array}  alreadyDone       — IDs ya completados
 * @param {object} context           — contexto del último comando
 * @returns {array} — IDs de misiones recién completadas
 */
export function evaluateAllMissions(missions, alreadyDone = [], context = {}) {
  if (!missions || !missions.length) return []
  return missions
    .filter(m => !alreadyDone.includes(m.id))
    .filter(m => evaluateMission(m, context))
    .map(m => m.id)
}

// ─── Evaluador de condición recursivo ───────────────────────

function checkCondition(condition, context) {
  const fs = getFS()

  switch (condition.type) {

    case 'command_executed': {
      if (!context.lastCommand) return false
      const cmd = normalizeCommand(context.lastCommand)
      const expected = normalizeCommand(condition.command)
      return cmd === expected || cmd.startsWith(expected + ' ')
    }

    case 'command_with_flag': {
      if (!context.lastCommand) return false
      const [command] = normalizeCommand(context.lastCommand).split(' ')
      return command === condition.command.toLowerCase() && context.lastCommand.includes(condition.flag)
    }

    case 'command_matches': {
      // Regex contra el comando completo
      if (!context.lastCommand) return false
      const re = new RegExp(condition.pattern, 'i')
      return re.test(context.lastCommand)
    }

    case 'path_exists': {
      const abs  = fs.resolvePath(condition.path)
      const node = fs.getNode(abs)
      return node !== null
    }

    case 'dir_exists': {
      const abs  = fs.resolvePath(condition.path)
      const node = fs.getNode(abs)
      return node !== null && node.type === 'dir'
    }

    case 'file_exists': {
      const abs  = fs.resolvePath(condition.path)
      const node = fs.getNode(abs)
      return node !== null && node.type === 'file'
    }

    case 'file_contains': {
      const abs  = fs.resolvePath(condition.path)
      const node = fs.getNode(abs)
      if (!node || node.type !== 'file') return false
      return (node.content || '').includes(condition.pattern)
    }

    case 'file_not_exists': {
      const abs  = fs.resolvePath(condition.path)
      const node = fs.getNode(abs)
      return node === null
    }

    case 'cwd_is': {
      const target = fs.resolvePath(condition.path)
      return fs.cwd === target
    }

    case 'cwd_starts_with': {
      return fs.cwd.startsWith(condition.path)
    }

    case 'permission_set': {
      const abs  = fs.resolvePath(condition.path)
      const node = fs.getNode(abs)
      if (!node) return false
      const symbolic = (node.permissions || '').slice(1, 10)
      if (symbolic.length !== 9) return false
      const octal = symbolic.match(/.{3}/g)
        .map(group =>
          (group[0] === 'r' ? 4 : 0) +
          (group[1] === 'w' ? 2 : 0) +
          (group[2] === 'x' ? 1 : 0)
        )
        .join('')
      return octal === String(condition.permission)
    }

    case 'output_contains': {
      // El último output de la terminal contiene un texto
      if (!context.lastOutput) return false
      return context.lastOutput.includes(condition.text)
    }

    case 'any_of': {
      return (condition.conditions || []).some(c => checkCondition(c, context))
    }

    case 'all_of': {
      return (condition.conditions || []).every(c => checkCondition(c, context))
    }

    case 'multiple_dirs_exist': {
      // Verifica que existan N directorios de una lista
      const paths = condition.paths || []
      return paths.every(p => {
        const abs  = fs.resolvePath(p)
        const node = fs.getNode(abs)
        return node && node.type === 'dir'
      })
    }

    case 'file_count_in': {
      // Verifica cuántos archivos hay en un directorio
      const abs  = fs.resolvePath(condition.path)
      const node = fs.getNode(abs)
      if (!node || node.type !== 'dir') return false
      const count = Object.values(node.children || {}).filter(n => n.type === 'file').length
      return count >= (condition.min || 1)
    }

    case 'always': {
      return true
    }

    default:
      return false
  }
}

function normalizeCommand(command) {
  return String(command).toLowerCase().trim().replace(/\s+/g, ' ')
}

// ─── Helpers para courseData ─────────────────────────────────

/** Construir condición: ejecutar un comando */
export function condCmd(command) {
  return { type: 'command_executed', command }
}

/** Construir condición: directorio existe */
export function condDir(path) {
  return { type: 'dir_exists', path }
}

/** Construir condición: archivo existe */
export function condFile(path) {
  return { type: 'file_exists', path }
}

/** Construir condición: archivo contiene texto */
export function condContains(path, pattern) {
  return { type: 'file_contains', path, pattern }
}

/** Construir condición: cwd es exactamente una ruta */
export function condCwd(path) {
  return { type: 'cwd_is', path }
}

/** Construir condición: comando con flag específica */
export function condFlag(command, flag) {
  return { type: 'command_with_flag', command, flag }
}

/** Construir condición: cualquiera de varias */
export function condAny(...conditions) {
  return { type: 'any_of', conditions }
}

/** Construir condición: todas */
export function condAll(...conditions) {
  return { type: 'all_of', conditions }
}
