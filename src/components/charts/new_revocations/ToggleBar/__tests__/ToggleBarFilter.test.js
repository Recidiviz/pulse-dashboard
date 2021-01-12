// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import React from "react";
import { act, render } from "@testing-library/react";
import { reaction } from "mobx";

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

      reaction(
        () => rootStore.filtersStore.filters.METRIC_PERIOD_MONTHS,
        (value) => {
          expect(value).toBe(
            rootStore.filtersStore.filterOptions[props.dimension].options[3]
              .value
          );
        }
      );
    });
  });
});
