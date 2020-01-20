const { gql } = require('apollo-server-express');

const typeDefs = gql`
  directive @authenticate on FIELD_DEFINITION
  directive @authorize on FIELD_DEFINITION

  scalar Date

  type UserStream {
    more: Boolean
    stream: [User]
    count: Int!
  }

  type RekStream {
    more: Boolean
    stream: [Rek]
    count: Int!
  }

  type BookmarkStream {
    more: Boolean
    stream: [Bookmark]
    count: Int!
  }

  type EpisodeStream {
    more: Boolean
    stream: [Episode]
    count: Int!
  }

  type PodcastStream {
    more: Boolean
    stream: [Podcast]
    count: Int!
  }

  type HashtagStream {
    more: Boolean
    stream: [Hashtag]
    count: Int!
  }

  type NotificationStream {
    more: Boolean
    stream: [Notification]
    count: Int!
  }

  type User {
    id: ID!
    current: Boolean!
    satoshis: Int @authorize
    username: String!
    email: String @authorize
    emailVerified: Boolean @authorize
    password: String @authorize
    profilePic: String
    podcasts: [Podcast] @authorize
    reks: RekStream!
    bookmarks: BookmarkStream!
    followers: UserStream!
    following: UserStream!
    notifications: [Notification] @authorize
    rek_views: [RekView] @authorize
    followedHashtags: [Hashtag]
    followedByCurrentUser: Boolean!
    canTweet: Boolean @authorize
    bio: String
  }

  type Episode {
    id: ID
    podcast: Podcast
    title: String
    description: String
    bookmarked: Boolean
    released: Date
    donationSum: Int
    guests: [User]
  }

  type Podcast {
    id: ID
    title: String
    satoshis: Int!
    rss: String
    description: String
    email: String
    emailVerified: Boolean!
    website: String
    image: String
    itunesId: Int
    slug: String
    episodes: [Episode]
    latestEpisodeDate: Date
    donationSum: Int
    donationCount: Int
    guestShare: Float! @authorize
  }

  type Rek {
    id: ID
    user: User!
    parents: [Rek]
    children: [Rek]
    episode: Episode!
    satoshis: Int!
    invoice: String
    centuryValueGenerated: Int!
    monthValueGenerated: Int!
    weekValueGenerated: Int!
    hashtags: [Hashtag]
    recipients: [Recipient]
    fee: Int
  }

  type Recipient {
    user: User
    podcast: Podcast
    satoshis: Int!
    reason: String!
  }

  type EmailVerification {
    user: User
    podcast: Podcast
    loggedIn: Boolean
  }

  type Hashtag {
    id: ID
    name: String!
    reks: RekStream!
    followers: Int!
    followedByCurrentUser: Boolean!
  }

  type RekView {
    id: Int!
    user: User!
    rek: Rek!
  }

  type Bookmark {
    id: Int!
    user: User!
    episode: Episode!
  }

  type Notification {
    id: ID
    user: User!
    notifier: User!
    rek: Rek
    type: String!
    satoshis: Int
  }

  type BookmarkResponse {
    bookmarkExists: Boolean!
    bookmark: Bookmark
  }

  type InvoiceResponse {
    invoice: String!
    satoshis: Int!
    invoiceId: String!
  }

  type LogInResponse {
    id: ID!
    token: String!
    username: String!
    profilePic: String!
    email: String
    hasPodcast: Boolean!
  }

  input EpisodeInput {
    title: String!
    description: String!
    released: String!
  }

  input TagInput {
    name: String!
  }

  type Invoice {
    satoshis: Int
    invoice: String
    rekId: Int
  }

  type InvoicePaid {
    userId: Int!
    invoice: String!
    rekId: Int
  }

  type SearchResults {
    episode: EpisodeStream
    podcast: PodcastStream
    user: UserStream
    hashtag: HashtagStream
  }

  type WithdrawResponse {
    satoshis: Int!
    success: Boolean!
    error: String
  }

  type TwitterResponse {
    id: Int!
    signIn: Boolean!
    token: String
    username: String
    profilePic: String
    email: String
    hasPodcast: Boolean
  }

  type EpisodeShow {
    rek: Rek
    episode: Episode!
  }

  type HashtagFollow {
    hashtag: Hashtag!
    user: User!
    follow: Boolean!
  }

  type Subscription {
    invoicePaid(invoice: String!): InvoicePaid!
    hashtags: HashtagFollow!
  }

  type Query {
    currentUser: User! @authenticate
    user(username: String!): User!
    episode(id: String!): Episode!
    episodeShow(episodeId: String!, rekId: String): EpisodeShow!
    search(term: String!, type: String!, n: Int): SearchResults
    reks(n: Int!, userId: String, feed: Boolean, timePeriod: String): RekStream!
    users(n: Int!, userId: String, followers: Boolean, following: Boolean): UserStream!
    bookmarks(n: Int!, userId: String): BookmarkStream!
    podcast(slug: String, id: String, token: String): Podcast!
    hashtag(name: String): Hashtag!
    hashtagFeed(name: String, n: Int!, timePeriod: String!): RekStream!
    notifications(n: Int!): NotificationStream! @authenticate
  }

  type Mutation {
    parsePodcast(rssUrl: String!): Podcast! @authenticate
    deposit(satoshis: Int!): Invoice! @authenticate
    withdraw(invoice: String!, podcastId: String): WithdrawResponse! @authenticate
    toggleFollow(followeeId: String, hashtagId: String, type: String): Boolean! @authenticate
    createRekView(rekId: Int!): RekView! @authenticate
    createBookmark(episodeId: String!, rekId: String): BookmarkResponse! @authenticate
    destroyBookmark(episodeId: String!, rekId: String): BookmarkResponse! @authenticate
    createRek(episodeId: String!, tags: [TagInput], walletSatoshis: Int, invoiceSatoshis: Int): Invoice! @authenticate
    createPodcast(title: String, rss: String, description: String, email: String, website: String, image: String): Podcast! @authenticate
    createEpisodes(episodes: [EpisodeInput], podcastId: String!): [Episode] @authenticate
    createUser(email: String!, username: String!, password: String!, passwordCopy: String!, rekId: String): LogInResponse!
    updateUser(email: String, username: String, password: String, profilePic: Upload, bio: String): User! @authenticate
    deleteUser: Boolean! @authenticate
    logIn(username: String!, password: String!): LogInResponse!
    confirmEmail(token: String!): EmailVerification!
    resendUserEmail: Boolean!
    resendPodcastEmail(podcastId: String!): Boolean!
    twitterToken: String!
    twitterAccessToken(requestToken: String!, oathVerifier: String!): TwitterResponse!
    guestShare(percentage: Float!, podcastId: String!): Boolean! @authenticate
    tagGuest(userIds: [String!], episodeIds: [String!], podcastId: String!): Boolean! @authenticate
    resetPasswordRequest(email: String!): String!
    resetPassword(token: String!, password: String!, passwordCopy: String!): Boolean!
  }
`;

module.exports = typeDefs;
