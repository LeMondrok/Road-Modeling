function checkCollision(x, y, obj){//Проверяет входит ли точка в  прямоугольник
  	// alert(obj.x);
    return x >= obj.x && x <= obj.x + obj.w &&
    y >= obj.y && y <= obj.y + obj.h;
}

class Button {
    handler;

    draw() {
        this.ctx.font = "20px Arial ";
        this.ctx.fillStyle = "darkred";
        this.ctx.fillRect(this.x,this.y,this.w,this.h);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.text,this.x+this.w/2 - this.ctx.measureText(this.text).width/2,this.y+this.h/2+10 );
    }

    constructor(x_, y_, w_, h_, text, handler_, canvas) {
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
        this.text = text;

        this.handler = handler_;

        canvas.addEventListener("mousedown", (function(e){
		    if(checkCollision(e.offsetX, e.offsetY, this))
    	        this.handler();
        }).bind(this), false);

        this.ctx = canvas.getContext("2d");

        this.draw();
    }
}

function AddButtons(inst) {
    let btn_start = new Button(inst.drawingCanvas.width  - inst.menu_offset + 20, 100,
        inst.menu_offset - 40, 50, "start",
        function () { inst.Start(inst); }, inst.drawingCanvas);
    let btn_stop = new Button(inst.drawingCanvas.width  - inst.menu_offset + 20, 175,
        inst.menu_offset - 40, 50, "stop",
        function () { inst.Stop(inst); }, inst.drawingCanvas);

    let reconf_stop = new Button(inst.drawingCanvas.width  - inst.menu_offset + 20, 250,
        inst.menu_offset - 40, 50, "reconfigure",
        function () { inst.Reconfigure(inst); }, inst.drawingCanvas);

    inst.buttons.push(btn_start, btn_stop, reconf_stop);
}
