function Weaver() {
    this.initialize.apply(this, arguments);
}
Weaver.prototype = Object.create(Sprite.prototype);
Weaver.prototype.constructor = Weaver;
Weaver.prototype.initialize = function (orgin) {
    Sprite.prototype.initialize.call(this)
    this.alpha =0
    this._orgin=orgin
    this._load = 0
    this._mode = 0
    
    this._state = -1
    this._stateStack = []
    
    this.install()
    this.hatch()
    this.stateStore()
}

Weaver.prototype.install = function (){
    this._window={}
}
Weaver.prototype.stateStore=function (){
    this._stateTable={}
}
Weaver.prototype.modifyState=function (id){
    if(this._stateTable[id]&&this._mode!==id){
        this._stateStack.push(this._mode)
        this._mode=id
        for(let name of Object.keys(this._state[id])){
            if(this._state[id][name][0]) this._window[name].start()
            else this._window[name].stop()

            if(this._state[id][name][1]) this._window[name].show()
            else this._window[name].hide()
        }
    }
}
Weaver.prototype.prevState=function (){
    if(this._stateStack.length)
        return this._stateStack.pop()
    else
        return -1
}

Weaver.prototype.update=function (){
    if(this._load) return
    switch (this._mode){
        case 0: this.execute();break
        case 1:
            for (const child of this.children) {
                if (child.update) {
                    child.update();
                }
            }
    }
}
Weaver.prototype.execute = function() {
    this._mode =1
    this.alpha=1
    for(let key in this._window)
        this._window[key].execute()
}
Weaver.prototype.hatch=function (){
    for (let key in this._window){
        let item=this._window[key]
        for(let img in item.img)
            item.loadBit(img,item.img[img])
    }
    this._orgin.addChild(this)
}
Weaver.prototype.death=function (){
    const children=this._orgin.children
    for(let i=0;i<children.length;i++){
        if(children[i]===this){
            children.splice(i,1)
            break
        }
    }
    for(let key of Object.keys(this._window)) 
        this._window[key] .destroy()
    this.removeChildren()
    this.destroy()
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
    this._orgin._load++
    this._bit[key] = ImageManager.loadBitmap(`img/${val[0]}/`, val[1]||key)
    this._bit[key].addLoadListener(() => { this._orgin._load-- })
}