'use strict';
const { UserInputError } = require('apollo-server-express');

module.exports = (sequelize, DataTypes) => {
  const hashtag = sequelize.define('hashtag', {
    name: {
      type: DataTypes.STRING,
      validate: {
        async whiteListCharacter(name) {
          const whitelisted = "qwertyuiopasdfghjklzxcvbnm_-1234567890$"
          name.split('').forEach(s => {
            if (!whitelisted.includes(s.toLowerCase())) {
              throw new UserInputError(`hashtag cannot contain ${s}`)
            }
          })
        }
      }
    }
  }, {
    getterMethods: {
      followers: async function() {
        const HashtagFollow = sequelize.models.hashtag_follow;
        return await HashtagFollow.count({ where: { hashtagId: this.id }});
      }
    },
  });
  hashtag.associate = function(models) {
    hashtag.belongsToMany(models.rek, {
      through: models.tag,
      as: 'reks',
      foreignKey: 'hashtagId',
    });

    hashtag.belongsToMany(models.user, {
      through: models.hashtag_follow,
      as: 'followers',
      foreignKey: 'hashtagId',
    });
  };

  hashtag.search = async function({ term, offset }) {
    const split = term.split(' ');
    if (split.length > 1) {
      return await sequelize.query(`
        SELECT *
        FROM ${this.tableName}
        WHERE _search @@ plainto_tsquery('english', :term)
        LIMIT 10
        OFFSET :offset;
      `, {
        model: this,
        replacements: { term, offset },
      });
    } else {
      return await sequelize.query(`
        SELECT *
        FROM ${this.tableName}
        WHERE _search @@ to_tsquery('english', :term)
        LIMIT 10
        OFFSET :offset;
      `, {
        model: this,
        replacements: { term: term + ":*", offset },
      });
    };
  }

  hashtag.prototype.getFeed = async function({ timePeriod, offset }) {
    const stream = await this.getReks({ limit: 10, offset, order: [[`${timePeriod}ValueGenerated`, 'DESC']] })
    const more = stream.length == 10;
    return { stream, more }
  }

  return hashtag;
};
