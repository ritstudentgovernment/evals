Meteor.users.getESEmail = function (esUser) {
  return esUser._id + "@rit.edu";
}

// This function excludes resuscitations (e.g., section CHMG-141-02R2-s).
Meteor.users.getSections = function (esUser) {
  var sections = [],
      regex = /rit-section-(\d+)-(\w+-\d+-\d+)-s,/;
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
  if (sections.length == 0) {
    throw Error("Not enrolled in any courses.");
  } else {
    return sections;
  }
}
