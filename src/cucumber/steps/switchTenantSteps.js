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
import { Then, When } from "@cucumber/cucumber";

import lanternPage from "../pages/lanternPage";
import profilePage from "../pages/profilePage";

When("I click on the profile link", () => {
  lanternPage.navigateToProfile();
});

Then("I should see the Profile page", () => {
  const prompt = profilePage.promptText;
  expect(prompt.getText()).toEqual("Current view state:");
});

When("I am on the Profile page", () => {
  profilePage.open();
});

When("I select the state {string}", (stateName) => {
  profilePage.selectStateOption(stateName);
});

Then("I should see the Pennsylvania dashboard", () => {
  const title = lanternPage.revocationsOverTimeTitle;
  title.waitForExist();
  expect(title.getText()).toMatch("Number of recommitments from parole");
});
