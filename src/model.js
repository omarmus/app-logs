'use strict';

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nivel: {
      type: DataTypes.ENUM,
      values: ['ERROR', 'INFO', 'ADVERTENCIA'],
      defaultValue: 'ERROR',
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(50)
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    referencia: {
      type: DataTypes.TEXT
    },
    ip: {
      type: DataTypes.STRING(100)
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    usuario: {
      type: DataTypes.STRING(255)
    }
  };

  let Logs = sequelize.define('logs', fields, {
    timestamps: false
  });

  return Logs;
};
