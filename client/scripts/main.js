class EmulationInstance {
    constructor() {
        this.drawingCanvas = document.getElementById('app_canvas');
        this.ctx = this.drawingCanvas.getContext("2d");
        this.map = [];
        this.objects = [];
        this.buttons = [];
        this.timers = [];
        this.delta_time = 1000 / 60;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 800;
        this.y2 = -600;
        this.menu_offset = 200;
        this.xlen = this.drawingCanvas.width - this.menu_offset;
        this.ylen = this.drawingCanvas.height;

        global_env = "[[[0, -300], [800, -300], [400, 0], [400, -600]], [[0, 1], [2, 3]]]";

        window.addEventListener("resize", this.Resize);
        window.addEventListener("keydown", KeyDown);

        this.Start = function(inst) {
            parse_map(this);
            inst.timers.push(setInterval(function (e) {inst.Update(inst)}, 1000 / 60)); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
            inst.timers.push(setInterval(function (e) {genCars(inst)}, 5000));
        };

        this.Stop = function(inst) {
            for (let i = 0; i < inst.timers.length; ++i) {
                clearInterval(inst.timers[i]);
            }

            inst.timers = [];
        };

        this.Update = function(inst) {
            for(let i = 0; i < this.objects.length; ++i) {
                this.objects[i].Update(inst);
            }
            Draw(inst);
        };

        this.Reconfigure = function(inst) {
            readFile(document.getElementById('file'));
            parse_map(this);
        };

        this.Resize = function(inst)
        {
            inst.drawingCanvas.width = window.innerWidth - 100;
            inst.drawingCanvas.height = window.innerHeight - 100;
        };

        window.onclick = function(inst) {
            parse_map(inst);
        };

        AddButtons(this);
    }

    getRealCoord(x, y) {
        return [this.x1 + x * (this.x2 - this.x1), this.y1 - y * (this.y2 - this.y1)];
    }

    getRelCoord(x, y) {
        return [
            this.xlen * (x - this.x1) / (this.x2 - this.x1) + this.x1,
            this.ylen * (y - this.y1) / (this.y2 - this.y1) + this.y1
        ];
    }
}

let instance = new EmulationInstance();
