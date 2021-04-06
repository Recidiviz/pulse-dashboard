import { Given } from "@cucumber/cucumber";
import loginPage from "../pages/loginPage";

Given("I am on the login page", function () {
  loginPage.open();
});
