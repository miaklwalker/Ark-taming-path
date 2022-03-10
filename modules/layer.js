export default class layer {
    constructor(priority,args){
        this.priority = priority;
        this.args = args;
    }
    draw(canvas,context){
        throw new Error("Not implemented");
    }
}