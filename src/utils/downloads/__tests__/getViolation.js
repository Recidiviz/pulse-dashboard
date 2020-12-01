import getViolation from "../getViolation";

describe("getViolation tests", () => {
  it("should return empty string if no reportedViolations, violationType provided", () => {
    expect(getViolation({})).toBe("");
  });

  it("should return violations number and type", () => {
    const mockReportedViolations = "3";
    const mockViolationType = "FELONY";

    expect(
      getViolation({
        reportedViolations: mockReportedViolations,
        violationType: mockViolationType,
      })
    ).toBe(
      "3 violations or notices of citation, Most severe violation: Felony"
    );
  });
});
