'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipients', {
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
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
      },
      podcastId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'podcasts',
          },
          key: 'id'
        },
      },
      reason: {
        type: Sequelize.TEXT
      },
      satoshis: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('recipients');
  }
};
