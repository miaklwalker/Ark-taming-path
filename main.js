import Stop from "./modules/Stop.js";
import Victor from "./modules/Victor.js";
import Player from  "./modules/Player.js";
import createtamingplan from "./modules/pathPlanner.js";
import drawGrid from "./modules/drawGrid.js";
import { plotPoint } from "./modules/drawHelpers.js";

const canvas = document.getElementById("data-vis");
canvas.width = "480";
canvas.height = "480";
const ctx = canvas.getContext("2d");

const size = 10;


drawGrid(size,canvas,ctx);


const player = new Player(new Victor(0,0),0);

const testList = [
    new Stop(150,83,13),
    new Stop(150,75,30),
    new Stop(150,73,35),
    new Stop(150,69,41),
    new Stop(150,67,39),
    new Stop(150,45,24),
    new Stop(150,43,22),
    new Stop(150,40,24),
    new Stop(150,35,15),
    new Stop(145,81,26),
    new Stop(145,75,12),
    new Stop(145,73,29),
    new Stop(145,70,14),
    new Stop(145,65,13)
]

let list = createtamingplan(testList,player);
list.unshift(new Stop(0,player.currentPosition.x,player.currentPosition.y))
list.forEach((spot,index,arr) => plotPoint(canvas,ctx)(spot,size,index,arr));

console.log(list);


// we need too find the clostest stop while considering the level using the player's levelDistanceWeight artificially decrease the distance
// for instance if we have two stops equal distance but one is at level 150 and the other at level 140, we want to choose the one at level 150 first
