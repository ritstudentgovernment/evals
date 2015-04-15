function evaluationScore (evaluation) {
  if (evaluation.courseCommentsUpvotes) {
    return evaluation.courseCommentsUpvotes.length - evaluation.courseCommentsDownvotes.length;
  } else {
    return evaluation.instructorCommentsUpvotes.length - evaluation.instructorCommentsDownvotes.length;
  }
};

Template.reviewColumn.helpers({
  evaluations: function () {
    // Sort by a comment's score, descending, then comment creation date, descending.
    if (Roles.userIsInRole(Meteor.user(), 'admin')) {
      var filter = {$or: [
        {courseComments: {$exists: true}},
        {instructorComments: { $exists: true }}
      ]};
    } else {
      var filter = {$or: [
        {instructorCommentsHidden: false},
        {courseCommentsHidden: false}
      ]};
    }
    return Evaluations.find(filter).fetch().sort(function (a, b) {
        return evaluationScore(a) > evaluationScore(b) ?
          -1 : evaluationScore(a) < evaluationScore(b) ?
          1 : a.createdAt > b.createdAt ?
          -1 : a.createdAt < b.createdAt ?
          1 : 0;
      }
    );
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
  'commentPostedAt': function () {
    return new moment(this.evaluation.createdAt).fromNow(true);
  },
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
  },
  hidden: function () {
    return this.evaluation.instructorCommentsHidden || this.evaluation.courseCommentsHidden;
  },
  'score': function () {
    return evaluationScore(this.evaluation);
  }
});

Template.comment.events({
  'click .report-comment': function (e, template) {
    Session.set("reportEvaluation", this.evaluation);
    $('.report-comment-modal').modal('show');
  },
  'click .toggle-comment-visibility': function (e, template) {
    Meteor.call("changeCommentVisibility", {evaluationId: this.evaluation._id, context: this.context});
  }
});
