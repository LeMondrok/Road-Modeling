'use strict'

import {Crossroad, Road} from './road.js'
import CarGen from './car_generators.js'

export class AdditionState {
    constructor(scene) {
        this.scene = scene;
        this.mode = 0;
        this.offset = 5;
        this.last_state = this.scene.addition_mode;
        this.text = [];

        this.button_arr = [];

        this.crossroad_params = {
            'position': null,
            'road': null,
            'choose_road': false,
        };

        this.road_params = {
            'from': null,
            'to': null,
            'lanes': 5,
            'choose_from': false,
            'choose_to': false,
        };

        this.cargen_params = {
            'from': null,
            'to': null,
            'type': null,
            'timer': null,
            'choose_from': false,
            'choose_to': false,
        };
    }

    Update() {
        if (this.scene.addition_mode == 1) {
            if (this.mode == 1)
                this.UpdateAddCrossroad();
            if (this.mode == 2)
                this.UpdateAddRoad();
            if (this.mode == 3)
                this.UpdateAddGen();
        } else if (this.last_state) {
            this.button_arr.forEach((elem) => {elem.remove();});
            this.button_arr = [];
            this.mode = 0;
        }

        this.last_state = this.scene.addition_mode;
    }

    UpdateAddCrossroad() {
        if (this.crossroad_params['choose_road'] == true && this.scene.p5.mouseIsPressed) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_road(this.scene, mouse_cord);

            if (closest[1] == null || closest[1] > this.offset) {
                this.crossroad_params['position'] = mouse_cord;
                this.crossroad_params['road'] = null;
            } else {
                this.crossroad_params['position'] = closest[2];
                this.crossroad_params['road'] = closest[0];
            }
        }
    }

    UpdateAddRoad() {
        if (this.road_params['choose_from'] == true &&
            this.scene.p5.mouseIsPressed &&
            this.scene.p5.mouseY < this.scene.button_area * this.scene.canvas_size[1]) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_crossroad(this.scene, mouse_cord)[0];

            this.road_params['from'] = closest;
        }

        if (this.road_params['choose_to'] == true &&
            this.scene.p5.mouseIsPressed &&
            this.scene.p5.mouseY < this.scene.button_area * this.scene.canvas_size[1]) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_crossroad(this.scene, mouse_cord)[0];

            this.road_params['to'] = closest;
        }
    }

    UpdateAddGen() {
        if (this.cargen_params['choose_from'] == true &&
            this.scene.p5.mouseIsPressed &&
            this.scene.p5.mouseY < this.scene.button_area * this.scene.canvas_size[1]) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_road(this.scene, mouse_cord);

            this.cargen_params['from'] = closest[0];
        }

        if (this.cargen_params['choose_to'] == true &&
            this.scene.p5.mouseIsPressed &&
            this.scene.p5.mouseY < this.scene.button_area * this.scene.canvas_size[1]) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_crossroad(this.scene, mouse_cord);

            this.cargen_params['to'] = closest[0];
        }
    }

    Draw() {
        this.scene.p5.fill(this.scene.p5.color(204, 203, 208));
        this.scene.p5.rect(
            0,
            this.scene.canvas_size[1] * this.scene.add_area,
            this.scene.canvas_size[0] * this.scene.button_area,
            this.scene.canvas_size[1],
            10
        );

        if (this.mode == 1)
            this.DrawAddCrossroad();

        if (this.mode == 2)
            this.DrawAddRoad();

        if (this.mode == 3)
            this.DrawAddGen();
    }

    DrawAddCrossroad() {
        if (this.crossroad_params['choose_road'] == true) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_road(this.scene, mouse_cord);
            let coords;

            if (closest[1] == null || closest[1] > this.offset) {
                coords = mouse_cord;
            } else {
                coords = closest[2];
            }

            coords = this.scene.GetScreenCoords(coords[0], coords[1]);
            this.scene.p5.fill('orange');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        if (this.crossroad_params['position'] != null) {
            let coords = this.scene.GetScreenCoords(this.crossroad_params['position'][0], this.crossroad_params['position'][1]);
            this.scene.p5.fill('green');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }
    }

    DrawAddRoad() {
        if (this.road_params['choose_from'] == true || this.road_params['choose_to'] == true) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_crossroad(this.scene, mouse_cord)[0].position;

            let coords = this.scene.GetScreenCoords(closest[0], closest[1]);
            this.scene.p5.fill('orange');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        if (this.road_params['from'] != null) {
            let coords = this.scene.GetScreenCoords(this.road_params['from'].position[0], this.road_params['from'].position[1]);
            this.scene.p5.fill('red');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        if (this.road_params['to'] != null) {
            let coords = this.scene.GetScreenCoords(this.road_params['to'].position[0], this.road_params['to'].position[1]);
            this.scene.p5.fill('blue');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        this.scene.p5.textSize(16);
        this.scene.p5.textFont("Bodoni");
        this.scene.p5.strokeWeight(0);

        this.text.forEach(
            (item, index) => {
                this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
                this.scene.p5.fill(item[2]);
                if (index == 0) {
                    item[0] = 'lanes:' + this.button_arr[5].value();
                }
                this.scene.p5.text(item[0], item[1][0], item[1][1], item[1][2], item[1][3]);
            }
        );

        this.scene.p5.strokeWeight(1);
    }

    DrawAddGen() {
        if (this.cargen_params['choose_to'] == true) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_crossroad(this.scene, mouse_cord)[0].position;

            let coords = this.scene.GetScreenCoords(closest[0], closest[1]);
            this.scene.p5.fill('orange');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        if (this.cargen_params['choose_from'] == true) {
            let mouse_cord = this.scene.GetMapCoords(this.scene.p5.mouseX, this.scene.p5.mouseY);
            let closest = closest_road(this.scene, mouse_cord);
            let coords = closest[2];

            coords = this.scene.GetScreenCoords(coords[0], coords[1]);
            this.scene.p5.fill('orange');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        if (this.cargen_params['from'] != null) {
            let cross = this.scene.map['crossroads'][this.cargen_params['from'].from];
            let coords = this.scene.GetScreenCoords(cross.position[0], cross.position[1]);
            this.scene.p5.fill('red');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        if (this.cargen_params['to'] != null) {
            let coords = this.scene.GetScreenCoords(this.cargen_params['to'].position[0], this.cargen_params['to'].position[1]);
            this.scene.p5.fill('blue');
            this.scene.p5.circle(
                coords[0], coords[1], 10
            );
        }

        this.scene.p5.textSize(16);
        this.scene.p5.textFont("Bodoni");
        this.scene.p5.strokeWeight(0);

        this.text.forEach(
            (item, index) => {
                this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
                this.scene.p5.fill(item[2]);
                if (index == 0) {
                    item[0] = 'type: ' + this.button_arr[5].value();
                } else if (index == 1) {
                    item[0] = 'delay: ' + this.button_arr[6].value();
                }
                this.scene.p5.text(item[0], item[1][0], item[1][1], item[1][2], item[1][3]);
            }
        );

        this.scene.p5.strokeWeight(1);
    }

    ChangeMode(mode) {
        if (this.mode == mode)
            return;

        this.mode = mode;
        this.choose_road = false;
        this.choose_crossroad = false;
        this.choose_position = false;

        this.button_arr.forEach((elem) => {elem.remove();});
        this.button_arr = [];
        this.AddChangeModeButtons();

        if (mode == 1) {
            this.crossroad_params = {
                'position': null,
                'road': null,
                'choose_road': false,
            };

            this.AddMode1Buttons();
        } else if (mode == 2) {
            this.road_params = {
                'from': null,
                'to': null,
                'lanes': null,
                'choose_from': false,
                'choose_to': false
            };

            this.AddMode2Buttons();
        } else if (mode == 3) {
            this.cargen_params = {
                'from': null,
                'to': null,
                'type': null,
                'timer': null,
                'choose_from': false,
                'choose_to': false,
            };

            this.AddMode3Buttons();
        }
    }

    TurnSetPosition() {
        this.crossroad_params['choose_road'] = true;
    }

    TurnSetFromRoad() {
        this.road_params['choose_from'] = true;
        this.road_params['choose_to'] = false;
    }

    TurnSetToRoad() {
        this.road_params['choose_from'] = false;
        this.road_params['choose_to'] = true;
    }

    TurnSetFromCargen() {
        this.cargen_params['choose_from'] = true;
        this.cargen_params['choose_to'] = false;
    }

    TurnSetToCargen() {
        this.cargen_params['choose_from'] = false;
        this.cargen_params['choose_to'] = true;
    }

    CreateCrossroad() {
        if (this.crossroad_params['position'] != null) {
            let cross = new Crossroad(this.scene, this.crossroad_params['position']);
            this.crossroad_params['position'] = null;

            if (this.crossroad_params['road'] != null) {
                let road = new Road(
                    this.scene,
                    cross.uid,
                    this.crossroad_params['road'].to,
                    this.crossroad_params['road'].lanes,
                    this.crossroad_params['road'].speed_limit
                );

                this.crossroad_params['road'].to = cross.uid;
                this.crossroad_params['road'].Recalc();
                this.crossroad_params['road'] = null;

                this.scene.initialized = 0;

                this.choose_road = false;
                this.choose_position = false;
            }
        }
    }

    CreateRoad() {
        if (this.road_params['from'] != null && this.road_params['to'] != null) {
            let road = new Road(
                this.scene,
                this.road_params['from'].uid,
                this.road_params['to'].uid,
                this.button_arr[5].value(),
            );

            this.road_params = {
                'from': null,
                'to': null,
                'lanes': null,
                'choose_from': false,
                'choose_to': false
            };
        }
    }

    CreateCargen() {
        if (this.cargen_params['from'] != null) {
            let endpoint = null;
            if (this.cargen_params['to'] != null)
                endpoint = this.cargen_params['to'].uid;

            let cargen = new CarGen(
                this.scene,
                this.cargen_params['from'].uid,
                endpoint,
                this.button_arr[5].value(), 
                this.button_arr[6].value() * 1000
            );

            this.cargen_params = {
                'from': null,
                'to': null,
                'type': null,
                'timer': null,
                'choose_from': false,
                'choose_to': false,
            };        }
    }

    AddChangeModeButtons() {
        let offset = this.scene.canvas_size[0] * this.scene.button_area / 7;
        let y_offset = this.scene.canvas_size[1] * this.scene.add_area;
        let y_step = this.scene.canvas_size[1] * (1 - this.scene.add_area) / 5;

        let button1 = this.scene.p5.createButton('add crossroad');
        button1.position(offset, y_offset + y_step);
        button1.size(offset);
        button1.mousePressed(() => {this.ChangeMode(1)});
        this.button_arr.push(button1);

        let button2 = this.scene.p5.createButton('add road');
        button2.position(offset * 3, y_offset + y_step);
        button2.size(offset);
        button2.mousePressed(() => {this.ChangeMode(2)});
        this.button_arr.push(button2);

        let button3 = this.scene.p5.createButton('add cargen');
        button3.position(offset * 5, y_offset + y_step);
        button3.size(offset);
        button3.mousePressed(() => {this.ChangeMode(3);});
        this.button_arr.push(button3);
    }

    AddMode1Buttons() {
        let y_offset = this.scene.canvas_size[1] * this.scene.add_area;
        let y_step = this.scene.canvas_size[1] * (1 - this.scene.add_area) / 4;

        let button1 = this.scene.p5.createButton('set position');
        let offset = this.scene.canvas_size[0] * this.scene.button_area / 5;
        button1.position(offset, y_offset + 2 * y_step);
        button1.size(offset);
        button1.mousePressed(() => {this.TurnSetPosition()});

        this.button_arr.push(button1);

        let button2 = this.scene.p5.createButton('create crossroad');
        button2.position(offset * 3, y_offset + 2 * y_step);
        button2.size(offset);
        button2.mousePressed(() => {this.CreateCrossroad()});

        this.button_arr.push(button2);
    }

    AddMode2Buttons() {
        this.text = [];

        let y_offset = this.scene.canvas_size[1] * this.scene.add_area;
        let y_step = this.scene.canvas_size[1] * (1 - this.scene.add_area) / 4;

        let button1 = this.scene.p5.createButton('starting crossroad');
        let offset = this.scene.canvas_size[0] * this.scene.button_area / 9;
        button1.position(offset, y_offset + 2 * y_step);
        button1.size(offset);
        button1.mousePressed(() => {this.TurnSetFromRoad()});

        this.button_arr.push(button1);

        let button2 = this.scene.p5.createButton('ending crossroad');
        button2.position(offset * 3, y_offset + 2 * y_step);
        button2.size(offset);
        button2.mousePressed(() => {this.TurnSetToRoad()});

        this.button_arr.push(button2);

        let slider = this.scene.p5.createSlider(1, 5, 1, 1);
        slider.position(offset * 5, y_offset + 2 * y_step);
        slider.size(offset);
        this.button_arr.push(slider);

        this.text.push([
            'lanes',
            [offset * 5, y_offset + 2 * y_step + 20, offset, 30],
            'black'
        ]);

        let button3 = this.scene.p5.createButton('create road');
        button3.position(offset * 7, y_offset + 2 * y_step);
        button3.size(offset);
        button3.mousePressed(() => {this.CreateRoad()});

        this.button_arr.push(button3);
    }

    AddMode3Buttons() {
        this.text = [];

        let y_offset = this.scene.canvas_size[1] * this.scene.add_area;
        let y_step = this.scene.canvas_size[1] * (1 - this.scene.add_area) / 4;

        let button1 = this.scene.p5.createButton('starting road');
        let offset = this.scene.canvas_size[0] * this.scene.button_area / 11;
        button1.position(offset, y_offset + 2 * y_step);
        button1.size(offset);
        button1.mousePressed(() => {this.TurnSetFromCargen()});

        this.button_arr.push(button1);

        let button2 = this.scene.p5.createButton('ending crossroad');
        button2.position(offset * 3, y_offset + 2 * y_step);
        button2.size(offset);
        button2.mousePressed(() => {this.TurnSetToCargen()});

        this.button_arr.push(button2);

        let slider1 = this.scene.p5.createSlider(1, 5, 1, 1);
        slider1.position(offset * 5, y_offset + 2 * y_step);
        slider1.size(offset);
        this.button_arr.push(slider1);

        this.text.push([
            'type',
            [offset * 5, y_offset + 2 * y_step + 20, offset, 30],
            'black'
        ]);

        let slider2 = this.scene.p5.createSlider(1, 5, 1, 1);
        slider2.position(offset * 7, y_offset + 2 * y_step);
        slider2.size(offset);
        this.button_arr.push(slider2);

        this.text.push([
            'delay',
            [offset * 7, y_offset + 2 * y_step + 20, offset, 30],
            'black'
        ]);

        let button3 = this.scene.p5.createButton('create cargen');
        button3.position(offset * 9, y_offset + 2 * y_step);
        button3.size(offset);
        button3.mousePressed(() => {this.CreateCargen()});

        this.button_arr.push(button3);
    }
}


export function turnAddMode(scene) {
    scene.addition_mode = true;
    scene.add_state.ChangeMode(1);
}


import {get_dist, dist} from './geometry.js'

function closest_road(scene, target_point) {
    let road = null;
    let dist = null;
    let point = null;

    Object.keys(scene.map['roads']).forEach(
        (uid) => {
            let point1 = scene.map['roads'][uid].from_road.position;
            let point2 = scene.map['roads'][uid].to_road.position;
            let new_dist = get_dist(scene, target_point, point1, point2);
            if (dist == null || new_dist[0] < dist) {
                dist = new_dist[0];
                point = [new_dist[1], new_dist[2]];
                road = scene.map['roads'][uid];
            }
        }
    );

    return [road, dist, point];
}

function closest_crossroad(scene, target_point) {
    let crossroad = null;
    let distance = null;

    Object.keys(scene.map['crossroads']).forEach(
        (uid) => {
            let point = scene.map['crossroads'][uid].position;
            let new_dist = dist(scene, target_point, point);

            if (distance == null || new_dist < distance) {
                distance = new_dist;
                crossroad = scene.map['crossroads'][uid];
            }
        }
    );

    return [crossroad, distance];
}