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
██       Copyright 2018 Dave R (ohlookitsderpy)            ██
██                 Licensed under MIT                      ██                    
██      GitHub: https://github.com/ohlookitsderpy/Mue      ██
██                                                         ██
██          Spanish Translation made by: Pepehound         ██
██        Portuguese Translation made by: Candystick       ██
██         Italian Translation made by: Yanderella         ██
██          Dutch Translation made by: Wesselgame          ██
██         French Translation made by: Yanderealla         ██
██                                      & ohlookitsderpy   ██
██                                                         ██
██          Special thanks to contributors! <3             ██
█████████████████████████████████████████████████████████████
*/

//From cirnornd.js
function randomInt(min, max) {   
	let badArg = new Error("Bad args ;-;");
	
	try {
		if( typeof min != 'number' || typeof max != 'number' ) throw badArg;
		min += 1
		return Math.floor(Math.random() * (max - min + 1)) + min;
	
	} catch (error) {
    return error;
  }
}

var contains = function(needle) {

    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};


let nal = navigator.language;

let itcodes = ['it', 'it-IT', 'it-CH'];
let nlcodes = ['nl', 'nl-BE'];
let frcodes = ['fr', 'fr-BE', 'fr-CA', 'fr-FR', 'fr-LU', 'fr-MC', 'fr-CH'];
let ptcodes = ['pt', 'pt-BR'];
let spcodes = ['es', 'es-AR', 'es-BO', 'es-CL', 'es-CO', 'es-CR', 'es-DO', 
			   'es-EC', 'es-ES', 'es-GT', 'es-HN', 'es-MX', 'es-NI', 'es-PA', 
			   'es-PE', 'es-PR', 'es-PY', 'es-SV', 'es-UY', 'es-VE'];

function setDaytimeMessage () {
	if      ( contains.call(itcodes, nal) ) itMessageSet(); //Italian
	else if ( contains.call(nlcodes, nal) ) nlMessageSet(); //Dutch
	else if ( contains.call(frcodes, nal) ) frMessageSet(); //French
	else if ( contains.call(ptcodes, nal) ) ptMessageSet(); //Portuguese
	else if ( contains.call(spcodes, nal) ) spMessageSet();
	else     engMessageSet();                               //English
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

	document.body.classList.add(currentBackgroundClass);

};

