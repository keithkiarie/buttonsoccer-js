const player_collision = (ballA, ballB) => {
    let unit_dx = ballA.unit_x - ballB.unit_x;
    let unit_dy = ballA.unit_y - ballB.unit_y;

    let dx = ballB.x - ballA.x;
    let dy = ballB.y - ballA.y;

    if (unit_dx * dx + unit_dy * dy >= 0) {
        let angle = -Math.atan2(dy, dx);
        let u1 = change_angles(ballA.unit_x, ballA.unit_y, angle);
        let u2 = change_angles(ballB.unit_x, ballB.unit_y, angle);
        let v1 = {
            x: u2.x,
            y: u1.y
        };
        let v2 = {
            x: u1.x,
            y: u2.y
        };

        let a_new_unit = change_angles(v1.x, v1.y, -angle);
        let b_new_unit = change_angles(v2.x, v2.y, -angle);
        ballA.unit_x = a_new_unit.x;
        ballA.unit_y = a_new_unit.y;
        ballB.unit_x = b_new_unit.x;
        ballB.unit_y = b_new_unit.y;
    }
}

const change_angles = (x, y, angle) => {
    let length = Math.sqrt(x * x + y * y);

    angle += Math.atan2(y, x);

    return {
        x: length * Math.cos(angle),
        y: length * Math.sin(angle)
    };

}