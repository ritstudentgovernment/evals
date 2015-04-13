Meteor.users.attachSchema(new SimpleSchema({
  "evaluationCounts.$.term": {
    type: Number
  },
  "evaluationCounts.$.count": {
    type: Number
  },
  "identity.name": {
    type: String
  },
  "identity.firstName": {
    type: String
  },
  "identity.lastName": {
    type: String
  },
  sectionIds: {
    type: [String],
    optional: true
  },
  // from meteor packages
  username: {
    type: String
  },
  createdAt: {
    type: Date,
    optional: true
  },
  roles: {
    type: [String],
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
}));

Meteor.users.getESEmail = function (esUser) {
  var regex = /[a-zA-Z0-9]+/;
  var matches = regex.exec(esUser._id);
  return matches && matches[0] ? matches[0] + "@rit.edu" : "";
}

// This function excludes resuscitations (e.g., section CHMG-141-02R2-s).
Meteor.users.getSections = function (esUser) {
  var sections = [],
      regex = /rit-section-(\d+)-(\w+-\d+-\d+)-s/;
  _.each(esUser._source.groups, function (group) {
    var matches = regex.exec(group);
    if (matches && matches[1] && matches[2]) {
      var termCode = Meteor.getStdTermCode(matches[1]);
      var sectionCode = matches[2];
      var section = Sections.findOne({term: termCode, courseNum: sectionCode});
      if (section) {
        sections.push(section);
      }
    }
  });
  return sections;
}

Meteor.users.getESUser = function (username) {
  return Async.runSync(function (done) {
    HTTP.post(Meteor.settings.ELASTICSEARCH_ENDPOINT, {
      timeout: 1 * 60 * 1000, // 1 Minute
      data: {
        "query": {
          "query_string": {
            "query": username
          }
        }
      }
    }, function (error, result) {
      if (error) {
        done(error, "An error occured accessing Elastic Search");
      } else {
        done(null, result.data.hits.hits[0]);
      }
    });
  }).result;
}
