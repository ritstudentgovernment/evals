var search = function (collectionName, query, sortBy) {
  Session.set("waiting", true);
  EasySearch.search(collectionName, query, function (err, data) {
    var results = data.results;
    if(collectionName === "instructors"){
      Session.set("profCount", results.length)
    }
    else
    {
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
};

Template.search.events({
  'keyup #search': function (e) {
    var query = $(e.target).val();
    Session.set('query', query);
    if (query.length >= 3) {
      setTimeout( function() {
        search('courses', query, 'courseParentNum');
        search('instructors', query, 'name');
      }, 100);
    }
    else
    {
      Session.set("courses" + "Search", null);
      Session.set("instructors" + "Search", null);
      Session.set("profCount", 0);
      Session.set("courseCount", 0);
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
  Session.set("profCount", 0);
  Session.set("courseCount", 0);
  $('#search').focus();
  $("#search").attr('autocomplete', 'off');
  $('#search').val(Session.get('query'));
};
