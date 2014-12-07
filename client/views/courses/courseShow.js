Template.courseShow.helpers({
  'instructors': function () {
    var sections = Sections.find().fetch();
    return _.uniq(_.pluck(_.where(sections, {courseParentNum: this.course.courseParentNum}), 'instructor'));
  }
});