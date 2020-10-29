const mockIntercomAppId = "some app id";
process.env.REACT_APP_INTERCOM_APP_ID = mockIntercomAppId;
const initIntercomSettings = require("../initIntercomSettings").default;

describe("initIntercomSettings tests", () => {
  const intercom = jest.fn();
  window.Intercom = intercom;

  it("should set intercom app id and boot hidden intercom with settings", () => {
    initIntercomSettings();

    expect(window.intercomSettings.app_id).toBe(mockIntercomAppId);
    expect(intercom).toHaveBeenCalledWith("boot", {
      app_id: mockIntercomAppId,
      hide_default_launcher: true,
    });
  });
});
