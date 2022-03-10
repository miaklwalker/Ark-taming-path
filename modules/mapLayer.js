import layer from "./layer.js";

export default class mapLayer extends layer {
    constructor(priority,args){
        super(priority,args);
    }
    draw(canvas,context){
        const {arkData,player:{map}} = this.args;
        const mapData = arkData[map];
        let image = arkData[map].image;
        let {x,y,w,h} = mapData.offsets
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image,x,y,image.width+w,image.height+h,0,0,canvas.width,canvas.height);
    }
}