Job.processJobs('jobs', 'sendEmail',
  function (job, callback) {
    job.log("Job started.", {level: 'info', echo: true});
    HTTP.post(Meteor.settings.ELASTICSEARCH_ENDPOINT, {
      timeout: 15 * 60 * 1000, // 15 Minutes
      data: {
        "query": {
          "query_string": {
            "query": "Mikitsh"
          }
        }
      }
    }, function (error, result) {
      if (error) {
        job.fail("An error occured accessing Elastic Search");
        callback();
      } else {
        job.log("Sending e-mails to " + result.data.hits.total + " Students.");
        job.progress(0, result.data.hits.total);
        sendEmail(result.data, job, callback);
      }
    });
  }
);

function sendEmail (payload, job, callback) {
  var emailsSent = 0;
  async.eachSeries(payload.hits.hits, function (esUser, callback) {
    try {
      if (Meteor.users.getSections(esUser).length != 0) {
        Meteor.ssrEmail('reviewYourCourses', {
          to: [Meteor.users.getESEmail(esUser)],
          from: "sgnoreply@rit.edu",
          subject: "It's time to review your courses.",
        }, {esUser: esUser});
      } else {
        throw Error("Not enrolled in any courses.");
      }
      emailsSent++;
      job.progress(emailsSent, payload.hits.total);
    } catch (err) {
      job.log("Could not e-mail " + Meteor.users.getESEmail(esUser) + " " + err, {level: 'warning', echo: true});
    } finally {
      Meteor.setTimeout(callback, 1000);
    }
  }, function (err) {
    if (err) {
      job.fail("An uncaught error was thrown while sending e-mail.");
    }
    job.done("Job done.");
    callback();
  });
};
