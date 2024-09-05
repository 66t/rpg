
var $Db
const effekseerWasmUrl = "js/libs/effekseer.wasm";
window.onload =  function () {DataManager.loadDatabase().then(() => gameStart())}
function gameStart(){
    if(!Toolkit.isNwjs()) webDb()
    Mouse.install();
    Keyboard.install();
    effekseer.initRuntime(effekseerWasmUrl, onLoad, onError);
}
function onLoad(){
    Conductor.update()
    Scene.run(Weaver1)
    World.resize()
    
    
    
    Conductor.play("2")
    setTimeout(function (){
        Conductor.play("1")
        setTimeout(function (){
            Conductor.play("2")
        },4000)
    },18000)
}
function onError() {}
function webDb() {
    $Db = new Dexie('LimGame');
    $Db.version(1).stores({[World.ID]: "index,type,[index+type],data"});
    $Db = $Db.table(World.ID)
}