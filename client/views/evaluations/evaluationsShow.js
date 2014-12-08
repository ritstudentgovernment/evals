Template.evaluationsShow.helpers({
  'timer': function () {
    return Session.get("time");
  },
  'mySections': function () {
    return Sections.find().fetch();
  }
});

Template.evaluationsShow.rendered = function () {

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
    if (!Meteor.user()) {
      $('#loginModal').modal();
    }
  });
};
