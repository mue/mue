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

const func = require('./modules/func.js');

const init = () => {
	// init() gets executed only when the page is fully loaded
	func.setDaytimeMsg();
	func.setRandBg();
	func.setRandQuote();
	func.setTime();
	// set interval to update time every second
	setInterval(func.setTime, 1000);
};

// initialize on page load through a listener
document.addEventListener('DOMContentLoaded', init);

// Disable right click
const rightClick = () => { return false; }
document.oncontextmenu=rightClick;
