'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const config = {
  database: 'base-backend',
  username: 'developer',
  password: 'developer1',
  host: 'localhost'
};

function getQuery (options = {}) {
  let query = {
    raw: true
  };

  if (options.limit) {
    query.limit = options.limit;
    if (options.page) {
      query.offset = (options.page - 1) * options.limit;
    }
  }

  if (options.order) {
    if (options.order.startsWith('-')) {
      query.order = [[options.order.substring(1), 'DESC']];
    } else {
      query.order = [[options.order, 'ASC']];
    }
  }

  return query;
}

function permissions (context, permission) {
  if (context.permissions) {
    let type;
    permission = permission.split('|');

    for (let i in permission) {
      if (context.permissions.indexOf(permission[i]) !== -1) {
        return true;
      } else {
        type = permission[i].split(':')[1].toUpperCase();
      }
    }
    throw new Error(`NOT_AUTHORIZED:${type || 'READ'}`);
  } else {
    throw new Error('NOT_AUTHORIZED:READ');
  }
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

// ---- usados para logs en el sistema de archivos
/**
 * Lee lineas del archivo `filter'
 * @param {obj} filter (opcional): filter Object, can have attributes:
 * {
 *   level,  // error, info, warn
 *   fecha,  // (string)
 *   referencia, // (string)
 *   usuario,    // (string)
 *   timestamp   // (string) formato: DD-MM-AAAA HH:mm:ss
 * }
 * @param {int} maxLines (opcional): Numero de lineas de log a leer
 * @param {obj} logsConfig: Objeto de configuraciones de logs
 */
async function getLogLines (filter = {}, maxLines = 50, logsConfig) {
  return new Promise((resolve, reject) => {
    let rl;
    console.log('path.join(logsConfig.outputDirectory, logsConfig.outputFilename):', path.join(logsConfig.outputDirectory, logsConfig.outputFilename));
    try {
      rl = readline.createInterface({
        input: fs.createReadStream(path.join(process.cwd(), logsConfig.outputDirectory, logsConfig.outputFilename)),
        crlfDelay: Infinity
      });
    } catch (e) {
      console.log('Error opening log file:', e);
      reject(e);
    }
    let logsFiltered = [];
    let lineCounter = 0;
    // reading line by line
    rl.on('line', (line) => {
      if (lineCounter < maxLines) {
        try {
          let logObj = JSON.parse(line);
          // aplicando filtro
          let cumple = true;
          for (let key of Object.keys(filter)) {
            if (logObj[key] !== filter[key]) {
              cumple = false;
              break;
            }
          }
          if (cumple || Object.keys(filter).length === 0) {
            logsFiltered.push(logObj);
          }
        } catch (e) {
          console.error(`${chalk.yellow('[error reading logs]')} ${e.message}`);
          reject(e.message);
        }
        lineCounter++;
        // console.log(`Line from file: ${line}`);
      } else {
        rl.close();
      }
    });
    // end
    rl.on('close', (line) => {
      resolve(logsFiltered);
    });
  });
}

module.exports = {
  getQuery,
  config,
  handleFatalError,
  permissions,
  getLogLines
};
