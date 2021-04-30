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
import loginPage from "../pages/loginPage";
import lanternPage from "../pages/lanternPage";

Given("I am on the login page", function () {
  loginPage.open();
});

Given("I am logged in as a {string} user", function (userLevel) {
  const { username, password } = browser.config.credentials[userLevel];
  loginPage.open();
  loginPage.login(username, password);
});

When("I login as an {string} user", function (userLevel) {
  const { username, password } = browser.config.credentials[userLevel];
  loginPage.login(username, password);
});

Then("I should see the Lantern landing page", function () {
  const layout = lanternPage.lanternLayout;
  layout.waitForExist();
  expect(layout.isExisting()).toEqual(true);
});
