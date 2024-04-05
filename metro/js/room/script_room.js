const amount_fields = $(".field_edge, .field_cl, .field_rv").length;
const players = []
const fields_info = [];

let amount_players = 0;
let index_moving_palyer = -1;
let is_game_started = false;

init_fields_info()


// create WebSocket connection
// const socket = new WebSocket("ws://localhost:8000");

// socket.onmessage = function (e) {
//     const data = JSON.parse(e.data);

//     let new_data_players = data.players;

//     if (!new_data_players) {
//         console.error("No new data from server");
//         return;
//     }
    
//     new_data_players.forEach(new_data_player => {
//         // пока что пусть ищуться по имени, потом сделаем поиск по индексу
//         let player_index = players.findIndex(player => new_data_player.name == player.name);

//         // if this player was not found
//         if (player_index == -1) {
//             add_player(new_data_player.name, new_data_player.position);
//         }
//         else {
//             //и обновление остальных параметров игрока (в будущем)
//             move_player(player_index, new_data_player.position);
//         }
//     });
        
//     console.log(data);
// }
            
// for example add one player
// add_player("alex");


$(document).ready(function () {
    let is_dice_turning = false;

    // init color for fields
    for (let i = 1; i <= 40; i++) {
        let red = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let blue = Math.floor(Math.random() * 256);

        $("#field" + i).css({"background-color": `rgb(${red}, ${green}, ${blue})`});
    }

    // after starting game we should hide another buttons
    $("#button_start_game").click(function () { 
        is_game_started = true;
        $("#button_add_player").hide();
        $(this).hide();
        sessionStorage.setItem("id", randint(1, amount_players));
        
        update_money();

        $("aside button").addClass("unactivated_button");
        console.log($(".leaderboard_player_name").eq(sessionStorage.getItem("id") - 1));
        $(".leaderboard_player_name").eq(sessionStorage.getItem("id") - 1)
            .text("me")
            .css({
                // "background-color": "black",
                // "border-radius": "5px",
                // "color": "white"
                "font-weight": "600"
            });
    });
    
    // if we have al least two players we can start game and we should show button for stating game
    $("#button_add_player").click(function () {
        if (amount_players >= 6) {
            alert_message("Достигое число игроков.")
            return;
        }

        add_player("nick");
        amount_players++;

        if (amount_players >= 2) {
            $("#button_start_game").show();
        }

        let player = $(players[amount_players - 1].box);

        let color = player.css("background-color");
        
        let money_сolumn = $(document.createElement("div"))
        .addClass("money_column")
        .css({"background-color": color})
        .attr("id", "column" + amount_players);

        let name = $(document.createElement("div"))
        .addClass("leaderboard_player_name")
        .text(players[amount_players - 1].name);
        
        let money_column_container = $(document.createElement("div"))
        .addClass("money_column_container")
        .append(money_сolumn, name);
        
        $(".leaderboard").append(money_column_container);
        setTimeout(update_leaderboard, 0)

        $(money_сolumn).hover(function () {
            $(this).css({"transition": "0.2s"});
            
            let player_index = parseInt($(this).attr("id").replace("column", "")) - 1;
            const player_money = players[player_index].money;
            $(this).append(
                $(document.createElement("div"))
                .attr("id", "flex_station_name")
                .css("z-index", 4)
                .text(player_money)
            );

            }, function () {
                $(this).css({"transition": "0.5s"});
                $(this).find("#flex_station_name").remove();
            }
        );
    });
    
    // on the next move we need to reposite some one player
    $("div.dice_countiner img").hover(function () {
            // over
            if (!is_dice_turning && is_game_started) {
                $(this).css("transform", "scale(1.1)");
            }
        }, function () {
            // out
            $(this).css("transform", "scale(1)");
        }
    );

    $("div.dice_countiner img").click(function () {
        index_moving_palyer = (index_moving_palyer + 1) % amount_players;

        if (!is_game_started) {
            alert_message("Игра еще не начата!");
            return;
        }
        if (is_dice_turning) {
            return;
        }
        // if (index_moving_palyer != sessionStorage.getItem("id") - 1) {
        //     alert("Это еще не ваш ход, подождите...");
        //     return;
        // }
        is_dice_turning = true;

        let step = 0;
        
        var current_dice_index = 0;

        const change_dice_img = setInterval(function() {
            let first_dice = randint(1, 6);
            let second_dice = randint(1, 6);

            step = first_dice + second_dice;

            $("div.dice_countiner img").eq(0).attr("src", `../media/images/dice/dice${first_dice}.png`);
            $("div.dice_countiner img").eq(1).attr("src", `../media/images/dice/dice${second_dice}.png`);
            current_dice_index = (current_dice_index + 1) % 6;
        }, 200);

        setTimeout(function() {
            
            clearInterval(change_dice_img);

            const current_postiton = players[index_moving_palyer].position;
            const new_position = (current_postiton + step - 1) % amount_fields + 1;
            
            move_player(index_moving_palyer, new_position);
            
            const new_field_info = fields_info[new_position - 1];
            
            if (new_field_info.owner != null) {
                let rent_price = new_field_info[`rent_${new_field_info.amout_trains}}_train`] 
                
                players[index_moving_palyer].money -= rent_price;
                new_field_info.owner.money += rent_0_train;
            }
            
            
            is_dice_turning = false;
        }, 3000);

        
    });

    // on click some field we should to show info about this field
    $(".field_edge, .field_cl, .field_rv").click(function () {
        const my_player_index = sessionStorage.getItem("id") - 1;
        const field_info = fields_info[get_field_index(this)];

        if (field_info.owner == players[my_player_index] &&
            field_info.amout_trains < 4 &&
            players[my_player_index].money > field_info.price){

            $("#button_buy_train").removeClass().addClass("activated_button");
        }
        else {
            $("#button_buy_train").removeClass().addClass("unactivated_button");
        }

        show_field_info(this);
    });
    
    $(".field_edge, .field_cl, .field_rv").hover(function () {
        $(this).css("z-index", "3");
        
        let field_index = get_field_index(this);
        const field_info = fields_info[field_index];

        $(this).append(
            $(document.createElement("div"))
            .attr("id", "flex_station_name")
            .css("z-index", 4)
            .text(field_info.name)
        );
        }, function () {
            $(this).css("z-index", "1");
            $(this).find("#flex_station_name").remove();
        }
    );

    $("aside button").hover(function () {
            // over
        if ($(this).attr("class") == "activated_button") {
            $(this).css("transform", "scale(1.03)");
        }
        }, function () {
            // out
            $(this).css("transform", "scale(1)");
        }
    );

    $("#button_buy_station").click(function () {
        if (!is_game_started) {
            alert_message("игра еще не начата");
            return;
        }

        let player_index = sessionStorage.getItem("id") - 1;

        if (player_index != index_moving_palyer) {
            alert_message("не ваш ход");
            return;
        }

        let field = fields_info[players[player_index].position - 1];

        if (field.owner != null) {
            return;
        }
        if (players[player_index].money < field.price) {
            return;
        }

        players[player_index].money -= field.price; 
        field.owner = players[player_index];

        update_money();
        update_leaderboard();
        
        let field_object = $("#field" +(players[player_index].position))[0];
        show_metro_field(field_object);

        $(this).removeClass().addClass("unactivated_button");
        $("#button_buy_train").removeClass().addClass("activated_button");
    });

    $("#button_buy_train").click(function () { 
        if (!is_game_started) {
            console.log("game is not started");
            return;
        }
        
        const player_index = sessionStorage.getItem("id") - 1;
        let field = fields_info[players[player_index].position - 1];
        
        if ($(this).attr("class") == "unactivated_button") {
            return;
        }
        
        players[player_index].money -= field.add_train_price; 
        field.amout_trains++;

        if (field.amout_trains == 4) {
            $(this).removeClass().addClass("unactivated_button");
        }

        update_money();
        update_leaderboard();

        let field_object = $("#field" +(players[player_index].position))[0];
        show_metro_field(field_object);
    });
});


