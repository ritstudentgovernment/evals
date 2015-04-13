// Site-wide, global information, including denormalized data.

Singleton = new Mongo.Collection('singleton');

Singleton.schema = new SimpleSchema({
  evaluationCount: {
    type: Number,
    autoform: {
      type: "hidden"
    }
  },
  evaluationTerm: {
    type: Number,
    label: "Current Evaluation Term. Users need to evaluate 2 courses from this term to view evaluation data.",
    autoform: {
      placeholder: "20141"
    }
  },
  version: {
    type: String,
    autoform: {
      type: "hidden"
    }
  }
});

Singleton.attachSchema(Singleton.schema);

Singleton.allow({
  // No inserts allowed on a singleton.
  insert: function (userId, singleton) {
    return false;
  },
  update: function (userId, document, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  // No removals allowed on a singleton.
  remove: function (userId, singleton) {
    return false;
  }
});
