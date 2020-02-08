'use strict';

const test = require('ava');
const util = require('../src/util');
// const { handleFatalError } = require('../src/util');
const Log = require('../');

let logs;

test.before(async () => {
  logs = await Log({
    logsConfig: {
      console: false, // también mostrara en la consola de los tests
      storage: 'filesystem',
      outputDirectory: './logs',
      outputFilename: 'logs-tests.log',
      format: 'combined',
      level: 'info'
    }
  });
});

test.serial('Log-fs#info - create', async t => {
  let log = logs.info('Mensaje de prueba', 'prueba', 'ref1', 'usuario test', '0.0.0.0');
  log = logs.info('msj de prueba', 'prueba', 'ref2', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#error - create', async t => {
  let log = logs.error('Mensaje de error prueba', 'prueba', 'ref2', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#warning - create', async t => {
  let log = logs.warning('Mensaje de advertencia de prueba', 'prueba', 'ref1', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('Log-fs#filter - level: info', async t => {
  const fs = require('fs');
  const path = require('path');
  fs.closeSync(fs.openSync(path.join(logs.logsConfig.outputDirectory, logs.logsConfig.outputFilename), 'a'));
  console.log(fs.existsSync(path.join('./logs', 'logs-tests.log')));
  let logsRead = await util.getLogLines(
    { level: 'info' },
    50,
    { outputDirectory: './logs', outputFilename: 'logs-tests.log' }
  );
  t.true(Array.isArray(logsRead));
});

test.serial('Log-fs#filter - level: info, referencia: ref1', async t => {
  console.log('logs filter2;;');
  let logsRead = await util.getLogLines(
    { level: 'info', referencia: 'ref1' },
    50,
    { outputDirectory: './logs', outputFilename: 'logs-tests.log' }
  );
  t.true(logsRead.length >= 1);
});
