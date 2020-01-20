'use strict';
const { pubsub } = require('../pubsub');
const { UserInputError } = require('apollo-server-express');

module.exports = (sequelize, DataTypes) => {
  const hashtag_follow = sequelize.define('hashtag_follow', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        async isUnique(val) {
          const { followerId, hashtagId } = this;

          const exists = await hashtag_follow.findOne({ where: { followerId, hashtagId } })

          if (exists) {
            throw new UserInputError('Already following this Hashtag')
          }
        }
      }
    },
    hashtagId: DataTypes.INTEGER
  }, {
    hooks: {
      afterCreate: async function({ hashtagId, followerId }) {
        pubsub.publish('HASHTAGS', { hashtagId, followerId, follow: true });
      },

      beforeDestroy: async function({ hashtagId, followerId }) {
        pubsub.publish('HASHTAGS', { hashtagId, followerId, follow: false });
      }
    }
  });
  return hashtag_follow;
};
