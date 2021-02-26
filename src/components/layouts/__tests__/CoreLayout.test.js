import React from "react";
import { render } from "@testing-library/react";
import { useLocation } from "react-router-dom";

import CoreLayout from "../CoreLayout";
import TopBarUserMenuForAuthenticatedUser from "../../topbar/TopBarUserMenuForAuthenticatedUser";
import useSideBar from "../../../hooks/useSideBar";

import mockWithTestId from "../../../../__helpers__/mockWithTestId";
import { PageProvider } from "../../../contexts/PageContext";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  matchPath: jest.fn().mockReturnValue(false),
  Link: jest.fn().mockReturnValue(null),
  NavLink: jest.fn().mockReturnValue(null),
}));
jest.mock("../../topbar/TopBarUserMenuForAuthenticatedUser");
jest.mock("../../../hooks/useSideBar");

describe("CoreLayout tests", () => {
  TopBarUserMenuForAuthenticatedUser.mockReturnValue(null);
  const mockChildrenId = "children-test-id";
  const mockChildren = mockWithTestId(mockChildrenId);
  const mockPathname = "/some/nested/pathname";
  useLocation.mockReturnValue({ pathname: mockPathname });
  useSideBar.mockReturnValue({
    isSideBarCollapsed: true,
    toggleSideBar: jest.fn(),
  });

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
