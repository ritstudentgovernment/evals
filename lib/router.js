Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {
  this.route('index', {
    path: '/',
    template: 'index'
  });
  this.route('myEvaluations', {
    path: '/myEvaluations',
    template: 'myEvaluations',
    onBeforeAction: function () {
      Deps.autorun(function () {
        if (Meteor.user() && Meteor.user().sectionIds) {
          Meteor.subscribe('mySections');
        } 
      });
      this.next();
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
});
