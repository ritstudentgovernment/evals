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

/* Inspects a user's LDAP groups and pulls section and term data.
 * This data is then mapped to Section document ids.
 */
LDAP.getCourses = function (groups) {
  var sectionIds = [],
      regex = /(\d{4})-([a-zA-Z]+-\d{3}-\d{2})/;
  groups.forEach(function (group) {
    var results = regex.exec(group);
    if (results && results.length == 3) {
      var query = {
        term: parseInt(results[1].substr(0, 1) + "0" + results[1].substr(1)),
        courseNum: results[2]
      };
      console.log("query", query);
      var section = Sections.findOne(query);
      if (section) {
        console.log("we got it");
        sectionIds.push(section._id);
      }
    }
  });
  return sectionIds;
}

LDAP.updateAccountMetadata = function (options, exec) {
  if (!exec.error) {
    var name = (exec.result.givenName && exec.result.sn) ?
      exec.result.givenName + " " + exec.result.sn : null;
    var username = options.username.trim().toLowerCase();
    Meteor.users.update(
      {username: username},
      {
        $set: {
          profile: {
            displayName: exec.result.displayName || null,
            givenName: exec.result.givenName || null,
            initials: exec.result.initials || null,
            sn: exec.result.sn || null,
            name: name
          }
        },
        $addToSet: {sectionIds: {$each: LDAP.getCourses(exec.result.memberOf)}}
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
