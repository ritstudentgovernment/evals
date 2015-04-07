Meteor.publish('course', function (courseParentNum) {
  return Courses.find({courseParentNum: courseParentNum});
});

Meteor.publish('courseSections', function (courseParentNum) {
  return Sections.find({courseParentNum: courseParentNum});
});

Meteor.publish('instructor', function (name) {
  return Instructors.find({name: name});
});

Meteor.publish('instructorSections', function (name) {
  return Sections.find(
    {
      instructor: name
    },
    {$fields: {
      title: 1,
      courseParentNum: 1,
      instructor: 1
    }
  });
})

Meteor.publish('jobs', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Jobs.find();
  } else {
    this.stop();
    return;
  } 
});

Meteor.publish('sections', function () {
  return Sections.find();
});

Meteor.publish('sectionById', function (id) {
  return Sections.find({id: id});
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
  return Meteor.users.find(this.userId, {fields: {
    identity: 1,
    sectionIds: 1,
    reviewCount: 1
  }});
});
