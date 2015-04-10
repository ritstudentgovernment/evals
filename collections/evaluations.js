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
  createdAt: {
    type: Number
  },
  courseComments: {
    type: String,
    max: 300,
    optional: true
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
  instructorComments: {
    type: String,
    max: 300,
    optional: true
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
      createdAt: new Date().getTime(),
      userId: user._id
    });

    if (!Match.test(evaluation, evaluationSchema)) {
      throw new Meteor.Error(400, "This evaluation submission is invalid.");
    }

    Evaluations.insert(evaluation);

    Singleton.update({}, {$inc: {evaluationCount: 1}});

  }
});
