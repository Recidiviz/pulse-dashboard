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

    if (["csg.org", "recidiviz.org"].includes(domain)) {
      // Do not set state_code on internal users, this is done in a rule
      cb(null, { user });
    }

    /** 2. Add user's state_code to the app_metadata */
    const acceptedStateCodes = ["id", "mo", "nd", "pa"];
    const domainSplit = domain.split(".");

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
    // TODO(recidiviz-data#7298) Fetch user restrictions and add to metadata

    response.user = user;
    cb(null, response);
  } else {
    cb("Access denied.", null);
  }
};
