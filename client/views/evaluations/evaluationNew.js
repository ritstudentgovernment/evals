Template.evaluationNew.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var evaluation = {
      helpfulness: parseInt(template.find("input[name='helpfulness']")).value,
      clarity: parseInt(template.find("input[name='clarity']")).value,
      fairness: parseInt(template.find("input[name='fairness']")).value,
      responsiveness: parseInt(template.find("input[name='responsiveness']")).value,
      retakeInstructor: stringToBoolean(template.find("[name='retakeInstructor'].btn-group>.active>input").value),
      instructorComments: template.find("textarea[name='instructorComments']").value,
      attendance: stringToBoolean(template.find("[name='attendance'].btn-group>.active>input").value),
      textbook: stringToBoolean(template.find("[name='textbook'].btn-group>.active>input").value),
      textbookOld: stringToBoolean(template.find("[name='oldTextbook'].btn-group>.active>input").value),
      retakeCourse: stringToBoolean(template.find("[name='retakeCourse'].btn-group>.active>input").value),
      courseComments: template.find("textarea[name='courseComments']").value
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

Template.evaluationNew.rendered = function () {
  $('*[data-toggle="tooltip"]').tooltip();
  $('input[name="helpfulness"]').slider({
    min: 0,
    max: 5,
    value: 0,
    tooltip: 'always',
    formatter: function (val) {
      var map = {
        "0": "I never asked for help.",
        "1": "Very Unhelpful",
        "2": "Sometimes helpful",
        "3": "Helped when asked",
        "4": "More likely to help",
        "5": "Enthusiastic to help"
      }
      return map[val];
    }
  });
  $('input[name="clarity"]').slider({
    min: 0,
    max: 5,
    value: 0,
    tooltip: 'always',
    formatter: function (val) {
      var map = {
        "0": "Unsure",
        "1": "Very Unclear",
        "2": "Sometimes unclear",
        "3": "Pretty Clear",
        "4": "Clear-cut",
        "5": "Very Clear"
      }
      return map[val];
    }
  });
  $('input[name="fairness"]').slider({
    min: 0,
    max: 5,
    value: 0,
    tooltip: 'always',
    formatter: function (val) {
      var map = {
        "0": "Unsure",
        "1": "Very Unfair",
        "2": "Sometimes unfair",
        "3": "Fair",
        "4": "Frequently fair",
        "5": "Very fair"
      }
      return map[val];
    }
  });
  $('input[name="responsiveness"]').slider({
    min: 0,
    max: 5,
    value: 0,
    tooltip: 'always',
    formatter: function (val) {
      var map = {
        "0": "Unsure",
        "1": "Very Unresponsive",
        "2": "Sometimes unresponsive",
        "3": "Responsive",
        "4": "Frequently responsive",
        "5": "Very responsive"
      }
      return map[val];
    }
  });
}