/* eslint-disable no-undef */
if (typeof constants == "undefined") {
    const { constants } = require("@local/constants");
}

const typeOf = (obj) => {
    return ({}).toString.call(obj).match(/\s(\w+)/)[1].toLowerCase();
};

function checkTypes(args, types) {
    args = [].slice.call(args);
    for (var i = 0; i < types.length; ++i) {
        if (typeOf(args[i]) != types[i]) {
            throw new TypeError('param ' + i + ' must be of type ' + types[i]);
        }
    }
}

const destructureID = (id) => {
    checkTypes([id], ["string"])
    id = id.split("-");
    const type = id[0];
    if (["corner", "juntion", "c", "j"].include(type)) {
        return {
            type: type,
            id: id[1]
        };
    } else if (type === "stop" || type === "s") {
        return {
            type: stop,
            start: id[1],
            counter: id[2],
            end: id[3]
        }
    }
}

class Base {
    constructor(data) {
        /*
        Object representing a figure/ Field on the board
        */
        for ([key, val] in Object.entries(data)) {
            this[key] = val;
        }
    }

    calcPos(args) {
        /*
        function for calculating pos based on data given by constructor
        Must return an array with two numbers (int/ float)
        */
        const points = args; // 
        return points;
    }

    getAdjacent() {
        /*
        function for getting adjacent Figures/ Fields
        Must return an array with their respective objects
        */
        return this.adjacent;
    }
}

class Figure extends Base {
    /*
    Class representing a Figure (Gray and black stoppers, Players) on the baord
    */

    constructor(data) {
        super(data);
        this.state.position = state
        this.id = data.id
        this.color = data.color;
        this.board = data.board;
    }

    setState(state) {
        this.state = state;
    }

    move(data) {

        console.log(data);
        return true;
    }
}

class Stop extends Base {
    constructor(data) {
        super(data);
        this.id = destructureID(data.id);
        this.points = data.points;
    }

    isEmpty(args) {
        for (const _val in Object.values(args.board.figures)) {
            for (const figure in _val) {
                if (figure.position.id === this.id) {
                    if (args.return === true) {
                        return figure;
                    } else {
                        return false;
                    }

                }
            }
        }
        return true;
    }

    getAdjacent() {
        if ((this.id.start >= 6 && this.id.end < 6) || (this.id.start < 6 && this.id.end >= 6)) {
            return [

            ];
        } else if (this.counter === 1 || this.id.counter === 3) {
            return [];
        } else {
            return [];
        }
    }
}


class Point {
    /*
     class representing a point in the coordinate system
     May contain explicit data (id, points) or inexplicit additional data (state)
    */
    constructor(data) {
        this.id = destructureID(data.id);
        this.additional = {};
        for (const key of Object.keys(data)) {
            this.additional[key] = data[key];
        }
        this.points = { x: data.x, y: data.y };
    }
}


class Field extends Point {
    /*
    Corner or junction field (not a stopper)
    */

    constructor(data) {
        super(data);
    }

    getAdjacent(board) {
        return {
            corners: [board.corners[this.id - 1], board.corners[this.id + 1]],
            juntions: [board.juntions[this.id - 6], board.juntions[this.id - 5]]
        };
    }
}


class GameBoard {
    constructor(data) {
        const vals = {
            diameters: {},
            corners: {},
            junctions: {},
            figures: {
                players: [],
                stoppers: [],
                grays: []
            },
            stops: { outer: {}, inner: {} },
            s: 1
        };

        for ([key, value] in Object.entries(vals)) {
            if (data[key] === undefined) {
                this[key] = value;
            } else {
                this[key] = data[key];
            }
        }

        if (this.diameters !== undefined || this.diameters === {}) {
            this.diameters = calc(s);
        }
    }

    genFigures() {
        for (let id = 0; id < 5; id++) {
            this.figures.players.push(new Figure({ id: id, color: constants.colors[id], type: "player" }));
            this.figures.stoppers.push(new Figure({ id: id + 5 }))
        }
    }

    helper(centerX, centerY, radius, angle) {
        angle = angle * Math.PI / 180;
        return {
            x: centerX + (radius * Math.cos(angle)),
            y: centerY + (radius * Math.sin(angle))
        };
    };

    calc(s) {
        // holds the numerical constants
        let _constants = {
            l: 6, // legs
            k: 3, // arms
            p: Math.sqrt((25 - 11 * Math.sqrt(5)) / (5 - Math.sqrt(5))), // inner 
            golden: (Math.sqrt(5) + 1) / 2, // golden section value
            theta: 18 // theta value
        };

        // holds the relative numerical relative values based on s
        const _sizes = {
            s: 1, // stop on star
            c: Math.sqrt(5), // corner stop
            j: (9 - 2 * Math.sqrt(5)) / Math.sqrt(5), // junction stop
            r: (2 / 5) * Math.sqrt(1570 + 698 * Math.sqrt(5)) // pentagram (diameter)
        };

        _sizes.R = _sizes.r + Math.sqrt(5); // entire board
        _sizes.OuterCircle = _sizes.r / _sizes.R * 0.2; // background stroke width
        _constants.sizes = _sizes;
        this.constants = _constants;

        for (const [key, value] of Object.entries(this.constants.sizes)) {
            this.diameters[key] = value * s;
        }

        this.diameters.circ = board.R * Math.PI;
        this.diameters.degree = board.circ / 360;
    }

    draw(drawer, R, args) {
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


}

module.exports = { Point, GameBoard, Figure, Stop, Field };