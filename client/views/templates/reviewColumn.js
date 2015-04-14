Template.reviewColumn.helpers({
  evaluations: function () {
    return Evaluations.find({$or: [{courseComments: {$exists: true}}, {instructorComments: { $exists: true }}]}).fetch();
  },
  evaluationCreatedAt: function () {
    return new moment(this.createdAt).fromNow();
  }
});

Template.courseComment.events({
  'click .upvote': function () {
    Meteor.call("vote", {
      actionType: "upvote",
      evaluationId: this.evaluation._id,
      voteType: "course"});
  },
  'click .downvote': function () {
    Meteor.call("vote", {
      actionType: "downvote",
      evaluationId: this.evaluation._id,
      voteType: "course"});
  }
});

Template.instructorComment.events({
  'click .upvote': function () {
    Meteor.call("vote", {
      actionType: "upvote",
      evaluationId: this.evaluation._id,
      voteType: "instructor"});
  },
  'click .downvote': function () {
    Meteor.call("vote", {
      actionType: "downvote",
      evaluationId: this.evaluation._id,
      voteType: "instructor"});
  }
});

Template.comment.helpers({
  'upvoteClass': function () {
    if (_.contains(this.evaluation.courseCommentsUpvotes, Meteor.userId()) || 
        _.contains(this.evaluation.instructorCommentsUpvotes, Meteor.userId())) {
      return "orange";
    } else {
      return "";
    }
  },
  'downvoteClass': function () {
    if (_.contains(this.evaluation.courseCommentsDownvotes, Meteor.userId()) || 
        _.contains(this.evaluation.instructorCommentsDownvotes, Meteor.userId())) {
      return "orange";
    } else {
      return "";
    }
  }
});
