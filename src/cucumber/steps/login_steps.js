import { Given, When, Then } from "@cucumber/cucumber";
import loginPage from "../pages/loginPage";
import lanternPage from "../pages/lanternPage";

Given("I am on the login page", function () {
  loginPage.open();
});

When("I login as an {string} user", function (userLevel) {
  const { username, password } = browser.config.credentials[userLevel];
  loginPage.login(username, password);
});

Then("I should see the chart title {string}", function (expectedTitle) {
  const title = lanternPage.revocationsOverTimeTitle;
  title.waitForExist();
  expect(title.getText()).toMatch(expectedTitle);
});

export {};
