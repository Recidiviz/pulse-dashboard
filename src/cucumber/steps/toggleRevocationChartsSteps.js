import { Given, When, Then } from "@cucumber/cucumber";
import lanternPage from "../pages/lanternPage";

Given("I am viewing the District chart", () => {
  const chart = lanternPage.districtChartCanvas;
  chart.waitForExist();
  expect(chart.isExisting()).toEqual(true);
});

When("I click on the {string} revocations link", (linkText) => {
  const link = lanternPage.getRevocationsLink(linkText);
  link.click();
});

Then("I should see the Officer chart", () => {
  const chart = lanternPage.officerChartCanvas;
  chart.waitForExist();
  expect(chart.isExisting()).toEqual(true);
});

Then("I should see the Risk level chart", () => {
  const chart = lanternPage.riskLevelChartCanvas;
  chart.waitForExist();
  expect(chart.isExisting()).toEqual(true);
});
