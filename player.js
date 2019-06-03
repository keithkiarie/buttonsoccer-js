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

function create_players(number) {
    players = [];
    let half = number / 2;

    //initial positioning
    let x_portion = gamecanvas.width / (half + 1);

    //create players
    for (let i = 0; i < number; i++) {

        if (i < half) {
            players.push(new Player((i + 1) * x_portion, gamecanvas.height * 0.1, player_radius, 1, i, team_1_color));
        } else {
            players.push(new Player((i - half + 1) * x_portion, gamecanvas.height * 0.9, player_radius, 2, i, team_2_color));
        }
    }

    circle_drawer();
}

function player_movement() {
    //loop over the players, acting on each
    for (let i = 0; i < players_number; i++) {
        //apply friction
        players[i].unit_x *= players[i].friction;
        players[i].unit_y *= players[i].friction;

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

            //move the player
            players[i].x += players[i].unit_x;
            players[i].y += players[i].unit_y;

            repeat--;
        } while (repeat > 0);
    }
    circle_drawer();
}