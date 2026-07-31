/* ============================================================
   commandEngine.js — Intérprete completo de comandos Linux
   Procesa la entrada del usuario y devuelve tokens de salida
   ============================================================ */

import { getFS, NODE_TYPE }        from './filesystem.js'
import { getTerminalHistory }       from './storage.js'

// Tipos de línea de salida (para colorear)
export const OUT = {
  TEXT:    'text',
  SUCCESS: 'success',
  ERROR:   'error',
  INFO:    'info',
  WARNING: 'warning',
  SYSTEM:  'system',
  DIR:     'dir',
  FILE:    'file',
  PROMPT:  'prompt',
}

// ─── Utilidades de formato ───────────────────────────────────

function line(text, type = OUT.TEXT) {
  return { text, type }
}

function formatSize(bytes) {
  if (bytes < 1024)       return `${bytes}`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`
  return `${(bytes / (1024 * 1024)).toFixed(1)}M`
}

function formatLsLong(node, name) {
  const perm  = node.permissions || '-rw-r--r--'
  const owner = (node.owner  || 'estudiante').padEnd(10)
  const group = (node.group  || 'estudiante').padEnd(10)
  const size  = formatSize(node.size || 0).padStart(6)
  const mod   = (node.modified || 'Jan  1 00:00').padEnd(14)
  return `${perm} 1 ${owner} ${group} ${size} ${mod} ${name}`
}

// Parsear flags simples: '-la' → { l: true, a: true }
function parseFlags(args) {
  const flags = {}
  const rest  = []
  for (const arg of args) {
    if (arg.startsWith('-') && arg.length > 1 && !arg.startsWith('--')) {
      for (const c of arg.slice(1)) flags[c] = true
    } else {
      rest.push(arg)
    }
  }
  return { flags, rest }
}

// Parsear redirección: echo "hola" > archivo.txt
function parseRedirection(tokens) {
  const appendIdx  = tokens.indexOf('>>')
  const redirectIdx = tokens.indexOf('>')
  if (appendIdx !== -1) {
    return { cmd: tokens.slice(0, appendIdx), dest: tokens[appendIdx + 1], append: true }
  }
  if (redirectIdx !== -1) {
    return { cmd: tokens.slice(0, redirectIdx), dest: tokens[redirectIdx + 1], append: false }
  }
  return { cmd: tokens, dest: null, append: false }
}

// ─── Motor principal ─────────────────────────────────────────

export function executeCommand(raw) {
  const fs      = getFS()
  const trimmed = raw.trim()
  if (!trimmed) return []

  const chained = trimmed.split(/\s*&&\s*/).filter(Boolean)
  if (chained.length > 1) {
    return chained.flatMap(command => executeCommand(command))
  }

  // Separar por pipe (soporte básico: cmd1 | cmd2)
  const pipes = trimmed.split('|').map(s => s.trim())
  if (pipes.length > 1) {
    return handlePipe(pipes, fs)
  }

  // Parsear redirección
  const tokens = tokenize(trimmed)
  const { cmd: cmdTokens, dest, append } = parseRedirection(tokens)
  const [command, ...rawArgs] = cmdTokens

  // Ejecutar y posiblemente redirigir. Un fallo interno nunca debe dejar
  // la terminal sin respuesta.
  let output
  try {
    output = dispatch(command, rawArgs, fs)
  } catch (error) {
    console.error('Error interno del simulador de terminal:', error)
    return [
      line(`terminal: error interno al ejecutar '${command}'`, OUT.ERROR),
      line('Intenta nuevamente o usa help para consultar los comandos disponibles.', OUT.SYSTEM),
    ]
  }

  if (dest) {
    const text = output.filter(l => l.type === OUT.TEXT || l.type === OUT.SUCCESS).map(l => l.text).join('\n')
    const result = fs.writeFile(dest, text, append)
    if (result.error) return [line(result.error, OUT.ERROR)]
    return [] // sin output en pantalla
  }

  return output
}

// Tokenizar respetando comillas
function tokenize(input) {
  const tokens = []
  let current  = ''
  let inSingle = false
  let inDouble = false

  for (const ch of input) {
    if (ch === "'" && !inDouble) { inSingle = !inSingle; continue }
    if (ch === '"' && !inSingle) { inDouble = !inDouble; continue }
    if (ch === ' ' && !inSingle && !inDouble) {
      if (current) { tokens.push(current); current = '' }
      continue
    }
    current += ch
  }
  if (current) tokens.push(current)
  return tokens
}

function handlePipe(pipes, fs) {
  // Solo implementamos el caso más común: cmd | grep
  const [first, ...rest] = pipes
  const firstOut  = executeCommand(first)
  let   piped     = firstOut.map(l => l.text).join('\n')

  for (const cmd of rest) {
    const tokens  = tokenize(cmd)
    const [name, ...args] = tokens
    if (name === 'grep') {
      const { flags, rest: gArgs } = parseFlags(args)
      const pattern = gArgs[0] || ''
      const lines   = piped.split('\n')
      const regex   = new RegExp(pattern, flags.i ? 'i' : '')
      const matched = lines.filter(l => regex.test(l))
      piped = matched.join('\n')
    } else if (name === 'wc') {
      const { flags } = parseFlags(args)
      if (flags.l) piped = String(piped.split('\n').filter(Boolean).length)
      else         piped = String(piped.split(/\s+/).filter(Boolean).length)
    } else if (name === 'sort') {
      piped = piped.split('\n').filter(Boolean).sort().join('\n')
    } else if (name === 'head') {
      const { flags, rest: hArgs } = parseFlags(args)
      const n = parseInt(hArgs[0]) || 10
      piped = piped.split('\n').slice(0, n).join('\n')
    } else if (name === 'tail') {
      const { flags, rest: tArgs } = parseFlags(args)
      const n = parseInt(tArgs[0]) || 10
      piped = piped.split('\n').slice(-n).join('\n')
    }
  }

  return piped.split('\n').filter(l => l !== undefined).map(l => line(l))
}

// Despachar al handler correcto
function dispatch(command, args, fs) {
  // Alias
  const aliases = { ll: () => lsCmd(['-la', ...args], fs), la: () => lsCmd(['-a', ...args], fs) }
  if (aliases[command]) return aliases[command]()

  switch (command) {
    case 'pwd':     return pwdCmd(args, fs)
    case 'ls':      return lsCmd(args, fs)
    case 'cd':      return cdCmd(args, fs)
    case 'mkdir':   return mkdirCmd(args, fs)
    case 'touch':   return touchCmd(args, fs)
    case 'cp':      return cpCmd(args, fs)
    case 'mv':      return mvCmd(args, fs)
    case 'rm':      return rmCmd(args, fs)
    case 'cat':     return catCmd(args, fs)
    case 'echo':    return echoCmd(args, fs)
    case 'grep':    return grepCmd(args, fs)
    case 'find':    return findCmd(args, fs)
    case 'chmod':   return chmodCmd(args, fs)
    case 'chown':   return chownCmd(args, fs)
    case 'whoami':  return whoamiCmd(args, fs)
    case 'uname':   return unameCmd(args, fs)
    case 'ps':      return psCmd(args, fs)
    case 'top':     return topCmd(args, fs)
    case 'df':      return dfCmd(args, fs)
    case 'du':      return duCmd(args, fs)
    case 'date':    return dateCmd(args, fs)
    case 'history': return historyCmd(args, fs)
    case 'clear':   return [{ type: 'clear' }]
    case 'help':    return helpCmd(args, fs)
    case 'man':     return manCmd(args, fs)
    case 'exit':    return [line('Para salir del curso, cierra la pestaña del navegador.', OUT.INFO)]
    case 'll':      return lsCmd(['-la', ...args], fs)
    case 'la':      return lsCmd(['-a',  ...args], fs)
    case 'cls':     return [{ type: 'clear' }]
    case 'ping':    return pingCmd(args, fs)
    case 'curl':    return curlCmd(args, fs)
    case 'ssh':     return sshCmd(args, fs)
    case 'scp':     return transferCmd('scp', args)
    case 'rsync':   return transferCmd('rsync', args)
    case 'ssh-keygen': return sshKeygenCmd(args, fs)
    case 'ssh-copy-id': return [line('[simulador] Clave pública copiada al servidor remoto.', OUT.SUCCESS)]
    case 'sudo':    return sudoCmd(args, fs)
    case 'apt':     return aptCmd(args, fs)
    case 'nano':    return nanoCmd(args, fs)
    case 'vim':
    case 'vi':      return [line('vim: editor de texto avanzado. Usa nano para esta práctica.', OUT.INFO), line('Tip: nano archivo.txt — abre el editor nano.', OUT.SYSTEM)]
    case 'bash':    return bashCmd(args, fs)
    case 'sh':      return [line('[simulador] Ejecutando script...', OUT.INFO)]
    case 'source':
    case '.':       return sourceCmd(args, fs)
    case 'which':   return whichCmd(args, fs)
    case 'env':     return envCmd(args, fs)
    case 'export':  return exportCmd(args, fs)
    case 'printenv':return printenvCmd(args, fs)
    case 'alias':   return [line('alias ll=\'ls -la\'', OUT.TEXT), line('alias la=\'ls -a\'', OUT.TEXT), line('alias cls=\'clear\'', OUT.TEXT)]
    case 'wc':      return wcCmd(args, fs)
    case 'head':    return headCmd(args, fs)
    case 'tail':    return tailCmd(args, fs)
    case 'sort':    return sortCmd(args, fs)
    case 'uniq':    return uniqCmd(args, fs)
    case 'cut':     return cutCmd(args, fs)
    case 'tr':      return trCmd(args, fs)
    case 'sed':     return sedCmd(args, fs)
    case 'awk':     return awkCmd(args, fs)
    case 'stat':    return statCmd(args, fs)
    case 'file':    return fileCmd(args, fs)
    case 'less':
    case 'more':    return catCmd(args, fs) // redirigir a cat
    case 'tree':    return treeCmd(args, fs)
    case 'id':      return idCmd(args, fs)
    case 'groups':  return [line('estudiante adm sudo', OUT.TEXT)]
    case 'passwd':  return [line('[simulador] Cambio de contraseña no disponible en modo simulado.', OUT.WARNING)]
    case 'useradd': return [line('[simulador] useradd requiere privilegios root.', OUT.WARNING)]
    case 'netstat':
    case 'ss':      return ssCmd(args, fs)
    case 'ifconfig':
    case 'ip':      return ipCmd(args, fs)
    case 'nmap':    return [line('[simulador] nmap — escáner de red.', OUT.INFO), line('Uso real: nmap -sV 192.168.1.0/24', OUT.TEXT)]
    case 'systemctl': return systemctlCmd(args, fs)
    case 'service': return serviceCmd(args, fs)
    case 'journalctl': return [line('-- Logs del sistema (simulado) --', OUT.INFO), line('Jan 15 10:00:01 linux-academy systemd[1]: Started Session 1.', OUT.TEXT)]
    case 'last':    return lastCmd(false)
    case 'lastb':   return lastCmd(true)
    case 'who':     return [line('estudiante pts/0  2026-07-28 20:15 (:0)', OUT.TEXT)]
    case 'w':       return [line('20:15:00 up 2:15, 1 user, load average: 0.15, 0.08, 0.03', OUT.TEXT), line('estudiante pts/0 :0 20:15 0.00s bash', OUT.TEXT)]
    case 'crontab': return crontabCmd(args, fs)
    case 'at':      return [line('[simulador] at — programar tarea. Uso: at 15:00', OUT.INFO)]
    case 'tar':     return tarCmd(args, fs)
    case 'gzip':
    case 'gunzip':  return [line(`[simulador] ${command}: compresión simulada completada.`, OUT.SUCCESS)]
    case 'zip':
    case 'unzip':   return [line(`[simulador] ${command}: operación simulada completada.`, OUT.SUCCESS)]
    case 'ln':      return lnCmd(args, fs)
    case 'mount':   return [line('/dev/sda1 on / type ext4 (rw,relatime)', OUT.TEXT), line('tmpfs on /tmp type tmpfs (rw,nosuid,nodev)', OUT.TEXT)]
    case 'free':    return freeCmd(args, fs)
    case 'uptime':  return [line('10:23:45 up 2:15, 1 user, load average: 0.15, 0.08, 0.03', OUT.TEXT)]
    case 'lsof':    return [line('[simulador] lsof — archivos abiertos por procesos.', OUT.INFO)]
    case 'sha256sum': return sha256sumCmd(args, fs)
    case 'md5sum':  return [line('[simulador] MD5 calculado. Para seguridad usa sha256sum.', OUT.WARNING)]
    case 'ufw':     return ufwCmd(args)
    case 'iptables':
    case 'iptables-save': return iptablesCmd(command, args)
    case 'strace':  return [line('[simulador] strace — trazador de llamadas al sistema.', OUT.INFO)]
    case 'kill':    return killCmd(args, fs)
    case 'pkill':   return [line('[simulador] Proceso terminado.', OUT.SUCCESS)]
    case 'jobs':    return [line('[simulador] No hay trabajos en background.', OUT.TEXT)]
    case 'bg':
    case 'fg':      return [line(`[simulador] ${command}: gestión de procesos en background.`, OUT.INFO)]
    case 'nohup':   return [line('[simulador] Proceso ejecutado con nohup.', OUT.SUCCESS)]
    case 'screen':
    case 'tmux':    return [line(`[simulador] ${command}: multiplexor de terminal. No disponible en modo simulado.`, OUT.WARNING)]
    case 'bc':      return [line('[simulador] Calculadora bc. Uso: echo "2+2" | bc', OUT.INFO)]
    case 'xargs':   return [line('[simulador] xargs: ejecuta comandos desde stdin.', OUT.INFO)]
    case 'for':     return [line('[simulador] Bucle for reconocido y ejecutado.', OUT.SUCCESS)]
    case 'while':   return [line('[simulador] Bucle while reconocido; limitado para evitar ciclos infinitos.', OUT.WARNING)]
    case 'if':      return [line('[simulador] Estructura condicional reconocida.', OUT.SUCCESS)]
    case 'function':return [line('[simulador] Función Bash definida.', OUT.SUCCESS)]
    default:
      if (command.startsWith('./')) return scriptCmd(command, args, fs)
      if (/^[a-zA-Z_][\w-]*\(\)$/.test(command)) return [line(`[simulador] Función '${command.slice(0, -2)}' definida.`, OUT.SUCCESS)]
      return [line(`${command}: command not found`, OUT.ERROR), line(`Escribe 'help' para ver los comandos disponibles.`, OUT.SYSTEM)]
  }
}

// ─── Implementación de comandos ──────────────────────────────

function pwdCmd(args, fs) {
  return [line(fs.cwd, OUT.TEXT)]
}

function lsCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  const showHidden = flags.a || flags.A
  const longFmt    = flags.l
  const path       = rest[0] || fs.cwd
  const absPath    = fs.resolvePath(path)
  const result     = fs.listDir(absPath, showHidden)

  if (result.error) return [line(result.error, OUT.ERROR)]
  if (result.entries.length === 0) return []

  if (longFmt) {
    const lines = [line(`total ${result.entries.length}`, OUT.TEXT)]
    for (const node of result.entries) {
      const formatted = formatLsLong(node, node.name)
      const type = node.type === NODE_TYPE.DIR ? OUT.DIR : (node.permissions?.includes('x') ? OUT.FILE : OUT.TEXT)
      lines.push({ text: formatted, type, isDir: node.type === NODE_TYPE.DIR })
    }
    return lines
  }

  // Formato corto: columnas
  const names = result.entries.map(n => ({
    text: n.name + (n.type === NODE_TYPE.DIR ? '/' : ''),
    type: n.type === NODE_TYPE.DIR ? OUT.DIR : OUT.TEXT,
    isDir: n.type === NODE_TYPE.DIR,
  }))
  return names.length ? [{ type: 'ls_grid', items: names }] : []
}

function cdCmd(args, fs) {
  const path   = args[0] || '~'
  const result = fs.changeDir(path)
  if (result.error) return [line(result.error, OUT.ERROR)]
  return []
}

function mkdirCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('mkdir: missing operand', OUT.ERROR)]
  const results = []
  for (const path of rest) {
    const r = flags.p ? fs.makeDir(path, true) : fs.makeDir(path)
    if (r.error) results.push(line(r.error, OUT.ERROR))
  }
  return results
}

function touchCmd(args, fs) {
  if (!args.length) return [line('touch: missing file operand', OUT.ERROR)]
  const results = []
  for (const path of args) {
    const r = fs.touchFile(path)
    if (r.error) results.push(line(r.error, OUT.ERROR))
  }
  return results
}

function cpCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (rest.length < 2) return [line('cp: missing destination file operand', OUT.ERROR)]
  const [src, dest] = rest
  const r = fs.copy(src, dest)
  return r.error ? [line(r.error, OUT.ERROR)] : []
}

function mvCmd(args, fs) {
  if (args.length < 2) return [line('mv: missing destination file operand', OUT.ERROR)]
  const [src, dest] = args
  const r = fs.move(src, dest)
  return r.error ? [line(r.error, OUT.ERROR)] : []
}

function rmCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('rm: missing operand', OUT.ERROR)]
  const results = []
  for (const path of rest) {
    const r = fs.remove(path, flags.r || flags.R)
    if (r.error) results.push(line(r.error, OUT.ERROR))
  }
  return results
}

function catCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('cat: Esperando entrada (Ctrl+C para cancelar)', OUT.INFO)]
  const results = []
  for (const path of rest) {
    const r = fs.readFile(path)
    if (r.error) { results.push(line(r.error, OUT.ERROR)); continue }
    const lines = r.content.split('\n')
    lines.forEach((l, i) => {
      if (flags.n) results.push(line(`${String(i + 1).padStart(6)}\t${l}`, OUT.TEXT))
      else         results.push(line(l, OUT.TEXT))
    })
  }
  return results
}

function echoCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  const text = rest.join(' ')
    .replace(/\$USER/g, 'estudiante')
    .replace(/\$HOME/g, '/home/estudiante')
    .replace(/\$PWD/g, fs.cwd)
    .replace(/\$HOSTNAME/g, 'linux-academy')
    .replace(/\$SHELL/g, '/bin/bash')
    .replace(/\$PATH/g, '/home/estudiante/scripts:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin')
    .replace(/\$\?/g, '0')
    .replace(/\$RANDOM/g, String(Math.floor(Math.random() * 32767)))
  if (flags.e) {
    return [line(text.replace(/\\n/g, '\n').replace(/\\t/g, '\t'), OUT.TEXT)]
  }
  return [line(text, OUT.TEXT)]
}

function grepCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('grep: Falta el patrón de búsqueda', OUT.ERROR)]
  const [pattern, ...paths] = rest
  if (!paths.length) return [line('grep: Falta el archivo', OUT.ERROR)]

  const results = []
  for (const path of paths) {
    const r = fs.grep(pattern, path, { ignoreCase: flags.i })
    if (r.error) { results.push(line(r.error, OUT.ERROR)); continue }
    for (const { line: l, num } of r.matches) {
      const prefix = paths.length > 1 ? `${path}:` : ''
      const numStr = flags.n ? `${num}:` : ''
      results.push(line(`${prefix}${numStr}${l}`, OUT.SUCCESS))
    }
  }
  if (!results.length) return []
  return results
}

function findCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  let startPath = '.'
  const opts = {}
  let i = 0
  while (i < rest.length) {
    if (rest[i] === '-name')  { opts.name = rest[++i]; i++; continue }
    if (rest[i] === '-type')  { opts.type = rest[++i]; i++; continue }
    startPath = rest[i]; i++
  }
  const r = fs.find(startPath, opts)
  if (r.error) return [line(r.error, OUT.ERROR)]
  return r.results.map(p => line(p, OUT.TEXT))
}

function chmodCmd(args, fs) {
  const { rest } = parseFlags(args)
  if (rest.length < 2) return [line('chmod: missing operand', OUT.ERROR)]
  const [mode, path] = rest
  const r = fs.chmod(mode, path)
  return r.error ? [line(r.error, OUT.ERROR)] : [line(`Permisos de '${path}' cambiados a ${mode}`, OUT.SUCCESS)]
}

function chownCmd(args, fs) {
  const { rest } = parseFlags(args)
  if (rest.length < 2) return [line('chown: missing operand', OUT.ERROR)]
  const [owner, path] = rest
  const abs = fs.resolvePath(path)
  const node = fs.getNode(abs)
  if (!node) return [line(`chown: cannot access '${path}': No such file or directory`, OUT.ERROR)]
  const [user, group] = owner.split(':')
  node.owner = user
  if (group) node.group = group
  fs.save()
  return [line(`Propietario de '${path}' cambiado a ${owner}`, OUT.SUCCESS)]
}

function whoamiCmd(args, fs) {
  return [line('estudiante', OUT.TEXT)]
}

function unameCmd(args, fs) {
  const { flags } = parseFlags(args)
  if (flags.a) return [line('Linux linux-academy 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux', OUT.TEXT)]
  if (flags.r) return [line('5.15.0-91-generic', OUT.TEXT)]
  if (flags.n) return [line('linux-academy', OUT.TEXT)]
  return [line('Linux', OUT.TEXT)]
}

function psCmd(args, fs) {
  const { flags } = parseFlags(args)
  const header = line('  PID TTY          TIME CMD', OUT.TEXT)
  const procs = [
    line('  891 pts/0    00:00:00 bash', OUT.TEXT),
    line(' 1042 pts/0    00:00:00 ps', OUT.TEXT),
  ]
  if (flags.a || flags.u || flags.x) {
    return [
      line('  PID USER       %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND', OUT.TEXT),
      line('    1 root        0.0  0.1  16952  3040 ?        Ss   10:00   0:01 /sbin/init', OUT.TEXT),
      line('  721 root        0.0  0.0   7396  2156 ?        Ss   10:00   0:00 /usr/sbin/cron', OUT.TEXT),
      line('  892 root        0.0  0.1  15432  4928 ?        Ss   10:00   0:00 sshd: /usr/sbin/sshd', OUT.TEXT),
      line(' 1000 estudia     0.1  0.3  24032  8400 pts/0    Ss   10:01   0:00 -bash', OUT.TEXT),
      line(' 1234 estudia     0.0  0.1   9152  3200 pts/0    R+   10:23   0:00 ps aux', OUT.TEXT),
    ]
  }
  return [header, ...procs]
}

function topCmd(args, fs) {
  return [
    line('top - 10:23:45 up 2:15,  1 user,  load average: 0.15, 0.08, 0.03', OUT.INFO),
    line('Tasks:  95 total,   1 running,  94 sleeping,   0 stopped,   0 zombie', OUT.TEXT),
    line('%Cpu(s):  1.2 us,  0.3 sy,  0.0 ni, 98.4 id,  0.1 wa,  0.0 hi,  0.0 si', OUT.TEXT),
    line('MiB Mem :   3936.0 total,   2100.4 free,    812.8 used,   1022.8 buff/cache', OUT.TEXT),
    line('', OUT.TEXT),
    line('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND', OUT.TEXT),
    line(' 1000 estudia   20   0   24032   8400   6200 S   0.3   0.2   0:00.45 bash', OUT.TEXT),
    line('  721 root      20   0    7396   2156   1984 S   0.0   0.1   0:00.02 cron', OUT.TEXT),
    line('[simulador] Modo interactivo no disponible. Mostrando snapshot.', OUT.SYSTEM),
  ]
}

function dfCmd(args, fs) {
  const { flags } = parseFlags(args)
  return [
    line('Filesystem      Size  Used Avail Use% Mounted on', OUT.TEXT),
    line('/dev/sda1        20G  4.2G   15G  23% /', OUT.TEXT),
    line('tmpfs           1.9G     0  1.9G   0% /dev/shm', OUT.TEXT),
    line('tmpfs           393M  1.4M  392M   1% /run', OUT.TEXT),
    line('/dev/sda2       512M   48M  464M  10% /boot', OUT.TEXT),
  ]
}

function duCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  const path    = rest[0] || '.'
  const absPath = fs.resolvePath(path)
  const node    = fs.getNode(absPath)
  if (!node) return [line(`du: cannot access '${path}': No such file or directory`, OUT.ERROR)]
  const size = Math.max(4, Math.ceil(fs.getDirSize(node) / 1024))
  if (flags.h) return [line(`${size}K\t${path}`, OUT.TEXT)]
  return [line(`${size}\t${path}`, OUT.TEXT)]
}

function dateCmd(args, fs) {
  return [line(new Date().toString(), OUT.TEXT)]
}

function historyCmd(args, fs) {
  const hist = getTerminalHistory()
  if (!hist.length) return [line('(sin historial)', OUT.SYSTEM)]
  return hist.slice(-20).map((cmd, i) => line(`${String(i + 1).padStart(4)}  ${cmd}`, OUT.TEXT))
}

function pingCmd(args, fs) {
  const host = args[0] || 'localhost'
  return [
    line(`PING ${host}: 56 data bytes`, OUT.TEXT),
    line(`64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.123 ms`, OUT.SUCCESS),
    line(`64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.115 ms`, OUT.SUCCESS),
    line(`64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.118 ms`, OUT.SUCCESS),
    line(`--- ${host} ping statistics ---`, OUT.TEXT),
    line('3 packets transmitted, 3 received, 0% packet loss', OUT.SUCCESS),
    line('[simulador] Ping completado.', OUT.SYSTEM),
  ]
}

function curlCmd(args, fs) {
  const url = args.find(a => !a.startsWith('-')) || ''
  return [
    line(`[simulador] curl — cliente HTTP`, OUT.INFO),
    line(`Conectando con ${url || 'URL no especificada'}...`, OUT.TEXT),
    line('HTTP/1.1 200 OK', OUT.SUCCESS),
    line('Content-Type: text/html; charset=utf-8', OUT.TEXT),
    line('[simulador] Respuesta recibida. En entorno real verías el contenido completo.', OUT.SYSTEM),
  ]
}

function sshCmd(args, fs) {
  const host = args.find(a => !a.startsWith('-')) || 'host'
  return [
    line(`[simulador] ssh — conexión segura a ${host}`, OUT.INFO),
    line('En un entorno real: ssh usuario@servidor', OUT.SYSTEM),
    line('Protocolo: SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6', OUT.TEXT),
    line('[simulador] Conexión SSH no disponible en modo simulado.', OUT.WARNING),
  ]
}

function transferCmd(command, args) {
  const paths = args.filter(arg => !arg.startsWith('-'))
  if (paths.length < 2) return [line(`${command}: faltan origen y destino`, OUT.ERROR)]
  return [
    line(`[simulador] ${paths[0]} → ${paths[1]}`, OUT.INFO),
    line(`${command}: operación completada de forma simulada.`, OUT.SUCCESS),
  ]
}

function sshKeygenCmd(args, fs) {
  const typeIndex = args.indexOf('-t')
  const keyType = typeIndex >= 0 ? args[typeIndex + 1] : 'ed25519'
  fs.makeDir('~/.ssh', true)
  fs.writeFile(`~/.ssh/id_${keyType}`, 'CLAVE-PRIVADA-SIMULADA')
  fs.writeFile(`~/.ssh/id_${keyType}.pub`, `ssh-${keyType} CLAVE-PUBLICA-SIMULADA estudiante@linux-academy`)
  return [
    line(`Generating public/private ${keyType} key pair.`, OUT.TEXT),
    line(`Public key saved in ~/.ssh/id_${keyType}.pub`, OUT.SUCCESS),
  ]
}

function bashCmd(args, fs) {
  const script = args.find(arg => !arg.startsWith('-'))
  if (!script) return [line('[simulador] Nueva sesión bash iniciada.', OUT.SUCCESS)]
  return scriptCmd(script, args.filter(arg => arg !== script), fs)
}

function scriptCmd(script, args, fs) {
  const result = fs.readFile(script)
  if (result.error) return [line(`bash: ${script}: No such file or directory`, OUT.ERROR)]
  return [
    line(`[simulador] Ejecutando ${script}${args.length ? ' ' + args.join(' ') : ''}`, OUT.INFO),
    line('Script finalizado con código de salida 0.', OUT.SUCCESS),
  ]
}

function sourceCmd(args, fs) {
  if (!args.length) return [line('source: falta el nombre del archivo', OUT.ERROR)]
  const result = fs.readFile(args[0])
  if (result.error) return [line(result.error.replace('cat:', 'source:'), OUT.ERROR)]
  return [line(`[simulador] ${args[0]} cargado en el entorno actual.`, OUT.SUCCESS)]
}

function lastCmd(failed) {
  return failed
    ? [line('admin ssh:notty 192.168.1.200 Tue Jul 28 19:42 (00:00)', OUT.WARNING), line('btmp begins Tue Jul 28 19:42:00 2026', OUT.SYSTEM)]
    : [line('estudiante pts/0 :0 Tue Jul 28 20:15 still logged in', OUT.TEXT), line('wtmp begins Tue Jul 28 20:15:00 2026', OUT.SYSTEM)]
}

function sha256sumCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('sha256sum: falta el operando', OUT.ERROR)]
  if (flags.c) return [line(`${rest[0]}: OK`, OUT.SUCCESS)]
  return rest.map(path => {
    const result = fs.readFile(path)
    if (result.error) return line(result.error.replace('cat:', 'sha256sum:'), OUT.ERROR)
    const seed = [...(result.content || path)].reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 2166136261)
    return line(`${seed.toString(16).padStart(8, '0').repeat(8)}  ${path}`, OUT.TEXT)
  })
}

function ufwCmd(args) {
  const action = args.join(' ') || 'status'
  if (action.startsWith('status')) return [
    line('Status: active', OUT.SUCCESS),
    line('22/tcp                     ALLOW       Anywhere', OUT.TEXT),
  ]
  return [line(`[simulador] ufw ${action}: regla aplicada.`, OUT.SUCCESS)]
}

function iptablesCmd(command, args) {
  if (command === 'iptables-save') return [line('*filter\n:INPUT DROP [0:0]\n-A INPUT -p tcp --dport 22 -j ACCEPT\nCOMMIT', OUT.TEXT)]
  if (!args.length || args.includes('-L')) return [
    line('Chain INPUT (policy DROP)', OUT.TEXT),
    line('ACCEPT tcp -- anywhere anywhere tcp dpt:22', OUT.SUCCESS),
  ]
  return [line(`[simulador] iptables ${args.join(' ')}: regla aplicada.`, OUT.SUCCESS)]
}

function sudoCmd(args, fs) {
  if (!args.length) return [line('sudo: Falta el comando', OUT.ERROR)]
  return [line(`[sudo] password for estudiante: `, OUT.WARNING), line('[simulador] sudo deshabilitado en modo seguro. Algunos comandos requieren privilegios root.', OUT.SYSTEM)]
}

function aptCmd(args, fs) {
  const sub = args[0] || ''
  const pkg = args[1] || 'paquete'
  if (sub === 'install')  return [line(`[simulador] apt install ${pkg}`, OUT.INFO), line('Leyendo lista de paquetes... Hecho', OUT.TEXT), line(`Paquete '${pkg}' instalado (simulado).`, OUT.SUCCESS)]
  if (sub === 'update')   return [line('[simulador] apt update — Actualizando índice de paquetes...', OUT.INFO), line('Hecho.', OUT.SUCCESS)]
  if (sub === 'list')     return [line('[simulador] bash/jammy,now 5.1-6ubuntu1 amd64 [instalado]', OUT.TEXT), line('vim/jammy 2:8.2.3995-1ubuntu2 amd64', OUT.TEXT)]
  return [line(`[simulador] apt ${sub || ''}`, OUT.INFO)]
}

function nanoCmd(args, fs) {
  return [line('[simulador] nano — editor de texto en terminal', OUT.INFO), line('En entorno real: nano archivo.txt abre el editor interactivo.', OUT.SYSTEM), line('Por ahora usa: echo "texto" > archivo.txt para escribir archivos.', OUT.TEXT)]
}

function whichCmd(args, fs) {
  const cmds = { bash: '/bin/bash', ls: '/bin/ls', cat: '/bin/cat', grep: '/bin/grep', find: '/usr/bin/find', chmod: '/bin/chmod', ssh: '/usr/bin/ssh', curl: '/usr/bin/curl' }
  if (!args.length) return [line('which: falta el comando', OUT.ERROR)]
  return args.map(cmd => cmds[cmd] ? line(cmds[cmd], OUT.TEXT) : line(`which: no se encontró '${cmd}'`, OUT.ERROR))
}

function envCmd(args, fs) {
  return [
    line('USER=estudiante', OUT.TEXT),
    line('HOME=/home/estudiante', OUT.TEXT),
    line('SHELL=/bin/bash', OUT.TEXT),
    line('PWD=' + fs.cwd, OUT.TEXT),
    line('HOSTNAME=linux-academy', OUT.TEXT),
    line('LANG=es_ES.UTF-8', OUT.TEXT),
    line('TERM=xterm-256color', OUT.TEXT),
    line('PATH=/home/estudiante/scripts:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', OUT.TEXT),
    line('EDITOR=nano', OUT.TEXT),
  ]
}

function exportCmd(args, fs) {
  if (!args.length) return envCmd([], fs)
  const [kv] = args
  return [line(`Variable exportada: ${kv}`, OUT.SUCCESS)]
}

function printenvCmd(args, fs) {
  const vars = { USER:'estudiante', HOME:'/home/estudiante', SHELL:'/bin/bash', PWD: fs.cwd, HOSTNAME:'linux-academy', LANG:'es_ES.UTF-8', PATH:'/usr/bin:/bin' }
  if (args.length) return args.map(k => vars[k] ? line(vars[k], OUT.TEXT) : []).flat()
  return Object.entries(vars).map(([k, v]) => line(`${k}=${v}`, OUT.TEXT))
}

function wcCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('wc: falta el operando', OUT.ERROR)]
  const path = rest[0]
  const r = fs.readFile(path)
  if (r.error) return [line(r.error, OUT.ERROR)]
  const lines = r.content.split('\n').length - 1
  const words = r.content.split(/\s+/).filter(Boolean).length
  const chars = r.content.length
  if (flags.l) return [line(`${lines} ${path}`, OUT.TEXT)]
  if (flags.w) return [line(`${words} ${path}`, OUT.TEXT)]
  if (flags.c) return [line(`${chars} ${path}`, OUT.TEXT)]
  return [line(`${lines} ${words} ${chars} ${path}`, OUT.TEXT)]
}

function headCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  const n    = parseInt(flags.n) || (rest.find(a => /^\d+$/.test(a)) ? parseInt(rest.find(a => /^\d+$/.test(a))) : 10)
  const path = rest.find(a => !/^\d+$/.test(a))
  if (!path) return [line('head: falta el operando', OUT.ERROR)]
  const r = fs.readFile(path)
  if (r.error) return [line(r.error, OUT.ERROR)]
  return r.content.split('\n').slice(0, n).map(l => line(l, OUT.TEXT))
}

function tailCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  const n    = 10
  const path = rest[0]
  if (!path) return [line('tail: falta el operando', OUT.ERROR)]
  const r = fs.readFile(path)
  if (r.error) return [line(r.error, OUT.ERROR)]
  return r.content.split('\n').slice(-n).map(l => line(l, OUT.TEXT))
}

function sortCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('sort: leyendo stdin (no soportado directamente, usa pipes)', OUT.INFO)]
  const r = fs.readFile(rest[0])
  if (r.error) return [line(r.error, OUT.ERROR)]
  const lines = r.content.split('\n').filter(Boolean)
  const sorted = flags.r ? lines.sort().reverse() : lines.sort()
  return sorted.map(l => line(l, OUT.TEXT))
}

function uniqCmd(args, fs) {
  const { rest } = parseFlags(args)
  if (!rest.length) return [line('uniq: falta el operando', OUT.ERROR)]
  const r = fs.readFile(rest[0])
  if (r.error) return [line(r.error, OUT.ERROR)]
  const uniq = r.content.split('\n').filter((v, i, a) => a.indexOf(v) === i)
  return uniq.map(l => line(l, OUT.TEXT))
}

function cutCmd(args, fs) {
  return [line('[simulador] cut — extrae columnas de texto', OUT.INFO), line('Uso: cut -d":" -f1 /etc/passwd', OUT.TEXT)]
}

function trCmd(args, fs) {
  return [line('[simulador] tr — traducir/eliminar caracteres', OUT.INFO), line('Uso: echo "HOLA" | tr A-Z a-z → hola', OUT.TEXT)]
}

function sedCmd(args, fs) {
  return [line('[simulador] sed — editor de flujos', OUT.INFO), line('Ejemplo: sed \'s/hola/adios/g\' archivo.txt', OUT.TEXT)]
}

function awkCmd(args, fs) {
  return [line('[simulador] awk — procesamiento de texto avanzado', OUT.INFO), line('Ejemplo: awk -F: \'{print $1}\' /etc/passwd', OUT.TEXT)]
}

function statCmd(args, fs) {
  if (!args.length) return [line('stat: falta el operando', OUT.ERROR)]
  const abs  = fs.resolvePath(args[0])
  const node = fs.getNode(abs)
  if (!node) return [line(`stat: cannot stat '${args[0]}': No such file or directory`, OUT.ERROR)]
  return [
    line(`  File: ${abs}`, OUT.TEXT),
    line(`  Size: ${node.size || 0}\t\tBlocks: ${Math.ceil((node.size||0)/512)}\t IO Block: 4096\t${node.type === NODE_TYPE.DIR ? 'directory' : 'regular file'}`, OUT.TEXT),
    line(`Device: 8h/8d\tInode: ${Math.floor(Math.random()*100000)}\tLinks: 1`, OUT.TEXT),
    line(`Access: (${node.permissions}/${node.permissions})\tUid: (1000/${node.owner})\tGid: (1000/${node.group})`, OUT.TEXT),
    line(`Modify: ${node.modified || 'Jan  1 00:00'}`, OUT.TEXT),
  ]
}

function fileCmd(args, fs) {
  if (!args.length) return [line('file: falta el operando', OUT.ERROR)]
  const abs  = fs.resolvePath(args[0])
  const node = fs.getNode(abs)
  if (!node) return [line(`file: cannot open '${args[0]}' (No such file or directory)`, OUT.ERROR)]
  const desc = node.type === NODE_TYPE.DIR ? 'directory' : node.name.endsWith('.sh') ? 'Bourne-Again shell script, ASCII text executable' : 'ASCII text'
  return [line(`${args[0]}: ${desc}`, OUT.TEXT)]
}

function treeCmd(args, fs) {
  const { rest } = parseFlags(args)
  const startPath = rest[0] || '.'
  const abs = fs.resolvePath(startPath)
  const node = fs.getNode(abs)
  if (!node) return [line(`tree: '${startPath}': No such file or directory`, OUT.ERROR)]
  const lines = [line(startPath, OUT.DIR)]
  let dirs = 0, files = 0
  function walk(n, prefix) {
    const entries = Object.values(n.children || {}).filter(c => !c.hidden)
    entries.forEach((child, i) => {
      const isLast   = i === entries.length - 1
      const connector = isLast ? '└── ' : '├── '
      const childPfx  = isLast ? '    ' : '│   '
      const isDir = child.type === NODE_TYPE.DIR
      lines.push({ text: prefix + connector + child.name + (isDir ? '/' : ''), type: isDir ? OUT.DIR : OUT.TEXT })
      if (isDir) { dirs++; walk(child, prefix + childPfx) } else files++
    })
  }
  walk(node, '')
  lines.push(line(`\n${dirs} directories, ${files} files`, OUT.SYSTEM))
  return lines
}

function idCmd(args, fs) {
  return [line('uid=1000(estudiante) gid=1000(estudiante) groups=1000(estudiante),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev)', OUT.TEXT)]
}

function ssCmd(args, fs) {
  return [
    line('Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port', OUT.TEXT),
    line('tcp    LISTEN  0       128     0.0.0.0:22         0.0.0.0:*', OUT.TEXT),
    line('tcp    ESTAB   0       0       192.168.1.105:22   192.168.1.100:52341', OUT.SUCCESS),
    line('tcp    LISTEN  0       128     127.0.0.1:631      0.0.0.0:*', OUT.TEXT),
  ]
}

function ipCmd(args, fs) {
  if (args[0] === 'a' || args[0] === 'addr' || args[0] === 'address') {
    return [
      line('1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue', OUT.TEXT),
      line('    inet 127.0.0.1/8 scope host lo', OUT.TEXT),
      line('2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast', OUT.TEXT),
      line('    inet 192.168.1.105/24 brd 192.168.1.255 scope global dynamic eth0', OUT.SUCCESS),
    ]
  }
  return [line('[simulador] ip — gestión de interfaces de red', OUT.INFO), line('Uso: ip addr, ip route, ip link', OUT.TEXT)]
}

function systemctlCmd(args, fs) {
  const sub = args[0] || 'status'
  const svc = args[1] || ''
  if (sub === 'status') return [
    line(`● ${svc || 'sistema'} - servicio Linux`, OUT.TEXT),
    line('   Loaded: loaded (/lib/systemd/system/ssh.service; enabled)', OUT.TEXT),
    line('   Active: active (running) since Tue 2024-01-15 10:00:01 UTC; 23min ago', OUT.SUCCESS),
  ]
  if (sub === 'start')   return [line(`[simulador] Iniciando ${svc}...`, OUT.SUCCESS)]
  if (sub === 'stop')    return [line(`[simulador] Deteniendo ${svc}...`, OUT.SUCCESS)]
  if (sub === 'restart') return [line(`[simulador] Reiniciando ${svc}...`, OUT.SUCCESS)]
  if (sub === 'enable')  return [line(`[simulador] ${svc} habilitado en arranque.`, OUT.SUCCESS)]
  if (sub === 'list-units') return [
    line('UNIT                          LOAD   ACTIVE SUB     DESCRIPTION', OUT.TEXT),
    line('cron.service                  loaded active running Regular background program', OUT.SUCCESS),
    line('ssh.service                   loaded active running OpenBSD Secure Shell server', OUT.SUCCESS),
    line('systemd-journald.service      loaded active running Journal Service', OUT.SUCCESS),
  ]
  return [line(`[simulador] systemctl ${sub} ${svc}`, OUT.INFO)]
}

function serviceCmd(args, fs) {
  const [svc, action] = args
  return [line(`[simulador] service ${svc} ${action} — use systemctl en sistemas modernos.`, OUT.INFO)]
}

function crontabCmd(args, fs) {
  const { flags } = parseFlags(args)
  if (flags.l) return [
    line('# Crontab del usuario estudiante', OUT.SYSTEM),
    line('# MIN HORA DIA MES DIASEMANA COMANDO', OUT.SYSTEM),
    line('0 2 * * * /home/estudiante/scripts/backup.sh', OUT.TEXT),
    line('*/5 * * * * /home/estudiante/scripts/monitoreo.sh >> /tmp/monitor.log', OUT.TEXT),
  ]
  if (flags.e) return [line('[simulador] Editor de crontab. Usa -l para listar.', OUT.INFO)]
  return [line('Uso: crontab -l (listar) | -e (editar) | -r (eliminar)', OUT.TEXT)]
}

function tarCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  const action = flags.c ? 'Creando' : flags.x ? 'Extrayendo' : flags.t ? 'Listando' : 'Procesando'
  const file   = rest[0] || 'archivo.tar'
  return [
    line(`${action} ${file}...`, OUT.INFO),
    flags.v ? line(`${rest.slice(1).join(' ') || 'archivos'}`, OUT.TEXT) : null,
    line(`[simulador] tar completado.`, OUT.SUCCESS),
  ].filter(Boolean)
}

function lnCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (rest.length < 2) return [line('ln: falta el operando de destino', OUT.ERROR)]
  return [line(`Enlace ${flags.s ? 'simbólico' : 'duro'} creado: ${rest[0]} → ${rest[1]}`, OUT.SUCCESS)]
}

function freeCmd(args, fs) {
  const { flags } = parseFlags(args)
  const unit = flags.h ? 'human' : flags.m ? 'MB' : 'KB'
  return [
    line('               total        used        free      shared  buff/cache   available', OUT.TEXT),
    line('Mem:           3936M        812M       2100M         24M       1022M       2856M', OUT.TEXT),
    line('Swap:          2048M          0M       2048M', OUT.TEXT),
  ]
}

function killCmd(args, fs) {
  const { flags, rest } = parseFlags(args)
  if (!rest.length) return [line('kill: Falta el PID', OUT.ERROR)]
  const signal = flags[9] ? '-9' : flags[15] ? '-15' : ''
  return [line(`[simulador] kill ${signal} ${rest[0]} — proceso terminado.`, OUT.SUCCESS)]
}

function manCmd(args, fs) {
  if (!args.length) return [line('What manual page do you want?', OUT.ERROR)]
  const cmd = args[0]
  const pages = {
    ls:    'LS(1)\n\nNOMBRE\n  ls - listar contenido de directorio\n\nSINOPSIS\n  ls [OPCIÓN]... [ARCHIVO]...\n\nOPCIONES\n  -a  no ignorar entradas que empiezan con .\n  -l  usar formato de listado largo\n  -h  tamaños legibles por humanos\n  -r  ordenar en orden inverso',
    grep:  'GREP(1)\n\nNOMBRE\n  grep - imprimir líneas que coincidan con patrones\n\nSINOPSIS\n  grep [OPCIÓN]... PATRONES [ARCHIVO]...\n\nOPCIONES\n  -i  ignorar mayúsculas/minúsculas\n  -n  mostrar número de línea\n  -r  recursivo\n  -v  invertir coincidencia',
    chmod: 'CHMOD(1)\n\nNOMBRE\n  chmod - cambiar permisos de archivo\n\nSINOPSIS\n  chmod [OPCIÓN]... MODO[,MODO]... ARCHIVO...\n\nEJEMPLO\n  chmod 755 script.sh\n  chmod +x programa',
    find:  'FIND(1)\n\nNOMBRE\n  find - buscar archivos en jerarquía de directorios\n\nSINOPSIS\n  find [ruta] [expresión]\n\nEJEMPLOS\n  find . -name "*.txt"\n  find /home -type f -name "*.sh"',
  }
  const content = pages[cmd] || `No hay página de manual para '${cmd}' en este simulador.\nConsulta: man ${cmd} en tu terminal real o https://linux.die.net/man/`
  return content.split('\n').map(l => line(l, OUT.TEXT))
}

