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

const fun = require('./modules/fun.js');

const init = () => {
	// init() gets executed only when the page is fully loaded
	fun.setDaytimeMsg();
	fun.setRandBg();
	fun.setRandQuote();
	fun.setTime();
	// set interval to update time every second
	setInterval(fun.setTime, 1000);
};

// initialize on page load through a listener
document.addEventListener('DOMContentLoaded', init);

// Disable right click
const rightClick = () => { return false; }
document.oncontextmenu=rightClick;
