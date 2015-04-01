Jobs = JobCollection('jobs');

if (Meteor.isServer) {
  Meteor.startup(function () {
    Jobs.startJobServer();
  });
  Jobs.allow({
    // Grant full permission to any authenticated user
    admin: function (userId, method, params) {
      return (userId ? true : false);
    }
  });
}

Meteor.methods({
  sendEmail: function () {
    var job = new Job(Jobs, 'sendEmail', {});
    job.priority('normal').save();
  },
  deleteJob: function (id) {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Jobs.remove(id);
    }
  }
});
