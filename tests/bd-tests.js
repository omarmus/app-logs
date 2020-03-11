'use strict';

const test = require('ava');
const { config, handleFatalError } = require('../src/util');
const Log = require('../');

let logs;

test.beforeEach(async () => {
  if (!logs) {
    logs = await Log(config).catch(handleFatalError);
  }
});

test.serial('Log#createOrUpdate - new', async t => {
  const nuevoLog = {
    nivel: 'ERROR',
    tipo: 'BASE DE DATOS',
    mensaje: 'Error sequelize',
    referencia: 'Muchos errores sequelize',
    ip: '255.255.255.255',
    fecha: new Date(2015, 0, 1),
    usuario: 'usuario'
  };

  let log = await logs.createOrUpdate(nuevoLog);
  test.idLog1 = log.id;

  nuevoLog.nivel = 'INFO';
  nuevoLog.mensaje = 'Error graphql';

  log = await logs.createOrUpdate(nuevoLog);

  t.true(typeof log.id === 'number', 'Comprobando que el nuevo log tenga un id');
  t.is(log.tipo, nuevoLog.tipo, 'Creando registro - tipo');
  t.is(log.mensaje, nuevoLog.mensaje, 'Creando registro - mensaje');
  t.is(log.referencia, nuevoLog.referencia, 'Creando registro - referencia');
  t.is(log.ip, nuevoLog.ip, 'Creando registro - ip');
  t.is(log.fecha.getTime(), nuevoLog.fecha.getTime(), 'Creando registro - fecha');

  test.idLog = log.id;
});

test.serial('Log#findAll', async t => {
  let lista = await logs.findAll();

  t.true(lista.count > 1, 'Se tiene más de 1 registros en la bd');
});

test.serial('Log#findById', async t => {
  const id = test.idLog;

  let log = await logs.findById(id);

  t.is(log.id, id, 'Se recuperó el registro mediante un id');
});

// test.serial('Log#findAll#filter#mensaje', async t => {
//   let lista = await logs.findAll({ mensaje: 'sequel' });

//   t.is(lista.count, 1, 'Se tiene 1 registros en la bd');
// });

test.serial('Log#createOrUpdate - update', async t => {
  const data = {
    id: test.idLog,
    nivel: 'ERROR',
    tipo: 'DOMINIO-TEST',
    mensaje: 'Sequelize bd',
    ip: '255.255.255.254',
    referencia: 'sequelize bd error',
    fecha: new Date(2015, 0, 1)
  };

  let log = await logs.createOrUpdate(data);

  t.is(log.nivel, data.nivel, 'Actualizando registro log');
});

test.serial('Log#findAll#filter#tipo', async t => {
  let lista = await logs.findAll({ tipo: 'DOMINIO-TEST' });

  t.is(lista.count, 1, 'Se tiene 1 registros en la bd');
});

// test.serial('Log#findAll#filter#referencia', async t => {
//   let lista = await logs.findAll({ referencia: 'sequel' });

//   t.is(lista.count, 2, 'Se tiene 2 registros en la bd');
// });

test.serial('Log#findAll#filter#ip', async t => {
  let lista = await logs.findAll({ ip: '255.255.255' });

  t.is(lista.count, 2, 'Se tiene 2 registros en la bd');
});

test.serial('Log#findAll#filter#fecha', async t => {
  let lista = await logs.findAll({ fecha: new Date(2015, 0, 1) });

  t.is(lista.count, 2, 'Se tiene 2 registros en la bd');
});

test.serial('Parametro#Graphql - lista', async t => {
  let lista = await logs.graphql.resolvers.Query.logs(null, {}, { permissions: ['logs:read'] });

  t.true(lista.count >= 2, 'Se tiene 2 registros en la bd');
});

test.serial('Log#delete', async t => {
  await logs.deleteItem(test.idLog1);
  let deleted = await logs.deleteItem(test.idLog);

  t.true(deleted, 'Usuario eliminado');
});

test.serial('Log#error', async t => {
  const err = new Error('Probando mensaje de error');
  let log = await logs.error(err.message, 'ERROR DB', err, 'usuario test', '200.168.192.1');

  t.is(log.mensaje, err.message, 'Mensaje de error creado');
});

test.serial('Log#info', async t => {
  let mensaje = 'Log informativo';
  let log = await logs.info(mensaje, 'ERROR DB', 'Referencia info', 'usuario test', '200.168.192.1');

  t.is(log.mensaje, mensaje, 'Mensaje info creado');
});

test.serial('Log#warning', async t => {
  let mensaje = 'Log de advertencia';
  let log = await logs.warning(mensaje, 'ERROR DB', 'Referencia warning', 'usuario test', '200.168.192.1');

  t.is(log.mensaje, mensaje, 'Mensaje info creado');
});
