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
/**
@param {object} user - The user being created
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.password - user's password
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/
module.exports = function (user, context, cb) {
  /**
   * This hook allows custom code to prevent creation of a user in the
   * database or to add custom app_metadata or user_metadata to a
   * newly created user.
   *
   * Only one pre-user registration hook can be enabled at a time.
   *
   * This hook will do three things:
   * 1. Prevent users from signing up that are not in the allow list
   * 2. Add the user's state_code to the app_metadata
   * 3. Fetch any user restrictions and add them to the user's app_metadata
   *
   */
  const response = {};

  /** 1. Domain allow list for registration */
  const authorizedDomains = []; // add authorized domains here
  const emailSplit = user.email.split("@");
  const userDomain = emailSplit[emailSplit.length - 1].toLowerCase();

  const userHasAccess = authorizedDomains.some(function (authorizedDomain) {
    return userDomain === authorizedDomain;
  });

  if (userHasAccess) {
    user.app_metadata = user.app_metadata || {};

    if (["csg.org", "recidiviz.org"].includes(userDomain)) {
      // Do not set state_code on internal users, this is done in a rule
      cb(null, { user });
    }

    /** 2. Add user's state_code to the app_metadata */
    const acceptedStateCodes = ["id", "mo", "nd", "pa"];
    const domainSplit = userDomain.split(".");

    // assumes the state is always the second to last component of the domain
    // e.g. @doc.mo.gov or @nd.gov, but not @nd.docr.gov
    let state = domainSplit[domainSplit.length - 2].toLowerCase();

    // Idaho does not use the abbreviation in their email addresses
    if (state === "idaho") {
      state = "id";
    }

    const stateCode = `us_${state}`;
    if (acceptedStateCodes.includes(state)) {
      user.app_metadata.state_code = stateCode;
    }

    /** 3. Add the user's restrictions to the app_metadata */
    // PA and ND do not currently have any sign up or user restrictions
    const stateCodesWithRestrictions = ["us_id", "us_mo"];

    if (stateCodesWithRestrictions.includes(stateCode.toLowerCase())) {
      const Sentry = require("@sentry/node");
      const { GoogleAuth } = require("google-auth-library");
      Sentry.init({
        dsn: context.webtask.secrets.SENTRY_DSN,
        environment: context.webtask.secrets.SENTRY_ENV,
      });

      try {
        const credentials = JSON.parse(
          context.webtask.secrets.GOOGLE_APPLICATION_CREDENTIALS
        );
        const auth = new GoogleAuth({ credentials });
        const client = await auth.getIdTokenClient(
          context.webtask.secrets.TARGET_AUDIENCE
        );
        const url = `${context.webtask.secrets.RECIDIVIZ_APP_URL}/auth/dashboard_user_restrictions_by_email?email_address=${user.email}&region_code=${stateCode}`;
        const apiResponse = await client.request({ url, retry: true });
        const restrictions = apiResponse.data;

        user.app_metadata = Object.assign(user.app_metadata, {
          allowed_supervision_location_ids:
            restrictions.allowed_supervision_location_ids || [],
          allowed_supervision_location_level:
            restrictions.allowed_supervision_location_level,
        });
      } catch (apiError) {
        Sentry.captureMessage(
          `Error while registering new user for state code ${stateCode} and email ${user.email}.`
        );
        Sentry.captureException(apiError);
        const clientMessage =
          "There was a problem registering your account. Please contact your organization administrator, if you don’t know your administrator, contact help@recidiviz.org.";
        return cb(
          new PreUserRegistrationError(apiError.message, clientMessage)
        );
      }
    }

    response.user = user;
    cb(null, response);
  } else {
    cb("Access denied.", null);
  }
};
