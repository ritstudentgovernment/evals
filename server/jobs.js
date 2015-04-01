Job.processJobs('jobs', 'sendEmail',
  function (job, callback) {
    job.log("Job started.", {level: 'info', echo: true});
    HTTP.post(Meteor.settings.ELASTICSEARCH_ENDPOINT, {
      timeout: 15 * 60 * 1000, // 15 Minutes
      data: {
        "query": {
          "query_string": {
            "query": "_id:pam3961"
          }
        }
      }
    }, function (error, result) {
      if (error) {
        job.fail("An error occured accessing Elastic Search");
        callback();
      } else {
        sendEmail(result.data, job, callback);
      }
    });
  }
);

function sendEmail (payload, job, callback) {
  async.eachLimit(payload.hits.hits, 5, emailUser, function (err) {
    err ? job.fail("An error occured sending e-mail") : job.done("Job done.");
    callback();
  });
};

function emailUser (esUser, callback) {
  Meteor.ssrEmail('reviewYourCourses', {
    to: [Meteor.users.getESEmail(esUser)],
    from: "sgnoreply@rit.edu",
    subject: "It's time to review your courses.",
  }, {esUser: esUser});
  callback();
};
