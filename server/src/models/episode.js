'use strict';
module.exports = (sequelize, DataTypes) => {
  const episode = sequelize.define('episode', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    podcastId: DataTypes.BIGINT,
    released: DataTypes.DATE,
    itunesId: DataTypes.INTEGER,
  }, {
    hooks: {
      beforeDestroy: async function(episode) {
        const Rek = sequelize.models.rek;
        await Rek.destroy({ where: { episodeId: episode.id } })
      }
    },
    getterMethods: {
      donationSum: async function() {
        const result = await sequelize.query(`
          SELECT SUM(reks.satoshis)
          FROM reks
          INNER JOIN episodes on episodes.id = reks."episodeId"
          WHERE episodes.id = ${this.id};
        `);
        return result[0][0].sum;
      },
    }
  });
  episode.associate = function(models) {
    episode.belongsTo(models.podcast);
    episode.hasMany(models.rek);
    episode.hasMany(models.bookmark);
    episode.belongsToMany(models.user, {
      through: models.guest_tag,
      as: 'guests',
      foreignKey: 'episodeId',
    });
  };

  episode.search = async function({ term, offset }) {
    const split = term.split(' ');
    if (split.length > 1) {
      return await sequelize.query(`
        SELECT episodes.title, episodes."podcastId", episodes.id,
        ts_rank(episodes._search, plainto_tsquery('english', :term)) as rank
        FROM ${this.tableName}
        INNER JOIN podcasts ON podcasts.id = episodes."podcastId"
        WHERE episodes._search @@ plainto_tsquery('english', :term)
        LIMIT 50
        OFFSET :offset;
      `, {
        model: this,
        replacements: { term, offset },
      });
    } else {
      return await sequelize.query(`
        SELECT episodes.title, episodes."podcastId", episodes.id,
        ts_rank(episodes._search, to_tsquery('english', :term)) as rank
        FROM ${this.tableName}
        INNER JOIN podcasts ON podcasts.id = episodes."podcastId"
        WHERE episodes._search @@ to_tsquery('english', :term)
        LIMIT 50
        OFFSET :offset;
      `, {
        model: this,
        replacements: { term: term + ":*", offset },
      });
    };
  }

  return episode;
};
