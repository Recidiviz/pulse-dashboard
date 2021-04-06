import { Then } from "@cucumber/cucumber";
import lanternPage from "../pages/lanternPage";

Then("I should see the chart title {string}", function (expectedTitle) {
  const title = lanternPage.revocationsOverTimeTitle;
  title.waitForExist();
  expect(title.getText()).toMatch(expectedTitle);
});
