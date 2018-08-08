var day = new Date();
var hr = day.getHours();
if (hr < 12) {
document.getElementById("greetingmsg").innerHTML = "Good Morning";
} else
if ((hr == 12 || hr == 13  || hr == 14 || hr == 15 || hr == 16)){
document.getElementById("greetingmsg").innerHTML = "Good Afternoon";
} else
if (hr >= 17) {
document.getElementById("greetingmsg").innerHTML = "Good Evening";
}

var num = Math.ceil( Math.random() * 5 );
document.body.background = 'images/'+num+'.jpeg'; //https://stackoverflow.com/a/15231912
document.body.style.backgroundRepeat = "repeat";

var quotes = ['"Time goes on. So whatever you’re going to do, do it. Do it now. Don’t wait." - Robert De Niro'];
var length = quotes.length;
var rand = Math.round(Math.random()*(length - 1));
document.getElementById("quotemsg").innerHTML = quotes[rand];

setInterval(function() {
  var currentTime = new Date ( );
  var currentHours = currentTime.getHours ( );
  var currentMinutes = currentTime.getMinutes ( );
  var currentSeconds = currentTime.getSeconds ( );
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
  var currentTimeString = currentHours + ":" + currentMinutes + " ";
  document.getElementById("timemsg").innerHTML = currentTimeString;
}, 100);
