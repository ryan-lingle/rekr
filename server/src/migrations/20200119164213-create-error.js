'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('errors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      error: {
        type: Sequelize.JSON
      },
      operation: {
        type: Sequelize.JSON
      },
      stack: {
        type: Sequelize.JSON,
      },
      location: {
        type: Sequelize.STRING,
      },
      client: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('errors');
  }
};
