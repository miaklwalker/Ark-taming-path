import normalize from "./normalizeToRange.js";
/**
 * @name plotPoint
 */
export function plotPoint (canvas,ctx,{spot, color , arr}){

    const normalizeW = (val) => normalize(val,0,100,0,canvas.width);
    const normalizeH = (val) => normalize(val,0,100,0,canvas.height);

    function connectPoints(spot, prevSpot) {
        let newX = normalizeW(spot.position.x);
        let newY = normalizeH(spot.position.y);
        let prevX = normalizeW(prevSpot.position.x);
        let prevY = normalizeH(prevSpot.position.y);
        ctx.strokeStyle = `rgb(0,0,0)`;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(newX, newY);
        ctx.stroke();
    }
    const makeColor = (color) => 255 / arr.length * (color + 1);
    let newX = normalizeW(spot.position.x);
    let newY = normalizeH(spot.position.y);
    ctx.beginPath();
    let colour = spot.color || `rgb(${makeColor(color)},0,0)`;
    ctx.fillStyle = colour;
    ctx.ellipse(newX,newY,5,5, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();
    if(color > 0){
    connectPoints(spot, arr[color-1]);
    }

}