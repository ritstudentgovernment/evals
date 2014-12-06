Template.myEvaluations.rendered = function () {
  if (!Meteor.user()) {
    $('#loginModal').modal();
  }
}