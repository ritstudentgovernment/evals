Colleges = new Mongo.Collection('colleges');

if (Meteor.isServer) {
  Colleges._ensureIndex({id: 1}, {unique: 1});
}

Colleges.attachSchema(new SimpleSchema({
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
