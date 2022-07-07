export default function initGui(player,makeHTMLfromList,canvasCon,names){
    let gui = new dat.GUI({
        name:"GUI",
        autoPlace:true,
    })
    let controls = gui.addFolder("player position")
        //controls.open();
        controls.add(player.currentPosition,"y",0,100,.01)
            .name("latitude")
            .setValue(player.currentPosition.y)
            .onChange((e)=>player.currentPosition.y = e)
            .onFinishChange(makeHTMLfromList);

        controls.add(player.currentPosition,"x",0,100,.01)
            .name("longitude")
            .setValue(player.currentPosition.x)
            .onChange((e)=>player.currentPosition.x = e)
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
    return gui;
}