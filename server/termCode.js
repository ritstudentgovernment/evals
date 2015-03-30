/* Data sources represent term codes differently, e.g., as 2141 -or- 20141.
 * The evaluation system persists all codes as a 5 digit Number.
 */

Meteor.getStdTermCode = function (termCode) {
  return (termCode.length == 5) ? Number(termCode) : Number(termCode[0] + "0" + termCode.substr(1,3));
};
