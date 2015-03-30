Meteor.startup(function () {
  SSR.compileTemplate('reviewYourCourses', Assets.getText('reviewYourCourses.html'));

  var fs = Npm.require('fs');
  var cssName = _.find(Object.keys(WebAppInternals.staticFiles), function (fileName) { return /.css$/.test(fileName) });
  var cssPath = WebAppInternals.staticFiles[cssName].absolutePath;
  var css = fs.readFileSync(cssPath);

  Meteor.ssrEmail = function (template, emailOpts, data) {
    var html = SSR.render(template, data);
    var htmlWithInlineCss = juice(html, {extraCss: css});
    emailOpts.html = htmlWithInlineCss;
    if (!emailOpts.attachmentOptions) {
      emailOpts.attachmentOptions = [];
    }
    emailOpts.attachmentOptions.push({
      fileName: "sg.png",
      contents: Assets.getBinary('sg.png'),
      cid: 'sg.png'
    });
    EmailAtt.send(emailOpts);
  };

});
