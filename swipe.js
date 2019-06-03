onswipe = (transformation, first_x, first_y) => {
    //loop through all playing objects
    for (let i = 0; i < players.length; i++) {
        //check if this player is the one being swiped
        if (first_x >= players[i].x - players[i].radius && first_y >= players[i].y - players[i].radius && first_x <= players[i].x + players[i].radius && first_y <= players[i].y + players[i].radius) {
            players[i].unit_x = transformation.x / transformation.duration;
            players[i].unit_y = transformation.y / transformation.duration;
        }
    }
}


function Swipe_Listener(swiping_area) {
    this.area = swiping_area;
    this.transformation = {
        x: 0,
        y: 0,
        duration: 0
    };

    //touch has started
    this.area.addEventListener('touchstart', function (e) {
        this.movement = false;
        this.first_x = event.touches[0].clientX;
        this.first_y = event.touches[0].clientY;
        this.start_time = Date.now();
    });

    //swiping
    this.area.addEventListener('touchmove', function (e) {
        this.movement = true;
        this.current_x = e.changedTouches[0].pageX;
        this.current_y = e.changedTouches[0].pageY;
    });

    //touch has ended
    this.area.addEventListener('touchend', function (e) {
        this.end_time = Date.now();
        this.duration = this.end_time - this.start_time;

        if (this.movement) {
            this.last_x = this.current_x;
            this.last_y = this.current_y;
        } else {
            this.last_x = this.first_x;
            this.last_y = this.first_y;
        }

        this.vector_x = this.last_x - this.first_x;
        this.vector_y = this.last_y - this.first_y;

        this.transformation = {
            x: this.vector_x,
            y: this.vector_y,
            duration: this.duration
        };

        //call custom function to act on the data
        onswipe(this.transformation, this.first_x - gamecanvas.offsetLeft, this.first_y - gamecanvas.offsetTop);
    });
}