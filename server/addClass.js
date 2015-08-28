Meteor.methods({
  addCourse: function (options) {
    var user = Meteor.user();
    if(user){
      var username = user.username;
      var termCode = Singleton.findOne().evaluationTerm;
      var sectionID = options.sectionID;
      var section = Sections.findOne({term: termCode, courseNum: sectionID});
      if (section) {
        Meteor.users.update(
          {username: username},
          {
            $addToSet: {sectionIds: section._id}
          }
        );
        return true;
      }
      else{
        return false;
      }
    }

}
});