// this function adds one player
function add_player(player_name, start_field_index = 1) {
    const start_field_id = "field" + start_field_index;
    const field = $("#" + start_field_id);

    const index_new_player = amount_players;
    const new_player = document.createElement("div");
    
    // setting up new palyer box
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    $(new_player).attr({"class": "player", "id": "player" + (index_new_player + 1)});
    $(new_player).css({"background-color": `rgb(${red}, ${green}, ${blue})`});

    field.append(new_player);
    move_players_in_field(field);
    let money = randint(1000, 2000);

    players.push({ 
        "name": player_name,
        "money" : money,
        "position": 1, 
        "box": new_player 
    });
}

// this function shows some info about clicked field
function show_field_info(field) {
    const field_index = get_field_index(field);
    const field_info = fields_info[field_index];
    
    if (field_info.type == "station") {
        show_metro_field(field)
    }
    else {
        show_another_field(field)
    }
}

// SHOW FIELD (METRO) INFO
function show_metro_field(field) {
    $(".databoard").empty();
    const field_index = get_field_index(field);
    const field_info = fields_info[field_index];

    let div = $(document.createElement("div"))
    .css({"margin-bottom": "20px", "width": "100%"});

    if (field_info.owner != null) {
        $(".databoard").append(
            $(document.createElement("div"))
            .css({"text-align": "center", "font-size": "20px", "margin-bottom": "5px"})
            .text(`~ ${field_info.owner.name} ~`)
        );
    }

    const color = $(field).css("background-color");

    let station_name_container = $(document.createElement("div"))
    .addClass("station_name")
    .css({
        "background-color": color,
        "margin-bottom": "10px"
    })
    .text(field_info.name);

    let station_price_container = $(document.createElement("div"))
    .addClass("station_price")
    .text(field_info.price);

    let station_visitation_default_price_title = $(document.createElement("p"))
    .addClass("station_price_info_title")
    .text("проезд по пустой станиции");

    let station_visitation_default_price_value = $(document.createElement("p"))
    .addClass("station_price_info_value")
    .text(field_info.rent_1_train);
    
    $(".databoard").append(
        station_name_container,
        station_price_container, 
        $(div).append(
            station_visitation_default_price_title,
            station_visitation_default_price_value,
            "<br/>",
        )
    );

    let station_visitation_with_train_price_title = $(document.createElement("p"))
    .addClass("station_price_info_title");

    let station_visitation_with_train_price_value = $(document.createElement("p"))
    .addClass("station_price_info_value");

    for (let i = 1; i <= 4; i++) {
        let is_train_bought = (i == field_info.amout_trains ? "  ●" : "");
        $(".databoard").append(
            $($(div).clone().empty()).append(
                $(station_visitation_with_train_price_title)
                .clone().text(`– ${i} поезд` + (i != 1 ? "a" : "") + is_train_bought),

                $(station_visitation_with_train_price_value).
                clone().text(field_info[`rent_${i}_train`]),
                "<br/>"
            )
        );
    }

    let sep_line = $(document.createElement("div"))
    .css({
        "height": "1px",
        "width": "100%", 
        "background-color": "black", 
        "margin-bottom": "10px"
    });
    
    
    $(".databoard").append(sep_line);

    div = $(document.createElement("div"))
    .css({"margin-bottom": "15px", "width": "100%"});
    
    let station_build_train_price_title = $(document.createElement("p"))
    .addClass("station_price_info_title")
    .text("Добавление поезда");

    let station_build_train_price_value = $(document.createElement("p"))
    .addClass("station_price_info_value")
    .text(field_info["add_train_price"])
    
    $(".databoard").append(
        $(div).append(
            station_build_train_price_title,
            station_build_train_price_value,
            "<br/>"
        )
    );

    $(".databoard").append($(sep_line).clone());
}

