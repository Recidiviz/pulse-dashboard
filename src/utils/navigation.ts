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
export function getPathsFromNavigation(navigation: {
  [k: string]: string[];
}): string[] {
  return Object.entries(navigation).flatMap((navItem) => {
    const section: string = navItem[0];
    const pages: string[] = navItem[1];
    return pages.length
      ? pages.map((page) => `/${section}/${page}`)
      : [`/${section}`];
  });
}

export function getPathWithoutParams(pathname: string): string {
  const navItems = pathname.split("/");
  // navItems[0] is "" because of the leading /
  const section: string = navItems[1];
  const page: string = navItems[2];
  return page ? `/${section}/${page}` : `/${section}`;
}
