// module.exports is == to exports and can use eitehr
exports.date = function(){

  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}

exports.day = function(){

  let today = new Date();

  let options = {
    weekday: "long",
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}
