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

import { useLayoutEffect, useRef } from "react";
import { usePageStore } from "../StoreProvider";

const usePageLayout = () => {
  const pageStore = usePageStore();
  const frame = useRef(0);

  useLayoutEffect(() => {
    const handler = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (!pageStore.isTopBarShrinking && window.pageYOffset > 90) {
          pageStore.isTopBarShrinking = true;
        } else if (pageStore.isTopBarShrinking && window.pageYOffset < 5) {
          pageStore.isTopBarShrinking = false;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
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
