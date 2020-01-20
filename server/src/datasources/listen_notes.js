const unirest = require('unirest');

class ListenNotes {
  constructor() {
    this.baseURL = 'https://listen-api.listennotes.com/api/v2';
  }

  async itunesIdByRss(rssUrl) {
    const response = await unirest.post(this.baseURL + '/podcasts')
    .header('X-ListenAPI-Key', process.env.LISTEN_NOTES_KEY)
    .header('Content-Type', 'application/x-www-form-urlencoded')
    .send(`rsses=${rssUrl}`)
    const result = response.toJSON();
    if (result.body.podcasts[0]) return result.body.podcasts[0].itunes_id;
  }
}

module.exports = ListenNotes;
