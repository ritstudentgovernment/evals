function getEvaluationObject () {
  var singleton = Singleton.findOne();
  return _.find(Meteor.user().evaluationCounts,
    function (evaluationCount) {
      return evaluationCount.term == singleton.evaluationTerm;
    }
  );
};

Template.loginToSeeEvaluations.helpers({
  evaluationCountForTerm: function () {
    var evaluationObj = getEvaluationObject();
    return evaluationObj ? evaluationObj.count : 0;
  },
  moreReviewsNeeded: function () {
    var evaluationObj = getEvaluationObject();
    if (evaluationObj) {
      return evaluationObj.count < 2;
    } else {
      return true;
    }
  },
  unprivilegedUser: function () {
    return !Roles.userIsInRole(Meteor.user(), ['admin']);
  }
});
