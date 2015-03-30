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
        job.log("An error occured accessing Elastic Search.", {level: 'danger', echo: true});
        callback();
      } else {
        sendEmail(result.data, job, callback);
      }
    });
  }
);

function sendEmail (payload, job, callback) {
  async.eachLimit(payload.hits.hits, 5, emailUser, function (err) {
    job.log("Job completed.", {level: 'info', echo: true});
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
