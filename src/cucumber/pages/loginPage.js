/* eslint-disable class-methods-use-this */
import Page from ".";

class LoginPage extends Page {
  open() {
    super.open(browser.config.baseUrl);
  }

  get usernameInput() {
    return $('input[type="email"]');
  }

  get passwordInput() {
    return $('input[type="password"]');
  }

  get submitBtn() {
    return $('form button[type="submit"]');
  }

  login(username, password) {
    this.usernameInput.addValue(username);
    this.passwordInput.addValue(password);
    this.submitBtn.click();
  }
}

export default new LoginPage();
