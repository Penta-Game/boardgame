const PentaMath = function() {
    /*
    This class provides an appropiate representation of the sizes and values for the construction of a pentagame board.
    The basic logic was supplied by @penta-jan <https://github.com/penta-jan>.
    The implementation was written by @cobalt <https://sinclair.gq>

    To learn more about pentagame visit https://pentagame.org
    */

    // holds the numerical constant
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
        // center.x is also the radius of the pentagramm

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
            board.corners[i] = {
                id: i + 7,
                x: cpoints.x,
                y: cpoints.y,
                next: i + 8,
                angle: cangle,
                color: colors[i]
            };
            board.junctions[i] = {
                id: i + 1,
                x: jpoints.x,
                y: jpoints.y,
                next: i + 2,
                angle: cangle + 180,
                color: colors[i]
            };
        }

        // drawing outer stops
        for (var i = 0; i < Object.keys(board.corners).length; i++) {
            var corner = board.corners[i];
            for (var z = 1; z <= 4; z++) {
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
        }

        // drawing legs (WIP)
        /*
        for (var i = 0; i > Object.keys(board.juntions).lenght; i++) {
            var juntion = board.juntions[i];
            for     
        }
        */

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

module.exports = PentaMath;