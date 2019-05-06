var swipe_listener = new Swipe_Listener(gamecanvas);
var ctx = gamecanvas.getContext("2d");


onswipe = (transformation, first_x, first_y) => {
    //loop through all playing objects
    for (let i = 0; i < players.length; i++) {
        //check if this player is the one being swiped
        if (first_x >= players[i].x - players[i].radius && first_y >= players[i].y - players[i].radius && first_x <= players[i].x + players[i].radius && first_y <= players[i].y + players[i].radius) {
            players[i].unit_x = transformation.x / transformation.duration;
            players[i].unit_y = transformation.y / transformation.duration;

            players[i].move();
        }
    }
}

drawer = () => {
    ctx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);
    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.arc(players[i].x, players[i].y, players[i].radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

var players = [];
//create players
for (let i = 0; i < 6; i++) {
    switch (i) {
        case 0:
            players.push(new Player(50, 50, player_radius, 1));
            break;
        case 1:
            players.push(new Player(100, 50, player_radius, 1));
            break;
        case 2:
            players.push(new Player(50, 100, player_radius, 1));
            break;
        case 3:
            players.push(new Player(100, 100, player_radius, 2));
            break;
        case 4:
            players.push(new Player(50, 150, player_radius, 2));
            break;
        case 5:
            players.push(new Player(100, 150, player_radius, 2));
    }
    drawer();
}