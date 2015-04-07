Template.evaluationsShow.helpers({
  'mySections': function () {
    return Sections.find().fetch();
  },
  'evaluationStatus': function () {
    var query = {
      term: this.term,
      courseNum: this.courseNum,
      userId: Meteor.userId()};
    return Evaluations.findOne(query) ? "evaluation-complete" : "";
  }
});
