function getSections (instructorName, term) {
  var sections = Sections.find({instructor: instructorName, term: term});
  var uniqSections = _.uniq(sections.fetch(), function (item, key, a) { return item.title });
  return _.sortBy(uniqSections, 'title');
}

Template.courseColumn.helpers({
  sectionsForCurrentTerm: function () {
    return getSections(this.instructor.name, Singleton.findOne().evaluationTerm);
  },
  sectionsForNextTerm: function () {
    return getSections(this.instructor.name, Singleton.findOne().nextEvaluationTerm);
  }
});
