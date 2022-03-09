import Stop from "./modules/Stop.js";
import Victor from "./modules/Victor.js";
import Player from  "./modules/Player.js";
import createtamingplan from "./modules/pathPlanner.js";
import drawGrid from "./modules/drawGrid.js";
import { plotPoint } from "./modules/drawHelpers.js";
import stopList from "./modules/stoplist.js";
import loadImage from "./modules/loadImage.js";
import loadJSON from "./modules/loadJSON.js";
import canvasController from "./modules/canvasController.js";
import mapLayer from "./modules/mapLayer.js";
import callbackLayer from "./modules/callbackLayer.js";
import generateRouteStop from "./modules/generateRouteStop.js";
import FormController from "./modules/formController.js";


const canvas = document.getElementById("data-vis");
const ctx = canvas.getContext("2d");
const routebox = document.querySelector(".route-planner");
const level_input = document.getElementById("level");
const lat_input = document.getElementById("lat");
const lon_input = document.getElementById("lon");
const submit = document.getElementById("add-creature");
const clear_button = document.getElementById("clear-all");
const player = new Player(new Victor(50,50),0,"valquero");
const size = 10;

const arkData = await loadJSON("arkData.json");
let names = Object.keys(arkData);
let masterList,gui;
canvas.width = "480";
canvas.height = "480";

const canvasCon = new canvasController(canvas,ctx);
    canvasCon.addLayer(new mapLayer(1,{arkData,player}));
    canvasCon.addLayer(new callbackLayer(0,"clear",(canvas,context)=>{context.clearRect(0,0,canvas.width,canvas.height)}));
    canvasCon.addLayer(new callbackLayer(2,"grid",(canvas,context)=>{drawGrid(canvas,context)}));
const formController = new FormController(lat_input,lon_input);
function startup () {
   let promises = [];
    names.forEach(name => {
        promises.push(loadImage(arkData[name].url));
    });
    if (sessionStorage.getItem("stops")) {
        masterList = new stopList();
        masterList.stops = JSON.parse(sessionStorage.getItem("stops")).map(stop => new Stop(stop.level,stop.position.x,stop.position.y,stop.color,stop.visited));
    } else {
        masterList = new stopList();
    }
    return promises;
}

Promise.all(startup())
.then((promises)=>{
    names.forEach((e,i)=>{
        arkData[e].image = promises[i];
    })
})
.then(()=>{
    canvasCon.addLayer(new callbackLayer("3",{player},masterList.draw))
    canvasCon.draw();
    makeHTMLfromList();
})






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
            player.map = e;
            canvasCon.draw()
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


function saveToSessionStorage () {
    sessionStorage.setItem("stops",JSON.stringify(masterList.stops));
}
async function makeHTMLfromList (){
    let list = createtamingplan(masterList.stops.slice(0),player);
    routebox.innerHTML = "";
    list.forEach(stop => routebox.appendChild(generateRouteStop(stop)));
    list.unshift(new Stop(0,player.currentPosition.y,player.currentPosition.x,"rgb(0,0,255)"))
    canvasCon.draw();
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
submit.addEventListener("click",() => formController.handleSubmit(masterList,()=>{
    makeHTMLfromList();
    saveToSessionStorage();
}));
lat_input.addEventListener("change", formController.updateForm("lat"));
lon_input.addEventListener("change", formController.updateForm("lon"));
level_input.addEventListener("change", formController.updateForm("level"));


