function Player(x_position, y_position, circle_radius, players_team, identity) {
    this.x = x_position;
    this.y = y_position;
    this.radius = circle_radius;
    this.team = players_team;
    this.mass = 1;
    this.id = identity;

    this.unit_x = 0; //distance player moves horizontally
    this.unit_y = 0; //distance player  moves vertically
    this.moving_interval; //time interval before player moves a unit distance
    this.count;
    this.friction = 0.995;

    this.move = () => {
        //stop previous movement of the player
        if (this.moving_interval != undefined) {
            clearInterval(this.moving_interval);
        }

        //move player
        this.count = 0;
        
        this.moving_interval = setInterval(() => {
            this.count += 10;
            for (let i = 0; i < booster; i++) {
                if (this.x + this.radius >= gamecanvas.width - 2 && this.unit_x > 0) {
                    this.unit_x = -this.unit_x;
                } else if (this.x - this.radius <= 2 && this.unit_x < 0) {
                    this.unit_x = -this.unit_x;
                } else if (this.y + this.radius >= gamecanvas.height - 2 && this.unit_y > 0) {
                    this.unit_y = -this.unit_y;
                } else if (this.y - this.radius <= 2 && this.unit_y < 0) {
                    this.unit_y = -this.unit_y;
                }

                //check contact
                for (let j = 0; j < players.length; j++) {
                    if (players[i].id == this.id) {
                        continue;
                    } else if ((this.x + this.radius >= players[i].x - players[i].radius - 0.1) &&
                        (this.x - this.radius <= players[i].x + players[i].radius + 0.1) &&
                        (this.y + this.radius >= players[i].y - players[i].radius - 0.1) &&
                        (this.y - this.radius <= players[i].y + players[i].radius + 0.1)) {

                        
                        player_collision(this, players[i]);
                        break;
                    }
                }

                this.x += this.unit_x;
                this.y += this.unit_y;

                //draw
                drawer();
            }

            this.unit_x *= this.friction;
            this.unit_y *= this.friction;
        }, 10);
    }
}