function setRandomQuote () {

	let quotes = {
		eng: [
		       'Time goes on. So whatever you’re going to do, do it. Do it now. Don’t wait.',
		       'All our dreams can come true, if we have the courage to pursue them.',
		       'It does not matter how slowly you go as long as you do not stop.',
		       'Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.',
		       'If you believe it will work out, you’ll see opportunities. If you believe it won’t, you will see obstacles',
		       'Everything you’ve ever wanted is on the other side of fear.',
		       'Success is not final, failure is not fatal: it is the courage to continue that counts.',
		       'There is only one thing that makes a dream impossible to achieve: the fear of failure.',
		       'Your true success in life begins only when you make the commitment to become excellent at what you do.',
		       'Believe in yourself, take on your challenges, dig deep within yourself to conquer fears. Never let anyone bring you down. You got to keep going.',
		       'Too many of us are not living our dreams because we are living our fears.',
		       'Hard times don’t create heroes. It is during the hard times when the ‘hero’ within us is revealed.',
		       'If you can tune into your purpose and really align with it, setting goals so that your vision is an expression of that purpose, then life flows much more easily.',
		       'Whatever the mind can conceive and believe, it can achieve.',
		       'Don’t wish it were easier. Wish you were better.',
		       'A champion is defined not by their wins but by how they can recover when they fall.',
		       'Motivation comes from working on things we care about.',
		       'With the right kind of coaching and determination you can accomplish anything.',
		       'Some people look for a beautiful place. Others make a place beautiful.',
		       'Life is like riding a bicycle. To keep your balance, you must keep moving.',
			
		],
		ita: [
			'Il tempo passa. Quindi qualunque cosa che farai, falla. Falla ora. Non aspettare',
			'Tutti i nostri sogni possono diventare reali, se abbiamo il coraggio di seguirli.',
			'Non importa quanto lentamente vai fino a quando non ti fermi',
			'Credi in te stesso. Sei più coraggioso di quanto pensi, più talentuoso di quanto credi, e capace più di quanto puoi immaginare.',
			'Se ci credi funzionerà, vedrai delle opportunità. Se non ci credi, vedrai solamente ostacoli',
			'Tutti i tuoi desideri sono opposti alla paura',
			'Il successo non è la fine, il fallimento non è fatale: è il coraggio per continuare quello che conta.',
			"C'è solo una cosa che fa i sogni impossibili: la paura di fallire",
			'Il vero successo nella tua vita inizia solo quando fai il sacrificio per diventare eccellente a quello che ami.',
			"Credi in te stesso, sfida i tuoi problemi, scava nel profondo del tuo io per sconfiggere le tue paure. Mai arrendersi per qualcun'altro. Tu devi continuare.",
			"Troppe persone non vivono i loro sogni per vivere nelle loro paure",
			"Tempi difficili non fanno eroi. È durante i tempi duri che \"l'eroe\" in noi viene rivelato.",
			"Se puoi sintonizzare sul tuo senso e allinearti a quest'ultimo, impostando i tuoi obiettivi in modo che la tua visione sia un'espressione di quel senso, La tua vita scorre molto più facilmente",
			"Qualunque cosa la mente può immaginare e crederese, si può realizzare",
			"Non desiderare che fosse stato più facile. Desidera che tu fossi stato migliore.",
			"Un campione si definisce non dalle sue vittorie ma da come recupera quando cade",
			"La motivazione viene dal lavorare so cose che amiamo",
			"Con il giusto tipo di allenamento e determinazione puoi fare tutto",
			"Alcune persone cercano un posto indimenticabile. Altre lo transformano in un posto mozzafiato.",
			"La vita è come andare in bicicletta. Per tenerti in equilibrio, devi continuare a muoverti"
		],
		spa: [
			"El tiempo continúa. Así que lo que sea que vayas a hacer, hazlo. Hazlo ahora. No esperes",
			"Todos nuestros sueños pueden hacerse realidad, si tenemos el coraje de perseguirlos.",
			"No importa qué tan lento vayas, siempre y cuando no te detengas.",
			"Cree en ti mismo. Eres más valiente de lo que crees, más talentoso de lo que sabes y capaz de más de lo que imaginas.",
			"Si crees que funcionará, verás oportunidades. Si crees que no, verás obstáculos ",
			"Todo lo que siempre has querido está al otro lado del miedo",
			"El éxito no es definitivo, el fracaso no es fatal: el coraje para continuar es lo que cuenta",
			"Solo hay una cosa que hace que un sueño sea imposible de lograr: el miedo al fracaso",
			"Tu verdadero éxito en la vida comienza solo cuando te comprometes a ser excelente en lo que haces",
			"Cree en ti mismo, asume tus desafíos, excava profundo dentro de ti mismo para vencer tus miedos. Nunca dejes que nadie te derribe. Tienes que seguir adelante.",
			"Muchos de nosotros no estamos viviendo nuestros sueños porque estamos viviendo nuestros miedos",
			"Los tiempos difíciles no crean héroes. Es durante los momentos difíciles en que se revela el héroe dentro de nosotros.",
			"Si  puedes sincornizarte con tu propósito, y realmente alinearte con él, estableciendo metas para que tu visión sea una expresión de ese propósito, entonces la vida fluye mucho más fácilmente",
			"Lo que la mente pueda concebir y creer, lo puede lograr",
			"No desees que sea fácil. Desea ser mejor.",
			"Un campeón se define no por sus victorias, sino por cómo pueden recuperarse cuando caen",
			"La motivación viene de trabajar en cosas que nos importan",
			"Con el entrenamiento y la determinación adecuados, puedes lograr cualquier cosa",
			"Algunas personas buscan un lugar hermoso. Otras, hacen un lugar hermoso.",
		],
		pt: [
			"O tempo continua. Então o que quer que você vai fazer,faça. Faça agora. Não espere.",
			"Todos os sonhos podem virar verdade,se tivermos a coragem de persegui-los.",
			"Não importa o quão devagar você for,desde que você não pare.",
			"Acredite em si mesmo. Você é mais corajoso que pensa,mais talentoso que sabe,e capaz de mais que imagina.",
			"Se você acredita que vai dar certo,você verá oportunidades. Se você acredita que não vai,você vera obstáculos.",
		],
		authors: ['Robert De Niro', 'Walt Disney', 'Confucius', 'Roy T. Bennett', 'Wayne Dyer', 'George Addair', 'Winston Churchill', 'Paulo Coelho',
				 'Brian Tracy', 'Chantal Sutherland', 'Les Brown', 'Bob Riley', 'Jack Canfield', 'Napoleon Hill', 'Jim Rohn', 'Serena Williams',
				 'Sheryl Sandberg', 'Reese Witherspoon', 'Hazrat Inayat Khan', 'Albert Einstein']

	};
	let id = getRandIndex( quotes.authors );
	
	//nal = navigator.language
	
	if ( contains.call(itcodes, nal) ) setHTMLContent('blockquote', quotes.ita[id]);
	else if( contains.call(ptcodes, nal) ) setHTMLContent('blockquote', quotes.pt[id] || quotes.eng[id]);
	else if( contains.call(spcodes, nal) ) setHTMLContent('blockquote', quotes.spa[id]);
	else setHTMLContent('blockquote', quotes.eng[id]);

	setHTMLContent('cite', quotes.authors[id]);

};


