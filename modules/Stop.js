import Victor from "./Victor.js";
export default class Stop {
    constructor(level,lat,lon,color=undefined) {
        this.level = level;
        this.position = new Victor(lon,lat);
        this.color = color;
    }
}