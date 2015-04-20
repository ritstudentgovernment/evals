function average (metric) {
  return _.average(_.pluck(Evaluations.find().fetch(), metric));
};

function prettyPrintNumber (number) {
  return number ? number.toFixed(1) + " / 5" : "?";
};

Template.instructorShow.helpers({
  metrics: function () {
    return [{
      title: 'Clear',
      value: prettyPrintNumber(average('clarity')),
    },
    {
      title: 'Effective',
      value: prettyPrintNumber(average('effectiveness')),
    },
    {
      title: 'Helpful',
      value: prettyPrintNumber(average('helpfulness')),
    },
    {
      title: 'Organized',
      value: prettyPrintNumber(average('organization')),
    },
    {
      title: 'Positive',
      value: prettyPrintNumber(average('positivity')),
    },
    {
      title: 'Responsive',
      value: prettyPrintNumber(average('responsiveness')),
    },
    {
      title: 'Supportive',
      value: prettyPrintNumber(average('supportiveness')),
    },
    {
      title: 'Evaluations',
      value: Evaluations.find().count(),
    }]
  },
  primaryMetric: function () {
    return {
      title: "Cumulative",
      value: prettyPrintNumber((
        average('clarity') +
        average('effectiveness') +
        average('helpfulness') + 
        average('organization') + 
        average('positivity') + 
        average('responsiveness') + 
        average('supportiveness')) / 7)
    }
  },
  'sections': function () {
    var sections = Sections.find().fetch();
    sections = _.map(_.where(sections, {instructor: this.instructor.name}),
      function (section) {
        return _.pick(section, ['title', 'courseParentNum', 'instructor']);
      }
    );
    return _.sortBy(_.uniq(sections, function(section) { return section.courseParentNum; }), 'title');
  }
});
