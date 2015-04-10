Meteor.startup(function() {
  // Load initial section data
  if (Sections.find().count() === 0) {
    console.log("Refreshing sections table...");
    HTTP.call(
      'POST',
      'http://schedule.csh.rit.edu/search/find',
      {
        headers: {accept: 'application/json'},
        params: {term: 20141}
      },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          result.data.forEach(function insertSection (section) {
            try {
              Courses.insert({
                courseId: section.courseId,
                courseParentNum: section.courseParentNum,
                title: section.title
              });
            } catch (e) {}
            try {
              Instructors.insert({name: section.instructor});
            } catch (e) {}
            Sections.insert(_.extend(section, {term: 20141}));
          });
        }
      }
    );
  }
  // Initialize admin user
  if (Meteor.users.find().count() === 0) {
    var adminUser = Meteor.users.insert({username: "sgweb"});
    Roles.addUsersToRoles(adminUser, ['admin']);
  }
  // Initialize singleton
  if (Singleton.find().count() === 0) {
    Singleton.insert({
      evaluationCount: 0,
      version: "v1.0.0-dev"
    });
  }
});
