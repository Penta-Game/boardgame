$(document).ready(() => {
    const parent = $("#board-container");
    var draw = SVG().addTo("#board-container");
    draw.addClass("allow-overflow");
    draw.viewbox(0, 0, 1000, 1000);
    draw.attr({ "preserveAspectRatio": "xMidYMid meet", "id": "board-container-svg" });
    draw.data({ size: 1000 });
    drawBoard(draw, 1000)
    $('circle[data-id="bg"]').click((evt) => {
        console.log(evt.target);
    });
    $('circle[data-id]').click((evt) => {
        console.log(`You have clicked the element ${$(evt.target).data("id")}`);
    });
    $("#change-size").click((evt) => {
        $("#size-input").val(SVG("#board-container-svg").data("size"));
        $('#sizeModal').modal({ focus: true });
    });

    $("#sizeModal-change").click((evt) => {
        drawBoard(SVG("#board-container-svg"), $("#size-input").val());
    });

    $("#sizeModal-close").click((evt) => {
        $("#size-input").val();
    });
});

function drawBoard(draw, size) {
    $(draw.node).empty();
    var circ = draw.circle(size);
    circ.attr({ fill: "black" });
    circ.data({ "id": "bg" });
    circ.addClass("bg-circle");
    PentaMath.draw(draw, size);
}