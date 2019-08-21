let players_number = 6; //has to be an even number

let player_friction = 0.995;
let ball_friction = 0.999;

let team_1_color = "#FF0000";
let team_2_color = "#0000FF";

let speed = 12;
let ball_id = ["ball_1", "ball_2", "ball_3", "ball_4", "ball_5"];

let ball_grease = 5; //smoothens ball movement

let touch_duration = 200;
let touch_allowance = 25;


//all the variables set inside the config function
let player_radius, outside_pitch, play_area, goal_post, ball_dimensions, ball_initial_position, scores_display;

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
            top: gamecanvas.width * 0.05,
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
        if (document.fullscreen || window.innerHeight == screen.height) {
            goal_post.y2 = screen.height - outside_pitch.side - 10;
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
        if (document.fullscreen || window.innerHeight == screen.height) {
            ball_initial_position.y = (screen.height / 2) - (ball_dimensions / 2);
        }
    }


    //the way scores are displayed
    scores_display = {
        font: `${outside_pitch.top}px Arial`,
        color: "black",

        x: outside_pitch.side + (play_area.width / 2) - 45,
        y: outside_pitch.top
    };

    if (window.innerWidth > window.innerHeight) {
        //laptops
        scores_display.x = gamecanvas.width / 2;
        scores_display.y = outside_pitch.top;
    } else {
        //smartphone
        scores_display.x = gamecanvas.height / 2;
        scores_display.y = -play_area.width;
    }
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