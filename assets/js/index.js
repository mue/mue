/*
  __  __            
 |  \/  |           
 | \  / |_   _  ___ 
 | |\/| | | | |/ _ \
 | |  | | |_| |  __/
 |_|  |_|\__,_|\___|
 -------------------
 Copyright 2018 Dave R (ohlookitsderpy) 
 Licensed under MIT
 Special thanks to contributors! <3
 GitHub: https://github.com/ohlookitsderpy/Mue
*/

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
	if (nal === 'it' || nal === 'it-ch') itaMessageSet(); //Italian
	else if (nal === 'nl'|| nal === 'nl-be') nlMessageSet(); //Dutch

	else if (nal === 'fr' || nal === 'fr-be'|| nal === 'fr-ca'|| //French
        nal === 'fr-fr'|| nal === 'fr-lu'|| nal === 'fr-mc'||        //French
        nal === 'fr-ch') frMessageSet();                             //French

	else if (nal === 'pt' || nal === 'pt-BR') ptMessageSet();    //Portuguese
	else engMessageSet(); //English
};


function setRandomBackground () {

	let backgroundClasses = [

		'mountain',
		'sunrise',
		'butterfly',
		'leaves',
		'river',
		'sea',
		'space',
		'ice',
		'waterfall',
		'river',
		'sunset',
		'desert',
		'canyon',
		'rose',
		'forest',
		'cherry',
		'clouds',
		'autumn',
		'winter',
		'flowers',
		'sunrise',
		'rocks',
		'trees',
		'mountains',
		'beach'

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

		{ eng: 'Time goes on. So whatever you’re going to do, do it. Do it now. Don’t wait.',
			ita: 'Il tempo passa. Quindi qualunque cosa che farai, falla. Falla ora. Non aspettare',
      			pt: "O tempo continua. Então o que quer que você vai fazer,faça. Faça agora. Não espere.",
			author: 'Robert De Niro' },
		{ eng: 'All our dreams can come true, if we have the courage to pursue them.',
			ita: 'Tutti i nostri sogni possono diventare reali, se abbiamo il coraggio di seguirli.',
      			pt: "Todos os sonhos podem virar verdade,se tivermos a coragem de persegui-los.",
			author: 'Walt Disney' },
		{ eng: 'It does not matter how slowly you go as long as you do not stop.',
			ita: 'Non importa quanto lentamente vai fino a quando non ti fermi',
      			pt: "Não importa o quão devagar você for,desde que você não pare.",
		 	author: 'Confucius'},
		{ eng: 'Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.',
			ita: 'Credi in te stesso. Sei più coraggioso di quanto pensi, più talentuoso di quanto credi, e capace più di quanto puoi immaginare.',
     			pt: "Acredite em si mesmo. Você é mais corajoso que pensa,mais talentoso que sabe,e capaz de mais que imagina.",
			author: 'Roy T. Bennett'},
		{ eng: 'If you believe it will work out, you’ll see opportunities. If you believe it won’t, you will see obstacles',
			ita: 'Se ci credi funzionerà, vedrai delle opportunità. Se non ci credi, vedrai solamente ostacoli',
      			pt: "Se você acredita que vai dar certo,você verá oportunidades. Se você acredita que não vai,você vera obstáculos.",
			author: 'Wayne Dyer'},
		{ eng: 'Everything you’ve ever wanted is on the other side of fear.',
			ita: 'Tutti i tuoi desideri sono opposti alla paura',
      			pt: "",
			author: 'George Addair'},
		{ eng: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
			ita: 'Il successo non è la fine, il fallimento non è fatale: è il coraggio per continuare quello che conta.',
      			pt: "",
			author: 'Winston Churchill'},
		{ eng: 'There is only one thing that makes a dream impossible to achieve: the fear of failure.',
			ita: "C'è solo una cosa che fa i sogni impossibili: la paura di fallire",
      			pt: "",
		 	author: 'Paulo Coelho'},
		{ eng: 'Your true success in life begins only when you make the commitment to become excellent at what you do.',
      			ita: 'Il vero successo nella tua vita inizia solo quando fai il sacrificio per diventare eccellente a quello che ami.',
      			pt: "",
			author: 'Brian Tracy'},
		{ eng: 'Believe in yourself, take on your challenges, dig deep within yourself to conquer fears. Never let anyone bring you down. You got to keep going.',
			ita: "Credi in te stesso, sfida i tuoi problemi, scava nel profondo del tuo io per sconfiggere le tue paure. Mai arrendersi per qualcun'altro. Tu devi continuare.",
      			pt: "",
			author: 'Chantal Sutherland'},
		{ eng: 'Too many of us are not living our dreams because we are living our fears.',
			ita: "Troppe persone non vivono i loro sogni per vivere nelle loro paure",
     			 pt: "",
			author: 'Les Brown'},
		{ eng: 'Hard times don’t create heroes. It is during the hard times when the ‘hero’ within us is revealed.',
			ita: "Tempi difficili non fanno eroi. È durante i tempi duri che \"l'eroe\" in noi viene rivelato.",
      			pt: "",
			author: 'Bob Riley'},
		{ eng: 'If you can tune into your purpose and really align with it, setting goals so that your vision is an expression of that purpose, then life flows much more easily.',
			ita: "Se puoi sintonizzare sul tuo senso e allinearti a quest'ultimo, impostando i tuoi obiettivi in modo che la tua visione sia un'espressione di quel senso, La tua vita scorre molto più facilmente",
     			 pt: "",
    			author: 'Jack Canfield'},
		{ eng: 'Whatever the mind can conceive and believe, it can achieve.',
			ita: "Qualunque cosa la mente può immaginare e crederese, si può realizzare",
     			 pt: "",
			author: 'Napoleon Hill'},
		{ eng: 'Don’t wish it were easier. Wish you were better.',
			ita: "Non desiderare che fosse stato più facile. Desidera che tu fossi stato migliore.",
      			pt: "",
			author: 'Jim Rohn'},
		{ eng: 'A champion is defined not by their wins but by how they can recover when they fall.',
			ita: "Un campione si definisce non dalle sue vittorie ma da come recuperano quando cadono",
      			pt: "",
			author: 'Serena Williams'},
		{ eng: 'Motivation comes from working on things we care about.',
			ita: "La motivazione viene dal lavorare so cose che amiamo",
      			pt: "",
			author: 'Sheryl Sandberg'},
		{ eng: 'With the right kind of coaching and determination you can accomplish anything.',
			ita: "Con il giusto tipo di allenamento e determinazione puoi fare tutto",
     			 pt: "",
			author: 'Reese Witherspoon'},
		{ eng: 'Some people look for a beautiful place. Others make a place beautiful.',
			ita: "Alcune persone cercano un posto indimenticabile. Altre lo transformano in un posto mozzafiato.",
   		   	pt: "",
			author: 'Hazrat Inayat Khan'},
		{ eng: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
			ita: "La vita è come andare in bicicletta. Per tenerti in equilibrio, devi continuare a muoverti",
      			pt: "",
			author: 'Albert Einstein'}
	],
		quote = pickFromArray(quotes);

	if (navigator.language === 'it' || navigator.language === 'it-ch') setHTMLContent('blockquote', quote.ita);
	else if( navigator.language === 'pt' || navigator.language === 'pt-BR') setHTMLContent('blockquote', quote.pt || quote.eng)
	else setHTMLContent('blockquote', quote.eng);

	setHTMLContent('cite', quote.author);

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

// Disable right click

document.oncontextmenu=RightMouseDown;
function RightMouseDown() { return false; }

//Language-Specific-Functions-----------------------------------------------------------------------------------

//English

function engMessageSet() {
        
	let currentHour = new Date().getHours(),

	getDaytime = () => {

		if (currentHour < 12)  return 'morning';       // if it's morning
		else if (currentHour >= 18) return 'evening';  // if it's evening
		else return 'afternoon';               // else, which happens to be afternoon
	};
        setHTMLContent(".greeting", `Good ${getDaytime()}`);
}

//Italian

function itaMessageSet() {
        
	let currentHour = new Date().getHours(),

	getDaytime = () => {

		if (currentHour < 18) return 'giorno';       //In Italian there is just Buongiorno or Buonasera
		else return 'asera';                         //used 'asera' instead of 'sera' for avoiding creating a special case for it
	};
        setHTMLContent(".greeting", `Buon${getDaytime()}`);
}

// Dutch
function nlMessageSet() {
	let hour = new Date().getHours();         // Get the current hour
	let time = 'Goedemiddag';		  // Set the default time string to "Good evening"
	
	if (hour < 12)      time = 'Goedemorgen'; // If it's before 12am, set the time string to "Good morning"
	else if (hour > 18) time = 'Goedenavond'; // If it's after 6pm, set the time string to "Good afternoon"
	else 		    time = 'Goedemiddag'; // If It's unknown, set the time stirng to "Good evening"
	
	setHTMLContent('.greeting', time);	  // Write the string contents to the HTML
}

// French
function frMessageSet() {
	let hour = new Date().getHours();         // Get the current hour
	let time = 'Goedemiddag';		  // Set the default time string to "Good evening"
	
	if (hour < 12)      time = 'Bonjour'; // If it's before 12am, set the time string to "Good morning"
	else if (hour > 18) time = 'Bonne après-midi'; // If it's after 6pm, set the time string to "Good afternoon"
	else 		    time = 'Bonsoir'; // If It's unknown, set the time stirng to "Good evening"
	
	setHTMLContent('.greeting', time);	  // Write the string contents to the HTML
}
