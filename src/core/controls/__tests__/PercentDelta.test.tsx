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
import { mount } from "enzyme";
import PercentDelta, { ROTATE_UP, ROTATE_DOWN } from "../PercentDelta";
import * as styles from "../../CoreConstants.scss";

describe("PercentDelta", () => {
  type PropTypes = {
    value: number;
    width?: number;
    height?: number;
    improvesOnIncrease?: boolean;
  };

  const renderPercentDelta = ({
    value,
    width = 12,
    height = 10,
    improvesOnIncrease = false,
  }: PropTypes) => {
    return mount(
      <PercentDelta
        value={value}
        width={width}
        height={height}
        improvesOnIncrease={improvesOnIncrease}
      />
    );
  };

  const expected = {
    improvedOnIncrease: {
      color: styles.signalLinks,
      rotate: ROTATE_UP,
    },
    improvedOnDecrease: {
      color: styles.signalLinks,
      rotate: ROTATE_DOWN,
    },
    worsenedOnIncrease: {
      color: styles.crimsonDark,
      rotate: ROTATE_UP,
    },
    worsenedOnDecrease: {
      color: styles.crimsonDark,
      rotate: ROTATE_DOWN,
    },
  };

  it("sets the correct color and icon direction", () => {
    [
      [20, true, expected.improvedOnIncrease],
      [-60, true, expected.worsenedOnDecrease],
      [-5, false, expected.improvedOnDecrease],
      [80, false, expected.worsenedOnIncrease],
    ].forEach((testSetup) => {
      const [value, improvesOnIncrease, expectedProps]: any[] = testSetup;

      const wrapper = renderPercentDelta({
        value,
        improvesOnIncrease,
      });
      expect(wrapper.find(".PercentDelta").prop("style")).toEqual({
        color: expectedProps.color,
      });
      expect(wrapper.find("Icon").props()).toMatchObject({
        fill: expectedProps.color,
        rotate: expectedProps.rotate,
      });
    });
  });

  it("does not render an icon when there is no change", () => {
    const wrapper = renderPercentDelta({
      value: 0,
    });
    expect(wrapper.find(".PercentDelta").prop("style")).toEqual({
      color: styles.slate60,
    });
    expect(wrapper.find("Icon").exists()).toEqual(false);
  });
});
