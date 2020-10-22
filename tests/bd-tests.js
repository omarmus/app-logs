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

test.serial('bd#createOrUpdate - new ERROR', async t => {
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
  test.idLog = log.id;

  t.true(typeof log.id === 'number', 'Comprobando que el nuevo log tenga un id');
  t.is(log.tipo, nuevoLog.tipo, 'Creando registro - tipo');
  t.is(log.mensaje, nuevoLog.mensaje, 'Creando registro - mensaje');
  t.is(log.referencia, nuevoLog.referencia, 'Creando registro - referencia');
  t.is(log.ip, nuevoLog.ip, 'Creando registro - ip');
  t.is(log.fecha.getTime(), nuevoLog.fecha.getTime(), 'Creando registro - fecha');
});

test.serial('bd#createOrUpdate - new INFO', async t => {
  const nuevoLog = {
    nivel: 'INFO',
    tipo: 'BASE DE DATOS',
    mensaje: 'INFO sequelize',
    referencia: 'Guardado de datos',
    ip: '255.255.255.255',
    fecha: new Date(2015, 0, 1),
    usuario: 'usuario'
  };

  let log = await logs.createOrUpdate(nuevoLog);
  test.idLog1 = log.id;

  t.true(typeof log.id === 'number', 'Comprobando que el nuevo log tenga un id');
  t.is(log.tipo, nuevoLog.tipo, 'Creando registro - tipo');
  t.is(log.mensaje, nuevoLog.mensaje, 'Creando registro - mensaje');
  t.is(log.referencia, nuevoLog.referencia, 'Creando registro - referencia');
  t.is(log.ip, nuevoLog.ip, 'Creando registro - ip');
  t.is(log.fecha.getTime(), nuevoLog.fecha.getTime(), 'Creando registro - fecha');
});

test.serial('bd#findAll', async t => {
  let lista = await logs.findAll();

  t.true(lista.count > 1, 'Se tiene más de 1 registros en la bd');
});

test.serial('bd#findById', async t => {
  const id = test.idLog;

  let log = await logs.findById(id);

  t.is(log.id, id, 'Se recuperó el registro mediante un id');
});

// test.serial('bd#findAll#filter#mensaje', async t => {
//   let lista = await logs.findAll({ mensaje: 'sequel' });

//   t.is(lista.count, 1, 'Se tiene 1 registros en la bd');
// });

