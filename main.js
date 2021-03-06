
function openFullscreen(elem) {
    if (window.innerHeight == screen.height && window.innerWidth == screen.width) {
        closeFullscreen();
        return;
    }
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }

}

//listen for when the screen changes to full screen
document.addEventListener("fullscreenchange", function () {
    setTimeout(function () { adjust_to_fullscreen(); }, 250);
});
document.addEventListener("mozfullscreenchange", function () {
    setTimeout(function () { adjust_to_fullscreen(); }, 250);
});
document.addEventListener("webkitfullscreenchange", function () {
    setTimeout(function () { adjust_to_fullscreen(); }, 250);
});
document.addEventListener("msfullscreenchange", function () {
    setTimeout(function () { adjust_to_fullscreen(); }, 250);
});

function adjust_to_fullscreen() {
    gamecanvas.width = window.innerWidth;
    gamecanvas.height = window.innerHeight;

    ui_canvas.width = window.innerWidth;
    ui_canvas.height = window.innerHeight;

    //if it is in full screen mode
    if (document.fullscreen || window.innerHeight == screen.availHeight) {
        ui_canvas.width = screen.availWidth;
        ui_canvas.height = screen.availHeight;
    }

    //change the values of the configurations
    config();

    //adjust the positions of the players and the ball
    for (let i = 0; i < players.length; i++) {
        players[i].x *= gamecanvas.width / screen_dimensions.width;
        players[i].y *= gamecanvas.height / screen_dimensions.height;
    }

    if (ball != undefined) {
        ball.x *= window.innerWidth / screen_dimensions.width;
        ball.y *= window.innerHeight / screen_dimensions.height;
    }


    screen_dimensions = {
        width: window.innerWidth,
        height: window.innerHeight
    };

}

function create_canvas() {
    gamecanvas = document.createElement("canvas");
    gamecanvas.id = "gamecanvas";
    gamecanvas.style.border = "1px solid #000000";

    gamecanvas.width = window.innerWidth;
    gamecanvas.height = window.innerHeight;
    ctx = gamecanvas.getContext("2d");

    document.getElementById("game_div").appendChild(gamecanvas);
    swipe_listener = new Swipe_Listener(gamecanvas);
}


let degree = 0;
let photo = 0;

