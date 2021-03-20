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
export const CORE_VIEWS = {
  community: "community",
  facilities: "facilities",
  goals: "goals",
  methodology: "methodology",
  profile: "profile",
  notFound: "notFound",
} as const;

export const CORE_PATHS = {
  goals: "/goals",
  communityExplore: "/community/explore",
  communityProjections: "/community/projections",
  facilitiesExplore: "/facilities/explore",
  facilitiesProjections: "/facilities/projections",
  methodology: "/methodology",
  profile: "/profile",
} as const;

export function getViewFromPathname(pathname: string): keyof typeof CORE_VIEWS {
  switch (pathname) {
    case CORE_PATHS.communityExplore:
    case CORE_PATHS.communityProjections:
      return CORE_VIEWS.community;
    case CORE_PATHS.facilitiesExplore:
    case CORE_PATHS.facilitiesProjections:
      return CORE_VIEWS.facilities;
    case CORE_PATHS.goals:
      return CORE_VIEWS.goals;
    case CORE_PATHS.methodology:
      return CORE_VIEWS.methodology;
    case CORE_PATHS.profile:
      return CORE_VIEWS.profile;
    default:
      return CORE_VIEWS.notFound;
  }
}
