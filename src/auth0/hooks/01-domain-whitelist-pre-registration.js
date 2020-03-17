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
  var response = {};

  const whitelist = ['recidiviz.org', 'nd.gov']; //authorized domains
  const userHasAccess = whitelist.some(
    function (domain) {
      const emailSplit = user.email.split('@');
      return emailSplit[emailSplit.length - 1].toLowerCase() === domain;
    }
  );

  if (userHasAccess) {
    response.user = user;
    cb(null, response);
  } else {
    cb('Access denied.', null);
  }
};
