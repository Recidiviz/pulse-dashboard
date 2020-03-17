function (user, context, callback) {
  const namespace = 'https://dashboard.recidiviz.org/';
  context.idToken[namespace + 'user_metadata'] = user.user_metadata;
  context.idToken[namespace + 'app_metadata'] = user.app_metadata;
  callback(null, user, context);
}
