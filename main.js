import Stop from "./modules/Stop.js";
import Victor from "./modules/Victor.js";
import Player from  "./modules/Player.js";
import createtamingplan from "./modules/pathPlanner.js";
import drawGrid from "./modules/drawGrid.js";
import { plotPoint } from "./modules/drawHelpers.js";
import stopList from "./modules/stoplist.js";

const canvas = document.getElementById("data-vis");
const routebox = document.querySelector(".route-planner");
const level_input = document.getElementById("level");
const lat_input = document.getElementById("lat");
const lon_input = document.getElementById("lon");
const submit = document.getElementById("add-creature");
const clear_button = document.getElementById("clear-all");


const player = new Player(new Victor(0,0),0);
const size = 10;
let masterList;
canvas.width = "480";
canvas.height = "480";
const ctx = canvas.getContext("2d");
drawGrid(size,canvas,ctx);

let gui = new dat.GUI({
    name:"GUI"
})

let controls = gui.addFolder("player position")
    controls.open();
    controls.add(player.currentPosition,"x",0,100,.01)
        .onChange((e)=>player.currentPosition.x = e)
        .onFinishChange(makeHTMLfromList);
    controls.add(player.currentPosition,"y",0,100,.01)
    .onChange((e)=>player.currentPosition.y = e)
    .onFinishChange(makeHTMLfromList)
let config = gui.addFolder("preferences");
    config.open()
    config.add(player,"levelDistanceWeight",0,10,1)
    .onChange((e)=>player.levelDistanceWeight = e)
    .onFinishChange(makeHTMLfromList);

const generateRouteStop = ({level,position:{x:lon, y:lat}}) => {
    const stop = document.createElement("div");
    stop.classList.add("stop");
    stop.innerHTML = `
    <h4 class="level"> lvl : ${level}</h4>
    <div><span class="label">lat</span> : <span> ${lat}</span></div>
    <div><span class="label">lon</span> : <span> ${lon}</span></div>
    `
    return stop;
}

function resetForm () {
    lat_input.value = "";
    lon_input.value = "";
}

function saveToSessionStorage () {
    sessionStorage.setItem("stops",JSON.stringify(masterList.stops));
}
function makeHTMLfromList (){
    let list = createtamingplan(masterList.stops.slice(0),player);
    routebox.innerHTML = "";
    list.forEach(stop => routebox.appendChild(generateRouteStop(stop)));
    list.unshift(new Stop(0,player.currentPosition.y,player.currentPosition.x,"rgb(0,0,255)"))
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(size,canvas,ctx);
    list.forEach((spot,index,arr) => plotPoint(canvas,ctx)(spot,index,arr));
}
function deleteSessionStorage () {
    let userConfirm = confirm("Are you sure you want to delete all data?");
    if (userConfirm) {
        masterList = new stopList();
        sessionStorage.clear();
        makeHTMLfromList();
    }
}
clear_button.addEventListener("click", deleteSessionStorage);
submit.addEventListener("click", () => {
    const level = level_input.value;
    const lat = lat_input.value;
    const lon = lon_input.value;
    const newStop = new Stop(level, lat, lon);
    masterList.addStop(newStop);
    makeHTMLfromList();
    resetForm();
    saveToSessionStorage();
})








if (sessionStorage.getItem("stops")) {
    masterList = new stopList();
    masterList.stops = JSON.parse(sessionStorage.getItem("stops")).map(stop => new Stop(stop.level,stop.position.x,stop.position.y));
    makeHTMLfromList();
} else {
    masterList = new stopList();
}
