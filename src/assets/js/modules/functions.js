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

const util       = require('./utility.js');
const message    = require('./message.js');
const quotes     = require('./quotes.js');
const background = require('./background.js');
const codes      = require('./codes.js');

let nal = navigator.language;

module.exports = class Functions {
    static setDaytimeMessage() {
        if (util.contains.call(codes.itcodes, nal)) message.itMessageSet(); //Italian
        else if (util.contains.call(codes.nlcodes, nal)) message.nlMessageSet(); //Dutch
        else if (util.contains.call(codes.frcodes, nal)) message.frMessageSet(); //French
        //else if (util.contains.call(codes.ptcodes, nal)) message.ptMessageSet(); //Portuguese
        else if (util.contains.call(codes.spcodes, nal)) message.spMessageSet(); //Spanish
        else if (util.contains.call(codes.ficodes, nal)) message.spMessageSet(); //Finnish
        else if (util.contains.call(codes.decodes, nal)) message.spMessageSet(); //German
        else message.engMessageSet(); //English
    };

    static setRandomBackground() {
        let currentBackgroundClass = util.pickFromArray(background);
        document.body.classList.add(currentBackgroundClass);
    };

    static setRandomQuote() {
        let id = util.getRandIndex(quotes.authors);
        if (util.contains.call(codes.itcodes, nal)) util.setHTMLContent('blockquote', `"${quotes.ita[id]}"`); //Italian
        else if (util.contains.call(codes.ptcodes, nal)) util.setHTMLContent('blockquote', `"${quotes.pt[id]}"` || `"${quotes.eng[id]}"`); //Portuguese
        else if (util.contains.call(codes.spcodes, nal)) util.setHTMLContent('blockquote', `"${quotes.spa[id]}"`); //Spanish
        else util.setHTMLContent('blockquote', `"${quotes.eng[id]}"`); //English
        util.setHTMLContent('cite', quotes.authors[id]);
    };


    static setTime() {
        let date = new Date(),
            time = [
                util.formatTimeUnit(date.getHours()),
                util.formatTimeUnit(date.getMinutes()),
                util.formatTimeUnit(date.getSeconds())
            ];
        // joins all of the array elements into a string using the ':' separator
        // example: [16, 32, 03] -> "16:32:03"
        util.setHTMLContent('time', time.join(':'));
    };
}