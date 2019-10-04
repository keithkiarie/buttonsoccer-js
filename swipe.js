//called by Swipe_Listener after it has collected details about the swipe
onswipe = (transformation) => {

    if (typeof (closest.id) == 'number' && gamesession) {
        players[closest.id].unit_x = transformation.x / transformation.duration;
        players[closest.id].unit_y = transformation.y / transformation.duration;
    }

}

//the object that is closest to the touched area
let closest = {
    "id": null,
    "dist": null
};

ontouch = (first_x, first_y) => {

    //check if a button is being pressed
    for (let i = 0; i < buttons.length; i++) {
        if (first_x - 5 >= buttons[i].x && first_x <= buttons[i].x + buttons[i].width + 5 && first_y - 5 >= buttons[i].y && first_y <= buttons[i].y + buttons[i].height + 5) {

            //back button
            if (buttons[i].name == 'back_button') {
                gamesession = false;
                document.getElementById("game_div").removeChild(gamecanvas);
                change_display("main_menu");
                clearInterval(timer); //stop the timer
                break;
            }

            //pause button (it is in the same position as play)
            if (buttons[i].name == 'pause_button' && gamesession) {
                gamesession = false;
                break;
            }

            //play button (it is in the same position as pause)
            if (buttons[i].name == 'play_button' && !gamesession) {
                gamesession = true;
                gameplay();
                turn_taking();
                break;
            }

            //fullscreen button
            if (buttons[i].name == 'fullscreen_button') {
                if (document.fullscreen || window.innerHeight == screen.availHeight) {
                    closeFullscreen();
                } else {
                    openFullscreen(document.documentElement);
                }
                break;
            }

        }
    }

    closest.id = null;
    closest.dist = null;

    //loop through the objects to find the closest to the touch area but should be within a reasonable radius
    for (let i = 0; i < players.length; i++) {
        //check if the player belongs to the team whose turn it is
        if (players[i].team == turn) {
            //check if this player is close to the touched area
            if (first_x + touch_allowance >= players[i].x - players[i].radius &&
                first_y + touch_allowance >= players[i].y - players[i].radius &&
                first_x - touch_allowance <= players[i].x + players[i].radius &&
                first_y - touch_allowance <= players[i].y + players[i].radius) {

                //calculate closeness
                let dx = first_x - players[i].x;
                let dy = first_y - players[i].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                //check if it is closer than the previously set
                if (closest.dist == null) {
                    closest.id = i;
                    closest.dist = dist;
                } else if (closest.dist > dist) {
                    closest.id = i;
                    closest.dist = dist;
                }
            }
        }
    }

    //action on the object that is decided to be the one intended by the user
    if (typeof (closest.id) == 'number' && gamesession) {
        players[closest.id].unit_x = 0;
        players[closest.id].unit_y = 0;
    }
}


function Swipe_Listener(swiping_area) {
    let obj = this;

    this.first_x, this.first_y, this.current_x, this.current_y, this.vector_x, this.vector_y, this.duration;

    this.area = swiping_area;
    this.transformation = {
        x: 0,
        y: 0,
        duration: 0
    };

    //touch has started
    this.area.addEventListener('touchstart', function (e) {
        obj.first_x = event.touches[0].clientX;
        obj.first_y = event.touches[0].clientY;

        obj.current_x = obj.first_x;
        obj.current_y = obj.first_y;

        //stop the playing object being touched
        gamecanvas.offsetLeft == undefined ? gamecanvas.offsetLeft = 0 : gamecanvas.offsetLeft = gamecanvas.offsetLeft;
        gamecanvas.offsetTop == undefined ? gamecanvas.offsetTop = 0 : gamecanvas.offsetTop = gamecanvas.offsetTop;
        ontouch(obj.first_x - gamecanvas.offsetLeft, obj.first_y - gamecanvas.offsetTop);

        //call touch_stop after a certain duration of listening to the touch
        setTimeout(() => obj.touch_stop(), touch_duration);
    });

    //swiping
    this.area.addEventListener('touchmove', function (e) {
        obj.current_x = e.changedTouches[0].pageX;
        obj.current_y = e.changedTouches[0].pageY;
    });


    //touch has ended
    this.touch_stop = () => {

        obj.duration = touch_duration;

        obj.vector_x = obj.current_x - obj.first_x;
        obj.vector_y = obj.current_y - obj.first_y;

        obj.transformation = {
            x: obj.vector_x,
            y: obj.vector_y,
            duration: this.duration
        };

        //call custom function to act on the data
        onswipe(obj.transformation);
    };
}


