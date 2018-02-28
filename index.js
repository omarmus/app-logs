'use strict';

const defaults = require('defaults');
const Sequelize = require('sequelize');
const services = require('./src/services');

module.exports = async function (config) {
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
  const logs = sequelize.import('src/model');

  // Verificando conexión con la BD
  await sequelize.authenticate();

  // Creando las tablas
  await sequelize.sync();

  // Cargando los servicios de logs
  return services(logs, Sequelize);
};
