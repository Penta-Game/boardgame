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
        golden: (Math.sqrt(5) + 1) / 2, // golden section value
        theta: 18 // theta value
    };

    // holds the relative numerical relativ values based on s
    var _sizes = {
        s: 1, // stop on star
        c: Math.sqrt(5), // corner stop
        j: (9 - 2 * Math.sqrt(5)) / Math.sqrt(5), // junction stop
        r: (2 / 5) * Math.sqrt(1570 + 698 * Math.sqrt(5)), // pentagram (diameter)
    };

    _sizes.R = _sizes.r + Math.sqrt(5); // entire board
    _sizes.id = _sizes.r - Math.sqrt(Math.pow((_sizes.r / Math.pow(_constants.golden, 2)), 2) - Math.pow(((_sizes.r / Math.pow(_constants.golden, 3)) / 2), 2)); // diameter of circle inside junctions
    _sizes.ir = _sizes.id / 2;
    _sizes.or = 1; // radius of circle containing junctions
    _constants.sizes = _sizes;
    const constants = _constants;

    var helper = (angle, radius) => {
        // shortcut for trigonometric angle based x and y calculation
        var x = radius * Math.sin(angle);
        var y = radius - radius * Math.cos(angle);
        return [x, y];
    }

    var calc = (s) => {
        // calculate the board based on s and with values from constants.sizes
        var board = {};

        for (let [key, value] of Object.entries(constants.sizes)) {
            board[key] = value * s;
        }

        board.circ = board.R * Math.PI;
        board.degree = board.circ / 360;
        return board;
    };

    var draw = (drawer, R) => {
        const s = R / constants.sizes.R;
        const diameters = calc(s);
        console.log(diameters);
        var board = {
            diameters: diameters,
            corners: [],
            junctions: [],
            stops: {
                outer: [],
                inner: []
            }
        };

        var Base = { y: 0, x: R / 2 }; // highest point of circle
        // base.x is also the radius of the pentagramm

        // drawing corners
        var _next = [
            3, 4, 0, 1, 2
        ];

        var colors = [
            "blue",
            "red",
            "green",
            "yellow",
            "white"
        ];

        for (var i = 1; i <= 5; ++i) {
            var th = i * 4 * Math.PI / 5;
            var points = helper(th, Base.x)
            var x = Base.x + points[0];
            var y = Base.y + points[1];
            var circ = drawer.circle(diameters.c);
            circ.attr({ fill: "gray", stroke: colors[i - 1], "stroke-width": 3 });
            circ.center(x, y);
            circ.data({ id: i });
            board.corners.push({
                id: i,
                x: x,
                y: y,
                next: _next[i],
                angle: th,
                color: colors[i - 1]
            });
        }

        // drawing outer arms
        console.log(board.corners);
        for (var i = 0; i < board.corners.length; i++) {
            console.log("start");
            var corner = board.corners[i];
            var next = board.corners[corner.next];
            var spacing = (72 / (constants.k + 1)) / 60; // spacing with viewbox mod
            console.log(spacing);
            for (var z = 1; z <= constants.k; z++) {
                var angle = corner.angle + spacing * z;
                if (angle >= 360) {
                    angle -= 360;
                } else if (angle <= 0) {
                    angle += 360;
                }
                console.log(angle);
                var points = helper(angle, Base.x)
                var x = Base.x + points[0];
                var y = Base.y + points[1];
                var circ = drawer.circle(diameters.s);
                circ.attr({ fill: "gray" });
                circ.center(x, y);
                circ.data({ id: `s-${i}-${z}` });
                board.stops.outer.push({ id: `s-${i}-${z}`, x: x, y: y, angle: angle });
            }
            console.log("end");
        }

        // drawing junctions
        /*
        Base = { y: R / 4, x: diameters.or  };

        for (var i = 1; i <= 5; ++i) {
            var th = i * 2 * Math.PI / 5;
            var points = helper(th, diameters.ir)
            var x = Base.x + points[0];
            var y = Base.y + points[1];
            var circ = drawer.circle(diameters.j);
            circ.attr({ fill: "gray" });
            circ.center(x, y);
            circ.data({ id: i });
            board.corners.push({ id: i, x: x, y: y })
        }
        */

        // drawing outer
    };
    return {
        draw: draw,
        calc: calc,
        constants: constants
    };
}();

module.exports = PentaMath;