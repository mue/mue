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
    // Format time
    static formatTimeUnit(unit) {
        return unit < 10 ? '0' + unit : unit;
    }

    // Get random item 
    static getRandIndex(array) {
        return Math.floor(Math.random() * (array.length - 1));
    }

    // Pick random from array
    static pickFromArray(array) {
        return array[Math.floor(Math.random() * (array.length - 1))];
    }

    static contains(needle) {
        const findNaN = needle !== needle;
        let indexOf;
        if (!findNaN && typeof Array.prototype.indexOf === 'function') indexOf = Array.prototype.indexOf;
        else {
            indexOf = (needle) => {
                let i = -1,
                    index = -1;
                for (i = 0; i < this.length; i++) {
                    const item = this[i];
                    if ((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return indexOf.call(this, needle) > -1;
    }

    static getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
          var status = xhr.status;
          if (status === 200) callback(null, xhr.response);
          else callback(status, xhr.response);
        };
        xhr.send();
    };
};