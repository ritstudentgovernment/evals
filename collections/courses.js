Courses = new Meteor.Collection('courses');

if (Meteor.isServer) {
  Courses._ensureIndex({courseId: 1}, {unique: 1});
}

Courses.initEasySearch(
  [ 'courseId', 'courseParentNum', 'title'],
  {
    'limit' : 75,
    'use': 'mongo-db'
  }
);

Courses.attachSchema(new SimpleSchema({
  id: {
    type: String
  },
  courseId: {
    type: String
  },
  title: {
    type: String
  },
  courseParentNum: {
    type: String
  },
  description: {
    type: String,
    optional: true
  },
  deptId: {
    type: String,
    optional: true
  },
  term: {
    type: Number
  },
  online: {
    type: Boolean
  }
}));
