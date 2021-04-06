// https://webdriver.io/docs/pageobjects/
/* eslint-disable class-methods-use-this */
export default class Page {
  open(path) {
    browser.url(path);
    browser.pause(2000);
  }
}
