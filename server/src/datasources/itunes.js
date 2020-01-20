const { RESTDataSource } = require('apollo-datasource-rest');

module.exports = class ItunesApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://itunes.apple.com';
  }


  async getPodcastById({ podcastId }) {
    const response = await this.get(`lookup?id=${podcastId}`);
    return response;
  }

  async search({ term }) {
    const txt = await this.get(`search?term=${term}&media=podcast&entity=podcast`);
    const response = JSON.parse(txt)
    return response
      ? response.results.map(result => this.resultReducer(result))
      : [];
  }

  resultReducer(result) {
    console.log(result)
  }
}
