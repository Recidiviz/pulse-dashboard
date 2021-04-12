import { Before } from "@cucumber/cucumber";
import loginPage from "../../pages/loginPage";

Before({ tags: "@login-admin" }, () => {
  const { username, password } = browser.config.credentials.admin;
  loginPage.open();
  loginPage.login(username, password);
});
