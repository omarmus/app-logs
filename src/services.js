'use strict';

const chalk = require('chalk');
const { getQuery, getLogLines, getQueryFsLogs } = require('./util');

module.exports = function logsServices (logs, Sequelize) {
  const Op = Sequelize.Op;

  if (logs.useWinston) {
    const info = async (mensaje, tipo = '', referencia, usuario, ip) => {
      try {
        let r = await logs.log({
          level: 'info',
          nivel: 'INFO',
          fecha: new Date(),
          message: mensaje,
          tipo,
          referencia,
          usuario,
          ip
        });
        return r;
      } catch (e) {
        console.info(chalk.red('INFO LOG:'), e.message, e);
        return undefined;
      }
    };

    const error = async (mensaje, tipo = '', referencia, usuario, ip) => {
      try {
        let r = await logs.log({
          level: 'error',
          nivel: 'ERROR',
          fecha: new Date(),
          message: mensaje,
          tipo,
          referencia,
          usuario,
          ip
        });
        return r;
      } catch (e) {
        console.error(chalk.blue('ERROR LOG:'), e.message, e);
        return undefined;
      }
    };

    const warning = async (mensaje, tipo = '', referencia, usuario, ip) => {
      try {
        let r = logs.log({
          level: 'warn',
          nivel: 'ADVERTENCIA',
          fecha: new Date(),
          message: mensaje,
          tipo,
          referencia,
          usuario,
          ip
        });
        return r;
      } catch (e) {
        console.error(chalk.yellow('WARNING LOG:'), e.message, e);
        return undefined;
      }
    };

    const findAll = async (params = {}, maxLines = 50) => {
      let query = getQueryFsLogs(params);
      try {
        if (query.maxLines) {
          maxLines = query.maxLines;
          delete query.maxLines;
        }
        let r = await getLogLines(query, maxLines, logs.logsConfig);
        return {
          code: 1,
          data: {
            count: r.length,
            rows: r
          }
        };
      } catch (e) {
        throw e;
      }
    };

    return {
      info,
      error,
      warning,
      findAll,
      logsConfig: logs.logsConfig
    };
  }
  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.nivel) {
      query.where.nivel = params.nivel;
    }

    if (params.tipo) {
      query.where.tipo = {
        [Op.iLike]: `%${params.tipo}%`
      };
    }

    if (params.mensaje) {
      query.where.mensaje = {
        [Op.iLike]: `%${params.mensaje}%`
      };
    }

    if (params.referencia) {
      query.where.referencia = {
        [Op.iLike]: `%${params.referencia}%`
      };
    }

    if (params.ip) {
      query.where.ip = {
        [Op.iLike]: `%${params.ip}%`
      };
    }

    if (params.fecha) {
      query.where.fecha = {
        [Op.lte]: new Date(params.fecha),
        [Op.gte]: new Date(new Date(params.fecha) - 24 * 60 * 60 * 1000)
      };
    }

    if (params.usuario) {
      query.where.usuario = {
        [Op.iLike]: `%${params.usuario}%`
      };
    }

    return logs.findAndCountAll(query);
  }

  function findById (id) {
    return logs.findOne({
      where: {
        id
      }
    });
  }

  async function createOrUpdate (rol) {
    const cond = {
      where: {
        id: rol.id
      }
    };

    const item = await logs.findOne(cond);

    if (item) {
      const updated = await logs.update(rol, cond);
      return updated ? logs.findOne(cond) : item;
    }

    const result = await logs.create(rol);
    return result.toJSON();
  }

  async function deleteItem (id) {
    const cond = {
      where: {
        id
      }
    };

    const item = await logs.findOne(cond);

    if (item) {
      const deleted = await logs.destroy(cond);
      return !!deleted;
    }

    return false;
  }

  function formatReference (error) {
    let text = [];

    if (error.fileName) {
      text.push(`Nombre del archivo: ${error.fileName}`);
    }

    if (error.columnNumber) {
      text.push(`Número de columna: ${error.columnNumber}`);
    }

    if (error.lineNumber) {
      text.push(`Número de línea: ${error.lineNumber}`);
    }

    if (error.stack) {
      text.push(error.stack);
    }

    if (text.length) {
      return text.join('\n');
    } else {
      return JSON.stringify(error);
    }
  }

  async function error (mensaje = 'Error desconocido', tipo = '', error, usuario, ip) {
    const data = {
      nivel: 'ERROR',
      mensaje,
      tipo,
      referencia: formatReference(error),
      fecha: new Date(),
      usuario,
      ip
    };

    try {
      return createOrUpdate(data);
    } catch (e) {
      console.error(chalk.red('ERROR LOG:'), e.message, e);
    }
  }

  async function warning (mensaje, tipo = '', referencia, usuario, ip) {
    const data = {
      nivel: 'ADVERTENCIA',
      mensaje,
      tipo,
      referencia,
      fecha: new Date(),
      usuario,
      ip
    };

    try {
      return createOrUpdate(data);
    } catch (e) {
      console.warn(chalk.yellow('WARNING LOG:'), e.message);
    }
  }

  async function info (mensaje, tipo = '', referencia, usuario, ip) {
    const data = {
      nivel: 'INFO',
      mensaje,
      tipo,
      referencia,
      fecha: new Date(),
      usuario,
      ip
    };

    try {
      return createOrUpdate(data);
    } catch (e) {
      console.info(chalk.cyan('INFO LOG:'), e.message);
    }
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    error,
    warning,
    info
  };
};
