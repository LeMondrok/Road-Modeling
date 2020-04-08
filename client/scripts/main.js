function draw_car(car, ctx) {
    var img = new Image();
    img.src = "/car_sprites/car1.jpg";
    setTimeout(() => {ctx.drawImage(img, 100, 100);}, 10);
}


window.onload = function() {
    var drawingCanvas = document.getElementById('app_canvas');
    if(drawingCanvas && drawingCanvas.getContext) {
        var context = drawingCanvas.getContext('2d');
        // Рисуем окружность
        context.strokeStyle = "#000";
        context.fillStyle = "#fc0";
        context.beginPath();
        context.arc(100, 100, 50, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
        // Рисуем левый глаз
        context.fillStyle = "#fff";
        context.beginPath();
        context.arc(84, 90, 8, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
        // Рисуем правый глаз
        context.beginPath();
        context.arc(116, 90, 8, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();

        draw_car(1, context);
    }
};

window.onclick = function() {
    console.log(global_env);
};
