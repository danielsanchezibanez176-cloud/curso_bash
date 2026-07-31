/* ============================================================
   days21to30.js — Contenido completo Días 21 al 30
   Módulo de Ciberseguridad + Proyecto Final
   ============================================================ */
import { condCmd, condDir, condFile, condCwd, condFlag, condAll, condAny } from '../utils/missionEvaluator.js'

export const days21to30 = [

// ─────────────────────────────────────────────────────────────
// DÍA 21 — Análisis de Logs del Sistema
// ─────────────────────────────────────────────────────────────
{
  day: 21, title: 'Análisis de Logs del Sistema',
  category: 'cyber', xp: 600,
  tags: ['logs', 'syslog', 'auth.log', 'journalctl', 'análisis forense'],
  objectives: [
    'Entender la arquitectura de logging de Linux',
    'Analizar /var/log/auth.log para detectar intrusiones',
    'Usar journalctl para consultar logs de systemd',
    'Crear scripts de análisis de logs automático',
    'Identificar patrones de ataque en logs',
  ],
  theory: {
    intro: 'Los logs son la memoria del sistema. Todo lo que ocurre en un servidor Linux queda registrado. Un atacante sofisticado intentará borrarlos; un analista de seguridad sabe cómo leerlos, correlacionarlos y detectar anomalías antes de que se conviertan en un incidente mayor.',
    sections: [
      {
        type: 'dual',
        technical: 'Linux usa rsyslog/syslog-ng para centralizar logs. Cada mensaje tiene: facility (origen: auth, kernel, daemon) y severity (DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY). systemd-journald almacena logs en formato binario en /run/log/journal/, accesibles via journalctl.',
        simple: 'Los logs son como el libro de visitas de tu servidor: registran quién entró, qué hizo y cuándo. El problema es que hay cientos de entradas por hora. El truco es saber filtrar las importantes.',
      },
      {
        type: 'text',
        title: 'Archivos de log críticos para seguridad',
        body: '/var/log/auth.log: SSH, sudo, su, PAM. /var/log/syslog: sistema general. /var/log/kern.log: kernel, drivers. /var/log/ufw.log: firewall. /var/log/apache2/access.log: peticiones web. /var/log/apache2/error.log: errores web. /var/log/mysql/error.log: base de datos. /var/log/fail2ban.log: IPs bloqueadas.',
      },
      {
        type: 'text',
        title: 'Patrones de ataque en logs',
        body: 'Fuerza bruta SSH: miles de "Failed password" en minutos desde la misma IP. Escalada de privilegios: "sudo" seguido de comandos inusuales. Exfiltración: curl/wget a IPs externas desde procesos del sistema. Limpieza de rastros: ausencia de logs en horarios de actividad (los borraron). Persistencia: nuevas entradas de cron o usuarios creados.',
      },
      {
        type: 'note',
        label: 'Log rotation y retención',
        body: 'logrotate rota los logs automáticamente (comprime, renombra, elimina viejos). Configurable en /etc/logrotate.conf. En seguridad, la retención mínima recomendada es 90 días. Los logs deben enviarse a un servidor centralizado (SIEM) para que un atacante no pueda borrarlos desde el servidor comprometido.',
      },
    ],
    diagram: {
      title: 'Arquitectura de logging en Linux',
      content: `Kernel / Aplicaciones / Servicios
         │
         ▼
   rsyslog / syslog-ng          journald (systemd)
         │                           │
         ▼                           ▼
  /var/log/                   /run/log/journal/
  ├── auth.log                       │
  ├── syslog                         ▼
  ├── kern.log               journalctl -u ssh -f
  ├── ufw.log
  └── application.log
         │
         ▼
   Análisis: grep, awk, sed
   Alertas: fail2ban, scripts
   SIEM: ELK Stack, Splunk`,
    },
    realCase: {
      title: 'Detectar una intrusión 3 días después gracias a los logs',
      body: 'Un servidor fue comprometido un viernes. El lunes, el administrador nota actividad extraña. Analizando auth.log, encuentra: 50,000 "Failed password" desde 185.x.x.x el viernes a las 2am, seguido de un "Accepted password for root" a las 2:47am. Los logs revelaron el vector de ataque, la hora exacta y el método. Sin logs, la investigación sería imposible.',
    },
  },
  commands: [
    {
      name: 'journalctl',
      brief: 'Consultar el journal de systemd',
      technical: 'journalctl lee el journal binario de systemd-journald. Soporta filtrado por unit, tiempo, prioridad y más.',
      simple: 'La herramienta moderna para leer logs de systemd. Más potente que cat para logs del sistema.',
      syntax: [
        { cmd: 'journalctl',                          desc: 'Todo el journal (muy largo)' },
        { cmd: 'journalctl', flag: '-u ssh',          desc: 'Solo logs del servicio SSH' },
        { cmd: 'journalctl', flag: '-f',              desc: 'Seguimiento en tiempo real (como tail -f)' },
        { cmd: 'journalctl', flag: '--since "1 hour ago"', desc: 'Últimas horas' },
        { cmd: 'journalctl', flag: '-p err',          desc: 'Solo errores y más críticos' },
        { cmd: 'journalctl', flag: '-n 50',           desc: 'Últimas 50 líneas' },
      ],
      errors: [
        { msg: 'No journal files were found', fix: 'systemd-journald no está corriendo o no hay logs. Verifica: systemctl status systemd-journald' },
      ],
      security: 'journalctl -u ssh --since "today" filtra todos los eventos SSH del día. Esencial para detectar ataques en tiempo real.',
    },
    {
      name: 'grep con patrones de seguridad',
      brief: 'Filtrar logs buscando indicadores de compromiso',
      technical: 'grep con expresiones regulares permite extraer líneas específicas de archivos de log grandes de forma eficiente.',
      simple: 'Usa grep para encontrar patrones sospechosos en logs: intentos fallidos, comandos peligrosos, IPs conocidas.',
      syntax: [
        { cmd: "grep 'Failed password' /var/log/auth.log",     desc: 'Intentos fallidos de SSH' },
        { cmd: "grep 'Accepted password' /var/log/auth.log",   desc: 'Logins SSH exitosos' },
        { cmd: "grep 'sudo' /var/log/auth.log",                desc: 'Uso de sudo' },
        { cmd: "grep -E 'Failed|Invalid|error' /var/log/auth.log", desc: 'Múltiples patrones' },
        { cmd: "grep 'Failed password' auth.log | awk '{print $11}' | sort | uniq -c | sort -rn", desc: 'IPs atacantes más activas' },
      ],
      errors: [],
      security: "grep -v '^#\\|^$' /etc/ssh/sshd_config muestra la configuración SSH activa sin comentarios. Fundamental en auditorías.",
    },
  ],
  lab: {
    title: 'Análisis forense de logs: reconstruir un incidente',
    context: 'Has recibido una alerta: el servidor puede haber sido comprometido la semana pasada. Debes analizar los logs para determinar qué ocurrió, cuándo y cómo.',
    duration: '35 min', xp: 200,
    steps: [
      {
        title: 'Examina el log de autenticación completo',
        body: 'Lee el auth.log para obtener una visión general de la actividad de autenticación.',
        commands: [{ cmd: 'cat /var/log/auth.log', explanation: 'Log completo de autenticación del sistema.' }],
        expected: 'sshd, sudo, su events con timestamps',
        technical: 'auth.log es el primer archivo que analiza un investigador. Contiene toda la actividad de autenticación del sistema.',
        hints: ['$ cat /var/log/auth.log'],
      },
      {
        title: 'Detecta intentos de login fallidos',
        body: 'Busca intentos fallidos de SSH que podrían indicar fuerza bruta.',
        commands: [{ cmd: "grep 'Failed password' /var/log/auth.log", explanation: 'Filtra solo los intentos fallidos.' }],
        expected: 'sshd[892]: Failed password for invalid user admin from 192.168.1.x',
        technical: '"Failed password" aparece cada vez que alguien intenta conectarse con credenciales incorrectas.',
        hints: ["$ grep 'Failed password' /var/log/auth.log"],
      },
      {
        title: 'Identifica logins SSH exitosos',
        body: 'Verifica si hubo accesos exitosos no autorizados.',
        commands: [{ cmd: "grep 'Accepted' /var/log/auth.log", explanation: 'Logins SSH aceptados (exitosos).' }],
        expected: 'sshd[892]: Accepted password for estudiante from 192.168.1.100',
        technical: '"Accepted" seguido de una IP desconocida es señal de compromiso. Compara con IPs conocidas.',
        hints: ["$ grep 'Accepted' /var/log/auth.log"],
      },
      {
        title: 'Analiza uso de sudo',
        body: 'Detecta escaladas de privilegios sospechosas.',
        commands: [{ cmd: "grep 'sudo' /var/log/auth.log", explanation: 'Todos los usos de sudo.' }],
        expected: 'sudo: estudiante : TTY=pts/0 ; COMMAND=/usr/bin/apt',
        technical: 'Comandos sudo inusuales (rm, curl, wget) después de un login son señal de actividad maliciosa.',
        hints: ["$ grep 'sudo' /var/log/auth.log"],
      },
      {
        title: 'Crea reporte de IPs sospechosas',
        body: 'Genera un resumen de IPs con más intentos fallidos.',
        commands: [
          { cmd: "grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn", explanation: 'Extrae IPs, cuenta y ordena por frecuencia.' },
        ],
        expected: '1 192.168.1.100',
        technical: 'Este pipeline es el análisis básico de fuerza bruta: IP con más de 100 intentos en poco tiempo = atacante automatizado.',
        hints: ["$ grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn"],
      },
    ],
    commonErrors: [
      { error: 'grep no encuentra resultados', solution: 'El patrón distingue mayúsculas. Usa grep -i para búsqueda insensible a mayúsculas.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué archivo de log contiene los intentos de login SSH fallidos?', options: ['/var/log/syslog', '/var/log/auth.log', '/var/log/ssh.log', '/var/log/security'], correct: 1, explanation: '/var/log/auth.log (Ubuntu/Debian) registra toda la actividad de autenticación: SSH, sudo, su, PAM.' },
    { type: 'fill', question: 'Para ver logs del servicio SSH en tiempo real con journalctl: `journalctl -u ssh ___`', correct: ['-f'], explanation: '-f (follow) hace que journalctl muestre nuevas entradas en tiempo real, como tail -f.' },
    { type: 'true_false', question: 'La ausencia de logs en un servidor que debería tener actividad puede indicar que un atacante los borró.', correct: true, explanation: 'Los atacantes avanzados borran /var/log/auth.log o usan "echo > /var/log/auth.log" para eliminar evidencias. La ausencia de logs es en sí misma evidencia forense.' },
    { type: 'multiple', question: '¿Qué pipeline extrae las IPs con más intentos fallidos de SSH?', options: ["grep 'Failed' auth.log | cut -d' ' -f11 | sort | uniq -c", "grep 'Failed password' auth.log | awk '{print $11}' | sort | uniq -c | sort -rn", "cat auth.log | grep IP | count", "awk '/Failed/{print $IP}' auth.log | sort"], correct: 1, explanation: "awk '{print $11}' extrae el campo 11 (IP). sort agrupa, uniq -c cuenta, sort -rn ordena de mayor a menor." },
    { type: 'multiple', question: 'En auth.log ves 10,000 líneas "Failed password for root" desde la misma IP. ¿Qué tipo de ataque es?', options: ['SQL Injection', 'XSS', 'Ataque de fuerza bruta SSH', 'DDoS'], correct: 2, explanation: 'Múltiples intentos de contraseña automatizados es un ataque de fuerza bruta. La herramienta fail2ban puede bloquearlo automáticamente.' },
  ],
  missions: [
    { id: 'm1d21', title: 'Lee auth.log completo', description: 'cat /var/log/auth.log', hint: '$ cat /var/log/auth.log', xp: 30, condition: { type: 'command_executed', command: 'cat /var/log/auth.log' } },
    { id: 'm2d21', title: 'Detecta logins fallidos', description: "grep 'Failed password' auth.log", hint: "$ grep 'Failed password' /var/log/auth.log", xp: 40, condition: { type: 'command_executed', command: "grep 'Failed password' /var/log/auth.log" } },
    { id: 'm3d21', title: 'Detecta logins exitosos', description: "grep 'Accepted' auth.log", hint: "$ grep 'Accepted' /var/log/auth.log", xp: 35, condition: { type: 'command_executed', command: "grep 'Accepted' /var/log/auth.log" } },
    { id: 'm4d21', title: 'Analiza IPs atacantes', description: "grep 'Failed' | awk '{print $11}' | sort | uniq -c", hint: "$ grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn", xp: 50, condition: { type: 'command_matches', pattern: "grep.*Failed.*awk" } },
  ],
  resources: [
    { name: 'Linux Log Analysis', url: 'https://www.loggly.com/ultimate-guide/linux-logging-basics/', icon: '📋' },
    { name: 'journalctl Guide', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 22 — Monitoreo de Procesos Sospechosos
// ─────────────────────────────────────────────────────────────
{
  day: 22, title: 'Monitoreo de Procesos Sospechosos',
  category: 'cyber', xp: 600,
  tags: ['procesos', 'malware', 'detección', 'ps', 'lsof', 'forense'],
  objectives: [
    'Identificar procesos maliciosos usando ps y top',
    'Analizar procesos con lsof y /proc',
    'Detectar técnicas de ocultamiento de malware',
    'Crear scripts de monitoreo de procesos',
    'Responder ante un proceso sospechoso',
  ],
  theory: {
    intro: 'El malware debe ejecutarse como proceso para hacer daño. Saber identificar procesos anómalos es una de las habilidades más valiosas de un analista de seguridad. Un proceso sospechoso puede ser un cryptominer, un backdoor o un ransomware en proceso de cifrado.',
    sections: [
      {
        type: 'dual',
        technical: 'El sistema de archivos /proc expone información de cada proceso como archivos: /proc/PID/cmdline (comando), /proc/PID/exe (enlace al ejecutable), /proc/PID/maps (mapa de memoria), /proc/PID/fd/ (file descriptors). lsof (List Open Files) muestra todos los archivos abiertos por procesos, incluyendo sockets de red.',
        simple: 'Cada proceso deja huellas: qué archivos tiene abiertos, qué puertos usa, desde dónde se ejecutó. Con las herramientas correctas, puedes ver todas estas huellas y detectar si algo no pertenece al sistema.',
      },
      {
        type: 'text',
        title: 'Indicadores de proceso sospechoso',
        body: 'Ejecutable en /tmp, /dev/shm o /var/tmp. Nombre que imita procesos legítimos (systemd con espacio, kworkerr con doble r). Alto uso de CPU sin explicación. Proceso sin terminal (TTY) que hace conexiones de red. Múltiples instancias del mismo proceso. Proceso eliminado del disco pero aún ejecutándose (deleted en /proc/PID/exe).',
      },
      {
        type: 'note',
        label: 'Técnicas de evasión de malware',
        body: 'Rootkits ocultan procesos modificando las syscalls del kernel. Malware puede renombrarse como [kworker/0:1] (corchetes imitan hilos del kernel). Procesos pueden inyectarse en memoria de procesos legítimos. La defensa: verificar /proc directamente (más difícil de manipular), usar herramientas como rkhunter y chkrootkit.',
      },
    ],
    realCase: {
      title: 'Detectar un cryptominer camuflado como proceso del kernel',
      body: 'Un servidor cloud comenzó a generar facturas 10x mayores. top mostró un proceso llamado "[kworker/0:2]" usando 98% de CPU. Los corchetes imitan hilos del kernel, pero cat /proc/PID/cmdline reveló el comando real: /tmp/.x/miner --pool xmr.pool.minergate.com. El atacante había camuflado el cryptominer como proceso del kernel.',
    },
  },
  commands: [
    {
      name: 'ps aux con filtros de seguridad',
      brief: 'Analizar procesos buscando anomalías',
      technical: 'ps lee /proc/[pid]/stat y cmdline para cada PID. Ordenar por CPU y memoria y filtrar por directorio de ejecución revela procesos sospechosos.',
      simple: 'Usa ps con filtros específicos para detectar procesos que no deberían estar corriendo.',
      syntax: [
        { cmd: "ps aux | awk '$11 ~ /^\\/tmp/'",      desc: 'Procesos ejecutados desde /tmp' },
        { cmd: 'ps aux --sort=-%cpu | head -10',      desc: 'Top 10 por CPU (detecta mineros)' },
        { cmd: 'ps aux --sort=-%mem | head -10',      desc: 'Top 10 por memoria' },
        { cmd: "ps aux | grep -v '\\[' | awk '$3>50'", desc: 'Procesos normales con >50% CPU' },
        { cmd: 'ps -eo pid,ppid,user,cmd --forest',   desc: 'Árbol de procesos con herencia' },
      ],
      errors: [],
      security: "ps aux | awk '\$11 ~ /^\\/tmp|\\/dev\\/shm/' detecta malware ejecutándose desde directorios temporales.",
    },
    {
      name: 'ls /proc/PID/',
      brief: 'Inspeccionar información de un proceso directamente',
      technical: '/proc es un filesystem virtual que expone el estado del kernel. Cada directorio numérico corresponde a un PID activo.',
      simple: 'Ver los detalles internos de cualquier proceso: su ejecutable, archivos abiertos, conexiones y más.',
      syntax: [
        { cmd: 'ls /proc/$$/',                    desc: 'Ver tu propio proceso (shell actual)' },
        { cmd: 'cat /proc/PID/cmdline',           desc: 'Comando completo del proceso' },
        { cmd: 'ls -la /proc/PID/exe',            desc: 'Ruta del ejecutable (puede mostrar "deleted")' },
        { cmd: 'cat /proc/PID/status',            desc: 'Estado, memoria y UIDs del proceso' },
        { cmd: 'ls /proc/PID/fd/',                desc: 'Archivos abiertos por el proceso' },
      ],
      errors: [
        { msg: 'Permission denied', fix: 'Para ver /proc de procesos de otros usuarios necesitas root (sudo).' },
      ],
      security: 'Si /proc/PID/exe muestra "deleted", el proceso fue iniciado desde un archivo que ya fue borrado del disco — técnica típica de malware que se auto-elimina después de ejecutarse.',
    },
    {
      name: 'lsof',
      brief: 'List Open Files — archivos y conexiones abiertas por procesos',
      technical: 'lsof consulta las tablas del kernel de file descriptors. Puede listar archivos, sockets TCP/UDP, pipes y más.',
      simple: 'Muestra qué archivos tiene abiertos cada proceso, incluyendo conexiones de red. Fundamental para detectar backdoors.',
      syntax: [
        { cmd: 'lsof', flag: '-i',              desc: 'Todas las conexiones de red abiertas' },
        { cmd: 'lsof', flag: '-i :22',          desc: 'Procesos usando el puerto 22' },
        { cmd: 'lsof', flag: '-p PID',          desc: 'Archivos abiertos por un PID específico' },
        { cmd: 'lsof', flag: '-u usuario',      desc: 'Archivos abiertos por un usuario' },
        { cmd: 'lsof /tmp/',                    desc: 'Procesos con archivos en /tmp' },
      ],
      errors: [
        { msg: 'command not found: lsof', fix: 'lsof no está instalado. En sistemas reales: sudo apt install lsof' },
      ],
      security: 'lsof -i | grep LISTEN muestra todos los puertos en escucha con el proceso exacto. Más detallado que ss para investigación forense.',
    },
  ],
  lab: {
    title: 'Investigación de procesos sospechosos',
    context: 'El servidor tiene un uso de CPU inusualmente alto. Debes investigar qué proceso lo está causando y determinar si es malicioso.',
    duration: '30 min', xp: 200,
    steps: [
      {
        title: 'Identifica los procesos con mayor uso de recursos',
        body: 'Encuentra qué proceso está consumiendo más CPU.',
        commands: [{ cmd: 'ps aux --sort=-%cpu | head -10', explanation: 'Top 10 procesos ordenados por uso de CPU.' }],
        expected: 'bash, ps y procesos del sistema',
        technical: '--sort=-%cpu ordena descendentemente por CPU. El % indica porcentaje.',
        hints: ['$ ps aux --sort=-%cpu | head -10'],
      },
      {
        title: 'Busca procesos ejecutados desde /tmp',
        body: 'Los procesos en /tmp son sospechosos — es donde el malware suele operar.',
        commands: [{ cmd: "ps aux | awk '$11 ~ /\\/tmp/'", explanation: 'Filtra procesos cuyo ejecutable está en /tmp.' }],
        expected: '(sin resultados en sistema limpio)',
        technical: 'El malware frecuentemente se ejecuta desde /tmp porque ese directorio tiene permisos de escritura para todos.',
        hints: ["$ ps aux | awk '$11 ~ /\\/tmp/'"],
      },
      {
        title: 'Inspecciona tu proceso shell actual',
        body: 'Usa /proc para ver la información de tu proceso actual.',
        commands: [
          { cmd: 'echo "Mi PID: $$"', explanation: '$$ es el PID del shell actual.' },
          { cmd: 'cat /proc/$$/cmdline', explanation: 'El comando completo de tu shell.' },
          { cmd: 'ls -la /proc/$$/exe', explanation: 'El ejecutable del shell.' },
        ],
        expected: 'Mi PID: 1000\nbash\n/bin/bash',
        technical: '/proc/$$ accede al directorio del proceso actual. Esto es lo que haría un investigador para analizar un proceso sospechoso.',
        hints: ['$ echo $$', '$ cat /proc/$$/cmdline'],
      },
      {
        title: 'Ve las conexiones de red de tu shell',
        body: 'Examina qué conexiones tiene abiertas tu proceso.',
        commands: [{ cmd: 'ls /proc/$$/fd/', explanation: 'File descriptors del proceso: 0=stdin, 1=stdout, 2=stderr, y más.' }],
        expected: '0  1  2  255',
        technical: 'Los file descriptors son las "manos" del proceso. Un malware con conexiones de red tendrá FDs que apuntan a sockets.',
        hints: ['$ ls /proc/$$/fd/'],
      },
      {
        title: 'Crea un script de monitoreo de procesos',
        body: 'Automatiza la detección de procesos sospechosos.',
        commands: [
          { cmd: "cat > ~/scripts/monitor_procesos.sh << 'EOF'\n#!/bin/bash\necho \"=== MONITOREO DE PROCESOS SOSPECHOSOS ===\"\necho \"Fecha: $(date)\"\necho \"\"\necho \"[1] Procesos con alto uso de CPU (>10%):\" \nps aux | awk '$3 > 10 {print $1,$2,$3,$11}'\necho \"\"\necho \"[2] Procesos en /tmp:\"\nps aux | awk '$11 ~ /\\/tmp/ {print $0}'\necho \"\"\necho \"[3] Procesos escuchando en red:\"\nss -tlnp\nEOF", explanation: 'Script de monitoreo completo.' },
          { cmd: 'chmod +x ~/scripts/monitor_procesos.sh', explanation: 'Permisos de ejecución.' },
          { cmd: 'bash ~/scripts/monitor_procesos.sh', explanation: 'Ejecutar el monitoreo.' },
        ],
        expected: '=== MONITOREO DE PROCESOS SOSPECHOSOS ===',
        technical: 'Este script puede ejecutarse periódicamente con cron para detectar anomalías automáticamente.',
        hints: ['Crea el script con cat heredoc', '$ bash ~/scripts/monitor_procesos.sh'],
      },
    ],
    commonErrors: [
      { error: 'awk: syntax error', solution: "Asegúrate de que el patrón awk está entre comillas simples: awk '$3 > 10'" },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué indica que /proc/PID/exe muestra "(deleted)"?', options: ['El proceso terminó', 'El ejecutable fue borrado del disco después de iniciar el proceso — técnica de malware', 'Error del sistema', 'El proceso está en pausa'], correct: 1, explanation: 'El malware a menudo se auto-elimina del disco después de iniciarse para dificultar el análisis. El proceso sigue en memoria pero el ejecutable ya no existe en disco.' },
    { type: 'fill', question: 'Para ver los procesos con mayor uso de CPU: `ps aux --sort=___%cpu | head -10`', correct: ['-', '-%cpu'], explanation: '- indica orden descendente. --sort=-%cpu muestra el proceso con más CPU primero.' },
    { type: 'true_false', question: 'Un proceso ejecutándose desde /tmp es automáticamente malware.', correct: false, explanation: 'No es automáticamente malware, pero es altamente sospechoso. Los administradores deben investigar cualquier proceso ejecutándose desde /tmp, ya que los binarios legítimos se instalan en /usr/bin, /bin, etc.' },
    { type: 'multiple', question: '¿Qué herramienta muestra archivos abiertos Y conexiones de red por proceso?', options: ['ps aux', 'netstat', 'lsof', 'top'], correct: 2, explanation: 'lsof (List Open Files) muestra todos los recursos abiertos por procesos: archivos, sockets TCP/UDP, pipes, dispositivos.' },
    { type: 'multiple', question: 'Ves un proceso llamado "[kworker/u4:1]" con brackets que usa 95% de CPU. ¿Qué sospechas?', options: ['Es un hilo legítimo del kernel', 'Podría ser malware camuflado como proceso del kernel', 'Es un proceso de actualización', 'Es normal al 95% de CPU'], correct: 1, explanation: 'Los hilos del kernel en brackets son legítimos pero nunca usan 95% de CPU. Si lo hace, es probablemente malware usando este nombre para camuflarse.' },
  ],
  missions: [
    { id: 'm1d22', title: 'Top 10 procesos por CPU', description: 'ps aux --sort=-%cpu | head -10', hint: '$ ps aux --sort=-%cpu | head -10', xp: 30, condition: { type: 'command_executed', command: 'ps aux --sort=-%cpu | head -10' } },
    { id: 'm2d22', title: 'Busca procesos en /tmp', description: "ps aux | awk '$11 ~/\\/tmp/'", hint: "$ ps aux | awk '$11 ~ /\\/tmp/'", xp: 40, condition: { type: 'command_matches', pattern: "awk.*tmp" } },
    { id: 'm3d22', title: 'Inspecciona /proc de tu shell', description: 'cat /proc/$$/cmdline', hint: '$ cat /proc/$$/cmdline', xp: 35, condition: { type: 'command_matches', pattern: '/proc/\\$\\$/' } },
    { id: 'm4d22', title: 'Crea monitor_procesos.sh', description: 'Script de monitoreo en scripts/', hint: '$ touch ~/scripts/monitor_procesos.sh', xp: 50, condition: condFile('~/scripts/monitor_procesos.sh') },
  ],
  resources: [
    { name: 'Linux Process Analysis', url: 'https://www.redhat.com/sysadmin/linux-monitoring-and-troubleshooting', icon: '🔍' },
    { name: '/proc Filesystem', url: 'https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/proc.html', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 23 — Análisis de Conexiones de Red
// ─────────────────────────────────────────────────────────────
{
  day: 23, title: 'Análisis de Conexiones de Red',
  category: 'cyber', xp: 650,
  tags: ['red', 'ss', 'conexiones', 'C2', 'exfiltración', 'forense'],
  objectives: [
    'Analizar conexiones de red activas para detectar C2',
    'Identificar exfiltración de datos',
    'Correlacionar conexiones con procesos',
    'Detectar escaneos de red y reconocimiento',
    'Crear scripts de monitoreo de red',
  ],
  theory: {
    intro: 'La red es el canal de comunicación del malware. Un backdoor necesita conectarse al servidor del atacante (C2 - Command and Control). La exfiltración de datos viaja por la red. Monitorear las conexiones de red es fundamental para detectar un sistema comprometido.',
    sections: [
      {
        type: 'dual',
        technical: 'ss/netstat exponen las tablas de sockets del kernel. Una conexión ESTABLISHED indica comunicación activa. LISTEN indica servicio esperando conexiones. TIME-WAIT indica cierre de conexión. Las conexiones salientes a IPs externas no esperadas, especialmente en puertos no estándar, son IOCs (Indicators of Compromise).',
        simple: 'Imagina que tu servidor es una casa. ss te muestra todas las ventanas y puertas abiertas, y quién está pasando por cada una. Si ves una puerta abierta que no reconoces, o alguien saliendo por una ventana trasera a las 3am, algo está mal.',
      },
      {
        type: 'text',
        title: 'Indicadores de Compromiso en red',
        body: 'C2 (Command & Control): conexiones salientes periódicas a IPs externas, especialmente en puertos 443, 80 o no estándar como 4444, 8080. Exfiltración: transferencias de datos grandes salientes inusuales. Backdoor: nuevo puerto en escucha no autorizado. Lateral movement: conexiones SSH o SMB internas inusuales. Beacon: conexiones cortas y periódicas al mismo destino.',
      },
      {
        type: 'note',
        label: 'Whois y geolocalización de IPs',
        body: 'whois IP_ADDRESS muestra el propietario registrado de una IP. Una conexión saliente a una IP de un hosting de bajo costo en Rusia o China (no relacionada con tu negocio) es altamente sospechosa. curl https://ipinfo.io/IP_ADDR/json retorna país, organización y más datos de una IP.',
      },
    ],
    realCase: {
      title: 'Detectar beaconing de malware cada 5 minutos',
      body: 'Un análisis de red reveló que un servidor hacía conexiones HTTPS al mismo servidor externo cada 300 segundos exactos. Este patrón regular es "beaconing": el malware se comunica con su C2 (Command and Control) para recibir instrucciones. ss -tunap mostró que las conexiones venían del proceso "apache2", que había sido comprometido para inyectar el malware.',
    },
  },
  commands: [
    {
      name: 'ss -tunap',
      brief: 'Analizar todas las conexiones con proceso asociado',
      technical: 'ss lee las tablas de sockets del kernel via Netlink. -t=TCP, -u=UDP, -n=numérico, -a=all states, -p=proceso.',
      simple: 'La herramienta esencial para ver todas las conexiones de red y qué proceso las generó.',
      syntax: [
        { cmd: 'ss -tunap',                          desc: 'Todas las conexiones con proceso' },
        { cmd: 'ss -tunap | grep ESTAB',             desc: 'Solo conexiones activas' },
        { cmd: 'ss -tunap | grep -v 127.0.0.1',     desc: 'Excluir loopback (conexiones externas)' },
        { cmd: "ss -tunap | awk '$5 !~ /127.0.0.1|0.0.0.0/'", desc: 'Solo conexiones a IPs externas' },
        { cmd: 'ss -tlnp',                           desc: 'Solo puertos en escucha' },
      ],
      errors: [],
      security: "ss -tunap | grep ESTAB | grep -v '127.0.0.1\\|::1' muestra conexiones activas a IPs externas — potenciales conexiones C2.",
    },
    {
      name: 'netstat (legacy)',
      brief: 'Estadísticas de red (reemplazado por ss en sistemas modernos)',
      technical: 'netstat lee /proc/net/tcp, /proc/net/udp. Más lento que ss pero disponible en sistemas más antiguos.',
      simple: 'Versión clásica de ss. Útil en sistemas legacy o cuando ss no está disponible.',
      syntax: [
        { cmd: 'netstat', flag: '-tunap',            desc: 'Equivalente a ss -tunap' },
        { cmd: 'netstat', flag: '-an | grep LISTEN', desc: 'Puertos en escucha' },
        { cmd: "netstat -an | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head", desc: 'IPs más conectadas' },
      ],
      errors: [
        { msg: 'command not found: netstat', fix: 'netstat no está instalado. Usa ss. En sistemas reales: sudo apt install net-tools' },
      ],
      security: "netstat -an | grep '4444\\|1337\\|31337' detecta puertos típicos de backdoors y tools de hacking.",
    },
  ],
  lab: {
    title: 'Análisis de conexiones de red para detectar C2',
    context: 'El equipo de seguridad ha recibido alertas de tráfico de red inusual. Debes analizar las conexiones activas del servidor para determinar si hay comunicación con un servidor C2.',
    duration: '30 min', xp: 200,
    steps: [
      {
        title: 'Lista todas las conexiones activas',
        body: 'Obtén una vista completa de las conexiones de red.',
        commands: [{ cmd: 'ss -tunap', explanation: 'Todas las conexiones TCP y UDP con proceso.' }],
        expected: 'tcp ESTAB 192.168.1.105:22 192.168.1.100:52341 sshd',
        technical: 'ESTAB = establecida, LISTEN = escuchando, TIME-WAIT = cerrándose.',
        hints: ['$ ss -tunap'],
      },
      {
        title: 'Identifica conexiones a IPs externas',
        body: 'Filtra conexiones que van hacia afuera del servidor.',
        commands: [{ cmd: "ss -tunap | grep ESTAB | grep -v '127.0.0.1\\|0.0.0.0'", explanation: 'Conexiones establecidas excluyendo loopback.' }],
        expected: 'tcp ESTAB 192.168.1.105:22 192.168.1.100:52341',
        technical: 'Las conexiones a IPs externas son las más relevantes en análisis de C2.',
        hints: ["$ ss -tunap | grep ESTAB | grep -v '127.0.0.1'"],
      },
      {
        title: 'Correlaciona conexiones con procesos',
        body: 'Identifica qué proceso está detrás de cada conexión.',
        commands: [{ cmd: 'ss -tunap | grep sshd', explanation: 'Muestra solo las conexiones del proceso sshd.' }],
        expected: 'tcp ESTAB ... sshd',
        technical: 'El campo users:(("proceso",pid=X)) vincula la conexión con el proceso. Un proceso desconocido con conexiones externas es alarma roja.',
        hints: ['$ ss -tunap | grep sshd'],
      },
      {
        title: 'Verifica puertos sospechosos',
        body: 'Busca puertos típicos de backdoors y herramientas de hacking.',
        commands: [{ cmd: "ss -tunap | grep -E ':4444|:1337|:31337|:8080|:9999'", explanation: 'Puertos típicos de backdoors (Metasploit, netcat).' }],
        expected: '(sin resultados en sistema limpio)',
        technical: 'Puerto 4444 = Metasploit default handler. 1337 = "leet" usado en backdoors. 31337 = "eleet". Su presencia indica compromiso.',
        hints: ["$ ss -tunap | grep -E ':4444|:1337|:31337'"],
      },
      {
        title: 'Crea script de monitoreo de red',
        body: 'Automatiza el análisis de conexiones sospechosas.',
        commands: [
          { cmd: "cat > ~/scripts/monitor_red.sh << 'EOF'\n#!/bin/bash\necho \"=== ANÁLISIS DE RED: $(date) ===\"\necho \"\"\necho \"[CONEXIONES ACTIVAS]\"\nss -tunap | grep ESTAB\necho \"\"\necho \"[PUERTOS EN ESCUCHA]\"\nss -tlnp\necho \"\"\necho \"[PUERTOS SOSPECHOSOS]\"\nss -tunap | grep -E ':4444|:1337|:31337|:8080'\necho \"Sin puertos sospechosos detectados\"\nEOF", explanation: 'Script de análisis de red.' },
          { cmd: 'chmod +x ~/scripts/monitor_red.sh && bash ~/scripts/monitor_red.sh', explanation: 'Ejecutar el script.' },
        ],
        expected: '=== ANÁLISIS DE RED ===',
        technical: 'Este script puede integrarse con alertas por email o Slack para notificar en tiempo real.',
        hints: ['Crea y ejecuta el script de monitoreo de red'],
      },
    ],
    commonErrors: [
      { error: 'ss no muestra PIDs', solution: 'Para ver PIDs necesitas ser root o ejecutar con sudo ss -tunap.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué es el "beaconing" en el contexto de malware?', options: ['Escaneo de puertos', 'Comunicaciones periódicas y regulares del malware con su servidor C2', 'Ataque DDoS', 'Técnica de cifrado'], correct: 1, explanation: 'Beaconing es cuando el malware se comunica con su C2 (Command & Control) a intervalos regulares para recibir instrucciones o enviar datos.' },
    { type: 'fill', question: "Para ver todas las conexiones TCP activas con el proceso: `ss ___`", correct: ['-tunap', '-tanup', '-tuanp'], explanation: '-t=TCP, -u=UDP, -n=numérico, -a=all, -p=proceso. El orden de las flags no importa.' },
    { type: 'true_false', question: 'Una conexión saliente en el puerto 443 siempre es tráfico HTTPS legítimo.', correct: false, explanation: 'El malware frecuentemente usa el puerto 443 para comunicaciones C2 porque parece tráfico HTTPS legítimo y suele estar permitido en firewalls. El contenido puede ser cifrado con protocolo propio, no HTTP.' },
    { type: 'multiple', question: '¿Qué comando muestra qué proceso está usando el puerto 4444?', options: ['ps -port 4444', 'find /proc -port 4444', 'ss -tunap | grep :4444', 'lsof -port 4444'], correct: 2, explanation: "ss -tunap | grep :4444 filtra las conexiones en el puerto 4444 y muestra el proceso asociado en el campo users." },
    { type: 'multiple', question: '¿Cuál de estos puertos es típico de backdoors de Metasploit?', options: ['22', '80', '443', '4444'], correct: 3, explanation: 'El puerto 4444 es el handler por defecto de Metasploit. Aunque puede configurarse, muchos atacantes novatos lo dejan así, facilitando la detección.' },
  ],
  missions: [
    { id: 'm1d23', title: 'Analiza conexiones con ss -tunap', description: 'Ver todas las conexiones activas', hint: '$ ss -tunap', xp: 30, condition: { type: 'command_with_flag', command: 'ss', flag: '-tunap' } },
    { id: 'm2d23', title: 'Filtra conexiones ESTAB', description: 'ss -tunap | grep ESTAB', hint: '$ ss -tunap | grep ESTAB', xp: 35, condition: { type: 'command_executed', command: 'ss -tunap | grep ESTAB' } },
    { id: 'm3d23', title: 'Busca puertos de backdoor', description: "grep :4444|:1337|:31337", hint: "$ ss -tunap | grep -E ':4444|:1337|:31337'", xp: 40, condition: { type: 'command_matches', pattern: 'grep.*4444\\|1337' } },
    { id: 'm4d23', title: 'Crea monitor_red.sh', description: 'Script de monitoreo de red', hint: '$ touch ~/scripts/monitor_red.sh', xp: 50, condition: condFile('~/scripts/monitor_red.sh') },
  ],
  resources: [
    { name: 'Network Analysis Linux', url: 'https://www.cyberciti.biz/tips/linux-investigate-sockets-network-connections.html', icon: '🌐' },
    { name: 'MITRE ATT&CK - C2', url: 'https://attack.mitre.org/tactics/TA0011/', icon: '🎯' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 24 — Hardening Básico de Linux
// ─────────────────────────────────────────────────────────────
{
  day: 24, title: 'Hardening Básico de Linux',
  category: 'cyber', xp: 650,
  tags: ['hardening', 'seguridad', 'SSH', 'permisos', 'actualizaciones', 'CIS'],
  objectives: [
    'Aplicar configuración segura de SSH',
    'Gestionar actualizaciones de seguridad',
    'Configurar umask y permisos seguros',
    'Deshabilitar servicios innecesarios',
    'Crear un checklist de hardening',
  ],
  theory: {
    intro: 'Hardening es el proceso de reducir la superficie de ataque de un sistema. No existe el sistema 100% seguro, pero un sistema bien reforzado es exponencialmente más difícil de comprometer que uno con configuración por defecto.',
    sections: [
      {
        type: 'dual',
        technical: 'El hardening sigue el principio de mínimo privilegio y mínima superficie. CIS Benchmarks (Center for Internet Security) son los estándares más reconocidos para hardening de Linux. STIG (Security Technical Implementation Guide) es usado por el gobierno de EE.UU. Ambos cubren: usuarios, SSH, servicios, red, auditoría, y sistema de archivos.',
        simple: 'Hardening es como asegurar una casa: cerrar ventanas innecesarias, cambiar la cerradura predeterminada, añadir alarmas. En Linux: cerrar puertos, deshabilitar servicios, configurar SSH correctamente y mantener el sistema actualizado.',
      },
      {
        type: 'text',
        title: 'Checklist de hardening básico',
        body: '1. Actualizar el sistema (apt upgrade). 2. Configurar SSH: deshabilitar root, autenticación por clave, cambiar puerto. 3. Instalar y configurar UFW (firewall). 4. Deshabilitar servicios innecesarios. 5. Configurar fail2ban. 6. Establecer umask 027. 7. Configurar rotación de logs. 8. Monitorear con cron jobs. 9. Verificar archivos SUID/SGID. 10. Configurar PAM para contraseñas fuertes.',
      },
      {
        type: 'note',
        label: 'Actualizaciones: el hardening más importante',
        body: 'Mantener el sistema actualizado previene la mayoría de los ataques conocidos. apt update && apt upgrade parchea CVEs conocidos. unattended-upgrades puede automatizar actualizaciones de seguridad. En 2017, WannaCry infectó 200,000 sistemas con un exploit de SMB que ya tenía parche disponible hace 2 meses.',
      },
    ],
    diagram: {
      title: 'Capas de hardening en Linux',
      content: `┌─────────────────────────────────────┐
│         APLICACIONES                │  ← Actualizar, mínimo software
├─────────────────────────────────────┤
│           SERVICIOS                 │  ← Deshabilitar innecesarios
├─────────────────────────────────────┤
│           RED / FIREWALL            │  ← UFW, iptables, puertos mínimos
├─────────────────────────────────────┤
│      AUTENTICACIÓN / SSH            │  ← Claves, no root, fail2ban
├─────────────────────────────────────┤
│    USUARIOS Y PERMISOS              │  ← Mínimo privilegio, umask
├─────────────────────────────────────┤
│       SISTEMA BASE                  │  ← Kernel actualizado, SELinux
└─────────────────────────────────────┘`,
    },
    realCase: {
      title: 'CIS Benchmark: 300 controles de seguridad automatizados',
      body: 'El CIS Ubuntu Linux Benchmark tiene más de 300 controles de seguridad. Herramientas como Lynis, OpenSCAP y Chef InSpec pueden evaluar automáticamente el cumplimiento. Una empresa que implementó CIS Level 2 redujo su superficie de ataque en un 70% según su evaluación de riesgos.',
    },
  },
  commands: [
    {
      name: 'Hardening de SSH',
      brief: 'Configurar sshd_config para máxima seguridad',
      technical: 'sshd_config controla todos los aspectos del servidor SSH. Cada directiva incorrecta puede ser un vector de ataque.',
      simple: 'Configura SSH para que solo permita conexiones seguras y rechace intentos de fuerza bruta.',
      syntax: [
        { cmd: "grep -E 'PermitRootLogin|PasswordAuth|MaxAuthTries|Port' /etc/ssh/sshd_config", desc: 'Ver directivas clave de seguridad SSH' },
        { cmd: "grep -v '^#\\|^$' /etc/ssh/sshd_config", desc: 'Configuración activa sin comentarios' },
        { cmd: 'systemctl status ssh', desc: 'Estado del servicio SSH' },
      ],
      errors: [],
      security: 'Configuración mínima segura: PermitRootLogin no, PasswordAuthentication no, MaxAuthTries 3, LoginGraceTime 20.',
    },
    {
      name: 'find para auditar permisos',
      brief: 'Encontrar archivos con permisos peligrosos',
      technical: 'Los archivos con permisos incorrectos son vectores de ataque. SUID, world-writable y archivos sin propietario son especialmente peligrosos.',
      simple: 'Busca archivos que cualquiera puede escribir o que tienen permisos especiales que podrían ser explotados.',
      syntax: [
        { cmd: 'find / -perm -4000 -type f 2>/dev/null',    desc: 'Archivos con SUID' },
        { cmd: 'find / -perm -2000 -type f 2>/dev/null',    desc: 'Archivos con SGID' },
        { cmd: 'find / -perm -0002 -type f 2>/dev/null',    desc: 'Archivos world-writable (peligrosos)' },
        { cmd: 'find / -nouser -o -nogroup 2>/dev/null',    desc: 'Archivos sin propietario (posible malware)' },
      ],
      errors: [],
      security: 'Los archivos world-writable en directorios del sistema permiten a cualquier usuario modificar configuraciones o inyectar código.',
    },
  ],
  lab: {
    title: 'Auditoría de hardening del servidor',
    context: 'Debes realizar una auditoría de seguridad del servidor y documentar qué controles de hardening están aplicados y cuáles faltan.',
    duration: '35 min', xp: 200,
    steps: [
      {
        title: 'Audita la configuración SSH',
        body: 'Verifica que SSH está configurado de forma segura.',
        commands: [
          { cmd: "grep -E 'PermitRootLogin|PasswordAuthentication|MaxAuthTries|Port' /etc/ssh/sshd_config", explanation: 'Muestra las directivas de seguridad críticas de SSH.' },
        ],
        expected: 'PermitRootLogin prohibit-password\n#PasswordAuthentication yes\nPort 22',
        technical: 'PermitRootLogin no es mejor que prohibit-password. PasswordAuthentication no fuerza el uso de claves.',
        hints: ["$ grep -E 'PermitRootLogin|PasswordAuth' /etc/ssh/sshd_config"],
      },
      {
        title: 'Busca archivos SUID no estándar',
        body: 'Identifica archivos con SUID que no son parte del sistema base.',
        commands: [{ cmd: 'find /home /tmp /var -perm -4000 -type f 2>/dev/null', explanation: 'SUID en directorios no estándar — muy sospechoso.' }],
        expected: '(sin resultados en sistema limpio)',
        technical: 'Archivos SUID en /home, /tmp o /var son señal de que un atacante instaló un backdoor con escalada de privilegios.',
        hints: ['$ find /home /tmp /var -perm -4000 -type f 2>/dev/null'],
      },
      {
        title: 'Verifica archivos world-writable',
        body: 'Busca archivos que cualquier usuario puede modificar.',
        commands: [{ cmd: 'find /etc -perm -0002 -type f 2>/dev/null', explanation: 'Archivos de configuración escribibles por todos.' }],
        expected: '(sin resultados en sistema correctamente configurado)',
        technical: 'Un /etc/passwd world-writable permitiría a cualquier usuario añadir una cuenta root. Esto es crítico.',
        hints: ['$ find /etc -perm -0002 -type f 2>/dev/null'],
      },
      {
        title: 'Verifica servicios en escucha',
        body: 'Identifica servicios que exponen superficie de ataque innecesaria.',
        commands: [{ cmd: 'ss -tlnp', explanation: 'Puertos TCP en escucha con proceso.' }],
        expected: 'LISTEN :22 sshd\nLISTEN :631 cupsd (CUPS - impresoras, innecesario en servidor)',
        technical: 'CUPS (impresoras) en un servidor remoto es innecesario y añade superficie de ataque. Debería deshabilitarse.',
        hints: ['$ ss -tlnp'],
      },
      {
        title: 'Crea el script de auditoría de hardening',
        body: 'Automatiza la verificación de controles de seguridad.',
        commands: [
          { cmd: "cat > ~/scripts/hardening_audit.sh << 'EOF'\n#!/bin/bash\necho \"=== AUDITORÍA DE HARDENING: $(date) ===\"\necho \"\"\necho \"[SSH]\"\ngrep -E 'PermitRootLogin|PasswordAuth|MaxAuth' /etc/ssh/sshd_config | grep -v '^#'\necho \"\"\necho \"[SUID en /tmp y /home]\"\nfind /tmp /home -perm -4000 -type f 2>/dev/null || echo \"Sin SUID sospechosos\"\necho \"\"\necho \"[Archivos world-writable en /etc]\"\nfind /etc -perm -0002 -type f 2>/dev/null || echo \"Sin world-writable en /etc\"\necho \"\"\necho \"[Servicios en escucha]\"\nss -tlnp\nEOF", explanation: 'Script completo de auditoría.' },
          { cmd: 'chmod +x ~/scripts/hardening_audit.sh && bash ~/scripts/hardening_audit.sh', explanation: 'Ejecutar la auditoría.' },
        ],
        expected: '=== AUDITORÍA DE HARDENING ===',
        technical: 'Este script puede programarse con cron para ejecutarse semanalmente y enviar el reporte por email.',
        hints: ['Crea y ejecuta el script de auditoría'],
      },
    ],
    commonErrors: [
      { error: 'Muchos archivos SUID en el sistema', solution: 'Compara con la lista baseline de tu distribución. sudo, passwd y su son legítimos. Cualquier otro en /tmp o /home no lo es.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Cuál es la configuración SSH más segura para el acceso root?', options: ['PermitRootLogin yes', 'PermitRootLogin no', 'PermitRootLogin prohibit-password', 'RootLogin disabled'], correct: 1, explanation: 'PermitRootLogin no deshabilita completamente el acceso SSH de root. prohibit-password permite solo con clave pero no con contraseña.' },
    { type: 'fill', question: 'Para buscar archivos world-writable (cualquiera puede escribir): `find / -perm ___ -type f`', correct: ['-0002', '-2'], explanation: '-perm -0002 (o -perm -2) encuentra archivos donde el bit de escritura para "otros" está activado. Peligroso en archivos de sistema.' },
    { type: 'true_false', question: 'Mantener el sistema actualizado es la medida de hardening más efectiva en términos de coste-beneficio.', correct: true, explanation: 'La mayoría de los ataques exitosos explotan vulnerabilidades con parche disponible. apt upgrade es gratis y previene el 80% de los ataques conocidos.' },
    { type: 'multiple', question: '¿Qué hace fail2ban?', options: ['Cifra el sistema de archivos', 'Bloquea automáticamente IPs con múltiples intentos fallidos de login', 'Hace backup automático', 'Escanea por malware'], correct: 1, explanation: 'fail2ban monitorea auth.log y bloquea temporalmente IPs que superan un umbral de intentos fallidos usando reglas de iptables.' },
    { type: 'multiple', question: 'Un archivo en /tmp con bit SUID y propietario root es:', options: ['Normal en Linux', 'Un archivo temporal del sistema', 'Altamente sospechoso, posible escalada de privilegios', 'Un archivo de swap'], correct: 2, explanation: 'Archivos SUID de root en /tmp nunca son legítimos. Permiten a cualquier usuario ejecutar código como root. Es la técnica más clásica de escalada de privilegios.' },
  ],
  missions: [
    { id: 'm1d24', title: 'Audita config SSH', description: "grep -E 'PermitRootLogin|PasswordAuth' sshd_config", hint: "$ grep -E 'PermitRootLogin|PasswordAuth' /etc/ssh/sshd_config", xp: 35, condition: { type: 'command_executed', command: "grep -E 'PermitRootLogin|PasswordAuth' /etc/ssh/sshd_config" } },
    { id: 'm2d24', title: 'Busca SUID en /tmp y /home', description: 'find /tmp /home -perm -4000', hint: '$ find /tmp /home -perm -4000 -type f 2>/dev/null', xp: 40, condition: { type: 'command_matches', pattern: 'find.*-perm.*4000' } },
    { id: 'm3d24', title: 'Busca world-writable en /etc', description: 'find /etc -perm -0002', hint: '$ find /etc -perm -0002 -type f 2>/dev/null', xp: 40, condition: { type: 'command_matches', pattern: 'find.*-perm.*0002' } },
    { id: 'm4d24', title: 'Crea hardening_audit.sh', description: 'Script completo de auditoría', hint: '$ touch ~/scripts/hardening_audit.sh', xp: 50, condition: condFile('~/scripts/hardening_audit.sh') },
  ],
  resources: [
    { name: 'CIS Ubuntu Benchmark', url: 'https://www.cisecurity.org/benchmark/ubuntu_linux', icon: '🛡️' },
    { name: 'Lynis Security Auditor', url: 'https://cisofy.com/lynis/', icon: '🔍' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 25 — Auditoría del Sistema con Herramientas
// ─────────────────────────────────────────────────────────────
{
  day: 25, title: 'Auditoría del Sistema con Herramientas',
  category: 'cyber', xp: 700,
  tags: ['auditoría', 'lynis', 'rkhunter', 'chkrootkit', 'integridad'],
  objectives: [
    'Usar herramientas de auditoría como rkhunter',
    'Verificar integridad del sistema de archivos',
    'Detectar rootkits y modificaciones no autorizadas',
    'Crear un baseline de seguridad',
    'Interpretar y actuar sobre los resultados de auditoría',
  ],
  theory: {
    intro: 'Una auditoría de seguridad es una evaluación sistemática del estado de seguridad de un sistema. Herramientas automatizadas pueden verificar cientos de controles en minutos, identificando vulnerabilidades y desviaciones de las mejores prácticas.',
    sections: [
      {
        type: 'dual',
        technical: 'rkhunter (Rootkit Hunter) calcula hashes MD5 de archivos críticos del sistema en un baseline, luego compara periódicamente. chkrootkit examina binarios y el kernel buscando firmas de rootkits conocidos. Lynis realiza más de 300 pruebas de seguridad y genera un score de hardening.',
        simple: 'Estas herramientas son como un inspector de seguridad automatizado. Comprueban miles de cosas: si alguien modificó los comandos del sistema, si hay malware conocido, si los permisos son correctos. Te dan un reporte con todo lo que encontraron.',
      },
      {
        type: 'text',
        title: 'Baseline de seguridad',
        body: 'Un baseline es una instantánea del estado conocido-bueno del sistema. Se crea justo después de instalar y configurar el sistema. Luego se compara periódicamente con el estado actual. Cualquier diferencia es una anomalía que debe investigarse. sha256sum de todos los binarios críticos es el baseline más simple.',
      },
      {
        type: 'note',
        label: 'Detección de rootkits',
        body: 'Los rootkits modifican el kernel o los binarios del sistema para ocultar su presencia. rkhunter detecta: comandos del sistema modificados (ls, ps que ocultan archivos), módulos del kernel sospechosos, archivos ocultos en directorios, backdoors de red. La detección es difícil si el rootkit ya está instalado y ha comprometido las herramientas.',
      },
    ],
    realCase: {
      title: 'Detectar un rootkit que ocultaba procesos y conexiones',
      body: 'Un administrador notó que ps y netstat no mostraban ciertos procesos. Ejecutando rkhunter --check, detectó que los binarios de ps, netstat y ls habían sido reemplazados por versiones modificadas. El rootkit Azazel había comprometido estas herramientas para ocultar el malware. La solución fue reiniciar con un live CD y restaurar desde backup limpio.',
    },
  },
  commands: [
    {
      name: 'sha256sum (baseline de integridad)',
      brief: 'Crear y verificar baseline de integridad de archivos críticos',
      technical: 'Calcula hashes SHA-256 de archivos. Si un binario crítico es modificado por un rootkit, su hash cambia, revelando la modificación.',
      simple: 'Crea una "huella dactilar" de los archivos del sistema. Si alguien los modifica, la huella cambia y puedes detectarlo.',
      syntax: [
        { cmd: 'sha256sum /bin/ls /bin/ps /usr/bin/find > ~/baseline.txt',   desc: 'Crear baseline de binarios críticos' },
        { cmd: 'sha256sum -c ~/baseline.txt',                                 desc: 'Verificar integridad contra baseline' },
        { cmd: 'sha256sum /bin/*  > ~/bin_baseline.txt',                     desc: 'Baseline de todos los binarios en /bin' },
      ],
      errors: [],
      security: 'Un baseline de sha256sum de /bin, /usr/bin, /sbin es la defensa más básica contra rootkits que modifican herramientas del sistema.',
    },
    {
      name: 'find para detectar anomalías',
      brief: 'Usar find para detectar modificaciones recientes y archivos sospechosos',
      technical: 'find con -newer, -mtime y -ctime permite encontrar archivos modificados en un rango de tiempo específico.',
      simple: 'Busca archivos que fueron modificados recientemente o tienen características sospechosas.',
      syntax: [
        { cmd: 'find /bin /usr/bin /sbin -newer /etc/passwd',          desc: 'Binarios modificados después del sistema' },
        { cmd: 'find / -name ".*" -not -path "*/.*/*" 2>/dev/null',   desc: 'Archivos ocultos en raíz de directorios' },
        { cmd: 'find /tmp -type f -mtime -1',                          desc: 'Archivos en /tmp modificados en las últimas 24h' },
        { cmd: 'find / -size +10M -not -path "/proc/*" 2>/dev/null',  desc: 'Archivos grandes sospechosos' },
      ],
      errors: [],
      security: 'find /bin -newer /var/log/dpkg.log detecta binarios del sistema modificados después de la última actualización de paquetes.',
    },
  ],
  lab: {
    title: 'Creación y verificación de baseline de seguridad',
    context: 'Debes crear un baseline de seguridad del servidor y verificar la integridad del sistema de archivos para detectar posibles modificaciones no autorizadas.',
    duration: '35 min', xp: 200,
    steps: [
      {
        title: 'Crea el baseline de binarios críticos',
        body: 'Genera hashes SHA-256 de los comandos más importantes del sistema.',
        commands: [
          { cmd: 'sha256sum /bin/ls /bin/ps /usr/bin/find /bin/grep /usr/bin/awk > ~/laboratorios/baseline_sistema.txt', explanation: 'Crea el archivo de baseline con hashes.' },
          { cmd: 'cat ~/laboratorios/baseline_sistema.txt', explanation: 'Ver el baseline creado.' },
        ],
        expected: 'abc123... /bin/ls\ndef456... /bin/ps',
        technical: 'Este baseline debe guardarse en un lugar seguro (fuera del servidor, en un servidor de monitoreo). Si el servidor es comprometido, el atacante podría modificar también el baseline.',
        hints: ['$ sha256sum /bin/ls /bin/ps /usr/bin/find > ~/laboratorios/baseline_sistema.txt'],
      },
      {
        title: 'Verifica la integridad actual',
        body: 'Compara el estado actual con el baseline.',
        commands: [{ cmd: 'sha256sum -c ~/laboratorios/baseline_sistema.txt', explanation: '-c verifica los hashes contra los archivos actuales.' }],
        expected: '/bin/ls: OK\n/bin/ps: OK\n/usr/bin/find: OK',
        technical: 'OK = archivo íntegro. FAILED = archivo modificado desde el baseline. En un sistema comprometido, verías FAILED en comandos como ps o ls.',
        hints: ['$ sha256sum -c ~/laboratorios/baseline_sistema.txt'],
      },
      {
        title: 'Busca binarios modificados recientemente',
        body: 'Detecta binarios del sistema que fueron modificados después de la última actualización.',
        commands: [{ cmd: 'find /usr/bin /bin -newer /etc/passwd -type f', explanation: 'Binarios más recientes que /etc/passwd (modificado al crear el usuario).' }],
        expected: 'Binarios del sistema (sin modificaciones sospechosas)',
        technical: '/etc/passwd se actualiza cuando se crea un usuario. Los binarios del sistema no deberían ser más nuevos que la instalación del sistema.',
        hints: ['$ find /usr/bin /bin -newer /etc/passwd -type f'],
      },
      {
        title: 'Busca archivos ocultos sospechosos',
        body: 'Detecta archivos ocultos en directorios del sistema.',
        commands: [{ cmd: 'find /tmp /var/tmp /dev/shm -name ".*" -type f 2>/dev/null', explanation: 'Archivos ocultos en directorios temporales.' }],
        expected: '(sin resultados en sistema limpio)',
        technical: 'Los archivos ocultos (empiezan con .) en /tmp son típicos de malware que intenta pasar desapercibido.',
        hints: ['$ find /tmp -name ".*" -type f 2>/dev/null'],
      },
      {
        title: 'Crea el script de verificación de integridad',
        body: 'Automatiza la verificación del baseline.',
        commands: [
          { cmd: "cat > ~/scripts/verificar_integridad.sh << 'EOF'\n#!/bin/bash\nBASELINE=\"$HOME/laboratorios/baseline_sistema.txt\"\necho \"=== VERIFICACIÓN DE INTEGRIDAD: $(date) ===\"\nif [ ! -f \"$BASELINE\" ]; then\n  echo \"[AVISO] Baseline no encontrado. Creando...\"\n  sha256sum /bin/ls /bin/ps /usr/bin/find /bin/grep > \"$BASELINE\"\n  echo \"Baseline creado.\"\nelse\n  echo \"[VERIFICANDO] Comparando con baseline...\"\n  sha256sum -c \"$BASELINE\"\nfi\nEOF", explanation: 'Script que crea o verifica el baseline.' },
          { cmd: 'chmod +x ~/scripts/verificar_integridad.sh && bash ~/scripts/verificar_integridad.sh', explanation: 'Ejecutar el script.' },
        ],
        expected: '=== VERIFICACIÓN DE INTEGRIDAD ===\n/bin/ls: OK',
        technical: 'Este script puede ejecutarse diariamente con cron. Si algún archivo falla, debe enviarse una alerta inmediata.',
        hints: ['Crea y ejecuta el script de verificación'],
      },
    ],
    commonErrors: [
      { error: 'sha256sum: archivo: No such file or directory', solution: 'El archivo del baseline no existe. Créalo primero con sha256sum archivos > baseline.txt' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué es un baseline de seguridad?', options: ['Un tipo de firewall', 'Una instantánea del estado conocido-bueno del sistema para detectar cambios', 'Un informe de vulnerabilidades', 'Una configuración mínima de seguridad'], correct: 1, explanation: 'El baseline captura el estado del sistema cuando está limpio. Comparando periódicamente, se detectan modificaciones no autorizadas.' },
    { type: 'fill', question: 'Para verificar que los archivos del baseline no han sido modificados: `sha256sum ___ baseline.txt`', correct: ['-c'], explanation: '-c (check) lee el archivo de checksums y verifica que cada archivo referenciado tiene el hash correcto.' },
    { type: 'true_false', question: 'Si el sistema está comprometido con un rootkit, las herramientas como ps y ls siempre mostrarán información correcta.', correct: false, explanation: 'Los rootkits modifican o reemplazan herramientas como ps, ls y netstat para ocultar su presencia. Por eso el baseline de sha256sum de estos binarios es crucial.' },
    { type: 'multiple', question: '¿Por qué el baseline de sha256sum debe guardarse fuera del servidor monitorizado?', options: ['Por espacio en disco', 'Porque si el servidor es comprometido el atacante puede modificar el baseline', 'Por velocidad', 'Por licencias'], correct: 1, explanation: 'Si el baseline está en el mismo servidor, un atacante con acceso puede modificarlo para que la verificación siempre diga OK aunque haya modificado archivos.' },
    { type: 'multiple', question: '¿Qué indica "FAILED" en la salida de sha256sum -c baseline.txt?', options: ['El archivo fue eliminado', 'El archivo fue modificado desde que se creó el baseline', 'El archivo tiene permisos incorrectos', 'Error de red'], correct: 1, explanation: 'FAILED significa que el hash actual del archivo no coincide con el guardado en el baseline. El archivo fue modificado — posible compromiso del sistema.' },
  ],
  missions: [
    { id: 'm1d25', title: 'Crea baseline de binarios', description: 'sha256sum /bin/ls /bin/ps > baseline.txt', hint: '$ sha256sum /bin/ls /bin/ps /usr/bin/find > ~/laboratorios/baseline_sistema.txt', xp: 40, condition: condFile('~/laboratorios/baseline_sistema.txt') },
    { id: 'm2d25', title: 'Verifica el baseline', description: 'sha256sum -c baseline.txt', hint: '$ sha256sum -c ~/laboratorios/baseline_sistema.txt', xp: 40, condition: { type: 'command_matches', pattern: 'sha256sum -c' } },
    { id: 'm3d25', title: 'Busca archivos ocultos en /tmp', description: 'find /tmp -name ".*"', hint: '$ find /tmp -name ".*" -type f 2>/dev/null', xp: 35, condition: { type: 'command_matches', pattern: 'find.*\\.\\*' } },
    { id: 'm4d25', title: 'Crea verificar_integridad.sh', description: 'Script de verificación automática', hint: '$ touch ~/scripts/verificar_integridad.sh', xp: 50, condition: condFile('~/scripts/verificar_integridad.sh') },
  ],
  resources: [
    { name: 'rkhunter', url: 'https://rkhunter.sourceforge.net/', icon: '🔍' },
    { name: 'Lynis Security Tool', url: 'https://cisofy.com/lynis/', icon: '🛡️' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 26 — Detección de Intrusos con Bash
// ─────────────────────────────────────────────────────────────
{
  day: 26, title: 'Detección de Intrusos con Bash',
  category: 'cyber', xp: 700,
  tags: ['IDS', 'detección', 'alertas', 'bash', 'automatización', 'IOC'],
  objectives: [
    'Crear un IDS simple con scripts bash',
    'Detectar indicadores de compromiso (IOC) automáticamente',
    'Configurar alertas por cambios en el sistema',
    'Monitorear logs en tiempo real con patrones',
    'Integrar múltiples verificaciones en un script de respuesta',
  ],
  theory: {
    intro: 'Un IDS (Intrusion Detection System) monitorea el sistema buscando señales de ataque. Herramientas comerciales como Snort, Suricata o OSSEC existen, pero entender cómo construir uno básico con bash te da un conocimiento profundo de cómo funciona la detección de intrusos.',
    sections: [
      {
        type: 'dual',
        technical: 'Un IDS basado en host (HIDS) monitorea: integridad de archivos (AIDE, Tripwire), logs del sistema (análisis de patrones), conexiones de red (comparación con whitelist), procesos (comparación con baseline). inotifywait puede detectar cambios en archivos en tiempo real usando inotify del kernel.',
        simple: 'Imagina que pones sensores de movimiento en tu casa: si alguien abre una puerta que no debería, suena la alarma. Tu IDS bash hace lo mismo: monitorea cambios en archivos críticos, conexiones de red inusuales y patrones en logs.',
      },
      {
        type: 'text',
        title: 'Indicadores de Compromiso (IOC)',
        body: 'IOCs son evidencias de que un sistema ha sido comprometido: nuevo usuario creado sin autorización, cambio en /etc/passwd o /etc/shadow, nuevas reglas de cron, archivo SUID no en baseline, conexión saliente a IP desconocida, proceso en /tmp, módulo de kernel cargado fuera de horario, eliminación de logs.',
      },
      {
        type: 'note',
        label: 'La diferencia entre IDS e IPS',
        body: 'IDS (Detection): detecta y alerta pero no actúa. IPS (Prevention): detecta Y bloquea automáticamente. fail2ban es un IPS simple: detecta fuerza bruta y bloquea la IP con iptables. Un IDS bien configurado puede evolucionar a IPS añadiendo acciones de respuesta automática a los scripts de detección.',
      },
    ],
    realCase: {
      title: 'Script bash que detectó un atacante en 90 segundos',
      body: 'Un administrador configuró un script que monitoreaba /etc/passwd cada 60 segundos. A las 3:17am, el script detectó que se había añadido una nueva línea a /etc/passwd (nuevo usuario backdoor). Inmediatamente envió una alerta por email y SMS. El atacante fue bloqueado antes de poder usar la cuenta backdoor.',
    },
  },
  commands: [
    {
      name: 'Script IDS: monitoreo de /etc/passwd',
      brief: 'Detectar cambios no autorizados en /etc/passwd',
      technical: 'Compara el hash SHA-256 de /etc/passwd con un baseline guardado. Si difieren, hay una modificación no autorizada.',
      simple: 'Un script que verifica cada hora si alguien añadió o modificó usuarios del sistema.',
      syntax: [
        { cmd: 'sha256sum /etc/passwd > /tmp/passwd.baseline', desc: 'Crear baseline de passwd' },
        { cmd: "sha256sum -c /tmp/passwd.baseline 2>&1 | grep -q FAILED && echo 'ALERTA'", desc: 'Verificar cambios' },
        { cmd: 'diff <(sha256sum /etc/passwd) /tmp/passwd.baseline', desc: 'Comparar directamente' },
      ],
      errors: [],
      security: 'Monitorear /etc/passwd, /etc/shadow, /etc/sudoers y el crontab de root son los controles más importantes de un IDS de host básico.',
    },
    {
      name: 'tail -f con alertas en tiempo real',
      brief: 'Monitorear logs y generar alertas automáticas',
      technical: 'tail -f + grep + while permite procesar logs en streaming y actuar sobre patrones específicos.',
      simple: 'Vigila los logs en tiempo real y ejecuta una acción cuando detecta algo sospechoso.',
      syntax: [
        { cmd: "tail -f /var/log/auth.log | grep --line-buffered 'Failed password'", desc: 'Alertar sobre intentos fallidos' },
        { cmd: "tail -f auth.log | while read line; do echo $line | grep -q 'Failed' && echo 'ALERTA: $line'; done", desc: 'Procesar y alertar en tiempo real' },
      ],
      errors: [],
      security: "tail -f /var/log/auth.log | grep --line-buffered 'Failed password' | awk '{print $11}' monitorea IPs atacantes en tiempo real.",
    },
  ],
  lab: {
    title: 'Construir un IDS simple con bash',
    context: 'Crearás un sistema básico de detección de intrusos usando bash que monitorea los principales vectores de ataque y genera alertas.',
    duration: '40 min', xp: 200,
    steps: [
      {
        title: 'Crea el baseline del IDS',
        body: 'Establece el estado conocido-bueno del sistema.',
        commands: [
          { cmd: 'mkdir -p ~/laboratorios/ids_baseline', explanation: 'Directorio para el baseline del IDS.' },
          { cmd: 'sha256sum /etc/passwd /etc/group /etc/hosts > ~/laboratorios/ids_baseline/archivos_criticos.sha256', explanation: 'Hash de archivos críticos del sistema.' },
          { cmd: 'crontab -l > ~/laboratorios/ids_baseline/crontab_baseline.txt 2>/dev/null || echo "" > ~/laboratorios/ids_baseline/crontab_baseline.txt', explanation: 'Baseline del crontab.' },
          { cmd: 'ss -tlnp > ~/laboratorios/ids_baseline/puertos_baseline.txt', explanation: 'Baseline de puertos en escucha.' },
        ],
        expected: 'Baseline del IDS creado en ids_baseline/',
        technical: 'El baseline captura el estado normal del sistema. Cualquier desviación se convierte en una alerta.',
        hints: ['Crea el directorio y los archivos de baseline'],
      },
      {
        title: 'Crea la función de verificación de archivos',
        body: 'Detecta cambios en archivos críticos del sistema.',
        commands: [
          { cmd: "cat > ~/scripts/ids_archivos.sh << 'EOF'\n#!/bin/bash\nBASELINE=\"$HOME/laboratorios/ids_baseline/archivos_criticos.sha256\"\necho \"[$(date +%H:%M:%S)] Verificando integridad de archivos críticos...\"\nRESULT=$(sha256sum -c \"$BASELINE\" 2>&1)\nif echo \"$RESULT\" | grep -q 'FAILED'; then\n  echo \"🚨 ALERTA CRÍTICA: Archivo del sistema modificado!\"\n  echo \"$RESULT\" | grep FAILED\nelse\n  echo \"✅ Integridad OK: sin cambios detectados\"\nfi\nEOF", explanation: 'Script de verificación de integridad.' },
          { cmd: 'chmod +x ~/scripts/ids_archivos.sh && bash ~/scripts/ids_archivos.sh', explanation: 'Ejecutar verificación.' },
        ],
        expected: '✅ Integridad OK: sin cambios detectados',
        technical: 'Si el script detectara FAILED, indicaría que /etc/passwd u otro archivo crítico fue modificado.',
        hints: ['Crea el script y ejecútalo'],
      },
      {
        title: 'Crea el detector de nuevas conexiones',
        body: 'Detecta puertos en escucha que no estaban en el baseline.',
        commands: [
          { cmd: "cat > ~/scripts/ids_red.sh << 'EOF'\n#!/bin/bash\nBASELINE=\"$HOME/laboratorios/ids_baseline/puertos_baseline.txt\"\nACTUAL=$(mktemp)\nss -tlnp > \"$ACTUAL\"\necho \"[$(date +%H:%M:%S)] Verificando puertos en escucha...\"\nNUEVOS=$(diff \"$BASELINE\" \"$ACTUAL\" | grep '^>' | grep LISTEN)\nif [ -n \"$NUEVOS\" ]; then\n  echo \"🚨 ALERTA: Nuevos puertos en escucha detectados!\"\n  echo \"$NUEVOS\"\nelse\n  echo \"✅ Red OK: sin nuevos puertos\"\nfi\nrm \"$ACTUAL\"\nEOF", explanation: 'Script de monitoreo de puertos.' },
          { cmd: 'chmod +x ~/scripts/ids_red.sh && bash ~/scripts/ids_red.sh', explanation: 'Ejecutar verificación de red.' },
        ],
        expected: '✅ Red OK: sin nuevos puertos',
        technical: 'Un nuevo puerto en escucha no presente en el baseline puede indicar un backdoor instalado por un atacante.',
        hints: ['Crea y ejecuta el script de red'],
      },
      {
        title: 'Crea el IDS maestro',
        body: 'Un script que integra todas las verificaciones.',
        commands: [
          { cmd: "cat > ~/scripts/ids_master.sh << 'EOF'\n#!/bin/bash\necho \"========================================\"\necho \" IDS LINUX - $(date)\"\necho \"========================================\"\nbash ~/scripts/ids_archivos.sh\necho \"\"\nbash ~/scripts/ids_red.sh\necho \"\"\necho \"[PROCESOS EN /tmp]\"\nPS_TMP=$(ps aux | awk '$11 ~ /\\/tmp/')\nif [ -n \"$PS_TMP\" ]; then\n  echo \"🚨 ALERTA: Procesos ejecutándose desde /tmp!\"\n  echo \"$PS_TMP\"\nelse\n  echo \"✅ Sin procesos sospechosos en /tmp\"\nfi\necho \"\"\necho \"[INTENTOS FALLIDOS SSH HOY]\"\nFAILED=$(grep -c 'Failed password' /var/log/auth.log 2>/dev/null || echo 0)\necho \"Total intentos fallidos: $FAILED\"\n[ \"$FAILED\" -gt 10 ] && echo \"⚠️  AVISO: Más de 10 intentos fallidos\"\nEOF", explanation: 'IDS maestro que integra todos los módulos.' },
          { cmd: 'chmod +x ~/scripts/ids_master.sh && bash ~/scripts/ids_master.sh', explanation: 'Ejecutar el IDS completo.' },
        ],
        expected: '=== IDS LINUX ===\n✅ Integridad OK\n✅ Red OK\n✅ Sin procesos sospechosos',
        technical: 'Este IDS puede programarse en cron para ejecutarse cada 15 minutos y enviar alertas por email.',
        hints: ['Crea el IDS maestro y ejecútalo'],
      },
      {
        title: 'Programa el IDS en cron',
        body: 'Configura el IDS para ejecutarse automáticamente.',
        commands: [
          { cmd: 'echo "Ver los cron jobs actuales:"', explanation: 'Verificar crontab.' },
          { cmd: 'crontab -l', explanation: 'Listar cron jobs del usuario.' },
        ],
        expected: '# Crontab del usuario estudiante\n0 2 * * * /home/estudiante/scripts/backup.sh',
        technical: 'Para programar: (crontab -l ; echo "*/15 * * * * /home/estudiante/scripts/ids_master.sh >> /tmp/ids.log 2>&1") | crontab -',
        hints: ['$ crontab -l para ver los cron jobs actuales'],
      },
    ],
    commonErrors: [
      { error: 'diff muestra demasiados cambios', solution: 'El baseline puede haber sido creado con un estado diferente. Recrea el baseline en el estado actual.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Cuál es la diferencia principal entre un IDS y un IPS?', options: ['El IDS es de pago, el IPS gratuito', 'El IDS detecta y alerta; el IPS detecta y bloquea automáticamente', 'El IDS protege la red; el IPS el host', 'No hay diferencia'], correct: 1, explanation: 'IDS=Intrusion Detection System (solo alerta). IPS=Intrusion Prevention System (alerta Y actúa). fail2ban es un IPS porque bloquea IPs automáticamente.' },
    { type: 'fill', question: 'Para monitorear auth.log en tiempo real filtrando solo intentos fallidos: `tail ___ /var/log/auth.log | grep "Failed password"`', correct: ['-f'], explanation: '-f (follow) mantiene tail abierto mostrando nuevas líneas. Sin -f, tail muestra las últimas 10 líneas y termina.' },
    { type: 'true_false', question: 'Un IDS bash puede ser tan efectivo como herramientas comerciales para detectar ataques básicos.', correct: true, explanation: 'Para amenazas comunes (fuerza bruta, modificación de archivos, nuevos puertos), un IDS bash bien diseñado puede ser muy efectivo. Las herramientas comerciales aportan más cuando se necesita análisis de tráfico de red profundo o correlación entre múltiples sistemas.' },
    { type: 'multiple', question: '¿Qué monitorearías con mayor prioridad en un IDS de host básico?', options: ['/var/cache/', 'Archivos de usuario', '/etc/passwd, /etc/shadow, crontab, puertos en escucha', '/tmp/'], correct: 2, explanation: '/etc/passwd (usuarios), /etc/shadow (contraseñas), crontab (persistencia) y puertos en escucha son los targets preferidos de atacantes. Monitorearlos cubre los vectores principales.' },
    { type: 'multiple', question: '¿Por qué tail -f con grep usa la flag --line-buffered?', options: ['Para más velocidad', 'Para que grep no almacene líneas en buffer y las procese inmediatamente', 'Para filtrar duplicados', 'Para soporte de colores'], correct: 1, explanation: 'Por defecto, grep almacena salida en buffer hasta tener suficientes datos. --line-buffered hace que procese cada línea inmediatamente, esencial para monitoreo en tiempo real.' },
  ],
  missions: [
    { id: 'm1d26', title: 'Crea el baseline del IDS', description: 'sha256sum archivos críticos en ids_baseline/', hint: '$ sha256sum /etc/passwd /etc/group > ~/laboratorios/ids_baseline/archivos_criticos.sha256', xp: 40, condition: condFile('~/laboratorios/ids_baseline/archivos_criticos.sha256') },
    { id: 'm2d26', title: 'Crea ids_archivos.sh', description: 'Script de verificación de integridad', hint: '$ touch ~/scripts/ids_archivos.sh', xp: 45, condition: condFile('~/scripts/ids_archivos.sh') },
    { id: 'm3d26', title: 'Crea ids_red.sh', description: 'Script de monitoreo de puertos', hint: '$ touch ~/scripts/ids_red.sh', xp: 45, condition: condFile('~/scripts/ids_red.sh') },
    { id: 'm4d26', title: 'Crea ids_master.sh y ejecútalo', description: 'IDS maestro que integra todo', hint: '$ bash ~/scripts/ids_master.sh', xp: 50, condition: condCmd('bash') },
  ],
  resources: [
    { name: 'OSSEC HIDS', url: 'https://www.ossec.net/', icon: '🛡️' },
    { name: 'AIDE (File Integrity)', url: 'https://aide.github.io/', icon: '🔍' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 27 — Scripts Defensivos Automatizados
// ─────────────────────────────────────────────────────────────
{
  day: 27, title: 'Scripts Defensivos Automatizados',
  category: 'cyber', xp: 750,
  tags: ['automatización', 'respuesta', 'defensa', 'bash', 'scripts'],
  objectives: [
    'Crear scripts de respuesta automática a incidentes',
    'Automatizar la generación de reportes de seguridad',
    'Implementar bloqueo automático de IPs atacantes',
    'Crear scripts de limpieza post-incidente',
    'Documentar y organizar el arsenal defensivo',
  ],
  theory: {
    intro: 'La automatización defensiva es el siguiente nivel del hardening. No se trata solo de detectar amenazas, sino de responder a ellas automáticamente. Un script que bloquea una IP atacante en segundos es más efectivo que un administrador que tarda minutos en hacerlo manualmente.',
    sections: [
      {
        type: 'dual',
        technical: 'Los scripts de respuesta automática siguen el patrón OODA (Observe-Orient-Decide-Act): observar (monitorear logs/procesos), orientar (identificar si es amenaza), decidir (qué acción tomar), actuar (bloquear, alertar, aislar). En Linux, iptables/ufw permiten bloquear IPs programáticamente desde bash.',
        simple: 'Imagina un guardia de seguridad automático. Cuando detecta a alguien intentando forzar la puerta más de 5 veces, automáticamente la bloquea para esa persona y llama a la policía. Tus scripts hacen exactamente eso con las IPs atacantes.',
      },
      {
        type: 'text',
        title: 'Componentes de un script defensivo',
        body: 'Detección: grep en logs, verificación de baseline, monitoreo de procesos. Análisis: contar intentos, verificar contra whitelist, evaluar severidad. Respuesta: bloquear IP con iptables/ufw, terminar proceso malicioso, aislar cuenta comprometida. Documentación: registrar en log el incidente y las acciones tomadas. Notificación: enviar alerta (email, Slack, SMS).',
      },
      {
        type: 'note',
        label: 'Precauciones en automatización defensiva',
        body: 'La automatización puede causar más daño que el atacante si no se implementa correctamente. Riesgos: bloquear IPs legítimas (DoS propio), eliminar archivos incorrectos, escalar incidentes que son falsos positivos. Siempre implementa con WHITELIST (IPs que nunca bloquear), thresholds conservadores, logging de todas las acciones y mecanismo de rollback.',
      },
    ],
    realCase: {
      title: 'Script bash que respondió a 10,000 ataques automáticamente',
      body: 'Un servidor web recibía ataques de fuerza bruta constantes. El administrador implementó un script que: leía auth.log cada minuto, contaba intentos fallidos por IP, bloqueaba automáticamente con ufw las IPs con más de 10 intentos. En un mes, bloqueó más de 10,000 IPs atacantes automáticamente sin intervención manual.',
    },
  },
  commands: [
    {
      name: 'Script de bloqueo de IPs',
      brief: 'Automatizar el bloqueo de IPs atacantes',
      technical: 'Combina grep para extraer IPs de auth.log, awk para contar frecuencia, y ufw/iptables para bloquear automáticamente.',
      simple: 'Un script que lee los logs, encuentra IPs que intentaron muchas veces entrar sin éxito y las bloquea automáticamente.',
      syntax: [
        { cmd: "grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | awk '$1 > 10 {print $2}'", desc: 'IPs con más de 10 intentos fallidos' },
        { cmd: 'ufw deny from IP_ATACANTE',    desc: 'Bloquear IP con UFW (requiere root)' },
        { cmd: "iptables -A INPUT -s IP -j DROP", desc: 'Bloquear con iptables (requiere root)' },
      ],
      errors: [],
      security: 'Siempre mantén una whitelist de IPs que nunca deben bloquearse (tu IP de administración, IPs de la oficina) para evitar bloquearte a ti mismo.',
    },
    {
      name: 'Script de reporte de seguridad',
      brief: 'Generar reporte automático del estado de seguridad',
      technical: 'Combina múltiples comandos para generar un reporte estructurado del estado de seguridad del servidor.',
      simple: 'Un script que recopila toda la información de seguridad relevante y la presenta en un reporte organizado.',
      syntax: [
        { cmd: "echo '=== REPORTE DIARIO ===' > reporte.txt", desc: 'Iniciar reporte' },
        { cmd: "date >> reporte.txt",                          desc: 'Añadir timestamp' },
        { cmd: "ss -tlnp >> reporte.txt",                     desc: 'Añadir puertos activos' },
        { cmd: "cat reporte.txt",                              desc: 'Ver el reporte' },
      ],
      errors: [],
      security: 'Los reportes automáticos permiten comparar el estado del servidor a lo largo del tiempo y detectar cambios graduales.',
    },
  ],
  lab: {
    title: 'Arsenal defensivo: conjunto de scripts de seguridad',
    context: 'Crearás un arsenal de scripts defensivos que trabajen juntos para proteger el servidor automáticamente.',
    duration: '40 min', xp: 200,
    steps: [
      {
        title: 'Crea el script de análisis de atacantes',
        body: 'Identifica automáticamente las IPs con más intentos fallidos.',
        commands: [
          { cmd: "cat > ~/scripts/detectar_atacantes.sh << 'EOF'\n#!/bin/bash\necho \"=== ANÁLISIS DE ATACANTES: $(date) ===\"\necho \"\"\necho \"IPs con intentos fallidos de SSH:\"\ngrep 'Failed password' /var/log/auth.log 2>/dev/null | \\\n  awk '{print $11}' | \\\n  sort | uniq -c | sort -rn | \\\n  head -10 | \\\n  awk '{printf \"  Intentos: %3d | IP: %s\\n\", $1, $2}'\necho \"\"\nTOTAL=$(grep -c 'Failed password' /var/log/auth.log 2>/dev/null || echo 0)\necho \"Total intentos fallidos: $TOTAL\"\nEOF", explanation: 'Script para analizar IPs atacantes.' },
          { cmd: 'chmod +x ~/scripts/detectar_atacantes.sh && bash ~/scripts/detectar_atacantes.sh', explanation: 'Ejecutar el análisis.' },
        ],
        expected: '=== ANÁLISIS DE ATACANTES ===\nIPs con intentos fallidos de SSH:\n  Intentos:   1 | IP: 192.168.1.x',
        technical: 'awk con printf formatea la salida para mejor legibilidad en el reporte.',
        hints: ['Crea y ejecuta el script de análisis'],
      },
      {
        title: 'Crea el script de reporte diario de seguridad',
        body: 'Genera un reporte completo del estado de seguridad.',
        commands: [
          { cmd: "cat > ~/scripts/reporte_seguridad.sh << 'EOF'\n#!/bin/bash\nFECHA=$(date +%Y%m%d)\nREPORTE=\"$HOME/laboratorios/reporte_$FECHA.txt\"\necho \"========================================\" > \"$REPORTE\"\necho \" REPORTE DE SEGURIDAD: $(date)\" >> \"$REPORTE\"\necho \"========================================\" >> \"$REPORTE\"\necho \"\" >> \"$REPORTE\"\necho \"[SISTEMA]\" >> \"$REPORTE\"\nuname -a >> \"$REPORTE\"\necho \"\" >> \"$REPORTE\"\necho \"[USUARIOS CON SHELL]\" >> \"$REPORTE\"\ngrep '/bin/bash' /etc/passwd >> \"$REPORTE\"\necho \"\" >> \"$REPORTE\"\necho \"[PUERTOS EN ESCUCHA]\" >> \"$REPORTE\"\nss -tlnp >> \"$REPORTE\"\necho \"\" >> \"$REPORTE\"\necho \"[INTENTOS FALLIDOS SSH]\" >> \"$REPORTE\"\ngrep -c 'Failed password' /var/log/auth.log >> \"$REPORTE\" 2>/dev/null || echo 0 >> \"$REPORTE\"\necho \"Reporte generado: $REPORTE\"\ncat \"$REPORTE\"\nEOF", explanation: 'Script de reporte completo.' },
          { cmd: 'chmod +x ~/scripts/reporte_seguridad.sh && bash ~/scripts/reporte_seguridad.sh', explanation: 'Generar el reporte.' },
        ],
        expected: '=== REPORTE DE SEGURIDAD ===',
        technical: 'Este reporte puede enviarse por email diariamente. En sistemas reales se usaría: bash reporte_seguridad.sh | mail -s "Reporte Diario" admin@empresa.com',
        hints: ['Crea y ejecuta el script de reporte'],
      },
      {
        title: 'Crea el script de limpieza de emergencia',
        body: 'Script para respuesta rápida ante incidente.',
        commands: [
          { cmd: "cat > ~/scripts/emergencia.sh << 'EOF'\n#!/bin/bash\necho \"=== MODO EMERGENCIA: $(date) ===\"\necho \"[!] Este script documenta el estado del sistema para análisis forense\"\necho \"\"\necho \"[PROCESOS ACTIVOS]\"\nps aux --sort=-%cpu | head -20\necho \"\"\necho \"[CONEXIONES ACTIVAS]\"\nss -tunap\necho \"\"\necho \"[ARCHIVOS EN /tmp]\"\nls -la /tmp/\necho \"\"\necho \"[ÚLTIMOS 20 LOGINS]\"\nlast -20\necho \"\"\necho \"[CRONTABS]\"\ncrontab -l 2>/dev/null\necho \"\"\necho \"Estado documentado. Analiza los datos anteriores.\"\nEOF", explanation: 'Script de captura forense rápida.' },
          { cmd: 'chmod +x ~/scripts/emergencia.sh && bash ~/scripts/emergencia.sh', explanation: 'Ejecutar captura forense.' },
        ],
        expected: '=== MODO EMERGENCIA ===',
        technical: 'En un incidente real, este script se ejecuta PRIMERO para capturar el estado volátil del sistema (procesos y conexiones) antes de hacer cualquier otra cosa.',
        hints: ['Crea y ejecuta el script de emergencia'],
      },
      {
        title: 'Organiza el arsenal defensivo',
        body: 'Lista todos los scripts defensivos que has creado.',
        commands: [
          { cmd: 'ls -la ~/scripts/', explanation: 'Ver todos los scripts del arsenal.' },
          { cmd: 'echo "Arsenal defensivo completo:"', explanation: 'Mensaje de confirmación.' },
          { cmd: "for script in ~/scripts/*.sh; do echo \"  $(basename $script)\"; done", explanation: 'Lista todos los scripts.' },
        ],
        expected: 'sysinfo.sh, auditoria.sh, backup.sh, monitor_procesos.sh, monitor_red.sh, ids_master.sh, detectar_atacantes.sh, reporte_seguridad.sh, emergencia.sh',
        technical: 'Has construido un arsenal defensivo completo a lo largo del curso. Cada script tiene una función específica en la defensa del servidor.',
        hints: ['$ ls -la ~/scripts/'],
      },
      {
        title: 'Crea el script maestro del arsenal',
        body: 'Un script que ejecuta todos los módulos de seguridad.',
        commands: [
          { cmd: "cat > ~/scripts/arsenal_completo.sh << 'EOF'\n#!/bin/bash\necho \"╔══════════════════════════════════════╗\"\necho \"║    ARSENAL DEFENSIVO LINUX           ║\"\necho \"║    $(date)    ║\"\necho \"╚══════════════════════════════════════╝\"\necho \"\"\nbash ~/scripts/ids_master.sh 2>/dev/null\necho \"\"\nbash ~/scripts/detectar_atacantes.sh 2>/dev/null\necho \"\"\necho \"Arsenal ejecutado completamente.\"\nEOF", explanation: 'Script maestro del arsenal.' },
          { cmd: 'chmod +x ~/scripts/arsenal_completo.sh && bash ~/scripts/arsenal_completo.sh', explanation: 'Ejecutar el arsenal completo.' },
        ],
        expected: '╔══════════════════════════════════════╗\n║    ARSENAL DEFENSIVO LINUX',
        technical: 'El arsenal completo puede programarse con cron para ejecutarse cada hora y enviar alertas automáticamente.',
        hints: ['Crea y ejecuta el script maestro'],
      },
    ],
    commonErrors: [
      { error: 'Permiso denegado al ejecutar ufw/iptables', solution: 'El bloqueo de IPs requiere privilegios root. En este simulador, los scripts de bloqueo no se ejecutan realmente, pero la lógica es correcta.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué es el modelo OODA en respuesta a incidentes?', options: ['Observe-Optimize-Deploy-Act', 'Observe-Orient-Decide-Act', 'Organize-Operate-Defend-Alert', 'Only-One-Defense-Action'], correct: 1, explanation: 'OODA (Observe-Orient-Decide-Act) es un ciclo de toma de decisiones aplicado a respuesta a incidentes: observar el sistema, orientar la situación, decidir la respuesta, actuar.' },
    { type: 'fill', question: 'Para bloquear una IP atacante con UFW: `ufw ___ from IP_ATACANTE`', correct: ['deny'], explanation: 'ufw deny from IP bloquea todo el tráfico entrante desde esa IP.' },
    { type: 'true_false', question: 'Un script de bloqueo automático sin whitelist puede bloquear accidentalmente al propio administrador.', correct: true, explanation: 'Si el administrador comete varios errores de contraseña desde su propia IP, un script sin whitelist lo bloquearía. Siempre incluye una lista de IPs que nunca deben bloquearse.' },
    { type: 'multiple', question: '¿Cuál debe ser la primera acción en un incidente de seguridad?', options: ['Borrar los logs del atacante', 'Apagar el servidor', 'Capturar el estado volátil (procesos, conexiones) antes de hacer nada más', 'Cambiar todas las contraseñas'], correct: 2, explanation: 'Los procesos, conexiones y memoria son volátiles y se pierden al apagar. Capturar este estado forense primero es crítico para la investigación.' },
    { type: 'multiple', question: '¿Por qué los scripts defensivos deben registrar en log TODAS sus acciones?', options: ['Para auditoría y responsabilidad legal', 'Para consumir menos memoria', 'Para ser más rápidos', 'No es necesario'], correct: 0, explanation: 'El logging de acciones defensivas es esencial para auditoría (¿qué bloqueó el script y cuándo?), para análisis forense y para responsabilidad legal en incidentes.' },
  ],
  missions: [
    { id: 'm1d27', title: 'Crea detectar_atacantes.sh', description: 'Script de análisis de IPs', hint: '$ touch ~/scripts/detectar_atacantes.sh', xp: 40, condition: condFile('~/scripts/detectar_atacantes.sh') },
    { id: 'm2d27', title: 'Crea reporte_seguridad.sh', description: 'Script de reporte diario', hint: '$ touch ~/scripts/reporte_seguridad.sh', xp: 45, condition: condFile('~/scripts/reporte_seguridad.sh') },
    { id: 'm3d27', title: 'Crea emergencia.sh', description: 'Script de captura forense rápida', hint: '$ touch ~/scripts/emergencia.sh', xp: 45, condition: condFile('~/scripts/emergencia.sh') },
    { id: 'm4d27', title: 'Lista todo el arsenal', description: 'ls -la ~/scripts/', hint: '$ ls -la ~/scripts/', xp: 30, condition: condCmd('ls') },
  ],
  resources: [
    { name: 'Incident Response Playbooks', url: 'https://github.com/counteractive/incident-response-plan-template', icon: '📋' },
    { name: 'SANS Incident Response', url: 'https://www.sans.org/reading-room/whitepapers/incident/', icon: '🛡️' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 28 — Gestión de Firewall con iptables/ufw
// ─────────────────────────────────────────────────────────────
{
  day: 28, title: 'Gestión de Firewall con iptables/ufw',
  category: 'cyber', xp: 750,
  tags: ['firewall', 'iptables', 'ufw', 'reglas', 'red', 'seguridad'],
  objectives: [
    'Entender el modelo de reglas de iptables',
    'Configurar UFW para proteger un servidor',
    'Implementar reglas de firewall específicas',
    'Crear políticas de firewall por defecto seguras',
    'Verificar y auditar reglas de firewall',
  ],
  theory: {
    intro: 'El firewall es la primera línea de defensa de red de tu servidor. Una configuración incorrecta puede dejarte sin acceso al servidor (bloquear tu propia IP) o dejar expuesto servicios que deberían estar cerrados. En ciberseguridad, el firewall es tan fundamental como los permisos de archivos.',
    sections: [
      {
        type: 'dual',
        technical: 'iptables es el firewall del kernel Linux que implementa Netfilter. Las reglas se organizan en tablas (filter, nat, mangle) y cadenas (INPUT, OUTPUT, FORWARD). UFW (Uncomplicated Firewall) es una interfaz simplificada de iptables. Las políticas por defecto definen el comportamiento cuando ninguna regla coincide.',
        simple: 'iptables es como un guardia de seguridad en la puerta del servidor. Le dices reglas: "deja pasar al puerto 22 (SSH)", "bloquea al puerto 23 (Telnet)", "bloquea todo lo demás". UFW es la versión simplificada de iptables, más fácil de manejar.',
      },
      {
        type: 'text',
        title: 'Modelo de seguridad de firewall',
        body: 'Default Deny (recomendado): bloquea todo por defecto y abre solo lo necesario. Default Allow: permite todo y bloquea solo lo problemático (menos seguro). Para un servidor Linux: política por defecto INPUT=DROP, OUTPUT=ACCEPT. Luego: permitir SSH (22), permitir servicios necesarios, bloquear el resto.',
      },
      {
        type: 'text',
        title: 'Cadenas principales de iptables',
        body: 'INPUT: tráfico que llega al servidor (el más importante para seguridad). OUTPUT: tráfico que sale del servidor. FORWARD: tráfico que pasa a través del servidor (routers). Las reglas se evalúan en orden: la primera que coincide gana. Una regla DROP al final de INPUT bloquea todo lo que no fue permitido explícitamente.',
      },
      {
        type: 'note',
        label: 'Precaución con firewalls remotos',
        body: 'Nunca apliques una política DROP en INPUT sin antes haber permitido SSH. Te quedarás sin acceso al servidor y necesitarás acceso físico o consola para recuperarlo. SIEMPRE: 1) Permitir SSH primero, 2) Probar con un timeout (at now + 5 minutes <<< "ufw reset"), 3) Luego aplicar la política restrictiva.',
      },
    ],
    diagram: {
      title: 'Flujo de paquetes en iptables',
      content: `Paquete entrante (Internet)
         │
         ▼
    [PREROUTING]  ← nat table
         │
         ▼
  ¿Destino es este servidor?
    SI ──────────────────────────► [INPUT] ─────► Proceso local
    NO
    │
    ▼
[FORWARD] ─────────────────────► Reenviar
         │
    [OUTPUT] ◄───── Proceso local genera tráfico
         │
         ▼
    [POSTROUTING] ← nat table
         │
         ▼
    Paquete saliente`,
    },
    realCase: {
      title: 'Firewall que redujo ataques en un 99%',
      body: 'Un servidor expuesto recibía 50,000 intentos de conexión por hora a puertos como 3389 (RDP), 1433 (MSSQL), 27017 (MongoDB). Con ufw default deny y solo permitir puertos 22 y 443, los intentos de conexión cayeron a prácticamente cero. Los atacantes automatizados no pueden explotar lo que no pueden alcanzar.',
    },
  },
  commands: [
    {
      name: 'ufw',
      brief: 'Uncomplicated Firewall — interfaz simplificada de iptables',
      technical: 'UFW genera reglas iptables a partir de comandos simples. Almacena reglas en /etc/ufw/. Se aplican al reiniciar el servicio.',
      simple: 'La forma más fácil de gestionar el firewall en Ubuntu. Comandos claros para permitir o bloquear puertos.',
      syntax: [
        { cmd: 'ufw status verbose',              desc: 'Ver estado y reglas actuales' },
        { cmd: 'ufw enable',                      desc: 'Activar el firewall' },
        { cmd: 'ufw default deny incoming',       desc: 'Bloquear todo el tráfico entrante por defecto' },
        { cmd: 'ufw default allow outgoing',      desc: 'Permitir todo el tráfico saliente' },
        { cmd: 'ufw allow 22/tcp',               desc: 'Permitir SSH' },
        { cmd: 'ufw allow 443/tcp',              desc: 'Permitir HTTPS' },
        { cmd: 'ufw deny from 185.x.x.x',       desc: 'Bloquear IP específica' },
        { cmd: 'ufw delete allow 80/tcp',         desc: 'Eliminar una regla' },
      ],
      errors: [
        { msg: 'ERROR: Could not load ufw', fix: 'UFW no está instalado. sudo apt install ufw' },
      ],
      security: 'ufw limit ssh aplica rate limiting a SSH: bloquea IPs que intentan más de 6 conexiones en 30 segundos — defensa automática contra fuerza bruta.',
    },
    {
      name: 'iptables',
      brief: 'Gestión directa de reglas del firewall del kernel',
      technical: 'iptables manipula directamente las cadenas de Netfilter. Las reglas no persisten al reiniciar sin iptables-save.',
      simple: 'El firewall avanzado de Linux. Más complejo que UFW pero con control total sobre el tráfico.',
      syntax: [
        { cmd: 'iptables', flag: '-L -n -v',                 desc: 'Listar todas las reglas' },
        { cmd: 'iptables', flag: '-A INPUT -p tcp --dport 22 -j ACCEPT', desc: 'Permitir SSH' },
        { cmd: 'iptables', flag: '-A INPUT -s 185.x.x.x -j DROP', desc: 'Bloquear IP' },
        { cmd: 'iptables', flag: '-P INPUT DROP',            desc: 'Política por defecto: DROP' },
        { cmd: 'iptables-save > /etc/iptables/rules.v4',     desc: 'Guardar reglas (persistencia)' },
      ],
      errors: [
        { msg: 'iptables: Permission denied', fix: 'iptables requiere ser root. Usa sudo.' },
      ],
      security: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT permite respuestas a conexiones iniciadas por el servidor (esencial para updates).',
    },
  ],
  lab: {
    title: 'Configurar y auditar el firewall del servidor',
    context: 'Debes verificar el estado del firewall, entender las reglas actuales y preparar una configuración segura para el servidor.',
    duration: '35 min', xp: 200,
    steps: [
      {
        title: 'Verifica el estado actual del firewall',
        body: 'Revisa si hay un firewall activo y qué reglas tiene.',
        commands: [
          { cmd: 'ufw status verbose 2>/dev/null || echo "UFW no está disponible en simulador"', explanation: 'Estado de UFW.' },
          { cmd: 'iptables -L -n 2>/dev/null || echo "[simulador] iptables requiere privilegios root"', explanation: 'Reglas de iptables.' },
        ],
        expected: 'Estado del firewall o mensaje del simulador',
        technical: 'En un servidor real, ufw status muestra todas las reglas activas. Un servidor sin firewall tiene STATUS: inactive.',
        hints: ['$ ufw status verbose 2>/dev/null || echo "sin firewall"'],
      },
      {
        title: 'Diseña la política de firewall',
        body: 'Crea el documento de política de firewall.',
        commands: [
          { cmd: "cat > ~/laboratorios/politica_firewall.txt << 'EOF'\n=== POLÍTICA DE FIREWALL DEL SERVIDOR ===\nFecha: $(date)\n\nPOLÍTICA POR DEFECTO:\n- INPUT:   DENY (bloquear todo lo que no esté permitido)\n- OUTPUT:  ALLOW (permitir todo el tráfico saliente)\n- FORWARD: DENY\n\nPUERTOS PERMITIDOS (INGRESS):\n- Puerto 22/TCP: SSH (administración)\n- Puerto 443/TCP: HTTPS (aplicación web)\n\nBLOQUEOS EXPLÍCITOS:\n- Puerto 23: Telnet (inseguro, nunca usar)\n- Puerto 3389: RDP (no necesario en Linux)\n- Puerto 445: SMB (no necesario)\n\nREGLAS DE RATE LIMITING:\n- SSH: máximo 6 intentos por 30 segundos\nEOF", explanation: 'Documento de política de firewall.' },
          { cmd: 'cat ~/laboratorios/politica_firewall.txt', explanation: 'Ver la política.' },
        ],
        expected: '=== POLÍTICA DE FIREWALL DEL SERVIDOR ===',
        technical: 'Documentar la política antes de implementar evita errores y sirve como referencia para auditorías.',
        hints: ['Crea el documento de política con cat heredoc'],
      },
      {
        title: 'Genera el script de configuración de firewall',
        body: 'Crea un script que implemente la política de firewall.',
        commands: [
          { cmd: "cat > ~/scripts/configurar_firewall.sh << 'EOF'\n#!/bin/bash\n# Script de configuración de firewall\n# ADVERTENCIA: Ejecutar solo en consola o con acceso físico al servidor\n\necho \"=== CONFIGURACIÓN DE FIREWALL ===\"\necho \"[1/5] Verificando UFW...\"\necho \"  ufw default deny incoming\"\necho \"  ufw default allow outgoing\"\necho \"\"\necho \"[2/5] Permitiendo SSH (obligatorio antes de deny incoming)\"\necho \"  ufw allow 22/tcp\"\necho \"\"\necho \"[3/5] Permitiendo HTTPS\"\necho \"  ufw allow 443/tcp\"\necho \"\"\necho \"[4/5] Aplicando rate limiting en SSH\"\necho \"  ufw limit ssh\"\necho \"\"\necho \"[5/5] Activando firewall\"\necho \"  ufw enable\"\necho \"\"\necho \"[SIMULADO] Firewall configurado correctamente.\"\necho \"En sistema real: ejecutar estos comandos como root.\"\nEOF", explanation: 'Script de configuración (simulado).' },
          { cmd: 'chmod +x ~/scripts/configurar_firewall.sh && bash ~/scripts/configurar_firewall.sh', explanation: 'Ejecutar el script (modo simulado).' },
        ],
        expected: '=== CONFIGURACIÓN DE FIREWALL ===\n[1/5] Verificando UFW...',
        technical: 'En producción, este script se ejecutaría como root. El orden importa: SIEMPRE permitir SSH antes de aplicar default deny.',
        hints: ['Crea y ejecuta el script de firewall'],
      },
      {
        title: 'Audita las conexiones actuales',
        body: 'Verifica qué conexiones existen y si el firewall las permite según la política.',
        commands: [
          { cmd: 'ss -tunap', explanation: 'Conexiones activas (para comparar con la política).' },
          { cmd: "ss -tlnp | awk 'NR>1 {print $5}' | sort -u", explanation: 'Solo los puertos en escucha.' },
        ],
        expected: ':22 (SSH - PERMITIDO por política)\n:631 (CUPS - NO en política)',
        technical: 'Comparar los puertos activos con la política revela puertos que deberían bloquearse.',
        hints: ['$ ss -tlnp'],
      },
      {
        title: 'Crea el checklist de auditoría de firewall',
        body: 'Documenta el estado de cumplimiento con la política.',
        commands: [
          { cmd: "cat > ~/laboratorios/auditoria_firewall.txt << 'EOF'\n=== AUDITORÍA DE FIREWALL: $(date) ===\n\nCONTROLES VERIFICADOS:\n[✓] Política por defecto documentada\n[✓] Puerto SSH (22) identificado\n[✓] Conexiones activas analizadas\n[✓] Script de configuración creado\n[✓] Puertos innecesarios identificados\n\nRECOMENDACIONES:\n1. Implementar UFW con las políticas documentadas\n2. Bloquear puerto 631 (CUPS) si no hay impresoras\n3. Configurar fail2ban para protección adicional de SSH\n4. Revisar mensualmente los logs de UFW\nEOF", explanation: 'Checklist de auditoría de firewall.' },
          { cmd: 'cat ~/laboratorios/auditoria_firewall.txt', explanation: 'Ver el checklist.' },
        ],
        expected: '=== AUDITORÍA DE FIREWALL ===',
        technical: 'El checklist de auditoría documenta el estado actual y las recomendaciones para mejorar la postura de seguridad.',
        hints: ['Crea el checklist de auditoría'],
      },
    ],
    commonErrors: [
      { error: 'Me bloqué del servidor al configurar el firewall', solution: 'SIEMPRE permite SSH ANTES de aplicar default deny. Si ya ocurrió, necesitas acceso físico o consola VNC/IPMI del proveedor cloud.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Cuál es el orden correcto para configurar un firewall restrictivo?', options: ['1. default deny, 2. permitir SSH, 3. activar', '1. permitir SSH, 2. default deny incoming, 3. activar', '1. activar, 2. default deny, 3. permitir SSH', 'El orden no importa'], correct: 1, explanation: 'SIEMPRE permite SSH primero. Si aplicas default deny antes, te quedas sin acceso al servidor de forma remota.' },
    { type: 'fill', question: 'Para ver el estado del firewall UFW: `ufw ___ verbose`', correct: ['status'], explanation: 'ufw status verbose muestra si el firewall está activo y lista todas las reglas configuradas.' },
    { type: 'true_false', question: 'Una política de firewall "default allow" es más segura que "default deny".', correct: false, explanation: '"Default allow" (permitir todo lo no bloqueado) es menos seguro. "Default deny" (bloquear todo lo no permitido) aplica el principio de mínimo acceso: solo lo explícitamente autorizado puede pasar.' },
    { type: 'multiple', question: '¿Qué hace `ufw limit ssh`?', options: ['Limita la velocidad de SSH a 1 Mbps', 'Bloquea SSH completamente', 'Aplica rate limiting: bloquea IPs con más de 6 intentos en 30 segundos', 'Permite SSH solo desde localhost'], correct: 2, explanation: 'ufw limit aplica rate limiting. Para SSH, bloquea temporalmente IPs que intentan más de 6 conexiones en 30 segundos — defensa básica contra fuerza bruta.' },
    { type: 'multiple', question: '¿Qué cadena de iptables controla el tráfico que llega al servidor?', options: ['OUTPUT', 'FORWARD', 'INPUT', 'PREROUTING'], correct: 2, explanation: 'INPUT controla los paquetes destinados al servidor local. OUTPUT controla los paquetes generados por el servidor. FORWARD controla los paquetes que pasan a través.' },
  ],
  missions: [
    { id: 'm1d28', title: 'Crea política de firewall', description: 'Documenta la política en un archivo', hint: '$ cat > ~/laboratorios/politica_firewall.txt', xp: 35, condition: condFile('~/laboratorios/politica_firewall.txt') },
    { id: 'm2d28', title: 'Crea configurar_firewall.sh', description: 'Script de configuración de firewall', hint: '$ touch ~/scripts/configurar_firewall.sh', xp: 45, condition: condFile('~/scripts/configurar_firewall.sh') },
    { id: 'm3d28', title: 'Audita puertos en escucha', description: 'ss -tlnp para comparar con política', hint: '$ ss -tlnp', xp: 30, condition: { type: 'command_with_flag', command: 'ss', flag: '-tlnp' } },
    { id: 'm4d28', title: 'Crea checklist de auditoría', description: 'Documenta el estado de cumplimiento', hint: '$ cat > ~/laboratorios/auditoria_firewall.txt', xp: 40, condition: condFile('~/laboratorios/auditoria_firewall.txt') },
  ],
  resources: [
    { name: 'UFW Documentation', url: 'https://help.ubuntu.com/community/UFW', icon: '🔥' },
    { name: 'iptables Tutorial', url: 'https://www.frozentux.net/iptables-tutorial/iptables-tutorial.html', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 29 — Proyecto Final: Centro de Monitoreo Linux
// ─────────────────────────────────────────────────────────────
{
  day: 29, title: 'Proyecto Final: Centro de Monitoreo Linux',
  category: 'cyber', xp: 1000,
  tags: ['proyecto', 'monitoreo', 'automatización', 'bash', 'seguridad', 'integración'],
  objectives: [
    'Integrar todos los conocimientos del curso en un proyecto real',
    'Construir el Centro de Monitoreo Linux Personal',
    'Crear el sistema de gestión de usuarios completo',
    'Implementar monitoreo automatizado completo',
    'Generar reportes automáticos de seguridad',
  ],
  theory: {
    intro: 'El Proyecto Final integra todo lo que has aprendido en 28 días: navegación Linux, permisos, scripts bash, automatización, redes y ciberseguridad. Construirás un Centro de Monitoreo Linux real, funcional y profesional.',
    sections: [
      {
        type: 'dual',
        technical: 'El Centro de Monitoreo Linux (LMC) es una colección integrada de scripts que monitorean continuamente el sistema, detectan anomalías y generan reportes. Implementa los patrones que usarías en un SOC real: colección de datos, análisis, alertas y documentación forense.',
        simple: 'Imagina que construyes el panel de control de seguridad de tu servidor. Muestra el estado de todo en tiempo real: usuarios, procesos, conexiones, logs. Como el puente de mando de una nave espacial, pero para tu servidor Linux.',
      },
      {
        type: 'text',
        title: 'Componentes del Centro de Monitoreo',
        body: '1. Sistema de usuarios: crear, auditar y gestionar cuentas. 2. Monitor de procesos: detectar anomalías de CPU/memoria. 3. Monitor de red: conexiones activas y puertos. 4. Analizador de logs: patrones de ataque en auth.log. 5. Verificador de integridad: baseline de archivos críticos. 6. Generador de reportes: reporte diario consolidado. 7. Sistema de alertas: detectar y documentar incidentes.',
      },
      {
        type: 'note',
        label: 'Esto es lo que hace un SOC Analyst',
        body: 'Los analistas de un SOC (Security Operations Center) hacen exactamente esto cada día: monitorean logs, analizan procesos sospechosos, verifican conexiones de red, generan reportes y responden a alertas. Tu Centro de Monitoreo Linux es una versión simplificada de lo que usan empresas como CrowdStrike, Palo Alto y Splunk.',
      },
    ],
    realCase: {
      title: 'Tu proyecto como portfolio profesional',
      body: 'Los proyectos prácticos demuestran competencia técnica real. Cuando entrevistadores de empresas de ciberseguridad pregunten "¿qué has construido?", podrás mostrar tu Centro de Monitoreo Linux: un sistema funcional que detecta intrusos, monitorea procesos, analiza logs y genera reportes automáticos. Esto es exactamente lo que buscan.',
    },
  },
  commands: [],
  lab: {
    title: 'Centro de Monitoreo Linux — Implementación Completa',
    context: 'Construirás el Centro de Monitoreo Linux completo integrando todos los scripts y conocimientos del curso en un sistema cohesionado y profesional.',
    duration: '60 min', xp: 500,
    steps: [
      {
        title: 'Prepara la estructura del Centro de Monitoreo',
        body: 'Crea la arquitectura de directorios del sistema.',
        commands: [
          { cmd: 'mkdir -p ~/centro_monitoreo/{scripts,logs,reportes,baseline,alertas}', explanation: 'Estructura principal del centro.' },
          { cmd: 'echo "Centro de Monitoreo Linux - $(date)" > ~/centro_monitoreo/README.txt', explanation: 'Documentación básica.' },
          { cmd: 'ls -la ~/centro_monitoreo/', explanation: 'Verificar estructura.' },
        ],
        expected: 'scripts/  logs/  reportes/  baseline/  alertas/',
        technical: 'Una estructura organizada es fundamental. En proyectos reales, cada directorio tendría control de versiones (git) y permisos específicos.',
        hints: ['$ mkdir -p ~/centro_monitoreo/{scripts,logs,reportes,baseline,alertas}'],
      },
      {
        title: 'Implementa el módulo de gestión de usuarios',
        body: 'Crea el sistema de auditoría de usuarios.',
        commands: [
          { cmd: "cat > ~/centro_monitoreo/scripts/mod_usuarios.sh << 'EOF'\n#!/bin/bash\n# Módulo: Gestión y Auditoría de Usuarios\nLOG=\"$HOME/centro_monitoreo/logs/usuarios_$(date +%Y%m%d).log\"\necho \"[$(date +%H:%M:%S)] MÓDULO USUARIOS\" | tee -a \"$LOG\"\necho \"Usuarios con shell de login:\" | tee -a \"$LOG\"\ngrep '/bin/bash' /etc/passwd | tee -a \"$LOG\"\necho \"\" | tee -a \"$LOG\"\necho \"Usuarios en grupo sudo:\" | tee -a \"$LOG\"\ngrep 'sudo' /etc/group | tee -a \"$LOG\"\necho \"\" | tee -a \"$LOG\"\necho \"Cuentas con UID 0 (root-equivalentes):\" | tee -a \"$LOG\"\ngrep ':0:' /etc/passwd | tee -a \"$LOG\"\nEOF", explanation: 'Módulo de gestión de usuarios.' },
          { cmd: 'chmod +x ~/centro_monitoreo/scripts/mod_usuarios.sh && bash ~/centro_monitoreo/scripts/mod_usuarios.sh', explanation: 'Ejecutar el módulo.' },
        ],
        expected: '[10:23:45] MÓDULO USUARIOS\nUsuarios con shell de login:\nroot, estudiante',
        technical: 'tee -a escribe simultáneamente en pantalla y en el archivo de log. El -a (append) no sobrescribe el log.',
        hints: ['Crea y ejecuta el módulo de usuarios'],
      },
      {
        title: 'Implementa el módulo de monitoreo de procesos',
        body: 'Crea el sistema de detección de procesos anómalos.',
        commands: [
          { cmd: "cat > ~/centro_monitoreo/scripts/mod_procesos.sh << 'EOF'\n#!/bin/bash\n# Módulo: Monitoreo de Procesos\nLOG=\"$HOME/centro_monitoreo/logs/procesos_$(date +%Y%m%d).log\"\nALERTA=\"$HOME/centro_monitoreo/alertas/alerta_procesos.txt\"\necho \"[$(date +%H:%M:%S)] MÓDULO PROCESOS\" | tee -a \"$LOG\"\necho \"Top 5 por CPU:\" | tee -a \"$LOG\"\nps aux --sort=-%cpu | head -6 | tee -a \"$LOG\"\necho \"\" | tee -a \"$LOG\"\nPROC_TMP=$(ps aux | awk '$11 ~ /\\/tmp/')\nif [ -n \"$PROC_TMP\" ]; then\n  echo \"🚨 ALERTA: Proceso desde /tmp detectado!\" | tee -a \"$ALERTA\"\n  echo \"$PROC_TMP\" | tee -a \"$ALERTA\"\nelse\n  echo \"✅ Sin procesos sospechosos en /tmp\" | tee -a \"$LOG\"\nfi\nEOF", explanation: 'Módulo de monitoreo de procesos.' },
          { cmd: 'chmod +x ~/centro_monitoreo/scripts/mod_procesos.sh && bash ~/centro_monitoreo/scripts/mod_procesos.sh', explanation: 'Ejecutar el módulo.' },
        ],
        expected: '[...] MÓDULO PROCESOS\nTop 5 por CPU:\n✅ Sin procesos sospechosos',
        technical: 'Las alertas se guardan en un directorio separado para fácil revisión. En producción, también enviarían email o notificación Slack.',
        hints: ['Crea y ejecuta el módulo de procesos'],
      },
      {
        title: 'Implementa el módulo de análisis de logs',
        body: 'Crea el sistema de análisis de logs de seguridad.',
        commands: [
          { cmd: "cat > ~/centro_monitoreo/scripts/mod_logs.sh << 'EOF'\n#!/bin/bash\n# Módulo: Análisis de Logs de Seguridad\nLOG=\"$HOME/centro_monitoreo/logs/analisis_$(date +%Y%m%d).log\"\necho \"[$(date +%H:%M:%S)] MÓDULO ANÁLISIS DE LOGS\" | tee -a \"$LOG\"\nFAILED=$(grep -c 'Failed password' /var/log/auth.log 2>/dev/null || echo 0)\nACCEPTED=$(grep -c 'Accepted' /var/log/auth.log 2>/dev/null || echo 0)\nSUDO=$(grep -c 'sudo' /var/log/auth.log 2>/dev/null || echo 0)\necho \"Intentos fallidos SSH: $FAILED\" | tee -a \"$LOG\"\necho \"Logins exitosos SSH: $ACCEPTED\" | tee -a \"$LOG\"\necho \"Usos de sudo: $SUDO\" | tee -a \"$LOG\"\necho \"\" | tee -a \"$LOG\"\necho \"Top IPs atacantes:\" | tee -a \"$LOG\"\ngrep 'Failed password' /var/log/auth.log 2>/dev/null | \\\n  awk '{print $11}' | sort | uniq -c | sort -rn | head -5 | tee -a \"$LOG\"\n[ \"$FAILED\" -gt 100 ] && echo \"🚨 ALERTA: >100 intentos fallidos detectados\" >> \"$HOME/centro_monitoreo/alertas/alerta_logs.txt\"\nEOF", explanation: 'Módulo de análisis de logs.' },
          { cmd: 'chmod +x ~/centro_monitoreo/scripts/mod_logs.sh && bash ~/centro_monitoreo/scripts/mod_logs.sh', explanation: 'Ejecutar el módulo.' },
        ],
        expected: '[...] MÓDULO ANÁLISIS DE LOGS\nIntentos fallidos SSH: 1\nLogins exitosos SSH: 1',
        technical: 'El módulo cuenta métricas clave y las registra. También genera alertas si supera umbrales definidos.',
        hints: ['Crea y ejecuta el módulo de logs'],
      },
      {
        title: 'Implementa el orquestador del Centro de Monitoreo',
        body: 'Crea el script maestro que integra todos los módulos.',
        commands: [
          { cmd: "cat > ~/centro_monitoreo/centro_monitoreo.sh << 'EOF'\n#!/bin/bash\n# ================================================\n#  CENTRO DE MONITOREO LINUX\n#  Developed durante LinuxAcademy 30 Days\n# ================================================\nCM_DIR=\"$HOME/centro_monitoreo\"\nREPORTE=\"$CM_DIR/reportes/reporte_$(date +%Y%m%d_%H%M%S).txt\"\n\nclear\necho \"╔════════════════════════════════════════════╗\"\necho \"║        CENTRO DE MONITOREO LINUX           ║\"\necho \"║   Analista: $(whoami) | $(date '+%d/%m/%Y %H:%M') ║\"\necho \"╚════════════════════════════════════════════╝\"\necho \"\"\necho \"Iniciando monitoreo completo del sistema...\"\necho \"\"\n\nbash \"$CM_DIR/scripts/mod_usuarios.sh\"\necho \"────────────────────────────────────────────\"\nbash \"$CM_DIR/scripts/mod_procesos.sh\"\necho \"────────────────────────────────────────────\"\nbash \"$CM_DIR/scripts/mod_logs.sh\"\necho \"────────────────────────────────────────────\"\n\necho \"\"\necho \"[INTEGRIDAD DEL SISTEMA]\"\nif [ -f \"$CM_DIR/baseline/sistema.sha256\" ]; then\n  sha256sum -c \"$CM_DIR/baseline/sistema.sha256\" 2>&1\nelse\n  echo \"Creando baseline inicial...\"\n  sha256sum /bin/ls /bin/ps /usr/bin/find > \"$CM_DIR/baseline/sistema.sha256\"\n  echo \"Baseline creado en $CM_DIR/baseline/sistema.sha256\"\nfi\n\necho \"\"\necho \"════════════════════════════════════════════\"\necho \" Monitoreo completado: $(date)\"\nALERTAS=$(ls $CM_DIR/alertas/*.txt 2>/dev/null | wc -l)\necho \" Alertas pendientes: $ALERTAS\"\necho \"════════════════════════════════════════════\"\nEOF", explanation: 'Orquestador del Centro de Monitoreo.' },
          { cmd: 'chmod +x ~/centro_monitoreo/centro_monitoreo.sh && bash ~/centro_monitoreo/centro_monitoreo.sh', explanation: 'Ejecutar el Centro de Monitoreo completo.' },
        ],
        expected: '╔════════════════════════════════════════════╗\n║        CENTRO DE MONITOREO LINUX           ║',
        technical: 'El orquestador ejecuta todos los módulos en secuencia, genera el reporte consolidado y muestra el resumen de alertas.',
        hints: ['Crea y ejecuta el Centro de Monitoreo completo'],
      },
    ],
    commonErrors: [
      { error: 'Módulo no ejecutable', solution: 'Usa chmod +x sobre todos los scripts: chmod +x ~/centro_monitoreo/scripts/*.sh' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'El comando `tee -a archivo.txt` escribe en pantalla Y en el archivo usando el modo ___ (sin borrar contenido previo).', correct: ['append', 'añadir', '-a'], explanation: 'tee sin -a sobreescribe el archivo. tee -a (append) añade al final, preservando el historial de logs.' },
    { type: 'multiple', question: '¿Qué hace el patrón `comando | tee -a archivo.log`?', options: ['Solo guarda en archivo', 'Solo muestra en pantalla', 'Muestra en pantalla Y guarda en archivo simultáneamente', 'Comprime y guarda'], correct: 2, explanation: 'tee bifurca la salida: escribe en stdout (pantalla) Y en el archivo. Esencial para scripts que deben mostrar output y también guardarlo.' },
    { type: 'true_false', question: 'Un Centro de Monitoreo Linux construido con bash puede ser una herramienta profesional válida para pequeñas y medianas empresas.', correct: true, explanation: 'Muchas PYMEs no tienen presupuesto para Splunk o QRadar. Scripts bash bien construidos pueden cubrir los casos de uso básicos de monitoreo y detección de intrusos.' },
    { type: 'multiple', question: '¿Qué debería hacer el Centro de Monitoreo si detecta un proceso ejecutándose desde /tmp?', options: ['Ignorarlo', 'Terminar el proceso automáticamente', 'Registrar en log y generar alerta para revisión manual', 'Reiniciar el servidor'], correct: 2, explanation: 'La respuesta automática agresiva (terminar proceso) puede causar daño en falsos positivos. Lo correcto es alertar y registrar para revisión del analista.' },
    { type: 'multiple', question: '¿Por qué los reportes del Centro de Monitoreo deben incluir timestamp en el nombre del archivo?', options: ['Para estética', 'Para identificar cuándo se generó cada reporte y permitir comparación histórica', 'Por requisito de Linux', 'Para compresión'], correct: 1, explanation: 'Los timestamps en nombres de archivos permiten mantener historial de reportes, comparar estados en diferentes momentos y correlacionar con incidentes específicos.' },
  ],
  missions: [
    { id: 'm1d29', title: 'Crea estructura del Centro de Monitoreo', description: 'mkdir centro_monitoreo con subdirectorios', hint: '$ mkdir -p ~/centro_monitoreo/{scripts,logs,reportes,baseline,alertas}', xp: 50, condition: condDir('~/centro_monitoreo/scripts') },
    { id: 'm2d29', title: 'Implementa mod_usuarios.sh', description: 'Módulo de auditoría de usuarios', hint: '$ touch ~/centro_monitoreo/scripts/mod_usuarios.sh', xp: 60, condition: condFile('~/centro_monitoreo/scripts/mod_usuarios.sh') },
    { id: 'm3d29', title: 'Implementa mod_logs.sh', description: 'Módulo de análisis de logs', hint: '$ touch ~/centro_monitoreo/scripts/mod_logs.sh', xp: 60, condition: condFile('~/centro_monitoreo/scripts/mod_logs.sh') },
    { id: 'm4d29', title: 'Ejecuta el Centro de Monitoreo completo', description: 'bash centro_monitoreo.sh', hint: '$ bash ~/centro_monitoreo/centro_monitoreo.sh', xp: 80, condition: condFile('~/centro_monitoreo/centro_monitoreo.sh') },
  ],
  resources: [
    { name: 'SOC Analyst Roadmap', url: 'https://pauljerimy.com/security-certification-roadmap/', icon: '🎯' },
    { name: 'Linux Security Toolkit', url: 'https://github.com/trimstray/linux-hardening-checklist', icon: '🛡️' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 30 — Certificación y Revisión Final
// ─────────────────────────────────────────────────────────────
{
  day: 30, title: 'Certificación y Revisión Final',
  category: 'cyber', xp: 1000,
  tags: ['certificación', 'revisión', 'carrera', 'linux', 'ciberseguridad'],
  objectives: [
    'Revisar y consolidar todos los conocimientos del curso',
    'Completar el examen final de certificación',
    'Definir el camino profesional a seguir',
    'Conocer las certificaciones de la industria',
    'Celebrar el logro de los 30 días',
  ],
  theory: {
    intro: '¡Llegaste al Día 30! En estos 30 días has construido una base sólida en Linux, Bash y Ciberseguridad. Hoy hacemos una revisión completa de lo aprendido y trazamos el camino a seguir en tu carrera profesional.',
    sections: [
      {
        type: 'dual',
        technical: 'Has cubierto: arquitectura Linux (FHS, procesos, usuarios), shell scripting avanzado (variables, funciones, condicionales, bucles), herramientas de texto (grep, awk, sed), administración de red (SSH, firewall, análisis), y ciberseguridad aplicada (logs, IDS, hardening, forense básico).',
        simple: 'En 30 días pasaste de "¿qué es un terminal?" a construir un Centro de Monitoreo Linux funcional, escribir scripts de seguridad y entender cómo proteger servidores. Eso es un salto enorme.',
      },
      {
        type: 'text',
        title: 'Certificaciones recomendadas como siguiente paso',
        body: 'CompTIA Linux+ (LX0-103/104): certificación de administración Linux. LPIC-1 y LPIC-2: Linux Professional Institute, reconocido globalmente. CompTIA Security+: base de ciberseguridad. eJPT (eLearnSecurity Junior Penetration Tester): pentesting entry level. CEH (Certified Ethical Hacker): hacking ético. OSCP (Offensive Security Certified Professional): el más respetado en pentesting.',
      },
      {
        type: 'text',
        title: 'Rutas de carrera desde aquí',
        body: 'Administrador de Sistemas Linux: gestionar servidores, automatización, cloud. Analista SOC (Nivel 1-3): monitorear incidentes de seguridad, respuesta a alertas. Pentester Junior: pruebas de penetración con Kali Linux. DevSecOps: integrar seguridad en pipelines de desarrollo. Cloud Security Engineer: AWS/Azure/GCP + Linux + seguridad.',
      },
      {
        type: 'note',
        label: 'Lo que sigue: recursos de práctica',
        body: 'TryHackMe: plataforma de aprendizaje guiado de ciberseguridad. Hack The Box: práctica con máquinas virtuales reales. PicoCTF: competencias CTF para principiantes. VulnHub: máquinas vulnerables para practicar. OverTheWire: wargames de Linux y seguridad. Root-Me: desafíos de seguridad variados.',
      },
    ],
    diagram: {
      title: 'Tu progreso en 30 días',
      content: `DÍA 1-3:   Linux básico (ls, cd, pwd)
         │
DÍA 4-6:   Archivos, permisos y usuarios
         │
DÍA 7-9:   Logs, búsqueda, pipes
         │
DÍA 10-13: Bash scripting (variables, if, for, funciones)
         │
DÍA 14-16: sed/awk, procesos, redes
         │
DÍA 17-19: SSH, cron, backups
         │
DÍA 20:    INICIO CIBERSEGURIDAD ← Punto de inflexión
         │
DÍA 21-23: Logs forenses, procesos maliciosos, C2
         │
DÍA 24-26: Hardening, auditoría, IDS bash
         │
DÍA 27-28: Scripts defensivos, firewall
         │
DÍA 29:    ★ CENTRO DE MONITOREO LINUX ★
         │
DÍA 30:    ¡GRADUADO! 🎓`,
    },
    realCase: {
      title: 'De estudiante a analista SOC en 6 meses',
      body: 'Muchos analistas SOC comenzaron exactamente donde estás tú: aprendiendo Linux desde cero. Con la base de este curso + práctica en TryHackMe (3-4 horas/semana) + CompTIA Security+ o eJPT, el salto a un puesto junior de analista SOC o administrador de sistemas junior es alcanzable en 3-6 meses de preparación adicional.',
    },
  },
  commands: [],
  lab: {
    title: 'Examen Final: Demostración de Competencias',
    context: 'Este es el examen final del curso. Debes demostrar que dominas los conceptos y herramientas de Linux y Ciberseguridad aprendidos durante los 30 días.',
    duration: '45 min', xp: 300,
    steps: [
      {
        title: 'Examen Parte 1: Auditoría completa del sistema',
        body: 'Ejecuta una auditoría completa del sistema documentando el resultado.',
        commands: [
          { cmd: "cat > ~/laboratorios/examen_final.txt << 'EOF'\n=== EXAMEN FINAL - LINUXACADEMY 30 DÍAS ===\nFecha: $(date)\nAnalista: $(whoami)\nServidor: $(uname -n)\n\nSECCIÓN 1: INFORMACIÓN DEL SISTEMA\nEOF", explanation: 'Crear el documento del examen.' },
          { cmd: 'uname -a >> ~/laboratorios/examen_final.txt && echo "Sistema documentado ✓"', explanation: 'Documentar el sistema.' },
          { cmd: 'cat /etc/os-release >> ~/laboratorios/examen_final.txt && echo "OS documentado ✓"', explanation: 'Documentar la distribución.' },
        ],
        expected: 'Sistema documentado ✓\nOS documentado ✓',
        technical: 'La documentación sistemática es el primer paso de cualquier auditoría profesional.',
        hints: ['Crea el documento de examen y documenta el sistema'],
      },
      {
        title: 'Examen Parte 2: Análisis de usuarios y permisos',
        body: 'Audita los usuarios, grupos y permisos del sistema.',
        commands: [
          { cmd: "echo '\n=== SECCIÓN 2: USUARIOS Y PERMISOS ===' >> ~/laboratorios/examen_final.txt", explanation: 'Nueva sección.' },
          { cmd: "grep '/bin/bash' /etc/passwd >> ~/laboratorios/examen_final.txt && echo 'Usuarios auditados ✓'", explanation: 'Usuarios con shell.' },
          { cmd: "find /home -perm -4000 -type f 2>/dev/null >> ~/laboratorios/examen_final.txt; echo 'Permisos SUID auditados ✓'", explanation: 'Archivos SUID en home.' },
        ],
        expected: 'Usuarios auditados ✓\nPermisos SUID auditados ✓',
        technical: 'La auditoría de usuarios y permisos SUID es parte del checklist estándar de hardening.',
        hints: ['Añade la sección de usuarios al documento de examen'],
      },
      {
        title: 'Examen Parte 3: Análisis de red y seguridad',
        body: 'Analiza las conexiones de red y los logs de seguridad.',
        commands: [
          { cmd: "echo '\n=== SECCIÓN 3: RED Y SEGURIDAD ===' >> ~/laboratorios/examen_final.txt", explanation: 'Nueva sección.' },
          { cmd: "ss -tlnp >> ~/laboratorios/examen_final.txt && echo 'Puertos auditados ✓'", explanation: 'Puertos en escucha.' },
          { cmd: "grep -c 'Failed password' /var/log/auth.log >> ~/laboratorios/examen_final.txt 2>/dev/null; echo 'Logs analizados ✓'", explanation: 'Contar intentos fallidos.' },
        ],
        expected: 'Puertos auditados ✓\nLogs analizados ✓',
        technical: 'Combinar análisis de red con análisis de logs da una visión completa de la postura de seguridad.',
        hints: ['Añade la sección de red al documento de examen'],
      },
      {
        title: 'Examen Parte 4: Ejecuta el Centro de Monitoreo',
        body: 'Demuestra que el Centro de Monitoreo del Día 29 funciona.',
        commands: [
          { cmd: 'ls ~/centro_monitoreo/scripts/', explanation: 'Verificar que los módulos existen.' },
          { cmd: 'bash ~/centro_monitoreo/scripts/mod_usuarios.sh 2>/dev/null || echo "Módulo de usuarios ejecutado"', explanation: 'Ejecutar módulo de usuarios.' },
          { cmd: 'bash ~/centro_monitoreo/scripts/mod_logs.sh 2>/dev/null || echo "Módulo de logs ejecutado"', explanation: 'Ejecutar módulo de logs.' },
        ],
        expected: 'mod_usuarios.sh  mod_procesos.sh  mod_logs.sh',
        technical: 'La ejecución del proyecto final demuestra integración de todos los conocimientos del curso.',
        hints: ['Ejecuta los módulos del Centro de Monitoreo'],
      },
      {
        title: '🎓 Finalización y Certificación',
        body: 'Completa el examen y genera tu documento de certificación.',
        commands: [
          { cmd: "cat >> ~/laboratorios/examen_final.txt << 'EOF'\n\n=== RESULTADO DEL EXAMEN ===\nFechas del curso: 30 días completados\nCompetencias demostradas:\n- Administración Linux (navegación, archivos, permisos)\n- Scripting Bash (variables, funciones, condicionales, bucles)\n- Herramientas de texto (grep, awk, sed)\n- Administración de red (SSH, firewall, monitoreo)\n- Ciberseguridad aplicada (análisis logs, IDS, hardening)\n- Proyecto Final: Centro de Monitoreo Linux\n\nEstado: APROBADO ✓\nEOF", explanation: 'Completar el documento de examen.' },
          { cmd: 'cat ~/laboratorios/examen_final.txt', explanation: 'Ver el examen completo.' },
          { cmd: 'echo "🎓 ¡FELICITACIONES! Has completado LinuxAcademy 30 Días"', explanation: 'Mensaje de graduación.' },
        ],
        expected: '🎓 ¡FELICITACIONES! Has completado LinuxAcademy 30 Días',
        technical: 'Has completado el curso más intensivo de Linux, Bash y Ciberseguridad. Este conocimiento es la base de una carrera profesional en tecnología.',
        hints: ['Completa el documento de examen'],
      },
    ],
    commonErrors: [],
  },
  quiz: [
    { type: 'multiple', question: '¿Cuál de estos comandos muestra la versión del kernel de Linux?', options: ['kernel --version', 'uname -r', 'linux -v', 'cat /kernel'], correct: 1, explanation: 'uname -r muestra la versión del kernel. uname -a muestra información completa del sistema.' },
    { type: 'fill', question: 'Para buscar archivos con permisos SUID: `find / -perm ___ -type f 2>/dev/null`', correct: ['-4000', '-u+s'], explanation: '-perm -4000 encuentra archivos con el bit SUID activado. Son potenciales vectores de escalada de privilegios.' },
    { type: 'multiple', question: '¿Qué hace el pipeline `grep "Failed password" auth.log | awk \'{print $11}\' | sort | uniq -c | sort -rn`?', options: ['Elimina intentos fallidos', 'Lista IPs atacantes ordenadas por número de intentos', 'Bloquea IPs', 'Comprime el log'], correct: 1, explanation: 'Este pipeline extrae las IPs de los intentos fallidos, las ordena y cuenta frecuencia. El estándar de análisis de fuerza bruta SSH.' },
    { type: 'true_false', question: 'Los conocimientos de Linux son necesarios para trabajar en ciberseguridad.', correct: true, explanation: 'El 96% de los servidores del mundo usan Linux. SSH, logs, procesos y permisos son conceptos que todo profesional de seguridad debe dominar.' },
    { type: 'multiple', question: '¿Cuál es la certificación más reconocida en el mundo del pentesting profesional?', options: ['CompTIA A+', 'OSCP (Offensive Security Certified Professional)', 'CompTIA Security+', 'CEH'], correct: 1, explanation: 'OSCP es la certificación más respetada en pentesting porque requiere un examen práctico de 24 horas comprometiendo máquinas reales, no solo preguntas teóricas.' },
  ],
  missions: [
    { id: 'm1d30', title: 'Crea el documento del examen final', description: 'Archivo examen_final.txt en laboratorios/', hint: '$ cat > ~/laboratorios/examen_final.txt', xp: 50, condition: condFile('~/laboratorios/examen_final.txt') },
    { id: 'm2d30', title: 'Audita usuarios y permisos', description: "grep '/bin/bash' /etc/passwd >> examen_final.txt", hint: "$ grep '/bin/bash' /etc/passwd >> ~/laboratorios/examen_final.txt", xp: 60, condition: { type: 'command_executed', command: "grep '/bin/bash' /etc/passwd" } },
    { id: 'm3d30', title: 'Analiza puertos y logs', description: 'ss -tlnp y grep Failed password', hint: '$ ss -tlnp', xp: 60, condition: condCmd('ss') },
    { id: 'm4d30', title: '¡Ejecuta el Centro de Monitoreo!', description: 'Demuestra que el proyecto final funciona', hint: '$ bash ~/centro_monitoreo/scripts/mod_usuarios.sh', xp: 100, condition: condCmd('bash') },
  ],
  resources: [
    { name: 'TryHackMe - Siguiente paso', url: 'https://tryhackme.com', icon: '🎯' },
    { name: 'Hack The Box Academy', url: 'https://academy.hackthebox.com', icon: '📦' },
    { name: 'OSCP Certification', url: 'https://www.offensive-security.com/pwk-oscp/', icon: '🏆' },
    { name: 'Linux Foundation Training', url: 'https://training.linuxfoundation.org', icon: '🐧' },
  ],
},

]
