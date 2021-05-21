const test = ({ foo, bar, ...others }) => {
    console.log(foo, bar);
    new Promise((resolve, rejects) => {
        setTimeout(() => {
            resolve(others);
        }, 2000);

    }).then(data => {
        console.log(data);
    })
}

export { test };