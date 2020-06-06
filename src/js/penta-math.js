if (typeof variable === 'undefined') {

    const core = require(`@local/core`);
}

const PentaMath = function() {
    /*
    This class provides an appropriate representation of the sizes and values for the construction of a pentagame board.
    The basic logic was supplied by @penta-jan <https://github.com/penta-jan>.
    The implementation was written by @cobalt <https://sinclair.gq>

    To learn more about pentagame visit https://pentagame.org
    */

    // holds the numerical constants
    var _constants = {
        l: 6, // legs
        k: 3, // arms
        p: Math.sqrt((25 - 11 * Math.sqrt(5)) / (5 - Math.sqrt(5))), // inner 
        golden: (Math.sqrt(5) + 1) / 2, // golden section value
        theta: 18 // theta value
    };

    // holds the relative numerical relativ values centerd on s
    var _sizes = {
        s: 1, // stop on star
        c: Math.sqrt(5), // corner stop
        j: (9 - 2 * Math.sqrt(5)) / Math.sqrt(5), // junction stop
        r: (2 / 5) * Math.sqrt(1570 + 698 * Math.sqrt(5)) // pentagram (diameter)
    };

    _sizes.R = _sizes.r + Math.sqrt(5); // entire board
    _sizes.outer_circle = _sizes.r / _sizes.R * 0.2 // background stroke width
    _constants.sizes = _sizes;
    const constants = _constants;

    var helper = (centerX, centerY, radius, angle) => {
        angle = angle * Math.PI / 180;
        return {
            x: centerX + (radius * Math.cos(angle)),
            y: centerY + (radius * Math.sin(angle))
        };
    };

    var calc = (s) => {
        // calculate the board's diamteres centerd on 
        var board = {};

        for (let [key, value] of Object.entries(constants.sizes)) {
            board[key] = value * s;
        }

        board.circ = board.R * Math.PI;
        board.degree = board.circ / 360;
        return board;
    };

    var draw = (drawer, R, args) => {
        const _diameters = calc(R / constants.sizes.R);
        console.debug(`diameters: ${_diameters}`);
        var board = {
            diameters: _diameters,
            corners: {},
            junctions: {},
            stops: {
                outer: {},
                inner: {}
            }
        };

        var center = { y: board.diameters.R / 2, x: board.diameters.R / 2 }; // highest point of circle

        // draw outer circle
        var circ = drawer.circle(board.diameters.R);
        circ.attr({ fill: "none", stroke: "grey", "stroke-width": board.diameters.outer_circle });
        circ.data({ "id": "outer-circle" });


        // drawing corners and junctions
        if (args === undefined || args.colors === undefined) {
            var colors = [
                "blue",
                "red",
                "green",
                "yellow",
                "white"
            ];
        } else {
            var colors = args.colors;
        }

        for (var i = 0; i < 5; i++) {
            var cangle = i * (constants.theta * 4);
            var jradius = constants.p * center.x;
            var cpoints = helper(center.x, center.y, center.x, cangle);
            var jpoints = helper(center.x, center.y, jradius, cangle + 180);
            var corner = drawer.circle(board.diameters.c);
            corner.attr({ fill: "gray", stroke: colors[i], "stroke-width": 3 });
            corner.center(cpoints.x, cpoints.y);
            corner.data({ id: i + 7 });
            var junction = drawer.circle(board.diameters.j);
            junction.attr({ fill: "gray", stroke: colors[i], "stroke-width": 3 });
            junction.center(jpoints.x, jpoints.y);
            junction.data({ id: i + 1 });
            board.corners[i] = new core.Point({
                id: i + 7,
                x: cpoints.x,
                y: cpoints.y,
                next: i + 8,
                node: corner.node,
                angle: cangle,
                color: colors[i]
            });
            board.junctions[i] = new core.Point({
                id: i + 1,
                x: jpoints.x,
                y: jpoints.y,
                next: i + 2,
                node: junction.node,
                angle: cangle + 180,
                color: colors[i]
            });
        }

        // drawing stops
        for (var i = 0; i < Object.keys(board.corners).length; i++) {
            var corner = board.corners[i];

            // drawing outer stops
            for (var z = 1; z <= 3; z++) {
                var angle = corner.angle + constants.theta * z;
                var points = helper(center.x, center.y, center.x, angle)
                var circ = drawer.circle(board.diameters.s);
                circ.attr({ fill: "gray" });
                circ.center(points.x, points.y);
                circ.data({ id: `s-${i}-${z}` });
                board.stops.outer[`s-${i}-${z}`] = {
                    x: points.x,
                    y: points.y,
                    angle: angle
                };
            }

            // drawing legs
            var _radius = (board.diameters.r / Math.pow(constants.golden, 2)) - (board.diameters.j * 2) / 6;
            console.log(_radius);
            var angles = [constants.theta, constants.theta * -1];
            for (var z = 0; z < 2; z++) {
                var angle = corner.angle + angles[z] + 180;
                for (var u = 1; u <= 6; u++) {
                    var radius = _radius - (board.diameters.s) * u;
                    var points = helper(corner.points.x, corner.points.y, radius, angle);
                    var circ = drawer.circle(board.diameters.s);
                    circ.attr({ fill: "gray" });
                    circ.center(points.x, points.y);
                    circ.data({ id: `s-${corner.id}-${u}-${corner.id-4}` });
                    board.stops.inner[`s-${i}-${u}-${i+5+z}`] = {
                        x: points.x,
                        y: points.y,
                        angle: angle
                    };
                }
            }
        }

        // drawing arms
        for (var i = 0; i < Object.keys(board.junctions).length; i++) {
            var junction = board.junctions[i];
            var _radius = (board.diameters.r / Math.pow(constants.golden, 3));
            var angle = junction.angle + constants.theta * 7;
            for (var z = 1; z <= 3; z++) {
                var radius = _radius - (board.diameters.s) * z;
                var points = helper(junction.points.x, junction.points.y, radius, angle);
                var circ = drawer.circle(board.diameters.s);
                circ.attr({ fill: "red" });
                circ.center(points.x, points.y);
                circ.data({ id: `s-${junction.id}-${u}-${junction.id+1}` });
                board.stops.inner[`s-${i}-${u}-${i+5+z}`] = {
                    x: points.x,
                    y: points.y,
                    angle: angle
                };
            }
        }

        console.log(board);

        return {
            board: board
        };
    };
    return {
        draw: draw,
        calc: calc,
        helper: helper,
        constants: constants
    };
}();

module.export = PentaMath;