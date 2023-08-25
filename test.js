fetch('https://better-slug-bedclothes.cyclic.cloud')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Fetch error:', error);
    });