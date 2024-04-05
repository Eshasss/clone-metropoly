const URL = "http://localhost:8000"
$.get("URL",
    {
        "name": "alex",
        "age": 16
    },
    function (data, status) {
        console.log(data, status);
      }
);	
