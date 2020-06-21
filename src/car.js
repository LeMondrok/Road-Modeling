'use strict';

import RoadObject from './objects.js';
import {general_wideness} from './road.js'

class Car extends RoadObject {
	constructor(scene, current_road, target_point, type, uid) {
		super(scene);

		this.current_road = current_road;
		this.target_point = target_point;
		this.next_road = null;
		this.type = type;
		this.momental_speed = 0;
		this.speed_modifyer = 0.004;
		this.location = 0;
		this.lane = scene.p5.ceil(scene.map['roads'][current_road].lanes / 2);
		this.target_lane = this.lane;
		if (uid == -1)
			this.uid = ++scene.max_uid;
		else
			this.uid = uid;

		scene.map['roads'][current_road].cars[this.uid] = true;
		scene.objects['cars'][this.uid] = this;

		this.next_road = next_road(scene, this);
	};

	Draw(scene) {
		let road = scene.map['roads'][this.current_road];

		let center = [road.from_road.position[0], road.from_road.position[1]];

		// move on the road
		center[0] += (this.location / road.length) * (road.to_road.position[0] - road.from_road.position[0]);
		center[1] += (this.location / road.length) * (road.to_road.position[1] - road.from_road.position[1]);


		let coords = scene.GetScreenCoords(center[0], center[1]);
		// set the lane
		coords[0] += road.orth_vec[0] * (1 - 2 * (this.lane - 0.5) / road.lanes);
		coords[1] += road.orth_vec[1] * (1 - 2 * (this.lane - 0.5) / road.lanes);

		let offset = 3 * general_wideness * scene.scale / 4;

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

		scene.p5.stroke('black');
	}

	Update(scene) {
		calc(scene, this);

		if (this.lane > this.target_lane + 0.05) {
			this.lane -= 0.005 * scene.p5.deltaTime;
		} else if (this.lane < this.target_lane - 0.05) {
			this.lane += 0.005 * scene.p5.deltaTime;
		}

		this.location += this.momental_speed * this.speed_modifyer * scene.p5.deltaTime * scene.speed;
		if (this.location < 0)
			this.location = 0;

		if (this.location >= scene.map['roads'][this.current_road].length) {
			delete scene.map['roads'][this.current_road].cars[this.uid];

			if (this.next_road == null || scene.map['roads'][this.current_road].to == this.target_point) {
				this.destroy(scene);
			} else {
				this.current_road = this.next_road;
				scene.map['roads'][this.current_road].cars[this.uid] = true;

				this.location = 0;
				this.lane = scene.p5.ceil(scene.map['roads'][this.current_road].lanes / 2);
				this.target_lane = this.lane;
				this.next_road = next_road(scene, this);
			}
		}
	}

	destroy(scene) {
		delete this.scene.objects['cars'][this.uid];
	}
}

function calc(scene, car) {
	// max_speed, acceleration, safe_dist
	let restriction = {
		1: [60, 30, 40],
		2: [50, 30, 40],
		3: [40, 20, 40],
		4: [30, 20, 40],
		5: [20, 20, 40]
	}

	let stop_speed = 1;

	let cur_restr = restriction[car.type];
	let lanes1 = [];
	let can_speed_up = false;
	let road1 = scene.map['roads'][car.current_road];

	if (car.next_road != null) {
		let road2 = scene.map['roads'][car.next_road];
		let lanes2 = [];

		for (let ind = 0; ind < road2.lanes; ++ind)
			lanes2.push(null);

		fill_lanes(scene, lanes2, -1, road2);

		for (let ind = 0; ind < lanes2.length; ++ind) {
			if (lanes2[ind] == null || lanes2[ind] + road1.length - car.location > 2 * cur_restr[2]) {
				can_speed_up = true;
				break;
			}
		} 
	} else {
		can_speed_up = true;
	}

	for (let ind = 0; ind < road1.lanes; ++ind)
		lanes1.push(null);

	fill_lanes(scene, lanes1, car.location, road1);

	if (can_speed_up) {
		let indicator = true;

		if (lanes1[car.target_lane - 1] == null || lanes1[car.target_lane - 1] > cur_restr[2]) {
			if (car.momental_speed < cur_restr[0]) {
				car.momental_speed += scene.p5.deltaTime * cur_restr[1] * 0.005;
			}

			indicator = false;
		}

		for (let ind = scene.p5.max(0, car.target_lane - 2); ind < scene.p5.min(lanes1.length, car.target_lane + 1) && indicator; ++ind) {
			if (lanes1[ind] == null || lanes1[ind] > cur_restr[2] &&
				lanes1[car.target_lane - 1] != null &&
				(lanes1[car.target_lane - 1] > cur_restr[2] / 2 || car.momental_speed == 0)) {
				if (car.momental_speed < cur_restr[0]) {
					car.momental_speed += scene.p5.deltaTime * cur_restr[1] * 0.005;
				}

				car.target_lane = ind + 1;
				indicator = false;
			}
		} 

		if (indicator) {
			car.momental_speed -= scene.p5.deltaTime * stop_speed;
		}
	} else {
		car.momental_speed = 0;
	}

	if (car.momental_speed > cur_restr[0])
		car.momental_speed = cur_restr[0];

	if (car.momental_speed < 0)
		car.momental_speed = 0;

	if (car.lane > road1.lanes)
		car.lane = road1.lanes;
}

function fill_lanes(scene, lanes, location, road) {
	Object.keys(road.cars).forEach (
		(next_car) => {
			let temp_car = scene.objects['cars'][next_car];

			let lane = temp_car.target_lane;

			if (temp_car.location - location > 0) {
				if (lanes[lane - 1] == null || temp_car.location - location < lanes[lane - 1])
					lanes[lane - 1] = temp_car.location - location;
			}
		}
	);
}


function next_road(scene, car) {
	let road = scene.map['roads'][car.current_road];
	if (car.target_point == null) {
		if (road.to_road.outgoing_roads.length == 0)
			return null;


		return road.to_road.outgoing_roads[
			scene.p5.floor(scene.p5.random(1, road.to_road.outgoing_roads.length + 1) - 1)
		];
	}

	if (car.target_point == road.to)
		return null;

	let MAX_LEN = 500 * (scene.max_uid + 2);
	let visited = {};
	let distances = {};
	let from = {};

	distances[road.to] = 0;

	while (true) {
		let minimal = MAX_LEN;
		let cross_id = -1;

		Object.keys(distances).forEach(
			(crossroad_id) => {
				if (visited[crossroad_id] != true && distances[crossroad_id] < minimal){
					minimal = distances[crossroad_id];
					cross_id = crossroad_id;
				}
			}
		);

		if (cross_id == -1) {
			first = false;
			return null;
		} else if (cross_id == car.target_point) {
			let cur_cross = from[cross_id];
			if (road.to == cur_cross[0])
				return cur_cross[1];

			while (road.to != from[cur_cross[0]][0])
				cur_cross = from[cur_cross[0]];

			return from[cur_cross[0]][1];
		}

		visited[cross_id] = true;
		scene.map['crossroads'][cross_id].outgoing_roads.forEach(
			(road_id, index) => {
				let road_temp = scene.map['roads'][road_id];
				if (visited[road_temp.to] != true) {
					if (distances[road_temp.to] != undefined) {
						if (distances[road_temp.to] < road_temp.length) {
							distances[road_temp.to] = road_temp.length;
							from[road_temp.to] = [cross_id, road_id];
						}
					} else {
						distances[road_temp.to] = road_temp.length;
						from[road_temp.to] = [cross_id, road_id];
					}
				}
			}
		);

	}
}

export default Car;
