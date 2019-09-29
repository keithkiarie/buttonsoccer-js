//stores where exactly is being in the ui if not inside the gamesession
let in_main_menu = {
    home: true,
    single_player: false,
    two_player: false,
    multiplayer: false,
    tournament: false,
    settings: false,
    about: false
};

let game_duration_selected;
let two_player_menu_btns;
if (window.innerWidth > window.innerHeight) {
    //LAPTOPS

    two_player_menu_btns = {
        "30_seconds": {
            x: 15,
            y: 60,
            w: 20,
            h: 20,
        },
        "60_seconds": {
            x: 15,
            y: 90,
            w: 20,
            h: 20,
        },
        "90_seconds": {
            x: 15,
            y: 120,
            w: 20,
            h: 20,
        },
        "120_seconds": {
            x: 15,
            y: 150,
            w: 20,
            h: 20,
        },
        "3_goals": {
            x: 15,
            y: 190,
            w: 20,
            h: 20,
        },
        "5_goals": {
            x: 15,
            y: 220,
            w: 20,
            h: 20,
        },
        "10_goals": {
            x: 15,
            y: 250,
            w: 20,
            h: 20,
        }
    }
} else {
    //SMARTPHONES

    two_player_menu_btns = {
        "30_seconds": {
            x: 25,
            y: -window.innerWidth + 70,
            w: 10,
            h: 10,
        },
        "60_seconds": {
            x: 25,
            y: -window.innerWidth + 90,
            w: 10,
            h: 10,
        },
        "90_seconds": {
            x: 25,
            y: -window.innerWidth + 110,
            w: 10,
            h: 10,
        },
        "120_seconds": {
            x: 25,
            y: -window.innerWidth + 130,
            w: 10,
            h: 10,
        },
        "3_goals": {
            x: 25,
            y: -window.innerWidth + 160,
            w: 10,
            h: 10,
        },
        "5_goals": {
            x: 25,
            y: -window.innerWidth + 180,
            w: 10,
            h: 10,
        },
        "10_goals": {
            x: 25,
            y: -window.innerWidth + 200,
            w: 10,
            h: 10,
        }
    }
}

two_player_menu_btns['30_seconds'].name = '30_seconds';
two_player_menu_btns['60_seconds'].name = '60_seconds';
two_player_menu_btns['90_seconds'].name = '90_seconds';
two_player_menu_btns['120_seconds'].name = '120_seconds';
two_player_menu_btns['3_goals'].name = '3_goals';
two_player_menu_btns['5_goals'].name = '5_goals';
two_player_menu_btns['10_goals'].name = '10_goals';

two_player_menu_btns['30_seconds'].elm = document.getElementById('radio_unchecked');
two_player_menu_btns['60_seconds'].elm = document.getElementById('radio_checked');
two_player_menu_btns['90_seconds'].elm = document.getElementById('radio_unchecked');
two_player_menu_btns['120_seconds'].elm = document.getElementById('radio_unchecked');
two_player_menu_btns['3_goals'].elm = document.getElementById('radio_unchecked');
two_player_menu_btns['5_goals'].elm = document.getElementById('radio_unchecked');
two_player_menu_btns['10_goals'].elm = document.getElementById('radio_unchecked');


//creating the canvas for the user interface
ui_canvas = document.createElement("canvas");
ui_canvas.id = "ui_canvas";
ui_canvas.style.border = "1px solid #000000";

ui_canvas.width = window.innerWidth;
ui_canvas.height = window.innerHeight;
ui_ctx = ui_canvas.getContext("2d");

document.getElementById("main_menu").appendChild(ui_canvas);

let positions_before_swipe = [];

