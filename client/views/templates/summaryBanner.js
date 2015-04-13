Template.summaryBanner.helpers({
  evaluationCount: function () {
    return Evaluations.find().fetch().length;
  }
});
