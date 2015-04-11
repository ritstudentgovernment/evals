Template.evaluationsShow.helpers({
  'mySections': function () {
    return Sections.find({}, {sort: {title: 1}}).fetch();
  },
  'evaluationCompleted': function () {
    var query = {
      term: this.term,
      courseNum: this.courseNum,
      userId: Meteor.userId()};
    return Evaluations.findOne(query) ? true : false;
  }
});

Template.evaluationsShow.rendered = function () {
  $('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});
};
