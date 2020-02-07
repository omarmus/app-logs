'use strict';

const test = require('ava');
const { config, handleFatalError } = require('../src/util');
const Log = require('../');

let logs;

test.beforeEach(async () => {
  console.log(config);
  if (!logs) {
    logs = await Log({
      logsConfig: {
        console: true, // también mostrara en la consola de los tests
        storage: 'filesystem',
        outputDirectory: './logs',
        format: 'combined',
        level: 'info'
      }
    }).catch(handleFatalError);
  }
});

test.serial('Log-fs#info - create', async t => {
  let log = logs.info('Mensaje de prueba', 'prueba', 'modulo de prueba', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#error - create', async t => {
  let log = logs.error('Mensaje de error prueba', 'prueba', 'modulo de prueba', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#warning - create', async t => {
  let log = logs.warning('Mensaje de advertencia de prueba', 'prueba', 'modulo de prueba', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});
