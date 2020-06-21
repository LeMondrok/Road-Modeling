'use strict';

import RoadObject from './objects.js';
import {orth_vector, dist} from './geometry.js';

export let general_wideness = 10;

export class Road extends RoadObject {
	constructor(scene, from, to, lanes = 1, speed_limit = 60, uid = -1) {
		super(scene);

		this.from = from;
		this.from_road = scene.map['crossroads'][this.from];
		this.to = to;
		this.to_road = scene.map['crossroads'][this.to];
		this.length = dist(scene, this.from_road.position, this.to_road.position);
		this.lanes = lanes;
		this.speed_limit = speed_limit;
		this.orth_vec;
		this.cars = {};
		if (uid == -1)
			this.uid = ++scene.max_uid;
		else
			this.uid = uid;

		scene.map['roads'][this.uid] = this;

		scene.map['crossroads'][from].connected_roads.push(this.uid);
		scene.map['crossroads'][to].connected_roads.push(this.uid);
		scene.map['crossroads'][from].outgoing_roads.push(this.uid);
		scene.initialized = false;
	}

	Draw(scene) {
		if (this.from_road.position == this.to_road.position)
			return;

		let screen_coord1 = scene.GetScreenCoords(this.from_road.position[0], this.from_road.position[1]);
		let screen_coord2 = scene.GetScreenCoords(this.to_road.position[0], this.to_road.position[1]);

		let vec = [screen_coord1[0], screen_coord1[1]];
		vec[0] -= screen_coord2[0];
		vec[1] -= screen_coord2[1];

		// Get orthogonal vector and make roads wide
		this.orth_vec = orth_vector(scene, vec);

		// Scale coefficient
		let multiplier = this.lanes * scene.scale * general_wideness / 2;

		this.orth_vec[0] *= multiplier;
		this.orth_vec[1] *= multiplier;

		// Draw contour
		scene.p5.fill('white');
		scene.p5.stroke('white');
		scene.p5.beginShape();
		scene.p5.vertex(screen_coord1[0] + this.orth_vec[0], screen_coord1[1] + this.orth_vec[1]);
		scene.p5.vertex(screen_coord1[0] - this.orth_vec[0], screen_coord1[1] - this.orth_vec[1]);
		scene.p5.vertex(screen_coord2[0] - this.orth_vec[0], screen_coord2[1] - this.orth_vec[1]);
		scene.p5.vertex(screen_coord2[0] + this.orth_vec[0], screen_coord2[1] + this.orth_vec[1]);
		scene.p5.endShape(scene.p5.CLOSE);

		// Draw dividing lines
		let diff = [2 * this.orth_vec[0] / (this.lanes), 2 * this.orth_vec[1] / (this.lanes)];
		let coords = [
			screen_coord1[0] + this.orth_vec[0],
			screen_coord1[1] + this.orth_vec[1],
			screen_coord2[0] + this.orth_vec[0],
			screen_coord2[1] + this.orth_vec[1]
		];
		scene.p5.stroke('black');
		for (let ind = 0; ind < this.lanes; ++ind) {
			scene.p5.line(
				coords[0],
				coords[1],
				coords[2],
				coords[3],
			);

			coords[0] -= diff[0];
			coords[1] -= diff[1];
			coords[2] -= diff[0];
			coords[3] -= diff[1];
		}

		// Draw last line precisely
		scene.p5.line(
			screen_coord1[0] - this.orth_vec[0],
			screen_coord1[1] - this.orth_vec[1],
			screen_coord2[0] - this.orth_vec[0],
			screen_coord2[1] - this.orth_vec[1]
		);
	}

	Update(scene) {}

	Recalc(scene) {
		this.from_road = this.scene.map['crossroads'][this.from];
		this.to_road = this.scene.map['crossroads'][this.to];
		this.length = dist(this.scene, this.from_road.position, this.to_road.position);
	}

	Export(scene) {
		return [this.from, this.to, this.lanes, this.speed_limit, this.uid];	
	}
}

export class Crossroad extends RoadObject {
	constructor(scene, position, uid = -1) {
		super(scene);

		this.position = position;
		this.outgoing_roads = [];
		this.connected_roads = [];
		// last amount of checked roads to determine the size of the crossroad 
		this.last_checked_size = 0;
		this.diameter = 1;

		if (uid == -1)
			this.uid = ++scene.max_uid;
		else
			this.uid = uid;

		scene.map['crossroads'][this.uid] = this;
		scene.initialized = false;
	}

	Draw(scene) {
		let screen_coord = scene.GetScreenCoords(this.position[0], this.position[1]);

		scene.p5.fill('white');
		scene.p5.stroke('black');
		scene.p5.circle(screen_coord[0], screen_coord[1], this.diameter * general_wideness * scene.scale);
	}

	Update(scene) {
		while (this.last_checked_size != this.connected_roads.length) {
			let road = scene.map['roads'][this.connected_roads[this.last_checked_size]];
			if (this.diameter < road.lanes)
				this.diameter = road.lanes;

			this.last_checked_size++;
		}
	}

	Export(scene) {
		return [this.position[0], this.position[1], this.uid];	
	}
}
