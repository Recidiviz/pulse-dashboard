import { Given, When, Then } from "@cucumber/cucumber";
import { uniq } from "lodash";
import lanternPage from "../pages/lanternPage";

Given("I am on the Lantern Dashboard", function () {
  lanternPage.open();
});

Given(
  "I am a user that has {int} district restrictions",
  function (numRestrictedDistricts) {
    const restrictedAccessMock = browser.mock("**/api/US_MO/restrictedAccess");
    const restrictions = [null, "TCSTL", "13,TCSTL"][numRestrictedDistricts];
    const responseData = restrictions
      ? {
          supervision_location_restricted_access_emails: {
            allowed_level_1_supervision_location_ids: restrictions,
          },
        }
      : {};
    restrictedAccessMock.respond(responseData);
  }
);

When(
  "I select district {string} from the District Filter",
  function (districtId) {
    const { districtFilter, districtFilterMenu } = lanternPage;
    districtFilter.click();
    $(`.MultiSelect__checkbox-container=${districtId}`).click();
    districtFilter.parentElement().parentElement().click();
    districtFilterMenu.waitUntil(function () {
      return !this.isExisting();
    });
  }
);

When("I am viewing the Case Table", () => {
  const { caseTable } = lanternPage;
  caseTable.scrollIntoView();
  caseTable.waitUntil(function () {
    return this.isDisplayedInViewport();
  });
});

Then("I should only see cases from district {string}", (districtIds) => {
  const { caseTableDistrictColumns } = lanternPage;
  const columnValues = caseTableDistrictColumns.map(function (el) {
    return el.getText();
  });
  const expectedValues = districtIds.split(",").sort();
  expect(expectedValues).toEqual(expect.arrayContaining(uniq(columnValues)));
});

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
