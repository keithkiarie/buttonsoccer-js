let in_main_menu = true;


//creating the canvas for the user interface
ui_canvas = document.createElement("canvas");
ui_canvas.id = "ui_canvas";
ui_canvas.style.border = "1px solid #000000";

ui_canvas.width = window.innerWidth;
ui_canvas.height = window.innerHeight;
ui_ctx = ui_canvas.getContext("2d");

document.getElementById("main_menu").appendChild(ui_canvas);

let positions_before_swipe = [];

function draw_ui() {
    if (in_main_menu) {
        //draw the grass
        ui_ctx.drawImage(document.getElementById("ui_grass"), 0, 0, window.innerWidth, window.innerHeight);

        //write the ui buttons
        for (i in ui_buttons) {

            //buttons that only appear in one page
            if (ui_buttons[i].page != "all") {
                ui_ctx.beginPath();
                ui_ctx.arc(ui_buttons[i].cx, ui_buttons[i].cy, ui_buttons[i].radius, 0, 2 * Math.PI);
                ui_ctx.stroke();
                ui_ctx.fillStyle = ui_buttons[i].color;
                ui_ctx.fill();

                ui_ctx.font = "20px Comic Sans MS";
                ui_ctx.fillStyle = "red";

                if (window.innerHeight > window.innerWidth) {
                    //on SMARTPHONES, text should be rotated

                    ui_ctx.save();
                    ui_ctx.rotate(90 * Math.PI / 180);

                    if (ui_buttons[i].text_1 != undefined) {
                        ui_ctx.fillText(ui_buttons[i].text_1, ui_buttons[i].cy - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), (-ui_buttons[i].cx));
                        ui_ctx.fillText(ui_buttons[i].text_2, ui_buttons[i].cy - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), (-ui_buttons[i].cx) + 20);
                    } else {
                        ui_ctx.fillText(ui_buttons[i].text, ui_buttons[i].cy - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), (-ui_buttons[i].cx));
                    }


                    ui_ctx.restore();

                    //move the buttons on swipe
                    if (ui_swiped == 'right' && ui_buttons[i].cy < ui_buttons[i].defaults.page_1.cy) {
                        ui_buttons[i].cy += ui_swipe_speed;

                    } else if (ui_swiped == 'left' && ui_buttons[i].cy > ui_buttons[i].defaults.page_2.cy) {
                        ui_buttons[i].cy -= ui_swipe_speed;
                    }

                } else {
                    //on LAPTOPS

                    if (ui_buttons[i].text_1 != undefined) {
                        ui_ctx.fillText(ui_buttons[i].text_1, ui_buttons[i].cx - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), ui_buttons[i].cy);
                        ui_ctx.fillText(ui_buttons[i].text_2, ui_buttons[i].cx - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), ui_buttons[i].cy + 20);
                    } else {
                        ui_ctx.fillText(ui_buttons[i].text, ui_buttons[i].cx - (ui_ctx.measureText(ui_buttons[i].text_1).width / 2), ui_buttons[i].cy);
                    }

                    //move the buttons on swipe
                    if (ui_swiped == 'right' && ui_buttons[i].cx < ui_buttons[i].defaults.page_1.cx) {
                        ui_buttons[i].cx += ui_swipe_speed;

                    } else if (ui_swiped == 'left' && ui_buttons[i].cx > ui_buttons[i].defaults.page_2.cx) {
                        ui_buttons[i].cx -= ui_swipe_speed;
                    }
                }


            } else {
                //buttons that appear in all the pages of the UI

                ui_ctx.drawImage(ui_buttons[i].img, ui_buttons[i].x, ui_buttons[i].y, ui_buttons[i].width, ui_buttons[i].height);
            }
        }


        //call the function again in the next frame
        requestAnimationFrame(draw_ui);
    }
}

draw_ui();