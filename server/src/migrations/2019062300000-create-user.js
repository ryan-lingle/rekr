'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      satoshis: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bio: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.STRING,
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
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
      walletPermission: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      profilePic: {
        type: Sequelize.STRING
      },
      twitterId: {
        type: Sequelize.STRING
      },
      twitterKey: {
        type: Sequelize.STRING
      },
      twitterSecret: {
        type: Sequelize.STRING
      },
      canTweet: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      passwordToken: {
        type: Sequelize.STRING
      },
      deactivated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    return queryInterface.dropTable('users');
  }
};