function show_another_field(field) {
    
}
// this function inits list of fields
function init_fields_info() {
    // some request
    // init fields_info
    const list_station_names = ["Университет", "Новочеремушкинская", "Профсоюзная", "Охотный ряд", "Китай город", "Лубянка"];
    for (let i = 0; i < amount_fields; i++) {
        let n = randint(100, 300);
        fields_info.push({
            "type": "station",
            "price": n,
            "name": "м. " + list_station_names[randint(0, list_station_names.length - 1)],
            "owner": null,
            "rent_0_train": randint(50, 150),
            "rent_1_train": randint(50, 150),
            "rent_2_train": randint(50, 150),
            "rent_3_train": randint(50, 150),
            "rent_4_train": randint(50, 150),
            "add_train_price": randint(10, 60),
            "amout_trains": 0
        });
    };
};

// this function moves some player by given id to some given position
function move_player(player_index, new_position) {
    const player = players[player_index];
    const new_field = $("#field" + new_position);
    
    $(player.box).hide(150, "linear", function () {
        const previus_field = $(player.box).parent();

        $(player.box).appendTo(new_field);

        move_players_in_field(previus_field);
        move_players_in_field(new_field);

        $(player.box).show(150);
        player.position = new_position;

        if (player_index == sessionStorage.getItem("id") - 1) {
            show_metro_field($("#field" + new_position)[0]);
        }

        if (fields_info[new_position - 1].owner == null &&
            player_index + 1 == sessionStorage.getItem("id") &&
            player.money >= fields_info[get_field_index(new_field[0])].price) {
            
            $("#button_buy_station").removeClass().addClass("activated_button");
        }
        else {
            $("#button_buy_station").removeClass().addClass("unactivated_button");
        }
    });
}

