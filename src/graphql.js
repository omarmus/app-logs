'use strict';

const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { permissions } = require('./util');

module.exports = Log => {
  const schemes = [`
    # Escalar tipo Fecha
    scalar DateL

    # Logs del sistema
    type Log {
      # ID del log
      id: ID!
      # nivel de log
      nivel: NivelLog!
      # tipo de log
      tipo: String
      # mensaje de log
      mensaje: String!
      # referencia de log
      referencia: String
      # ip de log
      ip: String
      # fecha de creación del log
      fecha: DateL!
      # Usuario que registró el log
      usuario: String      
    }

    # Tipos de estado del log
    enum NivelLog {
      # Nivel ERROR
      ERROR
      # Nivel INFO
      INFO
      # Nivel ADVERTENCIA
      ADVERTENCIA
    }  

    # Objeto de paginación para log
    type Logs {
      count: Int 
      rows: [Log]
    }    
  `];

  const queries = {
    Query: `
      # Lista de logs
      logs(
        # Límite de la consulta para la paginación
        limit: Int, 
        # Nro. de página para la paginación
        page: Int, 
        # Campo a ordenar, "-campo" ordena DESC
        order: String, 
        # Buscar por nivel    
        nivel: NivelLog,
        # Buscar por tipo
        tipo: String,
        # Buscar por mensaje
        mensaje: String,
        # Buscar por referencia
        referencia: String,
        # Buscar por ip
        ip: String,
        # Buscar por fecha de creación
        fecha: DateL,
        # Buscar por usuario
        usuario: String
      ): Logs
      # Obtener un log
      log(id: Int!): Log
    `,
    Mutation: ``
  };

  // Cargando Resolvers
  const resolvers = {
    Query: {
      logs: (_, args, context) => {
        permissions(context, 'logs:read');

        return Log.findAll(args);
      },
      log: (_, args, context) => {
        permissions(context, 'logs:read');

        return Log.findById(args.id);
      }
    },
    Mutation: {},
    DateL: new GraphQLScalarType({
      name: 'DateL',
      description: 'DateL custom scalar type',
      parseValue (value) {
        return new Date(value); // value from the client
      },
      serialize (value) {
        // return moment(value).format('DD/MM/YYYY, h:mm a'); // value sent to the client
        return value;
      },
      parseLiteral (ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      }
    })
  };

  return {
    schemes,
    queries,
    resolvers
  };
};
