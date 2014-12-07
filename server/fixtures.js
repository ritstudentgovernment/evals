// Load initial section data

if (Sections.find().count() === 0) {
  console.log("Refreshing sections table...");
  HTTP.call(
    'POST',
    'http://schedule.csh.rit.edu/search/find',
    {
      headers: {accept: 'application/json'},
      params: {term: 20141}
    },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        result.data.forEach(function insertSection (section) {
          try {
            Courses.insert({
              courseId: section.courseId,
              courseParentNum: section.courseParentNum,
              title: section.title
            });
          } catch (e) {}
          try {
            Instructors.insert({name: section.instructor});
          } catch (e) {}
          Sections.insert(_.extend(section, {term: 20141}));
        });
      }
    }
  );
}
