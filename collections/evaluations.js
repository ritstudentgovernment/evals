// An evaluation submission.

Evaluations = new Mongo.Collection('evaluations');

Evaluations.schema = new SimpleSchema({
  attendance: {
    type: Boolean,
    label: "I attended this class regularly.",
    autoform: {
      afFieldInput: {
        label: "I attended this class regularly."
      }
    }
  },
  clarity: {
    type: Number,
    min: 1,
    max: 5,
    label: "The instructor communicated the course material clearly.",
    autoform: {
      class: "likert"
    }
  },
  courseNum: {
    type: String,
    autoform: {
      type: "hidden"
    }
  },
  courseParentNum: {
    type: String,
    autoform: {
      type: "hidden"
    }
  },
  createdAt: {
    type: Number,
    autoform: {
      type: "hidden"
    }
  },
  courseComments: {
    type: String,
    max: 300,
    optional: true,
    label: "What was beneficial about this course? How could this course be improved?",
    autoform: {
      placeholder: "Comments are visible to other students. Leave no personally identifiable information in comments."
    }
  },
  courseCommentsUpvotes: {
    type: [String],
    defaultValue: [],
    optional: true,
    autoform: {
      type: "hidden"
    }
  },
  courseCommentsDownvotes: {
    type: [String],
    defaultValue: [],
    optional: true,
    autoform: {
      type: "hidden"
    }
  },
  courseCommentsHidden: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      type: "hidden"
    }
  },
  effectiveness: {
    type: Number,
    min: 1,
    max: 5,
    label: "Overall, this instructor was an effective teacher.",
    autoform: {
      class: "likert"
    }
  },
  enrollment: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      label: "Difficult to enroll in (few spaces)"
    }
  },
  expensive: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      label: "Expensive (Books + Materials, etc. over $200)"
    }
  },
  fairness: {
    type: Number,
    min: 1,
    max: 5
  },
  groupWork: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      label: "Group projects"
    }
  },
  helpfulness: {
    type: Number,
    min: 1,
    max: 5,
    label: "The instructor provided helpful feedback about my work in this course.",
    autoform: {
      class: "likert"
    }
  },
  highValue: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      label: "Valuable to academic / career objectives"
    }
  },
  instructorName: {
    type: String,
    autoform: {
      type: "hidden"
    }
  },
  instructorComments: {
    type: String,
    max: 300,
    optional: true,
    label: "What did this instructor do well? How can this instructor improve?",
    autoform: {
      placeholder: "Comments are visible to other students. Leave no personally identifiable information in comments."
    }
  },
  instructorCommentsUpvotes: {
    type: [String],
    defaultValue: [],
    optional: true,
    autoform: {
      type: "hidden"
    }
  },
  instructorCommentsDownvotes: {
    type: [String],
    defaultValue: [],
    optional: true,
    autoform: {
      type: "hidden"
    }
  },
  instructorCommentsHidden: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      type: "hidden"
    }
  },
  organization: {
    type: Number,
    min: 1,
    max: 5,
    label: "The instructor presented the course material in an organized manner.",
    autoform: {
      class: "likert"
    }
  },
  positivity: {
    type: Number,
    min: 1,
    max: 5,
    label: "The instructor established a positive learning environment.",
    autoform: {
      class: "likert"
    }
  },
  responsiveness: {
    type: Number,
    min: 1,
    max: 5,
    label: "The instructor provided helpful feedback about my work in this course.",
    autoform: {
      class: "likert"
    }
  },
  recommendCourse: {
    type: Boolean,
    optional: true,
    autoform: {
      label: "Would recommend course to a friend"
    }
  },
  retakeInstructor: {
    type: Boolean,
    optional: true
  },
  supportiveness: {
    type: Number,
    min: 1,
    max: 5,
    label: "The instructor supported my progress towards achieving the course objectives.",
    autoform: {
      class: "likert"
    }
  },
  term: {
    type: Number,
    autoform: {
      type: "hidden"
    }
  },
  textbook: {
    type: Boolean,
    optional: true,
    autoform: {
      label: "Textbook required"
    }
  },
  textbookOld: {
    type: Boolean,
    optional: true,
    autoform: {
      label: "Old / International Textbook OK"
    }
  },
  userId: {
    type: String,
    max: 80,
    autoform: {
      type: "hidden"
    }
  }
});

Evaluations.attachSchema(Evaluations.schema);

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

    var evaluation = _.extend(payload, {
      courseNum: section.courseNum,
      courseParentNum: section.courseParentNum,
      createdAt: new Date().getTime(),
      instructorName: section.instructor,
      courseCommentsUpvotes: [],
      courseCommentsDownvotes: [],
      courseCommentsHidden: false,
      instructorName: section.instructor,
      instructorCommentsUpvotes: [],
      instructorCommentsDownvotes: [],
      instructorCommentsHidden: false,
      term: section.term,
      userId: user._id
    });

    check(evaluation, Evaluations.schema);

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