//this function sends to server 
function to_next_move() {
    index_moving_palyer++;
    
    const new_position = Math.ceil(Math.random() / (1 / 8));

    const data = JSON.stringify({
        "position": new_position,
    });

    // send to server index moving player
    socket.send(data);
}

//this function updates new data sent from sever
function update_data(new_data) {
    
}

// this function update data on leaderboard
function update_leaderboard() {
    const max_money = players.reduce((max, player) => Math.max(max, player.money), 0);

    for (let index = 0; index < amount_players; index++) {
        const money = players[index].money;
        let delt = (money / max_money) * 90;

        $("#column" + (index + 1))
        .css({'top': `${90 - delt}%`, "height": `${delt}%`}, 500);
    };
}

function update_money() {
    let player_index = sessionStorage.getItem("id");
    $(".money")
    .text(players[player_index - 1].money);
}

// this function repsote
function move_players_in_field(field) {
    const players_in_current_field = field.find(".player");

    switch (players_in_current_field.length) {
        case 1:
            $(players_in_current_field).animate({"top": "50%", "left": "50%"});
            break;
        case 2:
            $(players_in_current_field[0]).animate({"top": "25%", "left": "50%"});
            $(players_in_current_field[1]).animate({"top": "75%", "left": "50%"});
            break;
        case 3:
            $(players_in_current_field[0]).animate({"top": "25%", "left": "25%"});
            $(players_in_current_field[1]).animate({"top": "25%", "left": "75%"});
            $(players_in_current_field[2]).animate({"top": "75%", "left": "50%"});
            break;
        case 4:
            $(players_in_current_field[0]).animate({"top": "25%", "left": "25%"});
            $(players_in_current_field[1]).animate({"top": "25%", "left": "75%"});
            $(players_in_current_field[2]).animate({"top": "75%", "left": "25%"});
            $(players_in_current_field[3]).animate({"top": "75%", "left": "75%"});
            break;
        case 5:
            $(players_in_current_field[0]).animate({"top": "22%", "left": "22%"});
            $(players_in_current_field[1]).animate({"top": "22%", "left": "78%"});
            $(players_in_current_field[2]).animate({"top": "78%", "left": "22%"});
            $(players_in_current_field[3]).animate({"top": "78%", "left": "78%"});
            $(players_in_current_field[4]).animate({"top": "50%", "left": "50%"});
            break;
        case 6:
            $(players_in_current_field[0]).animate({"top": "20%", "left": "20%"});
            $(players_in_current_field[1]).animate({"top": "20%", "left": "80%"});
            $(players_in_current_field[2]).animate({"top": "80%", "left": "20%"});
            $(players_in_current_field[3]).animate({"top": "80%", "left": "80%"});
            $(players_in_current_field[4]).animate({"top": "20%", "left": "50%"});
            $(players_in_current_field[5]).animate({"top": "80%", "left": "50%"});
    }
}

// this function generate random interger number in the given range
function randint(minimum_num, maximum_num) {
    let dif = maximum_num - minimum_num + 1;
    let number = Math.ceil(Math.random() / (1 / dif));

    return minimum_num - 1 + number;
};

function get_field_index(field) {
    let id_attr = $(field).attr("id");
    return parseInt(id_attr.replace("field", "")) - 1;
}

function alert_message(content) {
    const message_element = 
    $(document.createElement("div"))
        .attr("class", "message")
        .text(content);

    $("body").append(
        message_element
    );

    message_element.animate({"top": "0px", "opacity": "0%"}, 5000, "linear", function () {
        message_element.remove();
    });
}
