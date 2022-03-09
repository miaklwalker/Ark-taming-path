import { plotPoint } from "./drawHelpers.js";
export default class stopList {
    constructor() {
        this.stops = [];
    }
    addStop = (stop) => {
        this.stops.push(stop);
    }
    removeStop = (stop) => {
        this.stops.splice(this.stops.indexOf(stop), 1);
    }
    draw=(canvas,context)=> {
        this.stops.forEach((spot,index,arr)=>{
            plotPoint(canvas,context,{spot,color:index,arr})
        })
    }
}