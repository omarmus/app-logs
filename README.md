# Módulo logs

## Modo de uso

``` bash
# Instalando librería
npm install file:../logs # La ubicación puede variar de acuerdo a donde se lo instale

```

Instanciando el módulo logs en un proyecto
``` js
const Logs = require('logs');
const logs = await Logs(config.db).catch(errors.handleFatalError);

// Mensaje de error
logs.error('Mensaje de error');

// Mensaje de info
logs.info('Mensaje de info');

// Mensaje de warning
logs.warning('Mensaje de warning');

```

## Instalando Node.js v8.x para desarrollo

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

# 2. Iniciar el servidor del proyecto en http://localhost:4000
npm run dev

```
