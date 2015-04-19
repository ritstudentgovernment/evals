Template.evaluationNew.helpers({
  evaluationsSchema: function () {
    return Evaluations.schema;
  }
});

Template.evaluationNew.rendered = function () {
  $('*[data-toggle="tooltip"]').tooltip();
  $('.likert').slider({
    min: 1,
    max: 5,
    value: 3,
    tooltip: 'always',
    formatter: function (val) {
      var map = {
        "1": "1/5: Strongly disagree",
        "2": "2/5: Disagree",
        "3": "3/5: Neither agree or disagree",
        "4": "4/5: Agree",
        "5": "5/5: Strongly agree"
      }
      return map[val];
    }
  });

  AutoForm.addHooks('insertEvaluationForm', {
    formToDoc: function (doc) {
      var section = Sections.findOne();
      return _.extend(doc, {
        createdAt: new Date().getTime(),
        courseNum: section.courseNum,
        courseParentNum: section.courseParentNum,
        courseCommentsHidden: false,
        fairness: 1,
        instructorName: section.instructor,
        instructorCommentsHidden: false,
        term: section.term,
        userId: Meteor.userId()
      });
    },
    onError: function(formType, error) {
      if (error.reason) {
        throwError(error.reason);
      }
    },
    onSuccess: function(formType, result) {
      Router.go('evaluationsShow');
    }
  });
}
