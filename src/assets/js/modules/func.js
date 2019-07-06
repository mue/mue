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
        if (util.contains.call(codes.itcodes, nal)) msg.itMsgSet(); // Italian
        if (util.contains.call(codes.nlcodes, nal)) msg.nlMsgSet(); // Dutch
        if (util.contains.call(codes.frcodes, nal)) msg.frMsgSet(); // French
        //else if (util.contains.call(codes.ptcodes, nal)) msg.ptMsgSet(); // Portuguese
        if (util.contains.call(codes.spcodes, nal)) msg.spMsgSet(); // Spanish
        if (util.contains.call(codes.ficodes, nal)) msg.fiMsgSet(); // Finnish
        if (util.contains.call(codes.decodes, nal)) msg.spMsgSet(); // German
        if (util.contains.call(codes.hecodes, nal)) msg.heMsgSet(); // Hebrew
        if (util.contains.call(codes.rucodes, nal)) msg.ruMsgSet(); // Russian
        if (util.contains.call(codes.arcodes, nal)) msg.arMsgSet(); // Arabic
        if (util.contains.call(codes.svcodes, nal)) msg.svMsgSet(); // Swedish
        else msg.engMsgSet(); // English
    }

    static setRandBg() {
        document.body.classList.add(util.pickFromArray(bg));
        /*util.getJSON(`https://api.muetab.xyz/getImage?category=Outdoors`,
            (err, data) => {
                document.body.style.background = `#f3f3f3 url('${data.file}') !important`;
            });*/
    }

    static setWithoutSeconds() {
        const dateNoSec = new Date(),
            time = [
                util.formatTimeUnit(dateNoSec.getHours()),
                util.formatTimeUnit(dateNoSec.getMinutes())
            ];
        document.getElementById('withoutSeconds').innerHTML = time.join(':');
    }

    static setRandQuote() {
        const id = util.getRandIndex(quotes.authors);
        /*util.getJSON(`https://api.muetab.xyz/getQuote`,
            (err, data) => {
                if (err) {
                    if (util.contains.call(codes.itcodes, nal)) document.querySelector('blockquote').innerHTML = `"${quotes.it[id]}"`; // Italian
                    if (util.contains.call(codes.ptcodes, nal)) document.querySelector('blockquote').innerHTML = `"${quotes.pt[id]}"` || `"${quotes.eng[id]}"`; // Portuguese
                    if (util.contains.call(codes.spcodes, nal)) document.querySelector('blockquote').innerHTML = `"${quotes.sp[id]}"`; // Spanish
                    else document.querySelector('blockquote').innerHTML = `"${quotes.eng[id]}"`; // English
                    document.querySelector('cite').innerHTML = quotes.authors[id];
                }
                document.querySelector('blockquote').innerHTML = `"${data.quote}"`;
                document.querySelector('cite').innerHTML = data.author;
            });*/
            if (util.contains.call(codes.itcodes, nal)) document.querySelector('blockquote').innerHTML = `"${quotes.it[id]}"`; // Italian
            if (util.contains.call(codes.ptcodes, nal)) document.querySelector('blockquote').innerHTML = `"${quotes.pt[id]}"` || `"${quotes.eng[id]}"`; // Portuguese
            if (util.contains.call(codes.spcodes, nal)) document.querySelector('blockquote').innerHTML = `"${quotes.sp[id]}"`; // Spanish
            else document.querySelector('blockquote').innerHTML = `"${quotes.eng[id]}"`; // English
            document.querySelector('cite').innerHTML = quotes.authors[id];
    }

    static setTime() {
        const date = new Date(),
            time = [
                util.formatTimeUnit(date.getHours()),
                util.formatTimeUnit(date.getMinutes()),
                util.formatTimeUnit(date.getSeconds())
            ];
        // Joins all of the array elements into a string using the ':' separator
        // Example: [16, 32, 03] -> "16:32:03"
        document.getElementById('withSeconds').innerHTML = time.join(':');
    }
};