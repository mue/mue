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

const func     = require('./modules/func.js');
const settings = require('./modules/settings.js');

const init = () => {
	// init() gets executed only when the page is fully loaded
	func.setDaytimeMsg();
	func.setRandBg();
	func.setRandQuote();
	func.setTime();
	func.setWithoutSeconds();

	if (!localStorage.getItem('seconds') === 'on') return setInterval(func.setWithoutSeconds, 60000);
	else return setInterval(func.setTime, 1000);
};

// initialize on page load through a listener
document.addEventListener('DOMContentLoaded', init);

// Disable right click
document.oncontextmenu = () => { return false; };

// Update modal
const modal = document.getElementById('updateModal');
const btn = document.getElementById('openUpdateModal');
const span = document.getElementsByClassName('close')[0];
btn.onclick = () => { modal.style.display = 'block'; };
span.onclick = () => { modal.style.display = 'none'; };
window.onclick = (event) => { if (event.target === modal) modal.style.display = 'none'; };

// Copy quote text
/*const copybtn = document.getElementById('copybtn');
copybtn.onclick = () => {
	const quote = document.getElementById('quote');
    quote.select();
    document.execCommand('copy');
};*/

function copyQuote() {
    const quote = document.createRange();
    quote.selectNode(document.getElementById('quoteText'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(quote);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}



// Search bar
const search = () => {
	const services = {
		duckduckgo: 'https://duckduckgo.com/?q=',
		google: 'https://google.com/search?q=',
		bing: 'https://bing.com/search?q=',
		yahoo: 'https://search.yahoo.com/search?p=',
		ask: 'https://ask.com/web?q=',
		ecosia: 'https://ecosia.org/search?q='
	}
	const searchvalue = document.getElementById('searchText').value;
	windows.open(services[localStorage.getItem('engine')] + searchvalue, '_self');
	return false;
}

var slider = document.getElementById("slider");
var output = document.getElementById("blurValue");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
};