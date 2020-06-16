'use strict';

//Force page refresh on hot reload
if (module.hot) {
    module.hot.accept(function () {
        window.location.reload();
    })
}

import Sketch from './sketch.js';
import p5 from 'p5'

new p5(Sketch);
