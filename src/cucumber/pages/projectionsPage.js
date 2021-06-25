/* eslint-disable class-methods-use-this */
import Page from ".";

class ProjectionsPage extends Page {
  open() {
    super.open(`${browser.config.baseUrl}/community/projections`);
  }

  get viewSelector() {
    return $(".CoreSectionSelector");
  }

  selectView(view) {
    this.viewSelector.click();
    const option = $(`button.CoreSectionSelector__item=${view}`);
    option.waitForClickable();
    option.click();
  }

  get projectionsChartHeader() {
    return $(".PopulationTimeSeriesChart__Header");
  }
}

export default new ProjectionsPage({ redirectPause: 1000 });
