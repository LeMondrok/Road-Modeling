'use strict';

let buttons = [];

function start_button(p, scene) {
	scene.simulation = true;
	scene.addition_mode = false;
}

function stop_button(p, scene) {
	scene.simulation = false;
	scene.addition_mode = false;
}

import {turnAddMode} from './add_panel.js'

function add_button(p, scene) {
	turnAddMode(scene);
}

import {configure} from './configure.js'

function import_button(p, scene, file) {
	var fileReader = new FileReader();
	if(file.subtype == "json") {
		try {
			let base64Str = file.data.split(",")[1];
			let jsonStr = atob(base64Str);
			let obj = JSON.parse(jsonStr);

			if (obj)
				scene.input = obj;
		} catch {
			console.log("Bad JSON input");
		}
	}

	configure(scene);
}

import {export_configure} from './configure.js'

function export_button(p, scene) {
	export_configure(scene);
}

// return arr with buttons in format [text, place in order, handler]
function all_buttons() {
	return [
		['start simulation'    , 1, start_button],
		['stop simulation'     , 2, stop_button],
		['add mode'            , 3, add_button],
		['export configuration', 9, export_button]
	];
}

function all_inputs() {
	return [
		['import configuration', 8, import_button],
	];
}

// return arr with sliders in format [text, place in order, [min_val, max_val, default]]
function all_sliders() {
	return [
		['scale', 4, [0.2, 5, 1]],
		['speed', 5, [0.2, 5, 1]],
	];
}

// construct buttons and sliders all together and add them to the scene
export function construct_buttons(p, scene) {
	let buttons = all_buttons();
	let sliders = all_sliders();
	let inputs = all_inputs();

	// Calculate absolute positions of the buttons
	let margin_x = ((1 - scene.button_area) * scene.canvas_size[0]) / 8;
	let left_x =  scene.button_area * scene.canvas_size[0] + margin_x + 10;
	let right_x = scene.canvas_size[0] - margin_x + 10;
	let size_x = right_x - left_x;

	// Place all buttons and sliders on the same distance
	let num = buttons.length + sliders.length + inputs.length;
	let margin_y = scene.canvas_size[1] / (num + 3);

	// Add buttons with handlers
	buttons.forEach(
		(key, index) => {
			let button;
			button = p.createButton(key[0]);
			button.position(left_x, key[1] * margin_y);
			button.size(size_x);
			button.mousePressed(() => {key[2](p, scene)});
			scene.buttons[key[0]] = button;
		}
	);

	// Add sliders
	sliders.forEach(
		(key, index) => {
			let slider;
			slider = p.createSlider(key[2][0], key[2][1], key[2][2], 0);
			slider.position(left_x, key[1] * margin_y);
			slider.size(size_x);
			scene.sliders[key[0]] = slider;

			scene.text.push([key[0], [left_x, key[1] * margin_y + 10, size_x, 30], 'black'])
		}
	);

	// Add user inputs
	inputs.forEach(
		(key, index) => {
			let input;
			input = p.createFileInput( (file) => {key[2](p, scene, file);} );
			input.position(left_x, key[1] * margin_y);
			input.size(size_x);
			input.addClass(key[0]);
			scene.inputs[key[0]] = input;

			scene.text.push([key[0], [left_x, key[1] * margin_y, size_x, 30], 'black'])

			let button = p.createButton('import configuration');
			button.position(left_x, key[1] * margin_y);
			button.size(size_x);
			button.mousePressed(() =>{
				let inp = document.getElementsByClassName(key[0]);
				inp[0].click();
			});
			scene.buttons[key[0]] = button;
		}
	);
}
