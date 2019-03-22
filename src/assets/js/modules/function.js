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

const util       = require('./util.js');
const codes      = require('./code.js');
const quotes     = require('./quote.js');
const message    = require('./message.js');
const background = require('./background.js');

const nal = navigator.language;

module.exports = class Function {
    static setDaytimeMessage() {
        if (util.contains.call(codes.itcodes, nal)) message.itMessageSet(); //Italian
        if (util.contains.call(codes.nlcodes, nal)) message.nlMessageSet(); //Dutch
        if (util.contains.call(codes.frcodes, nal)) message.frMessageSet(); //French
        //else if (util.contains.call(codes.ptcodes, nal)) message.ptMessageSet(); //Portuguese
        if (util.contains.call(codes.spcodes, nal)) message.spMessageSet(); //Spanish
        if (util.contains.call(codes.ficodes, nal)) message.fiMessageSet(); //Finnish
        if (util.contains.call(codes.decodes, nal)) message.spMessageSet(); //German
        if (util.contains.call(codes.hecodes, nal)) message.heMessageSet(); //Hebrew
        if (util.contains.call(codes.rucodes, nal)) message.ruMessageSet(); //Russian
        if (util.contains.call(codes.arcodes, nal)) message.arMessageSet(); //Arabic
        if (util.contains.call(codes.svcodes, nal)) message.svMessageSet(); //Swedish
        else message.engMessageSet(); //English
    }

    static setRandomBackground() {
        document.body.classList.add(util.pickFromArray(background));
    }

    static setRandomQuote() {
        const id = util.getRandIndex(quotes.authors);
        if (util.contains.call(codes.itcodes, nal)) util.setHTMLContent('blockquote', `"${quotes.ita[id]}"`); //Italian
        if (util.contains.call(codes.ptcodes, nal)) util.setHTMLContent('blockquote', `"${quotes.pt[id]}"` || `"${quotes.eng[id]}"`); //Portuguese
        if (util.contains.call(codes.spcodes, nal)) util.setHTMLContent('blockquote', `"${quotes.spa[id]}"`); //Spanish
        else util.setHTMLContent('blockquote', `"${quotes.eng[id]}"`); //English
        util.setHTMLContent('cite', quotes.authors[id]);
    }

    static setTime() {
        const date = new Date(),
            time = [
                util.formatTimeUnit(date.getHours()),
                util.formatTimeUnit(date.getMinutes()),
                util.formatTimeUnit(date.getSeconds())
            ];
        // joins all of the array elements into a string using the ':' separator
        // example: [16, 32, 03] -> "16:32:03"
        util.setHTMLContent('time', time.join(':'));
    }
};