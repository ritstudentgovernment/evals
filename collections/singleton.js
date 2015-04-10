// Site-wide, global information, including denormalized data.

Singleton = new Mongo.Collection('singleton');

var singletonSchema = new SimpleSchema({
  evaluationCount: {
    type: Number
  },
  version: {
    type: String
  }
});
