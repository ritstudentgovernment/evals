Template.myEvaluations.helpers({
  'timer': function () {
    return Session.get("time");
  },
  'mySections': function () {
    return Sections.find().fetch();
  }
});

Template.myEvaluations.rendered = function () {

  Session.set("time", 20);
  Deps.autorun(function () {
    if (Meteor.userId()) {
      var clock = 20;    
      var timeLeft = function () {
        if (clock > 0) {
          clock--;
          Session.set("time", clock);
        } else {
          Meteor.clearInterval(interval);
        }
      };
      var interval = Meteor.setInterval(timeLeft, 1000);
    }
  });

  Deps.autorun(function () {
    if (Meteor.user() && Meteor.user().sectionIds) {
      Meteor.subscribe('mySections', Meteor.user().sectionIds);
    } 
  });

  Deps.autorun(function () {
    if (!Meteor.user()) {
      $('#loginModal').modal();
    }
  });
};
