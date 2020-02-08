'use strict';

const test = require('ava');
const util = require('../src/util');
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
  let log = await logs.info('Mensaje de prueba', 'prueba', 'ref1', 'usuario test', '0.0.0.0');
  log = logs.info('msj de prueba', 'prueba', 'ref2', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#error - create', async t => {
  let log = await logs.error('Mensaje de error prueba', 'prueba', 'ref2', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#warning - create', async t => {
  let log = await logs.warning('Mensaje de advertencia de prueba', 'prueba', 'ref1', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#read - filter level info', async t => {
  await logs.info('msj de prueba', 'prueba', 'ref-info', 'usuario test', '0.0.0.0');
  await logs.info('msj de prueba', 'prueba', 'ref-info', 'usuario test', '0.0.0.0');
  let logsRead = await util.getLogLines(
    { level: 'info' },
    50,
    { outputDirectory: './logs' }
  );
  t.true(logsRead.length > 1);
});

test.serial('Log-fs#read - filter level info && referencia ref#', async t => {
  await logs.info('msj de prueba', 'prueba', 'ref#', 'usuario test', '0.0.0.0');
  let logsRead = await util.getLogLines(
    { level: 'info', referencia: 'ref#' },
    50,
    { outputDirectory: './logs' }
  );
  console.log('LogsRead::::', logsRead);
  t.true(logsRead.length >= 1);
});
