import configureFilename from "../configureFileName";
import getTimeStamp from "../getTimeStamp";

jest.mock("../getTimeStamp");
describe("configureFilename tests", () => {
  const mockChartId = "revocationsChart";
  const mockMetricType = "some_metric_type";
  const mockMetricPeriodMonths = "some_metric_period";
  const mockSupervisionType = "some_supervision_type";
  const mockDistrict = "some_district";
  const mockFilters = {
    metricType: mockMetricType,
    metricPeriodMonths: mockMetricPeriodMonths,
    supervisionType: mockSupervisionType,
    district: mockDistrict,
  };

  const mockTimeStamp = "19.11.2020";
  getTimeStamp.mockReturnValue(mockTimeStamp);

  it("should return filename with timestamp", () => {
    const actual = configureFilename(mockChartId, {}, true);
    expect(actual).toBe(`${mockChartId}-${mockTimeStamp}`);
  });

  it("should return filename with filters", () => {
    const actual = configureFilename(mockChartId, mockFilters, false);

    expect(actual).toBe(
      `${mockChartId}-${mockTimeStamp}-${mockMetricType}-${mockMetricPeriodMonths}-${mockSupervisionType}-${mockDistrict}`
    );
  });
});
