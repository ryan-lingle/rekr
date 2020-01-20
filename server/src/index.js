require('dotenv').config()
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const typeDefs = require('./schema');

const DB = require('./models');
const resolvers = require('./resolvers');

const ItunesApi = require('./datasources/itunes');
const RssFeed = require('./datasources/rss_feed');
const ListenNotes = require('./datasources/listen_notes');
const Lightning = require('./datasources/lnd');
const Images = require('./datasources/images');
const Twitter = require('./datasources/twitter');
const { AuthenticationDirective, AuthorizationDirective } = require('./auth/auth_directive');
const Jwt = require("./auth/jwt");
const { adminController } = require("./admin");

// start asynchronous jobs
const { rssUpdater, valueGeneratedUpdater } = require('./jobs');
rssUpdater();
valueGeneratedUpdater();

const app = express();

// initialize some admin routes (don't forget to setup auth)
adminController(app);

const server = new ApolloServer({
  context: async ({ req, connection }) => {
    if (connection) {
      const { token, id } = connection.context;
      if (!Jwt.verify(token, id)) {
        throw new AuthenticationError("NOT_AUTHENTICATED")
      }
      return { ...connection.context, DB }
    } else {
      const { token, id } = req.headers;
      return { DB, token, id };
    }
  },
  typeDefs,
  resolvers,
  schemaDirectives: {
    authenticate: AuthenticationDirective,
    authorize: AuthorizationDirective
  },
  dataSources: () => ({
    RssFeed,
    Lightning,
    Images,
    Twitter,
    Itunes: new ItunesApi(),
    ListenNotes: new ListenNotes(),
  })
});

server.applyMiddleware({
  app
});

const httpServer = createServer(app);

server.installSubscriptionHandlers(httpServer);

httpServer.listen(process.env.PORT);
