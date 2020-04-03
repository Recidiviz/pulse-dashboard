// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MetricTypeToggle from "../MetricTypeToggle";

configure({ adapter: new Adapter() });

describe("check of displaying MetricTypeToggle component", () => {
  it("metric type = counts", () => {
    const props = {
      onMetricTypeUpdate: jest.fn(),
    };

    const componentMetricTypeToggle = shallow(<MetricTypeToggle {...props} />);

    expect(componentMetricTypeToggle.find("input").at(0).prop("value")).toEqual(
      "counts"
    );
    expect(componentMetricTypeToggle.find("input").at(1).prop("value")).toEqual(
      "rates"
    );

    componentMetricTypeToggle
      .find("input")
      .at(1)
      .simulate("change", {
        target: { name: "metric-type", value: "rates" },
      });

    expect(props.onMetricTypeUpdate).toHaveBeenCalledTimes(1);
    expect(props.onMetricTypeUpdate).toHaveBeenCalledWith("rates");
    expect(
      componentMetricTypeToggle.find("input").at(1).prop("checked")
    ).toBeTrue();
  });

  it("metric type = rates", () => {
    const props = {
      onMetricTypeUpdate: jest.fn(),
    };

    const componentMetricTypeToggle = shallow(<MetricTypeToggle {...props} />);

    componentMetricTypeToggle
      .find("input")
      .at(0)
      .simulate("change", {
        target: { name: "metric-type", value: "counts" },
      });

    expect(props.onMetricTypeUpdate).toHaveBeenCalledTimes(1);
    expect(props.onMetricTypeUpdate).toHaveBeenCalledWith("counts");
    expect(
      componentMetricTypeToggle.find("input").at(0).prop("checked")
    ).toBeTrue();
  });
});
