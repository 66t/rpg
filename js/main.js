window.onload =  function () {
    DataManager.loadDatabase()
        .then(() => gameStart())
        .catch(error => console.error('加载数据库时出错:', error));
}
function gameStart(){
    Scene.run(Stage)
    World.resize()
}