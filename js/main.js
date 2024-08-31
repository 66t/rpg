
var $Db
window.onload =  function () {
    DataManager.loadDatabase().then(() => gameStart())
}
function gameStart(){
    if(!Toolkit.isNwjs()) webDb()
    Mouse.install();
    Keyboard.install();
    Scene.run(Weaver1)
    // setInterval(()=>{
    //     Scene.push(Weaver1)
    // },1000)
    World.resize()
}
function webDb() {
    $Db = new Dexie('LimGame');
    $Db.version(1).stores({[World.ID]: "index,type,[index+type],data"});
    $Db = $Db.table(World.ID)
}