'use strict';

const test = require('ava');
// const util = require('../src/util');
const Log = require('../');

let logs;

test.before(async () => {
  logs = await Log({
    logsConfig: {
      console: true,
      storage: 'filesystem',
      outputDirectory: './logs',
      outputFilename: 'logs-fs-and-console-tests.log',
      format: 'combined',
      level: 'info'
    }
  });
});

test.serial('fs-and-console#log - info', async t => {
  let log = await logs.log('Mensaje de prueba', 'info', 'tipoConsole1', 'ref-fc-1', 'usuario test', '0.0.0.1');
  // console.log('----------');
  // console.log(log);
  t.true(log !== undefined);
});

test.serial('fs-and-console#log - warn', async t => {
  let log = await logs.log('Mensaje de prueba', 'warn', 'ref-fc-0', 'usuario test', '0.0.0.1');
  t.true(log !== undefined);
});

test.serial('fs-and-console#log - error', async t => {
  let log = await logs.log('Mensaje de prueba', 'error', 'ref-fc-0', 'usuario test', '0.0.0.1');
  t.true(log !== undefined);
});

test.serial('fs-and-console#info - create', async t => {
  let log = await logs.info('Mensaje de prueba', 'ref-fc-1', 'usuario test', '0.0.0.1');
  t.true(log !== undefined);
});

test.serial('fs-and-console#error - create', async t => {
  let log = await logs.error('Mensaje de prueba error', 'ref-fc-1', 'usuario test', '0.0.0.1');
  t.true(log !== undefined);
});

test.serial('fs-and-console#warning - create', async t => {
  let log = await logs.warning('Mensaje de prueba warn', 'ref-fc-1', 'usuario test', '0.0.0.1');
  t.true(log !== undefined);
});
