'use strict';


export function MoveCamera(scene) {
	let delta_move = 1 * scene.p5.deltaTime / 5;
	if (scene.p5.keyIsDown(scene.p5.UP_ARROW)) {
		scene.coord[1] += delta_move;
	}

	if (scene.p5.keyIsDown(scene.p5.DOWN_ARROW)) {
		scene.coord[1] -= delta_move;
	}

	if (scene.p5.keyIsDown(scene.p5.LEFT_ARROW)) {
		scene.coord[0] -= delta_move;
	}

	if (scene.p5.keyIsDown(scene.p5.RIGHT_ARROW)) {
		scene.coord[0] += delta_move;
	}
}