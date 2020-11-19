import getTimeStamp from "../getTimeStamp";

describe("getTimeStamp tests", () => {
  const dateNowSpy = jest.spyOn(Date, "now");
  dateNowSpy.mockReturnValue(1605792733106);

  it("should format to proper format", () => {
    expect(getTimeStamp()).toBe("11-19-2020-01-32-13-PM");
  });
});
