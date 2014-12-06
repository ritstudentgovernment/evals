Meteor.publish('sections', function () {
  return Sections.find();
});

// Expose individual users' objects
Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId});
});
