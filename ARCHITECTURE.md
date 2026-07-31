# LinuxAcademy 30 — Arquitectura Completa
# ==========================================

## ÁRBOL DE CARPETAS

linuxacademy/
├── index.html                          # Entry point HTML con fuentes y splash screen
├── package.json                        # Dependencias: React 18 + Vite 5
├── vite.config.js                      # Aliases de paths + chunks optimizados
├── public/
│   └── favicon.svg                     # Ícono terminal verde
│
└── src/
    ├── main.jsx                        # ReactDOM.render + estilos globales
    ├── App.jsx                         # Router principal, estado global, layout
    │
    ├── data/
    │   ├── courseData.js               # Agrega y exporta los 30 días
    │   ├── days1to10.js                # Linux básico
    │   ├── days11to20.js               # Bash y redes
    │   ├── days21to30.js               # Ciberseguridad
    │   ├── achievementsDB.js           # Definición de logros e insignias
    │   └── levelsConfig.js             # Tabla XP → niveles → títulos
    │
    ├── hooks/
    │   ├── useProgress.js              # XP, días, nivel, logros en LocalStorage
    │   ├── useTerminal.js              # Motor de terminal: comandos, filesystem, historial
    │   └── useQuiz.js                  # Estado del quiz, puntuación, retroalimentación
    │
    ├── utils/
    │   ├── filesystem.js               # Sistema de archivos virtual (árbol JSON)
    │   ├── commandEngine.js            # Intérprete de comandos Linux simulados
    │   ├── missionEvaluator.js         # Evaluador automático de misiones
    │   ├── storage.js                  # Wrapper de LocalStorage con serialización
    │   └── formatters.js              # Utilidades de formato (tiempo, XP, rutas)
    │
    ├── components/
    │   ├── Dashboard.jsx               # Vista principal con métricas y resumen
    │   ├── Sidebar.jsx                 # Navegación lateral con días y progreso
    │   ├── Lesson.jsx                  # Visualizador de lección del día
    │   ├── Terminal.jsx                # Componente raíz del simulador
    │   ├── Laboratory.jsx              # Laboratorio guiado paso a paso
    │   ├── Quiz.jsx                    # Sistema de preguntas con feedback
    │   ├── MissionPanel.jsx            # Panel de misiones activas/completadas
    │   ├── AchievementPanel.jsx        # Galería de logros e insignias
    │   ├── ProgressBar.jsx             # Barra de progreso reutilizable
    │   │
    │   ├── ui/
    │   │   └── XPNotification.jsx      # Notificación flotante al ganar XP
    │   │
    │   ├── terminal/                   # Sub-componentes del simulador
    │   │   ├── TerminalWindow.jsx      # Ventana con barra de título estilo macOS
    │   │   ├── TerminalOutput.jsx      # Área de salida con colores ANSI
    │   │   ├── TerminalInput.jsx       # Input con historial y autocompletado TAB
    │   │   └── TerminalPrompt.jsx      # Prompt usuario@host:path$
    │   │
    │   ├── missions/                   # Sub-componentes de misiones
    │   │   ├── MissionCard.jsx         # Tarjeta de misión individual
    │   │   └── MissionProgress.jsx     # Progreso de misión activa
    │
    └── styles/
        ├── app.css                     # Variables CSS globales + reset + layout base
        ├── terminal.css               # Estilos completos del simulador terminal
        ├── dashboard.css              # Dashboard, cards, métricas
        ├── lessons.css                # Lecciones, teoría, comandos
        ├── quiz.css                   # Formularios de quiz
        ├── laboratory.css             # Laboratorios
        ├── achievements.css           # Insignias, niveles, animaciones
        ├── sidebar.css                # Navegación lateral
        └── animations.css             # Keyframes reutilizables

## ARQUITECTURA DE DATOS (LocalStorage)

### Clave: `la30_progress`
{
  currentDay: 1,              // Día activo (1-30)
  completedDays: [],          // Array de días completados
  xp: 0,                     // XP total acumulado
  level: 1,                  // Nivel actual (1-6)
  studyTimeMinutes: 0,        // Tiempo total de estudio
  achievements: [],           // IDs de logros desbloqueados
  quizScores: {},             // { dayId: score }
  missionsCompleted: {},      // { dayId: [missionId] }
  lastLogin: null,            // ISO timestamp
  streak: 0,                  // Días consecutivos
  projectsUnlocked: []        // Proyectos desbloqueados
}

### Clave: `la30_filesystem`
{
  tree: {...},                // Árbol de archivos virtual completo
  cwd: '/home/estudiante',    // Directorio actual
}

### Clave: `la30_terminal_history`
[
  "ls -la",
  "cd documentos",
  "mkdir proyecto1"
]                             // Últimos 500 comandos

### Clave: `la30_settings`
{
  theme: 'dark',
  fontSize: 14,
  soundEnabled: false,
  animationsEnabled: true
}

## SISTEMA XP

| Acción                    | XP   |
|---------------------------|------|
| Completar lección         | +50  |
| Quiz perfecto (5/5)       | +100 |
| Quiz aprobado (3-4/5)     | +50  |
| Misión completada         | +75  |
| Laboratorio terminado     | +150 |
| Día completo              | +200 |
| Racha 7 días              | +500 |
| Primer comando terminal   | +25  |

## NIVELES

| Nivel | Título              | XP mínimo |
|-------|---------------------|-----------|
| 1     | Novato Linux        | 0         |
| 2     | Explorador Linux    | 500       |
| 3     | Operador Linux      | 1500      |
| 4     | Administrador Linux | 3500      |
| 5     | Analista Linux      | 7000      |
| 6     | Defensor Linux      | 12000     |

## FLUJO DE NAVEGACIÓN

[Dashboard] → [Sidebar: Día X] → [Lesson: Teoría]
                                 → [Lesson: Comandos]
                                 → [Laboratory]
                                 → [Quiz]
                                 → [Missions]
                                 → [Achievements]

## MOTOR DE TERMINAL

Comandos implementados con comportamiento real:
pwd, ls, cd, mkdir, touch, cp, mv, rm, cat, clear,
echo, grep, find, chmod, chown, history, whoami,
uname, ps, top, df, du, date, man, help, exit

## SISTEMA DE ARCHIVOS VIRTUAL

Estructura inicial en memoria JSON:
/
├── home/
│   └── estudiante/
│       ├── documentos/
│       ├── scripts/
│       ├── laboratorios/
│       └── proyectos/
├── etc/
│   ├── passwd  (simulado)
│   └── hostname
├── var/
│   └── log/
│       └── syslog (simulado)
├── tmp/
├── opt/
└── root/
