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
export const CORE_VIEWS: Record<string, string> = {
  community: "community",
  facilities: "facilities",
  goals: "goals",
  methodology: "methodology",
};

export const CORE_PATHS: Record<string, string> = {
  goals: "/goals",
  communityExplore: "/community/explore",
  communityProjections: "/community/projections",
  communityVitals: "/community/vitals/:entityId?",
  facilitiesExplore: "/facilities/explore",
  facilitiesProjections: "/facilities/projections",
  methodologyProjections: "/methodology/projections",
  methodologyVitals: "/methodology/vitals",
};

const pathnameToView: Record<string, string> = {
  [CORE_PATHS.goals]: CORE_VIEWS.goals,
  [CORE_PATHS.communityExplore]: CORE_VIEWS.community,
  [CORE_PATHS.communityProjections]: CORE_VIEWS.community,
  [CORE_PATHS.communityVitals]: CORE_VIEWS.community,
  [CORE_PATHS.facilitiesExplore]: CORE_VIEWS.facilities,
  [CORE_PATHS.facilitiesProjections]: CORE_VIEWS.facilities,
  [CORE_PATHS.methodologyProjections]: CORE_VIEWS.methodology,
  [CORE_PATHS.methodologyVitals]: CORE_VIEWS.methodology,
};

export function getViewFromPathname(pathname: string): keyof typeof CORE_VIEWS {
  return pathnameToView[pathname];
}
