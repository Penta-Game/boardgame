const PentaMath = function() {
    /*
    This class provides an appropiate representation of the sizes and values for the construction of a pentagame board.
    The logic was supplied by @penta-jan <https://github.com/penta-jan>.
    The implementation was written by @cobalt <https://sinclair.gq>

    To learn more about pentagame visit https://pentagame.org
    */

    // holds the relative numerical relativ values based on s
    var _sizes = {
        s: 1, // stop on star
        c: Math.sqrt(5), // corner stop
        j: (9 - 2 * Math.sqrt(5)) / Math.sqrt(5), // junction stop
        r: (2 / 5) * Math.sqrt(1570 + 698 * Math.sqrt(5)), // pentagram (diameter)
    };
    _sizes.R = _sizes.r + Math.sqrt(5); // entire board
    const constants = {
        l: 6,
        k: 3,
        golden: (Math.sqrt(5) + 1) / 2,
        sizes: _sizes
    };

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
            console.log(s)
        }

        return board;
    };

    var draw = (drawer, R) => {
        const s = R / constants.sizes.R;
        console.log(drawer.height());
        const diameters = calc(s);
        var board = {
            diameters: diameters,
            corners: [],
            junctions: []
        };
        console.log(diameters);

        var Base = { y: 0, x: R / 2 };

        // drawing corners
        for (var i = 1; i <= 5; ++i) {
            var th = i * 4 * Math.PI / 5;
            var points = helper(th, Base.x)
            var x = Base.x + points[0];
            var y = Base.y + points[1];
            console.log(points);
            var circ = drawer.circle(diameters.c);
            circ.attr({ fill: "gray" });
            circ.center(x, y);
            circ.data({ id: i });
            board.corners.push({ id: i, x: x, y: y })
        }

    };
    return {
        draw: draw,
        calc: calc,
        constants: constants
    };
}();

module.exports = PentaMath;