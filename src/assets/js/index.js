/*
█████████████████████████████████████████████████████████████                                                                        
██                                                         ██
██           ███    ███ ██    ██ ███████                   ██  
██           ████  ████ ██    ██ ██                        ██ 
██           ██ ████ ██ ██    ██ █████                     ██ 
██           ██  ██  ██ ██    ██ ██                        ██ 
██           ██      ██  ██████  ███████                   ██ 
██                                                         ██ 
██                                                         ██                                                                                                 
██      Copyright 2018-2019 David Ralph (ohlookitsderpy)   ██
██                 Licensed under MIT                      ██                    
██      GitHub: https://github.com/ohlookitsderpy/Mue      ██
██                                                         ██
██          Special thanks to contributors! <3             ██
█████████████████████████████████████████████████████████████
*/

const functions = require('./modules/function.js');

const init = () => {
	// init() gets executed only when the page is fully loaded
	functions.setDaytimeMessage();
	functions.setRandomBackground();
	functions.setRandomQuote();
	functions.setTime();
	// set interval to update time every second
	setInterval(functions.setTime, 1000);
};

// initialize on page load through a listener
document.addEventListener('DOMContentLoaded', init);

// Disable right click
function RightMouseDown() { return false; }
document.oncontextmenu=RightMouseDown;
