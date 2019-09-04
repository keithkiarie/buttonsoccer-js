let players_number = 6; //has to be an even number

let team_1_color = "#FF0000";
let team_2_color = "#0000FF";

//turn taking during gameplay
let turn = 1;
let turn_duration = 2500;
//turn_indicator object manages the display indicator to show whose turn it is to play
// more turn indicator to be found inside config() function
let turn_indicator = {
    team_1: {},
    team_2: {}
};


let game_duration = 60; //number of seconds a match lasts

let player_friction = 0.995;
let ball_friction = 0.999;

let speed = 12;
let ball_id = ["ball_1", "ball_2", "ball_3", "ball_4", "ball_5"];

let ball_grease = 5; //smoothens ball movement

let touch_duration = 200;
let touch_allowance = 25;

let ui_swipe_speed; //animation speed when the UI is swiped
if (window.innerHeight > window.innerWidth) {
    //smartphone
    ui_swipe_speed = window.innerHeight / 20;
} else {
    //laptop
    ui_swipe_speed = window.innerWidth / 20;
}


//all the variables set inside the config function
let player_radius, outside_pitch, play_area, goal_post, ball_dimensions, ball_initial_position, scores_display, buttons, back_button, pause_button, play_button, fullscreen_button, time_display, ui_buttons;

