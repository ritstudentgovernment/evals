Job.processJobs('datafeedjobs', 'startDataFeed',
  function (job, callback) {
    getSections(job, callback);
  }
);

function getSections (job, callback) {
  job.log("Requesting course data for term " + job.data.term + "...", {level: 'info', echo: true});
  HTTP.call(
    'POST',
    Meteor.settings.COURSEDATA_ENDPOINT + '/search/find',
    {
      headers: {accept: 'application/json'},
      params: {
        term: job.data.term,
        college: "any",
        department: "any",
        level: "any",
        online: true,
        honors: true,
        offCampus: true
      }
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
    var start = "";
    var end = "";
    var days = "";

    if(section.times){
      start = section.times[0].start;
      end = section.times[0].end;
      var time = "";
      for(var i = 0; i < section.times.length; i++){

        var curTime = convertTime(section.times[i].start, section.times[i].end);

        var day = "";
        switch(section.times[i].day) {
          case '1':
              if(days.indexOf("Mon") == -1){
                day = "Mon";
              }
              break;
          case '2':
              if(days.indexOf("Tue") == -1){
                day = "Tue";
              }
              break;
          case '3':
              if(days.indexOf("Wed") == -1){
                day = "Wed";
              }
              break;
          case '4':
              if(days.indexOf("Thu") == -1){
                day = "Thu";
              }
              break;
          case '5':
              if(days.indexOf("Fri") == -1){
                day = "Fri";
              }
              break;
          case '6':
              if(days.indexOf("Sat") == -1){
                day = "Sat";
              }
              break;
          case '0':
              if(days.indexOf("Sun") == -1){
                day = "Sun";
              }
              break;
        }
        if (i != 0 && day != ""){
          days += ", ";  
        }else{
          time = curTime;
        }
        days += day;
        if(curTime != time){

          time = curTime;
        }
      }
      days += " " + time + " ";
    }



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
        term: term,
        start: start,
        end: end,
        day: days
      });
    } catch (e) {
      console.log(e);
     }
  });
  job.done("Job done.");
  callback();
}

function convertTime(totalStartMin, totalEndMin){
    var startHour = Math.floor(totalStartMin / 60);
    var startMin = totalStartMin % 60;
    if(startMin == 0){
      startMin = "00";
    }
    var endHour = Math.floor(totalEndMin / 60);
    var endMin = totalEndMin % 60;
    if(endMin == 0){
      endMin = "00";
    }
    var startType = "AM";
    var endType = "AM";
    if (startHour >= 12) {
        startHour = startHour - 12;
        startType = "PM";
    }
    if(endHour >= 12){
      endHour = endHour - 12;
      endType = "PM";
    }
    if(startHour == 0){
      startHour = 12;
    }
    if(endHour == 0){
      endHour = 12;
    }

    var string = startHour +":" + startMin + " " + startType + " - " + endHour + ":" + endMin + " " + endType;
    return string;

}

function getSectionType (section) {
  var regex = /[A-Z]+-[0-9]+[A-Z]*-[0-9]+(.)[0-9]+/;
  var matches = regex.exec(section.courseNum);
  var sectionTypeRegex = /(Lab($|\s))/;
  var sectionTypeMatches = sectionTypeRegex.exec(section.title);
  if ((sectionTypeMatches && sectionTypeMatches[1] == "Lab") || (matches && matches[1] == "L")) {
    return "Lab";
  } else if (matches && matches[1] == "R") {
    return "Resuscitation";
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
    Meteor.settings.COURSEDATA_ENDPOINT + '/entity/getSchoolsForTerm',
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
    Meteor.settings.COURSEDATA_ENDPOINT + '/entity/getDepartments',
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
