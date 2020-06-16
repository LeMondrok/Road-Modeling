'use strict';

import Car from './car.js'
import RoadObject from './objects.js'

class CarGen extends RoadObject {
	constructor(scene, road, target_point, type, delay, uid) {
		super(scene);

		this.road = road;
		this.target_point = target_point;
		this.type = type;
		this.delay = delay;
		this.timer = delay;

		if (uid == -1)
			this.uid = ++scene.max_uid;
		else
			this.uid = uid;

		scene.objects['car_gens'][this.uid] = this;
	}

	Update(scene) {
		this.timer -= scene.p5.deltaTime * scene.speed;
		if (this.timer <= 0) {
			let car = new Car(scene, this.road, this.target_point, this.type, -1);
			scene.objects['cars'][car.uid] = car;

			this.timer += this.delay;
		}
	}

	Draw(scene) {}

	Export(scene) {
		return [
			this.road,
			this.target_point,
			this.type,
			this.delay,
			this.uid
		];
	}
}

export default CarGen;
