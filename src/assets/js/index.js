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

const functions = require('./modules/functions.js');

const init = () => {

 
	// init() gets executed only when the page is fully loaded

	functions.setDaytimeMessage();
	functions.setRandomBackground();
	functions.setRandomQuote();
	functions.setTime();

	// set interval to update time every second

	let timeInterval = setInterval(functions.setTime, 1000);
};

// initialize on page load through a listener

document.addEventListener('DOMContentLoaded', init);

// Disable right click

document.oncontextmenu=RightMouseDown;
function RightMouseDown() { return false; }
