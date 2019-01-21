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

const { setHTMLContent } = require('./utility.js');

module.exports = class Message {
    // English
    static engMessageSet() {

        let hour = new Date().getHours(); // Get the current hour
        let time = 'Good evening'; // Set the default time string to "Good evening"	

        if (hour < 12) time = 'Good morning'; //If it's before 12am, set the time string to "Good morning"
        else if (hour > 18) time = 'Good afternoon'; //If it's after 6pm, set the time string to "Good afternoon"

        setHTMLContent('.greeting', time); // Write the string contents to the HTML
    }

    // Italian
    static itMessageSet() {
        let hour = new Date().getHours(); // Get the current hour
        let time = 'Buongiorno';

        if (hour > 18) time = 'Buonasera'; //In Italian there is just Buongiorno or Buonasera

        setHTMLContent('.greeting', time); // Write the string contents to the HTML
    }

    // Dutch
    static nlMessageSet() {
        let hour = new Date().getHours(); // Get the current hour
        let time = 'Goedemiddag'; // Set the default time string to "Good evening"

        if (hour < 12) time = 'Goedemorgen'; //If it's before 12am, set the time string to "Good morning"
        else if (hour > 18) time = 'Goedenavond'; //If it's after 6pm, set the time string to "Good afternoon"

        setHTMLContent('.greeting', time); // Write the string contents to the HTML
    }

    // French
    static frMessageSet() {
        let hour = new Date().getHours(); // Get the current hour
        let time = 'Bonsoir'; // Set the default time string to "Good evening"

        if (hour < 12) time = 'Bonjour'; //If it's before 12am, set the time string to "Good morning"
        else if (hour > 18) time = 'Bonne après-midi'; //If it's after 6pm, set the time string to "Good afternoon"

        setHTMLContent('.greeting', time); // Write the string contents to the HTML
    }

    // Spanish
    static spMessageSet() {
        let hour = new Date().getHours(); // Get the current hour
        let time = 'Buenas Tardes'; // Set the default time string to "Good evening"

        if (hour < 12) time = 'Buenos Días'; // If it's before 12am, set the time string to "Good morning"
        else if (hour > 20) time = 'Buenas Noches'; // If it's after 6pm, set the time string to "Good afternoon"

        setHTMLContent('.greeting', time); // Write the string contents to the HTML
    }
}