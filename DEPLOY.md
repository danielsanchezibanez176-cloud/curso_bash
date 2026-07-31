# 🌐 Guía de Despliegue — LinuxAcademy 30

## Opción 1 — Vercel (Recomendado, gratis)

### Despliegue en 2 minutos desde la web

1. Ve a **https://vercel.com** y crea una cuenta gratuita
2. Haz clic en **"Add New Project"**
3. Sube la carpeta del proyecto o conecta tu repositorio de GitHub
4. Vercel detecta automáticamente que es un proyecto Vite
5. Configuración automática:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Haz clic en **Deploy**

Tu app estará disponible en `https://tu-proyecto.vercel.app`

### Despliegue desde la terminal con Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# En el directorio del proyecto
vercel

# Seguir las instrucciones del asistente
# Producción:
vercel --prod
```

---

## Opción 2 — Netlify (gratis)

### Método drag & drop (más fácil)

```bash
# Primero compilar el proyecto
npm run build
```

1. Ve a **https://netlify.com** y crea una cuenta
2. En el dashboard, arrastra la carpeta `dist/` al área de drop
3. ¡Listo! Tu app estará disponible inmediatamente

### Desde la terminal con Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Compilar
npm run build

# Desplegar
netlify deploy --prod --dir=dist
```

---

## Opción 3 — GitHub Pages

### Configuración

1. Modifica `vite.config.js` añadiendo la base:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/nombre-de-tu-repositorio/',  // ← Añadir esta línea
  // ... resto de la config
})
```

2. Instala el plugin de GitHub Pages:

```bash
npm install --save-dev gh-pages
```

3. Añade en `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. Despliega:

```bash
npm run deploy
```

La app estará en `https://tu-usuario.github.io/nombre-repositorio/`

---

## Opción 4 — Servidor propio (VPS/Ubuntu)

### Con Nginx

```bash
# En el servidor de desarrollo local
npm run build

# Copiar la carpeta dist/ al servidor
scp -r dist/ usuario@tu-servidor:/var/www/linuxacademy/

# En el servidor
sudo apt install nginx -y

# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/linuxacademy
```

Contenido de la configuración:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/linuxacademy;
    index index.html;

    # Para React Router / SPA: redirigir todo a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
```

```bash
# Activar el sitio
sudo ln -s /etc/nginx/sites-available/linuxacademy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### HTTPS con Let's Encrypt (opcional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tu-dominio.com
```

---

## Build de producción

```bash
# Compilar (genera la carpeta dist/)
npm run build

# Previsualizar localmente antes de subir
npm run preview
# Abre http://localhost:4173
```

### Qué contiene `dist/`

```
dist/
├── index.html          ← HTML de entrada
├── assets/
│   ├── index-[hash].js ← JavaScript compilado y minificado
│   └── index-[hash].css← CSS compilado y minificado
└── favicon.svg
```

El tamaño aproximado de la build es ~400-600KB (sin comprimir).
Con gzip en el servidor queda ~120-180KB.

---

## Variables de entorno (opcional)

Si en el futuro añades un backend o API, crea `.env.local`:

```bash
# .env.local (no subir a git)
VITE_API_URL=https://tu-api.com
VITE_APP_VERSION=1.0.0
```

Y en el código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Checklist de despliegue

- [ ] `npm run build` completa sin errores
- [ ] `npm run preview` funciona localmente
- [ ] El progreso del usuario persiste en localStorage
- [ ] La terminal responde a comandos
- [ ] Los 30 días cargan correctamente
- [ ] Los quizzes guardan el puntaje
- [ ] Las misiones se detectan automáticamente
- [ ] Los logros se desbloquean correctamente
- [ ] El diseño es responsive en móvil
