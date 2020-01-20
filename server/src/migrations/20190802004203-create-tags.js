'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tags', {
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
      hashtagId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'hashtags',
          },
          key: 'id'
        },
        allowNull: false
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
    return queryInterface.dropTable('tags');
  }
};
