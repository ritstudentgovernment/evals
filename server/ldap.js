var ldap = Meteor.npmRequire('ldapjs'),
    assert = Npm.require('assert'),
    Future = Npm.require('fibers/future'),
    LDAP = {};

LDAP.checkAccount = function (options) {

  /*
   * The RIT LDAP load balancer seems to do an inadequate job as some nodes have consistently better
   * performance over others (ordered from slowest to fastest):
   * 10.12.2.8:389
   * 10.12.2.43:389
   * 10.12.2.40:389
   * 10.12.2.11:389
   * 10.12.2.10:389
   */

  LDAP.client = ldap.createClient({url: 'ldap://10.12.2.10', port: 389});

  console.log("starting to bind...");

  return Meteor.sync(function (done) {
    debugger;
    LDAP.client.bind('MAIN\\' + options.username.trim().toLowerCase(), options.password, function (err) {
      if (err) {
        console.log("[ERROR] when binding:");
        console.log(err);
        done(err, null);
      } else {
        var opts = {
          filter: 'uid=' + options.username.trim().toLowerCase(),
          scope: 'sub',
          attributes: ['memberOf', 'sn', 'givenName', 'displayName', 'initials'],
          timeLimit: 10000
        };
        console.log("starting to search...");
        LDAP.client.search('ou=Users,ou=RITusers,dc=main,dc=ad,dc=rit,dc=edu', opts, function (err, res) {
          if (err) {
            console.log("[ERROR] when searching:");
            done(err, null);
          } else {
            res.on('searchEntry', function (entry) {
              console.log("Entry recieved!");
              done(null, entry.object);
            });
          }
        });
      }
    });
  });

  return exec;

};

Accounts.registerLoginHandler('ldap', function (request) {
  var user, userId;
  console.log("checking account...")
  exec = LDAP.checkAccount(request);
  if (!exec.error) {
    console.log("account check succeeded!");
    user = Meteor.users.findOne({
      username: request.username.trim().toLowerCase()
    });
    if (user) {
      userId = user._id;
    } else {
      var name = (exec.result.givenName && exec.result.sn) ? exec.result.givenName + " " + exec.result.sn : null;
      userId = Meteor.users.insert({
        username: request.username.trim().toLowerCase(),
        profile: {
          displayName: exec.result.displayName || null,
          givenName: exec.result.givenName || null,
          initials: exec.result.initials || null,
          sn: exec.result.sn || null,
          name: name
        },
        groups: exec.result.memberOf
      });
    }
    return {
      userId: userId
    };
  } else {
    return {error: exec.error};
  }
});
