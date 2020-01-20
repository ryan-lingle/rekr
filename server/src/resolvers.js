const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { AuthenticationError, UserInputError, ForbiddenError } = require('apollo-server-express');
const Jwt = require("./auth/jwt")
const { pubsub } = require('./pubsub');
const { sendUserEmail, sendPodcastEmail } = require('./datasources/mailer');

module.exports = {
  User: {
    current: async(parent, _, { id }) => {
      return parent.id == id;
    },
    podcasts: async (parent, { DB }) => {
      const Podcast = DB.podcast;
      return await Podcast.findAll({ where: { userId: parent.id }, order: [['id']]});
    },
    reks: async (parent, _, { DB }) => {
      const Rek = DB.rek;
      const count = await Rek.count({ where: { userId: parent.id } });
      const stream = await Rek.findAll({ where: { userId: parent.id }, order: [['id', 'DESC']], limit: 10 });
      const more = stream.length == 10;
      return { stream, more, count };
    },
    bookmarks: async (parent, _, { DB }) => {
      const Bookmark = DB.bookmark;
      const count = await Bookmark.count({ where: { userId: parent.id } });
      const stream = await Bookmark.findAll({ where: { userId: parent.id }, order: [['id', 'DESC']], limit: 10});
      const more = stream.length == 10;
      return { stream, more, count };
    },
    rek_views: async (parent, _, { DB }) => {
      const RekView = DB.rek_view;
      return await RekView.findAll({ where: { userId: parent.id }});
    },
    followedHashtags: async (parent, _, { DB }) => {
      return await parent.getFollowedHashtags();
    },
    followedByCurrentUser: async (parent, _, { DB, id }) => {
      const UserFollow = DB.user_follow;
      let exists;
      if (id != "null") exists = await UserFollow.findOne({ where: { followerId: id, followeeId: parent.id }})
      return exists != null;
    },
    notifications: async (parent) => {
      return await parent.getNotifications();
    }
  },
  Podcast: {
    episodes: async (parent, _, { DB }) => {
      if (parent.episodes) {
        return parent.episodes;
      } else {
        const Episode = DB.episode;
        return Episode.findAll({ where: { podcastId: parent.id }, order: [['released', 'DESC']]});
      }
    }
  },
  Episode: {
    podcast: async (parent, _, { DB }) => {
      const Podcast = DB.podcast;
      return await Podcast.findByPk(parent.podcastId);
    },
    bookmarked: async (parent, _, { DB, id }) => {
      const Bookmark = DB.bookmark;
      let exists;
      if (id != "null") exists = await Bookmark.findOne({ where: { episodeId: parent.id, userId: id }})
      return exists != null;
    },
    guests: async (parent) => {
      return await parent.getGuests();
    }
  },
  Rek: {
    episode: async (parent, _, { DB }) => {
      const Episode = DB.episode;
      return await Episode.findByPk(parent.episodeId);
    },
    user: async (parent, _, { DB }) => {
      const User = DB.user;
      return await User.findByPk(parent.userId);
    },
    parents: async (parent, _, { DB }) => {
      const Rek = DB.rek;
      const rek = await Rek.findByPk(parent.id);
      return await rek.getParents();
    },
    children: async (parent, _, { DB }) => {
      const Rek = DB.rek;
      const rek = await Rek.findByPk(parent.id);
      return await rek.getChildren();
    },
    hashtags: async (parent) => {
      return await parent.getHashtags();
    },
    recipients: async (parent) => {
      return await parent.getRecipients();
    }
  },
  Recipient: {
    user: async (parent) => {
      return parent.getUser();
    },
    podcast: async (parent) => {
      return parent.getPodcast();
    },
  },
  Hashtag: {
    reks: async (parent) => {
      const reks = await parent.getReks();
      return { stream: reks }
    },
    followedByCurrentUser: async (parent, _, { DB, id }) => {
      const HashtagFollow = DB.hashtag_follow;
      let exists;
      if (id != "null") exists = await HashtagFollow.findOne({ where: { hashtagId: parent.id, followerId: id }})
      return exists != null;
    }
  },
  Bookmark: {
    episode: async (parent, _, { DB }) => {
      const Episode = DB.episode;
      return await Episode.findByPk(parent.episodeId);
    },
    user: async (parent, _, { DB }) => {
      const User = DB.user;
      return await User.findByPk(parent.userId);
    }
  },
  RekView: {
    rek: async (parent, _, { DB }) => {
      const Rek = DB.rek;
      return await Rek.findByPk(parent.rekId);
    }
  },
  HashtagFollow: {
    hashtag: async (parent, _, { DB }) => {
      const Hashtag = DB.hashtag;
      return await Hashtag.findByPk(parent.hashtagId);
    }
  },
  Notification: {
    user: async (parent, _, { DB }) => {
      const User = DB.user;
      return await User.findByPk(parent.userId);
    },
    notifier: async (parent, _, { DB }) => {
      const User = DB.user;
      return await User.findByPk(parent.notifierId);
    },
    rek: async (parent, _, { DB }) => {
      const Rek = DB.rek;
      return await Rek.findByPk(parent.rekId);
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return new Date(value);
    },
    parseLiteral(ast) {
      return parseInt(ast.value); // ast value is always in string format
    },
  }),
  Query: {
    users: async (_, { n, userId, followers, following }, { DB }) => {
      const User = DB.user;
      const user = await User.findByPk(userId);
      const offset = n ? n * 10 : 0;
      if (followers) {
        const stream = await user.getFollowers({ limit: 10, offset });
        const more = stream.length == 10;
        return { stream, more };
      }

      if (following) {
        const stream = await user.getIsFollowing({ limit: 10, offset });
        const more = stream.length == 10;
        return { stream, more };
      }
    },
    reks: async (_, { n, userId, feed, timePeriod }, { DB, id }) => {
      const offset = n ? n * 10 : 0;
      if (feed) {
        const User = DB.user;
        const user = await User.findByPk(id);
        return await user.getFeed({ timePeriod, offset });
      } else {
        const Rek = DB.rek;
        const stream = await Rek.findAll({ where: { userId }, order: [['id', 'DESC']], offset, limit: 10, });
        const more = stream.length == 10;
        return { stream, more }
      }
    },
    bookmarks: async (_, { n, userId }, { DB, id }) => {
      const Bookmark = DB.bookmark;
      const offset = n ? n * 10 : 0;
      userId = userId || id;
      const stream = await Bookmark.findAll({ where: { userId }, order: [['id', 'DESC']], offset, limit: 10, });
      const more = stream.length == 10;
      return { stream, more }
    },
    hashtag: async (_, args, { DB }) => {
      const Hashtag = DB.hashtag;
      return await Hashtag.findOne({ where: args });
    },
    hashtagFeed: async (_, { name, n, timePeriod }, { DB }) => {
      const Hashtag = DB.hashtag;
      const hashtag = await Hashtag.findOne({ where: { name } });
      const offset = n ? n * 10 : 0;
      return await hashtag.getFeed({ timePeriod, offset });
    },
    notifications: async ({ n }, { DB, id }) => {
      const User = DB.user;
      const user = await User.findByPk(id);
      const offset = n ? n * 10 : 0;
      const stream = await user.getNotifications({ limit: 10, offset, order: [['id', 'DESC']]});
      const more = stream.length == 10;
      return { stream, more };
    },
    currentUser: async (_, { DB, id }) => {
      const User = DB.user;
      return await User.findByPk(id)
    },
    user: async  (_, args, { DB }) => {
      const User = DB.user;
      args.deactivated = false;
      const user = await User.findOne({ where: args });
      return user;
    },
    episode: async (_, { id }, { DB }) => {
      const Episode = DB.episode;
      return await Episode.findByPk(id);
    },
    episodeShow: async (_, { episodeId, rekId }, { DB }) => {
      const Episode = DB.episode;
      const Rek = DB.rek;
      const rek = await Rek.findByPk(rekId);
      const episode = await Episode.findByPk(episodeId);
      return { rek, episode };
    },
    search: async (_, { term, type, n }, { DB }) => {
      const offset = n ? n * 10 : 0;
      const Model = DB[type];
      const stream = await Model.search({ term, offset });
      const more = stream.length == 10;
      const response = {};
      response[type] = { stream, more };
      return response;
    },
    podcast: async (_, args, { DB }) => {
      const Podcast = DB.podcast;
      return await Podcast.findOne({ where: args })
    }
  },
  Mutation: {
    parsePodcast: async ({ rssUrl }, { dataSources, id }) => {
      const { RssFeed } = dataSources;
      const feed = new RssFeed(rssUrl);
      return await feed.toPodcast()
    },
    deposit: async ({ satoshis }, { dataSources, id, DB }) => {
      const user = await DB.user.findByPk(id);
      const { getInvoice } = dataSources.Lightning;
      const invoice = await getInvoice(satoshis, async (invoice) => {
        user.satoshis += satoshis;
        await user.save();
        pubsub.publish('INVOICE_PAID', { userId: user.id, invoice })
      });
      return { invoice, satoshis }
    },
    withdraw: async ({ invoice, podcastId }, { dataSources, id, DB }) => {
      if (podcastId) {
        const podcast = await DB.podcast.findByPk(podcastId);
        if (podcast.userId != id) throw new ForbiddenError("NOT_AUTHORIZED");
        return await podcast.withdraw(invoice);
      } else {
        const user = await DB.user.findByPk(id);
        return await user.withdraw(invoice);
      }
    },
    toggleFollow: async ({ type, ...args}, { DB, id }) => {
      const Model = DB[`${type}_follow`];
      args.followerId = id;

      const exists = await Model.findOne({ where: args})
      if (exists == null) {
        await Model.create(args);
        return true;
      } else {
        await Model.destroy({ where: args, individualHooks: true });
        return false;
      }
    },
    createRek: async ({ episodeId, tags, walletSatoshis = 0, invoiceSatoshis = 0 }, { DB, dataSources, id }) => {
      const Rek = DB.rek;
      const User = DB.user;
      const { getInvoice } = dataSources.Lightning;
      const user = await User.findByPk(id);

      const rek = Rek.build({
        episodeId,
        userId: id,
      });
      await rek.validateTags(tags);

      let invoice;
      if (invoiceSatoshis > 0) {
        rek.satoshis = invoiceSatoshis + walletSatoshis;
        await rek.validate();
        invoice = await getInvoice(invoiceSatoshis, async (invoice) => {
          user.satoshis = user.satoshis - walletSatoshis;
          await user.save();

          rek.invoice = invoice;
          await rek.save();
          await rek.addTags(tags);

          pubsub.publish('INVOICE_PAID', { userId: id, rekId: rek.id, invoice })
        });
      } else {
        user.satoshis = user.satoshis - walletSatoshis;
        await user.save();

        rek.satoshis = walletSatoshis;
        await rek.save();
        await rek.addTags(tags);
      }

      return { invoice, satoshis: invoiceSatoshis, rekId: rek.id }
    },
    createRekView: async ({ rekId }, { DB, id }) => {
      const RekView = DB.rek_view;
      const rek_view = await RekView.findOrCreate({ where: { rekId, userId: id } })
      return rek_view[0];
    },
    updateUser: async (args, { DB, id, dataSources }) => {
      const User = DB.user;
      if (args.profilePic) {
        const { uploadFile } = dataSources.Images;
        const { createReadStream } = await args.profilePic;
        const stream = createReadStream();
        const { Location } = await uploadFile(stream);
        args.profilePic = Location;
      }
      const user = await User.findByPk(id);
      Object.keys(args).forEach(key => user[key] = args[key])
      await user.save();
      return user;
    },
    createUser: async (_, { email, username, password, passwordCopy, rekId }, { DB }) => {
      if (password !== passwordCopy) throw new UserInputError('Passwords do not match.');

      const User = DB.user;
      const RekView = DB.rek_view;

      const user = await User.create({ email, username, password });

      if (rekId) RekView.findOrCreate({ where: { rekId, userId: user.id } });

      const id = user.id;
      const hasPodcast = await user.hasPodcast;
      const token = Jwt.sign(id.toString());
      return { id, token, hasPodcast,
        username: user.username,
        profilePic: user.profilePic,
        email: user.email
      }
    },
    logIn: async (_, { username, password }, { DB }) => {
      const User = DB.user;
      const user = await User.findOne({ where: { username }});
      if (!user) {
        throw new UserInputError('Invalid Username or Password.');
      } else if (!await user.validPassword(password)) {
        throw new UserInputError('Invalid Username or Password.');
      } else {
        const id = user.id;
        const hasPodcast = await user.hasPodcast;
        const token = Jwt.sign(id.toString());
        return {
          id, token, hasPodcast,
          username: user.username,
          profilePic: user.profilePic,
          email: user.email
        }
      }
    },
    deleteUser: async (_, { DB, id }) => {
      const User = DB.user;
      const user = await User.findByPk(id);
      await user.deactivate();
      return true;
    },
    createPodcast: async ({ title,rss,description,email,website,image }, { dataSources, DB }) => {
      const { ListenNotes, RssFeed } = dataSources;
      const Podcast = DB.podcast;
      const Episode = DB.episode;

      const itunesId = await ListenNotes.itunesIdByRss(rss) || null;
      if (!itunesId) throw new UserInputError('This does not seem to be a Itunes verified RSS Feed.');
      const podcasts = await Podcast.findOrCreate({ where: {
        title, description, rss, email,
        website, image, itunesId
      }});
      podcasts[0].sendEmail();
      return podcasts[0];
    },
    createEpisodes: async ({ episodes, podcastId }, { DB }) => {
      const Episode = DB.episode;
      episodes = await Promise.all(episodes.map(async episode => {
        return await Episode.create({
          podcastId: podcastId, title: episode.title,
          description: episode.description, released: episode.released
        })
      }));
      return episodes.flat();
    },
    createBookmark: async ({ episodeId, rekId }, { DB, id }) => {

      const Bookmark = DB.bookmark;
      const bookmark = await Bookmark.create({ episodeId, userId: id })
      if (rekId) {
        const Notification = DB.notification;
        const Rek = DB.rek;
        const rek = await Rek.findByPk(rekId);
        Notification.create({ userId: rek.userId, rekId: rek.id, notifierId: id, type: "bookmark" });
      }
      return { bookmarkExists: true, bookmark }
    },
    destroyBookmark: async ({ episodeId }, { DB, id }) => {
      const Bookmark = DB.bookmark;
      await Bookmark.destroy({ where: { episodeId, userId: id }})
      return { bookmarkExists: false }
    },
    confirmEmail: async (_, { token }, { id, DB }) => {
      const User = DB.user;
      const Podcast = DB.podcast;

      const podcast = await Podcast.findOne({ where: { token }});

      if (podcast) {
        if (id != "null") {
          const user = await User.findByPk(id);
          podcast.userId = user.id;
          podcast.emailVerified = true;
          podcast.setToken();
          await podcast.save();
          return { podcast, loggedIn: true  };
        } else {
          return { podcast, loggedIn: false }
        }
      }

      const user = await User.findOne({ where: { token }});
      if (user) {
        user.emailVerified = true;
        await user.save();
        return { user, loggedIn: true };
      }
    },
    resendUserEmail: async (_, __, { id, DB }) => {
      const User = DB.user;
      const user = await User.findByPk(id);
      if (user) {
        await sendUserEmail(user);
        return true;
      } else {
        throw new AuthenticationError("NOT_AUTHENTICATED");
      }
    },
    resendPodcastEmail: async (_, { podcastId }, { DB }) => {
      const Podcast = DB.podcast;
      const podcast = await Podcast.findByPk(podcastId);
      await sendPodcastEmail(podcast);
      return true
    },
    twitterToken: async (_, __, { dataSources: { Twitter } }) => {
      const twitter = new Twitter();
      return await twitter.requestToken();
    },
    twitterAccessToken: async (_, args, { dataSources: { Twitter }, id }) => {
      const twitter = new Twitter();
      return await twitter.accessToken({ ...args, id });
    },
    guestShare: async ({ percentage, podcastId }, { DB, id }) => {
      const Podcast = DB.podcast;
      const podcast = await Podcast.findByPk(podcastId);
      if (podcast.userId != id) throw new ForbiddenError("NOT_AUTHORIZED");
      podcast.guestShare = percentage;
      await podcast.save();
      return true;
    },
    tagGuest: async ({ userIds, episodeIds, podcastId }, { DB, id }) => {
      const GuestTag = DB.guest_tag;
      const Podcast = DB.podcast;
      const podcast = await Podcast.findByPk(podcastId);
      if (podcast.userId != id) throw new ForbiddenError("NOT_AUTHORIZED");
      if (episodeIds.length === 1) {
        await GuestTag.destroy({ where: { episodeId: episodeIds[0] }})
      }
      userIds.map(userId => {
        episodeIds.map(episodeId => {
          GuestTag.create({ userId, episodeId });
        })
      })
      return true;
    },
    resetPasswordRequest: async (_, { email }, { DB }) => {
      const User = DB.user;
      const user = await User.findOne({ where: { email }});
      if (!user) throw new UserInputError('No User with that Email.');
      await user.passwordResetRequest();
      return email;
    },
    resetPassword: async (_, { token, password, passwordCopy }, { DB }) => {
      if (password !== passwordCopy) throw new UserInputError('Passwords do not match.');
      const User = DB.user;
      const user = await User.findOne({ where: { passwordToken: token }});
      if (!user) throw new UserInputError('Invalid Link');
      await user.resetPassword(password);
      return true;
    }
  },
  Subscription: {
    invoicePaid: {
      resolve: (invoicePaid) => {
        return invoicePaid;
      },
      subscribe: () => pubsub.asyncIterator(["INVOICE_PAID"]),
    },
    hashtags: {
      resolve: (hashtagFollow) => {
        return hashtagFollow;
      },
      subscribe: () => pubsub.asyncIterator(["HASHTAGS"]),
    }
  }
}
