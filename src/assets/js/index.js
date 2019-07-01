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
document.oncontextmenu = () => { return false; };


// Copy quote text
/*const copybtn = document.getElementById('copybtn');
copybtn.onclick = () => {
	const quote = document.getElementById('quote');
    quote.select();
    document.execCommand('copy');
};*/

// News Modal
/*const btn   = document.getElementById('openModal');
const span  = document.getElementsByClassName('close')[0];
const modal = document.getElementById('updateModal');

btn.onclick = () => { modal.style.display = 'block'; }
span.onclick = () => { modal.style.display = 'none'; }
window.onclick = (event) => { if (event.target === modal) modal.style.display = 'none'; }*/

// Settings Modal
const modal2 = document.getElementById('settingsModal');
const btn2 = document.getElementById('openSettingsModal');
const span2 = document.getElementsByClassName('close2')[0];
btn2.onclick = () => { modal2.style.display = 'block'; };
span2.onclick = () => { modal2.style.display = 'none'; };
window.onclick = (event) => { if (event.target === modal2) modal2.style.display = 'none'; };
