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

test.serial('fs#log - create', async t => {
  let log = await logs.log('Mensaje de prueba', 'info', 'tipoPrueba', 'ref1', 'usuario test', '0.0.0.0');
  // console.log('.......', log);
  t.true(log !== undefined);
});

test.serial('fs#log - create default log level', async t => {
  let log = await logs.log('Mensaje de prueba');
  // console.log('.......', log);
  t.true(log !== undefined);
});

test.serial('fs#info - create', async t => {
  let log = logs.info('Mensaje de prueba', 'prueba', 'ref1', 'usuario test', '0.0.0.0');
  log = logs.info('msj de prueba', 'prueba', 'ref2', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('fs#error - create', async t => {
  let log = logs.error('Mensaje de error prueba', 'prueba', 'ref2', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('fs#warning - create', async t => {
  let log = logs.warning('Mensaje de advertencia de prueba', 'prueba', 'ref1', 'usuario test', '0.0.0.0');
  t.true(log !== undefined);
});

test.serial('fs#filter - level: info', async t => {
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

test.serial('fs#filter - level: info, referencia: ref1', async t => {
  let logsRead = await util.getLogLines(
    { level: 'info', referencia: 'ref1' },
    50,
    { outputDirectory: './logs', outputFilename: 'logs-tests.log' }
  );
  t.true(logsRead.length >= 1);
});

test.serial('fs#findAll', async t => {
  let r = await logs.findAll();
  // console.log('r::', r);
  t.true(r.code === 1);
  t.true(r.data.count >= 1);
});

test.serial('fs#findAll - level:info', async t => {
  let r = await logs.findAll({ level: 'info' });
  t.true(r.code === 1);
  t.true(r.data.count >= 1);
});

test.serial('fs#findAll - level:info, referencia: ref2', async t => {
  let r = await logs.findAll({ level: 'info', referencia: 'ref2' });
  t.true(r.code === 1);
  t.true(r.data.count >= 1);
});

test.serial('Parametro#Graphql - lista', async t => {
  let lista = await logs.graphql.resolvers.Query.logs(null, {}, { permissions: ['logs:read'] });
  // console.log('lista::::', lista);
  // t.true(lista.count >= 2, 'Se tiene 2 registros en la bd');
  t.true(lista.data.count >= 2, 'Se tiene 2 registros en la bd');
});

test.serial('Parametro#Graphql - graphql query', async t => {
  let lista = await logs.graphql.resolvers.Query.logs(
    null,
    { limit: 10, page: 1, order: '-fecha' },
    { permissions: ['logs:read'] });
  // t.true(lista.count >= 2, 'Se tiene 2 registros en la bd');
  t.true(lista.data.count >= 2, 'Se tiene 2 registros en la bd');
});
