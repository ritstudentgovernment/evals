Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {
  this.route('index', {
    path: '/',
    template: 'index'
  });
  this.route('search', {
    path: '/search',
    template: 'search'
  });
  this.route('evaluationsShow', {
    path: '/evaluations',
    template: 'evaluationsShow',
    onBeforeAction: function () {
      Deps.autorun(function () {
        if (Meteor.user() && Meteor.user().sectionIds) {
          Meteor.subscribe('mySections');
        } 
      });
      this.next();
    }
  });
  this.route('evaluationNew', {
    path: '/evaluations/:sectionId',
    template: 'evaluationNew',
    waitOn: function () {
      return [Meteor.subscribe('sectionById', this.params.sectionId)];
    },
    data: function () {
      return {
        section: Sections.findOne({id: this.params.sectionId})
      }
    }
  });
  this.route('courseShow', {
    path: '/courses/:courseParentNum',
    template: 'courseShow',
    waitOn: function() {
      return [Meteor.subscribe('course', this.params.courseParentNum),
              Meteor.subscribe('courseSections', this.params.courseParentNum)];
    },
    data: function () {
      return {
        course: Courses.findOne({courseParentNum: this.params.courseParentNum})
      }
    }
  });
  this.route('instructorShow', {
    path: '/professors/:name',
    template: 'instructorShow',
    waitOn: function () {
      return [Meteor.subscribe('instructor', this.params.name),
              Meteor.subscribe('instructorSections', this.params.name)];
    },
    data: function () {
      return {
        instructor: Instructors.findOne({name: this.params.name})
      }
    }
  });
});
