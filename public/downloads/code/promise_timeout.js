const ms = require('ms');

function timeout(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('operation timed out'));
        }, ms(time));
    });
}

function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('ok');
        }, ms(time));
    });
}

Promise.race([timeout('3s'), delay('5s')])
    .then(console.log)
    .catch(console.error);
