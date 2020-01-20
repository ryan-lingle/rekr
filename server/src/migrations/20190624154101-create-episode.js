'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('episodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      podcastId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'podcasts',
          },
          key: 'id'
        },
        allowNull: false
      },
      itunesId: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      released: {
        type: Sequelize.DATE
      },
      image: {
        type: Sequelize.STRING,
        isUrl: true,
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
    return queryInterface.dropTable('episodes');
  }
};
