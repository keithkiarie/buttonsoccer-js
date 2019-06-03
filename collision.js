const player_collision = (ballA, ballB) => {
    let vxDist = ballA.unit_x - ballB.unit_x;
    let vyDist = ballA.unit_y - ballB.unit_y;

    let xDist = ballB.x - ballA.x;
    let yDist = ballB.y - ballA.y;

    if (vxDist * xDist + vyDist * yDist >= 0) {
        let angle = -Math.atan2(yDist, xDist);
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

        let vFinal1 = change_angles(v1.x, v1.y, -angle);
        let vFinal2 = change_angles(v2.x, v2.y, -angle);
        ballA.unit_x = vFinal1.x;
        ballA.unit_y = vFinal1.y;
        ballB.unit_x = vFinal2.x;
        ballB.unit_y = vFinal2.y;
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