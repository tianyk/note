Promise.resolve('step_1')
    .then((val) => {
        console.log(val);
        return Promise.resolve('step_2');
    })
    .then((val) => {
        console.log(val);
        return Promise.resolve('step_3');
    })
    .then((val) => {
        console.log(val);
        return Promise.reject('break')
    })
    .then((val) => {
        console.log(val);
        return Promise.resolve('step_4');
    })
    .catch((err) => {
        if (err === 'break') { /* ignored */ return; }
        console.error(err);
    });

// =>
// step_1
// step_2
// step_3