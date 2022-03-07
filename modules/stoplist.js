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
}