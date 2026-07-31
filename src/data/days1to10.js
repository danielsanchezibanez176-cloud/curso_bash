/* ============================================================
   days1to10.js — Contenido completo Días 1 al 10
   ============================================================ */
import { condCmd, condDir, condFile, condCwd, condFlag, condAll, condAny } from '../utils/missionEvaluator.js'

export const days1to10 = [

// ─────────────────────────────────────────────────────────────
// DÍA 1 — Introducción a Linux y VirtualBox
// ─────────────────────────────────────────────────────────────
{
  day: 1, title: 'Introducción a Linux y VirtualBox',
  category: 'linux', xp: 200,
  tags: ['linux', 'virtualbox', 'ubuntu', 'fundamentos'],
  objectives: [
    'Entender qué es Linux y por qué es usado en servidores y ciberseguridad',
    'Conocer las distribuciones Linux más importantes',
    'Instalar VirtualBox y Ubuntu Desktop',
    'Navegar la interfaz gráfica de Ubuntu',
  ],
  theory: {
    intro: 'Linux es el sistema operativo que impulsa el 96% de los servidores del mundo, el 100% de las supercomputadoras y es la base de Android. Aprender Linux no es opcional para un profesional de sistemas: es esencial.',
    sections: [
      {
        type: 'dual',
        technical: 'Linux es un kernel de sistema operativo de código abierto creado por Linus Torvalds en 1991. Se distribuye bajo la licencia GPL y permite acceso completo al código fuente. Las distribuciones (distros) empaquetan el kernel con herramientas GNU y software adicional.',
        simple: 'Linux es como el "motor" de un sistema operativo. Windows y macOS tienen sus propios motores cerrados. Linux es gratuito, transparente y puedes ver exactamente cómo funciona por dentro.',
      },
      {
        type: 'text',
        title: '¿Por qué Linux en Ciberseguridad?',
        body: 'El 90% de las herramientas de hacking ético y análisis forense están hechas para Linux: Metasploit, Nmap, Wireshark, Burp Suite. Distribuciones como Kali Linux y Parrot OS están diseñadas específicamente para profesionales de seguridad.',
      },
      {
        type: 'text',
        title: 'Distribuciones principales',
        body: 'Ubuntu: ideal para aprender, amigable para principiantes. Kali Linux: hacking ético y pentesting. CentOS/RHEL: servidores empresariales. Debian: base de muchas distros. Arch Linux: control total del sistema.',
      },
      {
        type: 'note',
        label: 'Por qué Ubuntu en este curso',
        body: 'Ubuntu 22.04 LTS es la distribución más usada en el mundo real para servidores y desarrollo. Aprender en Ubuntu te prepara directamente para entornos de producción empresariales.',
      },
    ],
    diagram: {
      title: 'Estructura del sistema Linux',
      content: `Hardware (CPU, RAM, Disco)
    │
    ▼
Kernel Linux (núcleo del SO)
    │
    ├── Gestión de procesos
    ├── Gestión de memoria
    ├── Sistema de archivos
    └── Drivers de hardware
    │
    ▼
Shell (bash, zsh, sh)
    │
    ▼
Aplicaciones (ls, grep, vim, Firefox...)`,
    },
    realCase: {
      title: 'Netflix usa Linux para servir 250 millones de usuarios',
      body: 'Netflix ejecuta toda su infraestructura en servidores Linux (FreeBSD y Ubuntu). Sus ingenieros de sistemas deben dominar Linux para gestionar clusters de miles de servidores, monitorear rendimiento y responder a incidentes de seguridad.',
    },
  },
  commands: [
    {
      name: 'uname',
      brief: 'Muestra información del sistema operativo',
      technical: 'Llama a la syscall uname() que retorna información del kernel almacenada en la estructura utsname.',
      simple: 'Te dice qué versión de Linux estás usando, como leer la etiqueta de tu SO.',
      syntax: [
        { cmd: 'uname',    desc: 'Nombre del SO' },
        { cmd: 'uname', flag: '-r', desc: 'Versión del kernel' },
        { cmd: 'uname', flag: '-a', desc: 'Toda la información del sistema' },
        { cmd: 'uname', flag: '-n', desc: 'Nombre del host' },
      ],
      errors: [
        { msg: 'uname: extra operand', fix: 'Usa solo flags válidas: -a, -r, -n, -m' },
      ],
      security: 'Los atacantes usan `uname -a` como primer comando tras comprometer un sistema para identificar la versión del kernel y buscar exploits conocidos (CVEs).',
    },
    {
      name: 'whoami',
      brief: 'Muestra el nombre del usuario actual',
      technical: 'Lee el UID efectivo del proceso y lo traduce a nombre usando /etc/passwd.',
      simple: 'Le pregunta al sistema "¿Quién soy yo?". Esencial para saber si eres root o un usuario normal.',
      syntax: [
        { cmd: 'whoami', desc: 'Usuario actual' },
      ],
      errors: [],
      security: 'Siempre verifica con whoami después de escalar privilegios en pentesting para confirmar si lograste acceso root.',
    },
    {
      name: 'date',
      brief: 'Muestra o configura la fecha y hora del sistema',
      technical: 'Lee el reloj del sistema vía gettimeofday() y formatea la salida.',
      simple: 'Muestra la fecha y hora actuales del servidor.',
      syntax: [
        { cmd: 'date',                          desc: 'Fecha y hora completa' },
        { cmd: 'date', flag: '"+%Y-%m-%d"',     desc: 'Solo la fecha (2024-01-15)' },
        { cmd: 'date', flag: '"+%H:%M:%S"',     desc: 'Solo la hora' },
      ],
      errors: [],
      security: 'Los logs del sistema incluyen timestamps. Si la hora del servidor está mal configurada, el análisis forense se complica enormemente.',
    },
  ],
  lab: {
    title: 'Exploración inicial del sistema Linux',
    context: 'Eres el nuevo administrador de sistemas de una empresa. Tu primera tarea es documentar la información básica del servidor Linux que vas a administrar.',
    duration: '15 min', xp: 150,
    steps: [
      {
        title: 'Identifica el sistema operativo',
        body: 'Ejecuta el comando para ver la versión completa del kernel y arquitectura.',
        commands: [{ cmd: 'uname -a', explanation: 'Muestra kernel, hostname, arquitectura y más.' }],
        expected: 'Linux linux-academy 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux',
        technical: 'El kernel es el núcleo del SO. La versión 5.15 es la base de Ubuntu 22.04 LTS.',
        hints: ['Usa uname con una flag especial', 'La flag -a significa "all" (todo)', '$ uname -a'],
      },
      {
        title: 'Conoce tu usuario actual',
        body: 'Verifica con qué usuario estás trabajando en el sistema.',
        commands: [{ cmd: 'whoami', explanation: 'Retorna el nombre del usuario actual.' }],
        expected: 'estudiante',
        technical: 'Linux es multiusuario. Saber tu identidad es crítico antes de ejecutar cualquier comando.',
        hints: ['El comando es literalmente "quién soy yo" en inglés', '$ whoami'],
      },
      {
        title: 'Lee el archivo de información del SO',
        body: 'Ubuntu guarda información de la distribución en /etc/os-release.',
        commands: [{ cmd: 'cat /etc/os-release', explanation: 'Muestra la información de la distribución instalada.' }],
        expected: 'NAME="Ubuntu"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"',
        technical: 'El directorio /etc contiene archivos de configuración del sistema. os-release es el estándar freedesktop.org.',
        hints: ['cat muestra el contenido de un archivo', '$ cat /etc/os-release'],
      },
      {
        title: 'Registra la fecha del servidor',
        body: 'Documenta la fecha y hora actual del servidor en formato ISO.',
        commands: [{ cmd: 'date "+%Y-%m-%d %H:%M:%S"', explanation: 'Formato de fecha estándar para logs.' }],
        expected: '2024-01-15 10:23:45',
        technical: 'La sincronización horaria (NTP) es crítica en servidores para correlacionar logs de incidentes.',
        hints: ['Usa date con un formato personalizado', '$ date "+%Y-%m-%d %H:%M:%S"'],
      },
    ],
    commonErrors: [
      { error: 'Permission denied al leer /etc/shadow', solution: 'Es normal. /etc/shadow contiene contraseñas cifradas y solo root puede leerlo.' },
    ],
  },
  quiz: [
    {
      type: 'multiple',
      question: '¿Qué porcentaje aproximado de los servidores web del mundo usan Linux?',
      options: ['40%', '70%', '96%', '100%'],
      correct: 2,
      explanation: 'Linux alimenta aproximadamente el 96% de los servidores del mundo, incluyendo los de Google, Amazon, Netflix y Facebook.',
    },
    {
      type: 'true_false',
      question: 'El comando `whoami` muestra la versión del kernel de Linux.',
      correct: false,
      explanation: 'whoami muestra el nombre del usuario actual. Para ver la versión del kernel usa `uname -r`.',
    },
    {
      type: 'multiple',
      question: '¿Qué distribución de Linux está diseñada específicamente para hacking ético y pentesting?',
      options: ['Ubuntu Server', 'Kali Linux', 'Fedora', 'Linux Mint'],
      correct: 1,
      explanation: 'Kali Linux (antes BackTrack) está desarrollada por Offensive Security específicamente para pentesting y análisis forense.',
    },
    {
      type: 'fill',
      question: 'Para ver TODA la información del sistema operativo (kernel, hostname, arquitectura), usas: `uname ___`',
      correct: ['-a', '-a '],
      explanation: 'La flag -a (all) muestra toda la información disponible: nombre del kernel, hostname, versión, fecha de compilación y arquitectura.',
    },
    {
      type: 'multiple',
      question: '¿Dónde se almacena la información de la distribución Linux instalada?',
      options: ['/var/os-info', '/etc/os-release', '/home/linux-info', '/sys/distro'],
      correct: 1,
      explanation: '/etc/os-release es el archivo estándar donde se guarda el nombre, versión e ID de la distribución Linux.',
    },
  ],
  missions: [
    { id: 'm1d1', title: 'Ejecuta whoami', description: 'Descubre tu usuario actual', hint: '$ whoami', xp: 25, condition: condCmd('whoami') },
    { id: 'm2d1', title: 'Ejecuta uname -a', description: 'Ve la información completa del sistema', hint: '$ uname -a', xp: 25, condition: condFlag('uname', '-a') },
    { id: 'm3d1', title: 'Lee /etc/os-release', description: 'Consulta la información de la distro', hint: '$ cat /etc/os-release', xp: 25, condition: { type: 'command_executed', command: 'cat /etc/os-release' } },
    { id: 'm4d1', title: 'Ejecuta date', description: 'Verifica la hora del servidor', hint: '$ date', xp: 25, condition: condCmd('date') },
  ],
  resources: [
    { name: 'Linux Journey', url: 'https://linuxjourney.com', icon: '🐧' },
    { name: 'Ubuntu Documentation', url: 'https://ubuntu.com/server/docs', icon: '📖' },
    { name: 'The Linux Command Line', url: 'https://linuxcommand.org/tlcl.php', icon: '📚' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 2 — La Terminal: Tu Nueva Herramienta
// ─────────────────────────────────────────────────────────────
{
  day: 2, title: 'La Terminal: Tu Nueva Herramienta',
  category: 'linux', xp: 200,
  tags: ['terminal', 'bash', 'shell', 'cli'],
  objectives: [
    'Abrir y usar la terminal de Ubuntu',
    'Entender qué es el shell y cómo funciona',
    'Usar el historial de comandos',
    'Aplicar atajos de teclado esenciales',
  ],
  theory: {
    intro: 'La terminal es la herramienta más poderosa de Linux. Todo lo que puedes hacer con la interfaz gráfica, puedes hacerlo en la terminal — y miles de cosas más que la GUI no permite.',
    sections: [
      {
        type: 'dual',
        technical: 'El shell es un intérprete de comandos que actúa como interfaz entre el usuario y el kernel. Bash (Bourne Again SHell) lee la entrada del usuario, la parsea, busca el ejecutable correspondiente en el PATH y crea un proceso hijo vía fork()/exec().',
        simple: 'El shell es como un asistente que escucha tus órdenes en texto y las ejecuta. Escribes "ls" y él le pide al sistema operativo que liste los archivos.',
      },
      {
        type: 'text',
        title: 'Anatomía del prompt de bash',
        body: 'El prompt estudiante@linux-academy:~$ tiene 4 partes: (1) "estudiante" es tu usuario, (2) "linux-academy" es el hostname del servidor, (3) "~" es el directorio actual (~ significa /home/estudiante), (4) "$" indica usuario normal (# sería root).',
      },
      {
        type: 'text',
        title: 'Atajos de teclado esenciales',
        body: 'Ctrl+C: cancelar el comando actual. Ctrl+L: limpiar la pantalla (igual que clear). Ctrl+A: ir al inicio de la línea. Ctrl+E: ir al final. Ctrl+R: buscar en el historial. Tab: autocompletar. ↑↓: navegar historial.',
      },
      {
        type: 'note',
        label: 'Terminal vs GUI en Seguridad',
        body: 'En un servidor comprometido o en modo recovery, la GUI puede no estar disponible. Los profesionales de seguridad siempre trabajan en terminal: es más rápido, automatizable y funciona en cualquier servidor remoto vía SSH.',
      },
    ],
    realCase: {
      title: 'Administradores de sistemas manejan 500 servidores desde una terminal',
      body: 'Con herramientas como SSH, tmux y scripts bash, un sysadmin puede administrar cientos de servidores simultáneamente desde una sola terminal. La GUI simplemente no escala a ese nivel.',
    },
  },
  commands: [
    {
      name: 'clear',
      brief: 'Limpia la pantalla de la terminal',
      technical: 'Envía la secuencia de escape ANSI ESC[2J al terminal para limpiar el buffer de pantalla.',
      simple: 'Borra todo lo que hay en pantalla para empezar limpio. También funciona con Ctrl+L.',
      syntax: [{ cmd: 'clear', desc: 'Limpiar pantalla' }],
      errors: [],
      security: 'En auditorías de seguridad, NO uses clear para borrar evidencia. Los logs del sistema registran todos los comandos.',
    },
    {
      name: 'history',
      brief: 'Muestra el historial de comandos ejecutados',
      technical: 'Lee el archivo ~/.bash_history que almacena los últimos N comandos (default 1000) ejecutados.',
      simple: 'Lista todos los comandos que has ejecutado antes. Esencial para recordar qué hiciste.',
      syntax: [
        { cmd: 'history',            desc: 'Ver todo el historial' },
        { cmd: 'history', arg: '20', desc: 'Ver los últimos 20 comandos' },
        { cmd: 'history', flag: '-c', desc: 'Borrar el historial' },
      ],
      errors: [
        { msg: 'history: file cannot be read', fix: 'El archivo ~/.bash_history no existe o no tienes permisos.' },
      ],
      security: 'Los atacantes revisan ~/.bash_history tras comprometer un sistema para ver qué comandos ejecutó el administrador, encontrar contraseñas escritas en texto plano o entender la infraestructura.',
    },
    {
      name: 'echo',
      brief: 'Imprime texto en la terminal',
      technical: 'Escribe los argumentos en stdout. Con -e interpreta secuencias de escape como \\n (nueva línea) y \\t (tab).',
      simple: 'Hace que la terminal "hable". Útil en scripts para mostrar mensajes y para escribir en archivos.',
      syntax: [
        { cmd: 'echo', arg: '"Hola mundo"',     desc: 'Imprimir texto' },
        { cmd: 'echo', arg: '$HOME',             desc: 'Imprimir variable de entorno' },
        { cmd: 'echo', arg: '"texto"', flag: '> archivo.txt', desc: 'Escribir en archivo' },
        { cmd: 'echo', flag: '-e', arg: '"línea1\\nlínea2"', desc: 'Interpretar escapes' },
      ],
      errors: [
        { msg: 'No se ve nada al hacer echo $VARIABLE', fix: 'La variable no está definida. Verifica con env | grep NOMBRE_VARIABLE.' },
      ],
      security: 'echo se usa en scripts de seguridad para generar reportes automáticos y para escribir configuraciones. También se usa en exploits para inyectar comandos.',
    },
  ],
  lab: {
    title: 'Dominar los fundamentos de la terminal',
    context: 'Como analista de seguridad, debes sentirte completamente cómodo en la terminal. Este laboratorio te entrena en los fundamentos que usarás todos los días.',
    duration: '20 min', xp: 150,
    steps: [
      {
        title: 'Explora el prompt y el entorno',
        body: 'Observa el prompt completo e identifica todas sus partes.',
        commands: [
          { cmd: 'echo $USER', explanation: 'Variable del usuario actual' },
          { cmd: 'echo $HOSTNAME', explanation: 'Nombre del servidor' },
          { cmd: 'echo $SHELL', explanation: 'Shell que estás usando' },
        ],
        expected: 'estudiante\nlinux-academy\n/bin/bash',
        technical: 'Bash define variables de entorno automáticamente al iniciar. $USER, $HOME, $PATH son las más importantes.',
        hints: ['Usa echo con el símbolo $ antes del nombre de la variable', '$ echo $USER'],
      },
      {
        title: 'Prueba el historial de comandos',
        body: 'Ve los últimos comandos que has ejecutado.',
        commands: [{ cmd: 'history', explanation: 'Lista todos los comandos anteriores con número.' }],
        expected: '   1  uname -a\n   2  whoami\n   3  history',
        technical: 'Bash almacena el historial en ~/.bash_history. La variable $HISTSIZE controla cuántos comandos guarda.',
        hints: ['El comando se llama igual que el concepto: historial', '$ history'],
      },
      {
        title: 'Usa echo para crear un mensaje',
        body: 'Crea un mensaje personalizado con tu nombre y la fecha.',
        commands: [
          { cmd: 'echo "Soy $USER y hoy es $(date +%d/%m/%Y)"', explanation: 'Combina variables y sustitución de comandos.' },
        ],
        expected: 'Soy estudiante y hoy es 15/01/2024',
        technical: 'La sintaxis $(comando) ejecuta el comando y sustituye su salida en el texto. Se llama "command substitution".',
        hints: ['Usa echo con comillas y variables dentro', '$ echo "Soy $USER"'],
      },
      {
        title: 'Limpia la pantalla',
        body: 'Aplica el atajo de teclado y el comando para limpiar.',
        commands: [{ cmd: 'clear', explanation: 'Equivalente a Ctrl+L.' }],
        expected: '(pantalla limpia)',
        technical: 'clear envía la secuencia ANSI ESC[2J. El historial no se borra, solo la vista.',
        hints: ['El comando en inglés significa "limpiar"', '$ clear  o  Ctrl+L'],
      },
    ],
    commonErrors: [
      { error: 'echo $VARIABLE muestra nada', solution: 'La variable no existe o no está exportada. Usa env para ver todas las variables disponibles.' },
    ],
  },
  quiz: [
    {
      type: 'multiple',
      question: '¿Qué significa el símbolo `$` al final del prompt de bash?',
      options: ['Que el sistema está en modo superusuario', 'Que eres un usuario normal (no root)', 'Que bash tiene un error', 'Que el directorio está vacío'],
      correct: 1,
      explanation: 'El $ indica usuario normal. Cuando eres root (superusuario), el prompt muestra # en su lugar.',
    },
    {
      type: 'fill',
      question: 'Para ver los últimos 10 comandos ejecutados, usas: `___ 10`',
      correct: ['history', 'history '],
      explanation: 'history seguido de un número muestra los últimos N comandos del historial.',
    },
    {
      type: 'true_false',
      question: 'El atajo Ctrl+L hace exactamente lo mismo que el comando `clear`.',
      correct: true,
      explanation: 'Ambos limpian la pantalla de la terminal enviando la secuencia de escape ANSI correspondiente.',
    },
    {
      type: 'multiple',
      question: '¿Dónde guarda bash el historial de comandos?',
      options: ['/var/log/bash.log', '~/.bash_history', '/etc/bash/history', '/tmp/history'],
      correct: 1,
      explanation: 'Bash guarda el historial en el archivo oculto ~/.bash_history en el directorio home del usuario.',
    },
    {
      type: 'multiple',
      question: 'Un atacante que compromete un servidor Linux, ¿qué archivo revisaría para ver qué comandos ejecutó el administrador?',
      options: ['/etc/passwd', '/var/log/syslog', '~/.bash_history', '/proc/commands'],
      correct: 2,
      explanation: '~/.bash_history es lo primero que revisan los atacantes. Por eso nunca debes escribir contraseñas directamente en la terminal.',
    },
  ],
  missions: [
    { id: 'm1d2', title: 'Ejecuta history', description: 'Ve tu historial de comandos', hint: '$ history', xp: 25, condition: condCmd('history') },
    { id: 'm2d2', title: 'Usa echo con variable', description: 'Imprime tu usuario con echo $USER', hint: '$ echo $USER', xp: 25, condition: { type: 'command_executed', command: 'echo $USER' } },
    { id: 'm3d2', title: 'Limpia la pantalla', description: 'Ejecuta clear', hint: '$ clear', xp: 25, condition: condCmd('clear') },
    { id: 'm4d2', title: 'Imprime un mensaje', description: 'Usa echo para mostrar "Hola Linux"', hint: '$ echo "Hola Linux"', xp: 25, condition: condCmd('echo') },
  ],
  resources: [
    { name: 'Bash Manual (GNU)', url: 'https://www.gnu.org/software/bash/manual/', icon: '📖' },
    { name: 'ExplainShell', url: 'https://explainshell.com', icon: '🔍' },
    { name: 'Linux Journey - Getting Started', url: 'https://linuxjourney.com/lesson/the-shell', icon: '🐧' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 3 — Navegación en el Sistema de Archivos
// ─────────────────────────────────────────────────────────────
{
  day: 3, title: 'Navegación en el Sistema de Archivos',
  category: 'linux', xp: 250,
  tags: ['filesystem', 'pwd', 'ls', 'cd', 'rutas'],
  objectives: [
    'Entender la estructura de directorios de Linux (FHS)',
    'Navegar entre directorios con cd',
    'Listar archivos y directorios con ls',
    'Distinguir rutas absolutas de relativas',
    'Ubicar archivos importantes del sistema',
  ],
  theory: {
    intro: 'En Linux todo es un archivo. Los directorios, dispositivos, procesos y conexiones de red se representan como archivos. Entender el sistema de archivos es fundamental para administrar cualquier servidor Linux.',
    sections: [
      {
        type: 'dual',
        technical: 'El Filesystem Hierarchy Standard (FHS) define la estructura de directorios de Linux. El directorio raíz / es el punto de montaje de todo el árbol. Cada directorio tiene un propósito definido: /etc para configuración, /var para datos variables, /bin para binarios esenciales.',
        simple: 'El sistema de archivos de Linux es como un árbol invertido. La raíz (/) está arriba y todo cuelga de ahí. En Windows tienes C:\\, en Linux tienes /.',
      },
      {
        type: 'text',
        title: 'Directorios principales del FHS',
        body: '/home: directorios personales de usuarios. /etc: archivos de configuración. /var: logs, emails, bases de datos. /tmp: archivos temporales. /bin y /usr/bin: comandos del sistema. /sbin: comandos de administración. /opt: software de terceros. /proc: sistema de archivos virtual (info del kernel). /dev: dispositivos.',
      },
      {
        type: 'text',
        title: 'Rutas absolutas vs relativas',
        body: 'Ruta absoluta: empieza con / y describe la ruta completa desde la raíz. Ejemplo: /home/estudiante/documentos. Ruta relativa: desde el directorio actual. Si estás en /home/estudiante, entonces "documentos" es equivalente a /home/estudiante/documentos. El punto (.) es el directorio actual, (..) es el padre.',
      },
      {
        type: 'note',
        body: 'Los atacantes que logran acceso a un sistema siempre ejecutan ls y cd para mapear el sistema de archivos. Saber qué hay en /etc, /var/log y /home les permite escalar privilegios o encontrar información sensible.',
      },
    ],
    diagram: {
      title: 'Árbol de directorios Linux (FHS)',
      content: `/ (raíz)
├── home/
│   └── estudiante/
│       ├── documentos/
│       ├── scripts/
│       └── .bashrc
├── etc/
│   ├── passwd
│   ├── shadow
│   └── hosts
├── var/
│   └── log/
│       ├── syslog
│       └── auth.log
├── tmp/
├── bin/  → /usr/bin/
├── opt/
└── root/`,
    },
    realCase: {
      title: 'Análisis forense: mapear un servidor comprometido',
      body: 'Cuando un servidor es hackeado, el analista forense navega el sistema de archivos buscando backdoors en /tmp, scripts maliciosos en /var/www, y credenciales en /etc. El conocimiento de la estructura FHS es esencial para saber dónde buscar.',
    },
  },
  commands: [
    {
      name: 'pwd',
      brief: 'Print Working Directory — muestra el directorio actual',
      technical: 'Llama a getcwd() que retorna el path absoluto del directorio de trabajo actual del proceso.',
      simple: 'Te dice exactamente dónde estás en el sistema de archivos. Como el "Estás aquí" de un mapa.',
      syntax: [{ cmd: 'pwd', desc: 'Mostrar directorio actual' }],
      errors: [],
      security: 'Siempre usa pwd antes de ejecutar comandos destructivos para asegurarte de estar en el directorio correcto.',
    },
    {
      name: 'ls',
      brief: 'List — listar contenido de un directorio',
      technical: 'Llama a opendir()/readdir() para leer el directorio y stat() para obtener metadata de cada entrada.',
      simple: 'Muestra qué hay dentro de un directorio. Como abrir una carpeta y ver sus archivos.',
      syntax: [
        { cmd: 'ls',                        desc: 'Listar directorio actual' },
        { cmd: 'ls', flag: '-l',            desc: 'Formato largo con permisos, tamaño y fecha' },
        { cmd: 'ls', flag: '-a',            desc: 'Incluir archivos ocultos (empiezan con .)' },
        { cmd: 'ls', flag: '-la',           desc: 'Largo + ocultos (combinación más útil)' },
        { cmd: 'ls', flag: '-lh',           desc: 'Tamaños legibles (KB, MB, GB)' },
        { cmd: 'ls', arg: '/etc',           desc: 'Listar directorio específico' },
        { cmd: 'ls', flag: '-R',            desc: 'Recursivo (todos los subdirectorios)' },
      ],
      errors: [
        { msg: 'ls: cannot access: No such file or directory', fix: 'El directorio no existe. Verifica la ruta con pwd y revisa la ortografía.' },
        { msg: 'ls: cannot open directory: Permission denied', fix: 'No tienes permisos para ver ese directorio. Necesitas sudo o ser root.' },
      ],
      security: 'ls -la muestra todos los archivos incluyendo ocultos (.ssh, .bashrc, .env). Los archivos de configuración ocultos frecuentemente contienen credenciales.',
    },
    {
      name: 'cd',
      brief: 'Change Directory — cambiar de directorio',
      technical: 'Llama a chdir() para cambiar el directorio de trabajo del proceso shell. Actualiza las variables $PWD y $OLDPWD.',
      simple: 'Te mueves de una carpeta a otra. Es como hacer doble clic en una carpeta pero desde la terminal.',
      syntax: [
        { cmd: 'cd', arg: 'documentos',          desc: 'Ir a un directorio (ruta relativa)' },
        { cmd: 'cd', arg: '/home/estudiante',     desc: 'Ir a una ruta absoluta' },
        { cmd: 'cd', arg: '~',                   desc: 'Ir al home del usuario actual' },
        { cmd: 'cd',                              desc: 'Sin argumentos: ir al home' },
        { cmd: 'cd', arg: '..',                  desc: 'Subir un nivel (directorio padre)' },
        { cmd: 'cd', arg: '-',                   desc: 'Volver al directorio anterior' },
      ],
      errors: [
        { msg: 'cd: nombre: No such file or directory', fix: 'El directorio no existe. Usa ls para ver qué hay disponible.' },
        { msg: 'cd: nombre: Not a directory', fix: 'Estás intentando entrar a un archivo, no a un directorio.' },
        { msg: 'cd: nombre: Permission denied', fix: 'No tienes permiso de acceso. El directorio requiere permisos de ejecución (x).' },
      ],
      security: 'cd /etc seguido de ls -la es uno de los primeros movimientos en un ataque para encontrar archivos de configuración con credenciales.',
    },
  ],
  lab: {
    title: 'Navegación forense del sistema de archivos',
    context: 'Acabas de obtener acceso a un servidor sospechoso. Debes mapear su estructura de archivos para preparar el informe de incidentes.',
    duration: '25 min', xp: 150,
    steps: [
      {
        title: 'Identifica tu posición actual',
        body: 'Antes de moverte, siempre sabe dónde estás.',
        commands: [{ cmd: 'pwd', explanation: 'Muestra el directorio de trabajo actual.' }],
        expected: '/home/estudiante',
        technical: 'El directorio home del usuario es /home/nombre_usuario. Al iniciar sesión, bash siempre te posiciona aquí.',
        hints: ['pwd = Print Working Directory', '$ pwd'],
      },
      {
        title: 'Lista el contenido con detalle',
        body: 'Ve todos los archivos incluyendo ocultos con formato largo.',
        commands: [{ cmd: 'ls -la', explanation: 'Combina formato largo (-l) con mostrar ocultos (-a).' }],
        expected: 'drwxr-xr-x  estudiante  documentos/\ndrwxr-xr-x  estudiante  scripts/',
        technical: 'Los archivos que empiezan con punto (.) son ocultos en Linux. .bashrc y .bash_history son los más importantes del home.',
        hints: ['Combina las flags -l y -a en un solo flag', '$ ls -la'],
      },
      {
        title: 'Explora el directorio /etc',
        body: 'Navega a /etc y lista su contenido. Aquí están las configuraciones del sistema.',
        commands: [
          { cmd: 'cd /etc', explanation: 'Navegar usando ruta absoluta.' },
          { cmd: 'ls', explanation: 'Ver qué archivos de configuración hay.' },
        ],
        expected: 'hostname  hosts  os-release  passwd  shadow',
        technical: '/etc contiene todos los archivos de configuración del sistema. Es el objetivo principal de los atacantes buscando credenciales.',
        hints: ['Usa cd con la ruta absoluta', '$ cd /etc'],
      },
      {
        title: 'Lee el archivo hosts',
        body: 'El archivo /etc/hosts define resolución de nombres local.',
        commands: [{ cmd: 'cat /etc/hosts', explanation: 'Ver el mapeo de IPs a hostnames.' }],
        expected: '127.0.0.1\tlocalhost\n127.0.1.1\tlinux-academy',
        technical: '/etc/hosts se consulta antes que DNS. Los atacantes lo modifican para redirigir dominios (ataques de envenenamiento de hosts).',
        hints: ['Usa cat seguido de la ruta del archivo', '$ cat /etc/hosts'],
      },
      {
        title: 'Regresa al home',
        body: 'Vuelve a tu directorio home usando el atajo.',
        commands: [{ cmd: 'cd ~', explanation: 'El símbolo ~ siempre apunta al home del usuario.' }],
        expected: '/home/estudiante',
        technical: '~ es una expansión de bash equivalente a $HOME. cd sin argumentos hace lo mismo.',
        hints: ['Usa cd con el símbolo tilde (~)', '$ cd ~'],
      },
    ],
    commonErrors: [
      { error: 'Permission denied al entrar a /root', solution: '/root es el home de root. Solo root puede acceder. Usa sudo o inicia sesión como root.' },
      { error: 'cd: no such file or directory', solution: 'Verifica con ls que el directorio existe y revisa mayúsculas/minúsculas (Linux distingue entre Docs y docs).' },
    ],
  },
  quiz: [
    {
      type: 'fill',
      question: 'Para listar TODOS los archivos (incluyendo ocultos) con formato detallado, usas: `ls ___`',
      correct: ['-la', '-al', '-la '],
      explanation: '-l activa el formato largo y -a incluye archivos ocultos. Se pueden combinar como -la o -al.',
    },
    {
      type: 'multiple',
      question: '¿En qué directorio de Linux se guardan los archivos de configuración del sistema?',
      options: ['/config', '/etc', '/sys', '/var'],
      correct: 1,
      explanation: '/etc (Editable Text Configuration) es el directorio estándar para archivos de configuración del sistema en Linux.',
    },
    {
      type: 'true_false',
      question: 'En Linux, `cd ..` te lleva al directorio raíz (`/`).',
      correct: false,
      explanation: 'cd .. te lleva UN nivel arriba (al directorio padre). Para ir a la raíz usas cd / o cd /',
    },
    {
      type: 'multiple',
      question: '¿Cuál de estas es una ruta ABSOLUTA?',
      options: ['documentos/proyecto', '../config', '/home/estudiante/scripts', './scripts'],
      correct: 2,
      explanation: 'Las rutas absolutas empiezan siempre con /. Las relativas no tienen / al inicio.',
    },
    {
      type: 'multiple',
      question: 'Un atacante busca credenciales guardadas en archivos de configuración. ¿Qué directorio exploraría primero?',
      options: ['/tmp', '/home', '/etc', '/bin'],
      correct: 2,
      explanation: '/etc contiene archivos como passwd, shadow, y configuraciones de servicios que frecuentemente incluyen credenciales.',
    },
  ],
  missions: [
    { id: 'm1d3', title: 'Ejecuta pwd', description: 'Muestra el directorio actual', hint: '$ pwd', xp: 20, condition: condCmd('pwd') },
    { id: 'm2d3', title: 'Lista con ls -la', description: 'Muestra archivos ocultos y detalles', hint: '$ ls -la', xp: 30, condition: condFlag('ls', '-la') },
    { id: 'm3d3', title: 'Navega a /etc', description: 'Entra al directorio de configuración', hint: '$ cd /etc', xp: 30, condition: condCwd('/etc') },
    { id: 'm4d3', title: 'Regresa al home', description: 'Usa cd ~ para volver', hint: '$ cd ~', xp: 20, condition: condCwd('/home/estudiante') },
  ],
  resources: [
    { name: 'Linux FHS Reference', url: 'https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html', icon: '📋' },
    { name: 'Linux Journey - Filesystem', url: 'https://linuxjourney.com/lesson/filesystem-hierarchy', icon: '🐧' },
    { name: 'Arch Wiki - Filesystem Hierarchy', url: 'https://wiki.archlinux.org/title/Filesystem_hierarchy', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 4 — Manipulación de Archivos y Directorios
// ─────────────────────────────────────────────────────────────
{
  day: 4, title: 'Manipulación de Archivos y Directorios',
  category: 'linux', xp: 250,
  tags: ['mkdir', 'touch', 'cp', 'mv', 'rm', 'cat'],
  objectives: [
    'Crear archivos y directorios',
    'Copiar y mover archivos',
    'Eliminar archivos y directorios de forma segura',
    'Ver y crear contenido en archivos de texto',
  ],
  theory: {
    intro: 'La gestión de archivos es una de las habilidades más usadas en administración de sistemas. Desde hacer backups hasta organizar logs, estos comandos son parte del trabajo diario de cualquier sysadmin.',
    sections: [
      {
        type: 'dual',
        technical: 'En Linux, los archivos son inodos (estructuras de datos) que apuntan a bloques de datos en disco. mkdir crea un nuevo inodo de tipo directorio. touch actualiza el timestamp o crea un inodo vacío. cp crea una nueva referencia a bloques de datos (hard link) o copia física. rm elimina la referencia del directorio pero los datos persisten hasta que el espacio sea reutilizado.',
        simple: 'Los archivos en Linux son como cajas en un almacén. mkdir crea una caja nueva. touch crea una caja vacía. cp hace una copia de la caja. mv mueve la caja a otro lugar. rm descarta la caja.',
      },
      {
        type: 'text',
        title: 'El peligro de rm en Linux',
        body: 'A diferencia de Windows, rm elimina archivos sin papelera de reciclaje. No hay "deshacer". rm -rf / eliminaría TODO el sistema operativo. Por eso NUNCA ejecutes rm con -f o -r sin estar absolutamente seguro de la ruta. Siempre verifica con pwd antes.',
      },
      {
        type: 'note',
        label: 'Backups y Forense',
        body: 'cp -r se usa constantemente para hacer copias de archivos críticos antes de modificarlos. En análisis forense, SIEMPRE se trabaja sobre una copia (imagen forense), nunca sobre el original. mv se usa para organizar evidencias sin modificar los datos originales.',
      },
    ],
    realCase: {
      title: 'Organización de logs en un SOC (Security Operations Center)',
      body: 'En un SOC, los analistas usan mkdir para crear directorios de casos (mkdir caso_2024_001), cp para copiar logs sospechosos sin alterar el original, y mv para clasificar evidencias. La correcta gestión de archivos es parte del procedimiento de cadena de custodia digital.',
    },
  },
  commands: [
    {
      name: 'mkdir',
      brief: 'Make Directory — crear directorios',
      technical: 'Llama a mkdir() o mkdirat() con los permisos heredados de umask (default 0022, resultado 755).',
      simple: 'Crea carpetas nuevas. Como crear una carpeta en Windows pero desde la terminal.',
      syntax: [
        { cmd: 'mkdir', arg: 'proyecto',           desc: 'Crear un directorio' },
        { cmd: 'mkdir', flag: '-p', arg: 'a/b/c',  desc: 'Crear árbol de directorios completo' },
        { cmd: 'mkdir', arg: 'dir1 dir2 dir3',     desc: 'Crear múltiples directorios' },
      ],
      errors: [
        { msg: 'mkdir: cannot create directory: File exists', fix: 'El directorio ya existe. Usa -p para ignorar este error.' },
        { msg: 'mkdir: cannot create directory: Permission denied', fix: 'No tienes permisos en ese directorio. Navega a uno donde tengas permisos o usa sudo.' },
      ],
      security: 'Los malware frecuentemente crean directorios ocultos (mkdir .hidden_dir) en /tmp o /var para almacenar herramientas. Busca directorios sospechosos con ls -la /tmp.',
    },
    {
      name: 'touch',
      brief: 'Crear archivos vacíos o actualizar timestamps',
      technical: 'Llama a utimes() para actualizar atime/mtime. Si el archivo no existe, lo crea vía open() con O_CREAT.',
      simple: 'Crea un archivo vacío o "toca" uno existente para actualizar su fecha de modificación.',
      syntax: [
        { cmd: 'touch', arg: 'archivo.txt',       desc: 'Crear archivo vacío' },
        { cmd: 'touch', arg: 'a.txt b.txt c.txt', desc: 'Crear múltiples archivos' },
      ],
      errors: [
        { msg: 'touch: cannot touch: Permission denied', fix: 'No tienes permisos de escritura en ese directorio.' },
      ],
      security: 'Los atacantes usan touch -t para modificar el timestamp de archivos maliciosos y dificultar el análisis forense.',
    },
    {
      name: 'cp',
      brief: 'Copy — copiar archivos y directorios',
      technical: 'Abre el archivo fuente en modo lectura, crea el destino, copia los datos en chunks y replica los atributos si se solicita.',
      simple: 'Copia archivos o carpetas. El original permanece intacto.',
      syntax: [
        { cmd: 'cp', arg: 'origen.txt destino.txt', desc: 'Copiar archivo' },
        { cmd: 'cp', flag: '-r', arg: 'dir1/ dir2/', desc: 'Copiar directorio completo' },
        { cmd: 'cp', flag: '-p', arg: 'orig dest',  desc: 'Preservar permisos y timestamps' },
        { cmd: 'cp', flag: '-v', arg: 'orig dest',  desc: 'Modo verbose (ver qué se copia)' },
      ],
      errors: [
        { msg: "cp: omitting directory 'dir'", fix: 'Para copiar directorios usa cp -r (recursivo).' },
      ],
      security: 'cp -p preserva los permisos y timestamps originales, crucial en forense para mantener la cadena de custodia.',
    },
    {
      name: 'mv',
      brief: 'Move — mover o renombrar archivos',
      technical: 'Primero intenta rename() (mismo filesystem, operación atómica). Si falla (filesystems distintos), hace cp + rm.',
      simple: 'Mueve archivos de lugar o los renombra. Si origen y destino están en la misma carpeta, es un renombrado.',
      syntax: [
        { cmd: 'mv', arg: 'viejo.txt nuevo.txt',   desc: 'Renombrar archivo' },
        { cmd: 'mv', arg: 'archivo.txt /tmp/',      desc: 'Mover a otro directorio' },
        { cmd: 'mv', flag: '-i', arg: 'src dst',    desc: 'Pedir confirmación si destino existe' },
      ],
      errors: [
        { msg: 'mv: cannot move: Permission denied', fix: 'No tienes permisos en el directorio destino.' },
      ],
      security: 'mv -i previene sobreescribir accidentalmente archivos importantes. Úsalo siempre en servidores de producción.',
    },
    {
      name: 'rm',
      brief: 'Remove — eliminar archivos y directorios',
      technical: 'Llama a unlink() para eliminar la entrada del directorio. El inodo y datos persisten hasta que el recuento de hard links llegue a 0.',
      simple: 'Elimina archivos permanentemente (sin papelera). ¡CUIDADO! No hay deshacer.',
      syntax: [
        { cmd: 'rm', arg: 'archivo.txt',      desc: 'Eliminar archivo' },
        { cmd: 'rm', flag: '-r', arg: 'dir/', desc: 'Eliminar directorio y contenido' },
        { cmd: 'rm', flag: '-i', arg: 'arch', desc: 'Pedir confirmación antes de eliminar' },
        { cmd: 'rm', flag: '-v', arg: 'arch', desc: 'Verbose: mostrar qué se elimina' },
      ],
      errors: [
        { msg: "rm: cannot remove 'dir': Is a directory", fix: 'Usa rm -r para eliminar directorios.' },
        { msg: 'rm: remove write-protected file?', fix: 'El archivo está protegido. Responde y para confirmar o n para cancelar.' },
      ],
      security: 'NUNCA uses rm -rf sin verificar la ruta con pwd. rm -rf / destruiría el sistema. Los rootkits a veces borran logs con rm para cubrir rastros.',
    },
  ],
  lab: {
    title: 'Crear la estructura de directorios para una empresa',
    context: 'Tu empresa necesita organizar su servidor Linux. Debes crear la estructura de carpetas para el departamento de IT, con áreas separadas para proyectos, backups y logs.',
    duration: '25 min', xp: 150,
    steps: [
      {
        title: 'Crea la estructura principal',
        body: 'Crea el árbol de directorios de la empresa de una sola vez.',
        commands: [
          { cmd: 'mkdir -p ~/empresa/{proyectos,backups,logs,scripts}', explanation: 'La sintaxis {} crea múltiples directorios a la vez.' },
        ],
        expected: 'Directorios empresa/ y sus subdirectorios creados',
        technical: 'La expansión de llaves {a,b,c} en bash genera múltiples argumentos. Es una forma eficiente de crear estructuras.',
        hints: ['Usa mkdir -p con llaves para crear múltiples subdirectorios', '$ mkdir -p ~/empresa/{proyectos,backups,logs}'],
      },
      {
        title: 'Crea subdirectorios de proyectos',
        body: 'Organiza los proyectos en trimestres.',
        commands: [
          { cmd: 'mkdir -p ~/empresa/proyectos/{Q1,Q2,Q3,Q4}', explanation: 'Crea un directorio por trimestre.' },
        ],
        expected: 'Q1/ Q2/ Q3/ Q4/ creados dentro de proyectos/',
        technical: 'mkdir -p no falla si los directorios padre ya existen. Ideal para scripts que se ejecutan múltiples veces.',
        hints: ['Mismo patrón que el paso anterior con los trimestres', '$ mkdir -p ~/empresa/proyectos/{Q1,Q2,Q3,Q4}'],
      },
      {
        title: 'Crea archivos de configuración',
        body: 'Crea los archivos base que necesita la empresa.',
        commands: [
          { cmd: 'touch ~/empresa/README.txt', explanation: 'Archivo de documentación.' },
          { cmd: 'touch ~/empresa/logs/system.log', explanation: 'Archivo de log vacío.' },
        ],
        expected: 'README.txt y system.log creados',
        technical: 'touch crea archivos vacíos instantáneamente. Los servicios de Linux crean sus log files de esta manera al iniciarse.',
        hints: ['Usa touch con la ruta completa del archivo', '$ touch ~/empresa/README.txt'],
      },
      {
        title: 'Haz un backup del directorio scripts',
        body: 'Copia el directorio scripts al directorio backups.',
        commands: [
          { cmd: 'cp -r ~/scripts ~/empresa/backups/scripts_backup', explanation: '-r copia recursivamente todo el directorio.' },
        ],
        expected: 'scripts_backup/ creado en backups/',
        technical: 'cp -r replica toda la estructura del directorio. El -p adicional preservaría los permisos y fechas originales.',
        hints: ['Usa cp -r para copiar directorios', '$ cp -r ~/scripts ~/empresa/backups/scripts_backup'],
      },
      {
        title: 'Verifica la estructura creada',
        body: 'Lista la estructura completa de directorios.',
        commands: [
          { cmd: 'ls -la ~/empresa/', explanation: 'Verificar el directorio raíz de la empresa.' },
        ],
        expected: 'proyectos/  backups/  logs/  scripts/  README.txt',
        technical: 'La verificación es parte del proceso. En producción, siempre confirma que las operaciones se completaron correctamente.',
        hints: ['$ ls -la ~/empresa/'],
      },
    ],
    commonErrors: [
      { error: 'mkdir: cannot create directory: File exists', solution: 'Usa mkdir -p para crear directorios sin error aunque ya existan.' },
      { error: 'cp: omitting directory', solution: 'Olvidaste la flag -r. Siempre usa cp -r para copiar directorios.' },
      { error: 'rm: cannot remove: Is a directory', solution: 'Para borrar directorios necesitas rm -r.' },
    ],
  },
  quiz: [
    {
      type: 'fill',
      question: 'Para crear el árbol de directorios /a/b/c de una sola vez, usas: `mkdir ___ /a/b/c`',
      correct: ['-p'],
      explanation: 'La flag -p (parents) crea todos los directorios intermedios necesarios.',
    },
    {
      type: 'multiple',
      question: '¿Qué hace `rm -rf directorio/`?',
      options: [
        'Mueve el directorio a la papelera',
        'Elimina el directorio y TODO su contenido sin pedir confirmación',
        'Renombra el directorio',
        'Comprime el directorio',
      ],
      correct: 1,
      explanation: '-r es recursivo (elimina subdirectorios) y -f es force (sin preguntas). Es extremadamente peligroso sin verificar la ruta.',
    },
    {
      type: 'true_false',
      question: 'El comando `touch` solo sirve para crear archivos vacíos.',
      correct: false,
      explanation: 'touch también actualiza los timestamps (atime y mtime) de archivos existentes sin modificar su contenido.',
    },
    {
      type: 'multiple',
      question: '¿Qué flag de `cp` preserva permisos y timestamps (importante en forense)?',
      options: ['-r', '-v', '-p', '-f'],
      correct: 2,
      explanation: '-p (preserve) mantiene los atributos originales: permisos, propietario y timestamps. Esencial en análisis forense.',
    },
    {
      type: 'multiple',
      question: 'Necesitas renombrar "reporte_v1.txt" a "reporte_final.txt". ¿Qué comando usas?',
      options: [
        'cp reporte_v1.txt reporte_final.txt',
        'rename reporte_v1.txt reporte_final.txt',
        'mv reporte_v1.txt reporte_final.txt',
        'edit reporte_v1.txt reporte_final.txt',
      ],
      correct: 2,
      explanation: 'mv se usa tanto para mover como para renombrar. Si origen y destino están en el mismo directorio, es un renombrado.',
    },
  ],
  missions: [
    { id: 'm1d4', title: 'Crea un directorio "laboratorio1"', description: 'Usa mkdir para crearlo en tu home', hint: '$ mkdir laboratorio1', xp: 30, condition: condDir('~/laboratorio1') },
    { id: 'm2d4', title: 'Crea un archivo "notas.txt"', description: 'Usa touch para crear el archivo', hint: '$ touch notas.txt', xp: 25, condition: condFile('~/notas.txt') },
    { id: 'm3d4', title: 'Copia notas.txt a laboratorio1', description: 'Usa cp para copiarlo', hint: '$ cp notas.txt laboratorio1/', xp: 30, condition: condFile('~/laboratorio1/notas.txt') },
    { id: 'm4d4', title: 'Usa mkdir -p para crear árbol', description: 'Crea dir1/dir2/dir3 de una vez', hint: '$ mkdir -p dir1/dir2/dir3', xp: 25, condition: condDir('~/dir1/dir2/dir3') },
  ],
  resources: [
    { name: 'GNU Coreutils Manual', url: 'https://www.gnu.org/software/coreutils/manual/', icon: '📖' },
    { name: 'Linux Journey - Text-Fu', url: 'https://linuxjourney.com/lesson/stdout-standard-out-redirect', icon: '🐧' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 5 — Permisos y Propietarios en Linux
// ─────────────────────────────────────────────────────────────
{
  day: 5, title: 'Permisos y Propietarios en Linux',
  category: 'linux', xp: 300,
  tags: ['chmod', 'chown', 'permisos', 'seguridad', 'rwx'],
  objectives: [
    'Entender el sistema de permisos rwx de Linux',
    'Leer e interpretar permisos con ls -l',
    'Cambiar permisos con chmod (octal y simbólico)',
    'Cambiar propietarios con chown',
    'Aplicar principio de mínimo privilegio',
  ],
  theory: {
    intro: 'Los permisos de Linux son el mecanismo de seguridad más fundamental del sistema. Mal configurados, permiten que cualquier usuario lea archivos privados o ejecute código malicioso. Este tema es CRÍTICO para la ciberseguridad.',
    sections: [
      {
        type: 'dual',
        technical: 'Cada archivo tiene tres conjuntos de permisos: propietario (user), grupo (group) y otros (others). Cada conjunto tiene tres bits: lectura (r=4), escritura (w=2) y ejecución (x=1). El sistema usa el UID efectivo del proceso para determinar qué conjunto aplicar.',
        simple: 'Imagina un archivo como una caja con 3 candados. El dueño tiene sus propias llaves, el grupo tiene otras, y el resto del mundo tiene las últimas. Cada candado puede permitir: leer el contenido, escribir dentro, o "ejecutar" la caja.',
      },
      {
        type: 'text',
        title: 'Leer los permisos de ls -l',
        body: '-rwxr-xr-- se lee así: primer carácter = tipo (- archivo, d directorio, l enlace). Luego 3 grupos de 3: rwx=propietario puede leer/escribir/ejecutar, r-x=grupo puede leer/ejecutar, r--=otros solo pueden leer.',
      },
      {
        type: 'text',
        title: 'Notación octal de chmod',
        body: 'r=4, w=2, x=1. Suma los valores: 7=rwx, 6=rw-, 5=r-x, 4=r--, 0=---. Ejemplo: chmod 755 script.sh = propietario rwx(7), grupo r-x(5), otros r-x(5). chmod 600 privado.txt = propietario rw-(6), grupo ---(0), otros ---(0).',
      },
      {
        type: 'note',
        label: 'Permisos críticos en seguridad',
        body: 'chmod 777 es PELIGROSO: cualquier usuario puede leer, escribir y ejecutar. chmod 600 para archivos privados (claves SSH). chmod 755 para scripts ejecutables. chmod 644 para archivos de configuración normales. Los errores de permisos son una de las causas más comunes de vulnerabilidades.',
      },
    ],
    diagram: {
      title: 'Anatomía de los permisos Linux',
      content: `-rwxr-xr--  1  estudiante  grupo  1024  Jan 15  archivo.sh
│││││││││││
│││││││││└─ Otros: r-- (solo lectura = 4)
││││││└────  Grupo: r-x (lectura+ejecución = 5)  
│││└───────  Dueño: rwx (total = 7)
││└────────  Tipo: - (archivo regular)
│           d = directorio, l = symlink

Equivalente octal: 754`,
    },
    realCase: {
      title: 'CVE-2021-4034: Escalada de privilegios por permisos incorrectos',
      body: 'PwnKit (CVE-2021-4034) es una vulnerabilidad en pkexec que tenía el bit SUID mal configurado. Cualquier usuario local podía escalar a root en millones de sistemas Linux. Publicada en 2022, afectaba a distribuciones desde 2009. La causa raíz: permisos incorrectos en un ejecutable del sistema.',
    },
  },
  commands: [
    {
      name: 'chmod',
      brief: 'Change Mode — cambiar permisos de archivos',
      technical: 'Llama a chmod() que modifica los 12 bits de permisos del inodo: 9 bits rwxrwxrwx, setuid, setgid y sticky bit.',
      simple: 'Cambia quién puede leer, escribir o ejecutar un archivo. Es el control de acceso de Linux.',
      syntax: [
        { cmd: 'chmod', arg: '755 script.sh',      desc: 'Octal: dueño=rwx, grupo=r-x, otros=r-x' },
        { cmd: 'chmod', arg: '600 privado.txt',    desc: 'Solo el dueño puede leer/escribir' },
        { cmd: 'chmod', arg: '644 config.txt',     desc: 'Dueño rw-, grupo/otros r--' },
        { cmd: 'chmod', arg: '+x script.sh',       desc: 'Simbólico: añadir permiso de ejecución' },
        { cmd: 'chmod', arg: '-w archivo.txt',     desc: 'Quitar permiso de escritura' },
        { cmd: 'chmod', flag: '-R', arg: '755 dir/', desc: 'Recursivo: aplicar a todo el directorio' },
      ],
      errors: [
        { msg: 'chmod: invalid mode: X', fix: 'Verifica la notación octal (solo dígitos 0-7) o simbólica (+x, -w, =r).' },
        { msg: 'chmod: cannot operate on dangling symlink', fix: 'El symlink apunta a un archivo que no existe.' },
      ],
      security: 'chmod 777 es casi siempre un error de seguridad. Los scripts en servidores web con 777 permiten que cualquier proceso del servidor modifique el archivo, facilitando ataques de webshell.',
    },
    {
      name: 'chown',
      brief: 'Change Owner — cambiar propietario de archivos',
      technical: 'Llama a chown() modificando el UID y/o GID en el inodo del archivo.',
      simple: 'Cambia quién es el "dueño" de un archivo. Necesitas ser root para cambiar la propiedad a otro usuario.',
      syntax: [
        { cmd: 'chown', arg: 'juan archivo.txt',        desc: 'Cambiar propietario a juan' },
        { cmd: 'chown', arg: 'juan:developers app/',    desc: 'Cambiar dueño y grupo' },
        { cmd: 'chown', flag: '-R', arg: 'www-data /var/www/', desc: 'Recursivo para servidor web' },
      ],
      errors: [
        { msg: 'chown: invalid user: usuario', fix: 'El usuario no existe. Verifica con cat /etc/passwd.' },
        { msg: 'Operation not permitted', fix: 'chown requiere ser root. Usa sudo chown.' },
      ],
      security: 'Los archivos web deben ser propiedad de www-data (Apache/Nginx), no de root. Si root posee archivos web y el servidor es comprometido, el atacante puede escalar a root.',
    },
  ],
  lab: {
    title: 'Configurar permisos seguros para un servidor web',
    context: 'Tu empresa despliega una aplicación web. Debes configurar los permisos correctos para que sea segura: el servidor puede leer los archivos, los desarrolladores pueden editarlos, y los usuarios anónimos no pueden acceder a archivos privados.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Crea la estructura del proyecto web',
        body: 'Simula la estructura de un proyecto web con archivos públicos y privados.',
        commands: [
          { cmd: 'mkdir -p ~/webproject/{public,private,config}', explanation: 'Directorios para archivos públicos, privados y de configuración.' },
          { cmd: 'touch ~/webproject/public/index.html ~/webproject/private/database.conf ~/webproject/config/app.key', explanation: 'Archivos de ejemplo.' },
        ],
        expected: 'Estructura creada con 3 subdirectorios',
        technical: 'La separación de archivos por acceso es una práctica de seguridad fundamental en servidores web.',
        hints: ['Usa mkdir -p con llaves {public,private,config}'],
      },
      {
        title: 'Configura permisos del directorio público',
        body: 'Los archivos públicos deben ser legibles por todos pero solo editables por el propietario.',
        commands: [
          { cmd: 'chmod 644 ~/webproject/public/index.html', explanation: 'rw-r--r--: dueño lee/escribe, todos solo leen.' },
        ],
        expected: '-rw-r--r-- estudiante index.html',
        technical: '644 es el permiso estándar para páginas web. El servidor web (www-data) puede leerlas, pero no modificarlas.',
        hints: ['644 = rw- para dueño, r-- para grupo y otros', '$ chmod 644 ~/webproject/public/index.html'],
      },
      {
        title: 'Protege el archivo de configuración',
        body: 'El archivo con la clave de la aplicación NO debe ser legible por otros usuarios.',
        commands: [
          { cmd: 'chmod 600 ~/webproject/config/app.key', explanation: 'rw-------: solo el dueño puede leer/escribir.' },
        ],
        expected: '-rw------- estudiante app.key',
        technical: '600 es el permiso estándar para claves SSH, tokens y archivos de configuración sensibles. Si fueran 644, cualquier usuario del sistema podría leer la clave.',
        hints: ['600 = rw- para dueño, nada para el resto', '$ chmod 600 ~/webproject/config/app.key'],
      },
      {
        title: 'Crea un script ejecutable',
        body: 'Crea un script de deploy y dale permisos de ejecución.',
        commands: [
          { cmd: 'touch ~/webproject/deploy.sh', explanation: 'Crear el script.' },
          { cmd: 'chmod 750 ~/webproject/deploy.sh', explanation: '750: dueño rwx, grupo r-x, otros sin acceso.' },
        ],
        expected: '-rwxr-x--- estudiante deploy.sh',
        technical: '750 para scripts: el propietario lo puede ejecutar y modificar, el grupo solo ejecutar, y nadie más puede verlo.',
        hints: ['750 = rwx para dueño, r-x para grupo, --- para otros', '$ chmod 750 ~/webproject/deploy.sh'],
      },
      {
        title: 'Verifica todos los permisos',
        body: 'Confirma que los permisos están correctamente configurados.',
        commands: [{ cmd: 'ls -la ~/webproject/', explanation: 'Ver permisos de todos los archivos y directorios.' }],
        expected: 'deploy.sh: 750, index.html: 644, app.key: 600',
        technical: 'La verificación es obligatoria. Un error de permisos puede dejar expuesto un archivo sensible.',
        hints: ['$ ls -la ~/webproject/'],
      },
    ],
    commonErrors: [
      { error: 'chmod 777 (error común)', solution: 'NUNCA uses 777 en servidores. Da acceso total a cualquier usuario del sistema. Usa 755 para directorios, 644 para archivos web, 600 para archivos sensibles.' },
      { error: 'Permission denied al ejecutar script', solution: 'El script no tiene permiso de ejecución. Usa chmod +x script.sh' },
    ],
  },
  quiz: [
    {
      type: 'multiple',
      question: '¿Qué permisos representan `chmod 755`?',
      options: [
        'Propietario: rwx, Grupo: rwx, Otros: rwx',
        'Propietario: rwx, Grupo: r-x, Otros: r-x',
        'Propietario: rw-, Grupo: r-x, Otros: r-x',
        'Propietario: rwx, Grupo: rw-, Otros: r--',
      ],
      correct: 1,
      explanation: '7=rwx(4+2+1), 5=r-x(4+0+1). 755 = rwxr-xr-x. El estándar para scripts y directorios accesibles.',
    },
    {
      type: 'fill',
      question: 'Para que SOLO el propietario pueda leer y escribir un archivo (600), usas: `chmod ___ archivo`',
      correct: ['600'],
      explanation: '6=rw-(4+2+0), 0=---(0+0+0). chmod 600 = rw-------. Estándar para archivos privados como claves SSH.',
    },
    {
      type: 'true_false',
      question: 'En la salida de `ls -l`, el primer carácter `d` indica que es un directorio.',
      correct: true,
      explanation: 'El primer carácter indica el tipo: d=directorio, -=archivo regular, l=enlace simbólico, b=dispositivo de bloque.',
    },
    {
      type: 'multiple',
      question: '¿Qué permiso octal es el más PELIGROSO para archivos en un servidor web?',
      options: ['644', '755', '777', '600'],
      correct: 2,
      explanation: '777 da permisos totales (lectura, escritura y ejecución) a CUALQUIER usuario del sistema, incluyendo procesos maliciosos.',
    },
    {
      type: 'multiple',
      question: 'Para hacer un script ejecutable solo para su propietario, usas:',
      options: ['chmod 644 script.sh', 'chmod +x script.sh', 'chmod 700 script.sh', 'chmod 755 script.sh'],
      correct: 2,
      explanation: 'chmod 700 = rwx------. Solo el propietario puede leer, escribir y ejecutar. Las demás opciones también dan ejecución al grupo u otros.',
    },
  ],
  missions: [
    { id: 'm1d5', title: 'Crea y protege un archivo con chmod 600', description: 'chmod 600 privado.txt', hint: '$ touch privado.txt && chmod 600 privado.txt', xp: 40, condition: { type: 'command_with_flag', command: 'chmod', flag: '600' } },
    { id: 'm2d5', title: 'Haz un script ejecutable', description: 'Crea script.sh y dale chmod +x', hint: '$ chmod +x script.sh', xp: 30, condition: { type: 'command_with_flag', command: 'chmod', flag: '+x' } },
    { id: 'm3d5', title: 'Lee los permisos con ls -l', description: 'Verifica los permisos de tus archivos', hint: '$ ls -l', xp: 20, condition: condFlag('ls', '-l') },
    { id: 'm4d5', title: 'Aplica chmod 755 a un directorio', description: 'Permisos estándar para directorio', hint: '$ chmod 755 laboratorio1', xp: 30, condition: { type: 'command_with_flag', command: 'chmod', flag: '755' } },
  ],
  resources: [
    { name: 'chmod Calculator', url: 'https://chmod-calculator.com', icon: '🔢' },
    { name: 'Linux Permissions Guide', url: 'https://www.linux.com/training-tutorials/understanding-linux-file-permissions/', icon: '📖' },
    { name: 'Red Hat - Understanding Linux Permissions', url: 'https://www.redhat.com/sysadmin/linux-file-permissions-explained', icon: '🎩' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 6 — Usuarios y Grupos
// ─────────────────────────────────────────────────────────────
{
  day: 6, title: 'Usuarios y Grupos',
  category: 'linux', xp: 300,
  tags: ['usuarios', 'grupos', 'passwd', 'sudo', 'adduser'],
  objectives: [
    'Entender el sistema de usuarios y grupos de Linux',
    'Leer e interpretar /etc/passwd y /etc/group',
    'Crear y gestionar usuarios con useradd/adduser',
    'Gestionar grupos',
    'Usar sudo correctamente',
  ],
  theory: {
    intro: 'Linux es un sistema operativo multiusuario. Cada proceso corre bajo un usuario, cada archivo tiene un propietario. El modelo de usuarios y grupos es la base del control de acceso en cualquier servidor Linux.',
    sections: [
      {
        type: 'dual',
        technical: 'Cada usuario tiene un UID (User ID) único. root tiene UID 0. Los usuarios del sistema tienen UID 1-999. Los usuarios normales empiezan en 1000. /etc/passwd almacena los datos del usuario, /etc/shadow las contraseñas cifradas, /etc/group los grupos.',
        simple: 'Cada persona que usa Linux tiene una cuenta, como una cuenta de email. El administrador se llama "root". Los grupos son como equipos: puedes meter a varios usuarios en un grupo y darle permisos al grupo entero.',
      },
      {
        type: 'text',
        title: 'Anatomía de /etc/passwd',
        body: 'Formato: nombre:x:UID:GID:comentario:home:shell. Ejemplo: estudiante:x:1000:1000:Estudiante Linux:/home/estudiante:/bin/bash. La "x" indica que la contraseña está en /etc/shadow. UID 0 = root (superpoderes), UID ≥ 1000 = usuarios reales.',
      },
      {
        type: 'note',
        label: 'Principio de mínimo privilegio',
        body: 'Un principio fundamental de seguridad: cada usuario y proceso debe tener solo los permisos mínimos necesarios para hacer su trabajo. NUNCA trabajes como root si no es necesario. Un malware que corre como root compromete todo el sistema.',
      },
    ],
    realCase: {
      title: 'Análisis forense: detectar usuarios maliciosos creados por atacantes',
      body: 'Tras comprometer un servidor, los atacantes frecuentemente crean usuarios backdoor con UID 0 (privilegios de root) o añaden usuarios existentes al grupo sudo. En un análisis forense, revisar /etc/passwd y /etc/group para detectar cuentas no autorizadas es un paso obligatorio.',
    },
  },
  commands: [
    {
      name: 'id',
      brief: 'Muestra el UID, GID y grupos del usuario',
      technical: 'Lee los credenciales del proceso actual: UID real, UID efectivo, GID y grupos suplementarios.',
      simple: 'Muestra quién eres numéricamente: tu número de usuario, número de grupo, y a qué grupos perteneces.',
      syntax: [
        { cmd: 'id',            desc: 'Info del usuario actual' },
        { cmd: 'id', arg: 'juan', desc: 'Info de un usuario específico' },
      ],
      errors: [],
      security: 'id es el primer comando para verificar si lograste escalar a root (uid=0). Si ves uid=0(root), tienes control total del sistema.',
    },
    {
      name: 'whoami',
      brief: 'Muestra el nombre del usuario actual',
      technical: 'Traduce el UID efectivo del proceso a nombre usando /etc/passwd.',
      simple: 'Responde "¿Quién soy?" con el nombre de usuario.',
      syntax: [{ cmd: 'whoami', desc: 'Nombre del usuario actual' }],
      errors: [],
      security: 'En pentesting, whoami confirma con qué privilegios trabajas después de explotar una vulnerabilidad.',
    },
    {
      name: 'groups',
      brief: 'Muestra los grupos del usuario actual',
      technical: 'Lista los grupos suplementarios del proceso actual leyendo /etc/group.',
      simple: 'Te dice a qué "equipos" o grupos perteneces.',
      syntax: [
        { cmd: 'groups',            desc: 'Grupos del usuario actual' },
        { cmd: 'groups', arg: 'usuario', desc: 'Grupos de otro usuario' },
      ],
      errors: [],
      security: 'Si un usuario está en el grupo sudo o wheel, puede ejecutar comandos como root. Los atacantes siempre verifican esto.',
    },
    {
      name: 'cat /etc/passwd',
      brief: 'Ver la lista de usuarios del sistema',
      technical: 'Lee el archivo plano /etc/passwd que contiene una línea por usuario con 7 campos separados por ":".',
      simple: 'Muestra todos los usuarios del sistema, incluyendo los del sistema (daemons) y los usuarios reales.',
      syntax: [
        { cmd: 'cat /etc/passwd',             desc: 'Ver todos los usuarios' },
        { cmd: 'grep /bin/bash /etc/passwd',  desc: 'Solo usuarios con bash (usuarios reales)' },
      ],
      errors: [],
      security: 'grep /bin/bash /etc/passwd filtra solo las cuentas interactivas reales. Los atacantes buscan usuarios con shells válidos para intentar fuerza bruta.',
    },
  ],
  lab: {
    title: 'Auditoría de usuarios en un servidor Linux',
    context: 'Como analista de seguridad, debes auditar los usuarios y grupos del servidor para detectar cuentas no autorizadas o configuraciones inseguras.',
    duration: '25 min', xp: 150,
    steps: [
      {
        title: 'Identifica tu usuario y grupos',
        body: 'Obtén información completa sobre tu identidad en el sistema.',
        commands: [
          { cmd: 'id', explanation: 'UID, GID y grupos suplementarios.' },
          { cmd: 'groups', explanation: 'Lista de grupos a los que perteneces.' },
        ],
        expected: 'uid=1000(estudiante) gid=1000(estudiante) groups=1000(estudiante),4(adm),27(sudo)',
        technical: 'El grupo sudo permite ejecutar comandos como root con sudo. El grupo adm permite leer logs del sistema.',
        hints: ['$ id', '$ groups'],
      },
      {
        title: 'Lista todos los usuarios del sistema',
        body: 'Lee /etc/passwd para ver todos los usuarios.',
        commands: [{ cmd: 'cat /etc/passwd', explanation: 'Formato: nombre:x:UID:GID:info:home:shell' }],
        expected: 'root:x:0:0:root:/root:/bin/bash\n...\nestudiante:x:1000:1000:...',
        technical: 'Los usuarios con UID < 1000 son usuarios del sistema (daemons). Los UID ≥ 1000 son usuarios reales.',
        hints: ['$ cat /etc/passwd'],
      },
      {
        title: 'Filtra solo usuarios con shell de login',
        body: 'Identifica qué usuarios pueden hacer login interactivo.',
        commands: [{ cmd: 'grep /bin/bash /etc/passwd', explanation: 'Filtra líneas que contienen /bin/bash.' }],
        expected: 'root:x:0:0:root:/root:/bin/bash\nestudiante:x:1000:1000:...',
        technical: 'Los usuarios del sistema usan /usr/sbin/nologin o /bin/false para impedir el login interactivo.',
        hints: ['Usa grep para buscar líneas que contengan /bin/bash', '$ grep /bin/bash /etc/passwd'],
      },
      {
        title: 'Verifica el archivo /etc/group',
        body: 'Lista los grupos del sistema.',
        commands: [{ cmd: 'cat /etc/group', explanation: 'Formato: nombre:x:GID:miembros' }],
        expected: 'sudo:x:27:estudiante\nadm:x:4:syslog,estudiante',
        technical: 'El grupo sudo es crítico en seguridad. Cualquier miembro puede ejecutar comandos como root.',
        hints: ['$ cat /etc/group'],
      },
      {
        title: 'Busca usuarios con privilegios de root',
        body: 'Detecta cuentas con UID 0 (equivalentes a root).',
        commands: [{ cmd: 'grep ":0:" /etc/passwd', explanation: 'Busca líneas con UID o GID 0.' }],
        expected: 'root:x:0:0:root:/root:/bin/bash',
        technical: 'Solo debe existir root con UID 0. Si aparece otro usuario con :0:, es una backdoor.',
        hints: ['Usa grep para buscar el patrón :0: en /etc/passwd', '$ grep ":0:" /etc/passwd'],
      },
    ],
    commonErrors: [
      { error: 'Permission denied al leer /etc/shadow', solution: 'Normal. /etc/shadow requiere ser root. Contiene hashes de contraseñas.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué UID tiene el usuario root en Linux?', options: ['1', '100', '0', '999'], correct: 2, explanation: 'root siempre tiene UID 0. Esta es la razón por la que root tiene poderes absolutos: el kernel verifica uid=0 para permitir operaciones privilegiadas.' },
    { type: 'fill', question: 'El archivo que contiene la lista de usuarios y sus UIDs es: `/etc/___`', correct: ['passwd'], explanation: '/etc/passwd es el archivo clásico de usuarios. Las contraseñas reales están en /etc/shadow.' },
    { type: 'true_false', question: 'Un usuario en el grupo `sudo` puede ejecutar cualquier comando como root.', correct: true, explanation: 'El grupo sudo (en Ubuntu/Debian) o wheel (en RedHat/CentOS) otorga capacidad de usar sudo para ejecutar comandos como root.' },
    { type: 'multiple', question: 'Para ver a qué grupos pertenece tu usuario, usas:', options: ['ls -groups', 'groups', 'id -groups', 'cat /etc/user'], correct: 1, explanation: 'El comando groups muestra los grupos del usuario actual. id también lo muestra junto con UID y GID.' },
    { type: 'multiple', question: 'Un atacante encontró una segunda cuenta con UID 0 en /etc/passwd. ¿Qué significa?', options: ['El sistema tiene un bug', 'Hay una backdoor con privilegios de root', 'Es normal tener dos roots', 'El sistema tiene dos administradores'], correct: 1, explanation: 'Solo debe existir un UID 0 (root). Una segunda cuenta con UID 0 es una backdoor que otorga acceso root al atacante.' },
  ],
  missions: [
    { id: 'm1d6', title: 'Ejecuta id', description: 'Ve tu UID y grupos', hint: '$ id', xp: 25, condition: condCmd('id') },
    { id: 'm2d6', title: 'Lee /etc/passwd', description: 'Lista los usuarios del sistema', hint: '$ cat /etc/passwd', xp: 30, condition: { type: 'command_executed', command: 'cat /etc/passwd' } },
    { id: 'm3d6', title: 'Filtra usuarios con bash', description: 'grep /bin/bash /etc/passwd', hint: '$ grep /bin/bash /etc/passwd', xp: 30, condition: { type: 'command_executed', command: 'grep /bin/bash /etc/passwd' } },
    { id: 'm4d6', title: 'Busca cuentas con UID 0', description: 'grep ":0:" /etc/passwd', hint: '$ grep ":0:" /etc/passwd', xp: 35, condition: { type: 'command_executed', command: 'grep ":0:" /etc/passwd' } },
  ],
  resources: [
    { name: 'Linux Users and Groups', url: 'https://www.linux.com/training-tutorials/linux-users-groups/', icon: '👥' },
    { name: 'Red Hat - User Management', url: 'https://www.redhat.com/sysadmin/linux-user-account-management', icon: '🎩' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 7 — Visualización y Edición de Archivos
// ─────────────────────────────────────────────────────────────
{
  day: 7, title: 'Visualización y Edición de Archivos',
  category: 'linux', xp: 300,
  tags: ['cat', 'less', 'head', 'tail', 'nano', 'wc'],
  objectives: [
    'Ver el contenido de archivos con cat, head, tail',
    'Navegar archivos grandes con less',
    'Editar archivos con nano',
    'Contar líneas, palabras y caracteres con wc',
    'Monitorear logs en tiempo real con tail -f',
  ],
  theory: {
    intro: 'Ver y editar archivos de texto es algo que harás decenas de veces al día como administrador de sistemas. Los logs, configuraciones, scripts y datos del sistema son todos archivos de texto.',
    sections: [
      {
        type: 'dual',
        technical: 'cat concatena y muestra archivos leyéndolos completamente en memoria. head y tail leen solo los primeros/últimos N bytes (más eficiente para archivos grandes). tail -f usa inotify para detectar cambios en tiempo real. wc hace conteos a través de un estado simple de máquina.',
        simple: 'cat es como abrir un libro y leerlo todo de una vez. head es leer las primeras páginas. tail es leer las últimas. tail -f es como mirar en tiempo real cómo alguien escribe en un libro. nano es un editor simple.',
      },
      {
        type: 'text',
        title: 'Monitoreo de logs en tiempo real',
        body: 'tail -f /var/log/syslog muestra los logs del sistema en tiempo real. Es una herramienta fundamental para detectar incidentes: cuando algo falla, aparece en los logs en segundos. Los analistas de SOC tienen múltiples ventanas de terminal con tail -f corriendo simultáneamente.',
      },
      {
        type: 'note',
        label: 'Archivos de log críticos para seguridad',
        body: '/var/log/auth.log: intentos de login, sudo, SSH. /var/log/syslog: mensajes generales del sistema. /var/log/apache2/access.log: peticiones web. /var/log/ufw.log: logs del firewall. Revisar estos archivos regularmente es parte del hardening de un servidor.',
      },
    ],
    realCase: {
      title: 'Detectar un ataque de fuerza bruta con tail -f',
      body: 'Un analista de seguridad usa tail -f /var/log/auth.log para monitorear en tiempo real. Detecta miles de líneas como "Failed password for root from 185.x.x.x". Esto es un ataque de fuerza bruta SSH. Puede bloquearlo inmediatamente con fail2ban o reglas de firewall.',
    },
  },
  commands: [
    {
      name: 'cat',
      brief: 'Concatenate — ver y combinar archivos',
      technical: 'Lee archivos secuencialmente y escribe en stdout. Con múltiples archivos los concatena.',
      simple: 'Muestra el contenido completo de un archivo en la terminal.',
      syntax: [
        { cmd: 'cat', arg: 'archivo.txt',           desc: 'Ver contenido del archivo' },
        { cmd: 'cat', flag: '-n', arg: 'arch.txt',  desc: 'Con números de línea' },
        { cmd: 'cat', arg: 'a.txt b.txt > c.txt',   desc: 'Combinar dos archivos en uno' },
      ],
      errors: [
        { msg: 'cat: archivo: No such file or directory', fix: 'El archivo no existe. Verifica la ruta con ls.' },
      ],
      security: 'cat /etc/passwd, cat /etc/hosts y cat ~/.bash_history son los primeros archivos que revisa un atacante tras comprometer un sistema.',
    },
    {
      name: 'head',
      brief: 'Ver las primeras líneas de un archivo',
      technical: 'Lee el archivo hasta que haya emitido N líneas (default 10) y termina.',
      simple: 'Muestra solo el principio del archivo. Ideal para ver el encabezado de logs o archivos grandes.',
      syntax: [
        { cmd: 'head', arg: 'archivo.txt',             desc: 'Primeras 10 líneas' },
        { cmd: 'head', flag: '-n 20', arg: 'arch.txt', desc: 'Primeras 20 líneas' },
        { cmd: 'head', flag: '-1', arg: 'arch.txt',    desc: 'Solo la primera línea' },
      ],
      errors: [],
      security: 'head -1 /etc/passwd muestra la línea de root, útil para verificar rápidamente si tiene shell de login.',
    },
    {
      name: 'tail',
      brief: 'Ver las últimas líneas de un archivo',
      technical: 'Salta al final del archivo y lee las últimas N líneas. Con -f usa inotify/kqueue para monitoreo.',
      simple: 'Muestra el final del archivo. Con -f, se actualiza automáticamente cuando el archivo crece.',
      syntax: [
        { cmd: 'tail', arg: 'archivo.txt',              desc: 'Últimas 10 líneas' },
        { cmd: 'tail', flag: '-n 50', arg: 'arch.txt',  desc: 'Últimas 50 líneas' },
        { cmd: 'tail', flag: '-f', arg: '/var/log/syslog', desc: 'Monitoreo en tiempo real' },
        { cmd: 'tail', flag: '-f', arg: 'log.txt | grep ERROR', desc: 'Filtrar mientras monitorea' },
      ],
      errors: [],
      security: 'tail -f /var/log/auth.log es esencial para detectar intentos de login fallidos (fuerza bruta) en tiempo real.',
    },
    {
      name: 'wc',
      brief: 'Word Count — contar líneas, palabras y caracteres',
      technical: 'Lee el flujo de bytes y mantiene contadores de newlines, espacios y bytes.',
      simple: 'Cuenta líneas, palabras o caracteres en un archivo. Muy útil con pipes.',
      syntax: [
        { cmd: 'wc', arg: 'archivo.txt',    desc: 'Líneas, palabras y caracteres' },
        { cmd: 'wc', flag: '-l', arg: 'f', desc: 'Solo contar líneas' },
        { cmd: 'wc', flag: '-w', arg: 'f', desc: 'Solo contar palabras' },
        { cmd: 'ls | wc', flag: '-l',       desc: 'Contar archivos en directorio' },
      ],
      errors: [],
      security: 'grep "Failed password" /var/log/auth.log | wc -l cuenta los intentos fallidos de SSH. Un número muy alto indica ataque de fuerza bruta.',
    },
  ],
  lab: {
    title: 'Análisis de logs del sistema',
    context: 'Has recibido una alerta de seguridad. Debes analizar los logs del sistema para determinar si hubo algún acceso no autorizado o actividad sospechosa.',
    duration: '25 min', xp: 150,
    steps: [
      {
        title: 'Examina el log del sistema',
        body: 'Lee el archivo syslog para ver actividad reciente del sistema.',
        commands: [{ cmd: 'cat /var/log/syslog', explanation: 'Muestra todos los eventos del sistema.' }],
        expected: 'Jan 15 10:00:01 linux-academy systemd[1]: Started Session 1',
        technical: 'syslog registra eventos del kernel, servicios y aplicaciones. Es la primera fuente de información en un incidente.',
        hints: ['$ cat /var/log/syslog'],
      },
      {
        title: 'Ve solo los últimos eventos',
        body: 'Los logs más recientes son los más relevantes en un incidente.',
        commands: [{ cmd: 'tail -n 20 /var/log/syslog', explanation: 'Los últimos 20 eventos del sistema.' }],
        expected: 'Últimas 20 líneas del syslog',
        technical: 'tail -n 20 es mucho más eficiente que cat para archivos grandes porque solo lee el final.',
        hints: ['$ tail -n 20 /var/log/syslog'],
      },
      {
        title: 'Revisa los logs de autenticación',
        body: 'Busca intentos de login fallidos y accesos exitosos.',
        commands: [{ cmd: 'cat /var/log/auth.log', explanation: 'Muestra todos los eventos de autenticación.' }],
        expected: 'sshd: Accepted password for estudiante\nsudo: estudiante',
        technical: 'auth.log registra logins SSH, uso de sudo y cambios de contraseña. Un incidente de seguridad siempre deja rastro aquí.',
        hints: ['$ cat /var/log/auth.log'],
      },
      {
        title: 'Cuenta eventos de autenticación',
        body: 'Determina cuántos eventos hay en el log de autenticación.',
        commands: [{ cmd: 'wc -l /var/log/auth.log', explanation: 'Contar el número de eventos.' }],
        expected: '8 /var/log/auth.log',
        technical: 'wc -l es el método más eficiente para contar líneas en archivos de log sin cargarlos completamente.',
        hints: ['Usa wc con la flag -l', '$ wc -l /var/log/auth.log'],
      },
      {
        title: 'Busca patrones sospechosos',
        body: 'Filtra líneas que mencionen sudo o accesos.',
        commands: [{ cmd: 'grep "sudo" /var/log/auth.log', explanation: 'Muestra todos los usos de sudo.' }],
        expected: 'sudo: estudiante : TTY=pts/0 ; COMMAND=/usr/bin/apt',
        technical: 'grep "Failed" /var/log/auth.log mostraría intentos fallidos. grep "sudo" muestra elevación de privilegios.',
        hints: ['Usa grep con el patrón "sudo"', '$ grep "sudo" /var/log/auth.log'],
      },
    ],
    commonErrors: [
      { error: 'Permission denied al leer /var/log/auth.log', solution: 'En sistemas reales necesitas ser root o estar en el grupo adm. En este simulador, tienes acceso.' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para monitorear un archivo de log en tiempo real, usas: `tail ___ /var/log/syslog`', correct: ['-f'], explanation: '-f (follow) hace que tail espere y muestre nuevas líneas según se van añadiendo al archivo.' },
    { type: 'multiple', question: '¿Qué archivo de log contiene información sobre intentos de login SSH?', options: ['/var/log/syslog', '/var/log/auth.log', '/var/log/kernel.log', '/var/log/messages'], correct: 1, explanation: '/var/log/auth.log (Ubuntu) registra autenticaciones, sudo, SSH y cambios de contraseña.' },
    { type: 'true_false', question: '`wc -l archivo.txt` cuenta el número de palabras en el archivo.', correct: false, explanation: '-l cuenta líneas (lines). Para palabras usa -w (words), para caracteres -c (characters).' },
    { type: 'multiple', question: '¿Cuál es la forma más eficiente de ver las últimas 50 líneas de un log de 10GB?', options: ['cat log.txt | tail -50', 'tail -n 50 log.txt', 'head -n -50 log.txt', 'less log.txt'], correct: 1, explanation: 'tail -n 50 salta directamente al final del archivo sin leer todo el contenido. cat | tail lee el archivo completo en memoria, ineficiente para archivos grandes.' },
    { type: 'multiple', question: 'Ves miles de líneas "Failed password for root" en auth.log. ¿Qué tipo de ataque es?', options: ['SQL Injection', 'XSS', 'Fuerza bruta SSH', 'DDoS'], correct: 2, explanation: 'Múltiples intentos de contraseña fallidos es un ataque de fuerza bruta. El destino frecuente es SSH (puerto 22). fail2ban puede bloquearlo automáticamente.' },
  ],
  missions: [
    { id: 'm1d7', title: 'Lee el syslog con cat', description: 'cat /var/log/syslog', hint: '$ cat /var/log/syslog', xp: 25, condition: { type: 'command_executed', command: 'cat /var/log/syslog' } },
    { id: 'm2d7', title: 'Usa tail en auth.log', description: 'tail /var/log/auth.log', hint: '$ tail /var/log/auth.log', xp: 30, condition: { type: 'command_executed', command: 'tail /var/log/auth.log' } },
    { id: 'm3d7', title: 'Cuenta líneas con wc -l', description: 'wc -l en cualquier archivo', hint: '$ wc -l /var/log/syslog', xp: 25, condition: condFlag('wc', '-l') },
    { id: 'm4d7', title: 'Usa grep para filtrar logs', description: 'Busca "sudo" en auth.log', hint: '$ grep "sudo" /var/log/auth.log', xp: 30, condition: { type: 'command_executed', command: 'grep "sudo" /var/log/auth.log' } },
  ],
  resources: [
    { name: 'Linux Log Files Explained', url: 'https://www.loggly.com/ultimate-guide/linux-logging-basics/', icon: '📋' },
    { name: 'The Linux Command Line - Editors', url: 'https://linuxcommand.org/lc3_lts0070.php', icon: '📝' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 8 — Búsqueda y Filtrado con grep y find
// ─────────────────────────────────────────────────────────────
{
  day: 8, title: 'Búsqueda y Filtrado con grep y find',
  category: 'linux', xp: 350,
  tags: ['grep', 'find', 'búsqueda', 'regex', 'filtrado'],
  objectives: [
    'Buscar texto en archivos con grep',
    'Usar expresiones regulares básicas con grep',
    'Buscar archivos por nombre, tipo y permisos con find',
    'Combinar grep y find con pipes',
    'Aplicar búsquedas en investigaciones de seguridad',
  ],
  theory: {
    intro: 'grep y find son las herramientas de búsqueda más poderosas de Linux. Un analista de seguridad usa grep para buscar patrones en logs y find para localizar archivos sospechosos. Dominarlas es esencial.',
    sections: [
      {
        type: 'dual',
        technical: 'grep usa el motor de expresiones regulares POSIX para comparar patrones contra líneas de texto. Su complejidad es O(n*m). find recorre el árbol de directorios usando opendir/readdir recursivamente y aplica los predicados a cada entrada.',
        simple: 'grep es como Ctrl+F en un documento, pero para la terminal y mucho más poderoso. find es como el buscador de Windows pero desde la terminal, pudiendo buscar por nombre, fecha, tamaño y permisos.',
      },
      {
        type: 'text',
        title: 'Expresiones regulares básicas en grep',
        body: '. = cualquier carácter. * = cero o más del anterior. ^ = inicio de línea. $ = fin de línea. [] = clase de caracteres [abc]. [^] = negación. \\b = límite de palabra. Ejemplo: grep "^root" /etc/passwd busca líneas que empiecen con "root".',
      },
      {
        type: 'note',
        label: 'find en investigaciones forenses',
        body: 'find / -perm -4000 busca archivos con bit SUID (potencialmente explotables). find /tmp -type f -newer /etc/passwd busca archivos creados recientemente en /tmp. find / -name "*.php" -newer /var/www/index.php detecta webshells recién creados.',
      },
    ],
    realCase: {
      title: 'Detectar webshells con find y grep',
      body: 'Un servidor web fue comprometido. El analista usa find /var/www -name "*.php" -type f para listar todos los PHP, luego grep -r "exec\\|shell_exec\\|system" /var/www para buscar funciones peligrosas. Esto revela un archivo malicioso: shell.php con código que permite ejecución remota.',
    },
  },
  commands: [
    {
      name: 'grep',
      brief: 'Global Regular Expression Print — buscar patrones en texto',
      technical: 'Compila el patrón como expresión regular y aplica el motor NFA/DFA de POSIX a cada línea de entrada.',
      simple: 'Busca un texto dentro de archivos y muestra las líneas que lo contienen.',
      syntax: [
        { cmd: 'grep', arg: '"error" log.txt',              desc: 'Buscar "error" en archivo' },
        { cmd: 'grep', flag: '-i', arg: '"ERROR" log.txt',  desc: 'Ignorar mayúsculas' },
        { cmd: 'grep', flag: '-r', arg: '"password" /etc/', desc: 'Búsqueda recursiva' },
        { cmd: 'grep', flag: '-n', arg: '"fail" auth.log',  desc: 'Mostrar número de línea' },
        { cmd: 'grep', flag: '-v', arg: '"#" config.txt',   desc: 'Invertir: mostrar líneas que NO contienen' },
        { cmd: 'grep', flag: '-c', arg: '"error" log.txt',  desc: 'Contar coincidencias' },
        { cmd: 'grep', flag: '-E', arg: '"err|fail" log',   desc: 'Regex extendida (ERE)' },
      ],
      errors: [
        { msg: 'grep: invalid option', fix: 'Verifica la flag usada. Las más comunes son -i, -r, -n, -v, -c, -E.' },
      ],
      security: 'grep -r "password\\|passwd\\|secret\\|api_key" /home/ busca credenciales hardcodeadas. grep -v "^#" /etc/ssh/sshd_config muestra la config SSH sin comentarios.',
    },
    {
      name: 'find',
      brief: 'Buscar archivos y directorios en el sistema',
      technical: 'Recorre el árbol de directorios recursivamente aplicando tests (predicados) y ejecutando acciones en los nodos que los satisfacen.',
      simple: 'Busca archivos por nombre, tipo, tamaño, fecha o permisos. Mucho más potente que el buscador de Windows.',
      syntax: [
        { cmd: 'find', arg: '. -name "*.txt"',              desc: 'Archivos .txt en directorio actual' },
        { cmd: 'find', arg: '/home -type f',                desc: 'Solo archivos (no directorios)' },
        { cmd: 'find', arg: '/tmp -type d',                 desc: 'Solo directorios' },
        { cmd: 'find', arg: '/ -name "shadow"',             desc: 'Buscar archivo por nombre' },
        { cmd: 'find', arg: '. -newer /etc/passwd',         desc: 'Archivos más recientes que passwd' },
        { cmd: 'find', arg: '/ -perm -4000',               desc: 'Archivos con SUID bit' },
        { cmd: 'find', arg: '/tmp -size +1M',              desc: 'Archivos mayores de 1MB' },
      ],
      errors: [
        { msg: 'find: paths must precede expression', fix: 'El path debe ir antes que las opciones: find /ruta -name "patron".' },
        { msg: 'Permission denied (muchas líneas)', fix: 'Normal al buscar en /. Redirige errores: find / -name "x" 2>/dev/null' },
      ],
      security: 'find / -perm /4000 -type f busca binarios con SUID que pueden ser vectores de escalada de privilegios. find /tmp -type f es esencial para detectar archivos maliciosos en /tmp.',
    },
  ],
  lab: {
    title: 'Investigación de seguridad con grep y find',
    context: 'Has recibido un alerta: se sospecha que alguien dejó archivos maliciosos en el servidor. Debes usar grep y find para investigar.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Busca archivos de texto en tu home',
        body: 'Usa find para localizar todos los archivos .txt en tu directorio home.',
        commands: [{ cmd: 'find ~ -name "*.txt" -type f', explanation: 'Busca archivos (type f) con extensión .txt en ~' }],
        expected: '/home/estudiante/documentos/README.txt',
        technical: '-name acepta wildcards (* y ?). -type f filtra solo archivos regulares, excluyendo directorios y enlaces.',
        hints: ['Usa find con -name y -type f', '$ find ~ -name "*.txt" -type f'],
      },
      {
        title: 'Busca texto dentro de archivos',
        body: 'Busca la palabra "bienvenido" en todos los archivos de tu home.',
        commands: [{ cmd: 'grep -ri "bienvenido" ~', explanation: '-r busca recursivamente, -i ignora mayúsculas.' }],
        expected: '/home/estudiante/documentos/README.txt: Bienvenido a LinuxAcademy',
        technical: 'grep -ri es uno de los comandos más usados en seguridad para buscar información sensible en múltiples archivos.',
        hints: ['Usa grep -ri para búsqueda recursiva ignorando mayúsculas', '$ grep -ri "bienvenido" ~'],
      },
      {
        title: 'Filtra logs de autenticación',
        body: 'Busca líneas que contengan "Accepted" en auth.log (logins exitosos).',
        commands: [{ cmd: 'grep "Accepted" /var/log/auth.log', explanation: 'Filtra logins SSH exitosos.' }],
        expected: 'sshd[892]: Accepted password for estudiante from 192.168.1.100',
        technical: '"Accepted" aparece en auth.log cuando un login SSH es exitoso. "Failed" cuando falla.',
        hints: ['$ grep "Accepted" /var/log/auth.log'],
      },
      {
        title: 'Cuenta errores de autenticación',
        body: 'Cuenta cuántos intentos fallidos de login hay.',
        commands: [{ cmd: 'grep -c "FAILED" /var/log/auth.log', explanation: '-c cuenta líneas que coinciden en lugar de mostrarlas.' }],
        expected: '1',
        technical: 'grep -c es más eficiente que grep | wc -l para contar coincidencias.',
        hints: ['Usa grep con la flag -c para contar', '$ grep -c "FAILED" /var/log/auth.log'],
      },
      {
        title: 'Busca archivos recientes',
        body: 'Encuentra archivos creados o modificados recientemente (más nuevos que syslog).',
        commands: [{ cmd: 'find ~ -newer /var/log/syslog -type f', explanation: 'Archivos más recientes que el syslog.' }],
        expected: 'Lista de archivos recientes en tu home',
        technical: 'find -newer es útil en forense para encontrar archivos creados después de un incidente.',
        hints: ['$ find ~ -newer /var/log/syslog -type f'],
      },
    ],
    commonErrors: [
      { error: 'grep: no input files', solution: 'grep necesita al menos un archivo o recibir datos por pipe. Verifica la ruta del archivo.' },
      { error: 'find: paths must precede expression', solution: 'El formato correcto es: find RUTA -opciones. La ruta va primero.' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para buscar "error" sin distinguir mayúsculas en archivo.log, usas: `grep ___ "error" archivo.log`', correct: ['-i'], explanation: '-i (ignore case) hace que grep no distinga entre mayúsculas y minúsculas.' },
    { type: 'multiple', question: '¿Qué hace `grep -v "#" config.txt`?', options: ['Busca líneas con #', 'Muestra líneas que NO contienen #', 'Cuenta líneas con #', 'Elimina líneas con #'], correct: 1, explanation: '-v (invert match) muestra líneas que NO coinciden con el patrón. Muy útil para ver configs sin comentarios.' },
    { type: 'true_false', question: '`find / -perm -4000` busca archivos con el bit SUID activado, que pueden ser usados en escalada de privilegios.', correct: true, explanation: 'El bit SUID (4000) hace que el binario corra con los permisos del propietario (frecuentemente root), lo que puede ser explotado para escalada de privilegios.' },
    { type: 'multiple', question: '¿Qué comando busca archivos .sh en todo el sistema?', options: ['ls -r "*.sh" /', 'find / -name "*.sh"', 'grep -r ".sh" /', 'search *.sh'], correct: 1, explanation: 'find / -name "*.sh" recorre todo el sistema buscando archivos cuyo nombre termine en .sh.' },
    { type: 'multiple', question: 'Para contar cuántas líneas contienen "Failed password" en auth.log, la forma más eficiente es:', options: ['cat auth.log | grep "Failed"', 'grep -c "Failed password" auth.log', 'grep "Failed" auth.log | wc -l', 'find auth.log -name "Failed"'], correct: 1, explanation: 'grep -c es la forma más directa y eficiente. grep | wc -l también funciona pero hace dos procesos.' },
  ],
  missions: [
    { id: 'm1d8', title: 'Usa grep -r para buscar texto', description: 'grep -r "hola" ~', hint: '$ grep -r "hola" ~', xp: 30, condition: condFlag('grep', '-r') },
    { id: 'm2d8', title: 'Busca archivos con find -name', description: 'find ~ -name "*.txt"', hint: '$ find ~ -name "*.txt"', xp: 30, condition: { type: 'command_with_flag', command: 'find', flag: '-name' } },
    { id: 'm3d8', title: 'Filtra auth.log con grep', description: 'grep "Accepted" /var/log/auth.log', hint: '$ grep "Accepted" /var/log/auth.log', xp: 35, condition: { type: 'command_executed', command: 'grep "Accepted" /var/log/auth.log' } },
    { id: 'm4d8', title: 'Usa grep -c para contar', description: 'Cuenta coincidencias con -c', hint: '$ grep -c "sudo" /var/log/auth.log', xp: 25, condition: condFlag('grep', '-c') },
  ],
  resources: [
    { name: 'grep Manual', url: 'https://www.gnu.org/software/grep/manual/', icon: '🔍' },
    { name: 'find Manual', url: 'https://www.gnu.org/software/findutils/manual/', icon: '📂' },
    { name: 'RegexOne - Learn Regex', url: 'https://regexone.com', icon: '🔤' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 9 — Redirección, Pipes y Flujos
// ─────────────────────────────────────────────────────────────
{
  day: 9, title: 'Redirección, Pipes y Flujos',
  category: 'bash', xp: 350,
  tags: ['pipes', 'redirección', 'stdin', 'stdout', 'stderr'],
  objectives: [
    'Entender stdin, stdout y stderr',
    'Redirigir salida a archivos con > y >>',
    'Encadenar comandos con pipes (|)',
    'Redirigir y descartar errores con 2>',
    'Construir pipelines de procesamiento de datos',
  ],
  theory: {
    intro: 'La filosofía Unix es: "haz una cosa y hazla bien". Los pipes permiten encadenar herramientas simples para crear procesamiento de datos complejo. Esta es la habilidad que separa a los administradores básicos de los avanzados.',
    sections: [
      {
        type: 'dual',
        technical: 'En Unix, cada proceso tiene tres file descriptors por defecto: 0=stdin, 1=stdout, 2=stderr. > redirige FD 1 a un archivo. 2> redirige FD 2. | conecta el stdout de un proceso con el stdin del siguiente usando un pipe del kernel (kernel buffer de 64KB).',
        simple: 'Imagina cada comando como un grifo de agua. stdin es la entrada de agua, stdout es la salida, stderr es la salida de errores (agua sucia). El pipe | conecta la salida de un grifo con la entrada del siguiente.',
      },
      {
        type: 'text',
        title: 'Operadores de redirección',
        body: '> archivo: sobreescribe el archivo con la salida. >> archivo: añade al final del archivo. < archivo: usa el archivo como entrada. 2> archivo: redirige errores. 2>&1: combina stdout y stderr. /dev/null: "agujero negro", descarta todo lo que se envíe.',
      },
      {
        type: 'note',
        label: 'Pipelines en ciberseguridad',
        body: 'Los pipelines son fundamentales en análisis de seguridad: cat auth.log | grep "Failed" | awk \'{print $11}\' | sort | uniq -c | sort -rn | head -10 muestra las IPs que más intentos fallidos de SSH tienen, ordenadas de mayor a menor. Todo en un solo comando.',
      },
    ],
    realCase: {
      title: 'Pipeline de análisis de logs en un SIEM casero',
      body: 'Un analista construye un pipeline para procesar logs en tiempo real: tail -f /var/log/auth.log | grep "Failed password" | awk \'{print $11}\' | sort | uniq -c. Esto muestra en tiempo real las IPs atacantes ordenadas por número de intentos. Sin pipelines, necesitaría un software complejo.',
    },
  },
  commands: [
    {
      name: '>  >>  (redirección)',
      brief: 'Redirigir la salida de comandos a archivos',
      technical: '> abre el archivo con O_WRONLY|O_CREAT|O_TRUNC. >> usa O_APPEND. Redirige el file descriptor 1 (stdout) del proceso.',
      simple: '> guarda la salida en un archivo (borrando el contenido anterior). >> añade al final del archivo sin borrar lo que había.',
      syntax: [
        { cmd: 'echo "hola"', flag: '>', arg: 'archivo.txt',   desc: 'Sobreescribir archivo' },
        { cmd: 'echo "más"',  flag: '>>', arg: 'archivo.txt',  desc: 'Añadir al archivo' },
        { cmd: 'ls -la',      flag: '>', arg: 'listado.txt',   desc: 'Guardar salida de ls' },
        { cmd: 'date',        flag: '>>', arg: 'log.txt',      desc: 'Añadir fecha al log' },
      ],
      errors: [
        { msg: 'bash: archivo: Permission denied', fix: 'No tienes permisos de escritura en ese directorio.' },
      ],
      security: 'echo "" > /var/log/auth.log (como root) borra el log de autenticación. Los atacantes hacen esto para eliminar evidencias.',
    },
    {
      name: '|  (pipe)',
      brief: 'Conectar la salida de un comando con la entrada de otro',
      technical: 'Crea un pipe del kernel. El proceso izquierdo escribe en el write end, el derecho lee del read end. El kernel gestiona la sincronización.',
      simple: 'Toma lo que imprime el primer comando y se lo da como entrada al segundo. Como una cadena de montaje.',
      syntax: [
        { cmd: 'ls -la', flag: '|', arg: 'grep ".txt"',          desc: 'Filtrar listado' },
        { cmd: 'cat log', flag: '|', arg: 'grep "error" | wc -l', desc: 'Contar errores' },
        { cmd: 'ps aux', flag: '|', arg: 'grep "bash"',           desc: 'Buscar proceso' },
        { cmd: 'cat /etc/passwd', flag: '|', arg: 'cut -d: -f1',  desc: 'Extraer usernames' },
      ],
      errors: [],
      security: 'Los pipelines son la base del análisis de logs en seguridad. Dominarlos permite procesar gigabytes de logs sin herramientas externas.',
    },
    {
      name: '2>  /dev/null',
      brief: 'Redirigir y descartar errores',
      technical: 'FD 2 es stderr. 2>/dev/null redirige errores al dispositivo nulo del kernel que descarta todos los bytes escritos.',
      simple: '/dev/null es el "agujero negro" de Linux. Todo lo que envíes ahí desaparece. 2> redirige los mensajes de error.',
      syntax: [
        { cmd: 'find / -name "passwd"', flag: '2>', arg: '/dev/null', desc: 'Descartar errores de permisos' },
        { cmd: 'comando',               flag: '2>&1',                 desc: 'Combinar stderr con stdout' },
        { cmd: 'comando',               flag: '>', arg: 'out.txt 2>&1', desc: 'Guardar todo (stdout+stderr)' },
      ],
      errors: [],
      security: 'find / -name "shadow" 2>/dev/null busca el archivo shadow en todo el sistema sin mostrar los errores de Permission denied, revelando si hay copias del shadow fuera de /etc.',
    },
  ],
  lab: {
    title: 'Construir pipelines de análisis de seguridad',
    context: 'Debes construir pipelines de análisis de logs para identificar amenazas. Cada pipeline procesa los datos de una forma diferente.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Guarda los usuarios en un archivo',
        body: 'Redirige la lista de usuarios a un archivo de texto.',
        commands: [{ cmd: 'cat /etc/passwd > ~/usuarios.txt', explanation: 'Guarda toda la salida en el archivo.' }],
        expected: 'Archivo usuarios.txt creado con los usuarios',
        technical: '> sobreescribe el archivo. Si /etc/passwd tiene 20 líneas, usuarios.txt tendrá 20 líneas.',
        hints: ['Usa > para redirigir la salida', '$ cat /etc/passwd > ~/usuarios.txt'],
      },
      {
        title: 'Extrae solo los nombres de usuario',
        body: 'Usa un pipeline para obtener solo los nombres de usuario de /etc/passwd.',
        commands: [{ cmd: 'cat /etc/passwd | grep /bin/bash', explanation: 'Filtra solo usuarios con shell de login.' }],
        expected: 'root:x:0:0:root:/root:/bin/bash\nestudiante:x:1000:...',
        technical: 'Este pipeline: cat lee el archivo, grep filtra solo las líneas de usuarios reales.',
        hints: ['Usa | para conectar cat con grep', '$ cat /etc/passwd | grep /bin/bash'],
      },
      {
        title: 'Cuenta procesos activos',
        body: 'Usa un pipeline para contar cuántos procesos hay corriendo.',
        commands: [{ cmd: 'ps aux | wc -l', explanation: 'ps lista procesos, wc -l los cuenta.' }],
        expected: '14 (número aproximado de procesos)',
        technical: 'ps aux lista todos los procesos, wc -l cuenta las líneas. La primera línea es el header, así que el número real de procesos es el resultado menos 1.',
        hints: ['Combina ps aux con wc -l usando pipe', '$ ps aux | wc -l'],
      },
      {
        title: 'Añade entradas al log',
        body: 'Crea un log de auditoría añadiendo la fecha y el usuario.',
        commands: [
          { cmd: 'echo "Sesión iniciada: $(date)" >> ~/audit.log', explanation: 'Añade sin borrar el contenido previo.' },
          { cmd: 'echo "Usuario: $(whoami)" >> ~/audit.log', explanation: 'Segunda entrada del log.' },
          { cmd: 'cat ~/audit.log', explanation: 'Verificar el contenido del log.' },
        ],
        expected: 'Sesión iniciada: Mon Jan 15 10:23:45\nUsuario: estudiante',
        technical: '>> es esencial para logs: mantiene el historial. > borraría todo cada vez.',
        hints: ['Usa >> para añadir sin borrar', '$ echo "texto" >> archivo.log'],
      },
      {
        title: 'Filtra y descarta errores',
        body: 'Busca archivos .sh ignorando errores de permisos.',
        commands: [{ cmd: 'find / -name "*.sh" 2>/dev/null', explanation: '2>/dev/null descarta los mensajes de "Permission denied".' }],
        expected: '/home/estudiante/scripts/hola.sh',
        technical: 'Sin 2>/dev/null, la búsqueda en / inundaría la pantalla con errores. Los atacantes usan esta técnica constantemente.',
        hints: ['Añade 2>/dev/null al final del comando find', '$ find / -name "*.sh" 2>/dev/null'],
      },
    ],
    commonErrors: [
      { error: '>  vs >> confusión', solution: '> sobreescribe (PELIGROSO en logs). >> añade. Para logs siempre usa >>.' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para añadir la salida de un comando a un archivo SIN borrar su contenido, usas: `comando ___ archivo`', correct: ['>>'], explanation: '>> (append) añade al final del archivo. > sobreescribiría (borraría) el contenido existente.' },
    { type: 'multiple', question: '¿Qué hace `comando 2>/dev/null`?', options: ['Guarda los errores en /dev/null para revisarlos después', 'Descarta todos los mensajes de error', 'Redirige stdout a stderr', 'Duplica la salida'], correct: 1, explanation: '/dev/null es un dispositivo especial que descarta todo lo escrito. 2> redirige stderr (FD 2). Juntos, eliminan los mensajes de error.' },
    { type: 'true_false', question: 'El pipe `|` envía la salida del primer comando como entrada del segundo comando.', correct: true, explanation: 'Correcto. El pipe conecta el stdout del proceso izquierdo con el stdin del proceso derecho.' },
    { type: 'multiple', question: '¿Cuál pipeline muestra los procesos que contienen "bash"?', options: ['bash | ps aux', 'ps aux > grep bash', 'ps aux | grep bash', 'grep bash > ps aux'], correct: 2, explanation: 'ps aux lista todos los procesos, | pasa esa lista a grep bash que filtra los que contienen "bash".' },
    { type: 'multiple', question: 'Para guardar tanto stdout como stderr en el mismo archivo, usas:', options: ['comando > archivo stderr', 'comando 2>1 > archivo', 'comando > archivo 2>&1', 'comando | 2 > archivo'], correct: 2, explanation: '> archivo redirige stdout al archivo. 2>&1 redirige stderr (FD 2) a donde apunta FD 1 (el archivo). El orden importa.' },
  ],
  missions: [
    { id: 'm1d9', title: 'Redirige salida con >', description: 'ls > listado.txt', hint: '$ ls > listado.txt', xp: 25, condition: condFile('~/listado.txt') },
    { id: 'm2d9', title: 'Añade al log con >>', description: 'echo "texto" >> audit.log', hint: '$ echo "texto" >> audit.log', xp: 25, condition: condFile('~/audit.log') },
    { id: 'm3d9', title: 'Usa un pipe con grep', description: 'ps aux | grep bash', hint: '$ ps aux | grep bash', xp: 35, condition: { type: 'command_executed', command: 'ps aux | grep bash' } },
    { id: 'm4d9', title: 'Descarta errores con /dev/null', description: 'find con 2>/dev/null', hint: '$ find / -name "*.sh" 2>/dev/null', xp: 30, condition: { type: 'command_matches', pattern: '2>/dev/null' } },
  ],
  resources: [
    { name: 'GNU Bash - Redirections', url: 'https://www.gnu.org/software/bash/manual/bash.html#Redirections', icon: '📖' },
    { name: 'Linux Pipes and Filters', url: 'https://linuxjourney.com/lesson/pipe-tee', icon: '🐧' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 10 — Variables y Entorno en Bash
// ─────────────────────────────────────────────────────────────
{
  day: 10, title: 'Variables y Entorno en Bash',
  category: 'bash', xp: 350,
  tags: ['variables', 'entorno', 'export', 'env', 'PATH'],
  objectives: [
    'Crear y usar variables en bash',
    'Entender las variables de entorno del sistema',
    'Exportar variables con export',
    'Modificar y entender el PATH',
    'Usar variables en scripts básicos',
  ],
  theory: {
    intro: 'Las variables son el alma de cualquier script bash. Entender cómo funcionan las variables y el entorno es fundamental para escribir scripts que automatizan tareas del sistema operativo.',
    sections: [
      {
        type: 'dual',
        technical: 'Las variables bash son pares clave-valor almacenados en la memoria del proceso shell. Las variables de entorno (exportadas) se pasan a los procesos hijos vía el tercer argumento de execve(). PATH es una lista de directorios separados por ":" que bash recorre para encontrar ejecutables.',
        simple: 'Las variables son cajas con nombre donde guardas información. Las variables de entorno son variables que todos los programas pueden ver. PATH le dice a bash dónde buscar los comandos que escribes.',
      },
      {
        type: 'text',
        title: 'Variables de entorno importantes',
        body: 'PATH: directorios donde buscar ejecutables. HOME: directorio home del usuario (/home/estudiante). USER: nombre del usuario actual. SHELL: shell en uso (/bin/bash). LANG: idioma del sistema. EDITOR: editor de texto preferido. PS1: el formato del prompt de bash.',
      },
      {
        type: 'note',
        label: 'Variables en seguridad',
        body: 'Las variables de entorno pueden contener información sensible: credenciales, tokens de API, contraseñas. Los atacantes revisan las variables de entorno tras comprometer un sistema. NUNCA almacenes contraseñas en variables de entorno sin cifrado. Usa archivos con chmod 600 o vaults como Vault de HashiCorp.',
      },
    ],
    realCase: {
      title: 'Configuración de entorno en pipelines CI/CD',
      body: 'En DevOps, las variables de entorno son el método estándar para configurar aplicaciones: DATABASE_URL, API_KEY, SECRET_TOKEN. GitHub Actions, GitLab CI y Jenkins las usan extensivamente. Un error de configuración que exponga estas variables en los logs puede comprometer toda la infraestructura.',
    },
  },
  commands: [
    {
      name: 'export',
      brief: 'Exportar variable al entorno de los procesos hijos',
      technical: 'Marca la variable con el flag de exportación en la tabla de variables del shell. execve() incluirá estas variables en el entorno del nuevo proceso.',
      simple: 'Hace que una variable sea visible para todos los programas que el shell inicia. Sin export, la variable solo existe en el shell actual.',
      syntax: [
        { cmd: 'export', arg: 'MI_VAR="valor"',        desc: 'Definir y exportar' },
        { cmd: 'MI_VAR="valor"',                        desc: 'Definir sin exportar' },
        { cmd: 'export', arg: 'MI_VAR',                desc: 'Exportar variable existente' },
        { cmd: 'export',                               desc: 'Listar todas las variables exportadas' },
      ],
      errors: [
        { msg: 'export: MI VAR: not a valid identifier', fix: 'Los nombres de variables no pueden tener espacios. Usa MI_VAR (guion bajo).' },
      ],
      security: 'export DEBUG=true puede activar modo debug en aplicaciones, exponiendo información sensible. Revisa siempre qué variables de entorno están exportadas en producción.',
    },
    {
      name: 'env',
      brief: 'Mostrar o modificar el entorno de ejecución',
      technical: 'Sin argumentos, lee environ[] del proceso actual. Con argumentos, modifica el entorno para el comando especificado.',
      simple: 'Muestra todas las variables de entorno que tienen los programas. También sirve para ejecutar comandos con un entorno modificado.',
      syntax: [
        { cmd: 'env',                                  desc: 'Mostrar todas las variables de entorno' },
        { cmd: 'env', flag: '| grep PATH',             desc: 'Buscar una variable específica' },
        { cmd: 'printenv', arg: 'PATH',                desc: 'Mostrar valor de una variable' },
      ],
      errors: [],
      security: 'env puede revelar tokens, contraseñas y configuraciones sensibles de aplicaciones. env | grep -i "password\\|token\\|secret\\|key" es el primer comando de un atacante.',
    },
    {
      name: 'echo $VARIABLE',
      brief: 'Ver el valor de una variable',
      technical: 'Bash expande $VARIABLE antes de pasarla a echo. La expansión lee la tabla de variables del shell.',
      simple: 'Muestra el valor de una variable. El $ le dice a bash "dame el valor de esta variable".',
      syntax: [
        { cmd: 'echo $HOME',    desc: 'Ver el home del usuario' },
        { cmd: 'echo $PATH',    desc: 'Ver el PATH completo' },
        { cmd: 'echo $USER',    desc: 'Ver el usuario actual' },
        { cmd: 'echo $?',       desc: 'Ver el código de salida del último comando' },
        { cmd: 'echo $$',       desc: 'PID del shell actual' },
      ],
      errors: [
        { msg: 'echo muestra nada (variable vacía)', fix: 'La variable no está definida. Verifica con env o set | grep NOMBRE.' },
      ],
      security: '$? (código de salida) es fundamental en scripts de seguridad para verificar si un comando fue exitoso (0) o falló (1+).',
    },
  ],
  lab: {
    title: 'Crear variables de entorno para un script de monitoreo',
    context: 'Vas a configurar las variables de entorno necesarias para un script de monitoreo del servidor, siguiendo buenas prácticas de seguridad.',
    duration: '25 min', xp: 150,
    steps: [
      {
        title: 'Inspecciona el entorno actual',
        body: 'Revisa todas las variables de entorno disponibles.',
        commands: [{ cmd: 'env', explanation: 'Lista todas las variables de entorno del proceso actual.' }],
        expected: 'USER=estudiante\nHOME=/home/estudiante\nSHELL=/bin/bash\nPATH=...',
        technical: 'Las variables de entorno son heredadas por todos los procesos hijos. Una aplicación comprometida puede leer todas estas variables.',
        hints: ['$ env'],
      },
      {
        title: 'Crea variables de configuración',
        body: 'Define variables para tu script de monitoreo.',
        commands: [
          { cmd: 'export SERVIDOR="linux-academy"', explanation: 'Nombre del servidor a monitorear.' },
          { cmd: 'export LOG_DIR="/home/estudiante/logs"', explanation: 'Directorio para los logs.' },
          { cmd: 'export ALERTA_EMAIL="admin@empresa.com"', explanation: 'Email para alertas.' },
        ],
        expected: 'Variables definidas y exportadas',
        technical: 'export hace que las variables sean visibles para procesos hijos. Sin export, solo existen en el shell actual.',
        hints: ['Usa export NOMBRE="valor" para cada variable', '$ export SERVIDOR="linux-academy"'],
      },
      {
        title: 'Verifica las variables creadas',
        body: 'Confirma que las variables se definieron correctamente.',
        commands: [
          { cmd: 'echo $SERVIDOR', explanation: 'Ver el nombre del servidor.' },
          { cmd: 'echo $LOG_DIR',  explanation: 'Ver el directorio de logs.' },
        ],
        expected: 'linux-academy\n/home/estudiante/logs',
        technical: 'La expansión de variables con $ es una de las características más básicas de bash.',
        hints: ['$ echo $SERVIDOR', '$ echo $LOG_DIR'],
      },
      {
        title: 'Examina el PATH',
        body: 'Entiende cómo bash encuentra los comandos.',
        commands: [{ cmd: 'echo $PATH', explanation: 'Lista de directorios donde bash busca ejecutables.' }],
        expected: '/home/estudiante/scripts:/usr/local/bin:/usr/bin:/bin',
        technical: 'Cuando escribes "ls", bash busca el ejecutable en cada directorio del PATH de izquierda a derecha. Si no lo encuentra, muestra "command not found".',
        hints: ['$ echo $PATH'],
      },
      {
        title: 'Crea una variable con información del sistema',
        body: 'Usa sustitución de comandos para almacenar info del sistema en una variable.',
        commands: [
          { cmd: 'export KERNEL=$(uname -r)', explanation: 'Guarda la versión del kernel en una variable.' },
          { cmd: 'echo "Kernel: $KERNEL"', explanation: 'Usa la variable en un mensaje.' },
        ],
        expected: 'Kernel: 5.15.0-91-generic',
        technical: 'La sintaxis $(comando) ejecuta el comando y captura su salida. Es una forma de asignar resultados de comandos a variables.',
        hints: ['Usa export VAR=$(comando)', '$ export KERNEL=$(uname -r)'],
      },
    ],
    commonErrors: [
      { error: 'Variable vacía al hacer echo $MI_VAR', solution: 'La variable se definió sin export y estás en otro subshell, o hay un error de tipeo en el nombre.' },
      { error: 'MI VAR=valor: command not found', solution: 'Los nombres de variables no pueden tener espacios. Usa MI_VAR=valor (sin espacios alrededor del =).' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para hacer que una variable sea visible para todos los programas hijos del shell, usas: `___ MI_VARIABLE="valor"`', correct: ['export'], explanation: 'export marca la variable para que sea incluida en el entorno de los procesos hijos.' },
    { type: 'multiple', question: '¿Qué variable de entorno define los directorios donde bash busca los ejecutables?', options: ['HOME', 'SHELL', 'PATH', 'EXEC'], correct: 2, explanation: 'PATH es una lista de directorios separados por ":" que bash recorre de izquierda a derecha para encontrar los comandos.' },
    { type: 'true_false', question: 'Una variable definida sin `export` es visible para los procesos hijos del shell.', correct: false, explanation: 'Sin export, la variable solo existe en el shell actual. Los procesos hijos no pueden verla. export la "publica" al entorno.' },
    { type: 'multiple', question: '¿Qué hace `echo $?`?', options: ['Muestra el PID del shell', 'Muestra todas las variables', 'Muestra el código de salida del último comando', 'Muestra el usuario actual'], correct: 2, explanation: '$? contiene el código de salida del último comando: 0 = éxito, 1+ = error. Fundamental en scripts para manejo de errores.' },
    { type: 'multiple', question: 'Un atacante quiere buscar credenciales en las variables de entorno. ¿Qué comando usaría?', options: ['ls -la $ENV', 'cat /etc/environment', 'env | grep -i "password\\|token\\|key"', 'sudo show-env'], correct: 2, explanation: 'env muestra todas las variables de entorno. grep -i filtra ignorando mayúsculas buscando patrones comunes de credenciales.' },
  ],
  missions: [
    { id: 'm1d10', title: 'Ejecuta env', description: 'Lista las variables de entorno', hint: '$ env', xp: 25, condition: condCmd('env') },
    { id: 'm2d10', title: 'Exporta una variable', description: 'export MI_VAR="valor"', hint: '$ export MI_VAR="hola"', xp: 35, condition: condCmd('export') },
    { id: 'm3d10', title: 'Muestra el PATH', description: 'echo $PATH', hint: '$ echo $PATH', xp: 25, condition: { type: 'command_executed', command: 'echo $PATH' } },
    { id: 'm4d10', title: 'Usa sustitución de comandos', description: 'export VAR=$(comando)', hint: '$ export KERNEL=$(uname -r)', xp: 40, condition: { type: 'command_matches', pattern: '\\$\\(' } },
  ],
  resources: [
    { name: 'Bash Variables - GNU Manual', url: 'https://www.gnu.org/software/bash/manual/bash.html#Shell-Variables', icon: '📖' },
    { name: 'Linux Environment Variables', url: 'https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-linux', icon: '🌊' },
  ],
},

]
