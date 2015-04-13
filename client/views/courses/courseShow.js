function average (dimension) {
  return _.average(_.pluck(Evaluations.find().fetch(), dimension));
};

function prettyPrintNumber (number) {
  return number ? number.toFixed(1) : "?";
};

Template.courseShow.helpers({
  clarity: function () {
    return prettyPrintNumber(average('clarity'));
  },
  helpfulness: function () {
    return prettyPrintNumber(average('helpfulness'));
  },
  responsiveness: function () {
    return prettyPrintNumber(average('responsiveness'));
  },
  fairness: function () {
    return prettyPrintNumber(average('fairness'));
  },
  cumulative: function () {
    return prettyPrintNumber((average('clarity') + average('helpfulness') + average('responsiveness') + average('fairness')) / 4);
  },
  instructors: function () {
    var sections = Sections.find().fetch();
    return _.uniq(_.pluck(_.where(sections, {courseParentNum: this.course.courseParentNum}), 'instructor'));
  }
});
