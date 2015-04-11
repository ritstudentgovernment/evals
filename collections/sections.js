Sections = new Meteor.Collection('sections');

if (Meteor.isServer) {
  Sections._ensureIndex({id: 1}, {unique: 1});
}

Sections.initEasySearch(
  [ 'title', 'courseParentNum' ],
  {
    'limit' : 1,
    'use': 'mongo-db'
  }
);

Sections.attachSchema(new SimpleSchema({
  id: {
    type: String
  },
  courseId: {
    type: String
  },
  title: {
    type: String
  },
  courseNum: {
    type: String
  },
  courseParentNum: {
    type: String
  },
  online: {
    type: Boolean
  },
  type: {
    type: String,
    allowedValues: ['Lecture', 'Lab', 'Resuscitation'],
  },
  instructor: {
    type: String
  },
  term: {
    type: Number
  }
}));
