'use strict';

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

module.exports = {
  getQuery
};
