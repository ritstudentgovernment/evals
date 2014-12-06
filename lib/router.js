Router.configure({
  layoutTemplate: 'layout',
});

Router.map(function() {
  this.route('index', {
    path: '/',
    template: 'index'
  });
  this.route('myEvaluations', {
    path: '/myEvaluations',
    template: 'myEvaluations'
  });
});
