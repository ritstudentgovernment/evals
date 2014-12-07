Meteor.publish('sections', function () {
  return Sections.find();
});

Meteor.publish('mySections', function (sectionIds) {
 if (this.userId) {
  return Sections.find({_id: {$in: sectionIds}}, {limit: 100});
 } else {
  this.stop();
  return;
 }
});

// Expose individual users' objects
Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId});
});
