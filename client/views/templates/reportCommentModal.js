function onReportSubmitted (err, id) {
  $('.report-comment-modal').modal('hide');
  if (err) {
    throwError(err.reason);
  } else {
    throwError("Report #" + id + " created. Thanks for helping moderate OpenEvals.");
  }
};

Template.reportCommentModal.events({
  'submit form': function (e, template) {
    e.preventDefault();
    var evaluation = Session.get('reportEvaluation');
    GAnalytics.event('evaluations', 'report', evaluation._id);
    if (this.course) {
      Meteor.call("reportComment", {
        evaluationId: evaluation._id,
        resourceName: this.course.title,
        comment: evaluation.courseComments
      }, onReportSubmitted);
    } else if (this.instructor) {
      Meteor.call("reportComment", {
        evaluationId: evaluation._id,
        resourceName: this.instructor.name,
        comment: evaluation.instructorComments
      }, onReportSubmitted);
    }
  }
});
