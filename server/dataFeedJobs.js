Job.processJobs('datafeedjobs', 'startDataFeed',
  function (job, callback) {
    getSections(job, callback);
  }
);

function getSections (job, callback) {
  job.log("Requesting course data for term " + job.data.term + "...", {level: 'info', echo: true});
  HTTP.call(
    'POST',
    'http://schedule.csh.rit.edu/search/find',
    {
      headers: {accept: 'application/json'},
      params: {term: job.data.term}
    },
    function (err, result) {
      if (err) {
        job.fail("An error occured accessing the data feed.", {level: 'info', echo: true});
      } else {
        job.log("Course data pulled from data feed.", {level: 'info', echo: true});
        insertSections(job, callback, result.data);
      }
    }
  );
};

function insertSections (job, callback, sections) {
  var term = Meteor.getStdTermCode(job.data.term);
  sections.forEach(function (section) {
    // Insert courses
    try {
      Courses.insert({
        id: section.courseId,
        courseId: section.courseId,
        title: section.title,
        courseParentNum: section.courseParentNum,
        term: term,
        online: section.online
      });
    } catch (e) { }
    // Insert instructors
    try {
      Instructors.insert({
        name: section.instructor
      });
    } catch (e) { }
    // Insert Sections
    try {
      Sections.insert({
        id: section.id,
        courseId: section.courseId,
        title: section.title,
        courseNum: section.courseNum,
        courseParentNum: section.courseParentNum,
        online: section.online,
        type: getSectionType(section),
        instructor: section.instructor,
        term: term
      });
    } catch (e) { }
  });
  job.done("Job done.");
  callback();
}

function getSectionType (section) {
  var regex = /[A-Z]+-[0-9]+[A-Z]*-[0-9]+(.)[0-9]+/;
  var matches = regex.exec(section.courseNum);
  if (matches && matches[0] == "L") {
    return "Lab";
  } else if (matches && matches[0] == "R") {
    return "Resuscitation";
  } else if (section.title.indexOf("Lab") != -1) {
    return "Lab";
  } else {
    return "Lecture";
  }
}

/*
 *
 * Prototype code below this line. Not for production use.
 *
 */

function getColleges(job, callback) {
  HTTP.call(
    'POST',
    'https://schedule.csh.rit.edu/entity/getSchoolsForTerm',
    {
      headers: {accept: 'application/json'},
      params: {term: job.data.term}
    },
    function (err, result) {
      if (err) {
        job.fail("An error occured accessing the data feed.");
      } else {
        job.log("Loading colleges.");
        insertColleges(job, callback, result.data);
      }
    }
  );
};

function insertColleges (job, callback, payload) {
  _.each(payload, function (college) {
    try {
      getDepartmentsForCollege(job, callback, college.id);
      Colleges.insert(college);
    } catch (e) {}
  });
};

function getDepartmentsForCollege (job, callback, collegeId) {
  HTTP.call(
    'POST',
    'https://schedule.csh.rit.edu/entity/getDepartments',
    {
      headers: {accept: 'application/json'},
      params: {term: job.data.term, school: collegeId}
    },
    function (err, result) {
      if (err) {
        job.fail("An error occured accessing the data feed.");
      } else {
        insertDepartments(job, callback, result.data);
      }
    }
  );
};

function insertDepartments (job, callback, payload) {
  _.each(payload, function (department) {
    try {
      Departments.insert(department);
    } catch (e) {}
    finally {
    }
  });
};
