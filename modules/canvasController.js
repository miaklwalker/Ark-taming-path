export default class canvasController {
    constructor(canvas,context){
        this.canvas = canvas;
        this.context = context;
        this.layers = [];
        this.listeners = [];
    }
    subsribe(listener){
        this.listeners.push(listener);
    }
    unsubscribe(listener){
        this.listeners = this.listeners.filter(l => l !== listener);
    }
    notify(event){
        this.listeners.forEach(l => l(event));
    }
    addLayer(layer){
        this.layers.push(layer);
    }
    removeLayer(layer){
        this.layers = this.layers.filter(l => l !== layer);
    }
    draw = () =>{
        this.layers.sort((a,b) => a.priority - b.priority);
        this.layers.forEach(async (l) => await l.draw(this.canvas,this.context));
    }
}
