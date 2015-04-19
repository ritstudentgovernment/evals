Meteor.startup(function() {
  // Initialize admin user
  if (Meteor.users.find().count() === 0) {
    var adminUser = Meteor.users.insert({
      username: "sgweb",
      identity: {
        name: "Peter Mikitsh",
        firstName: "Peter",
        lastName: "Mikitsh"
      },
      evaluationCounts: [],
      sectionIds: []
    });
    Roles.addUsersToRoles(adminUser, ['admin']);
  }
  // Initialize singleton
  if (Singleton.find().count() === 0) {
    Singleton.insert({
      evaluationCount: 0,
      evaluationTermFriendlyName: "Spring 2015",
      evaluationTerm: 20145,
      version: "v1.0.0-dev"
    });
  }
});