function draw_ui() {
    //home menu
    if (in_main_menu.home) {
        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //write the ui buttons
        for (i in ui_buttons) {

            //buttons that only appear in one page
            if (ui_buttons[i].page != "all") {
                ui_ctx.beginPath();
                ui_ctx.arc(ui_buttons[i].cx, ui_buttons[i].cy, ui_buttons[i].radius, 0, 2 * Math.PI);
                ui_ctx.stroke();
                ui_ctx.fillStyle = ui_buttons[i].color;
                ui_ctx.fill();

                ui_ctx.font = "20px Comic Sans MS";
                ui_ctx.fillStyle = "red";

                if (window.innerHeight > window.innerWidth) {
                    //on SMARTPHONES, text should be rotated

                    ui_ctx.save();
                    ui_ctx.rotate(90 * Math.PI / 180);

                    if (ui_buttons[i].text_1 != undefined) {
                        ui_ctx.fillText(ui_buttons[i].text_1, ui_buttons[i].cy - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), (-ui_buttons[i].cx));
                        ui_ctx.fillText(ui_buttons[i].text_2, ui_buttons[i].cy - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), (-ui_buttons[i].cx) + 20);
                    } else {
                        ui_ctx.fillText(ui_buttons[i].text, ui_buttons[i].cy - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), (-ui_buttons[i].cx));
                    }


                    ui_ctx.restore();

                    //move the buttons on swipe
                    if (ui_swiped == 'right' && ui_buttons[i].cy < ui_buttons[i].defaults.page_1.cy) {
                        ui_buttons[i].cy += ui_swipe_speed;

                    } else if (ui_swiped == 'left' && ui_buttons[i].cy > ui_buttons[i].defaults.page_2.cy) {
                        ui_buttons[i].cy -= ui_swipe_speed;
                    }

                } else {
                    //on LAPTOPS

                    if (ui_buttons[i].text_1 != undefined) {
                        ui_ctx.fillText(ui_buttons[i].text_1, ui_buttons[i].cx - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), ui_buttons[i].cy);
                        ui_ctx.fillText(ui_buttons[i].text_2, ui_buttons[i].cx - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), ui_buttons[i].cy + 20);
                    } else {
                        ui_ctx.fillText(ui_buttons[i].text, ui_buttons[i].cx - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), ui_buttons[i].cy);
                    }

                    //move the buttons on swipe
                    if (ui_swiped == 'right' && ui_buttons[i].cx < ui_buttons[i].defaults.page_1.cx) {
                        ui_buttons[i].cx += ui_swipe_speed;

                    } else if (ui_swiped == 'left' && ui_buttons[i].cx > ui_buttons[i].defaults.page_2.cx) {
                        ui_buttons[i].cx -= ui_swipe_speed;
                    }
                }


            } else {
                //buttons that appear in all the pages of the UI
                if (ui_buttons[i].name != 'back_button') {
                    ui_ctx.drawImage(ui_buttons[i].img, ui_buttons[i].x, ui_buttons[i].y, ui_buttons[i].width, ui_buttons[i].height);
                }
            }
        }

    } else if (in_main_menu.single_player) {
        //settings menu

        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //the back and fullscreen button
        ui_ctx.drawImage(ui_buttons.fullscreen.img, ui_buttons.fullscreen.x, ui_buttons.fullscreen.y, ui_buttons.fullscreen.width, ui_buttons.fullscreen.height);
        ui_ctx.drawImage(ui_buttons.back_button.img, ui_buttons.back_button.x, ui_buttons.back_button.y, ui_buttons.back_button.width, ui_buttons.back_button.height);

    } else if (in_main_menu.two_player) {
        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //the back and fullscreen button
        ui_ctx.drawImage(ui_buttons.fullscreen.img, ui_buttons.fullscreen.x, ui_buttons.fullscreen.y, ui_buttons.fullscreen.width, ui_buttons.fullscreen.height);
        ui_ctx.drawImage(ui_buttons.back_button.img, ui_buttons.back_button.x, ui_buttons.back_button.y, ui_buttons.back_button.width, ui_buttons.back_button.height);

        two_player_menu();

    } else if (in_main_menu.multiplayer) {
        //settings menu

        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //the back and fullscreen button
        ui_ctx.drawImage(ui_buttons.fullscreen.img, ui_buttons.fullscreen.x, ui_buttons.fullscreen.y, ui_buttons.fullscreen.width, ui_buttons.fullscreen.height);
        ui_ctx.drawImage(ui_buttons.back_button.img, ui_buttons.back_button.x, ui_buttons.back_button.y, ui_buttons.back_button.width, ui_buttons.back_button.height);

    } else if (in_main_menu.tournament) {
        //settings menu

        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //the back and fullscreen button
        ui_ctx.drawImage(ui_buttons.fullscreen.img, ui_buttons.fullscreen.x, ui_buttons.fullscreen.y, ui_buttons.fullscreen.width, ui_buttons.fullscreen.height);
        ui_ctx.drawImage(ui_buttons.back_button.img, ui_buttons.back_button.x, ui_buttons.back_button.y, ui_buttons.back_button.width, ui_buttons.back_button.height);

    } else if (in_main_menu.settings) {
        //settings menu

        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //the back and fullscreen button
        ui_ctx.drawImage(ui_buttons.fullscreen.img, ui_buttons.fullscreen.x, ui_buttons.fullscreen.y, ui_buttons.fullscreen.width, ui_buttons.fullscreen.height);
        ui_ctx.drawImage(ui_buttons.back_button.img, ui_buttons.back_button.x, ui_buttons.back_button.y, ui_buttons.back_button.width, ui_buttons.back_button.height);

        settings_ui();
    } else if (in_main_menu.about) {
        //settings menu

        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //the back and fullscreen button
        ui_ctx.drawImage(ui_buttons.fullscreen.img, ui_buttons.fullscreen.x, ui_buttons.fullscreen.y, ui_buttons.fullscreen.width, ui_buttons.fullscreen.height);
        ui_ctx.drawImage(ui_buttons.back_button.img, ui_buttons.back_button.x, ui_buttons.back_button.y, ui_buttons.back_button.width, ui_buttons.back_button.height);

    }

    //call the function again in the next frame
    requestAnimationFrame(draw_ui);
}

