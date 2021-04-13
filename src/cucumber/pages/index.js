// https://webdriver.io/docs/pageobjects/
/* eslint-disable class-methods-use-this */
export default class Page {
  constructor({ redirectPause = 2000 }) {
    this.redirectPause = redirectPause;
  }

  open(path) {
    browser.url(path);
    browser.pause(this.redirectPause);
  }

  get userMenu() {
    return $(".TopBarUserMenuForAuthenticatedUser");
  }

  get profileLink() {
    return $(".TopBarUserMenuForAuthenticatedUser__profile-link");
  }
}
