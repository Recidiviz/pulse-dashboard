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
import qs from "qs";
import { User } from "@auth0/auth0-spa-js";

type DemoUserOptions = {
  email?: string;
  name?: string;
  stateCode?: string;
  allowedSupervisionLocationIds?: string[];
  allowedSupervisionLocationLevel?: string;
};

export async function fetchDemoUser(options: DemoUserOptions): Promise<User> {
  const queryParams = qs.stringify(options, { addQueryPrefix: true });
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/demoUser${queryParams}`
  );
  return response.json();
}
