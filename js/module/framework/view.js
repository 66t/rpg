function Weaver() { this.initialize(...arguments); }
Weaver.prototype = Object.create(PIXI.Container.prototype);
Weaver.prototype.constructor = Weaver;
Weaver.prototype.initialize = function() {
    PIXI.Container.call(this);
    this.interactive = false;
    this.started = false;
    this.active = false;
    this.changing=true
    this.sortableChildren = true;
    
    this.alpha =0
    
    this.load = 0
    this.mode = 0
    this.state = -1
    this.stateStack = []

    this.install()
    this.hatch()
    this.stateStore()
}
Weaver.prototype.create = function() {
    this.changing=false
    this.started = true;
    this.active = true;
};
Weaver.prototype.stop = function() {this.active = false;}
Weaver.prototype.isReady = function() {return FontManager.isReady()&&ImageManager.isReady()&&this.mode}
Weaver.prototype.update = function() {
    if(this.load) return
    switch (this.mode){
        case 0: this.execute();break
        case 1:
            for (const child of this.children) {
                if (child.update) {
                    child.update();
                }
            }
    }
};
Weaver.prototype.popScene = function() {Scene.pop();}
Weaver.prototype.terminate = function() {
    for(let key of Object.keys(this._window))
        this._window[key].destroy()
    this.removeChildren()
    this.destroy()
}
Weaver.prototype.destroy = function() {
    PIXI.Container.prototype.destroy.call(this, { children: true, texture: true });
}
Weaver.prototype.isActive = function() {return this.active;}
Weaver.prototype.isStarted = function() {return this.started;}
Weaver.prototype.install = function (){
    this._window={}
}
Weaver.prototype.execute = function() {
    this.mode =1
    this.alpha=1
    for(let key in this._window) this._window[key].execute()
}
Weaver.prototype.hatch=function (){
    for (let key in this._window){
        let item=this._window[key]
        for(let img in item.img)
            item.loadBit(img,item.img[img])
    }
}
Weaver.prototype.stateStore=function (){
    this.stateTable={}
}
Weaver.prototype.stateAdd=function (state){
    
}
Weaver.prototype.stateValue=function (state,id,value){
    this.stateTable[state] = this.stateTable[state] || {};
    this.stateTable[state][id]=value
}
Weaver.prototype.modifyState=function (id){
    if(this.stateTable[id]&&this.state!==id){
        this.stateStack.push(this.state)
        this.state=id
        for(let name of Object.keys(this.stateTable[id])){
            if(this.stateTable[id][name][0]) this._window[name].start()
            else this._window[name].stop()

            if(this.stateTable[id][name][1]) this._window[name].show()
            else this._window[name].hide()
        }
    }
}
Weaver.prototype.prevState=function (){
    if(this.stateStack.length)
        return this.stateStack.pop()
    else
        return -1
}


function Cotton() {
    this.initialize.apply(this, arguments);
}
Cotton.prototype = Object.create(Sprite.prototype);
Cotton.prototype.constructor = Cotton;
Cotton.prototype.initialize = function (orgin) {
    Sprite.prototype.initialize.call(this);
    this._orgin = orgin; 
    this._bit = {"nil": new Bitmap(1, 1)};
    this._delay = 0;
    this._wheelTime = 0;
    this._wheelThreshold = 20
    this._stop = true; 
    
    this._input = []; 
    this._animationSprites = []; 
    this.initImage(); 
};
Cotton.prototype.execute = function () {
    this._page = 0
    this._note = {}
    this._sprite= []
    this._orgin.addChild(this)
}
Cotton.prototype.initImage = function() {this.img={}}
Cotton.prototype.setDelay=function (value){this._delay=value}
Cotton.prototype.stop=function (){this._stop=true}
Cotton.prototype.start=function (){this._stop=false}
Cotton.prototype.loadBit = function (key, val) {
    this._orgin.load++
    this._bit[key] = ImageManager.loadBitmap(`img/${val[0]}/`, val[1]||key)
    this._bit[key].addLoadListener(() => { this._orgin.load-- })
}
Cotton.prototype.update = function() {
    Sprite.prototype.update.call(this);
};
