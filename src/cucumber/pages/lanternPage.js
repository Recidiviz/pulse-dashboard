/* eslint-disable class-methods-use-this */
import Page from ".";

class LanternPage extends Page {
  open() {
    super.open(`${browser.config.baseUrl}/community/revocations`);
  }

  get lanternLayout() {
    return $(".LanternLayout");
  }

  get revocationsOverTimeTitle() {
    return $(".RevocationsOverTime h4.RevocationsByDimension__title");
  }

  get districtChartCanvas() {
    return $("canvas#admissionsByDistrict");
  }

  get officerChartCanvas() {
    return $("canvas#admissionsByOfficer");
  }

  get riskLevelChartCanvas() {
    return $("canvas#admissionsByRiskLevel");
  }

  get districtFilter() {
    return $(".FilterField.DistrictFilter");
  }

  get disabledDistrictFilter() {
    return $(".DistrictFilter .Select--is-disabled");
  }

  get districtFilterMenu() {
    return $(".MultiSelect__menu-list");
  }

  getDistrictChartWrapperByDistrictIds(districtIds) {
    return $(
      `.RevocationsByDimension--admissionsByDistrict--${districtIds.join("-")}`
    );
  }

  getRevocationsLink(linkText) {
    return $(`button*=${linkText}`);
  }

  navigateToProfile() {
    this.userMenu.click();
    this.profileLink.waitForClickable();
    this.profileLink.click();
    browser.pause(this.redirectPause);
  }
}

export default new LanternPage({ redirectPause: 1000 });
