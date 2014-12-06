Template.login.events({
  'submit form': function(event, template) {
    Session.set('loginError', null);
    event.preventDefault();
    return Accounts.callLoginMethod({
      methodArguments: [{username: template.find('#username').value,
                        password: template.find('#password').value}],
      userCallback: function (err, user) {
        if (err) {
          console.log(err);
          $(template.find('.modal-content')).shake(2,5,200);
        } else {
          $(template.find('#loginModal')).modal("hide");
          template.find('#username').value = "";
          template.find('#password').value = "";
        }
      }
    });
  }
});

Template.header.events({
  'click #logout-button': function(event, template) {
    event.preventDefault();
    return Meteor.logout();
  }
});
