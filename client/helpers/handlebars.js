Handlebars.registerHelper('isActiveRoute', function(route) {
  return routeUtils.testRoutes(route) ? 'active' : '';
});