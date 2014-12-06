var ldap = Meteor.npmRequire('ldapjs'),
    assert = Npm.require('assert'),
    Future = Npm.require('fibers/future'),
    LDAP = {};

/* To enhance usability, we authenticate as quickly as possible
 * and return to the client. User data can be scraped in later
 * async calls.
 */
LDAP.quickAuth = function (options) {
  var username = options.username.trim().toLowerCase();
  LDAP.quickClient = ldap.createClient({url: 'ldaps://ldap.rit.edu'});
  var exec = Meteor.sync(function (done) {
    var bindDN = 'uid=' + username + ',ou=People,dc=rit,dc=edu';
    LDAP.quickClient.bind(bindDN, options.password, function onQuickLDAPBind (err) {
      done(err);
    });
  });
  if (!exec.err) {
    var query = {username: username};
    Meteor.users.upsert(query, {$set: query});
  }
  return exec;
};

/* Only to be called iff a successful quickAuth occured.
 * Scrapes LDAP information and adds it to our database.
 */
LDAP.getAccountMetadata = function (options) {
  /* The RIT LDAP load balancer seems to do an inadequate job
   * as some nodes have consistently better performance
   * over others (ordered from slowest to fastest):
   * 10.12.2.8:389
   * 10.12.2.43:389
   * 10.12.2.40:389
   * 10.12.2.11:389
   * 10.12.2.10:389
   */
  LDAP.client = ldap.createClient({
    url: 'ldaps://10.12.2.11:636',
    tlsOptions: {
      rejectUnauthorized: false
    }
  });
  var username = options.username.trim().toLowerCase();
  var bindDN = 'MAIN\\' + username;
  return Meteor.sync(function (done) {
    LDAP.client.bind(bindDN, options.password, function onLDAPBind (err) {
      if (err) {
        done(err);
      } else {
        var baseDN = 'ou=Users,ou=RITusers,dc=main,dc=ad,dc=rit,dc=edu';
        var opts = {
          filter: 'uid=' + username,
          scope: 'sub',
          attributes: ['memberOf', 'sn', 'givenName', 'displayName', 'initials'],
          timeLimit: 10000
        };
        LDAP.client.search(baseDN, opts, function onLDAPSearch (err, res) {
          if (err) {
            done(err)
          } else {
            res.on('searchEntry', function (entry) {
              done(err, entry.object);
            });
          }
        });
      }
    });
  });
};

LDAP.updateAccountMetadata = function (options, exec) {
  if (!exec.error) {
    var name = (exec.result.givenName && exec.result.sn) ?
      exec.result.givenName + " " + exec.result.sn : null;
    var username = options.username.trim().toLowerCase();
    Meteor.users.update(
      {username: username},
      {$set: {
        profile: {
          displayName: exec.result.displayName || null,
          givenName: exec.result.givenName || null,
          initials: exec.result.initials || null,
          sn: exec.result.sn || null,
          name: name
        },
        groups: exec.result.memberOf}
      }
    );
  }
}

Accounts.registerLoginHandler('ldap', function (request) {
  var username = request.username.trim().toLowerCase(),
      auth = LDAP.quickAuth(request);
  if (!auth.error) {
    var user = Meteor.users.findOne({username: username});
    Meteor.setTimeout(function() { LDAP.updateAccountMetadata(request, LDAP.getAccountMetadata(request)) }, 0);
    return {userId: user._id};
  } else {
    return {error: auth.error};
  }
});
