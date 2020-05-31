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

    var reverseArr = (input) => {
        var ret = new Array;
        for (var i = input.length - 1; i >= 0; i--) {
            ret.push(input[i]);
        }
        return ret;
    }

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
        // next corner clockwise
        var _next = [
            3, 4, 0, 1, 2
        ];

        if (args === undefined || args.colors === undefined) {
            var colors = [
                "blue",
                "red",
                "green",
                "yellow",
                "white"
            ];
            var rcolors = reverseArr(colors);
        } else {
            var colors = args.colors;
            var rcolors = reverseArr(colors);
        }

        for (var i = 0; i < 5; i++) {
            var cangle = i * (constants.theta * 4);
            var jradius = constants.p * center.x;
            var cpoints = helper(center.x, center.y, center.x, cangle);
            var jpoints = helper(center.x, center.y, jradius, cangle + 180);
            var corner = drawer.circle(board.diameters.c);
            corner.attr({ fill: "gray", stroke: colors[i - 1], "stroke-width": 3 });
            corner.center(cpoints.x, cpoints.y);
            corner.data({ id: i });
            var junction = drawer.circle(board.diameters.j);
            junction.attr({ fill: "gray", stroke: colors[i - 1], "stroke-width": 3 });
            junction.center(jpoints.x, jpoints.y);
            junction.data({ id: i });
            board.corners[i] = {
                x: cpoints.x,
                y: cpoints.y,
                next: _next[i],
                angle: cangle,
                color: colors[i - 1]
            };
            board.junctions[i] = {
                x: jpoints.x,
                y: jpoints.y,
                next: _next[i],
                angle: cangle + 180,
                color: colors[i - 1]
            };
        }

        // drawing outer arms
        // calculations are done by spliting the circle into sectors and taking the exisitng corners as center points
        console.log(board.corners);
        for (var i = 0; i < board.corners.length; i++) {
            console.log("start");
            var corner = board.corners[i];
            var spacing = ((constants.k * 4) / (constants.k + 1)); // spacing with viewbox mod
            console.log(spacing);
            for (var z = 1; z <= constants.k; z++) {
                var angle = corner.angle + spacing * z;
                if (angle >= 360) {
                    angle -= 360;
                } else if (angle <= 0) {
                    angle += 360;
                }
                console.log(angle);
                var points = helper(angle, center.x)
                var x = center.x + points[0];
                var y = center.y + points[1];
                var circ = drawer.circle(board.diameters.s);
                circ.attr({ fill: "gray" });
                circ.center(x, y);
                circ.data({ id: `s-${i}-${z}` });
                board.stops.outer.push({ id: `s-${i}-${z}`, x: x, y: y, angle: angle });
            }
            console.log("end");
        }

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