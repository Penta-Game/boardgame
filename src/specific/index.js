$(document).ready(() => {
    const parent = $("#board-container");
    var draw = SVG().addTo("#board-container").size("100%", "100%");
    draw.addClass("allow-overflow");
    draw.viewbox(0, 0, 1000, 1000);
    draw.attr({ "preserveAspectRatio": "xMidYMid meet" });
    drawBoard(draw, parent.height(), parent.width())
    PentaMath.calc(draw, "#board-container");
    $('circle[data-id="bg"]').click((evt) => {
        console.log(evt.target);
    });
    $('circle[data-id]').click((evt) => {
        console.log(`You have clicked the element ${$(evt.target).data("id")}`);
    });
});

function drawBoard(draw) {
    var circ = draw.circle(1000);
    circ.attr({ fill: "black" });
    circ.data({ "id": "bg" });
    circ.addClass("bg-circle");
}