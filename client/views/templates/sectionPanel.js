Template.sectionPanel.helpers({
  sections: function () {
    var singleton = Singleton.findOne();
    Meteor.call('sectionsForCourse',
      this.course.courseParentNum,
      Singleton.findOne().evaluationTerm,
      function (err, result) {
        Session.set('sectionsForCourse', result);
      }
    );
    return Session.get('sectionsForCourse');
  },
});

Template.sectionPanel.events({
  'click .addEvalBtn': function (event, template) {
    var sectionId = event.toElement.id;
    var sectionNum = event.toElement.attributes.courseNum.value;
    var options = {
      sectionID: sectionNum
    }
    Meteor.call('addCourse',options, function (result) {
      Router.go('evaluationNew', {"sectionId": sectionId});
    });

  }
});
