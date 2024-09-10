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
    this.sedge(20)
    this._page = 0
    this._note = {}
    this._sprite= []
    this._expel= new Set()
    this.work = new Runflow(this)
    this.adorn = new Adorn(this)
    
    
    this.initWork()
    this.initAdorn()
    this.initHandler()
    this._orgin.addChild(this)
}

Cotton.prototype.initImage = function() {this.img={}}
Cotton.prototype.initHandler=function (){}
Cotton.prototype.initWork=function (){}
Cotton.prototype.initAdorn=function (){}
Cotton.prototype.sedge=function (value){this._sedge=value}
Cotton.prototype.delay=function (value){this._delay=value}
Cotton.prototype.stop=function (){this._stop=true}
Cotton.prototype.start=function (){this._stop=false}

Cotton.prototype.setInput=function (arr){this._input = this._input.concat(arr);}
Cotton.prototype.setWork=function (key,init,cond,done){this.work.set(key,init,cond,done)}
Cotton.prototype.runWork=function (work){this.run.install(work)}

Cotton.prototype.loadBit = function (key, val) {
    this._orgin.load++
    this._bit[key] = ImageManager.loadBitmap(`img/${val[0]}/`, val[1]||key)
    this._bit[key].addLoadListener(() => { this._orgin.load-- })
}
Cotton.prototype.update = function() {
    if(this._stop) return
    else if(this.run.active) this.run.update()
};


function Adorn() {
    this.initialize.apply(this, arguments);
}
Adorn.prototype = Object.create(Adorn.prototype)
Adorn.prototype.constructor = Adorn
Adorn.prototype.initialize = function (orgin) {
    this._orgin = orgin
    this.order = []
    this.data = {}
    this.sprite = {}
    this.bitHash = {}
    this.anime = {}
    this.handler = {}
}
// 设置一个新元素或更新现有元素的相关属性
Adorn.prototype.set = function (
    key,
    bit,
    handler = null,
    data = {},
    w = 0,
    h = 0,
    x = 0,
    y = 0,
    cover = 0,
    adso = 7,
    alpha = 1,
    rota = 0
) {
    this.data[key] = {
        bit,                     // 关联的 bit
        data,                    // 元素的自定义数据
        w,                       // 宽度
        h,                       // 高度
        x,                       // x 坐标
        y,                       // y 坐标
        cover,                   // 缩放方式
        adso,                    // 对齐方式
        alpha,                   // 透明度
        rota,                    // 旋转角度
        hide: 0,                 // 是否隐藏
        ox: 1,                   // x 轴缩放比例
        oy: 1,                   // y 轴缩放比例
        sx: 0,                   // 额外的 x 轴缩放
        sy: 0,                   // 额外的 y 轴缩放
        fx: 0,                   // 帧起始 x 百分比
        fy: 0,                   // 帧起始 y 百分比
        fw: 100,                 // 帧宽度百分比
        fh: 100,                 // 帧高度百分比
        touch: false,            // 是否可触摸
        trans: true,             // 是否需要更新
        refresh: true            // 是否需要重新绘制
    };
    this.connectBit(bit, key); // 将元素关联到 bit
    if (handler) this.spHandler(key, handler); // 如果有触摸事件处理器，进行绑定
    this.list.push(key); // 将 key 加入列表
}