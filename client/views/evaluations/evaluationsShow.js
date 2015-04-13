Template.evaluationsShow.helpers({
  mySections: function () {
    return Sections.find({}, {sort: {title: 1}}).fetch();
  },
  evaluationCountForTerm: function () {
    var obj = _.find(Meteor.user().evaluationCounts,
      function (evaluationCount) {
        return evaluationCount.term == Singleton.findOne().evaluationTerm;
      }
    );
    return obj ? obj.count : 0;
  },
  evaluationCompleted: function () {
    var query = {
      term: this.term,
      courseNum: this.courseNum,
      userId: Meteor.userId()};
    return Evaluations.findOne(query) ? true : false;
  }
});

Template.progressBar.helpers({
  evaluationTerm: function () {
    return Singleton.findOne().evaluationTerm;
  }
})

Template.progressBar.rendered = function () {
  $('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});
};
