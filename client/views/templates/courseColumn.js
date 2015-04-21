Template.courseColumn.helpers({
  sectionsForCurrentTerm: function () {
    return _.uniq(Sections.find({term: Singleton.findOne().evaluationTerm}).fetch(), function (item, key, a) { return item.title });
  },
  sectionsForNextTerm: function () {
    return _.uniq(Sections.find({term: Singleton.findOne().nextEvaluationTerm}).fetch(), function (item, key, a) { return item.title });
  }
});
