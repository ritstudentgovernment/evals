Courses = new Meteor.Collection('courses');

Courses.initEasySearch(
  [ 'courseParentNum', 'title'],
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
    type: String,
    index: true,
    unique: true
  },
  title: {
    type: String
  },
  courseParentNum: {
    type: String,
    index: true,
    unique: true
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
