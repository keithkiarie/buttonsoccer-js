function Player(x_position, y_position, circle_radius, players_team, identity, color) {
    this.x = x_position;
    this.y = y_position;
    this.radius = circle_radius;
    this.team = players_team;
    this.mass = 1;
    this.id = identity;
    this.color = color;

    this.unit_x = 0; //distance player moves horizontally
    this.unit_y = 0; //distance player  moves vertically

    this.friction = player_friction;
}

function Ball(x_position, y_position, dimensions, identity) {
    this.x = x_position;
    this.y = y_position;
    this.dimensions = dimensions;
    this.mass = 0.5;
    this.id = identity;

    this.unit_x = 0; //distance ball moves horizontally
    this.unit_y = 0; //distance ball  moves vertically

    this.friction = ball_friction;
}

function create_ball() {
    ball = new Ball((gamecanvas.width / 2) - ball_dimensions / 2, (gamecanvas.height / 2) - ball_dimensions / 2, ball_dimensions, ball_id);
}

function create_players(number) {
    players = [];
    let half = number / 2;

    //initial positioning, depends on the number of balls
    let portion;

    if (window.innerHeight > window.innerWidth) {
        portion = play_area.width / (half + 1);
    } else {
        portion = play_area.height / (half + 1);
    }

    //create players
    for (let i = 0; i < number; i++) {
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
            players.push(new Player(x_1, y_1, player_radius, 1, i, team_1_color));
        } else {
            players.push(new Player(x_2, y_2, player_radius, 2, i, team_2_color));
        }
    }
}

function player_movement() {
    //loop over the players, acting on each
    for (let i = 0; i < players_number; i++) {

        //apply friction
        players[i].unit_x *= players[i].friction;
        players[i].unit_y *= players[i].friction;
        ball.unit_x *= ball.friction;
        ball.unit_y *= ball.friction;

        let repeat = speed;
        do {
            //check for contact with wall
            if (players[i].x + players[i].radius >= gamecanvas.width - 2 && players[i].unit_x > 0) {
                players[i].unit_x = -players[i].unit_x;
            } else if (players[i].x - players[i].radius <= 2 && players[i].unit_x < 0) {
                players[i].unit_x = -players[i].unit_x;
            } else if (players[i].y + players[i].radius >= gamecanvas.height - 2 && players[i].unit_y > 0) {
                players[i].unit_y = -players[i].unit_y;
            } else if (players[i].y - players[i].radius <= 2 && players[i].unit_y < 0) {
                players[i].unit_y = -players[i].unit_y;
            }

            //check for ball contact with wall
            if (ball.x + ball.dimensions >= gamecanvas.width - 2 && ball.unit_x > 0) {
                ball.unit_x = -ball.unit_x;
            } else if (ball.x <= 2 && ball.unit_x < 0) {
                ball.unit_x = -ball.unit_x;
            } else if (ball.y + ball.dimensions >= gamecanvas.height - 2 && ball.unit_y > 0) {
                ball.unit_y = -ball.unit_y;
            } else if (ball.y <= 2 && ball.unit_y < 0) {
                ball.unit_y = -ball.unit_y;
            }

            //check for contact with other player
            for (let i = 0; i < players_number; i++) {
                for (let j = i + 1; j < players_number; j++) {
                    if (Math.sqrt(Math.pow(players[i].x - players[j].x, 2) + Math.pow(players[i].y - players[j].y, 2)) <= players[i].radius + players[j].radius + 1) {
                        player_collision(players[i], players[j]);
                        break;
                    }
                }
            }


            //check for player contact with ball
            for (let i = 0; i < players_number; i++) {
                if (Math.sqrt(Math.pow(players[i].x - (ball.x + ball.dimensions / 2), 2) + Math.pow(players[i].y - (ball.y + ball.dimensions / 2), 2)) < players[i].radius + (ball.dimensions / 2)) {

                    //create a holder because the ball's x is not exactly the midpoint
                    let temp = ball;
                    temp.x += temp.dimensions / 2;
                    temp.y += temp.dimensions / 2;

                    player_collision(players[i], temp);
                    temp.x -= temp.dimensions / 2;
                    temp.y -= temp.dimensions / 2;
                    ball = temp;
                    break;
                }
            }

            //move the player
            players[i].x += players[i].unit_x;
            players[i].y += players[i].unit_y;
            ball.x += ball.unit_x / ball_grease;
            ball.y += ball.unit_y / ball_grease;

            repeat--;
        } while (repeat > 0);
    }
    circle_drawer();
}