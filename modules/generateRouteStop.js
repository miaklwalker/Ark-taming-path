
const generateRouteStop = (stop,persistence,render) => {
    const {level,position:{x:lon, y:lat}} = stop;
    const ele = document.createElement("div");
    ele.classList.add("stop");
    ele.addEventListener("click",()=>{
        stop.visited = !stop.visited;
        ele.classList.toggle("visited")
        //! Session Storage Handler
        if(persistence) persistence();
        //! Render Handler;
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
            e.target.removeAttribute("contenteditable");
            render();
        }
    });

    [".lat-container",".lon-container",".level-container"].forEach(span=>{
        let temp = ele.querySelector(span);
        temp.addEventListener("input",spanHandler);
        temp.addEventListener("click",makeEditable)
    })





    return ele;
}

export default generateRouteStop;

