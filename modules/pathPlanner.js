import Victor from "./Victor.js";

function findWeightedDistance(stop,player) {
    return player.distance(stop.position);
}

function wrapper (player) {
    return function findClosest(closest,stop) {
        if(closest === null || findWeightedDistance(stop,player) < findWeightedDistance(closest,player)) {
            return stop;
        }
        return closest
    }
}

function createtamingplan(stoplist,player){
    let result = [];
    let startingPosition = new Victor(player.currentPosition.x,player.currentPosition.y);
    
    while (stoplist.length > 0){
        const closestStop = stoplist.reduce(wrapper(startingPosition),null);
        result.push(closestStop);
        stoplist.splice(stoplist.indexOf(closestStop),1);
        startingPosition = closestStop.position;
    }

    return result;
}

export default createtamingplan;
