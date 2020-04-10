function parse_map(inst) {
    inst.map = JSON.parse(global_env);
}

function draw_map(inst) {
    for (let i = 0; i < inst.map[1].length; ++i) {
        let relcords = [
            inst.getRelCoord(inst.map[0][inst.map[1][i][0]][0], inst.map[0][inst.map[1][i][0]][1]),
            inst.getRelCoord(inst.map[0][inst.map[1][i][1]][0], inst.map[0][inst.map[1][i][1]][1])
        ];

        inst.ctx.lineWidth = 12 * 5;
        inst.ctx.strokeStyle = "#000000";
        inst.ctx.lineJoin = "round";
        inst.ctx.beginPath();
        inst.ctx.moveTo(relcords[0][0], relcords[0][1]);
        inst.ctx.lineTo(relcords[1][0], relcords[1][1]);
        inst.ctx.stroke();
        inst.ctx.closePath();

        inst.ctx.lineWidth = 10 * 5;
        inst.ctx.strokeStyle = "#ffffff";
        inst.ctx.lineJoin = "round";
        inst.ctx.beginPath();
        inst.ctx.moveTo(relcords[0][0], relcords[0][1]);
        inst.ctx.lineTo(relcords[1][0], relcords[1][1]);
        inst.ctx.stroke();
        inst.ctx.closePath();

        inst.ctx.lineWidth = 1 * 5;
        inst.ctx.strokeStyle = "#000000";
        inst.ctx.lineJoin = "round";
        inst.ctx.beginPath();
        inst.ctx.moveTo(relcords[0][0], relcords[0][1]);
        inst.ctx.lineTo(relcords[1][0], relcords[1][1]);
        inst.ctx.stroke();
        inst.ctx.closePath();
    }
}

function draw_objects(inst) {
    for (let i = 0; i < inst.objects.length; ++i) {
        inst.objects[i].draw(inst);
    }
}

function draw_buttons(inst) {
    for (let i = 0; i < inst.buttons.length; ++i) {
        inst.buttons[i].draw();
    }
}

function Draw(inst) {
    inst.ctx.fillStyle = "white";
    inst.ctx.clearRect(0, 0, inst.drawingCanvas.width, inst.drawingCanvas.height);
    draw_map(inst);
    draw_objects(inst);
    draw_buttons(inst);
}
