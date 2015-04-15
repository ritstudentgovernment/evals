DataFeedJobs = JobCollection('datafeedjobs');

DataFeedJobs.schema = new SimpleSchema({
  "term": {
    type: String,
    label: "Enter a Term Code (ex: 20141)",
    autoform: {
      placeholder: "20141"
    }
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    DataFeedJobs.startJobServer();
  });
  DataFeedJobs.allow({
    admin: function (userId, method, params) {
      return Roles.userIsInRole(userId, ['admin']);
    }
  });
}

Meteor.methods({
  startDataFeed: function (payload) {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      var job = new Job(DataFeedJobs, 'startDataFeed', payload);
      job.priority('normal').save();
    }
  },
  deleteDataFeedJob: function (id) {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Jobs.remove(id);
    }
  }
});