function setTime () {

	let date = new Date(),

		time = [

			formatTimeUnit(date.getHours()),
			formatTimeUnit(date.getMinutes()),
			formatTimeUnit(date.getSeconds())

		];

	// joins all of the array elements into a string using the ':' separator
	// example: [16, 32, 03] -> "16:32:03"

	setHTMLContent('time', time.join(':'));

};

function init () {


	// init() gets executed only when the page is fully loaded

	setDaytimeMessage();
	setRandomBackground();
	setRandomQuote();
	setTime();

	// set interval to update time every second

	let timeInterval = setInterval(setTime, 1000);
};

// initialize on page load through a listener

document.addEventListener('DOMContentLoaded', init);

// UTILITY FUNCTIONS

// format time

function formatTimeUnit (unit) { return unit < 10 ? '0' + unit : unit };

// setHTMLContent is the kind of function that is referred to as a 'wrapper'

function setHTMLContent (selector, content) { return document.querySelector(selector) .innerHTML = content };

function getRandIndex(array) { return Math.floor(Math.random() * (array.length - 1)) }

function pickFromArray(array) { return array[Math.floor(Math.random() * (array.length - 1))] };

// Disable right click

document.oncontextmenu=RightMouseDown;
function RightMouseDown() { return false; }

// LANGUAGE FUNCTIONS

// English

function engMessageSet() {
        
	let currentHour = new Date().getHours(),

	getDaytime = () => {

		if (currentHour < 12)  return 'morning';       // if it's morning
		else if (currentHour >= 18) return 'evening';  // if it's evening
		else return 'afternoon';               // else, which happens to be afternoon
	};
        setHTMLContent(".greeting", `Good ${getDaytime()}`);
}

// Italian
function itMessageSet() {
	let hour = new Date().getHours();           // Get the current hour
	let time = 'Buongiorno';	
	
	if (hour > 18) time = 'Buongiorno';        //In Italian there is just Buongiorno or Buonasera
	else 		    time = 'Buongiorno';   //used 'asera' instead of 'sera' for avoiding creating a special case for it
	
	setHTMLContent('.greeting', time);	  // Write the string contents to the HTML
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
	let hour = new Date().getHours();               // Get the current hour
	let time = 'Bonsoir';		                // Set the default time string to "Good evening"
	
	if (hour < 12)      time = 'Bonjour';          // If it's before 12am, set the time string to "Good morning"
	else if (hour > 18) time = 'Bonne après-midi'; // If it's after 6pm, set the time string to "Good afternoon"
	else 		    time = 'Bonsoir';          // If It's unknown, set the time stirng to "Good evening"
	
	setHTMLContent('.greeting', time);	      // Write the string contents to the HTML
}

// Spanish
function spMessageSet() {
	let hour = new Date().getHours();               // Get the current hour
	let time = 'Buenas Tardes';		                // Set the default time string to "Good evening"
	
	if (hour < 12)      time = 'Buenos Días';          // If it's before 12am, set the time string to "Good morning"
	else if (hour > 20) time = 'Buenas Noches'; // If it's after 6pm, set the time string to "Good afternoon"
	
	setHTMLContent('.greeting', time);	      // Write the string contents to the HTML
}
