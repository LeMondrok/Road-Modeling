'use strict';

import {configure} from './configure.js'
import {DrawAllInstances} from './draw.js'
import {AdditionState} from './add_panel'

class EmulationInstance {
	constructor(p, canvas_size, button_area, add_area) {
		this.max_uid = 0;

		//dicts uid: object
		this.map = {};
        this.objects = {};

        // dicts button_name: button_instance
        this.buttons = {};
        this.sliders = {};
        this.inputs = {};
        this.text = [];

        this.canvas_size = canvas_size;
        this.button_area = button_area;
        this.add_area = add_area;

        this.timers = [];
        this.speed = 1;
        this.scale = 1;
        this.p5 = p;

        // configure_file
        this.input;

        configure(this);

        // coords of the center
        this.coord = [0, 0];

        this.simulation = false;
        this.addition_mode = false;
        this.initialized = false;

        this.add_state = new AdditionState(this);
	}

	// Update states of all objects on the scene on every iteration
	Update() {
		if (this.addition_mode) {
			if (this.simulation)
				this.simulation = false;
		}

		this.add_state.Update();

		if (this.simulation || !this.initialized) {
			this.initialized = true;
			Object.keys(this.map).forEach(
				(type) => {
					Object.keys(this.map[type]).forEach(
						(uid) => {
							this.map[type][uid].Update(this);
						}
					);
				}
			);

			if (this.simulation) {
				Object.keys(this.objects).forEach(
					(type) => {
						Object.keys(this.objects[type]).forEach(
							(uid) => {
								this.objects[type][uid].Update(this);
							}
						);
					}
				);
			}
		}

		this.scale = this.sliders['scale'].value();
		this.speed = this.sliders['speed'].value();
	}

	// Draw all objects on the scene on every iteration
	Draw() {
		DrawAllInstances(this);
	}

	GetScreenCoords(x, y) {
		let ans = [
			this.scale * (x - this.coord[0]) + (this.canvas_size[0] * this.button_area) / 2,
			this.scale * (this.coord[1] - y) + this.canvas_size[1] / 2
		];

		return ans;
	}

	GetMapCoords(x, y) {
		let ans = [
			this.coord[0] + (x - (this.canvas_size[0] * this.button_area) / 2) / this.scale,
			this.coord[1] - (y - this.canvas_size[1] / 2) / this.scale
		];

		return ans;
	}
}

export default EmulationInstance;
