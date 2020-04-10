class Car {
    constructor(x, y, width, height, vx, vy, img_src) {
        this.x_center = x;
        this.y_center = y;
        this.width = width;
        this.height = height;
        this.vx = vx;
        this.vy = vy;

        this.img = new Image();
        this.img.src = img_src;
    }

    Update(inst) {
        this.x_center += this.vx * inst.delta_time;
        this.y_center += this.vy * inst.delta_time;
    }
}

class Automobile extends Car {

    constructor(x, y, width, height, vx, vy, img_src, car_type) {
        super(x, y, width, height, vx, vy, img_src);
    }

    draw(inst) {
        if (inst.getRelCoord(this.x_center, this.y_center)[0] > 0 &&
            inst.getRelCoord(this.x_center, this.y_center)[0] < inst.xlen) {
            // console.log(inst.getRelCoord(this.x_center, this.y_center)[0]);
            // console.log(inst.xlen);
            inst.ctx.drawImage(this.img, this.x_center - this.width / 2, - this.y_center - this.height / 2,
                               this.width, this.height);
        }
    }
}

function genCars(inst) {
    let auto = new Automobile(0, -315, 30, 20, 60/1000, 0, "/car_sprites/car1.png", 1);
    inst.objects.push(auto);

    console.log(2);
}