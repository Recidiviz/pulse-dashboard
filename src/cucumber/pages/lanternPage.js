/* eslint-disable class-methods-use-this */
import Page from ".";

class LanternPage extends Page {
  open() {
    super.open(`${browser.config.baseUrl}/community/revocations`);
  }

  get userMenu() {
    return $(".TopBarUserMenuForAuthenticatedUser");
  }

  get profileLink() {
    return $(".TopBarUserMenuForAuthenticatedUser__profile-link");
  }

  get lanternLayout() {
    return $(".LanternLayout");
  }

  get revocationsOverTimeTitle() {
    return $(".RevocationsOverTime h4.RevocationsByDimension__title");
  }

  navigateToProfile() {
    this.userMenu.click();
    this.profileLink.waitForClickable();
    this.profileLink.click();
    browser.pause(this.redirectPause);
  }
}

export default new LanternPage({ redirectPause: 4000 });
