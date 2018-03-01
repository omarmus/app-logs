# Módulo logs

Creación, búsqueda y listado de logs registrandolo en una tabla con Sequelize y Postgresql

## Requisitos
- Nodejs 7.6 en adelante

## Modo de uso

``` bash
# Instalando librería
npm install app-logs --save
```

Instanciando el módulo logs en un proyecto
``` js
const Logs = require('app-logs');
const config = {
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost'
};

// Para usar await debe estar dentro una función async
const logs = await Logs(config).catch(err => console.error(err));

// Message error
logs.error('Message error');

// Message info
logs.info('Message info');

// Message warning
logs.warning('Message warning');

// Lista completa de logs, puede recibir parámetros de búsqueda entre otras opciones
const list = await logs.findAll();
```

## Instalando Node.js v8.x para el modo desarrollo

NOTA.- Debian Wheezy no soporta Node 8

``` bash
# Para Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Para Debian, instalar como root
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
```

## Instalando el proyecto

Siga los siguientes pasos:

``` bash
# 1. Instalar dependencias
npm install

# 2. Correr test de prueba, configurar la conexión de la base de datos en el archivo src/util.js
npm test
```
