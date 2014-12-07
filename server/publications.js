Meteor.publish('course', function (courseParentNum) {
  return Courses.find({courseParentNum: courseParentNum});
});

Meteor.publish('courseSections', function (courseParentNum) {
  return Sections.find({courseParentNum: courseParentNum});
});

Meteor.publish('sections', function () {
  return Sections.find();
});

Meteor.publish('mySections', function () {
 if (this.userId) {
  var sectionIds = Meteor.users.findOne(this.userId).sectionIds;
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
