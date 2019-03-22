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

module.exports = class Util {
    // format time
    static formatTimeUnit(unit) {
        return unit < 10 ? '0' + unit : unit;
    }

    // setHTMLContent is the kind of function that is referred to as a 'wrapper'
    static setHTMLContent(selector, content) {
        return document.querySelector(selector).innerHTML = content;
    }

    // get random item 
    static getRandIndex(array) {
        return Math.floor(Math.random() * (array.length - 1));
    }

    // pick random from array
    static pickFromArray(array) {
        return array[Math.floor(Math.random() * (array.length - 1))];
    }

    static contains(needle) {
        let findNaN = needle !== needle;
        let indexOf;
        if (!findNaN && typeof Array.prototype.indexOf === 'function') indexOf = Array.prototype.indexOf;
        else {
            indexOf = (needle) => {
                let i = -1,
                    index = -1;
                for (i = 0; i < this.length; i++) {
                    let item = this[i];
                    if ((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            }
        }
        return indexOf.call(this, needle) > -1;
    }
};