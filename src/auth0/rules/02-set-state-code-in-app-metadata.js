function(user, context, callback) {
  user.app_metadata = user.app_metadata || {};

  const emailSplit = user.email.split('@');
  const domain = emailSplit[emailSplit.length - 1].toLowerCase();

  // update the app_metadata that will be part of the response
  if (domain === 'recidiviz.org') {
    user.app_metadata.state_code = 'recidiviz';
  }
  else {
    const domainSplit = domain.split('.');
    // assumes the state is always the second to last component of the domain
    // e.g. @doc.mo.gov or @nd.gov, but not @nd.docr.gov
    const state = domainSplit[domainSplit.length - 2].toLowerCase();
    const stateCode = `us_${state}`;
    user.app_metadata.state_code = stateCode;
  }

  // persist the app_metadata update
  auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
    .then(function() {
      callback(null, user, context);
    })
    .catch(function(err) {
      callback(err);
    });
}
