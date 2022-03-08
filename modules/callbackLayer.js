import layer from "./layer.js";
export default class callbackLayer extends layer {
    constructor(priority,args,callback){
        super(priority,args);
        this.callback = callback;
    }
    draw(canvas,context){
        this.callback(canvas,context,this.args);
    }
}