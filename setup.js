'use strict';

const { errors, config } = require('common');
const Log = require('./');

async function setup () {
  const services = await Log(config.db).catch(errors.handleFatalError);

  console.log('Services!', services);
  console.log('Success Log setup!');
  process.exit(0);
}
setup();
