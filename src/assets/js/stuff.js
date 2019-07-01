
const changeCSS = (cssFile, cssLinkIndex) => {
    let oldlink = document.getElementsByTagName('link').item(cssLinkIndex);
    let newlink = document.createElement('link');

    newlink.setAttribute('rel', 'stylesheet');
    newlink.setAttribute('type', 'text/css');
    newlink.setAttribute('href', cssFile);

    document.getElementsByTagName('head').item(0).replaceChild(newlink, oldlink);
}; 

changeCSS(`./assets/css/${localStorage.getItem('theme')}.css`);

const changeTheme = () => {
    let themeBox = document.getElementById('check');
    if (themeBox.checked === true) {
        changeCSS('./assets/css/light.css');
        localStorage.setItem('theme', 'light');
    } else {
        changeCSS('./assets/css/dark.css');
        localStorage.setItem('theme', 'dark');
    }
}

const hideQuotes = () => {
	let quoteBox = document.getElementById('quoteCheck');
	let quoteText = document.getElementById('quoteText');

	if (quoteBox.checked === true) quoteText.style.display = 'none';
	else quoteText.style.display = 'block';
}

const hideGreeting = () => {
	let greetingBox = document.getElementById('greetingCheck');
	let greetingText = document.getElementById('greetingText');

	if (greetingBox.checked === true) greetingText.style.display = 'none';
	else greetingText.style.display = 'block';
}

const hideSeconds = () => {
	let secondsBox = document.getElementById('secondsCheck');
	let withSecondsText = document.getElementById('withSeconds');
	let withoutSecondsText = document.getElementById('withoutSeconds');

	if (secondsBox.checked === true) {
		withoutSecondsText.style.display = 'block';
		withSeconds.style.display = 'none';
	} else {
		withSeconds.style.display = 'block';
		withoutSecondsText.style.display = 'none';
	}
}