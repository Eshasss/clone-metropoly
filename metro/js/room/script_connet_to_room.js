const URL = "someurl"
fetch(URL,
    {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "some key": "somevalue"
        }),
    })
    .then((response) => response.text())
    .then((text) => JSON.parse(text))
    .catch((error) => console.log(error));


