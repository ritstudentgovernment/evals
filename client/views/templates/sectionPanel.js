Template.sectionPanel.helpers({
  sections: function () {
    var singleton = Singleton.findOne();
    var parentNum = "";
    var selectedItem = Session.get("selectedItem");
    if(selectedItem){
      if(selectedItem.type == "professor"){
        console.log("Selected but pro");
        Meteor.call('sectionsForProfessor',
          selectedItem.name,
          Singleton.findOne().evaluationTerm,
          function (err, result) {
            Session.set('sectionsForCourse', result);
          }
        );
      }else{
        console.log("Selected but not");
        parentNum = this.courseParentNum;
        Meteor.call('sectionsForCourse',
          parentNum,
          Singleton.findOne().evaluationTerm,
          function (err, result) {
            Session.set('sectionsForCourse', result);
          }
        );
      }
    }else{
      console.log("Not selectedItem");
      if(this.course){
        parentNum = this.course.courseParentNum;
      }else{
        parentNum = this.courseParentNum;
      }
      console.log(parentNum);
      Meteor.call('sectionsForCourse',
        parentNum,
        Singleton.findOne().evaluationTerm,
        function (err, result) {
          console.log(result);
          Session.set('sectionsForCourse', result);
        }
      );
    }
    return Session.get('sectionsForCourse');
  },
});

Template.sectionPanel.events({
  'click .addEvalBtn': function (event, template) {
    var sectionId = event.currentTarget.id;
    var sectionNum = event.currentTarget.attributes.courseNum.value;
    var options = {
      sectionID: sectionNum
    }
    var session = Session.get('selectedItem');
    Meteor.call('addCourse',options, function (error, result) {
      if(error){

      }else{
        if(!result.error){
          if(!session){
            Router.go('evaluationNew', {"sectionId": sectionId});
          }else{
            $("#" + session.id).collapse('hide');
            Session.set('selectedItem', undefined);
          }
        }else{
          throwError(result.message);
        }
      }
    });
  }
});


Template.professorSectionPanel.helpers({
  sections: function () {
    var singleton = Singleton.findOne();
    var selectedItem = Session.get("selectedItem");
    Meteor.call('sectionsForProfessor',
      selectedItem.name,
      Singleton.findOne().evaluationTerm,
      function (err, result) {
        Session.set('sectionsForCourse', result);
      }
    );
    return Session.get('sectionsForCourse');
  },
});

Template.professorSectionPanel.events({
  'click .addEvalBtn': function (event, template) {
    var sectionId = event.currentTarget.id;
    var sectionNum = event.currentTarget.attributes.courseNum.value;
    var options = {
      sectionID: sectionNum
    }
    var session = Session.get('selectedItem');
    Meteor.call('addCourse',options, function (error, result) {
      if(error){

      }else{
        if(!result.error){
          if(!session){

          }else{
            $("#" + session.id).collapse('hide');
            Session.set('selectedItem', undefined);
          }
        }else{
          throwError(result.message);
        }
      }
    });
  }
});
