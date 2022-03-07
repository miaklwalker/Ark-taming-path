import Victor from "./Victor.js";
export default class Stop {
    constructor(level,lat,lon) {
        this.level = level;
        this.position = new Victor(lon,lat);
    }
}