'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('podcasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      itunesId: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      rss: {
        type: Sequelize.STRING,
        allowNull: false,
        isUrl: true,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      token: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        isUrl: true,
      },
      website: {
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
      },
      guestShare: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      satoshis: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('podcasts');
  }
};
