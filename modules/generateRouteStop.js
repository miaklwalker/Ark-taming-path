
const generateRouteStop = (stop,persistance,render) => {
    const {level,position:{x:lon, y:lat}} = stop;
    const ele = document.createElement("div");
    ele.classList.add("stop");
    ele.addEventListener("click",()=>{
        stop.visited = !stop.visited;
        ele.classList.toggle("visited")
        if(persistance) persistance();
        if(render) render();        
    })
    if(stop.visited) {
        ele.classList.add("visited")
    }
    ele.innerHTML = `
    <h4 class="level"> lvl : <span  class="level-container" data-key="level">${level}</span></h4>
    <div><span class="label">lat</span> : <span  class="lat-container" data-key="lat"> ${lat}</span></div>
    <div><span class="label">lon</span> : <span  class="lon-container" data-key="lon"> ${lon}</span></div>
    `
    function spanHandler (e){
        if(e.inputType === "insertParagraph"){e.preventDefault()}
        let key = e.target.getAttribute("data-key");
        let value = e.target.innerText;
        const removeZeroRegex = new RegExp("^0+(?!$)",'g');
        value = value.replaceAll(removeZeroRegex,"");
        value = Number(value);
        let max = key === "level" ? 300 : 100
        if(value > max) value = 100;
        if(value < 0)value = 0;
        if(key === "lat"){stop.position.y = value}
        if(key === "lon"){stop.position.x = value}
        if(key === "level"){stop[key] = value}
    }
    function makeEditable(e){
        e.target.setAttribute("contenteditable",true)
    }
    ele.addEventListener("keydown",(e)=>{
        if(e.key === "Enter"){
            e.preventDefault();
            let value = e.target.innerText;
            const removeZeroRegex = new RegExp("^0+(?!$)",'g');
            value = value.replaceAll(removeZeroRegex,"");
            e.target.innerText = value;
            console.log(value);
            e.target.removeAttribute("contenteditable");
        }
    })
    let latSpan = ele.querySelector(".lat-container");
        latSpan.addEventListener("input",spanHandler);
        latSpan.addEventListener("click",makeEditable)
    let lonSpan = ele.querySelector(".lon-container");
        lonSpan.addEventListener("input",spanHandler);
        lonSpan.addEventListener("click",makeEditable)

    let levelSpan = ele.querySelector(".level-container");
        levelSpan.addEventListener("input",spanHandler);
        levelSpan.addEventListener("click",makeEditable)



    return ele;
}

export default generateRouteStop;

