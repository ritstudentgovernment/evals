Meteor.methods({
  addCourse: function (options) {
    var user = Meteor.user();
    if(user){
      var username = user.username;
      var termCode = Singleton.findOne().evaluationTerm;
      var sectionID = options.sectionID;
      //Check if the section is valid by polling the db
      var section = Sections.findOne({term: termCode, courseNum: sectionID});

      if (section) {
        //Get the Users current selected sections
        var sectionIds = Meteor.users.findOne(this.userId).sectionIds;
        var currentSections = Sections.find({_id: {$in: sectionIds}, term: Singleton.findOne().evaluationTerm}).fetch();
        for(var i = 0; i < currentSections.length; i++){
          if(currentSections[i].courseId == section.courseId){
            return {error: true, message: "You have already added this course."};
          }
        }
        Meteor.users.update(
          {username: username},
          {
            $addToSet: {sectionIds: section._id}
          }
        );
        return {error: false, message: "Added Course!"};
      }
      else{
        return  {error: true, message: "Not a valid section."};
      }
    }
  }
});
