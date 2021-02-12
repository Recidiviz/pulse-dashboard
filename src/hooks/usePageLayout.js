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

import { useLayoutEffect, useRef, useState } from "react";
import { usePageState, usePageDispatch } from "../contexts/PageContext";

const usePageLayout = () => {
  const pageDispatch = usePageDispatch();
  const { hideTopBar } = usePageState();
  const frame = useRef(0);
  const [lastOffset, setLastOffset] = useState(window.pageYOffset);
  const [scrollUpCount, setScrollUpCount] = useState(0);

  if (hideTopBar === undefined) {
    pageDispatch({
      type: "update",
      payload: { hideTopBar: false },
    });
  }

  useLayoutEffect(() => {
    const handler = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (window.pageYOffset < lastOffset) {
          setScrollUpCount(scrollUpCount + 1);
        } else if (window.pageYOffset > lastOffset) {
          setScrollUpCount(0);
        }
        if (
          !hideTopBar &&
          window.pageYOffset > 90 &&
          window.pageYOffset > lastOffset
        ) {
          pageDispatch({
            type: "update",
            payload: { hideTopBar: true },
          });
        } else if (
          hideTopBar &&
          (scrollUpCount > 3 || window.pageYOffset < 25)
        ) {
          pageDispatch({
            type: "update",
            payload: { hideTopBar: false },
          });
        }
        setLastOffset(window.pageYOffset);
      });
    };

    window.addEventListener("scroll", handler, {
      capture: false,
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", handler);
    };
  });
};

export default usePageLayout;