draw_ui();


function settings_ui() {
    //setting interface
}

let two_player_start_game_btn;

if (window.innerWidth > window.innerHeight) {
    two_player_start_game_btn = {
        x: window.innerWidth - 310,
        y: window.innerHeight - 160,
        w: 220,
        h: 50
    };
} else {
    two_player_start_game_btn = {
        x: window.innerHeight - 215,
        y: -110,
        w: 150,
        h: 50
    }
}


function two_player_menu() {
    ui_ctx.fillStyle = "black";
    ui_ctx.font = "50px Arial";

    if (window.innerWidth > window.innerHeight) {
        //LAPTOPS

        ui_ctx.font = "40px Arial";

        //Game Length Menu
        ui_ctx.fillText("Game Length", 10, 50);



        for (const btn in two_player_menu_btns) {
            ui_ctx.drawImage(two_player_menu_btns[btn].elm, two_player_menu_btns[btn].x, two_player_menu_btns[btn].y, two_player_menu_btns[btn].w, two_player_menu_btns[btn].h);
        }

        //Start Game button
        ui_ctx.fillStyle = "blue";
        ui_ctx.fillRect(two_player_start_game_btn.x, two_player_start_game_btn.y, two_player_start_game_btn.w, two_player_start_game_btn.h);

        ui_ctx.font = "40px Arial";
        ui_ctx.fillStyle = "black";
        ui_ctx.fillText("Start Game", two_player_start_game_btn.x + 10, two_player_start_game_btn.y + 40);


        //Options
        ui_ctx.font = "25px Comic Sans MS";

        //Select time
        ui_ctx.fillText("30 seconds", 45, 80);
        ui_ctx.fillText("60 seconds", 45, 110);
        ui_ctx.fillText("90 seconds", 45, 140);
        ui_ctx.fillText("120 seconds", 45, 170);
        ui_ctx.fillText("3 goals", 45, 210);
        ui_ctx.fillText("5 goals", 45, 240);
        ui_ctx.fillText("10 goals", 45, 270);

    } else {
        //SMARTPHONES
        ui_ctx.save();
        ui_ctx.rotate(90 * Math.PI / 180);

        ui_ctx.font = "30px Arial";

        //Settings Menu
        ui_ctx.fillText("Game Length", 10, -window.innerWidth + 50);


        for (const btn in two_player_menu_btns) {
            ui_ctx.drawImage(two_player_menu_btns[btn].elm, two_player_menu_btns[btn].x, two_player_menu_btns[btn].y, two_player_menu_btns[btn].w, two_player_menu_btns[btn].h);
        }

        //Start Game button
        ui_ctx.fillStyle = "blue";
        ui_ctx.fillRect(two_player_start_game_btn.x, two_player_start_game_btn.y, two_player_start_game_btn.w, two_player_start_game_btn.h);

        ui_ctx.font = "25px Arial";
        ui_ctx.fillStyle = "black";
        ui_ctx.fillText("Start Game", two_player_start_game_btn.x + 15, two_player_start_game_btn.y + 30);


        //Time options
        ui_ctx.font = "15px Comic Sans MS";

        ui_ctx.fillText("30 seconds", 40, -window.innerWidth + 80);
        ui_ctx.fillText("60 seconds", 40, -window.innerWidth + 100);
        ui_ctx.fillText("90 seconds", 40, -window.innerWidth + 120);
        ui_ctx.fillText("120 seconds", 40, -window.innerWidth + 140);
        ui_ctx.fillText("3 goals", 40, -window.innerWidth + 170);
        ui_ctx.fillText("5 goals", 40, -window.innerWidth + 190);
        ui_ctx.fillText("10 goals", 40, -window.innerWidth + 210);

        ui_ctx.restore();
    }

    //in_main_menu.two_player = false;
    //start_game();
}