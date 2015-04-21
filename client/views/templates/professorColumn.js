Template.professorColumn.helpers({
  currentTermInstructors: function () {
    var singleton = Singleton.findOne();
    Meteor.call('instructorRatingsForCourse',
      this.course.courseParentNum,
      Singleton.findOne().evaluationTerm,
      function (err, result) {
        Session.set('currentTermInstructors', result);
      }
    );
    return Session.get('currentTermInstructors');
  },
  nextTermInstructors: function () {
    var singleton = Singleton.findOne();
    Meteor.call('instructorRatingsForCourse',
      this.course.courseParentNum,
      singleton.nextEvaluationTerm,
      function (err, result) {
        Session.set('nextTermInstructors', result);
      }
    );
    return Session.get('nextTermInstructors');
  }
});
