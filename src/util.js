'use strict';

const chalk = require('chalk');

const config = {
  database: 'base',
  username: 'omarmus',
  password: 'omar',
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

module.exports = {
  getQuery,
  config,
  handleFatalError,
  permissions
};
