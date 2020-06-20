'use strict';

import RoadObject from './objects.js';
import {general_wideness} from './road.js'

class Car extends RoadObject {
	constructor(scene, current_road, target_point, type, uid) {
		super(scene);

		this.current_road = current_road;
		this.target_point = target_point;
		this.type = type;
		this.momental_speed = 0.1;
		this.location = 0;
		// //////
		this.lane = 1;
		if (uid == -1)
			this.uid = ++scene.max_uid;
		else
			this.uid = uid;

		scene.objects['cars'][this.uid] = this;
	};

	Draw(scene) {
		let road = scene.map['roads'][this.current_road];

		let center = [road.from_road.position[0], road.from_road.position[1]];
		// set the lane
		center[0] += road.orth_vec[0] * (1 - 2 * (this.lane - 0.5) / road.lanes);
		center[1] += road.orth_vec[1] * (1 - 2 * (this.lane - 0.5) / road.lanes);

		// move on the road
		center[0] += (this.location / road.length) * (road.to_road.position[0] - road.from_road.position[0]);
		center[1] += (this.location / road.length) * (road.to_road.position[1] - road.from_road.position[1]);


		let coords = scene.GetScreenCoords(center[0], center[1]);
		let offset = general_wideness * scene.scale;

		let color;
		if (this.type == 1) {
			color = 'red';
		} else if (this.type == 2) {
			color = 'green';
		} else if (this.type == 3) {
			color = 'yellow';
		} else if (this.type == 4) {
			color = 'pink';
		} else if (this.type == 5) {
			color = 'orange';
		}

		scene.p5.stroke(color);
		scene.p5.fill(color);
		// scene.p5.circle(coords[0], coords[1], 20);
		scene.p5.rect(
			coords[0] - offset / 2,
			coords[1] - offset / 2,
			offset,
			offset
		);
	}

	Update(scene) {
		this.location += this.momental_speed * scene.p5.deltaTime * scene.speed;
		if (this.location < 0)
			this.location = 0;

		if (this.location >= scene.map['roads'][this.current_road].length)
			this.location = scene.map['roads'][this.current_road].length;
	}
}

export default Car;
