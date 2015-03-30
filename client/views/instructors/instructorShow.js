Template.instructorShow.helpers({
  'sections': function () {
    var sections = Sections.find().fetch();
    sections = _.map(_.where(sections, {instructor: this.instructor.name}),
      function (section) {
        return _.pick(section, ['title', 'courseParentNum', 'instructor']);
      }
    );
    return _.uniq(sections, function(section) { return section.courseParentNum; });
  }
});
