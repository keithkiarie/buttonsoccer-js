let players_number = 6; //has to be an even number

let player_radius;
    if (window.innerWidth > window.innerHeight) {
        player_radius = 0.4 * (window.innerHeight / players_number);
    } else {
        player_radius = 0.4 * (window.innerWidth / players_number);
    }

let ball_dimensions = player_radius * 1.2;

let player_friction = 0.995;
let ball_friction = 0.999;

let team_1_color = "#FF0000";
let team_2_color = "#0000FF";

let speed = 12;
let ball_id = ["ball_1", "ball_2", "ball_3", "ball_4", "ball_5"];

let ball_grease = 5; //smoothens ball movement

let touch_duration = 200;
let touch_allowance = 25;


//the area around the pitch
let outside_pitch;
if (gamecanvas.height > gamecanvas.width) {
    //smartphone form factor
    //the top is right side of the screen, the sides are the top and bottom of the smartphone
    outside_pitch = {
        top: gamecanvas.height * 0.05,
        side: gamecanvas.width * 0.15
    };
} else {
    //laptops form factor
    outside_pitch = {
        top: gamecanvas.height * 0.1,
        side: gamecanvas.width * 0.08
    };
}

//the area that is occupied by the pitch
let play_area;
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
let goal_post = {
    width : outside_pitch.side + 10,
    height : play_area.height / 2.5,

    x1 : 0,
    y1 : (play_area.height / 2) + outside_pitch.top - ((play_area.height / 2.5) / 2),

    x2 : outside_pitch.side + play_area.width - 7,
    y2 : (play_area.height / 2) + outside_pitch.top - ((play_area.height / 2.5) / 2)
}

