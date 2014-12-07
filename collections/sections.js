Sections = new Meteor.Collection('sections');

Sections.initEasySearch(
  [ 'title', 'courseParentNum' ],
  {
    'limit' : 1,
    'use': 'mongo-db'
  }
);
