import createMethodologyFile from "../createMethodologyFile";
import { translate } from "../../../views/tenants/utils/i18nSettings";
import getFilters from "../getFilters";
import getViolation from "../getViolation";

jest.mock("../../../views/tenants/utils/i18nSettings");
jest.mock("../getFilters");
jest.mock("../getViolation");
describe("createMethodologyFile functions", () => {
  const mockChartId = "revocations_count";
  const mockChartTitle = "Revocations Count";
  const mockTimeWindowDescription = "20 November 2019 - 20 November 2020";
  const mockFilters = {};
  const mockMethodologyHeader = "methodology header";
  const mockMethodologyBody = "methodology body";
  const mockTranslations = {
    methodology: {
      [mockChartId]: [
        {
          header: mockMethodologyHeader,
          body: mockMethodologyBody,
        },
      ],
    },
  };
  const mockFiltersText = "some filters text";
  const mockViolationText = "some violation text";

  const nowSpy = jest.spyOn(Date, "now");
  nowSpy.mockReturnValue(1605866733144);
  translate.mockImplementation((t) => mockTranslations[t]);
  getFilters.mockReturnValue(mockFiltersText);
  getViolation.mockReturnValue(mockViolationText);

  it("should return methodology file for MO", () => {
    const actual = createMethodologyFile(
      mockChartId,
      mockChartTitle,
      mockTimeWindowDescription,
      mockFilters
    );

    expect(actual.data).toBe(
      "Chart: Revocations Count\n" +
        "Dates: 20 November 2019 - 20 November 2020\n" +
        "Applied filters:\n" +
        "- some filters text\n" +
        "- some violation text\n\n" +
        "Export Date: 11/20/2020\n\n" +
        "methodology header\n" +
        "methodology body\n\n"
    );
  });
});
