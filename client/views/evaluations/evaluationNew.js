Template.evaluationNew.rendered = function () {
  $('*[data-toggle="tooltip"]').tooltip();
  $('.helpfulness').slider({
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
  $('.clarity').slider({
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
  $('.fairness').slider({
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
  $('.responsiveness').slider({
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