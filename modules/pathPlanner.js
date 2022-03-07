import Victor from "./Victor.js";

function findWeightedDistance(stop,playerPosition,player) {
    return playerPosition.distance(stop.position) + (150 - stop.level * player.levelDistanceWeight) ;
}

function wrapper (playerPosition,player) {
    return function findClosest(closest,stop) {
        if(closest === null || findWeightedDistance(stop,playerPosition,player) < findWeightedDistance(closest,playerPosition,player)) {
            return stop;
        }
        return closest
    }
}

function createtamingplan(stoplist,player){
    let result = [];
    let startingPosition = new Victor(player.currentPosition.x,player.currentPosition.y);
    
    while (stoplist.length > 0){
        const closestStop = stoplist.reduce(wrapper(startingPosition,player),null);
        result.push(closestStop);
        stoplist.splice(stoplist.indexOf(closestStop),1);
        startingPosition = closestStop.position;
    }

    return result;
}

export default createtamingplan;
