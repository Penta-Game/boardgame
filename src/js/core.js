/* eslint-disable no-undef */
if (typeof constants == "undefined") {
    const { constants } = require("@local/constants");
}

let destructureID = (id) => {
    console.log(id);
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


}

module.exports = { Point, GameBoard, Figure, Stop, Field };