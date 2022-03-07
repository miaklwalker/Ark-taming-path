import Stop from "./modules/Stop.js";
import Victor from "./modules/Victor.js";
import Player from  "./modules/Player.js";
import createtamingplan from "./modules/pathPlanner.js";
import drawGrid from "./modules/drawGrid.js";
import { plotPoint } from "./modules/drawHelpers.js";
import stopList from "./modules/stoplist.js";

const canvas = document.getElementById("data-vis");
const routebox = document.querySelector(".route");
const level_input = document.getElementById("level");
const lat_input = document.getElementById("lat");
const lon_input = document.getElementById("lon");
const submit = document.getElementById("add-creature");
const clear_button = document.getElementById("clear-all");


const player = new Player(new Victor(0,0),0);


const generateRouteStop = ({level,position:{x:lon, y:lat}}) => {
    const stop = document.createElement("div");
    stop.classList.add("stop");
    stop.innerHTML = `
    <div class="stop">
    <h4 class="level"> lvl : ${level}</h4>
    <div><span class="label">lat</span> : <span> ${lat}</span></div>
    <div><span class="label">lon</span> : <span> ${lon}</span></div>
    </div>
    `
    return stop;
}


let masterList;

// We need to check for seesion storage and if it exists, we need to load the data from there.
if (sessionStorage.getItem("stops")) {
    masterList = new stopList();
    masterList.stops = JSON.parse(sessionStorage.getItem("stops")).map(stop => new Stop(stop.level,stop.position.x,stop.position.y));
} else {
    masterList = new stopList();
}


function resetForm () {
    lat_input.value = "";
    lon_input.value = "";
}

function saveToSessionStorage () {
    sessionStorage.setItem("stops",JSON.stringify(masterList.stops));
}
function makeHTMLfromList (){
    console.log(masterList)
    let list = createtamingplan(masterList.stops.slice(0),player);
    routebox.innerHTML = "<h2> ROUTE </h2>";
    list.forEach(stop => routebox.appendChild(generateRouteStop(stop)));

    list.unshift(new Stop(0,player.currentPosition.x,player.currentPosition.y))
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(size,canvas,ctx);
    list.forEach((spot,index,arr) => plotPoint(canvas,ctx)(spot,size,index,arr));
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


canvas.width = "480";
canvas.height = "480";
const ctx = canvas.getContext("2d");

const size = 10;

drawGrid(size,canvas,ctx);

