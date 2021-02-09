import React from "react";
import { render } from "@testing-library/react";
import { useLocation, matchPath } from "react-router-dom";

import CoreLayout from "../CoreLayout";
import TopBarUserMenuForAuthenticatedUser from "../../topbar/TopBarUserMenuForAuthenticatedUser";
import useSideBar from "../../../hooks/useSideBar";

import mockWithTestId from "../../../../__helpers__/mockWithTestId";

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

  it("should render children", () => {
    const { getByTestId } = render(<CoreLayout>{mockChildren}</CoreLayout>);

    expect(getByTestId(mockChildrenId)).toBeInTheDocument();
  });

  it("should call useSideBar hook and collapse layout", () => {
    const { container } = render(<CoreLayout>{mockChildren}</CoreLayout>);

    expect(useSideBar).toHaveBeenCalled();
    expect(container.firstChild.className).toContain("is-collapsed");
  });

  it("should call useSideBar hook and show full layout", () => {
    useSideBar.mockReturnValue({
      isSideBarCollapsed: false,
      toggleSideBar: jest.fn(),
    });
    const { container } = render(<CoreLayout>{mockChildren}</CoreLayout>);

    expect(useSideBar).toHaveBeenCalled();
    expect(container.firstChild.className).not.toContain("is-collapsed");
  });

  it("should hide the SideBar on the profile page", () => {
    matchPath.mockReturnValueOnce(true);
    const { container } = render(<CoreLayout>{mockChildren}</CoreLayout>);

    expect(container.firstChild.className).toContain("is-hidden");
  });

  it("should show right pathname in TopBarTitle", () => {
    const { getByText } = render(<CoreLayout>{mockChildren}</CoreLayout>);

    expect(getByText("Some > Nested > Pathname")).toBeInTheDocument();
  });
});
