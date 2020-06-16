'use strict';

import default_json from '/src/conf.json'
import CarGen from './car_generators.js'
import {Road, Crossroad} from './road.js'


export function configure(scene) {
	if (scene.input == null) {
		scene.input = default_json;
	}

	scene.map = {
		'roads': {},
		'crossroads': {}
	};
	scene.objects = {
		'cars': {},
		'car_gens': {}
	}

	scene.max_uid = scene.input['max_uid'];

	configure_crossroads(scene);
	configure_roads(scene);
	configure_generators(scene);
}

function configure_crossroads(scene) {
	scene.input['crossroads'].forEach(
		(key, index) => {
			let cross = new Crossroad(scene, [key[0], key[1]], key[2]);
		}
	);
}

function configure_roads(scene) {
	scene.input['roads'].forEach(
		(key, index) => {
			let road = new Road(scene, key[0], key[1], key[2], key[3], key[4]);
		}
	);
}

function configure_generators(scene) {
	scene.input['car_gens'].forEach(
		(key, index) => {
			let gen = new CarGen(scene, key[0], key[1], key[2], key[3], key[4]);
			scene.objects['car_gens'][gen.uid] = gen;
		}
	);
}

export function export_configure(scene) {
	let conf = {};

	Object.keys(scene.map).forEach(
		(type) => {
			Object.keys(scene.map[type]).forEach(
				(uid) => {
					if (conf[type] == null)
						conf[type] = [];
					conf[type].push(scene.map[type][uid].Export(scene));
				}
			);
		}
	);

	Object.keys(scene.objects).forEach(
		(type) => {
			Object.keys(scene.objects[type]).forEach(
				(uid) => {
					let info = scene.objects[type][uid].Export(scene);
					if (info != null) {
						if (conf[type] == null) {
							conf[type] = [];
						}
						conf[type].push(info);
					}
				}
			);
		}
	);

	scene.p5.save(conf, 'conf.json');
} 
