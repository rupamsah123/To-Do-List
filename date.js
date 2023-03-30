
// console.log(module);
// module.export is a javascript object.
exports.getDate = getDate;  // exporting the getDate function from this date.ejs file
function getDate()
{
  const options = { weekday: 'long', month: 'long', day: 'numeric',hour:undefined,minute:undefined,second:undefined };  // date format
  const today = new Date();
  return today.toLocaleDateString ("en-US",options);
    
}

exports.getDay = getDay;  // exporting the getDay function from this date.ejs file
function getDay()
{
  const options = { weekday: 'long'};  // date format
  const today = new Date();
  return today.toLocaleDateString ("en-US",options);
}