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
