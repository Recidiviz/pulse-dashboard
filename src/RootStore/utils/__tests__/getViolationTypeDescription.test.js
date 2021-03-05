import getViolationTypeDescription from "../getViolationTypeDescription";

describe("getViolationTypeDescription tests", () => {
  it("should return empty string if no reportedViolations, violationType provided", () => {
    expect(getViolationTypeDescription({})).toBe("");
  });

  it("should return violations number and type", () => {
    const mockReportedViolations = "3";
    const mockViolationType = "FELONY";

    expect(
      getViolationTypeDescription({
        reportedViolations: mockReportedViolations,
        violationType: mockViolationType,
      })
    ).toBe(
      "3 violations or notices of citation, Most severe violation: Felony"
    );
  });
});
