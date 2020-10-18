# Módulo logs

Creación, búsqueda y listado de logs, el guardado de logs se puede escoger entre base de datos o sistema de archivos:

1. **Logs en base de datos** (por defecto): Registra los logs en una tabla con Sequelize, Postgresql y GraphQL.
2. **Logs en sistema de archivos**: Registra los logs en un archivo del sistema de archivos.
3. **Logs en consola**: Manda los logs también a la salida estándar (**stdout**) y cuando son de nivel `error` los manda a **stderr**.

Maneja tres niveles de logs: `info, warning, error`.

LICENCIA: MIT License (Omar Gutiérrez C.)

## Requisitos
- Nodejs 7.6 en adelante

## Modo de uso

``` bash
# Instalando librería
npm install app-logs --save
```

Instanciando el módulo logs en un proyecto, primero hay que definir un objeto de configuración:
``` js
const Logs = require('app-logs');

// en caso de usar logs en el sistema de archivos se usa:
const config = {
  logsConfig: {
    // indica que los logs se guardan en el sistema de archivos
	// posibles: 'filesystem', 'database'
    storage: 'filesystem',

    // para mostrar los logs también en la consola (stdout) esto debería ser true
	// Cuando se loguea con nivel 'error' el log va a stderr en lugar de stdout
    console: false,

    // directorio con los logs
    outputDirectory: './logs',

    // nombre de archivo de logs
    outputFilename: 'logs.log',

    // formato de logs, con algunas de las opciones de winston (combined, interpolation, json)
    format: 'combined',

    // nivel de logs por defecto, posibles: error, info, warning. (info por defecto)
    level: 'info'
  }
};

// en caso de usar logs en base de datos bastaría:
const config = {
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost',
};

```
Luego iniciar el módulo.
```js
const logs = await Logs(config).catch(err => console.error(err));
```
Uso
```js
// Message error
await logs.error('Message error');

// Message info
await logs.info('Message info');

// Message warning
await logs.warning('Message warning');

// Pasando el nivel de logs manualmente se pueden agregar detalles: 
// - Mensaje: String - Texto del mensaje
// - Nivel de logs: String solo con los valores "info", "warn" o "error"
// - tipo: String - Tipo de log (sirve para hacer búsquedas)
// - Referencia: String - Mas detalle del mensaje (sirve para hacer búsquedas)
// - Usuario: String - Guardar con el nombre de un usuario
// - Ip: String - Dirección ip
await logs.log('Mensaje', 'info', 'API,'ref-0', 'usuario1', '1.0.0.1');
await logs.log('Mensaje de advertencia', 'warn', 'GRAPHQL','ref-0', 'usuario', '1.0.0.1');
await logs.log('Mensaje de error', 'error', 'ref-0', 'DATABASE', 'usuario', '1.0.0.1');

// guardara usando el nivel de logs por defecto y las demás opciones vacías
await logs.log('Mensaje');

```
Ver más ejemplos de uso en [tests](tests/).

Consultar logs:
```js
// Lista completa de logs, puede recibir parámetros de búsqueda entre otras opciones
let list = await logs.findAll();

// Lista de logs por nivel 'info'
list = await logs.findAll({ level: 'info'});

// Lista de logs por dirección ip 127.0.0.1
list = await logs.findAll({ ip: '127.0.0.1'});
```

Ver más ejemplos de uso en [tests/](tests/).

## Ejecutando indivualmente

Siga los siguientes pasos:

``` bash
# 1. Instalar dependencias
npm install

# 2. Correr test de prueba, configurar la variable config con la conexión de la base de datos
# en el archivo src/util.js
npm test
```
