Template.addCourses.events({
  'submit form': function (event, template) {
    event.preventDefault();
    var options = {
      sectionID: $("#courseNum").val()
    }
    Meteor.call('addCourse',options, function (result) {

    });
  }

});
