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

async function blockUnauthorizedMoUsers(user, context, callback) {
  const stateCode = user.app_metadata.state_code;
  if (user.app_metadata.state_code === 'US_MO') {
    const { GoogleAuth } = require('google-auth-library');
    try {
      const credentials = JSON.parse(
        configuration.GOOGLE_APPLICATION_CREDENTIALS
      );
      const auth = new GoogleAuth({ credentials });
      const client = await auth.getIdTokenClient(
        configuration.TARGET_AUDIENCE
      );
      const url = `${configuration
        .RECIDIVIZ_APP_URL}/auth/dashboard_user_restrictions_by_email?email_address=${user.email}&region_code=${stateCode}`;
      const _apiResponse = await client.request({ url, retry: true });
    } catch(apiError) {
      return callback(new UnauthorizedError('There was a problem authorizing your account. Please contact your organization administrator, if you don’t know your administrator, contact feedback@recidiviz.org.'));
    }
  }
  
  return callback(null, user, context);
}


