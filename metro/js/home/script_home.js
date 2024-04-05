document.getElementById("create_room").onclick = function() {
    const url = "http://localhost:8000/new/room";
    window.location.replace(url);
}

document.getElementById("connect_to_room").onclick = function() {
    const url = "http://localhost:8000/connect/room";
    window.location.replace(url);
}
