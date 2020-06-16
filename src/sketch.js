'use strict';

import EmulationInstance from './scene.js'
import {construct_buttons} from './buttons.js'
import {MoveCamera} from './control.js'
import {closest_road} from './add_panel.js'

let canvas_size = [1000, 600];
let button_area = 0.725;
let add_area = 0.800;

const Sketch = (p) => {
    let scene = new EmulationInstance(p, canvas_size, button_area, add_area);

    // Setup new scene and create Canvas
    p.setup = () => { 
        p.createCanvas(canvas_size[0], canvas_size[1]);
        construct_buttons(p, scene);
    };

    // Draw function on every iteration 
    p.draw = () => {
        // Fill background and button zone
        p.background(200);

        // process control
        MoveCamera(scene);

        // Redraw scene 
        scene.Update();
        scene.Draw();
    };
};

export default Sketch;
