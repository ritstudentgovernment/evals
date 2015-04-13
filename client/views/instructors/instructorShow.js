function average (dimension) {
  return _.average(_.pluck(Evaluations.find().fetch(), dimension));
};

function prettyPrintNumber (number) {
  return number ? number.toFixed(1) : "?";
};

Template.instructorShow.helpers({
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
  'sections': function () {
    var sections = Sections.find().fetch();
    sections = _.map(_.where(sections, {instructor: this.instructor.name}),
      function (section) {
        return _.pick(section, ['title', 'courseParentNum', 'instructor']);
      }
    );
    return _.uniq(sections, function(section) { return section.courseParentNum; });
  }
});
