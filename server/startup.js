Meteor.startup(function () {
  Singleton.update({}, {$set: { version: "v1.0.0-dev" }});
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
});
