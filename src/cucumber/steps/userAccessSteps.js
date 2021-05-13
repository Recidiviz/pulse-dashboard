// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================
import { Given, When, Then } from "@cucumber/cucumber";
import { uniq } from "lodash";
import lanternPage from "../pages/lanternPage";

Given("I am on the Lantern Dashboard", function () {
  lanternPage.open();
});

Given(
  "I am a user that has {int} district restrictions",
  function (numRestrictedDistricts) {
    const demoUserMock = browser.mock("**/api/demoUser");
    const restrictions = [null, ["TCSTL"], ["13", "TCSTL"]][
      numRestrictedDistricts
    ];
    const demoUser = {
      name: "demo",
      email: "demo",
      [`${process.env.METADATA_NAMESPACE}app_metadata`]: {
        state_code: "US_MO",
        allowed_supervision_location_ids: restrictions,
        allowed_supervision_location_level: "level_1_supervision_location",
      },
    };
    demoUserMock.respond(demoUser);
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

Then(
  "I should see {string} selected in the district filter",
  function (districtId) {
    const { districtFilter } = lanternPage;
    districtFilter.waitForExist();
    expect(districtFilter.getText()).toMatch(districtId);
  }
);

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
