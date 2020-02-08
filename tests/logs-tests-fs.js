'use strict';

const test = require('ava');
const util = require('../src/util');
const { handleFatalError } = require('../src/util');
const Log = require('../');

let logs;

test.beforeEach(async () => {
  if (!logs) {
    logs = await Log({
      logsConfig: {
        console: false, // también mostrara en la consola de los tests
        storage: 'filesystem',
        outputDirectory: './logs',
        outputFilename: 'logs-tests.log',
        format: 'combined',
        level: 'info'
      }
    }).catch(handleFatalError);
  }
  logs.info('testing log', 'prueba', 'ref#', 'usuario test', '0.0.0.0');
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
  let logsRead = await util.getLogLines(
    { level: 'info' },
    50,
    { outputDirectory: './logs', outputFilename: 'logs-tests.js' }
  );
  t.true(logsRead.length > 1);
});

test.serial('Log-fs#read - filter level info && referencia ref#', async t => {
  let logsRead = await util.getLogLines(
    { level: 'info', referencia: 'ref#' },
    50,
    { outputDirectory: './logs', outputFilename: 'logs-tests.js' }
  );
  // console.log('LogsRead::::', logsRead);
  t.true(logsRead.length >= 1);
});
