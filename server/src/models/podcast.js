'use strict';
const RssFeed = require('../datasources/rss_feed');
const { sendPodcastEmail } = require("../datasources/mailer");
const { withdraw } = require('../datasources/lnd');
const { UserInputError } = require('apollo-server-express');

module.exports = (sequelize, DataTypes) => {
  const podcast = sequelize.define('podcast', {
    title: DataTypes.STRING,
    rss: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    email:  {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    satoshis: {
      type: DataTypes.INTEGER,
      validate: {
        async isPositive(satoshis) {
          if ((satoshis) < 0) {
            throw new UserInputError('Not enough funds.')
          }
        }
      }
    },
    emailVerified: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    image:  {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    userId: DataTypes.INTEGER,
    website:  {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    itunesId: DataTypes.INTEGER,
    guestShare: DataTypes.FLOAT
  }, {
    getterMethods: {
      latestEpisodeDate: async function() {
        const ep = await this.getEpisodes({ order: [['released', 'DESC']]})
        return ep[0] && ep[0].released;
      },

      donationSum: async function() {
        const result = await sequelize.query(`
          SELECT SUM(reks.satoshis)
          FROM reks
          INNER JOIN episodes on episodes.id = reks."episodeId"
          INNER JOIN podcasts on podcasts.id = episodes."podcastId"
          WHERE podcasts.id = ${this.id};
        `);
        return result[0][0].sum || 0;
      },

      donationCount: async function() {
        const result = await sequelize.query(`
          SELECT COUNT(*)
          FROM reks
          INNER JOIN episodes on episodes.id = reks."episodeId"
          INNER JOIN podcasts on podcasts.id = episodes."podcastId"
          WHERE podcasts.id = ${this.id};
        `);
        return result[0][0].count || 0;
      }

    },
    hooks: {
      beforeCreate: async function(podcast) {
        podcast.slug = slugify(podcast.title);
        podcast.setToken();
      },

      beforeDestroy: async function(podcast) {
        const Episode = sequelize.models.episode;
        await Episode.destroy({ where: { podcastId: podcast.id }, individualHooks: true })
      },

      afterCreate: async function(podcast) {
        const Episode = sequelize.models.episode;
        const feed = new RssFeed(podcast.rss);
        feed.subscribe(async (episodes) => {
          const latestEpisodeDate = await podcast.latestEpisodeDate;
          let episode = episodes.shift();
          while (episode.released > latestEpisodeDate) {
            Episode.create({
              podcastId: podcast.id, title: episode.title,
              description: episode.description, released: episode.released
            });
            episode = episodes.shift();
          }
        })
      }
    }
  });

  podcast.associate = function(models) {
    podcast.hasMany(models.episode, {
      onDelete: 'cascade',
      hooks: true,
    });
    podcast.belongsTo(models.user);
  };

  podcast.prototype.sendEmail = async function() {
    sendPodcastEmail(this);
  }

  podcast.prototype.withdraw = async function(invoice) {
    const res = await withdraw(invoice, this.satoshis);
    if (res.success) {
      this.satoshis = this.satoshis - res.satoshis;
      await this.save();
    }
    return res;
  }

  podcast.prototype.setToken = async function() {
    this.token = Math.random().toString(36).substr(2);
  }

  podcast.search = async function({ term, offset }) {
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

  function slugify(title) {
    return title.split(" ").join("_").toLowerCase();
  }

  return podcast;
};
