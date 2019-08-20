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

//creates the ball
function create_ball() {
    ball = new Ball(ball_initial_position.x, ball_initial_position.y, ball_dimensions, ball_id);
}

//creates the pieces for playing
function create_players(number) {
    //create the players for both teams and populate them into the array
    for (let i = 0; i < number; i++) {
        if (i < number / 2) {
            players.push(new Player(0, 0, player_radius, 1, i, team_1_color));
        } else {
            players.push(new Player(0, 0, player_radius, 2, i, team_2_color));
        }
    }

    //position the players properly in the field
    initial_players_positioning();
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
            if (window.innerHeight > window.innerWidth) {
                //SMARTPHONE form factor

                //if a player is in the goal
                if (players[i].y - players[i].radius < outside_pitch.side || players[i].y + players[i].radius > outside_pitch.side + play_area.height) {
                    //contact with goal post
                    if (players[i].x + players[i].radius >= goal_post.x1 + goal_post.width - 10 && players[i].unit_x > 0) {
                        players[i].unit_x = -players[i].unit_x;
                    } else if (players[i].x - players[i].radius <= goal_post.x1 + 10 && players[i].unit_x < 0) {
                        players[i].unit_x = -players[i].unit_x;
                    }
                }

                //if a player is headed for the goal
                if (players[i].y - players[i].radius <= outside_pitch.side + 2 && players[i].unit_y < 0 &&
                    players[i].x - players[i].radius - 5 > goal_post.x1 && players[i].x + players[i].radius + 5 < goal_post.x1 + goal_post.width) {

                } else if (players[i].y + players[i].radius >= outside_pitch.side + play_area.height - 2 && players[i].unit_y > 0 &&
                    players[i].x - players[i].radius - 5 > goal_post.x1 && players[i].x + players[i].radius + 5 < goal_post.x1 + goal_post.width) {

                }
                //check for player contact with field boundary
                else if (players[i].x + players[i].radius >= gamecanvas.width - outside_pitch.top - 2 && players[i].unit_x > 0) {
                    players[i].unit_x = -players[i].unit_x;
                } else if (players[i].x - players[i].radius <= 2 && players[i].unit_x < 0) {
                    players[i].unit_x = -players[i].unit_x;
                } else if (players[i].y + players[i].radius >= gamecanvas.height - outside_pitch.side - 2 && players[i].unit_y > 0) {
                    players[i].unit_y = -players[i].unit_y;
                } else if (players[i].y - players[i].radius <= outside_pitch.side + 2 && players[i].unit_y < 0) {
                    players[i].unit_y = -players[i].unit_y;
                }


                //check for ball contact with field boundary
                //if the ball is in the goal
                if (ball.y < outside_pitch.side || ball.y + ball.dimensions > outside_pitch.side + play_area.height) {
                    //GOOAAAAAAL!!!!
                    if (ball.y + ball.dimensions < outside_pitch.side) {
                        goal();
                        score_keeper('away');
                    } else if (ball.y > outside_pitch.side + play_area.height) {
                        goal();
                        score_keeper('home');
                    }

                    //contact with goal post
                    if (ball.x + ball.dimensions >= goal_post.x1 + goal_post.width - 10 && ball.unit_x > 0) {
                        ball.unit_x = -ball.unit_x;
                    } else if (ball.x <= goal_post.x1 + 10 && ball.unit_x < 0) {
                        ball.unit_x = -ball.unit_x;
                    }
                }


                //if the ball is headed for the goal
                if (ball.y <= outside_pitch.side + 2 && ball.unit_y < 0 &&
                    ball.x - 5 > goal_post.x1 && ball.x + ball.dimensions + 5 < goal_post.x1 + goal_post.width) {

                } else if (ball.y + ball.dimensions >= outside_pitch.side + play_area.height - 2 && ball.unit_y > 0 &&
                    ball.x - 5 > goal_post.x1 && ball.x + ball.dimensions + 5 < goal_post.x1 + goal_post.width) {

                }
                //check for ball contact with field boundary
                else if (ball.x + ball.dimensions >= gamecanvas.width - outside_pitch.top - 2 && ball.unit_x > 0) {
                    ball.unit_x = -ball.unit_x;
                } else if (ball.x <= 2 && ball.unit_x < 0) {
                    ball.unit_x = -ball.unit_x;
                } else if (ball.y + ball.dimensions >= gamecanvas.height - outside_pitch.side - 2 && ball.unit_y > 0) {
                    ball.unit_y = -ball.unit_y;
                } else if (ball.y <= outside_pitch.side + 2 && ball.unit_y < 0) {
                    ball.unit_y = -ball.unit_y;
                }
            } else {

                //LAPTOP

                //if a player is in the goal
                if (players[i].x - players[i].radius < outside_pitch.side || players[i].x + players[i].radius > outside_pitch.side + play_area.width) {
                    //contact with goal post
                    if (players[i].y + players[i].radius >= goal_post.y1 + goal_post.height - 10 && players[i].unit_y > 0) {
                        players[i].unit_y = -players[i].unit_y;
                    } else if (players[i].y - players[i].radius <= goal_post.y1 + 10 && players[i].unit_y < 0) {
                        players[i].unit_y = -players[i].unit_y;
                    }
                }

                //if a player is headed for the goal
                if (players[i].x - players[i].radius <= outside_pitch.side + 2 && players[i].unit_x < 0 &&
                    players[i].y - players[i].radius - 5 > goal_post.y1 && players[i].y + players[i].radius + 5 < goal_post.y1 + goal_post.height) {

                } else if (players[i].x + players[i].radius >= outside_pitch.side + play_area.width - 2 && players[i].unit_x > 0 &&
                    players[i].y - players[i].radius - 5 > goal_post.y1 && players[i].y + players[i].radius + 5 < goal_post.y1 + goal_post.height) {

                }
                //check for player contact with field boundary
                else if (players[i].x + players[i].radius >= gamecanvas.width - outside_pitch.side - 2 && players[i].unit_x > 0) {
                    players[i].unit_x = -players[i].unit_x;
                } else if (players[i].x - players[i].radius <= outside_pitch.side + 2 && players[i].unit_x < 0) {
                    players[i].unit_x = -players[i].unit_x;
                } else if (players[i].y + players[i].radius >= gamecanvas.height - 2 && players[i].unit_y > 0) {
                    players[i].unit_y = -players[i].unit_y;
                } else if (players[i].y - players[i].radius <= outside_pitch.top + 2 && players[i].unit_y < 0) {
                    players[i].unit_y = -players[i].unit_y;
                }

                //check for ball contact with field boundary
                //if the ball is in the goal
                if (ball.x < outside_pitch.side || ball.x + ball.dimensions > outside_pitch.side + play_area.width) {

                    //GOOAAAAAAL!!!!
                    if (ball.x + ball.dimensions < outside_pitch.side) {
                        goal();
                        score_keeper('away');
                    } else if (ball.x > outside_pitch.side + play_area.width) {
                        goal();
                        score_keeper('home');
                    }

                    //contact with goal post
                    if (ball.y + ball.dimensions >= goal_post.y1 + goal_post.height - 10 && ball.unit_y > 0) {
                        ball.unit_y = -ball.unit_y;
                    } else if (ball.y <= goal_post.y1 + 10 && ball.unit_y < 0) {
                        ball.unit_y = -ball.unit_y;
                    }
                }


                //if the ball is headed for the goal
                if (ball.x <= outside_pitch.side + 2 && ball.unit_x < 0 &&
                    ball.y - 5 > goal_post.y1 && ball.y + ball.dimensions + 5 < goal_post.y1 + goal_post.height) {

                } else if (ball.x + ball.dimensions >= outside_pitch.side + play_area.width - 2 && ball.unit_x > 0 &&
                    ball.y - 5 > goal_post.y1 && ball.y + ball.dimensions + 5 < goal_post.y1 + goal_post.height) {

                }
                //check for ball contact with field boundary
                else if (ball.x + ball.dimensions >= gamecanvas.width - outside_pitch.side - 2 && ball.unit_x > 0) {
                    ball.unit_x = -ball.unit_x;
                } else if (ball.x <= outside_pitch.side && ball.unit_x < 0) {
                    ball.unit_x = -ball.unit_x;
                } else if (ball.y + ball.dimensions >= gamecanvas.height - 2 && ball.unit_y > 0) {
                    ball.unit_y = -ball.unit_y;
                } else if (ball.y <= outside_pitch.top && ball.unit_y < 0) {
                    ball.unit_y = -ball.unit_y;
                }
            }


            //check for player contact with wall
            if (players[i].x + players[i].radius >= gamecanvas.width - 2 && players[i].unit_x > 0) {
                players[i].unit_x = -players[i].unit_x;
            } else if (players[i].x - players[i].radius <= 7 && players[i].unit_x < 0) {
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