test.serial('bd#createOrUpdate - update', async t => {
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

test.serial('bd#findAll#filter#tipo', async t => {
  let lista = await logs.findAll({ tipo: 'DOMINIO-TEST' });

  t.is(lista.count, 1, 'Se tiene 1 registros en la bd');
});

// test.serial('bd#findAll#filter#referencia', async t => {
//   let lista = await logs.findAll({ referencia: 'sequel' });

//   t.is(lista.count, 2, 'Se tiene 2 registros en la bd');
// });

test.serial('bd#findAll#filter#ip', async t => {
  let lista = await logs.findAll({ ip: '255.255.255.255' });

  t.is(lista.count, 1, 'Se tiene 1 registros en la bd');
});

test.serial('bd#findAll#filter#fecha', async t => {
  let lista = await logs.findAll({ fecha: new Date(2015, 0, 1) });

  t.is(lista.count, 2, 'Se tiene 2 registros en la bd');
});

test.serial('Parametro#Graphql - lista', async t => {
  let lista = await logs.graphql.resolvers.Query.logs(null, {}, { permissions: ['logs:read'] });

  t.true(lista.count >= 2, 'Se tiene 2 registros en la bd');
});

test.serial('bd#delete 1', async t => {
  let deleted = await logs.deleteItem(test.idLog);

  t.true(deleted, 'logs 1 eliminado');
});

test.serial('bd#delete 2', async t => {
  let deleted = await logs.deleteItem(test.idLog1);

  t.true(deleted, 'Usuario eliminado');
});

test.serial('bd#log - new info', async t => {
  const log = await logs.log(
    'Prueba Info', // mensaje
    'info', // level
    'BASE DE DATOS', // tipo
    'Muchos errores sequelize', // referencia
    'usuario', // usuario
    '255.255.255.255' // ip
  );
  t.true(typeof log.id === 'number', 'El nuevo log tiene id');
  t.is(log.tipo, 'BASE DE DATOS', 'Creando registro - tipo');
  // t.is(log.level, 'info', 'Creando registro - level');
  t.is(log.mensaje, 'Prueba Info', 'Creando registro - mensaje');
  t.is(log.referencia, 'Muchos errores sequelize', 'Creando registro - referencia');
  t.is(log.usuario, 'usuario', 'Creando registro - usuario');
  t.is(log.ip, '255.255.255.255', 'Creando registro - ip');
  test.idLog2 = log.id;
});

test.serial('bd#log - new error', async t => {
  const log = await logs.log(
    'Prueba Error', // mensaje
    'error', // level
    'BASE DE DATOS', // tipo
    'Muchos errores sequelize', // referencia
    'usuario', // usuario
    '255.255.255.255' // ip
  );
  t.true(typeof log.id === 'number', 'El nuevo log tiene id');
  t.is(log.tipo, 'BASE DE DATOS', 'Creando registro - tipo');
  // t.is(log.level, 'info', 'Creando registro - level');
  t.is(log.mensaje, 'Prueba Error', 'Creando registro - mensaje');
  t.is(log.referencia, '"Muchos errores sequelize"', 'Creando registro - referencia');
  t.is(log.usuario, 'usuario', 'Creando registro - usuario');
  t.is(log.ip, '255.255.255.255', 'Creando registro - ip');
  test.idLog3 = log.id;
});

test.serial('bd#log - mensaje con nivel de logs por defecto', async t => {
  const log = await logs.log(
    'Prueba mensaje' // mensaje
  );
  t.true(typeof log.id === 'number', 'El nuevo log tiene id');
  t.is(log.tipo, '', 'Creando registro - tipo');
  t.is(log.nivel, 'INFO', 'Creando registro - level');
  t.is(log.mensaje, 'Prueba mensaje', 'Creando registro - mensaje');
  t.is(log.referencia, '', 'Creando registro - referencia');
  t.is(log.usuario, '', 'Creando registro - usuario');
  t.is(log.ip, '', 'Creando registro - ip');
  test.idLog4 = log.id;
});

test.serial('bd#error', async t => {
  const err = new Error('Probando mensaje de error');
  let log = await logs.error(err.message, 'ERROR DB', err, 'usuario test', '200.168.192.1');

  t.is(log.mensaje, err.message, 'Mensaje de error creado');
});

test.serial('bd#info', async t => {
  let mensaje = 'Log informativo';
  let log = await logs.info(mensaje, 'ERROR DB', 'Referencia info', 'usuario test', '200.168.192.1');

  t.is(log.mensaje, mensaje, 'Mensaje info creado');
});

test.serial('bd#warning', async t => {
  let mensaje = 'Log de advertencia';
  let log = await logs.warning(mensaje, 'ERROR DB', 'Referencia warning', 'usuario test', '200.168.192.1');

  t.is(log.mensaje, mensaje, 'Mensaje info creado');
});

test.serial('bd#delete 3', async t => {
  await logs.deleteItem(test.idLog1);
  let deleted = await logs.deleteItem(test.idLog2);

  t.true(deleted, 'log 3 eliminado');
});

test.serial('bd#delete 4', async t => {
  await logs.deleteItem(test.idLog1);
  let deleted = await logs.deleteItem(test.idLog3);

  t.true(deleted, 'log 4 eliminado');
});

test.serial('bd#delete 5', async t => {
  await logs.deleteItem(test.idLog1);
  let deleted = await logs.deleteItem(test.idLog4);

  t.true(deleted, 'log 5 eliminado');
});
