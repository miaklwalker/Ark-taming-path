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
import initGui from "./modules/initGui.js";

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


let storedConsent  = localStorage.getItem("consent");
let consent;
if(storedConsent === null){
    let string = ""
    string += "In order to remember your preferences and make your experience better "
    string += "I use both local and session storage I do not track you or your usage in anyway,"
    string += " if you still would prefer that this site didn't remember things for you, hit cancel."
    consent = confirm(string)
    if(consent){
    localStorage.setItem("consent",consent)
    storedConsent = consent
    }
}


async function main () {
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
    masterList = loadSessionStorage();
    return promises;
}

Promise.all(startup())
.then((promises)=>{
    names.forEach((e,i)=>{
        arkData[e].image = promises[i];
    })
})
.then(()=>{
    canvasCon.addLayer(new callbackLayer("3",{player},(...args)=>masterList.draw(...args)))
    canvasCon.draw();
    makeHTMLfromList();
})

initGui(player,makeHTMLfromList,canvasCon,names);

function loadSessionStorage () {
    let temp;
    if (sessionStorage.getItem("stops")) {
        temp = new stopList();
        temp.stops = JSON
            .parse(sessionStorage.getItem("stops"))
            .map(stop => new Stop(stop.level,stop.position.x,stop.position.y,stop.color,stop.visited));
    } else {
        temp = new stopList();
    }
    return temp;
}

function saveToSessionStorage () {
    sessionStorage.setItem("stops",JSON.stringify(masterList.stops));
}
function makeHTMLfromList (){
    let list = createtamingplan(masterList.stops.slice(0),player);
    routebox.innerHTML = "";
    list.forEach(stop => routebox.appendChild(generateRouteStop(stop,saveToSessionStorage,canvasCon.draw)));
    list.unshift(new Stop(0,player.currentPosition.y,player.currentPosition.x,"rgb(0,0,255)"))
    masterList.listToDraw = list;
    canvasCon.draw();
}
function deleteSessionStorage () {
    let userConfirm = confirm("Are you sure you want to delete all data?");
    if (userConfirm) {
        masterList = new stopList();
        sessionStorage.clear();
        canvasCon.draw();
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

}

if(storedConsent) {
    main();
}