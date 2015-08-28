Template.addCourses.events({
  'submit form': function (event, template) {
    event.preventDefault();
    var options = {
      sectionID: $("#courseNum").val()
    }
    console.log(options.sectionID);
    Meteor.call('addCourse',options, function (result) {
      console.log("The Result is: " + result);
    });
  }

});
