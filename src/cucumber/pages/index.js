// https://webdriver.io/docs/pageobjects/
export default class Page {
  constructor({ redirectPause = 2000 }) {
    this.redirectPause = redirectPause;
  }

  open(path) {
    browser.url(path);
    browser.pause(this.redirectPause);
  }
}
