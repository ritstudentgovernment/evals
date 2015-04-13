Template.reviewColumn.helpers({
  evaluations: function () {
    return Evaluations.find({$or: [{courseComments: {$exists: true}}, {instructorComments: { $exists: true }}]}).fetch();
  },
  evaluationCreatedAt: function () {
    return new moment(this.createdAt).fromNow();
  }
});
