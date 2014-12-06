Handlebars.registerHelper('isActiveRoute', function(route) {
  return routeUtils.testRoutes(route) ? 'active' : '';
});

Handlebars.registerHelper('session', function (input) {
  return Session.get(input);
});
