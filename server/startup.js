Meteor.startup(function () {
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
});
