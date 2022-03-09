const generateRouteStop = (stop) => {
    const {level,position:{x:lon, y:lat}} = stop;
    const ele = document.createElement("div");
    ele.classList.add("stop");
    ele.addEventListener("click",()=>{
        stop.visited = !stop.visited;
        ele.classList.toggle("visited")
    })
    if(stop.visited) {
        ele.classList.add("visited")
    }
    ele.innerHTML = `
    <h4 class="level"> lvl : ${level}</h4>
    <div><span class="label">lat</span> : <span> ${lat}</span></div>
    <div><span class="label">lon</span> : <span> ${lon}</span></div>
    `
    return ele;
}

export default generateRouteStop;

