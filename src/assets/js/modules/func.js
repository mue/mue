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

const bg     = require('./bg.js');
const msg    = require('./msg.js');
const util   = require('./util.js');
const codes  = require('./code.js');
const quotes = require('./quote.js');

const nal = navigator.language;

module.exports = class Func {
    static setDaytimeMsg() {
        if (util.contains.call(codes.itcodes, nal)) msg.itMsgSet(); //Italian
        if (util.contains.call(codes.nlcodes, nal)) msg.nlMsgSet(); //Dutch
        if (util.contains.call(codes.frcodes, nal)) msg.frMsgSet(); //French
        //else if (util.contains.call(codes.ptcodes, nal)) Msg.ptMsgSet(); //Portuguese
        if (util.contains.call(codes.spcodes, nal)) msg.spMsgSet(); //Spanish
        if (util.contains.call(codes.ficodes, nal)) msg.fiMsgSet(); //Finnish
        if (util.contains.call(codes.decodes, nal)) msg.spMsgSet(); //German
        if (util.contains.call(codes.hecodes, nal)) msg.heMsgSet(); //Hebrew
        if (util.contains.call(codes.rucodes, nal)) msg.ruMsgSet(); //Russian
        if (util.contains.call(codes.arcodes, nal)) msg.arMsgSet(); //Arabic
        if (util.contains.call(codes.svcodes, nal)) msg.svMsgSet(); //Swedish
        else msg.engMsgSet(); //English
    }

    static setRandBg() {
        document.body.classList.add(util.pickFromArray(bg));
    }

    static setRandQuote() {
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