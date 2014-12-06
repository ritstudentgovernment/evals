Meteor.publish('sections', function () {
  return Sections.find();
});