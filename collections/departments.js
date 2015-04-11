Departments = new Mongo.Collection('departments');

if (Meteor.isServer) {
  Departments._ensureIndex({id: 1}, {unique: 1});
}

Departments.attachSchema(new SimpleSchema({
  id: {
    type: String
  },
  code: {
    type: String
  },
  title: {
    type: String,
    optional: true
  }
}));
