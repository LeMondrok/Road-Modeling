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
		this.lane = 1;
		this.target_lane = 1;
		if (uid == -1)
			this.uid = ++scene.max_uid;
		else
			this.uid = uid;

		scene.map['roads'][current_road].cars[this.uid] = true;
		scene.objects['cars'][this.uid] = this;
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

		if (this.next_road == null) {
			let road = scene.map['roads'][this.current_road];
			this.next_road = null;

			if (road.to != this.target_point && road.to_road.connected_roads.length != 0) {
				for (let ind = 0; ind < road.to_road.outgoing_roads.length; ++ind) {
					if (is_richable(scene, road.to_road.outgoing_roads[ind], this.target_point))
						this.next_road = road.to_road.outgoing_roads[ind];
				}
			}
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
				this.lane = 1;
				this.target_lane = 1;

				let road = scene.map['roads'][this.current_road];
				this.next_road = null;

				if (road.to != this.target_point && road.to_road.connected_roads.length != 0) {
					for (let ind = 0; ind < road.to_road.outgoing_roads.length; ++ind) {
						if (is_richable(scene, road.to_road.outgoing_roads[ind], this.target_point))
							this.next_road = road.to_road.outgoing_roads[ind];
					}
				}
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

		for (let ind = 0; ind < lanes1.length && indicator; ++ind) {
			if (lanes1[ind] == null || lanes1[ind] > cur_restr[2] &&
				lanes1[car.target_lane - 1] != null && lanes1[car.target_lane - 1] > cur_restr[2] * 2) {
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
}

function fill_lanes(scene, lanes, location, road) {
	Object.keys(road.cars).forEach (
		(next_car) => {
			let temp_car = scene.objects['cars'][next_car];
			let lane1 = scene.p5.floor(temp_car.lane);
			let lane2 = 0;

			if (lane1 < 1)
				lane1 = 1;

			if (lane1 - temp_car.lane > 0.9) {
				lane1++;
				lane2 = lane1;
			} else if (lane1 - temp_car.lane < 0.1) {
				lane2 = lane1;
			} else {
				lane2 = lane1 + 1;
			}

			if (temp_car.location - location > 0) {
				if (lanes[lane1 - 1] == null || temp_car.location - location < lanes[lane1 - 1])
					lanes[lane1 - 1] = temp_car.location - location;
				if (lanes[lane2 - 1] == null || temp_car.location - location < lanes[lane2 - 1])
					lanes[lane2 - 1] = temp_car.location - location;
			}
		}
	);
}

let visited = {};

function is_richable(scene, from_road_id, to_cross_id, first=true) {
	if (to_cross_id == null) {
		return true;
	}

	if (first) {
		visited = {};
	}

	let road = scene.map['roads'][from_road_id];
	if (road.to == to_cross_id) {
		return true;
	} else {
		for (let ind = 0; ind < road.to_road.outgoing_roads.length; ++ind) {
			if (visited[road.to_road.outgoing_roads[ind]] != true) {
				visited[road.to_road.outgoing_roads[ind]] = true;

				if (is_richable(scene, road.to_road.outgoing_roads[ind], to_cross_id, false))
					return true;
			}
				
		}
	}

	return false;
}

export default Car;
