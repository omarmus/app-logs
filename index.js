'use strict';

const defaults = require('defaults');
const Sequelize = require('sequelize');
const services = require('./src/services');
const Graphql = require('./src/graphql');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

module.exports = async function (config) {
  let logs;
  if (!config.logsConfig) {
    // logs en base de datos
    config = defaults(config, {
      dialect: 'postgres',
      pool: {
        max: 10,
        min: 0,
        idle: 10000
      }
    });

    let sequelize = new Sequelize(config);

    // Cargando modelo
    logs = sequelize.import('src/model');

    // Verificando conexión con la BD
    await sequelize.authenticate();

    // Creando las tablas
    await sequelize.sync();
  } else {
    // logs en sistema de archivos
    // analizando config, formato esperado
    /*
      {
      // para mostrar los logs tambien en la consola
      console: false,
      // Donde se guardan los logs:
      // - database: Para guardar logs en base de datos
      // - filesystem: Para guardar logs en sistema de archivos
      storage: 'database',
      // Las siguientes opciones son para cuando se usa storage = 'filesystem'
      outputDirectory: './logs',
      outputFilename: 'logs.log',
      // formato de logs, las mismas opciones de winston (combined, interpolation, json
      format: 'combined',
      // nivel de verbosidad, posibles: error, info, warning, debug
      level: 'info',
      }
    */
    const logsConfig = config.logsConfig;
    if (logsConfig.storage === 'filesystem') {
      // preparando configuracion de winston para escribir logs en archivos de texto
      let format = winston.format.combined;
      let outputDirectory = logsConfig.outputDirectory !== undefined ? logsConfig.outputDirectory : './logs';
      let outputFilename = logsConfig.outputFilename !== undefined ? logsConfig.outputFilename : 'logs.log';
      let level = logsConfig.level !== undefined ? logsConfig.level : 'info';
      let transports = [];

      if (!fs.existsSync(path.join(outputDirectory))) {
        fs.mkdirSync(path.join(outputDirectory));
        fs.closeSync(fs.openSync(path.join(logs.logsConfig.outputDirectory, logs.logsConfig.outputFilename), 'w'));
      }
      transports.push(
        new winston.transports.File({
          filename: path.join(outputDirectory, outputFilename),
          level: level
        })
      );
      if (logsConfig.console) {
        transports.push(new winston.transports.Console(
          {
            level,
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          }
        ));
      }

      if (logsConfig.format) {
        if (logsConfig.format === 'combined') {
          format = winston.format.combine(
            winston.format.timestamp({
              format: 'DD-MM-YYYY HH:mm:ss'
            }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
          );
        } else if (logsConfig.format === 'json') {
          format = winston.format.json;
        }
      }

      // creando la instancia de winston
      logs = winston.createLogger({
        level,
        format,
        transports
      });
      logs.useWinston = true; // bandera
      logs.logsConfig = logsConfig;
    }
  }
  // Cargando los servicios de logs
  let Services = services(logs, Sequelize);
  Services.graphql = Graphql(Services);

  return Services;
};
