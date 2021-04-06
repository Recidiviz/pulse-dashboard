import { When } from "@cucumber/cucumber";
import loginPage from "../pages/loginPage";

When("I login as an {string} user", function (userLevel) {
  const { username, password } = browser.config[userLevel];
  loginPage.login(username, password);
  browser.pause(2000);
});
