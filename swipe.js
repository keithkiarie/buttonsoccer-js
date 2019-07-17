//called by Swipe_Listener after it has collected details about the swipe
onswipe = (transformation) => {
    if (typeof (closest.id) == 'number') {
        players[closest.id].unit_x = transformation.x / transformation.duration;
        players[closest.id].unit_y = transformation.y / transformation.duration;
    }
}

//the object that is closest to the touched area
let closest = {
    "id": null,
    "dist": null
};

ontouch = (first_x, first_y) => {
    closest.id = null;
    closest.dist = null;

    //loop through the objects to find the closest to the touch area but should be within a reasonable radius
    for (let i = 0; i < players.length; i++) {
        //check if this player is close to the touched area
        if (first_x + touch_allowance >= players[i].x - players[i].radius &&
            first_y + touch_allowance >= players[i].y - players[i].radius &&
            first_x - touch_allowance <= players[i].x + players[i].radius &&
            first_y - touch_allowance <= players[i].y + players[i].radius) {

            //calculate closeness
            let dx = first_x - players[i].x;
            let dy = first_y - players[i].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            //check if it is closer than the previously set
            if (closest.dist == null) {
                closest.id = i;
                closest.dist = dist;
            } else if (closest.dist > dist) {
                closest.id = i;
                closest.dist = dist;
            }
        }

    }

    //action the object that is decided to be the one intended by the user
    if (typeof (closest.id) == 'number') {
        players[closest.id].unit_x = 0;
        players[closest.id].unit_y = 0;
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

        //stop the playing object being touched
        ontouch(obj.first_x - gamecanvas.offsetLeft, obj.first_y - gamecanvas.offsetTop);

        //call touch_stop after a certain duration of listening to the touch
        setTimeout(() => obj.touch_stop(), touch_duration);
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
        onswipe(obj.transformation);
    };
}