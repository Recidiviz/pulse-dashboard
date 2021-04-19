// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import { render } from "@testing-library/react";
import LanternLayout from "../LanternLayout";
import useIntercom from "../../hooks/useIntercom";
import usePageLayout from "../hooks/usePageLayout";
import TopBarUserMenuForAuthenticatedUser from "../../components/TopBar/TopBarUserMenuForAuthenticatedUser";
import mockWithTestId from "../../../__helpers__/mockWithTestId";
import StoreProvider, { useRootStore } from "../../components/StoreProvider";
import { US_MO } from "../../RootStore/TenantStore/lanternTenants";
import { PageProvider } from "../../contexts/PageContext";

jest.mock("mobx-react-lite", () => {
  return {
    observer: (component) => component,
  };
});
jest.mock("react-router-dom", () => {
  return {
    Link: ({ children }) => children,
  };
});
jest.mock("../../hooks/useIntercom");
jest.mock("../hooks/usePageLayout");
jest.mock("../../components/TopBar/TopBarUserMenuForAuthenticatedUser");
jest.mock("../../components/StoreProvider");

describe("LanternLayout tests", () => {
  TopBarUserMenuForAuthenticatedUser.mockReturnValue(null);
  const mockChildrenId = "children-test-id";
  const mockChildren = mockWithTestId(mockChildrenId);
  StoreProvider.mockImplementation(({ children }) => children);
  let result;

  beforeEach(() => {
    useRootStore.mockReturnValue({
      currentTenantId: US_MO,
    });
    result = render(
      <StoreProvider>
        <PageProvider>
          <LanternLayout>{mockChildren}</LanternLayout>
        </PageProvider>
      </StoreProvider>
    );
  });

  it("should render children", () => {
    expect(result.getByTestId(mockChildrenId)).toBeInTheDocument();
  });

  it("should use Intercom for Lantern layout", () => {
    expect(useIntercom).toHaveBeenCalled();
  });

  it("should use Page Layout hook", () => {
    expect(usePageLayout).toHaveBeenCalled();
  });
});