let ui_first_x, ui_first_y, ui_current_x, ui_current_y;
function ui_touch_listener() {

    //touch has started
    ui_canvas.addEventListener('touchstart', function (e) {
        //clear previous touch record
        ui_current_x = undefined;
        ui_current_y = undefined;

        ui_first_x = event.touches[0].clientX;
        ui_first_y = event.touches[0].clientY;

        //call touch_stop after a certain duration of listening to the touch
        setTimeout(() => ui_touch_stop(), touch_duration);
    });

    //swiping
    ui_canvas.addEventListener('touchmove', function (e) {
        ui_current_x = e.changedTouches[0].pageX;
        ui_current_y = e.changedTouches[0].pageY;
    });
}

function ui_touch_stop() {
    positions_before_swipe = [];

    //look for a swipe, no swiping past the last and first page
    if (window.innerWidth > window.innerHeight) {
        //LAPTOP

        if ((ui_current_x > ui_first_x + 5) && ui_page == 2 && in_main_menu.home) {
            //right swipe

            ui_swiped = 'right'
            ui_page = 1;
        } else if ((ui_current_x < ui_first_x - 5) && ui_page == 1 && in_main_menu.home) {
            //left swipe
            ui_swiped = 'left';
            ui_page = 2;
        } else if (ui_current_x == undefined && ui_current_y == undefined) {
            //tap
            ui_tap();
        }
    } else {
        //smartphone

        if ((ui_current_y > ui_first_y + 5) && ui_page == 2 && in_main_menu.home) {
            //right swipe
            ui_swiped = 'right';
            ui_page = 1;
        } else if ((ui_current_y < ui_first_y - 5) && ui_page == 1 && in_main_menu.home) {
            //left swipe
            ui_swiped = 'left';
            ui_page = 2;
        } else if (ui_current_x == undefined && ui_current_y == undefined) {
            //tap
            ui_tap();
        }

    }

}

ui_touch_listener();

