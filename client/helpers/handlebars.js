var routeUtils = {
  context: function() {
    return Router.current();
  },
  regex: function(expression) {
    return new RegExp(expression, 'i');
  },
  testRoutes: function(routeNames) {
    var reg = this.regex(routeNames);
    return this.context() && reg.test(this.context().route.getName());
  }
};

Handlebars.registerHelper('isActiveRoute', function(route) {
  return routeUtils.testRoutes(route) ? 'active' : '';
});

Handlebars.registerHelper('session', function (input) {
  return Session.get(input);
});

Handlebars.registerHelper('or', function (a, b) {
  return a ? a : b;
});

Handlebars.registerHelper('gte', function (a, b) {
  return a >= b;
});
