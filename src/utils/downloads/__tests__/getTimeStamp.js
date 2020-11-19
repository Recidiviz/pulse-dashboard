import getTimeStamp from "../getTimeStamp";

describe("getTimeStamp tests", () => {
  const dateNowSpy = jest.spyOn(Date, "now");
  dateNowSpy.mockReturnValue(1605792733106);

  it("sd", () => {
    expect(getTimeStamp()).toBe("11-19-2020-04-32-13-PM");
  });
});
