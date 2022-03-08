import Stop from "./modules/Stop.js";
import Victor from "./modules/Victor.js";
import Player from  "./modules/Player.js";
import createtamingplan from "./modules/pathPlanner.js";
import drawGrid from "./modules/drawGrid.js";
import { plotPoint } from "./modules/drawHelpers.js";
import stopList from "./modules/stoplist.js";
import loadImage from "./modules/loadImage.js";

const canvas = document.getElementById("data-vis");
const ctx = canvas.getContext("2d");
const routebox = document.querySelector(".route-planner");
const level_input = document.getElementById("level");
const lat_input = document.getElementById("lat");
const lon_input = document.getElementById("lon");
const submit = document.getElementById("add-creature");
const clear_button = document.getElementById("clear-all");


const player = new Player(new Victor(0,0),0,"valquero");
const size = 10;

const images = {
    "the island":"./images/The_Island_Topographic_Map.webp",
    "scorched earth":"./images/Scorched_Earth_Map.webp",
    aberation:"./images/Aberration_Map.webp",
    extinction:"./images/Extinction_Map.webp",
    "genesis 1":"./images/Genesis_Part_1_Map.webp",
    "genesis 2":"./images/Genesis_Part_2_Map.webp",
    "crystal isle":"./images/Crystal_Isles_Topographic_Map.webp",
    "lost island":"./images/Lost_Island_map.webp",
    "ragnorak":"./images/Ragnarok_Map.webp",    
    "the center":"./images/The_Center_Topographic_Map.webp",
    "valquero":"./images/Valguero_Topographic_Map.webp",
}
let names = Object.keys(images);
const offsets = {
    "the island":{x:0,y:0,w:0,h:0},
    "scorched earth":{x:12,y:17,w:-9,h:-23},
    aberation:{x:22,y:33,w:-7,h:-49},
    "extinction":{x:12,y:17,w:-2,h:-25},
    "genesis 1":{x:14,y:26,w:5,h:-39},
    "genesis 2":{x:14,y:26,w:5,h:-39},
    "crystal isle":{x:0,y:0,w:0,h:0},
    "lost island":{x:14,y:26,w:5,h:-39},
    "ragnorak":{x:14,y:22,w:-5,h:-33},
    "the center":{x:0,y:0,w:0,h:0},
    "valquero":{x:0,y:0,w:0,h:0},
}



let masterList,gui;
canvas.width = "480";
canvas.height = "480";


async function drawMap(e){
    let image = await loadImage(images[e]);
    let {x,y,w,h} = offsets[e]
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image,x,y,image.width+w,image.height+h,0,0,canvas.width,canvas.height);
}

function initGui(){
    gui = new dat.GUI({
        name:"GUI"
    })
    let controls = gui.addFolder("player position")
        //controls.open();
        controls.add(player.currentPosition,"x",0,100,.01)
            .setValue(player.currentPosition.x)
            .onChange((e)=>player.currentPosition.x = e)
            .onFinishChange(makeHTMLfromList);

        controls.add(player.currentPosition,"y",0,100,.01)
        .setValue(player.currentPosition.y)
        .onChange((e)=>player.currentPosition.y = e)
        .onFinishChange(makeHTMLfromList);

        controls.add(player,"map",names)
        .onChange(async(e)=>{
            await drawMap(e);
            player.map = e;
            makeHTMLfromList()
 
        })
    let config = gui.addFolder("preferences");
        //config.open()
        config.add(player,"levelDistanceWeight",0,10,1)
        .setValue(player.levelDistanceWeight)
        .onChange((e)=>player.levelDistanceWeight = e)
        .onFinishChange(makeHTMLfromList);
}
initGui();

const generateRouteStop = ({level,position:{x:lon, y:lat}}) => {
    const stop = document.createElement("div");
    stop.classList.add("stop");
    stop.addEventListener("click",()=>{
        stop.classList.toggle("visited")
    })
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
async function makeHTMLfromList (){
    let list = createtamingplan(masterList.stops.slice(0),player);
    routebox.innerHTML = "";
    list.forEach(stop => routebox.appendChild(generateRouteStop(stop)));
    list.unshift(new Stop(0,player.currentPosition.y,player.currentPosition.x,"rgb(0,0,255)"))
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await drawMap(player.map)
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







async function init(){
    if (sessionStorage.getItem("stops")) {
        masterList = new stopList();
        masterList.stops = JSON.parse(sessionStorage.getItem("stops")).map(stop => new Stop(stop.level,stop.position.x,stop.position.y));
        makeHTMLfromList();
    } else {
        masterList = new stopList();
    }
    let image = await loadImage(images[player.map]);
    let {x,y,w,h} = offsets[player.map]
    ctx.drawImage(image,x,y,image.width+w,image.height+h,0,0,canvas.width,canvas.height);
    drawGrid(size,canvas,ctx);
}
init()
