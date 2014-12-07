Template.search.rendered = function () {
  $('#modal-search').on('shown.bs.modal', function () {
    $('body').css('overflow', 'hidden');
    $('.modal-backdrop').css('opacity', '0.5');
  });
  $('#modal-search').on('hidden.bs.modal', function () {
    $('body').css('overflow', 'visible');
    $('.modal-backdrop').css('opacity', '0');
    $('#search').val("");
    Session.set("results", null);
  });
};

Template.search.events({
  'keyup #search': function (e) {
    var query = $(e.target).val();
    if (query.length >= 3) {
      setTimeout( function() {
        Session.set("waiting", true);
        EasySearch.search('courses', query, function (err, data) {
          var results = data.results;
          if (results && results.length > 0) {
            results = _.sortBy(results, function (course) {
              return course.courseParentNum;
            });
          }
          Session.set("searchCourses", results);
          Session.set("waiting", false);
        });
        EasySearch.search('instructors', query, function (err, data) {
          var results = data.results;
          if (results && results.length > 0) {
            results = _.sortBy(results, function (instructor) {
              return instructor.name;
            });
          }
          Session.set("searchInstructors", results);
          Session.set("waiting", false);
        });
      }, 100);
    }
  },
  'click a': function (e) {
    $('#modal-search').modal("hide");
  }
});

Template.search.helpers({
  noResults: function() {
    return Session.get('results') && Session.get('results').length == 0;
  }
});

Template.search.rendered = function () {
  $("#search").attr('autocomplete', 'off');
};