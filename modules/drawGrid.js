export default function drawGrid(size,canvas,ctx) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += canvas.width / size) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += canvas.height / size) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}
