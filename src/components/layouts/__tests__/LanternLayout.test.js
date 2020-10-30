import React from "react";
import { render } from "@testing-library/react";
import LanternLayout from "../LanternLayout";

import useIntercom from "../../../hooks/useIntercom";
import usePageLayout from "../../../hooks/usePageLayout";
import TopBarUserMenuForAuthenticatedUser from "../../topbar/TopBarUserMenuForAuthenticatedUser";

import mockWithTestId from "../../../../__helpers__/mockWithTestId";

jest.mock("react-router-dom");
jest.mock("../../../hooks/useIntercom");
jest.mock("../../../hooks/usePageLayout");
jest.mock("../../topbar/TopBarUserMenuForAuthenticatedUser");

describe("LanternLayout tests", () => {
  TopBarUserMenuForAuthenticatedUser.mockReturnValue(null);
  const mockChildrenId = "children-test-id";
  const mockChildren = mockWithTestId(mockChildrenId);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children", () => {
    const { getByTestId } = render(
      <LanternLayout stateCode="us_mo">{mockChildren}</LanternLayout>
    );

    expect(getByTestId(mockChildrenId)).toBeInTheDocument();
  });

  it("should use Intercom for Lantern layout", () => {
    render(<LanternLayout stateCode="us_mo">{mockChildren}</LanternLayout>);

    expect(useIntercom).toHaveBeenCalled();
  });

  it("should use Page Layout hook", () => {
    render(<LanternLayout stateCode="us_mo">{mockChildren}</LanternLayout>);

    expect(usePageLayout).toHaveBeenCalled();
  });
});
