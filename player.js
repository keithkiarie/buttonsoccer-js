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
    ball = new Ball(gamecanvas.width / 2, gamecanvas.height / 2, ball_dimensions, ball_id);
}

function create_players(number) {
    players = [];
    let half = number / 2;

    //initial positioning, depends on the number of balls
    let portion;

    if (window.innerHeight > window.innerWidth) {
        portion = gamecanvas.width / (half + 1);
    } else {
        portion = gamecanvas.height / (half + 1);
    }

    //create players
    for (let i = 0; i < number; i++) {
        let x_1, x_2, y_1, y_2;

        if (window.innerHeight > window.innerWidth) {
            x_1 = (i + 1) * portion;
            y_1 = gamecanvas.height * 0.1;
            x_2 = (i - half + 1) * portion;
            y_2 = gamecanvas.height * 0.9;
        } else {
            x_1 = gamecanvas.width * 0.1;
            y_1 = (i + 1) * portion;
            x_2 = gamecanvas.width * 0.9;
            y_2 = (i - half + 1) * portion;
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
                    if ((players[i].x + players[i].radius >= players[j].x - players[j].radius - 0.1) &&
                        (players[i].x - players[i].radius <= players[j].x + players[j].radius + 0.1) &&
                        (players[i].y + players[i].radius >= players[j].y - players[j].radius - 0.1) &&
                        (players[i].y - players[i].radius <= players[j].y + players[j].radius + 0.1)) {


                        player_collision(players[i], players[j]);
                        break;
                    }
                }
            }


            //check for player contact with ball
            for (let i = 0; i < players_number; i++) {
                if ((players[i].x + players[i].radius >= ball.x - 0.1) &&
                    (players[i].x - players[i].radius <= ball.x + ball.dimensions) &&
                    (players[i].y + players[i].radius >= ball.y - 0.1) &&
                    (players[i].y - players[i].radius <= ball.y + ball.dimensions)) {

                    player_collision(players[i], ball);
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