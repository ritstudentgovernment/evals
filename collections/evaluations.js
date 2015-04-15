// An evaluation submission.

Evaluations = new Mongo.Collection('evaluations');

var evaluationSchema = new SimpleSchema({
  attendance: {
    type: Boolean,
    optional: true
  },
  clarity: {
    type: Number,
    min: 1,
    max: 5
  },
  courseNum: {
    type: String
  },
  courseParentNum: {
    type: String
  },
  createdAt: {
    type: Number
  },
  courseComments: {
    type: String,
    max: 300,
    optional: true
  },
  courseCommentsUpvotes: {
    type: [String],
    defaultValue: [],
    optional: true
  },
  courseCommentsDownvotes: {
    type: [String],
    defaultValue: [],
    optional: true
  },
  courseCommentsHidden: {
    type: Boolean
  },
  fairness: {
    type: Number,
    min: 1,
    max: 5
  },
  helpfulness: {
    type: Number,
    min: 1,
    max: 5
  },
  instructorName: {
    type: String
  },
  instructorComments: {
    type: String,
    max: 300,
    optional: true
  },
  instructorCommentsUpvotes: {
    type: [String],
    defaultValue: [],
    optional: true
  },
  instructorCommentsDownvotes: {
    type: [String],
    defaultValue: [],
    optional: true
  },
  instructorCommentsHidden: {
    type: Boolean
  },
  responsiveness: {
    type: Number,
    min: 1,
    max: 5
  },
  retakeCourse: {
    type: Boolean,
    optional: true
  },
  retakeInstructor: {
    type: Boolean,
    optional: true
  },
  term: {
    type: Number
  },
  textbook: {
    type: Boolean,
    optional: true
  },
  textbookOld: {
    type: Boolean,
    optional: true
  },
  userId: {
    type: String,
    max: 80,
  }
});

Evaluations.attachSchema(evaluationSchema);

Meteor.methods({
  submitEvaluation: function (payload) {

    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You need to login to submit an evaluation.");
    }

    // Validate user is enrolled in section
    var section = Sections.findOne({courseNum: payload.courseNum, term: payload.term});
    if (!section || !_.contains(user.sectionIds, section._id)) {
      throw new Meteor.Error(403, "You are not authorized to evaluate this section.");
    }

    // Validate the user hasn't completed an existing evaluation
    if (Evaluations.findOne({courseNum: payload.courseNum, term: payload.term, userId: user._id})) {
      throw new Meteor.Error(400, "You have already evaluated this course.");
    }

    var evaluation = _.extend(_.pick(payload, "helpfulness", "clarity",
      "fairness", "responsiveness", "retakeInstructor", "instructorComments",
      "attendance", "textbook", "textbookOld", "retakeCourse", "courseComments",
      "courseNum", "term"), {
      courseParentNum: section.courseParentNum,
      instructorName: section.instructor,
      createdAt: new Date().getTime(),
      courseCommentsHidden: false,
      instructorCommentsHidden: false,
      userId: user._id
    });

    if (!Match.test(evaluation, evaluationSchema)) {
      throw new Meteor.Error(400, "This evaluation submission is invalid.");
    }

    Evaluations.insert(evaluation);

    // Credit the user for their submission
    // NOTE: This is implementation is not thread-safe and not scalable.
    var evaluationTerm = Singleton.findOne().evaluationTerm;
    // Increment existing evaluation term
    Meteor.users.update({_id: user._id, "evaluationCounts.term": evaluationTerm},
      {$inc: {"evaluationCounts.$.count": 1}});
    // If none exists, make a new one.
    Meteor.users.update({_id: user._id, "evaluationCounts.term": {$ne: evaluationTerm}},
      {$addToSet: {evaluationCounts: {term: evaluationTerm, count: 1}}});

    Singleton.update({}, {$inc: {evaluationCount: 1}});
  }
});

Meteor.methods({
  vote: function (payload) {
    var user = Meteor.user();
        add = {},
        remove = {};

    if (!user) {
      throw new Meteor.Error(401, "You need to login to upvote.");
    }

    if (payload.voteType != "course" && payload.voteType != "instructor") {
      throw new Meteor.Error(400, "Invalid request");
    }

    if (payload.actionType != "upvote" && payload.actionType != "downvote") {
      throw new Meteor.Error(400, "Invalid request");
    }

    add[payload.voteType + "CommentsUpvotes"] = user._id;
    remove[payload.voteType + "CommentsDownvotes"] = user._id;

    Evaluations.update(payload.evaluationId, {
      $addToSet: payload.actionType == "upvote" ? add : remove,
      $pull: payload.actionType == "upvote" ? remove : add,
    });
  },
  changeCommentVisibility: function (payload) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You need to login to upvote.");
    }

    if (!Roles.userIsInRole(user, ['admin'])) {
      throw new Meteor.Error(401, "You are not authorized to change a comment's visibility.");
    }

    if (payload.context != "course" && payload.context != "instructor") {
      throw new Meteor.Error(400, "Invalid request");
    }

    var evaluation = Evaluations.findOne(payload.evaluationId);

    var set = {};
    set[payload.context + "CommentsHidden"] = !evaluation[payload.context + "CommentsHidden"];

    Evaluations.update({_id: evaluation._id}, {$set: set});

  }
});
