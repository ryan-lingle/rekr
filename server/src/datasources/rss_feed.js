const Parser = require('rss-parser');
const { everyMinute } = require('./scheduler');

module.exports = class RssFeed {
  constructor(rssUrl) {
    this.url = rssUrl;
    this.rssParser = new Parser();
  }

  async toPodcast() {
    const feed = await this.rssParser.parseURL(this.url);
    const podcast = this.podcastReducer(feed);
    return this.verify(podcast);
  }

  async subscribe(callback) {
    everyMinute(async () => {
      const { items } = await this.rssParser.parseURL(this.url);
      const episodes = this.episodeReducer(items);
      callback(episodes);
    })
  }

  podcastReducer(feed) {
    return {
      title: feed.title,
      rss: this.url,
      description: feed.description,
      email: feed.itunes.owner.email,
      image: feed.itunes.image,
      website: feed.link,
      episodes: this.episodeReducer(feed.items),
    }
  }

  episodeReducer(episodes) {
    return episodes.map(e => {
      return {
        title: e.title,
        description: e.content,
        released: new Date(e.isoDate),
      }
    })
  }

  verify(podcast) {
    Object.keys(podcast).forEach(key => {
      if (key != "episodes" && typeof podcast[key] != "string") {
        podcast[key] = null;
      }
    })
    return podcast;
  }
}
