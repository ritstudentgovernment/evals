Meteor.methods({
  instructorRatingsForCourse: function (courseParentNum, term) {
    var sections = Sections.find({courseParentNum: courseParentNum, term: term}).fetch();
    var instructorNames = _.pluck(sections, 'instructor');
    var instructors = Instructors
      .find({name: {$in: instructorNames}})
      .fetch()
      .map(function(instructor) {
        var userId = Meteor.userId();
        if (Roles.userIsInRole(userId, 'admin') || !Evaluations.moreReviewsNeeded(userId)) {
          var evaluations = Evaluations.find({instructorName: instructor.name}).fetch();
          if (evaluations.length > 0) {
            var averages = _.map(evaluations, function (evaluation) {
              return ((evaluation.clarity +
                     evaluation.effectiveness +
                     evaluation.helpfulness +
                     evaluation.organization +
                     evaluation.positivity +
                     evaluation.responsiveness +
                     evaluation.supportiveness) / 7);
            });
            var rating = averages.reduce(function (a, b) { return a + b }) / averages.length;
            return _.extend(instructor, {rating: rating.toFixed(1)});
          } else {
            return _.extend(instructor, {rating: "N/A"});
          }
        } else {
          return _.extend(instructor, {rating: "?"});
        }
      });
    return _.sortBy(instructors, function (instructor) {return instructor.rating});
  },

  sectionsForCourse : function (courseParentNum, term) {
    return Sections.find({courseParentNum: courseParentNum, term: term}).fetch();
  },

  sectionsForProfessor: function(name, term){
    return Sections.find({instructor: name, term: term}).fetch();
  }
});
