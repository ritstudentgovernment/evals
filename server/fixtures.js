Meteor.startup(function() {
  // Initialize admin user
  if (Meteor.users.find().count() === 0) {
    var adminUser = Meteor.users.insert({username: "sgweb"});
    Roles.addUsersToRoles(adminUser, ['admin']);
  }
  // Initialize singleton
  if (Singleton.find().count() === 0) {
    Singleton.insert({
      evaluationCount: 0,
      version: "v1.0.0-dev"
    });
  }
});
