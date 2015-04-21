function prettyPrintNumber (number) {
  return (number * 100).toFixed(0) + "%";
};

function percent (metric) {
  var query = {},
      existsQuery = {};
  query[metric] = true;
  existsQuery[metric] = {$exists: true};
  var totalTrue = Evaluations.find(query).count(),
      totalResponses = Evaluations.find(existsQuery).count();
  return (totalResponses == 0) ? 0 : totalTrue / totalResponses;
}

Template.courseShow.helpers({
  primaryMetric: function () {
    return {
      title: "% Regularly Attending Course",
      value: prettyPrintNumber(percent('attendance'))
    }
  },
  metrics: function () {
    return [{
      title: "Enrollment Issues",
      value: prettyPrintNumber(percent('enrollment'))
    }, {
      title: "Expensive ($200+)",
      value: prettyPrintNumber(percent('expensive'))
    }, {
      title: "Group Work",
      value: prettyPrintNumber(percent('groupWork'))
    }, {
      title: "Valuable Course",
      value: prettyPrintNumber(percent('highValue'))
    }, {
      title: "Recommend to a Peer",
      value: prettyPrintNumber(percent('recommendCourse'))
    }, {
      title: "Textbook Req'd.",
      value: prettyPrintNumber(percent('textbook'))
    }, {
      title: "Old/Int'l Textbook OK",
      value: prettyPrintNumber(percent('textbookOld'))
    }, {
      title: "Evaluations",
      value: Evaluations.find().count()
    }];
  },
  instructors: function () {
    var sections = Sections.find().fetch();
    return _.uniq(_.pluck(_.where(sections, {courseParentNum: this.course.courseParentNum}), 'instructor')).sort();
  }
});
