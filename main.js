import Stop from "./modules/Stop.js";
import Victor from "./modules/Victor.js";
import Player from "./modules/Player.js";
import createTamingPlan from "./modules/pathPlanner.js";
import drawGrid from "./modules/drawGrid.js";
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
const routeBox = document.querySelector(".route-planner");
const level_input = document.getElementById("level");
const lat_input = document.getElementById("lat");
const lon_input = document.getElementById("lon");
const submit = document.getElementById("add-creature");
const clear_button = document.getElementById("clear-all");

const ctx = canvas.getContext("2d");
const player = new Player(new Victor(50, 50), 0, "the island");

const arkData = await loadJSON("arkData.json");

let names = Object.keys(arkData);
let masterList;

canvas.width = "480";
canvas.height = "480";

const canvasCon = new canvasController(canvas, ctx);
const formController = new FormController(lat_input, lon_input);

canvasCon.addLayer(new mapLayer(1, {
    arkData,
    player
}));
canvasCon.addLayer(new callbackLayer(0, "clear", (canvas, context) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
}));
canvasCon.addLayer(new callbackLayer(2, "grid", (canvas, context) => {
    drawGrid(canvas, context)
}));



function startup() {
    let promises = [];
    names.forEach(name => {
        promises.push(loadImage(arkData[name].url));
    });
    if (sessionStorage.getItem("stops")) {
        loadSessionStorage();
    } else {
        masterList = new stopList();
    }
    return promises;
}

Promise.all(startup())
    .then((promises) => {
        names.forEach((e, i) => {
            arkData[e].image = promises[i];
        })
    })
    .then(() => {
        canvasCon.addLayer(new callbackLayer("3", {
            player
        }, masterList.draw))
        canvasCon.draw();
        CreateHTML();
        initGui(player, CreateHTML, canvasCon, names);
    })



function loadSessionStorage() {
    masterList = new stopList();
    masterList.stops = JSON
        .parse(sessionStorage.getItem("stops"))
        .map(stop => new Stop(stop.level, stop.position.x, stop.position.y, stop.color, stop.visited));
    player.map = sessionStorage.getItem("map")
}

function saveToSessionStorage() {
    console.log(player.map)
    sessionStorage.setItem("map", player.map);
    sessionStorage.setItem("stops", JSON.stringify(masterList.stops));
}

function deleteSessionStorage() {
    let userConfirm = confirm("Are you sure you want to delete all data?");
    if (userConfirm) {
        masterList = new stopList();
        sessionStorage.clear();
        CreateHTML();
    }
}

function CreateHTML() {
    let list = createTamingPlan(masterList.stops.slice(0), player);
    routeBox.innerHTML = "";
    list.forEach(stop => routeBox.appendChild(generateRouteStop(stop, saveToSessionStorage, canvasCon.draw)));
    list.unshift(new Stop(0, player.currentPosition.y, player.currentPosition.x, "rgb(0,0,255)"))
    masterList.listToDraw = list;
    saveToSessionStorage()
    canvasCon.draw();
}

clear_button.addEventListener("click", deleteSessionStorage);
submit.addEventListener("click", () => formController.handleSubmit(masterList, () => {
    CreateHTML();
    saveToSessionStorage();
}));
lat_input.addEventListener("change", formController.updateForm("lat"));
lon_input.addEventListener("change", formController.updateForm("lon"));
level_input.addEventListener("change", formController.updateForm("level"));