//config is called in the other scripts to reinitialize all the variables under this function
config = () => {

    //PLAYER RADIUS
    if (window.innerWidth > window.innerHeight) {
        player_radius = 0.4 * (window.innerHeight / players_number);
    } else {
        player_radius = 0.4 * (window.innerWidth / players_number);
    }

    ball_dimensions = player_radius * 1.2;


    //the area around the pitch
    //OUTSIDE PITCH (PITCH MARGIN)
    if (gamecanvas.height > gamecanvas.width) {
        //smartphone form factor
        //the top is right side of the screen, the sides are the top and bottom of the smartphone
        outside_pitch = {
            top: gamecanvas.width * 0.08,
            side: gamecanvas.height * 0.08
        };
    } else {
        //laptops form factor
        outside_pitch = {
            top: gamecanvas.height * 0.07,
            side: gamecanvas.width * 0.08
        };
    }



    //the area that is occupied by the pitch
    //PLAY AREA
    if (gamecanvas.height > gamecanvas.width) {
        //smartphone form factor
        play_area = {
            width: gamecanvas.width - outside_pitch.top,
            height: gamecanvas.height - (outside_pitch.side * 2)
        };

    } else {
        //laptop form factor
        play_area = {
            width: gamecanvas.width - (outside_pitch.side * 2),
            height: gamecanvas.height - outside_pitch.top
        };
    }


    //goal post
    if (window.innerWidth > window.innerHeight) {
        //laptop
        goal_post = {
            width: outside_pitch.side + 10,
            height: play_area.height / 2.5,

            x1: 0,
            y1: (play_area.height / 2) + outside_pitch.top - ((play_area.height / 2.5) / 2),

            x2: outside_pitch.side + play_area.width - 7,
            y2: (play_area.height / 2) + outside_pitch.top - ((play_area.height / 2.5) / 2)
        }
    } else {
        //smartphone
        goal_post = {
            width: play_area.width / 2.5,
            height: outside_pitch.side + 15,

            x1: (play_area.width / 2) - ((play_area.width / 2.5) / 2),
            y1: -5,

            x2: (play_area.width / 2) - ((play_area.width / 2.5) / 2),
            y2: outside_pitch.side + play_area.height - 10
        }
        //if it is in full screen mode
        if (document.fullscreen || window.innerHeight == screen.availHeight) {
            goal_post.y2 = screen.availHeight - outside_pitch.side - 10;
        }
    }

    //the initial position of the ball when the game is starting or a goal has been scored
    if (window.innerWidth > window.innerHeight) {
        //laptop
        ball_initial_position = {
            x: (play_area.width / 2) - ball_dimensions / 2 + outside_pitch.side,
            y: (play_area.height / 2) - ball_dimensions / 2 + outside_pitch.top
        }
    } else {

        //smartphone
        ball_initial_position = {
            x: (play_area.width / 2) - (ball_dimensions / 2),
            y: (gamecanvas.height / 2) - (ball_dimensions / 2)
        }
        //if it is in full screen mode
        if (document.fullscreen || window.innerHeight == screen.availHeight) {
            ball_initial_position.y = (screen.availHeight / 2) - (ball_dimensions / 2);
        }
    }


    //the way scores are displayed
    scores_display = {
        font: `${outside_pitch.top}px Arial`,
        color: "black",

        //see x and y below
    };

    //the way time is displayed
    time_display = {
        font: `${outside_pitch.top}px Arial`,
        color: "green",
        time_up_color: "red"

        //see x and y below
    };

    if (window.innerWidth > window.innerHeight) {
        //laptops
        scores_display.x = gamecanvas.width / 2;
        scores_display.y = outside_pitch.top;

        time_display.x = gamecanvas.width * 0.80;
        time_display.y = outside_pitch.top;
    } else {
        //smartphone
        scores_display.x = gamecanvas.height / 2;
        scores_display.y = -play_area.width;

        time_display.x = gamecanvas.height * 0.80;
        time_display.y = -play_area.width;

        //if it is in full screen mode
        if (document.fullscreen || window.innerHeight == screen.availHeight) {
            scores_display.x = screen.availHeight / 2;
            time_display.x = screen.availHeight * 0.80;
        }
    }

    //turn indicators
    if (window.innerWidth > window.innerHeight) {
        //on laptops
        turn_indicator.team_1.x = scores_display.x - 80;
        turn_indicator.team_1.y = scores_display.y - 15;
        turn_indicator.team_1.radius = 10;
    
        turn_indicator.team_2.x = scores_display.x + 80;
        turn_indicator.team_2.y = scores_display.y - 15;
        turn_indicator.team_2.radius = 10;
    } else {
        //on smartphones
        turn_indicator.team_1.x = play_area.width + 10;
        turn_indicator.team_1.y = (gamecanvas.height / 2) - 60;
        turn_indicator.team_1.radius = 10;
    
        turn_indicator.team_2.x = play_area.width + 10;
        turn_indicator.team_2.y = (gamecanvas.height / 2) + 60;
        turn_indicator.team_2.radius = 10;
    }
    turn_indicator.team_1.color = team_1_color;
    turn_indicator.team_2.color = team_2_color;
    

    //back, pause, play and fullscreen buttons
    if (window.innerHeight > window.innerWidth) {
        //SMARTPHONES

        //back button
        back_button = {
            name: "back_button",
            x: 0,
            y: 5,
            width: outside_pitch.side - 10,
            height: outside_pitch.side - 10,
            image: document.getElementById("back_button_flipped")
        };

        //pause button
        pause_button = {
            name: "pause_button",
            x: play_area.width - 5,
            y: 5,
            width: outside_pitch.top,
            height: outside_pitch.top,
            image: document.getElementById("pause_button_flipped")
        };

        //play button
        play_button = {
            name: "play_button",
            x: play_area.width,
            y: 5,
            width: outside_pitch.top,
            height: outside_pitch.top,
            image: document.getElementById("play_button_flipped")
        };

        //fullscreen button
        fullscreen_button = {
            name: "fullscreen_button",
            x: 0,
            y: goal_post.y2 + 10,
            width: outside_pitch.side - 5,
            height: outside_pitch.side - 5,
            image: document.getElementById("fullscreen_button_flipped")
        };
    } else {
        //LAPTOPS

        //back button
        back_button = {
            name: "back_button",
            x: 0,
            y: window.innerHeight - (outside_pitch.top * 1.5),
            width: outside_pitch.top * 1.5,
            height: outside_pitch.top * 1.5,
            image: document.getElementById("back_button")
        };

        //pause button
        pause_button = {
            name: "pause_button",
            x: 0,
            y: 0,
            width: outside_pitch.top,
            height: outside_pitch.top,
            image: document.getElementById("pause_button")
        };

        //play button
        play_button = {
            name: "play_button",
            x: 0,
            y: 0,
            width: outside_pitch.top,
            height: outside_pitch.top,
            image: document.getElementById("play_button")
        };

        //fullscreen button
        fullscreen_button = {
            name: "fullscreen_button",
            x: goal_post.x2 + 10,
            y: gamecanvas.height - outside_pitch.top - 5,
            width: outside_pitch.top,
            height: outside_pitch.top,
            image: document.getElementById("fullscreen_button_flipped")
        };
    }

    //array listing all the buttons in the canvas
    buttons = [
        back_button,
        pause_button,
        play_button,
        fullscreen_button
    ];

    //ui_buttons
    if (window.innerWidth > window.innerHeight) {
        //LAPTOPS


        ui_buttons = {
            single_player: {
                //text positioning is dependant on the circle positioning as described during drawing

                //circle positioning
                cx: window.innerWidth * (1 / 5),
                cy: window.innerHeight / 2,
                radius: window.innerHeight * (1 / 7),
                color: "blue",

                text_1: "Single",
                text_2: "Player",
                page: 1,
                number: 0,

                defaults: {
                    page_1: {
                        cx: window.innerWidth * (1 / 5),
                        cy: window.innerHeight / 2
                    },
                    page_2: {
                        cx: window.innerWidth * (1 / 5) - window.innerWidth,
                        cy: window.innerHeight / 2
                    },
                }
            },
            two_player: {
                //text positioning is dependant on the circle positioning as described during drawing

                cx: window.innerWidth / 2,
                cy: window.innerHeight / 2,
                radius: window.innerHeight * (1 / 7),
                color: "blue",

                text_1: "Two",
                text_2: "Player",
                page: 1,
                number: 1,

                defaults: {
                    page_1: {
                        cx: window.innerWidth / 2,
                        cy: window.innerHeight / 2
                    },
                    page_2: {
                        cx: window.innerWidth / 2 - window.innerWidth,
                        cy: window.innerHeight / 2
                    },
                }
            },
            multiplayer: {
                //text positioning is dependant on the circle positioning as described during drawing

                cx: window.innerWidth * (4 / 5),
                cy: window.innerHeight / 2,
                radius: window.innerHeight * (1 / 7),
                color: "blue",

                text_1: "Multi",
                text_2: "Player",
                page: 1,
                number: 2,

                defaults: {
                    page_1: {
                        cx: window.innerWidth * (4 / 5),
                        cy: window.innerHeight / 2
                    },
                    page_2: {
                        cx: window.innerWidth * (4 / 5) - window.innerWidth,
                        cy: window.innerHeight / 2
                    },
                }
            },//next page
            tournament: {
                cx: window.innerWidth * (1 / 5) + window.innerWidth,
                cy: window.innerHeight / 2,
                radius: window.innerHeight * (1 / 7),
                color: "blue",

                text: "Tournament",
                page: 2,
                number: 3,

                defaults: {
                    page_1: {
                        cx: window.innerWidth * (1 / 5) + window.innerWidth,
                        cy: window.innerHeight / 2
                    },
                    page_2: {
                        cx: window.innerWidth * (1 / 5),
                        cy: window.innerHeight / 2
                    },
                }
            },
            settings: {
                cx: window.innerWidth / 2 + window.innerWidth,
                cy: window.innerHeight / 2,
                radius: window.innerHeight * (1 / 7),
                color: "blue",

                text: "Settings",
                page: 2,
                number: 4,

                defaults: {
                    page_1: {
                        cx: window.innerWidth / 2 + window.innerWidth,
                        cy: window.innerHeight / 2
                    },
                    page_2: {
                        cx: window.innerWidth / 2,
                        cy: window.innerHeight / 2
                    },
                }
            },
            about: {
                cx: window.innerWidth * (4 / 5) + window.innerWidth,
                cy: window.innerHeight / 2,
                radius: window.innerHeight * (1 / 7),
                color: "blue",

                text: "About",
                page: 2,
                number: 5,

                defaults: {
                    page_1: {
                        cx: window.innerWidth * (4 / 5) + window.innerWidth,
                        cy: window.innerHeight / 2
                    },
                    page_2: {
                        cx: window.innerWidth * (4 / 5),
                        cy: window.innerHeight / 2
                    },
                }
            },
            //constant buttons
            fullscreen: {
                x: window.innerWidth - 30,
                y: window.innerHeight - 30,
                width: 30,
                height: 30,
                img: document.getElementById("fullscreen_button"),
                page: "all",
            }
        };
    } else {
        //SMARTPHONE

        ui_buttons = {

            single_player: {
                //text positioning is dependant on the circle positioning as described during drawing

                //circle positioning
                cx: ui_canvas.width / 2,
                cy: ui_canvas.height * (1 / 5),
                radius: ui_canvas.width * (1 / 7),
                color: "blue",

                text_1: "Single",
                text_2: "Player",
                page: 1,
                number: 0,

                defaults: {
                    page_1: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (1 / 5),
                    },
                    page_2: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (1 / 5) - ui_canvas.height,
                    },
                }
            },
            two_player: {
                //text positioning is dependant on the circle positioning as described during drawing

                cx: ui_canvas.width / 2,
                cy: ui_canvas.height / 2,
                radius: ui_canvas.width * (1 / 7),
                color: "blue",

                text_1: "Two",
                text_2: "Player",
                page: 1,
                number: 1,

                defaults: {
                    page_1: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height / 2,
                    },
                    page_2: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height / 2 - ui_canvas.height,
                    },
                }
            },
            multiplayer: {
                //text positioning is dependant on the circle positioning as described during drawing

                cx: ui_canvas.width / 2,
                cy: ui_canvas.height * (4 / 5),
                radius: ui_canvas.width * (1 / 7),
                color: "blue",

                text_1: "Multi",
                text_2: "Player",
                page: 1,
                number: 2,

                defaults: {
                    page_1: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (4 / 5),
                    },
                    page_2: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (4 / 5) - ui_canvas.height,
                    },
                }
            },
            //next page
            tournament: {
                cx: ui_canvas.width / 2,
                cy: ui_canvas.height * (1 / 5) + ui_canvas.height,
                radius: ui_canvas.width * (1 / 7),
                color: "blue",

                text: "Tournament",
                page: 2,
                number: 3,

                defaults: {
                    page_1: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (1 / 5) + ui_canvas.height,
                    },
                    page_2: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (1 / 5),
                    },
                }
            },
            settings: {
                cx: ui_canvas.width / 2,
                cy: ui_canvas.height / 2 + ui_canvas.height,
                radius: ui_canvas.width * (1 / 7),
                color: "blue",

                text: "Settings",
                page: 2,
                number: 4,

                defaults: {
                    page_1: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height / 2 + ui_canvas.height,
                    },
                    page_2: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height / 2,
                    },
                }
            },
            about: {
                cx: ui_canvas.width / 2,
                cy: ui_canvas.height * (4 / 5) + ui_canvas.height,
                radius: ui_canvas.width * (1 / 7),
                color: "blue",

                text: "About",
                page: 2,
                number: 5,

                defaults: {
                    page_1: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (4 / 5) + ui_canvas.height,
                    },
                    page_2: {
                        cx: ui_canvas.width / 2,
                        cy: ui_canvas.height * (4 / 5),
                    },
                }
            },
            //constant buttons
            fullscreen: {
                x: 0,
                y: ui_canvas.height - 40,
                width: 40,
                height: 40,
                img: document.getElementById("fullscreen_button_flipped"),
                page: "all",
            }
        };
    }
    //naming the buttons
    ui_buttons.single_player.name = "single_player";
    ui_buttons.two_player.name = "two_player";
    ui_buttons.multiplayer.name = "multiplayer";
    ui_buttons.tournament.name = "tournament";
    ui_buttons.settings.name = "settings";
    ui_buttons.about.name = "about";
    ui_buttons.fullscreen.name = "fullscreen";

}

config();

function initial_players_positioning() {
    let half = players.length / 2;

    //initial positioning, depends on the number of balls
    let portion;

    if (window.innerHeight > window.innerWidth) {
        portion = play_area.width / (half + 1);
    } else {
        portion = play_area.height / (half + 1);
    }

    //loop through the players
    for (let i = 0; i < players.length; i++) {
        let x_1, x_2, y_1, y_2;

        if (window.innerHeight > window.innerWidth) {
            //smartphone form factor
            //the top of the screen is its right edge
            x_1 = (i + 1) * portion;
            y_1 = gamecanvas.height * 0.1 + outside_pitch.side;
            x_2 = (i - half + 1) * portion;
            y_2 = gamecanvas.height * 0.9 - outside_pitch.side;
        } else {
            //laptop form factor
            x_1 = gamecanvas.width * 0.1 + outside_pitch.side;
            y_1 = (i + 1) * portion + outside_pitch.top;
            x_2 = gamecanvas.width * 0.9 - outside_pitch.side;
            y_2 = (i - half + 1) * portion + outside_pitch.top;
        }

        if (i < half) {
            players[i].x = x_1;
            players[i].y = y_1;
        } else {
            players[i].x = x_2;
            players[i].y = y_2;
        }
    }
}