//draws the elements in the canvas
function circle_drawer() {
    ctx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);

    //draw the grass
    if (window.innerHeight > window.innerWidth) {
        //smartphone/portrait
        //the top and the bottom of the screen are taken as the right and left sides respectively

        //the grass
        ctx.drawImage(document.getElementById("pitch"), 0, outside_pitch.side, gamecanvas.width - outside_pitch.top, gamecanvas.height - (outside_pitch.side * 2));


    } else {
        //landscape
        ctx.drawImage(document.getElementById("pitch_flipped"), outside_pitch.side, outside_pitch.top, gamecanvas.width - (outside_pitch.side * 2), gamecanvas.height - outside_pitch.top);
    }

    //the back, pause and play buttons
    ctx.drawImage(back_button.image, back_button.x, back_button.y, back_button.width, back_button.height);
    ctx.drawImage(fullscreen_button.image, fullscreen_button.x, fullscreen_button.y, fullscreen_button.width, fullscreen_button.height);

    if (gamesession) {
        ctx.drawImage(pause_button.image, pause_button.x, pause_button.y, pause_button.width, pause_button.height);
    } else {
        ctx.drawImage(play_button.image, play_button.x, play_button.y, play_button.width, play_button.height);
    }


    //draw the players
    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.arc(players[i].x, players[i].y, players[i].radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = players[i].color;
        ctx.fill();

        //draw a white circle on the currently active team
        if (players[i].team == turn) {
            ctx.beginPath();
            ctx.arc(players[i].x, players[i].y, players[i].radius / 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    }

    //ball spinning mechanism, DISABLED
    if (degree % 5 == 0 && (ball.unit_x > 0.25 || ball.unit_y > 0.25)) {
        photo++;
        if (photo > 3) {
            photo = 0;
        }
    }
    degree++;

    //draw the ball
    ctx.drawImage(document.getElementById(ball.id[0]), ball.x, ball.y, ball.dimensions, ball.dimensions);


    //draw the nets
    if (window.innerWidth > window.innerHeight) {
        ctx.drawImage(document.getElementById("net1"), goal_post.x1, goal_post.y1, goal_post.width, goal_post.height);
        ctx.drawImage(document.getElementById("net2"), goal_post.x2, goal_post.y2, goal_post.width, goal_post.height);
    } else {
        ctx.drawImage(document.getElementById("net1_potrait"), goal_post.x1, goal_post.y1, goal_post.width, goal_post.height);
        ctx.drawImage(document.getElementById("net2_potrait"), goal_post.x2, goal_post.y2, goal_post.width, goal_post.height);
    }

    //draw the turn indicator
    ctx.beginPath();
    ctx.arc(turn_indicator[`team_${turn}`].x, turn_indicator[`team_${turn}`].y, turn_indicator[`team_${turn}`].radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = turn_indicator[`team_${turn}`].color;
    ctx.fill();

}

function start_game() {
    change_display("game_div");

    create_canvas();
    create_ball();
    create_players(players_number);

    home_score = 0;
    away_score = 0;


    circle_drawer();

    gamesession = true;

    turn_taking(); //defined in player.js
    game_time_counter = 0;

    if (game_mode == 'time') {
        time_keeper();
    }

    //play Cheering audio
    CurrentAudio = CheeringNormal;
    CurrentAudio.play();

    requestAnimationFrame(gameplay);
}

var test = true;

let game_time_counter;;
function gameplay() {

    player_movement();
    time_displayer();

    if (gamesession) {
        if (CurrentAudio.paused) CurrentAudio.play();
        //increase the value of the counter
        game_time_counter++;

        //try adjusting the screen after every several frames just incase it was changed to/from fullscreen
        if (game_time_counter % 50 == 0) {
            if (gamecanvas.height != window.innerHeight || gamecanvas.width != window.innerWidth) {
                adjust_to_fullscreen();
            }
        }

        requestAnimationFrame(gameplay);
    } else {
        //If game is paused, pause the audio
        CurrentAudio.pause();
    }
    score_keeper();
}

function change_display(div_to_display) {
    let divs = ["main_menu", "game_div"];

    divs.forEach(div => {
        if (div == div_to_display) {
            document.getElementById(div_to_display).style.display = "block";
        } else {
            document.getElementById(div).style.display = "none";
        }
    });

    document.getElementById('main_menu').style.display == "none" ? in_main_menu.home = false : in_main_menu.home = true;
    if (in_main_menu.home) {
        draw_ui();
    }
}

//a goal has been scored
function goal() {

    //Fans celebrating
    CurrentAudio.pause();
    CurrentAudio = CheeringGoal;
    CurrentAudio.currentTime = 0;
    CurrentAudio.play();

    //take the ball back to the center
    ball.x = ball_initial_position.x;
    ball.y = ball_initial_position.y;

    ball.unit_x = 0;
    ball.unit_y = 0;

    //reposition the players
    initial_players_positioning();
    players.forEach(player => {
        player.unit_x = 0;
        player.unit_y = 0;
    });



    setTimeout(() => {
        CurrentAudio.pause();
        CurrentAudio = CheeringNormal;
        CurrentAudio.play();
    }, 16000);


}

//keeps track of the score in the game
let home_score = 0;
let away_score = 0;
function score_keeper(scorer) {

    //check who has scored
    if (scorer == 'home') {
        home_score++;
        turn_taking('home score')
    } else if (scorer == 'away') {
        away_score++;
        turn_taking('away score');
    }

    //display the scores
    ctx.font = scores_display.font;
    ctx.fillStyle = scores_display.color;
    ctx.textAlign = "center";

    if (window.innerWidth > window.innerHeight) {
        //on laptops
        ctx.fillText(`${home_score} : ${away_score}`, scores_display.x, scores_display.y);

    } else {
        //on smartphone (potrait displays)
        ctx.save();
        ctx.rotate(90 * Math.PI / 180);
        ctx.fillText(`${home_score} - ${away_score}`, scores_display.x, scores_display.y);
        ctx.restore();
    }

    if (game_mode == 'goals' && gamesession) {
        if (home_score == game_duration || away_score == game_duration) {
            gamesession = false;

            setTimeout(function () {
                document.getElementById("game_div").removeChild(gamecanvas);
                change_display("main_menu");
            }, 1000);
        }
    }
}


//keeps track of time in the game
let remaining_time, timer;
let time_keeper = () => {

    remaining_time = game_duration
    timer = setInterval(() => {
        if (remaining_time == 0) {
            //if time's up
            clearInterval(timer);
        } else {
            if (gamesession) {
                //if there is still time remaining
                remaining_time--;
            }
        }
    }, 1000);

}

function time_displayer() {
    let color;

    if (game_mode == 'time') {
        //change color according to the time remaining
        remaining_time < 10 ? color = time_display.time_up_color : color = time_display.color;


        //display the scores
        ctx.font = time_display.font;
        ctx.fillStyle = color;
        ctx.textAlign = "center";

        if (remaining_time == 1) FinalWhistle.play(); //blow the final whistle

        if (remaining_time == 0) {
            //if time's up
            time_up();

        } else {
            //if there is still time remaining
            let minutes = Math.floor(remaining_time / 60).toFixed(0);
            let seconds = remaining_time % 60;

            //display time as two digits
            seconds < 10 ? seconds = '0' + seconds : seconds = String(seconds);

            if (window.innerWidth > window.innerHeight) {
                //on laptops
                ctx.fillText(`${minutes} : ${seconds}`, time_display.x, time_display.y);

            } else {
                //on smartphone (potrait displays)
                ctx.save();
                ctx.rotate(90 * Math.PI / 180);
                ctx.fillText(`${minutes} : ${seconds}`, time_display.x, time_display.y);
                ctx.restore();
            }
        }

    } else if (game_mode == 'goals') {
        ctx.font = time_display.font;
        ctx.fillStyle = color;
        ctx.textAlign = "center";

        if (window.innerWidth > window.innerHeight) {
            //on laptops
            ctx.fillText(`First to ${game_duration} goals`, time_display.x, time_display.y);

        } else {
            //on smartphone (potrait displays)
            ctx.save();
            ctx.rotate(90 * Math.PI / 180);
            ctx.fillText(`First to ${game_duration} goals`, time_display.x, time_display.y);
            ctx.restore();
        }
    }

}


//gets called when the given time for a match has elapsed
function time_up() {

    if (window.innerWidth > window.innerHeight) {
        //on laptops
        ctx.fillText(`Time's Up!`, time_display.x, time_display.y);

    } else {
        //on smartphone (potrait displays)
        ctx.save();
        ctx.rotate(90 * Math.PI / 180);
        ctx.fillText(`Time's Up!`, time_display.x, time_display.y);
        ctx.restore();
    }

    //stop the game
    gamesession = false;

    setTimeout(function () {
        document.getElementById("game_div").removeChild(gamecanvas);
        change_display("main_menu");
    }, 2000);
}