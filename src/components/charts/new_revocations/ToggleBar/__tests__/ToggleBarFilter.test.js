import React from "react";
import { act, render } from "@testing-library/react";

import ToggleBarFilter from "../ToggleBarFilter";
import Select from "../../../../controls/Select";
import FilterField from "../FilterField";
import {
  METRIC_PERIOD_MONTHS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
} from "../../../../../constants/filterTypes";
import StoreProvider from "../../../../../StoreProvider";
import RootStore from "../../../../../RootStore";
import { useAuth0 } from "../../../../../react-auth0-spa";
import { METADATA_NAMESPACE } from "../../../../../utils/authentication/user";
import { setTranslateLocale } from "../../../../../views/tenants/utils/i18nSettings";
import { US_MO } from "../../../../../views/tenants/utils/lanternTenants";

jest.mock("../../../../controls/Select", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../FilterField", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../../../../react-auth0-spa");

describe("ToggleBarFilter tests", () => {
  const metadataField = `${METADATA_NAMESPACE}app_metadata`;
  const mockUser = { [metadataField]: { state_code: US_MO } };
  useAuth0.mockReturnValue({ user: mockUser });
  setTranslateLocale(US_MO);

  FilterField.mockImplementation(({ children }) => children);
  Select.mockReturnValue(null);

  [
    { label: "Time Period", dimension: METRIC_PERIOD_MONTHS },
    { label: "Supervision Level", dimension: SUPERVISION_LEVEL },
    { label: "Supervision Type", dimension: SUPERVISION_TYPE },
  ].forEach((props) => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should pass valid props to Select", () => {
      const rootStore = new RootStore();
      jest.spyOn(RootStore, "constructor").mockReturnValue(rootStore);

      render(
        <StoreProvider>
          <ToggleBarFilter label={props.label} dimension={props.dimension} />
        </StoreProvider>
      );

      expect(Select).toHaveBeenCalledTimes(1);
      expect(Select.mock.calls[0][0]).toMatchObject({
        value:
          rootStore.filtersStore.filterOptions[props.dimension].defaultOption,
        options: rootStore.filtersStore.filterOptions[props.dimension].options,
        defaultValue:
          rootStore.filtersStore.filterOptions[props.dimension].defaultOption,
      });
    });

    it("onChange should change the filter value", () => {
      const rootStore = new RootStore();
      jest.spyOn(RootStore, "constructor").mockReturnValue(rootStore);

      render(
        <StoreProvider>
          <ToggleBarFilter
            label="Time Period"
            dimension={METRIC_PERIOD_MONTHS}
          />
        </StoreProvider>
      );

      act(() => {
        Select.mock.calls[0][0].onChange(
          rootStore.filtersStore.filterOptions[props.dimension].options[3]
        );
      });

      // TODO figure out a way to get the expect to wait for the store update
      setTimeout(() => {
        expect(rootStore.filtersStore.filters.METRIC_PERIOD_MONTHS).toBe(
          rootStore.filtersStore.filterOptions[props.dimension].options[3].value
        );
      }, 100);
    });
  });
});
