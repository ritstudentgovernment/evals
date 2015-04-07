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
    Meteor.users.upsert(query, {$set: query, $setOnInsert: { reviewCount: 0}});
  }
  return exec;
};

LDAP.updateAccountMetadata = function (username) {
  var esUser = Meteor.users.getESUser(username);
  var sectionIds = _.pluck(Meteor.users.getSections(esUser), "_id");
  Meteor.users.update(
    {username: username},
    {
      $set: {
        identity: {
          name: esUser['_source'].name || null,
          firstName: esUser['_source'].firstName || null,
          lastName: esUser['_source'].lastName || null
        }
      },
      $addToSet: {sectionIds: {$each: sectionIds}}
    }
  );
}

Accounts.registerLoginHandler('ldap', function (request) {
  var username = request.username.trim().toLowerCase(),
      auth = LDAP.quickAuth(request);
  if (!auth.error) {
    var user = Meteor.users.findOne({username: username});
    LDAP.updateAccountMetadata(username);
    return {userId: user._id};
  } else {
    return {error: auth.error};
  }
});
