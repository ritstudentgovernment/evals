Handlebars.registerHelper('isActiveRoute', function(route) {
  return routeUtils.testRoutes(route) ? 'active' : '';
});

Handlebars.registerHelper('session', function (input) {
  return Session.get(input);
});

Handlebars.registerHelper('or', function (a, b) {
  return a ? a : b;
});