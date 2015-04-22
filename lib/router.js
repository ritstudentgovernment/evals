Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('singleton');
  },
  onRun: function () {
    GAnalytics.pageview(Router.current().url);
    this.next();
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
    template: 'admin',
    waitOn: function () {
      return Meteor.subscribe('dataFeedJobs');
    }
  });
  this.route('globalSettings', {
    path: '/admin/global-settings',
    template: 'admin'
  })
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
    },
    before: function () {
      Meteor.users
        .find({_id: Meteor.userId()})
        .observe({
          changed: function (newDocument, oldDocument) {
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
              Meteor.subscribe('courseEvaluations', this.params.courseParentNum),
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
              Meteor.subscribe('instructorEvaluations', this.params.name),
              Meteor.subscribe('instructorSections', this.params.name)];
    },
    data: function () {
      return {
        instructor: Instructors.findOne({name: this.params.name})
      }
    }
  });

  //static routes
  this.route('about', {
    path: '/about',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'about'
      };
    }
  });

  this.route('policies', {
    path: '/about/policies',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'policies'
      };
    }
  });

  this.route('privacy', {
    path: '/about/privacy',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'privacy'
      };
    }
  });

  this.route('technology', {
    path: '/about/technology',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'technology'
      };
    }
  });
});
