Template.reviewColumn.helpers({
  evaluations: function () {
    return Evaluations.find().fetch();
  },
  evaluationCreatedAt: function () {
    return new moment(this.createdAt).fromNow();
  }
});
