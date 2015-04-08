Template.evaluationNew.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var evaluation = {
      helpfulness: parseInt(template.find("input[name='helpfulness']").value),
      clarity: parseInt(template.find("input[name='clarity']").value),
      fairness: parseInt(template.find("input[name='fairness']").value),
      responsiveness: parseInt(template.find("input[name='responsiveness']").value),
      retakeInstructor: stringToBoolean(template.find("[name='retakeInstructor'].btn-group>.active>input").value),
      instructorComments: template.find("textarea[name='instructorComments']").value,
      attendance: stringToBoolean(template.find("[name='attendance'].btn-group>.active>input").value),
      textbook: stringToBoolean(template.find("[name='textbook'].btn-group>.active>input").value),
      textbookOld: stringToBoolean(template.find("[name='oldTextbook'].btn-group>.active>input").value),
      retakeCourse: stringToBoolean(template.find("[name='retakeCourse'].btn-group>.active>input").value),
      courseComments: template.find("textarea[name='courseComments']").value,
      courseNum: this.section.courseNum,
      term: this.section.term
    }
    if (confirm("Are you sure you want to submit this evaluation?")) {
      Meteor.call('submitEvaluation', evaluation, function (err) {
        if (err) {
          throwError(err.reason);
        } else {
          Router.go('evaluationsShow');
        }
      });
    }
  }
});

var stringToBoolean = function (str) {
  if (str == "true") {
    return true;
  } else if (str == "false") {
    return false;
  } else {
    return undefined;
  }
}

var sliderConfig = {
  min: 1,
  max: 5,
  value: 3,
  tooltip: 'always'
};

Template.evaluationNew.rendered = function () {
  $('*[data-toggle="tooltip"]').tooltip();
  $('input[name="helpfulness"]').slider(
    _.extend(sliderConfig, {
      formatter: function (val) {
        var map = {
          "1": "1/5: Very Unhelpful",
          "2": "2/5: Sometimes helpful",
          "3": "3/5: Helped when asked",
          "4": "4/5: More likely to help",
          "5": "5/5: Enthusiastic to help"
        }
        return map[val];
      }
    })
  );
  $('input[name="clarity"]').slider(
    _.extend(sliderConfig, {
      formatter: function (val) {
        var map = {
          "1": "1/5: Very Unclear",
          "2": "2/5: Sometimes unclear",
          "3": "3/5: Pretty Clear",
          "4": "4/5: Clear-cut",
          "5": "5/5: Very Clear"
        }
        return map[val];
      }
    })
  );
  $('input[name="fairness"]').slider(
    _.extend(sliderConfig, {
      formatter: function (val) {
        var map = {
          "1": "1/5: Very Unfair",
          "2": "2/5: Sometimes unfair",
          "3": "3/5: Fair",
          "4": "4/5: Frequently fair",
          "5": "5/5: Very fair"
        }
        return map[val];
      }
    })
  );
  $('input[name="responsiveness"]').slider(
    _.extend(sliderConfig, {
      formatter: function (val) {
        var map = {
          "1": "1/5: Very Unresponsive",
          "2": "2/5: Sometimes unresponsive",
          "3": "3/5: Responsive",
          "4": "4/5: Frequently responsive",
          "5": "5/5: Very responsive"
        }
        return map[val];
      }
    })
  );
}
