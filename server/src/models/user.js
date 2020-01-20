'use strict';
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const { sendUserEmail, sendPasswordEmail } = require("../datasources/mailer");
const { withdraw } = require('../datasources/lnd');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,

        async isUnique(email) {
          const _user = await user.findOne({ where: { email } });
          if (_user) {
            throw new Error('email is taken');
          }
        },
      }
    },
    emailVerified: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      validate: {
        async isPresent(username) {
          if (!username) {
            throw new Error("username is not present")
          }
        },

        async isUnique(username) {
          const _user = await user.findOne({where: { username }});
          if (_user) {
            throw new Error('username is taken');
          }
        },

        async lessThan20Characters(username) {
          if (username.length > 20) {
            throw new Error('username cannot be greater than 20 characters')
          }
        },

        async whiteListCharacter(username) {
          const whitelisted = "qwertyuiopasdfghjklzxcvbnm_1234567890$"
          username.split('').forEach(s => {
            if (!whitelisted.includes(s.toLowerCase())) {
              throw new Error(`username cannot contain ${s}`)
            }
          })
        }
      }
    },
    paymentMethod: DataTypes.STRING,
    walletPermission: DataTypes.BOOLEAN,
    satoshis: {
      type: DataTypes.INTEGER,
      validate: {
        async isPositive(satoshis) {
          if ((satoshis) < 0) {
            throw new Error('Not enough funds.')
          }
        }
      }
    },
    bio: {
      type: DataTypes.TEXT,
      validate: {
        async lessThan60Characters(bio) {
          if (bio.length > 150) {
            throw new Error('bio cannot be greater than 60 characters')
          }
        }
      }
    },
    password: DataTypes.STRING,
    profilePic: DataTypes.STRING,
    twitterId: DataTypes.STRING,
    twitterKey: DataTypes.STRING,
    twitterSecret: DataTypes.STRING,
    canTweet: DataTypes.BOOLEAN,
    passwordToken: DataTypes.STRING,
    deactivated: DataTypes.BOOLEAN,
  }, {
    getterMethods: {
      followers: async function() {
        const UserFollow = sequelize.models.user_follow;
        const count = UserFollow.count({ where: { followeeId: this.id }})
        const stream = await this.getFollowers({ limit: 10 });
        const more = stream.length == 10;
        return { stream, more, count };
      },
      following: async function() {
        const UserFollow = sequelize.models.user_follow;
        const count = UserFollow.count({ where: { followerId: this.id }})
        const stream = await this.getIsFollowing({ limit: 10 });
        const more = stream.length == 10;
        return { stream, more, count };
      },
      viewedReks: async function() {
        return await this.getRek_views();
      },
      hasPodcast: async function() {
        const podcasts = await this.getPodcasts();
        return podcasts.length > 0;
      }
    },
    hooks: {
      beforeCreate: async function(user) {
        // encrypt password
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        };

        // sample profile pic
        if (!user.profilePic) user.profilePic = randomProfilePic();

        // generate random token
        user.token = Math.random().toString(36).substr(2);

        // send confirmation email
        if (user.email) sendUserEmail(user);
      },
      beforeDestroy: async function(user) {
        const Podcast = sequelize.models.podcast;
        const Rek = sequelize.models.rek;
        await Podcast.destroy({ where: { userId: user.id }, individualHooks: true })
        await Rek.destroy({ where: { userId: user.id }, individualHooks: true })
      }
    }
  });
  user.associate = function(models) {
    user.hasMany(models.podcast);
    user.hasMany(models.rek);
    user.hasMany(models.bookmark);
    user.hasMany(models.rek_view);
    user.hasMany(models.notification);
    user.belongsToMany(user, {
      through: models.user_follow,
      as: 'followers',
      foreignKey: 'followeeId',
    });

    user.belongsToMany(user, {
      through: models.user_follow,
      as: 'isFollowing',
      foreignKey: 'followerId',
    });

    user.belongsToMany(models.hashtag, {
      through: models.hashtag_follow,
      as: 'followedHashtags',
      foreignKey: 'followerId',
    });

    user.belongsToMany(models.episode, {
      through: models.guest_tag,
      as: 'guestAppearances',
      foreignKey: 'userId',
    });
  };

  user.prototype.getFeed = async function({ timePeriod, offset }) {
    const Rek = sequelize.models.rek;
    const RekView = sequelize.models.rek_view;
    const { Op } = Sequelize;

    const viewedReks = await this.viewedReks;
    const viewedRekIds = viewedReks.map(view => view.rekId);

    const _f_ = await this.followers;
    const aFollowerId = _f_.stream[0] ? _f_.stream[0].id : 1;

    const stream = await sequelize.query(`
      SELECT reks.id, reks."episodeId", reks."userId", reks."centuryValueGenerated", reks."monthValueGenerated", reks."weekValueGenerated", reks.satoshis FROM reks
      INNER JOIN user_follows ON reks."userId" = user_follows."followeeId"
      WHERE user_follows."followerId" = ${this.id}
      OR reks."userId" = ${this.id} AND user_follows."followerId" = ${aFollowerId}
      ORDER BY reks."${timePeriod}ValueGenerated" DESC
      OFFSET ${offset}
      LIMIT 10;
    `, { model: Rek });

    /*
      code to sort by viewed/not viewed:
        CASE WHEN reks.id NOT IN (${viewedRekIds.join(",") || 0}) THEN 0 ELSE 1 END,
    */

    const len = stream.length;
    const more = len == 10;
    return { stream, more }
  }

  user.prototype.follow = async function(followeeId) {
    const UserFollow = sequelize.models.user_follow;
    return await UserFollow.create({ followerId: this.id, followeeId })
  }

  user.prototype.unfollow = async function(followeeId) {
    const UserFollow = sequelize.models.user_follow;
    return await UserFollow.desroy({ where: { followerId: this.id, followeeId }})
  }

  user.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }

  user.prototype.resetPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
    return await this.save();
  }

  user.prototype.passwordResetRequest = async function() {
    const token = Math.random().toString(36).substr(2);
    this.passwordToken = token;
    await this.save();
    await sendPasswordEmail({
      username: this.username,
      email: this.email,
      token
    });
  }

  user.prototype.withdraw = async function(invoice) {
    const res = await withdraw(invoice, this.satoshis);
    if (res.success) {
      this.satoshis = this.satoshis - res.satoshis;
      await this.save();
    }
    return res;
  }

  user.prototype.deactivate = async function() {
    const Rek = sequelize.models.rek;
    const Bookmark = sequelize.models.bookmark;
    const RekView = sequelize.models.rek_view;
    const Notfication = sequelize.models.notification;
    const UserFollow = sequelize.models.user_follow;
    const HashtagFollow = sequelize.models.hashtag_follow;
    const GuestTag = sequelize.models.guest_tag;

    const podcasts = await this.getPodcasts();
    podcasts.forEach(podcast => {
      podcast.userId = null;
      podcast.save();
    })

    await Bookmark.destroy({ where: { userId: this.id }});
    await RekView.destroy({ where: { userId: this.id }});
    await Bookmark.destroy({ where: { userId: this.id }});
    await UserFollow.destroy({ where: { followeeId: this.id }});
    await UserFollow.destroy({ where: { followerId: this.id }});
    await HashtagFollow.destroy({ where: { followerId: this.id }});
    await GuestTag.destroy({ where: { userId: this.id }});

    this.deactivated = true;
    await this.save();
  }

  user.search = async function({ term, offset }) {
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

  function randomProfilePic() {
    const num = Math.floor((Math.random() * 4) + .99);
    return `https://rekr-profile-pics.sfo2.digitaloceanspaces.com/default-${num}.png`;
  }

  return user;
};
