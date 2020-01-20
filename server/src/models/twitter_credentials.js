'use strict';
module.exports = (sequelize, DataTypes) => {
  const twitter_credentials = sequelize.define('twitter_credentials', {
    token: DataTypes.STRING,
    secret: DataTypes.STRING
  }, {});
  return twitter_credentials;
};
