'use strict';

export function orth_vector(scene, vec) {
	let orth_vec;

	if (vec[0] == 0) {
		orth_vec = [1, 0];
	} else if (vec[1] == 0) {
		orth_vec = [0, 1];
	} else {
		let abs = scene.p5.sqrt((1 / vec[0]) * (1 / vec[0]) + (1 / vec[1]) * (1 / vec[1]));
		orth_vec = [(1 / vec[0]) / abs, (-(1 / vec[1])) / abs];
	}

	return orth_vec;
}

export function get_dist(scene, point_target, point1, point2) {
	if (point1[1] == point2[1]) {
		if (on_segment(scene, [point_target[0], point1[1]], point1, point2)) {
			return [scene.p5.abs(point_target[1] - point1[1]), point_target[0], point1[1]];
		} else {
			if (dist(scene, point_target, point1) < dist(scene, point_target, point1)) {
				return [dist(scene, point_target, point1), point1[0], point1[1]];
			} else {
				return [dist(scene, point_target, point2), point2[0], point2[1]];
			}
		}
	} else {
		let B = (point1[0] - point2[0]) / (point2[1] - point1[1]);
		let C = -point1[0] - B * point1[1];

		let projection = [
			(B * (B * point_target[0] - point_target[1]) - C) / (1 + B * B),
			(1 * (-B * point_target[0] + point_target[1]) - B * C) / (1 + B * B)
		];

		if (on_segment(scene, projection, point1, point2)) {
			return [dist(scene, projection, point_target), projection[0], projection[1]];
		} else {
			if (dist(scene, point_target, point1) < dist(scene, point_target, point1)) {
				return [dist(scene, point_target, point1), point1[0], point1[1]];
			} else {
				return [dist(scene, point_target, point2), point2[0], point2[1]];
			}
		}
	}
}

export function dist(scene, point1, point2) {
	return scene.p5.sqrt(
		(point1[0] - point2[0]) * (point1[0] - point2[0]) +
		(point1[1] - point2[1]) * (point1[1] - point2[1])
	);
}

function on_segment(scene, point_target, point1, point2) {
	let eps = 1e-5;
	if (dist(scene, point1, point2) + eps < dist(scene, point1, point_target) + dist(scene, point2, point_target))
		return 0;

	return 1;
}
