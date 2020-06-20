'use strict';

export function DrawAllInstances(scene) {
	// Draw all objects
	DrawObjects(scene);
	// Draw button panel
	DrawPanel(scene);
	// Draw texts
	DrawText(scene);
	// Draw debug state
	// DrawState(scene);
}

function DrawObjects(scene) {
	// Draw road objects
	Object.keys(scene.map).forEach(
		(type) => {
			Object.keys(scene.map[type]).forEach(
				(uid) => {
					scene.map[type][uid].Draw(scene);
				}
			);
		}
	);

	// Draw other objects
	Object.keys(scene.objects).forEach(
		(type) => {
			Object.keys(scene.objects[type]).forEach(
				(uid) => {
					scene.objects[type][uid].Draw(scene);
				}
			);
		}
	);

	if (scene.addition_mode)
		scene.add_state.Draw();
}

function DrawPanel(scene) {
	scene.p5.fill(scene.p5.color(204, 203, 208));
    scene.p5.rect(
        scene.canvas_size[0] * scene.button_area,
        0,
        scene.canvas_size[0],
        scene.canvas_size[1],
        10
    );
}

function DrawText(scene) {
	scene.p5.textSize(16);
	scene.p5.textFont("Bodoni");
	scene.p5.strokeWeight(0);

	scene.text.forEach(
		(item, index) => {
			scene.p5.textAlign(scene.p5.CENTER, scene.p5.CENTER);
			scene.p5.fill(item[2]);
			scene.p5.text(item[0], item[1][0], item[1][1], item[1][2], item[1][3]);
		}
	);

	scene.p5.strokeWeight(1);
}


function DrawState(scene) {
	// print state
	scene.p5.textSize(16);
	scene.p5.fill('red');
	let state = '';
	if (scene.simulation)
		state += 'simulation ';
	if (scene.addition_mode)
		state += 'addition_mode ';
	if (state == '')
		state = 'stopped'
	scene.p5.text(state, 0, 0, 200, 50);
}
