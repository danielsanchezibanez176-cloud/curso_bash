# 🚀 Guía de Instalación — LinuxAcademy 30

## Requisitos previos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Node.js | 18.0+ | `node --version` |
| npm | 8.0+ | `npm --version` |
| Navegador | Chrome 90+ / Firefox 88+ / Edge 90+ | — |

> **Instalar Node.js:** https://nodejs.org/en/download (descargar LTS)

---

## Instalación en 3 pasos

### Paso 1 — Descargar el proyecto

**Opción A: Desde este repositorio (estructura de carpetas)**

Crea la carpeta del proyecto y coloca todos los archivos dentro manteniendo la estructura:

```
linuxacademy/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    ├── data/
    ├── hooks/
    ├── styles/
    └── utils/
```

**Opción B: Clonar si tienes git**

```bash
git clone <url-del-repositorio> linuxacademy
cd linuxacademy
```

---

### Paso 2 — Instalar dependencias

```bash
# Entrar al directorio del proyecto
cd linuxacademy

# Instalar dependencias (React 18 + Vite 5)
npm install
```

Verás algo similar a:
```
added 142 packages in 8s
```

---

### Paso 3 — Iniciar el servidor de desarrollo

```bash
npm run dev
```

La terminal mostrará:
```
  VITE v5.x.x  ready in 800ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Abre tu navegador en **http://localhost:5173**

---

## Estructura de carpetas completa

```
linuxacademy/
├── index.html                    ← Entry point HTML
├── package.json                  ← Dependencias
├── vite.config.js                ← Configuración de Vite
├── public/
│   └── favicon.svg               ← Ícono de la app
└── src/
    ├── main.jsx                  ← Punto de entrada React
    ├── App.jsx                   ← Componente raíz + router
    │
    ├── components/
    │   ├── Dashboard.jsx         ← Vista principal
    │   ├── Sidebar.jsx           ← Navegación lateral
    │   ├── Lesson.jsx            ← Visualizador de lecciones
    │   ├── Terminal.jsx          ← Simulador de terminal
    │   ├── Laboratory.jsx        ← Laboratorios guiados
    │   ├── Quiz.jsx              ← Sistema de quiz
    │   ├── MissionPanel.jsx      ← Panel de misiones
    │   ├── AchievementPanel.jsx  ← Logros e insignias
    │   ├── ProgressBar.jsx       ← Barra de progreso
    │   ├── terminal/
    │   │   ├── TerminalWindow.jsx
    │   │   ├── TerminalOutput.jsx
    │   │   ├── TerminalInput.jsx
    │   │   └── TerminalPrompt.jsx
    │   ├── missions/
    │   │   ├── MissionCard.jsx
    │   │   └── MissionProgress.jsx
    │   └── ui/
    │       └── XPNotification.jsx
    │
    ├── data/
    │   ├── courseData.js         ← Exporta los 30 días
    │   ├── days1to10.js          ← Días 1-10 completos
    │   ├── days11to20.js         ← Días 11-20 completos
    │   ├── days21to30.js         ← Días 21-30 completos
    │   ├── achievementsDB.js     ← 35 logros definidos
    │   └── levelsConfig.js       ← 6 niveles de XP
    │
    ├── hooks/
    │   ├── useProgress.js        ← XP, niveles, persistencia
    │   ├── useTerminal.js        ← Motor de terminal
    │   └── useQuiz.js            ← Estado del quiz
    │
    ├── styles/
    │   ├── app.css               ← Variables CSS + reset
    │   ├── animations.css        ← Keyframes
    │   ├── sidebar.css
    │   ├── dashboard.css
    │   ├── terminal.css
    │   ├── lessons.css
    │   ├── laboratory.css
    │   ├── quiz.css
    │   └── achievements.css
    │
    └── utils/
        ├── commandEngine.js      ← 60+ comandos Linux
        ├── filesystem.js         ← Sistema de archivos virtual
        ├── missionEvaluator.js   ← Evaluador de misiones
        ├── storage.js            ← LocalStorage wrapper
        └── formatters.js         ← Utilidades de formato
```

---

## Comandos disponibles

```bash
# Servidor de desarrollo (con hot reload)
npm run dev

# Compilar para producción
npm run build

# Previsualizar la build de producción
npm run preview
```

---

## Solución de problemas comunes

### Error: `node: command not found`
Node.js no está instalado. Descarga desde https://nodejs.org

### Error: `Cannot find module 'vite'`
Las dependencias no están instaladas. Ejecuta `npm install`

### Error: `Port 5173 is already in use`
Otro proceso usa ese puerto. Vite automáticamente intentará el puerto 5174, 5175, etc.

### La app no carga en el navegador
Verifica que el servidor esté corriendo (`npm run dev`) y accede a http://localhost:5173

### Los datos no persisten entre sesiones
Verifica que tu navegador no esté en modo incógnito (que bloquea localStorage).

---

## Notas importantes

- **Sin backend**: La app funciona 100% en el navegador. No necesita servidor ni base de datos.
- **LocalStorage**: El progreso se guarda en el navegador. Cambiar de navegador reinicia el progreso.
- **Sin conexión a internet**: Funciona offline después de la primera carga (excepto las fuentes de Google Fonts).
