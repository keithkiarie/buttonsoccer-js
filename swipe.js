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

ontouch = (first_x, first_y) => {
    //loop through all playing objects
    for (let i = 0; i < players.length; i++) {
        //check if this player is the one being swiped
        if (first_x >= players[i].x - players[i].radius && first_y >= players[i].y - players[i].radius && first_x <= players[i].x + players[i].radius && first_y <= players[i].y + players[i].radius) {
            players[i].unit_x = 0;
            players[i].unit_y = 0;
        }
    }
}


function Swipe_Listener(swiping_area) {
    let obj = this;

    this.first_x, this.first_y, this.current_x, this.current_y, this.vector_x, this.vector_y, this.duration;

    this.area = swiping_area;
    this.transformation = {
        x: 0,
        y: 0,
        duration: 0
    };

    //touch has started
    this.area.addEventListener('touchstart', function (e) {
        obj.first_x = event.touches[0].clientX;
        obj.first_y = event.touches[0].clientY;

        obj.current_x = obj.first_x;
        obj.current_y = obj.first_y;

        setTimeout(() => obj.touch_stop(), touch_duration);
        
        //stop the playing object being touched
        ontouch(obj.first_x - gamecanvas.offsetLeft, obj.first_y - gamecanvas.offsetTop);
    });

    //swiping
    this.area.addEventListener('touchmove', function (e) {
        obj.current_x = e.changedTouches[0].pageX;
        obj.current_y = e.changedTouches[0].pageY;
    });


    //touch has ended
    this.touch_stop = () => {
        
        obj.duration = touch_duration;

        obj.vector_x = obj.current_x - obj.first_x;
        obj.vector_y = obj.current_y - obj.first_y;

        obj.transformation = {
            x: obj.vector_x,
            y: obj.vector_y,
            duration: this.duration
        };

        //call custom function to act on the data
        onswipe(obj.transformation, obj.first_x - gamecanvas.offsetLeft, obj.first_y - gamecanvas.offsetTop);
    };
}