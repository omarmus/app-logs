'use strict';

const { config, handleFatalError } = require('./src/util');
const Log = require('./');

async function setup () {
  const logs = await Log(config).catch(handleFatalError);

  console.log('Services!', logs);
  console.log('Success Log setup!');
  process.exit(0);
}
setup();
