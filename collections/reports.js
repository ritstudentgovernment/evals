// A report for inappropriate content.

Reports = new Mongo.Collection('reports');

var reportSchema = new SimpleSchema({
  evaluationId: {
    type: String
  },
  resourceName: {
    type: String
  },
  comment: {
    type: String
  },
  userId: {
    type: String
  },
  createdAt: {
    type: Number
  }
});

Reports.attachSchema(reportSchema);

Meteor.methods({
  reportComment: function (payload) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You need to login to upvote.");
    }

    var report = _.extend(_.pick(payload, "evaluationId", "resourceName", "comment"), {
      createdAt: new Date().getTime(),
      userId: user._id
    });

    if (Meteor.isServer) {
      Meteor.ssrEmail('newReport', {to: "sgweb@rit.edu", subject: "[OpenEvals] Comment Reported"}, report);
    }

    return Reports.insert(report);
  }
});
