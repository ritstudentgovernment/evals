Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('singleton');
  },
  onAfterAction: function () {
    if (Errors.find().fetch().length > 0) {
      $('#errorModal').modal('show');
    }
  }
});

Router.map(function() {
  this.route('jobs', {
    path: '/admin/email-campaigns',
    template: 'admin',
    waitOn: function () {
      return Meteor.subscribe('jobs');
    }
  });
  this.route('datafeed', {
    path: '/admin/data-feed',
    template: 'admin'
  });
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
    waitOn: function () {
      return [Meteor.subscribe('mySections'), Meteor.subscribe('myEvaluations')];
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
