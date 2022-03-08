export default class Player {
    constructor(currentPosition, levelDistanceWeight,map) {
        this.currentPosition = currentPosition;
        this.levelDistanceWeight = levelDistanceWeight;
        this.map = map;
    }
}