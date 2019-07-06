// Settings Modal
const modal2 = document.getElementById('settingsModal');
const btn2 = document.getElementById('openSettingsModal');
const span2 = document.getElementsByClassName('close2')[0];
btn2.onclick = () => { modal2.style.display = 'block'; };
span2.onclick = () => { modal2.style.display = 'none'; };
window.onclick = (event) => { if (event.target === modal2) modal2.style.display = 'none'; };

// Change theme code
const changeCSS = (cssFile, cssLinkIndex) => {
    let oldlink = document.getElementsByTagName('link').item(cssLinkIndex);
    let newlink = document.createElement('link');

    newlink.setAttribute('rel', 'stylesheet');
    newlink.setAttribute('type', 'text/css');
    newlink.setAttribute('href', cssFile);

    document.getElementsByTagName('head').item(0).replaceChild(newlink, oldlink);
}; 

// Load settings
changeCSS(`./assets/css/${localStorage.getItem('theme')}.css`);
if (localStorage.getItem('quotes') === 'off') document.getElementById('quoteText').style.display = 'none', document.getElementById("quoteCheck").checked = true;
if (localStorage.getItem('greeting') === 'off') document.getElementById('greetingText').style.display = 'none', document.getElementById("greetingCheck").checked = true;
if (localStorage.getItem('searchbar') === 'off') document.getElementById('searchBar').style.display = 'none', document.getElementById("searchBarCheck").checked = true;
if (localStorage.getItem('seconds') === 'off') {
	document.getElementById('withSeconds').style.display = 'block';
	document.getElementById('withoutSeconds').style.display = 'none';
}
if (localStorage.getItem('seconds') === 'on') {
	document.getElementById('withSeconds').style.display = 'none';
	document.getElementById('withoutSeconds').style.display = 'block';
	document.getElementById("secondsCheck").checked = true;
}
if (localStorage.getItem('theme') === 'light') {
	document.getElementById("check").checked = true;
}

// Settings functions

// Theme Option
const changeTheme = () => {
    if (document.getElementById('check').checked === true) {
        changeCSS('./assets/css/light.css');
        localStorage.setItem('theme', 'light');
    } else {
        changeCSS('./assets/css/dark.css');
        localStorage.setItem('theme', 'dark');
    }
}

window.changeTheme = changeTheme;

// Quotes Option
const hideQuotes = () => {
	let quoteText = document.getElementById('quoteText');

	if (document.getElementById('quoteCheck').checked === true) {
		quoteText.style.display = 'none';
		localStorage.setItem('quotes', 'off');
    }
	else {
		quoteText.style.display = 'block';
		localStorage.setItem('quotes', 'on');
	}
}

window.hideQuotes = hideQuotes;

// Greeting Option
const hideGreeting = () => {
	let greetingText = document.getElementById('greetingText');

	if (document.getElementById('greetingCheck').checked === true) {
		greetingText.style.display = 'none';
		localStorage.setItem('greeting', 'off');
	}
	else {
		greetingText.style.display = 'block';
		localStorage.setItem('greeting', 'on');
	}
}

window.hideGreeting = hideGreeting;

// Seconds Option
const hideSeconds = () => {
	let withSecondsText = document.getElementById('withSeconds');
	let withoutSecondsText = document.getElementById('withoutSeconds');

	if (document.getElementById('secondsCheck').checked === false) {
		withoutSecondsText.style.display = 'none';
		withSecondsText.style.display = 'block';
		localStorage.setItem('seconds', 'off');
	} if (document.getElementById('secondsCheck').checked === true) {
		withoutSecondsText.style.display = 'block';
		withSecondsText.style.display = 'none';
		localStorage.setItem('seconds', 'on');
	}
	else console.log();
}

window.hideSeconds = hideSeconds;

// Search Bar Option
const hideSearchBar = () => {
	let searchBar = document.getElementById('searchBar');

	if (document.getElementById('searchBarCheck').checked === true) {
		searchBar.style.display = 'none';
		localStorage.setItem('searchbar', 'off');
	}
	else {
		searchBar.style.display = 'block';
		localStorage.setItem('searchbar', 'on');
	}
}
window.hideSearchBar = hideSearchBar;

// Set Engine
const setSearchEngine = (engine) => { localStorage.setItem('engine', engine); };

window.setSearchEngine = setSearchEngine;