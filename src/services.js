'use strict';

const chalk = require('chalk');
const { getQuery, getLogLines, getQueryFsLogs } = require('./util');

module.exports = function logsServices (logs, Sequelize) {
  const Op = Sequelize.Op;
  // ----- logs en sistema de archivos -------
  if (logs.useWinston) {
    const log = async (mensaje, level = 'info', tipo = '', referencia, usuario, ip) => {
      let nivel = 'INFO';
      if (level === 'error') {
        nivel = 'ERROR';
      } else if (level === 'warn') {
        nivel = 'ADVERTENCIA';
      }
      try {
        let r = logs.log({
          level,
          nivel,
          fecha: new Date(),
          message: mensaje,
          tipo,
          referencia,
          usuario,
          ip
        });
        return r;
      } catch (e) {
        console.error(chalk.red('LOG ERROR:', e.message, e));
        return undefined;
      }
    };

    const info = async (mensaje, tipo = '', referencia, usuario, ip) => {
      const r = log(mensaje, 'info', tipo, referencia, usuario, ip);
      return r;
    };

    const error = async (mensaje, tipo = '', referencia, usuario, ip) => {
      const r = log(mensaje, 'error', tipo, referencia, usuario, ip);
      return r;
    };

    const warning = async (mensaje, tipo = '', referencia, usuario, ip) => {
      const r = log(mensaje, 'warn', tipo, referencia, usuario, ip);
      return r;
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
      log,
      info,
      error,
      warning,
      findAll,
      logsConfig: logs.logsConfig
    };
  }
  // ---- logs en BD ----
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
      query.where.ip = params.ip;
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

  async function log (mensaje, level, tipo = '', referencia, usuario, ip) {
    let nivel = 'INFO';
    if (level === 'error') {
      nivel = 'ERROR';
    } else if (level === 'warn') {
      nivel = 'ADVERTENCIA';
    }
    const data = {
      nivel,
      mensaje,
      tipo,
      referencia: nivel === 'ERROR' ? formatReference(referencia) : referencia,
      fecha: new Date(),
      usuario,
      ip
    };

    try {
      return createOrUpdate(data);
    } catch (e) {
      console.error(chalk.red('LOG ERROR:', e.message, e));
      return undefined;
    }
  }

  async function error (mensaje = 'Error desconocido', tipo = '', error, usuario, ip) {
    const r = log(mensaje, 'error', tipo, error, usuario, ip);
    return r;
  }

  async function warning (mensaje, tipo = '', referencia, usuario, ip) {
    const r = log(mensaje, 'warn', tipo, referencia, usuario, ip);
    return r;
  }

  async function info (mensaje, tipo = '', referencia, usuario, ip) {
    const r = log(mensaje, 'info', tipo, referencia, usuario, ip);
    return r;
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    log,
    error,
    warning,
    info
  };
};
