/* eslint-disable class-methods-use-this */
import Page from ".";

class ProfilePage extends Page {
  open() {
    super.open(`${browser.config.baseUrl}/profile`);
  }

  get promptText() {
    return $(".Profile__prompt");
  }

  get stateSelector() {
    return $(".StateSelector");
  }

  get viewDashboardBtn() {
    return $(".Profile__submit");
  }

  selectStateOption(stateName) {
    this.stateSelector.click();
    browser.pause(1000);
    const option = $(`div=${stateName}`);
    option.click();
    this.viewDashboardBtn.click();
  }
}

export default new ProfilePage({ redirectPause: 2000 });
