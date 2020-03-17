function (user, context, callback) {
  if (!user.email_verified) {
    context.redirect = {
        url: "https://dashboard.recidiviz.org/verify"
    };
    return callback(null, user, context);
  } else {
    return callback(null, user, context);
  }
}
