Instructors = new Meteor.Collection('instructors');

if (Meteor.isServer) {
  Instructors._ensureIndex({name: 1}, {unique: 1});
}

Instructors.initEasySearch(
  [ 'name' ],
  {
    'limit' : 25,
    'use': 'mongo-db'
  }
);

Instructors.attachSchema(new SimpleSchema({
  name: {
    type: String
  }
}));
