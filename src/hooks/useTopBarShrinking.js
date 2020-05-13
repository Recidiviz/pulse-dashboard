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

import { useEffect, useRef, useState } from "react";

const useTopBarShrinking = () => {
  const [isTopBarShrinking, setIsTopBarShrinking] = useState(false);

  const frame = useRef(0);
  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        console.log(window.pageYOffset);
        if (!isTopBarShrinking && window.pageYOffset > 50) {
          setIsTopBarShrinking(true);
        } else if (isTopBarShrinking && window.pageYOffset < 5) {
          setIsTopBarShrinking(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    };

    window.addEventListener("scroll", handler, {
      capture: false,
      passive: true
    });

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", handler);
    };
  });

  return isTopBarShrinking;
};

export default useTopBarShrinking;