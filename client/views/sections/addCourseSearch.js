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

Template.addCourseSearch.events({
  'keyup #search': function (e) {
    var query = $(e.target).val();
    Session.set('query', query);
    setTimeout( function() {
      search('courses', query, 'courseParentNum');
      search('instructors', query, 'name');
    }, 100);
  },
  'click .searchItem': function(e){
    e.preventDefault();
    var courseId = $(e.target).attr('courseId');
    var session = Session.get("selectedItem");
    if(session && session.id == courseId){
      Session.set("selectedItem", undefined);
      console.log("Already selected");
    }else{
      Session.set("selectedItem", {type: "course", id: courseId});
      console.log("Course Id: " + courseId);
      $("#" + courseId).collapse('show');
    }
  },
  'click .professorItem': function(e){
    e.preventDefault();
    var name = $(e.target).attr('name');
    var id = $(e.target).attr('professorId');
    var session = Session.get("selectedItem");
    if(session && session.id == id){
      Session.set("selectedItem", undefined);
    }else{
      Session.set("selectedItem", {type: "professor", id: id, name: name});
      $("#" + id).collapse('show');
    }
  },
  'show.bs.collapse .collapse' : function(e){
    console.log("Closing");
    $('.collapse.in').collapse('hide');
  }
});

Template.addCourseSearch.helpers({
  coursesSearch : function (e) {
    return Session.get('coursesSearch');
  },
  selected :function(e){
    if(Session.get('selectedItem')){
      var selected = Session.get('selectedItem').id == this.id;
      var professorSelected = Session.get('selectedItem').id == this._id;

      if(selected || professorSelected){
        $("#" + Session.get("selectedItem").id).collapse('show');
        return true;
      }
      return false;
    }else{
      return false;
    }

  }
});

Template.addCourseSearch.rendered = function () {
  Session.setDefault("profCount", 0);
  Session.setDefault("courseCount", 0);
  $('#search').attr('autocomplete', 'off');
  $('#search').val(Session.get('query'));
};
