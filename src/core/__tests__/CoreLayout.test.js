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
import { useLocation } from "react-router-dom";

import CoreLayout from "../CoreLayout";
import TopBarUserMenuForAuthenticatedUser from "../../components/topbar/TopBarUserMenuForAuthenticatedUser";

import mockWithTestId from "../../../__helpers__/mockWithTestId";
import { PageProvider } from "../../contexts/PageContext";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  matchPath: jest.fn().mockReturnValue(false),
  Link: jest.fn().mockReturnValue(null),
  NavLink: jest.fn().mockReturnValue(null),
}));
jest.mock("../../components/TopBar/TopBarUserMenuForAuthenticatedUser");

describe("CoreLayout tests", () => {
  TopBarUserMenuForAuthenticatedUser.mockReturnValue(null);
  const mockChildrenId = "children-test-id";
  const mockChildren = mockWithTestId(mockChildrenId);
  const mockPathname = "/some/nested/pathname";
  useLocation.mockReturnValue({ pathname: mockPathname });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderCoreLayout = () => {
    return render(
      <PageProvider>
        <CoreLayout>{mockChildren}</CoreLayout>
      </PageProvider>
    );
  };

  it("should render children", () => {
    const { getByTestId } = renderCoreLayout();

    expect(getByTestId(mockChildrenId)).toBeInTheDocument();
  });
});
