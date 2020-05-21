const PentaMath = function() {
    var calc = (draw, selector) => {
        const golden = (Math.sqrt(5) + 1) / 2;
        const l = 6;
        const k = 3;

        console.log(draw.find(".bg-circle").width());

        var height = draw.find(".bg-circle").height(),
            width = draw.find(".bg-circle").width()[0],
            radius = width / 2,
            Base = { y: 0, x: 500 },
            c = [],
            step = 2 * Math.PI / 5,
            shift = (Math.PI / 180.0) * -18;

        for (var i = 1; i <= 5; ++i) {
            var th = i * 4 * Math.PI / 5;
            var x = Base.x + radius * Math.sin(th);
            var y = Base.y + radius - radius * Math.cos(th);
            var circ = draw.circle(100);
            circ.attr({ fill: "gray" });
            circ.center(x, y);
            circ.data({ id: i });
            c.push([x, y]);
        }

        console.log(c);

    };
    return {
        calc: calc
    };
}();

module.exports = PentaMath;