function ui_tap() {

    for (const i in ui_buttons) {
        //check if a button is being pressed
        if (//curcular buttons
            (ui_first_x > ui_buttons[i].cx - ui_buttons[i].radius && ui_first_x < ui_buttons[i].cx + ui_buttons[i].radius &&
                ui_first_y > ui_buttons[i].cy - ui_buttons[i].radius && ui_first_y < ui_buttons[i].cy + ui_buttons[i].radius) ||
            //square buttons
            (ui_first_x > ui_buttons[i].x && ui_first_x < ui_buttons[i].x + ui_buttons[i].width &&
                ui_first_y > ui_buttons[i].y && ui_first_y < ui_buttons[i].y + ui_buttons[i].height)) {


            switch (ui_buttons[i].name) {
                case "single_player":
                    if (in_main_menu.home) {
                        in_main_menu.home = false;
                        in_main_menu.single_player = true;
                    }
                    break;

                case "two_player":
                    if (in_main_menu.home) {
                        in_main_menu.home = false;
                        in_main_menu.two_player = true;
                    }
                    break;

                case "multiplayer":
                    if (in_main_menu.home) {
                        in_main_menu.home = false;
                        in_main_menu.multiplayer = true;
                    }
                    break;

                case "tournament":
                    if (in_main_menu.home) {
                        in_main_menu.home = false;
                        in_main_menu.tournament = true;
                    }
                    break;

                case "settings":
                    if (in_main_menu.home) {
                        in_main_menu.home = false;
                        in_main_menu.settings = true;
                    }
                    break;

                case "about":
                    if (in_main_menu.home) {
                        in_main_menu.home = false;
                        in_main_menu.about = true;
                    }
                    break;

                case "fullscreen":
                    openFullscreen(document.documentElement);
                    break;

                case "back_button":
                    if (in_main_menu.single_player == true) {
                        in_main_menu.single_player = false;
                        in_main_menu.home = true;

                    } else if (in_main_menu.two_player == true) {
                        in_main_menu.two_player = false;
                        in_main_menu.home = true;

                    } else if (in_main_menu.multiplayer == true) {
                        in_main_menu.multiplayer = false;
                        in_main_menu.home = true;

                    } else if (in_main_menu.tournament == true) {
                        in_main_menu.tournament = false;
                        in_main_menu.home = true;

                    } else if (in_main_menu.settings == true) {
                        in_main_menu.settings = false;
                        in_main_menu.home = true;

                    } else if (in_main_menu.about == true) {
                        in_main_menu.about = false;
                        in_main_menu.home = true;
                    }
                    break;

                default:
                    break;
            }
            break;
        }
    }

    if (in_main_menu.two_player) {

        if (window.innerWidth > window.innerHeight) {
            //LAPTOPS

            //check if a button in two_player menu is being tapped
            for (const i in two_player_menu_btns) {

                if (
                    //square buttons
                    (ui_first_x > two_player_menu_btns[i].x && ui_first_x < two_player_menu_btns[i].x + (two_player_menu_btns[i].w * 9) &&
                        ui_first_y > two_player_menu_btns[i].y && ui_first_y < two_player_menu_btns[i].y + two_player_menu_btns[i].h)) {

                    for (const j in two_player_menu_btns) {
                        two_player_menu_btns[j].elm = document.getElementById('radio_unchecked');
                    }
                    two_player_menu_btns[i].elm = document.getElementById('radio_checked');
                    game_duration_selected = two_player_menu_btns[i].name;
                }
            }

            //start game button
            if ((ui_first_x > two_player_start_game_btn.x && ui_first_x < two_player_start_game_btn.x + two_player_start_game_btn.w &&
                ui_first_y > two_player_start_game_btn.y && ui_first_y < two_player_start_game_btn.y + two_player_start_game_btn.h)) {

                start_game();
            }

        } else {
            //SMARTPHONES


            //check if a button in two_player menu is being tapped
            for (const i in two_player_menu_btns) {

                if (
                    //square buttons
                    ui_first_x > -two_player_menu_btns[i].y - two_player_menu_btns[i].h && ui_first_x < -two_player_menu_btns[i].y &&
                    ui_first_y > two_player_menu_btns[i].x && ui_first_y < two_player_menu_btns[i].x + (two_player_menu_btns[i].w * 10)) {

                    for (const j in two_player_menu_btns) {
                        two_player_menu_btns[j].elm = document.getElementById('radio_unchecked');
                    }
                    two_player_menu_btns[i].elm = document.getElementById('radio_checked');
                    game_duration_selected = two_player_menu_btns[i].name;
                }
            }

            //start game button
            if (ui_first_x > -two_player_start_game_btn.y - two_player_start_game_btn.h && ui_first_x < -two_player_start_game_btn.y &&
                ui_first_y > two_player_start_game_btn.x && ui_first_y < two_player_start_game_btn.x + two_player_start_game_btn.w) {

                start_game();
            }
        }

        switch (game_duration_selected) {
            //time
            case "30_seconds":
                game_mode = 'time';
                game_duration = 30;
                break;

            case "60_seconds":
                game_mode = 'time';
                game_duration = 60;
                break;

            case "90_seconds":
                game_mode = 'time';
                game_duration = 90;
                break;

            case "120_seconds":
                game_mode = 'time';
                game_duration = 120;
                break;
            //goals
            case "3_goals":
                game_mode = 'goals';
                game_duration = 3;
                break;

            case "5_goals":
                game_mode = 'goals';
                game_duration = 5;
                break;

            case "10_goals":
                game_mode = 'goals';
                game_duration = 10;
                break;
            default:
                break;
        }
    }

}