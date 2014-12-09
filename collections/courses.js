Courses = new Meteor.Collection('courses');

if (Meteor.isServer)
  Courses._ensureIndex({courseId: 1}, {unique: 1});

Courses.initEasySearch(
  [ 'courseId', 'courseParentNum', 'title'],
  {
    'limit' : 50,
    'use': 'mongo-db'
  }
);