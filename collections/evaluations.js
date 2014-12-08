/** Evaluations
  *
  * Structure
  *
  * {
  *   authorId:           <mongoId>    // author's id
  *   helpfulness:        <integer>    // how helpful was the instructor (0-5)
  *   clarity:            <integer>    // how clear was the instructor (0-5)
  *   fairness:           <integer>    // how fair was the instructor (0-5)
  *   responsiveness:     <integer>    // how responsive was the instructor to giving feedback (0-5)
  *   retakeInstructor:   <boolean>    // if evaluator would re-take the instructor
  *   instructorComments: <string>     // evaluator comments about the instructor
  *   hours:              <integer>    // avg hours per week evaluator spent on course 
  *   textbook:           <boolean>    // if textbook required for course
  *   oldTextbook:        <boolean>    // if an older textbook version is acceptable for course
  *   retakeCourse:       <boolean>    // if evaluator would re-take the course
  *   courseComments:     <string>     // evaluator comments about the course
  * 
  * }
  *
  */

Evaluations = new Meteor.Collection('evaluations');
