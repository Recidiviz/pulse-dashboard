import { When, Then } from "@cucumber/cucumber";
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
