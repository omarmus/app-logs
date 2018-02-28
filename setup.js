'use strict';

const { errors, config } = require('common');
const Log = require('./');

async function setup () {
  const logs = await Log(config.db).catch(errors.handleFatalError);

  console.log('Services!', logs);
  console.log('Success Log setup!');
  process.exit(0);
}
setup();
