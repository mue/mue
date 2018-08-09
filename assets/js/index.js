// start a separate function for each of the things that we need to do

// function construction is part of making the code clearer...
// ...i.e., easier to read and to debug

// the clearer the code, the easier it would be:
// 1.   for the author to return to its development later,
// 2.   for coders unfamiliar with it to understand it...
// 2.1. ...and help improve it,

// the clearer the code, the better it is perceived...
// ...which encourages others in open-source environment...
// ...to maintain, improve and copy it

// further reading:
// https://eloquentjavascript.net/05_higher_order.html

function setDaytimeMessage () {

	// skip the foreplay and get straight to hours...
	// ...since we don't need the Date() anywhere else in the function

	let currentHour = new Date().getHours(),

		getDaytime = () => {

			// if it's morning...

			if (currentHour < 12) { return 'morning' }

			// ...if it's evening...

			else if (currentHour >= 18) { return 'evening' }

			// ...and in all other cases...
			// ...which happens to be afternoon

			else { return 'afternoon' };

			// no need to make code more specific than it needs to be
			// if you can get the desired result without writing more...
			// ...don't write more

		};

	// ideally, one would want to have similar styles of comparison...
	// ...within the same `if-else` structure (< and >, or, <= and >=)...
	// ...but it makes more sense that way

	// separate function for setting an element's `innerHTML`
	// uses template literals and ${}-extrapolation

	// further reading:
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals
	setHTMLContent(".greeting", `Good ${getDaytime()}`);

};

function setRandomBackground () {

	let backgroundClasses = [

		'mountain',
		'sunrise',
		'butterfly',
		'leaves',
		'city',
		'sea',
		'space',
		'ice',
		'house'

	],
	currentBackgroundClass = pickFromArray(backgroundClasses);

	// adds a class from backgroundClasses to <body>

	// using classes to define element attributes is often safer...
	// ...than setting the attributes straight to element's `style`

	document.body.classList.add(currentBackgroundClass);

};

function setRandomQuote () {

	// each quote is an object within the array

	// `text` and `author` go into different elements...
	// ...each of which has its own styling

	// also, semantic separation is important for clarity of code

	// big-enough objects — such as each of the quotes — may be...
	// ...separated by a new line each for clarity

	let quotes = [

		{ text: 'Time goes on. So whatever you’re going to do, do it. Do it now. Don’t wait.', author: 'Robert De Niro' },
		{ text: 'All our dreams can come true, if we have the courage to pursue them.', author: 'Walt Disney' },
		{ text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius'},
		{ text: 'Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.', author: 'Roy T. Bennett'},
		{ text: 'If you believe it will work out, you’ll see opportunities. If you believe it won’t, you will see obstacles', author: 'Wayne Dyer'}

	],
		quote = pickFromArray(quotes);

	setHTMLContent('blockquote', quote.text);
	setHTMLContent('cite',       quote.author);
	
	// little treats of visual alignment, for code beauty's sake

};


function setTime () {

	// we need to save Date() here because we use...
	// ...the same moment of time down the line

	let date = new Date(),

		// instead of performing separate operations for formatting...
		// we store the time unit values already formatted

		time = [

			formatTimeUnit(date.getHours()),
			formatTimeUnit(date.getMinutes()),
			formatTimeUnit(date.getSeconds())

		];

	// joins all of the array elements into a string...
	// ...using the ':' separator

	// i.e. [16, 32, 03] -> "16:32:03"

	setHTMLContent('time', time.join(':'));

};

function init () {

	// initialize everything

	// init() gets executed only when the page is fully loaded...
	// ...which is good practice when dealing with page elements

	// init() serves as a container for all the functions that we require...
	// ...to work at the start of the page

	setDaytimeMessage();
	setRandomBackground();
	setRandomQuote();
	setTime();

	// set interval to update time every second

	// if you don't use milliseconds, updating more often...
	// is wasting CPU resources

	let timeInterval = setInterval(setTime, 1000);

	// ideally, one would want to update only the time unit changed...
	// ...i.e., only seconds if 16:02:32 became 16:02:33

	// this would use even less resources for the same result...
	// ...which is always the goal

};

// initialize on page load through a listener...
// ...which tracks a particular event and executes...
// ...the set function when the event happens

// 'DOMContentLoaded' is the event of 'all HTML has loaded'

// it allows to safely search for and modify HTML nodes

// if a node is searched for while the page hasn't loaded yet...
// ...you will not get the same result and may encounter an error...
// ...which will halt your code execution

document.addEventListener('DOMContentLoaded', init);

// UTILITY FUNCTIONS

// since JavaScript defines variables lazily [1], one can...
// ...semantically separate current and utility functions [2]

// here, utility functions are put to the bottom so they don't pollute...
// ...the workflow — i.e., the part of the code that does most of the work

// [1] lazily means it may already use variables and functions...
//     ...defined later in the code

// [2] utility functions are those that help write better code...
//    ...either by making it more concise, more expressive or both

// formatTimeUnit() is the kind of a pure utility functions

// its purpose is to perform a single action on a single object

// it makes the code look more concise while performing...
// ...with the same effectiveness

function formatTimeUnit (unit) { return unit < 10 ? '0' + unit : unit };

// setHTMLContent is the kind of function is referred to as a 'wrapper'

// its purpose is to make code look better aesthetically...
// ...while performing the same function as...
// ...its straightfoward-yet-ugly equivalent native function

function setHTMLContent (selector, content) { return document.querySelector(selector) .innerHTML = content };

function pickFromArray(array) { return array[Math.floor(Math.random() * (array.length - 1))] };