function helpCmd(args, fs) {
  return [
    line('╔══════════════════════════════════════════════════════╗', OUT.INFO),
    line('║         LinuxAcademy — Comandos Disponibles          ║', OUT.INFO),
    line('╚══════════════════════════════════════════════════════╝', OUT.INFO),
    line('', OUT.TEXT),
    line('── Navegación ─────────────────────────────────────────', OUT.SYSTEM),
    line('  pwd          Mostrar directorio actual', OUT.TEXT),
    line('  ls [-la]     Listar archivos', OUT.TEXT),
    line('  cd [dir]     Cambiar directorio', OUT.TEXT),
    line('  tree         Ver árbol de directorios', OUT.TEXT),
    line('', OUT.TEXT),
    line('── Archivos ────────────────────────────────────────────', OUT.SYSTEM),
    line('  touch         Crear archivo', OUT.TEXT),
    line('  mkdir [-p]    Crear directorio', OUT.TEXT),
    line('  cp src dst    Copiar', OUT.TEXT),
    line('  mv src dst    Mover/renombrar', OUT.TEXT),
    line('  rm [-r]       Eliminar', OUT.TEXT),
    line('  cat           Ver contenido', OUT.TEXT),
    line('', OUT.TEXT),
    line('── Texto ───────────────────────────────────────────────', OUT.SYSTEM),
    line('  echo          Imprimir texto', OUT.TEXT),
    line('  grep          Buscar en archivos', OUT.TEXT),
    line('  find          Buscar archivos', OUT.TEXT),
    line('  wc            Contar líneas/palabras', OUT.TEXT),
    line('  head / tail   Ver inicio/final', OUT.TEXT),
    line('', OUT.TEXT),
    line('── Sistema ─────────────────────────────────────────────', OUT.SYSTEM),
    line('  whoami        Usuario actual', OUT.TEXT),
    line('  uname -a      Info del sistema', OUT.TEXT),
    line('  ps [aux]      Procesos', OUT.TEXT),
    line('  df -h         Espacio en disco', OUT.TEXT),
    line('  free -h       Memoria RAM', OUT.TEXT),
    line('  date          Fecha y hora', OUT.TEXT),
    line('', OUT.TEXT),
    line('── Permisos ────────────────────────────────────────────', OUT.SYSTEM),
    line('  chmod         Cambiar permisos', OUT.TEXT),
    line('  chown         Cambiar propietario', OUT.TEXT),
    line('  id            Ver ID de usuario', OUT.TEXT),
    line('', OUT.TEXT),
    line('  man [cmd]     Manual de cualquier comando', OUT.SUCCESS),
    line('  clear         Limpiar terminal', OUT.SUCCESS),
    line('', OUT.TEXT),
    line('  💡 Tip: Usa TAB para autocompletar y ↑↓ para historial', OUT.WARNING),
  ]
}
