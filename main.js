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
function circle_drawer() {
    ctx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);
    //draw the players
    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.arc(players[i].x, players[i].y, players[i].radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = players[i].color;
        ctx.fill();
    }

    //ball spinning mechanism
    if (degree % 5 == 0 && (ball.unit_x > 0.25 || ball.unit_y > 0.25)) {
        photo++;
        if (photo>3) {
            photo = 0;
        }
    }
    degree++;
    //draw the ball
    ctx.drawImage(document.getElementById(ball.id[0]), ball.x, ball.y, ball.dimensions, ball.dimensions);
}

function start_game() {
    change_display("game_div");

    create_canvas();
    create_ball();
    create_players(players_number);

    circle_drawer();

    gamesession = true;
    requestAnimationFrame(gameplay);
}

function gameplay() {
    player_movement();

    if (gamesession) {
        requestAnimationFrame(gameplay);
    }
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
}