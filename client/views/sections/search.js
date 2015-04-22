function search (collectionName, query, sortBy) {
  if (query == "") {
    Session.set("profCount", 0);
    Session.set("courseCount", 0);
    Session.set("instructorsSearch", []);
    Session.set("coursesSearch", []);
  }
  else {
    Session.set("waiting", true);
    EasySearch.search(collectionName, query, function (err, data) {
      var results = data.results;
      if (collectionName === "instructors") {
        Session.set("profCount", results.length)
      } else {
        Session.set("courseCount", results.length)
      }
      if (results && results.length > 0) {
        results = _.sortBy(results, function (elem) {
          return elem[sortBy];
        });
      }
      Session.set(collectionName + "Search", results);
      Session.set("waiting", false);
    });
  }
};

Template.search.events({
  'keyup #search': function (e) {
    var query = $(e.target).val();
    Session.set('query', query);
    setTimeout( function() {
      search('courses', query, 'courseParentNum');
      search('instructors', query, 'name');
    }, 100);
  }
});

Template.search.rendered = function () {
  Session.setDefault("profCount", 0);
  Session.setDefault("courseCount", 0);
  $('#search').focus();
  $('#search').attr('autocomplete', 'off');
  $('#search').val(Session.get('query'));
};
