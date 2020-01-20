'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rek_updates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rekId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'reks',
          },
          key: 'id'
        },
        allowNull: false
      },
      satoshis: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      timePeriod: {
        allowNull: false,
        type: Sequelize.STRING
      },
      removeAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rek_updates');
  }
};
