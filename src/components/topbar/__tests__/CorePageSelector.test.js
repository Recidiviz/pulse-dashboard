import React from "react";
import { configure, mount } from "enzyme";
import { Link, StaticRouter } from "react-router-dom";

import Adapter from "enzyme-adapter-react-16";
import CorePageSelector from "../CorePageSelector";

configure({ adapter: new Adapter() });

describe("CoreLayout tests", () => {
  const mockSection = "section";
  const mockPageOptions = ["page1", "page2", "page3"];

  const renderCorePageSelector = (currentPage) => {
    return mount(
      <StaticRouter>
        <CorePageSelector
          currentPage={currentPage}
          currentSection={mockSection}
          pageOptions={mockPageOptions}
        />
      </StaticRouter>
    );
  };

  it("Should render a link for each page option", () => {
    const selector = renderCorePageSelector("page1");

    expect(selector.find(Link)).toHaveLength(3);
  });

  it("Add bar above current page", () => {
    const selector = renderCorePageSelector("page1");

    expect(
      selector.find("Link.CorePageSelector--Option-Selected")
    ).toHaveLength(1);
  });

  it("Don't add bars above any page selectors if not in one", () => {
    const selector = renderCorePageSelector("page4");

    expect(
      selector.find("Link.CorePageSelector--Option-Selected")
    ).toHaveLength(0);
  });
});
