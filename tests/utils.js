exports.randomString = randomString;

var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomString(length) {
  if (! length) length = 10;

  var text = "";

  for( var i=0; i < length; i++ )
      text += CHARS.charAt(Math.floor(Math.random() * CHARS.length));

  return text;
}