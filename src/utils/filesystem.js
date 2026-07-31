/* ============================================================
   filesystem.js — Sistema de archivos virtual completo
   Modela un árbol Linux real en memoria (persiste en localStorage)
   ============================================================ */

import { getFilesystem, saveFilesystem } from './storage.js'

export const NODE_TYPE = { DIR: 'dir', FILE: 'file', LINK: 'link' }

function buildInitialFS() {
  return {
    type: 'dir', name: '/', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00',
    children: {
      home: {
        type: 'dir', name: 'home', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00',
        children: {
          estudiante: {
            type: 'dir', name: 'estudiante', permissions: 'drwxr-xr-x', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00',
            children: {
              documentos: {
                type: 'dir', name: 'documentos', permissions: 'drwxr-xr-x', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00',
                children: {
                  'README.txt': { type: 'file', name: 'README.txt', permissions: '-rw-r--r--', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00', size: 128, content: 'Bienvenido a LinuxAcademy 30.\nEste es tu directorio de documentos.\nAquí puedes guardar tus archivos de práctica.\n\n¡Buena suerte en tu aprendizaje!\n' },
                },
              },
              scripts: {
                type: 'dir', name: 'scripts', permissions: 'drwxr-xr-x', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00',
                children: {
                  'hola.sh': { type: 'file', name: 'hola.sh', permissions: '-rwxr-xr-x', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00', size: 64, content: '#!/bin/bash\n# Mi primer script\necho "¡Hola, mundo Linux!"\necho "Usuario: $(whoami)"\n' },
                },
              },
              laboratorios: { type: 'dir', name: 'laboratorios', permissions: 'drwxr-xr-x', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00', children: {} },
              proyectos:    { type: 'dir', name: 'proyectos',    permissions: 'drwxr-xr-x', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00', children: {} },
              '.bashrc':    { type: 'file', name: '.bashrc', permissions: '-rw-r--r--', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00', size: 220, hidden: true, content: '# ~/.bashrc\nexport PATH="$HOME/scripts:$PATH"\nexport EDITOR=nano\nalias ll="ls -la"\nalias cls=clear\nPS1="\\u@\\h:\\w$ "\n' },
              '.bash_history': { type: 'file', name: '.bash_history', permissions: '-rw-------', owner: 'estudiante', group: 'estudiante', modified: '2024-01-01 08:00', size: 0, hidden: true, content: '' },
            },
          },
        },
      },
      etc: {
        type: 'dir', name: 'etc', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00',
        children: {
          'hostname':   { type: 'file', name: 'hostname',   permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-01 00:00', size: 14,  content: 'linux-academy\n' },
          'passwd':     { type: 'file', name: 'passwd',     permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-01 00:00', size: 156, content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nestudiante:x:1000:1000:Estudiante Linux,,,:/home/estudiante:/bin/bash\n' },
          'group':      { type: 'file', name: 'group',      permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-01 00:00', size: 80,  content: 'root:x:0:\nsudo:x:27:estudiante\nadm:x:4:syslog,estudiante\nestudiante:x:1000:\n' },
          'hosts':      { type: 'file', name: 'hosts',      permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-01 00:00', size: 96,  content: '127.0.0.1\tlocalhost\n127.0.1.1\tlinux-academy\n::1\t\tlocalhost ip6-localhost\n' },
          'os-release': { type: 'file', name: 'os-release', permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-01 00:00', size: 180, content: 'NAME="Ubuntu"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"\nID=ubuntu\nPRETTY_NAME="Ubuntu 22.04.3 LTS"\nVERSION_ID="22.04"\n' },
          'shadow':     { type: 'file', name: 'shadow',     permissions: '-rw-r-----', owner: 'root', group: 'shadow', modified: '2024-01-01 00:00', size: 64, content: '[PERMISSION DENIED]', restricted: true },
          'ssh': {
            type: 'dir', name: 'ssh', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00',
            children: {
              'sshd_config': { type: 'file', name: 'sshd_config', permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-01 00:00', size: 320, content: '# OpenSSH server config\nPort 22\n#PermitRootLogin prohibit-password\nPermitRootLogin prohibit-password\n#PasswordAuthentication yes\nPasswordAuthentication yes\nPubkeyAuthentication yes\nAuthorizedKeysFile .ssh/authorized_keys\nMaxAuthTries 6\nLoginGraceTime 120\n#X11Forwarding yes\nX11Forwarding yes\nPrintMotd no\nAcceptEnv LANG LC_*\nSubsystem sftp /usr/lib/openssh/sftp-server\n' },
            },
          },
        },
      },
      var: {
        type: 'dir', name: 'var', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00',
        children: {
          log: {
            type: 'dir', name: 'log', permissions: 'drwxr-xr-x', owner: 'root', group: 'syslog', modified: '2024-01-01 00:00',
            children: {
              'syslog':   { type: 'file', name: 'syslog',   permissions: '-rw-r-----', owner: 'syslog', group: 'adm', modified: '2024-01-15 10:23', size: 2048, content: 'Jan 15 10:00:01 linux-academy systemd[1]: Started Session 1 of user estudiante.\nJan 15 10:00:02 linux-academy kernel: [    0.000000] Linux version 5.15.0-91-generic\nJan 15 10:01:15 linux-academy sshd[892]: Server listening on 0.0.0.0 port 22.\nJan 15 10:05:33 linux-academy sudo: estudiante : TTY=pts/0 ; PWD=/home/estudiante ; COMMAND=/usr/bin/apt\nJan 15 10:10:45 linux-academy systemd[1]: Started Daily apt download activities.\nJan 15 10:15:02 linux-academy cron[721]: (CRON) INFO (pidfile fd = 3)\nJan 15 10:23:11 linux-academy kernel: [  823.445231] audit: type=1400\n' },
              'auth.log': { type: 'file', name: 'auth.log', permissions: '-rw-r-----', owner: 'syslog', group: 'adm', modified: '2024-01-15 10:23', size: 512,  content: 'Jan 15 10:00:01 linux-academy sshd[892]: Accepted password for estudiante from 192.168.1.100 port 52341 ssh2\nJan 15 10:05:33 linux-academy sudo: estudiante : TTY=pts/0 ; COMMAND=/usr/bin/apt\nJan 15 10:20:14 linux-academy su[1234]: FAILED su for root by estudiante\nJan 15 10:21:00 linux-academy sshd[892]: Failed password for invalid user admin from 192.168.1.200 port 41256 ssh2\n' },
            },
          },
        },
      },
      tmp:  { type: 'dir', name: 'tmp',  permissions: 'drwxrwxrwt', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: {} },
      opt:  { type: 'dir', name: 'opt',  permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: { 'linux-academy': { type: 'dir', name: 'linux-academy', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: { 'README': { type: 'file', name: 'README', permissions: '-rw-r--r--', owner: 'root', group: 'root', modified: '2024-01-01 00:00', size: 80, content: 'LinuxAcademy 30 — Plataforma educativa\nVersión 1.0.0\n' } } } } },
      root: { type: 'dir', name: 'root', permissions: 'drwx------', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: {}, restricted: true },
      bin:  { type: 'dir', name: 'bin',  permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: {} },
      usr:  { type: 'dir', name: 'usr',  permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: { bin: { type: 'dir', name: 'bin', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: {} }, local: { type: 'dir', name: 'local', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', modified: '2024-01-01 00:00', children: {} } } },
    },
  }
}

export class FSManager {
  constructor() {
    const saved = getFilesystem()
    this.tree = saved ? saved.tree : buildInitialFS()
    this.cwd  = saved ? saved.cwd  : '/home/estudiante'
    this.user = 'estudiante'
    this.host = 'linux-academy'
  }

  save() { saveFilesystem({ tree: this.tree, cwd: this.cwd }) }

  resolvePath(path, base = this.cwd) {
    if (!path || path === '~') return '/home/estudiante'
    if (path.startsWith('~/')) return '/home/estudiante' + path.slice(1)
    if (path.startsWith('/'))  return this._normalize(path)
    return this._normalize(base + '/' + path)
  }

  _normalize(path) {
    const parts = path.split('/').filter(Boolean)
    const stack = []
    for (const p of parts) {
      if (p === '.') continue
      if (p === '..') { if (stack.length) stack.pop() }
      else stack.push(p)
    }
    return '/' + stack.join('/')
  }

  getNode(absPath) {
    if (absPath === '/') return this.tree
    const parts = absPath.split('/').filter(Boolean)
    let node = this.tree
    for (const part of parts) {
      if (!node.children || !node.children[part]) return null
      node = node.children[part]
    }
    return node
  }

  getParentAndName(absPath) {
    const parts  = absPath.split('/').filter(Boolean)
    const name   = parts.pop()
    const parent = this.getNode('/' + parts.join('/'))
    return { parent, name }
  }

  listDir(absPath, showHidden = false) {
    const node = this.getNode(absPath)
    if (!node)                        return { error: `ls: cannot access '${absPath}': No such file or directory` }
    if (node.type !== NODE_TYPE.DIR)  return { error: `ls: cannot access '${absPath}': Not a directory` }
    const entries = Object.values(node.children || {})
      .filter(n => showHidden || !n.hidden)
      .sort((a, b) => { if (a.type !== b.type) return a.type === 'dir' ? -1 : 1; return a.name.localeCompare(b.name) })
    return { entries }
  }

  changeDir(path) {
    const abs  = this.resolvePath(path)
    const node = this.getNode(abs)
    if (!node)                       return { error: `cd: ${path}: No such file or directory` }
    if (node.type !== NODE_TYPE.DIR) return { error: `cd: ${path}: Not a directory` }
    if (node.restricted && this.user !== 'root') return { error: `cd: ${path}: Permission denied` }
    this.cwd = abs; this.save()
    return { success: true, cwd: abs }
  }

  makeDir(path, recursive = false) {
    const abs = this.resolvePath(path)
    if (this.getNode(abs)) return { error: `mkdir: cannot create directory '${path}': File exists` }
    const { parent, name } = this.getParentAndName(abs)
    if (!parent) {
      if (recursive) return this._makeDirRecursive(abs)
      return { error: `mkdir: cannot create directory '${path}': No such file or directory` }
    }
    if (!parent.children) parent.children = {}
    parent.children[name] = { type: 'dir', name, permissions: 'drwxr-xr-x', owner: this.user, group: this.user, modified: this._now(), children: {} }
    this.save(); return { success: true }
  }

  _makeDirRecursive(abs) {
    const parts = abs.split('/').filter(Boolean)
    let current = this.tree, path = ''
    for (const part of parts) {
      path += '/' + part
      if (!current.children) current.children = {}
      if (!current.children[part]) current.children[part] = { type: 'dir', name: part, permissions: 'drwxr-xr-x', owner: this.user, group: this.user, modified: this._now(), children: {} }
      current = current.children[part]
    }
    this.save(); return { success: true }
  }

  touchFile(path) {
    const abs = this.resolvePath(path)
    const existing = this.getNode(abs)
    if (existing) { existing.modified = this._now(); this.save(); return { success: true } }
    const { parent, name } = this.getParentAndName(abs)
    if (!parent) return { error: `touch: cannot touch '${path}': No such file or directory` }
    if (!parent.children) parent.children = {}
    parent.children[name] = { type: 'file', name, permissions: '-rw-r--r--', owner: this.user, group: this.user, modified: this._now(), size: 0, content: '' }
    this.save(); return { success: true }
  }

  readFile(path) {
    const abs  = this.resolvePath(path)
    const node = this.getNode(abs)
    if (!node)                        return { error: `cat: ${path}: No such file or directory` }
    if (node.type === NODE_TYPE.DIR)  return { error: `cat: ${path}: Is a directory` }
    if (node.restricted && this.user !== 'root') return { error: `cat: ${path}: Permission denied` }
    return { content: node.content || '' }
  }

  writeFile(path, content, append = false) {
    const abs = this.resolvePath(path)
    let node  = this.getNode(abs)
    if (!node) { const r = this.touchFile(path); if (r.error) return r; node = this.getNode(abs) }
    if (node.type === NODE_TYPE.DIR) return { error: `${path}: Is a directory` }
    node.content  = append ? (node.content || '') + content + '\n' : content + '\n'
    node.size     = node.content.length
    node.modified = this._now()
    this.save(); return { success: true }
  }

  remove(path, recursive = false) {
    const abs = this.resolvePath(path)
    if (['/', '/home', '/home/estudiante'].includes(abs)) return { error: `rm: refusing to remove '${path}': system path` }
    const node = this.getNode(abs)
    if (!node) return { error: `rm: cannot remove '${path}': No such file or directory` }
    if (node.type === NODE_TYPE.DIR && !recursive) return { error: `rm: cannot remove '${path}': Is a directory (use -r)` }
    const { parent, name } = this.getParentAndName(abs)
    if (!parent) return { error: `rm: cannot remove '${path}'` }
    delete parent.children[name]; this.save(); return { success: true }
  }

  copy(src, dest) {
    const absSrc  = this.resolvePath(src)
    const absDest = this.resolvePath(dest)
    const srcNode = this.getNode(absSrc)
    if (!srcNode) return { error: `cp: cannot stat '${src}': No such file or directory` }
    const destNode = this.getNode(absDest)
    let finalDest  = absDest
    if (destNode && destNode.type === NODE_TYPE.DIR) finalDest = absDest + '/' + srcNode.name
    const { parent, name } = this.getParentAndName(finalDest)
    if (!parent) return { error: `cp: cannot create '${dest}': No such file or directory` }
    if (!parent.children) parent.children = {}
    parent.children[name] = JSON.parse(JSON.stringify({ ...srcNode, name, modified: this._now() }))
    this.save(); return { success: true }
  }

  move(src, dest) {
    const result = this.copy(src, dest)
    if (result.error) return { error: result.error.replace('cp:', 'mv:') }
    return this.remove(src, true)
  }

  chmod(mode, path) {
    const abs  = this.resolvePath(path)
    const node = this.getNode(abs)
    if (!node) return { error: `chmod: cannot access '${path}': No such file or directory` }
    node.permissions = this._octalToPerms(mode, node.type === NODE_TYPE.DIR)
    this.save(); return { success: true, mode, path }
  }

  _octalToPerms(octal, isDir) {
    const map = ['---','--x','-w-','-wx','r--','r-x','rw-','rwx']
    const str = String(octal).replace(/[^0-7]/g,'').padStart(3,'0')
    const perms = str.split('').map(d => map[parseInt(d)]).join('')
    return (isDir ? 'd' : '-') + perms
  }

  find(startPath, opts = {}) {
    const abs  = this.resolvePath(startPath)
    const node = this.getNode(abs)
    if (!node) return { error: `find: '${startPath}': No such file or directory` }
    const results = []; this._walkFind(node, abs, opts, results)
    return { results }
  }

  _walkFind(node, path, opts, results) {
    const { name: nameFilter, type: typeFilter } = opts
    const matches = (!nameFilter || node.name.includes(nameFilter) || (nameFilter.includes('*') && new RegExp('^' + nameFilter.replace(/\*/g,'.*') + '$').test(node.name))) && (!typeFilter || (typeFilter === 'f' && node.type === 'file') || (typeFilter === 'd' && node.type === 'dir'))
    if (matches) results.push(path)
    if (node.type === 'dir' && node.children) {
      for (const [cname, child] of Object.entries(node.children)) {
        this._walkFind(child, path === '/' ? '/' + cname : path + '/' + cname, opts, results)
      }
    }
  }

  grep(pattern, path, opts = {}) {
    const abs  = this.resolvePath(path)
    const node = this.getNode(abs)
    if (!node)                       return { error: `grep: ${path}: No such file or directory` }
    if (node.type === NODE_TYPE.DIR) return { error: `grep: ${path}: Is a directory` }
    const lines = (node.content || '').split('\n')
    const regex = new RegExp(pattern, opts.ignoreCase ? 'i' : '')
    const matches = lines.map((line, i) => ({ line, num: i + 1 })).filter(({ line }) => regex.test(line))
    return { matches, pattern, path }
  }

  autocomplete(partial) {
    const parts   = partial.split('/')
    const prefix  = parts.pop()
    const dirPart = parts.join('/')
    const dirAbs  = dirPart ? this.resolvePath(dirPart) : this.cwd
    const node    = this.getNode(dirAbs)
    if (!node || node.type !== NODE_TYPE.DIR) return []
    return Object.keys(node.children || {})
      .filter(name => name.startsWith(prefix))
      .map(name => { const child = node.children[name]; const base = dirPart ? dirPart + '/' + name : name; return child.type === NODE_TYPE.DIR ? base + '/' : base })
  }

  _now() {
    const d = new Date()
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2)} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  getPrompt() { return { user: this.user, host: this.host, path: this.cwd.replace('/home/estudiante', '~') } }
  getDirSize(node) { if (node.type === 'file') return node.size || 0; return Object.values(node.children || {}).reduce((acc, child) => acc + this.getDirSize(child), 0) }
  getDirs(partial = '') { const node = this.getNode(this.cwd); if (!node || !node.children) return []; return Object.values(node.children).filter(n => n.type === 'dir' && n.name.startsWith(partial)).map(n => n.name) }
}

let _instance = null
export function getFS() { if (!_instance) _instance = new FSManager(); return _instance }
export function resetFS() { _instance = null; saveFilesystem(null) }
