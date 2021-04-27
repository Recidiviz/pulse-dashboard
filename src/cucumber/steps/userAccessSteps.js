import { Given, When, Then } from "@cucumber/cucumber";
import lanternPage from "../pages/lanternPage";

Given("I am on the Lantern Dashboard", function () {
  lanternPage.open();
});

When(
  "I select district {string} from the District Filter",
  function (districtId) {
    const { districtFilter } = lanternPage;
    districtFilter.click();
    $(`.MultiSelect__checkbox-container=${districtId}`).click();
    districtFilter.click();
  }
);

Then("I should see {string} selected in the filter", function (districtId) {
  const { districtFilter } = lanternPage;
  districtFilter.waitForExist();
  expect(districtFilter.getText()).toMatch(districtId);
});

Then("I should not be able to change the selected district", function () {
  const { disabledDistrictFilter } = lanternPage;
  disabledDistrictFilter.waitForExist();

  expect(disabledDistrictFilter.isExisting()).toEqual(true);
});

Then(
  "I should see district {string} highlighted on the chart",
  function (districtIds) {
    const chartWrapper = lanternPage.getDistrictChartWrapperByDistrictIds(
      districtIds.split(",")
    );
    expect(chartWrapper.isExisting()).toEqual(true);
  }
);
