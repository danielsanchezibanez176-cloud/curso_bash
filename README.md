# 🐧 LinuxAcademy 30

**Plataforma interactiva de aprendizaje de Linux, Bash y Ciberseguridad — 30 días**

Aprende Linux desde cero hasta un nivel intermedio-avanzado en ciberseguridad, con una terminal Linux real en el navegador, laboratorios guiados, quizzes y gamificación completa.

---

## ✨ Características principales

- **Terminal Linux simulada** — sistema de archivos virtual, 60+ comandos reales, historial, autocompletado TAB
- **30 días de contenido real** — teoría, laboratorios, quizzes y misiones para cada día
- **Sistema de gamificación** — XP, 6 niveles, 35 logros, rachas de estudio
- **Progreso persistente** — guardado automático en LocalStorage
- **Diseño profesional** — tema oscuro, responsive, animaciones suaves
- **Sin backend** — funciona 100% en el navegador

---

## 🚀 Inicio rápido

```bash
npm install
npm run dev
```

Abre **http://localhost:5173**

→ Ver [INSTALL.md](./INSTALL.md) para instrucciones completas
→ Ver [DEPLOY.md](./DEPLOY.md) para despliegue en producción

---

## 📚 Estructura del curso

| Semana | Días | Tema | Categoría |
|--------|------|------|-----------|
| 1 | 1-7 | Fundamentos Linux: terminal, archivos, permisos | 🐧 Linux |
| 2 | 8-14 | Linux avanzado: búsqueda, pipes, usuarios, sed/awk | 🐧 Linux |
| 3 | 15-20 | Bash scripting: scripts, funciones, redes, SSH | ⚡ Bash |
| 4 | 21-26 | Ciberseguridad: logs, procesos, hardening, IDS | 🛡️ Cyber |
| 5 | 27-30 | Proyecto Final: Centro de Monitoreo Linux | 🛡️ Cyber |

### Cada día incluye

- 📖 **Teoría** — explicación técnica + explicación simple + caso real
- ⌨️ **Comandos** — tarjetas interactivas con sintaxis, ejemplos y errores comunes
- 🧪 **Laboratorio** — pasos guiados con pistas y resultado esperado
- 📝 **Quiz** — 5 preguntas con retroalimentación inmediata
- 🎯 **Misiones** — tareas en la terminal con evaluación automática

---

## 🏗️ Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | UI components |
| Vite | 5 | Build tool + dev server |
| JavaScript | ES2022 | Lógica de la app |
| CSS puro | — | Estilos (sin frameworks CSS) |
| LocalStorage | — | Persistencia de datos |

**Sin dependencias de UI externas** — todo el diseño está implementado con CSS variables y componentes propios.

---

## 🗂️ Arquitectura

```
src/
├── App.jsx               ← Router por estado + layout
├── components/           ← Componentes React
│   ├── Dashboard.jsx     ← Vista principal con métricas
│   ├── Lesson.jsx        ← Teoría + comandos + lab + quiz + misiones
│   ├── Terminal.jsx      ← Simulador de terminal completo
│   ├── Laboratory.jsx    ← Laboratorios paso a paso
│   ├── Quiz.jsx          ← Sistema de preguntas
│   ├── Sidebar.jsx       ← Navegación lateral
│   └── AchievementPanel  ← Logros e insignias
├── data/
│   ├── courseData.js     ← Exporta los 30 días
│   ├── days1to10.js      ← Días 1-10 (Linux básico)
│   ├── days11to20.js     ← Días 11-20 (Bash + redes)
│   └── days21to30.js     ← Días 21-30 (Ciberseguridad)
├── hooks/
│   ├── useProgress.js    ← XP, niveles, logros, localStorage
│   ├── useTerminal.js    ← Motor de terminal + misiones
│   └── useQuiz.js        ← Estado del quiz
└── utils/
    ├── commandEngine.js  ← Intérprete de 60+ comandos Linux
    ├── filesystem.js     ← Sistema de archivos virtual en memoria
    ├── missionEvaluator  ← Evaluación automática de misiones
    └── storage.js        ← Wrapper de localStorage
```

---

## 💾 Datos en LocalStorage

| Clave | Contenido |
|---|---|
| `la30_progress` | XP, nivel, días completados, logros, misiones, quizzes |
| `la30_filesystem` | Estado del sistema de archivos virtual |
| `la30_terminal_history` | Historial de comandos (últimos 500) |
| `la30_settings` | Preferencias del usuario |

---

## 🎮 Sistema de gamificación

### Niveles

| Nivel | Título | XP mínimo |
|---|---|---|
| 1 | 🐧 Novato Linux | 0 |
| 2 | 🗺️ Explorador Linux | 500 |
| 3 | ⚙️ Operador Linux | 1,500 |
| 4 | 🛡️ Administrador Linux | 3,500 |
| 5 | 🔍 Analista Linux | 7,000 |
| 6 | ⚔️ Defensor Linux | 12,000 |

### XP por acción

| Acción | XP |
|---|---|
| Primer comando | +25 |
| Lección vista | +25 |
| Lección completada | +50 |
| Misión completada | +75 |
| Quiz aprobado (≥60%) | +50 |
| Quiz perfecto (100%) | +100 |
| Laboratorio completo | +150 |
| Día completo | +200 |

---

## 🖥️ Terminal simulada

La terminal implementa un sistema de archivos virtual completo:

```
/
├── home/estudiante/
│   ├── documentos/     ← Archivos de práctica
│   ├── scripts/        ← Scripts bash del curso
│   ├── laboratorios/   ← Labs completados
│   └── proyectos/      ← Proyectos del estudiante
├── etc/                ← Configuraciones del sistema
│   ├── passwd, group, hosts, os-release
│   └── ssh/sshd_config
└── var/log/            ← Logs del sistema
    ├── syslog
    └── auth.log
```

**Comandos implementados:** `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `echo`, `grep`, `find`, `chmod`, `chown`, `history`, `whoami`, `uname`, `ps`, `top`, `df`, `du`, `date`, `ss`, `ping`, `ssh`, `curl`, `tar`, `sha256sum`, `awk`, `sed`, `wc`, `head`, `tail`, `sort`, `tree`, `id`, `env`, `export`, `systemctl`, `crontab`, `man`, `help` y más.

---

## 📊 Estadísticas del curso

- **30 días** de contenido completo
- **150+ preguntas** de quiz
- **120+ misiones** de terminal
- **150+ pasos** de laboratorio
- **80+ comandos** documentados
- **35 logros** desbloqueables
- **~8,000 líneas** de código

---

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview de la build
npm run preview
```

### Añadir contenido

Los datos del curso están en `src/data/days*.js`. Cada día sigue esta estructura:

```javascript
{
  day: 1,
  title: 'Título del día',
  category: 'linux' | 'bash' | 'cyber',
  xp: 200,
  tags: ['tag1', 'tag2'],
  objectives: ['Objetivo 1', 'Objetivo 2'],
  theory: { intro, sections, diagram, realCase },
  commands: [{ name, brief, technical, simple, syntax, errors, security }],
  lab: { title, context, duration, xp, steps, commonErrors },
  quiz: [{ type, question, options, correct, explanation }],
  missions: [{ id, title, description, hint, xp, condition }],
  resources: [{ name, url, icon }],
}
```

---

## 📄 Licencia

MIT — libre para uso educativo y personal.

---

*Construido con ❤️ para estudiantes de Ingeniería de Sistemas*
