let players_number = 6; //has to be an even number
let player_radius = 25;
let ball_dimensions = 30;

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

