// document.getElementById("create") = function () {
//     // some requests for crating room-loginx
//     const room_login = "1a2b3c4d5e";
    
//     // connect url or some another url
//     const url = "http://localhost:8000/" + room_login;
//     window.location.replace(url);
// }

$(document).ready(function () {
    $("#up_arrow").click(function () {
        console.log("click");
        let new_value = Math.min(6, parseInt($("#amount_players").text()) + 1); 
        $("#amount_players").text(new_value);
    });

    $("#down_arrow").click(function () {
        console.log("click");
        let new_value = Math.max(2, parseInt($("#amount_players").text()) - 1); 
        $("#amount_players").text(new_value);
    });

    $('.slider').on('input', function() {
        var value = $(this).val();
        $('#slider_value').text(value);
    });
});
