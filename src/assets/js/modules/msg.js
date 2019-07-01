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

const hour = new Date().getHours(); // Get the current hour

module.exports = class Msg {
    // English
    static engMsgSet() {
        let time = 'Good evening'; // Set the default time string to "Good evening"	
        if (hour < 12) time = 'Good morning'; //If it's before 12am, set the time string to "Good morning"
        else if (hour < 18) time = 'Good afternoon'; //If it's before 6pm, set the time string to "Good afternoon"
        document.querySelector('.greeting').innerHTML = time; // Write the string contents to the HTML
    }

    // Italian
    static itMsgSet() {
        let time = 'Buongiorno'; // Set the default time string
        if (hour > 18) time = 'Buonasera'; // In Italian there is just Buongiorno or Buonasera, if it's before 6pm then set the time string to Buonasera
        document.querySelector('.greeting').innerHTML = time; // Write the string contents to the HTML
    }

    // Dutch
    static nlMsgSet() { // Everything below is the same as English, check the comments there for information
        let time = 'Goedemiddag'; 
        if (hour < 12) time = 'Goedemorgen'; 
        else if (hour > 18) time = 'Goedenavond'; 
        document.querySelector('.greeting').innerHTML = time; 
    }

    // French
    static frMsgSet() {
        let time = 'Bonsoir'; 
        if (hour < 12) time = 'Bonjour'; 
        else if (hour > 18) time = 'Bonne après-midi';
        document.querySelector('.greeting').innerHTML = time; 
    }

    // Spanish
    static spMsgSet() {
        let time = 'Buenas Tardes'; // Set the default time string to "Good evening"
        if (hour < 12) time = 'Buenos Días'; // If it's before 12am, set the time string to "Good morning"
        else if (hour > 18) time = 'Buenas Noches'; // If it's before 6pm, set the time string to "Good afternoon"
        document.querySelector('.greeting').innerHTML = time; // Write the string contents to the HTML
    }

    // Finnish
    static fiMsgSet() {
        let time = 'Hyvää iltaa'; // Set the default time string to "Good evening"
        if (hour < 12) time = 'Hyvää huomenta'; // If it's before 12am, set the time string to "Good morning"
        else if (hour > 18) time = 'Hyvää iltapäivää'; // If it's before 6pm, set the time string to "Good afternoon"
        document.querySelector('.greeting').innerHTML = time; // Write the string contents to the HTML
    }

    // German
    static deMsgSet() {
        let time = 'Guten Abend'; 
        if (hour < 12) time = 'Guten Morgen'; 
        else if (hour > 18) time = 'Guten Nachmittag';
        document.querySelector('.greeting').innerHTML = time;
    }

    // Hebrew
    static heMsgSet() {
        let time = 'ערב טוב'; 
        if (hour < 12) time = 'בוקר טוב';
        else if (hour > 18) time = 'אחר הצהריים טובים';
        document.querySelector('.greeting').innerHTML = time; 
    }

    // Russian
    static ruMsgSet() {
        let time = 'Добрый Вечер'; 
        if (hour < 12) time = 'добрый утро'; 
        else if (hour > 18) time = 'добрый день'; 
        document.querySelector('.greeting').innerHTML = time; 
    }

    // Arabic
    static arMsgSet() {
        let time = 'مساء الخير';
        if (hour < 12) time = 'صباح الخير'; 
        else if (hour > 18) time = 'مساء الخير'; 
        document.querySelector('.greeting').innerHTML = time; 
    }

    // Swedish
    static svMsgSet() {
        let time = 'God kväll'; 
        if (hour < 12) time = 'God morgon';
        document.querySelector('.greeting').innerHTML = time;
    }
};
