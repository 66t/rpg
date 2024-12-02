function Weaver() { this.initialize(...arguments); }
Weaver.prototype = Object.create(PIXI.Container.prototype);
Weaver.prototype.constructor = Weaver;
/**
 * 初始化 Weaver 类的一个新实例。
 */
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
/**
 * 创建 Weaver 实例并将其标记为已启动和激活。
 */
Weaver.prototype.create = function() {
    this.changing=false
    this.started = true;
    this.active = true;
};
/**
 * 停止 Weaver 实例，将其设置为不活动状态。
 */
Weaver.prototype.stop = function() {this.active = false;}
/**
 * 检查 Weaver 是否已准备好，基于各种资源管理器。
 * @returns {boolean} Weaver 实例是否已准备好。
 */
Weaver.prototype.isReady = function() {return FontManager.isReady()&&ImageManager.isReady()&&this.mode}
/**
 * 根据当前模式更新 Weaver 实例。
 */
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
/**
 * 从堆栈中弹出当前场景。
 */
Weaver.prototype.popScene = function() {Scene.pop();}
/**
 * 终止 Weaver 实例，移除所有窗口和子元素。
 */
Weaver.prototype.terminate = function() {
    for(let key of Object.keys(this._window))
        this._window[key].destroy()
    this.removeChildren()
    this.destroy()
}
/**
 * 销毁 Weaver 实例，包括所有子元素和纹理。
 */
Weaver.prototype.destroy = function() {
    PIXI.Container.prototype.destroy.call(this, { children: true, texture: true });
}
/**
 * 检查 Weaver 实例是否处于活动状态。
 * @returns {boolean} 实例是否处于活动状态。
 */
Weaver.prototype.isActive = function() {return this.active;}
/**
 * 检查 Weaver 实例是否已启动。
 * @returns {boolean} 实例是否已启动。
 */
Weaver.prototype.isStarted = function() {return this.started;}
/**
 * 为 Weaver 实例安装初始属性和组件。
 */
Weaver.prototype.install = function (){
    this._window={}
}
/**
 * 执行 Weaver 实例的设置，将其设置为激活模式。
 */
Weaver.prototype.execute = function() {
    this.mode =1
    this.alpha=1
    for(let key in this._window) this._window[key].execute()
}
/**
 * 为 Weaver 实例加载初始资源。
 */
Weaver.prototype.hatch=function (){
    for (let key in this._window){
        let item=this._window[key]
        for(let img in item.img)
            item.loadBit(img,item.img[img])
    }
}
/**
 * 存储 Weaver 实例的状态信息。
 */
Weaver.prototype.stateStore=function (){
    this.stateTable={}
}
/**
 * 为 Weaver 实例添加一个状态。
 * @param {string} state - 要添加的状态。
 */
Weaver.prototype.stateAdd=function (state){
    
}
/**
 * 设置状态属性的值。
 * @param {string} state - 要修改的状态。
 * @param {string} id - 属性 ID。
 * @param {*} value - 要设置的值。
 */
Weaver.prototype.stateValue=function (state,id,value){
    this.stateTable[state] = this.stateTable[state] || {};
    this.stateTable[state][id]=value
}
/**
 * 修改 Weaver 实例的当前状态。
 * @param {string} id - 要切换到的状态。
 */
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
/**
 * 返回到之前的状态。
 * @returns {string} 之前的状态。
 */
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
    this._wheelInter=25
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

    this.initRun()
    this.initWork()
    this.initAdorn()
    this.initHandler()
    this.drawAdorn()
    this._orgin.addChild(this)
}
Cotton.prototype.getNote = function (key) {
    return this._note[key]
}
Cotton.prototype.setNote = function (key, val) {
    this._note[key] = val
}
Cotton.prototype.addExpel=function (handler){this._expel.add(handler)}
Cotton.prototype.delExpel=function (handler){this._expel.delete(handler)}
Cotton.prototype.setExpel=function (arr){
    this._expel=new Set()
    for(let item of arr) this._expel.add(item)
}

Cotton.prototype.initImage = function() {this.img={}}
Cotton.prototype.initHandler=function (){}
Cotton.prototype.initWork=function (){}
Cotton.prototype.initAdorn=function (){}
Cotton.prototype.initRun=function (){}

Cotton.prototype.drawAdorn=function (){if(this.adorn) this.adorn.draw()}
Cotton.prototype.sedge=function (value){this._sedge=value}
Cotton.prototype.delay=function (value){this._delay=value}
Cotton.prototype.stop=function (){this._stop=true}
Cotton.prototype.start=function (){this._stop=false}

Cotton.prototype.setInput=function (arr){this._input = this._input.concat(arr);}

Cotton.prototype.setWork=function (key,init,cond,done){this.work.set(key,init,cond,done)}
Cotton.prototype.runWork=function (work){this.run.install(work)}
Cotton.prototype.spHandler=function (key,handler){this.adorn.addHandler(key,handler)}
Cotton.prototype.delHandler=function (key){this.adorn.delHandler(key)}
Cotton.prototype.setPage =function (page){this._page=page}
Cotton.prototype.getPage =function (){return this._page}

Cotton.prototype.loadBit = function (key, val) {
    this._orgin.load++
    this._bit[key] = ImageManager.loadBitmap(`img/${val[0]}/`, val[1]||key)
    this._bit[key].addLoadListener(() => { this._orgin.load-- })
}
Cotton.prototype.addBit = function (key,bit) {
    if(this.adorn) {
        this._bit[key] = bit
        this.adorn.refBit(key)
    }
}
Cotton.prototype.bitAdorn=function (bit,key){if(this.adorn) this.adorn.setBit(bit,key)}
Cotton.prototype.getBit = function (key) {
    if (this._bit[key]) {
        let bit = new Bitmap(this._bit[key].width, this._bit[key].height)
        bit.blt(this._bit[key], 0, 0, this._bit[key].width, this._bit[key].height, 0, 0, this._bit[key].width, this._bit[key].height)
        return bit
    }
    return new Bitmap(1,1)
}
Cotton.prototype.grabBit = function (key) {
    if (this._bit[key]) return this._bit[key]
    return new Bitmap(1,1)
}
Cotton.prototype.setNineTile = function (key, source, w, h) {
    if (!this._bit[source]) return;
    const bit = new Bitmap(w, h);
    const pic = this.getBit(source);
    const sw = pic.width, sh = pic.height;
    const tileW = sw / 3, tileH = sh / 3; 
    const rightEdgeX = w - tileW, bottomEdgeY = h - tileH;
    for (let uw = tileW; uw < rightEdgeX; uw += tileW) {
        bit.blt(pic, tileW, 0, tileW, tileH, uw, 0, tileW, tileH);                  // 上中
        bit.blt(pic, tileW, 2 * tileH, tileW, tileH, uw, h - tileH, tileW, tileH);  // 下中
    }
    for (let uh = tileH; uh < bottomEdgeY; uh += tileH) {
        bit.blt(pic, 0, tileH, tileW, tileH, 0, uh, tileW, tileH);                  // 左中
        bit.blt(pic, 2 * tileW, tileH, tileW, tileH, w - tileW, uh, tileW, tileH);  // 右中
    }
    
    bit.blt(pic, 0, 0, tileW, tileH, 0, 0, tileW, tileH);                          // 左上角
    bit.blt(pic, 2 * tileW, 0, tileW, tileH, rightEdgeX, 0, tileW, tileH);          // 右上角
    bit.blt(pic, 2 * tileW, 2 * tileH, tileW, tileH, rightEdgeX, bottomEdgeY, tileW, tileH);  // 右下角
    bit.blt(pic, 0, 2 * tileH, tileW, tileH, 0, bottomEdgeY, tileW, tileH);         // 左下角
    this.addBit(key, bit);
};
Cotton.prototype.setData=function (key,k,v){this.adorn.setData(key,k,v)}
Cotton.prototype.getData=function (key,k){return this.adorn.getData(key,k)}
Cotton.prototype.setAdorn=function (key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota){
    this.adorn.set(key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota)
}
Cotton.prototype.delAdorn=function (key){this.adorn.delete(key)}
Cotton.prototype.refAdorn=function (key){this.adorn.ref(key)}
Cotton.prototype.swapAdorn=function (k1,k2){this.adorn.swap(k1,k2)}
Cotton.prototype.evokeAdorn=function (key,bool){
    if(this.adorn) {
        if (bool) this.adorn.on(key)
        else this.adorn.off(key)
    }
}
Cotton.prototype.auditAlpha=function (key,bool){this.adorn.auditAlpha(key,bool)}
Cotton.prototype.getSp=function (key){
    return this.adorn.sprite[key]
}

Cotton.prototype.update = function() {
    if(this._stop) return
    else if(this.work.active) this.work.update()
    else {
        if(this._delay===0) {
            this.processTouch()
            if(this.processKey()||this.processWheel()){this._delay=Math.max(this._delay,4)}
        }
        else this._delay--
        this.innerListen()
    }
    this.adorn.update()
    this.outerListen()
};
Cotton.prototype.innerListen =function (){}
Cotton.prototype.outerListen =function (){}
Cotton.prototype.processTouch = function () {
    const cancelled =Mouse.get(2,"trigger")  
    const pressed = Mouse.get(1)
    if (cancelled && this.cancelled()) return;   
    const x = Mouse.cursor.x;                      
    const y = Mouse.cursor.y;
    for (let key of this.adorn.order.slice().reverse()) {
        const item = this.adorn.sprite[key];       
        const data = this.adorn.data[key];       
        const bound = this.adorn.handler[key];
        if (bound) {
            const handler = bound.handler;      
            const res = bound.update(x, y, cancelled, pressed, item, this._expel); 
            if(res) {
                const pos = [res.touch[0], res.touch[1], res.touch[4] - res.touch[2], res.touch[5] - res.touch[3]];
                const bool = res.data;
                let region = 0;
                
                if (bool[0] === bool[1]) {region = 2;} 
                else if (bool[1] > bool[2]) {region = 1;} 
                else if (bool[0] === bool[2]) {region = 3;}
                
                
                if (bool[6] === 2 && data.touch) {
                    if (region === 1 && this.triggerHandler(handler, "K", data.data, pos)) return;
                }
                if (region === 1 && data.touch) {
                    if (bool[0] === bool[5] && this.triggerHandler(handler, "R", data.data, pos)) return;
                    if (bool[0] === bool[3] && this.triggerHandler(handler, "L", data.data, pos)) return;
                }
                if (bool[0] === bool[4]) {
                    if (bool[6] === 2) {
                        if (this.triggerHandler(handler, "G", data.data, pos)) return;
                        if (region === 1 && this.triggerHandler(handler, "F", data.data, pos)) return;
                        if (region !== 1 && this.triggerHandler(handler, "H", data.data, pos)) return;
                    }
                    if ((region === 1 || region === 2)) {
                        if (this.triggerHandler(handler, "D", data.data, pos)) return;
                    }
                }
                else if (bool[3] > bool[4]) {
                    if (data.touch && bool[6] === 1) if (this.triggerHandler(handler, "C", data.data, pos)) return;
                    if (region === 0) {
                        if (this.triggerHandler(handler, "P", data.data, pos)) return;
                    } else if (region === 2) {
                        if (this.triggerHandler(handler, "E", data.data, pos)) return;
                    } else if (region === 3) {
                        if (this.triggerHandler(handler, "Q", data.data, pos)) return;
                    }
                }
                else {
                    if (region === 0) {
                        if (this.triggerHandler(handler, "U", data.data, pos)) return;
                    } else if (region === 2) {
                        if (this.triggerHandler(handler, "E", data.data, pos)) return;
                    } else if (region === 3) {
                        if (this.triggerHandler(handler, "Q", data.data, pos)) return;
                    } else if (data.touch && region === 1) {
                        if (this.triggerHandler(handler, "T", data.data, pos)) return;
                    }
                }
            }
        }
    }
}
Cotton.prototype.processWheel = function() {
    if(performance.now()-this._wheelTime>this._wheelInter){
        if (this[`WheelDown_${this._page}`]&&Mouse.wheel.y >= this._wheelThreshold) {
            this[`WheelDown_${this._page}`]()
            return true
        }
        if (this[`WheelUp_${this._page}`]&&Mouse.wheel.y <= -this._wheelThreshold) {
            this[`WheelUp_${this._page}`]()
            return true
        }
        this._wheelTime=performance.now()
    }
    return false
}
Cotton.prototype.cancelled = function () {
    if(this[`Back_${this._page}`]) return this[`Back_${this._page}`]()
    return false;
};
Cotton.prototype.processKey = function () {
    for(let key of this._input) {
        if (this[`Trigger_${key}_${this._page}`] && Keyboard.get(key, "trigger")) {
            this[`Trigger_${key}_${this._page}`]()
            return true
        }
        else if (this[`Key_${key}_${this._page}`] &&Keyboard.get(key)) {
            this[`Key_${key}_${this._page}`]()
            return true
        }
        else if (this[`Repe_${key}_${this._page}`] && Keyboard.get(key, "release")) {
            this[`Repe_${key}_${this._page}`]()
            return true
        }
        else if (this[`Longkey_${key}_${this._page}`] && Keyboard.get(key,"long")) {
            this[`Longkey_${key}_${this._page}`]()
            return true
        }
    }
    return  false
}
Cotton.prototype.triggerHandler = function (handler,name,data,pos) {
    if(this[handler+"_"+name]) return this[handler+"_"+name](data,pos)
    return false;
};


function Adorn() {
    this.initialize.apply(this, arguments);
}
Adorn.prototype = Object.create(Adorn.prototype)
Adorn.prototype.constructor = Adorn
Adorn.prototype.initialize = function (orgin) {
    this._orgin = orgin
    this.order = []    //排序
    this.data = {}     //数据
    this.sprite = {}   //精灵
    this.bitHash = {}  //bit绑定组
    this.anime = {}    //动画组
    this.handler = {}  //操作组  
    this.ordRef = true //是否刷新排序
}
Adorn.prototype.update=function (){
    for(let item in this.anime)
        for(let key of Object.keys(this.anime[item]))
            if(this.anime[item][key].update()) {
                delete this.anime[item][key]
            }

    for (let key of this.order)
        if (this.anime[key]||this.data[key].trans)
            this.trans(key)
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
    if (handler) this.addHandler(key, handler); // 如果有触摸事件处理器，进行绑定
    this.order.push(key); // 将 key 加入列表
}
Adorn.prototype.getData=function (key,k){
    if(this.data[key]) return this.data[key][k]
}
Adorn.prototype.setData=function (key,k,v){
    if(this.data[key]) this.data[key].data[k]=v
}
Adorn.prototype.move=function (key,data){
    if(this.data[key]) {
        for (let k of Object.keys(data))
            this.data[key][k] = data[k]
        this.data[key].trans = true
    }
}
Adorn.prototype.delete =function (key){
    if (this.data[key]) {
        delete this.data[key];
        const index = this.order.indexOf(key);
        if (index > -1) {this.order.splice(index, 1);}
        this.draw();
    }
}
//刷新
Adorn.prototype.ref=function (key){
    if(this.data[key]) this.data[key].refresh=true
}
//刷新bit对应的
Adorn.prototype.refBit=function (bit){
    const bitKeys = this.bitHash[bit];
    if (!bitKeys) return;

    for (let key of bitKeys) {
        const dataEntry = this.data[key];
        if (dataEntry) {
            dataEntry.refresh = true;
        }
    }
}
//交换层级
Adorn.prototype.swap=function (k1,k2){
    const i1 = this.order.indexOf(k1);
    const i2 = this.order.indexOf(k2);
    if (i1 === -1 || i2 === -1) return
    this.order.splice(i1, 1);
    this.order.splice(i2, 0, k1);
}
//开启关闭交互
Adorn.prototype.off=function (key){if(this.data[key]) this.data[key].touch=false}
Adorn.prototype.on=function (key) {if(this.data[key]) this.data[key].touch=true}
//修改bit
Adorn.prototype.setBit = function (bit, key) {
    const currentData = this.data[key];
    if (currentData && currentData.bit !== undefined) {
        const oldBit = currentData.bit;
        const index = this.bitHash[oldBit]?.indexOf(key);
        if (index > -1) {
            this.bitHash[oldBit].splice(index, 1);
        }
    }
    currentData.bit = bit;
    this.connectBit(bit, key);
    currentData.refresh = true;
}
//连接BIT
Adorn.prototype.connectBit=function (bit,key){
    if(this.bitHash[bit]) this.bitHash[bit].push(key)
    else this.bitHash[bit]=[key]
}
Adorn.prototype.addHandler=function (key,handler){
    this.delHandler(key)
    if(this.data[key]) this.handler[key]=new Handler(this,handler)
}
Adorn.prototype.delHandler=function (key){
    if(this.handler[key]) delete this.handler[key]
}
//检查透明
Adorn.prototype.auditAlpha =function (key,bool){
    if(this.handler[key]) this.handler[key].alpha=bool||false
}
//需要刷新的
Adorn.prototype.getRef = function() {return this.order.filter(function(key) {return this.data[key].refresh;}, this)};
//失效
Adorn.prototype.getLapse = function() {
    let spKeys = Object.keys(this.sprite);
    let dataKeys = Object.keys(this.data);
    return spKeys.filter(function(key) { return !dataKeys.includes(key);}, this);
};


Adorn.prototype.draw = function () {
    const refSet = new Set(Toolkit.union(this.getRef(), this.getLapse()));
    const newChildren = [];
  
    for (let i = 0; i < this._orgin.children.length; i++) {
        const child = this._orgin.children[i];
        if(child.adorn){
            if (refSet.has(child.adorn) && this.sprite[child.adorn]) {
                this.sprite[child.adorn].destroy();
                delete this.sprite[child.adorn];
            } 
            else {
                newChildren.push(child);
            } 
        }
    }
    
    for (let key of this.order) {
        if (this.data[key]?.refresh) {
            const data=this.data[key]
            data.refresh = false;
            const bit = this._orgin.grabBit(data.bit);
            if (bit) {
                const sp =  new Sprite(bit);
                sp._colorFilter  =this.setupColorFilter(sp)
                sp.adorn = key;
                this.sprite[key] = sp;
                this.trans(key);
            }
        }
    }
    this._orgin.children = newChildren;

    //刷新排序
    if (this.ordRef) {
        this._orgin.children = [];
        for (let key of this.order) {
            this._orgin.addChild(this.sprite[key]);
        }
    }
};
Adorn.prototype.setupColorFilter = function (sprite) {
    const colorFilter = new ColorFilter();
    if (!sprite.filters) {
        sprite.filters = [];
    }
    sprite.filters.push(colorFilter);
    if(sprite.hue) colorFilter.setHue(sprite.hue);
    if(sprite.blendColor) colorFilter.setBlendColor(sprite.blendColor);
    if(sprite.colorTone) colorFilter.setColorTone(sprite.colorTone);
    return colorFilter;
};

Adorn.prototype.trans = function (key) {
    const data = this.data[key];
    const sp = this.sprite[key];
    data.trans = false;
    if (data && sp) {
        let correct = this.getAnime(key);
        sp.anchor.set(0.5, 0.5);
        if (data.hide) {
            sp.hide();
            return;
        }
        sp.show();
        this._scaleSprite(sp, data);
        this._positionSprite(sp, data, correct);
        this._setFrameSprite(sp, data, correct);
        this._setSpriteAttributes(sp, data, correct);
        this._setSpriteColors(sp, data);
    }
};

Adorn.prototype._scaleSprite = function (sp, data) {
    const w = this._calculateScale(data.w, sp.bitmap.width);
    const h = this._calculateScale(data.h, sp.bitmap.height);
    const scale = (data.cover === 1)
        ? Math.max(w, h)
        : (data.cover === 2)
            ? Math.min(w, h)
            : { x: w, y: h };
    if (typeof scale === 'number') {
        sp.scale.set(scale, scale); // 同时设置 x 和 y
    } else {
        sp.scale.set(scale.x, scale.y); // 分别设置 x 和 y
    }
};
Adorn.prototype._positionSprite = function (sp, data, correct) {
    const bitmapWidth = sp.bitmap.width;
    const bitmapHeight = sp.bitmap.height;
    const graphicsWidth = World.canvasWidth;
    const graphicsHeight = World.canvasHeight;
    const fw = (data.fw || 0) + (correct.fw || 0);
    const fh = (data.fh || 0) + (correct.fh || 0);
    const scaleX = sp.scale.x;
    const scaleY = sp.scale.y;
    let sx;
    switch (data.adso % 3) {
        case 1:
            sx = (bitmapWidth * fw / 100) * scaleX * 0.5;
            break;
        case 2:
            sx = graphicsWidth * 0.5;
            break;
        default:
            sx = graphicsWidth - (bitmapWidth * fw / 100) * scaleX * 0.5;
            break;
    }
    let sy;
    if (data.adso > 6) {
        sy = (bitmapHeight * fh / 100) * scaleY * 0.5;
    } 
    else if (data.adso < 4) {
        sy = graphicsHeight - (bitmapHeight * fh / 100) * scaleY * 0.5;
    } 
    else {
        sy = graphicsHeight * 0.5;
    }
    const rx = (typeof data.x === 'string' && data.x.includes("%")) ?
        (parseFloat(data.x) / 100) * bitmapWidth : Toolkit.lengthNum(data.x);
    const ry = (typeof data.y === 'string' && data.y.includes("%")) ?
        (parseFloat(data.y) / 100) * bitmapHeight : Toolkit.lengthNum(data.y);
    sp.x = rx + sx + (correct.x || 0);
    sp.y = ry + sy + (correct.y || 0);
};
Adorn.prototype._setFrameSprite = function (sp, data, correct) {
    const { fx = 0, fy = 0, fw = 100, fh = 100 } = data;
    const { fx: cfx = 0, fy: cfy = 0, fw: cfw = 0, fh: cfh = 0 } = correct;

    const w = sp.bitmap.width;
    const h = sp.bitmap.height;

    const finalFx = (fx + cfx) / 100;
    const finalFy = (fy + cfy) / 100;
    const finalFw = (fw + cfw) / 100;
    const finalFh = (fh + cfh) / 100;

    sp.setFrame(w * finalFx, h * finalFy, w * finalFw, h * finalFh);
};
Adorn.prototype._setSpriteAttributes = function (sp, data, correct) {
    sp.alpha = (data.alpha + (correct?.alpha || 0) / 100);
    sp.rotation = ((data.rota+(correct?.rota || 0)) / 180) * Math.PI
    let scaleXFactor = (data.ox + ((correct?.ox || 0)) / 100);
    let scaleYFactor = (data.oy + ((correct?.oy || 0)) / 100);
    sp.scale.x = sp.scale.x * (scaleXFactor + ((correct?.sx || 0) / 100));
    sp.scale.y = sp.scale.y * (scaleYFactor + ((correct?.sy || 0) / 100));
    sp.skew.x=((data.ex||0)+(correct.ex || 0) / 180)* Math.PI
    sp.skew.y=((data.ey||0)+(correct.ey || 0) / 180)* Math.PI
};
Adorn.prototype._setSpriteColors = function (sp, data) {
    const { hue = 0, br = 0, bg = 0, bb = 0, ba = 0, cr = 0, cg = 0, cb = 0, ca = 0 } = data;
    sp._hue = hue;
    sp._blendColor = [br, bg, bb, ba];
    sp._colorTone = [cr, cg, cb, ca];
    if (sp._hue !== 0) sp._colorFilter.setHue(sp._hue);
    if (br || bg || bb || ba) sp._colorFilter.setBlendColor(sp._blendColor);
    if (cr || cg || cb || ca) sp._colorFilter.setColorTone(sp._colorTone);
};
Adorn.prototype._calculateScale = function (size, dimension) {
    if (typeof size === 'string' && size.includes('%')) {
        return parseFloat(size) / 100 || 1;
    } else {
        return Toolkit.lengthNum(size) / dimension;
    }
};


Adorn.prototype.setAnime =function (sp,key,val,period,frequ,harm,divi,r,phase) {
    if (this.data[sp]) {
        if (!this.anime[sp]) {
            this.anime[sp] = {}
        }
        let data = this.anime[sp]
        for (let i = 0; i < key.length; i++) {
            data[key[i]] =  new Rhythm(0)
            data[key[i]].addWave("add","sin",0,val[i],false,period,frequ,harm,divi,r,phase)
        }
    }
}
Adorn.prototype.stopAnime=function (sp,key,del){
    if(this.anime[sp]) {
        for (let i = 0; i < key.length; i++) {
            if (this.anime[sp][key[i]]) {
                if(del) delete this.anime[sp][key[i]]
                else  this.anime[sp][key[i]].stop = true
            }
        }
    }
}
Adorn.prototype.delAnime=function (sp,key){
    if(this.anime[sp]) {
        if (this.anime[sp][key])
            delete this.anime[sp][key]
        if (Object.keys(this.anime[sp]).length < 1)
            delete this.anime[sp]
    }
}
Adorn.prototype.getAnime=function (sp){
    const correct={}
    if(this.anime[sp]) {
        const item = this.anime[sp]
        for (let key in item) correct[key]=item[key].getVal()
    }
    return correct
}
function Rhythm(){
    this.initialize.apply(this, arguments);
}
Rhythm.prototype = Object.create(Rhythm.prototype);
Rhythm.prototype.constructor = Rhythm;
Rhythm.prototype.initialize = function (val,stress=0,limit=0,control=0) {
    this.value=val
    this.arr=[]
    this.stop=false
    this.strain=0
    this.stress=stress
    this.limit=limit
    this.control=control
    this.opera=0
}
/**
 * 添加波形到节奏对象的波形数组中。
 *
 * @memberof Rhythm
 * @param {string} opera - 操作类型，可为 "add" 或 "mul"。表示波形对主值的操作方式：加法或乘法。
 * @param {string} [waveforms="sin"] - 波形类型，可为 "sin"（正弦波）或 "tri"（三角波）。决定波形的形状。
 * @param {number} v1 - 波形振幅的最小值，波形输出的下限。
 * @param {number} v2 - 波形振幅的最大值，波形输出的上限。
 * @param {boolean} [digit=false] - 是否将波形值取整。`true` 时将波形输出值四舍五入为整数。
 * @param {number} period - 波形周期，表示波形完成一个完整循环所需的时间。
 * @param {number} [frequ=1] - 波形频率，表示每秒完成的周期数，默认值为 1。
 * @param {number} [harm=1] - 谐波倍数，用于控制波形的非线性倍数，正数表示正常倍数，负数表示分数谐波。
 * @param {number} [divi=1] - 波形的分段数，用于细化波形控制，默认值为 1。
 * @param {number} [r=0] - 波形反转和变换类型。0: 不变；1: 波形反转；2: 取绝对值；3: 取负绝对值。
 * @param {number} [phase=0] - 波形初始相位，控制波形从哪个位置开始生成。
 */
Rhythm.prototype.addWave=function (opera,waveforms="sin",v1,v2,digit=false,period,frequ=1,harm=1,divi=1,r=0,phase=0) {
    const wave = {opera,waveforms,v1,v2,period,frequ,count:phase,divi,time:period/frequ,r,digit,harm};
    this.arr.push(wave);
}
Rhythm.prototype.update = function () {
    this.updateStress()
    let stop=this.stop
    for (let item of this.arr) {
        if(this.stop) item.count--
        else item.count++;
        if(item.count%(item.time*(4/item.divi))>0) stop=false
    }
    return stop
};
Rhythm.prototype.updateStress=function (){
    this.strain += (this.opera % 2 ? -1 : 1) * this.stress;
    if (this.control >= 0) {
        if (this.opera === 1 && this.strain === 0) {
            this.opera = 0;
            return;
        }
        if (Math.abs(this.strain) >= Math.abs(this.limit)) {
            if (this.opera === 3) {
                this.opera = 2;
                return;
            }
            switch (this.control) {
                case 0:
                    this.strain = 0;
                    break;
                case 1:
                    this.opera = 1;
                    break;
                case 2:
                    this.opera = 3;
                    break;
            }
        }
    }
}
Rhythm.prototype.getVal=function () {
    let val=this.value+this.strain
    for(let item of this.arr){
        let v=0
        const q=item.count%(item.time*(4/item.divi))
        switch (item.waveforms) {
            case "squ": v=(Toolkit.sinNum(item.time/2,q)>= 0 ? 0 : 1)*(Toolkit.sinNum(item.time,q)>= 0 ? 1 : -1);break
            case "sin": v=Toolkit.sinNum(item.time,q);break
            case "tri": v=Math.asin(Toolkit.sinNum(item.time,q))*(2 / Math.PI);break
            case "inv": v=1-(1/(q+100)*item.time);break
            case "sqr": v=Math.sqrt(q/2/item.time);break
        }
        switch (item.r) {
            case 1:v*=-1;break
            case 2:v=Math.abs(v);break
            case 3:v=-Math.abs(v);break
        }
        if(item.harm!==1) {
            let nega = v < 0
            v = Math.pow(Math.abs(v), item.harm>0?item.harm:1/Math.abs(item.harm))
            if (nega) v = -v
        }
        v=(v*(item.v2-item.v1))+item.v1
        if(item.digit) v=Math.round(v)
        switch (item.opera){
            case "add": val+=v;break
            case "mul": val*=v;break
        }
    }
    return val
}



function Runflow() {
    this.initialize.apply(this, arguments);
}
Runflow.prototype = Object.create(Runflow.prototype);
Runflow.prototype.constructor = Runflow;
Runflow.prototype.initialize = function (orgin) {
    this._orgin=orgin
    this.time=0
    this.active=false
    this.arr=[]
    this.work={}
    this.current={init:"",cond:"",done:""}
}
Runflow.prototype.set=function (key,init,cond,done){
    this.work[key] = {init: init || "",cond: cond || "", done: done || ""}
}
Runflow.prototype.install = function (work) {
    if (this.work[work]) {
        if(!this.active) {
            this.time=0
            this.active=true
            this.current={
                init:this.work[work].init,
                cond:this.work[work].cond,
                done:this.work[work].done
            }
            return true
        }
        else this.arr.push(work)
    }
    return false
}




function Handler() {
    this.initialize.apply(this, arguments);
}
Handler.prototype = Object.create(Handler.prototype)
Handler.prototype.constructor = Handler
Handler.prototype.initialize = function (origin, handler) {
    this._orgin = origin;
    this.handler = handler;
    this.create();
}
Handler.prototype.create = function () {
    this.alpha = false;
    this.touch = [-1, -1, -1, -1, -1, -1];
    this.data = [0, -1, 0, -1, 0, -1, 0];
    this.activa = true;
};
Handler.prototype.update = function (x, y, cancelled, pressed, item, expel) {
    if (!this.activa && !expel.has(this.handler)) {
        this.activa = true;
        return this.update(x, y, cancelled, pressed, item, expel);
    }
    if (this.activa) {
        const itemWidth = item.width * item.scale.x;
        const itemHeight = item.height * item.scale.y;
        const itemX = item.getX();
        const itemY = item.getY();
        const alphaPixel = this.alpha || item.bitmap.getAlphaPixel(
            (x - (itemX - itemWidth * 0.5)) / item.scale.x,
            (y - (itemY - itemHeight * 0.5)) / item.scale.y
        );
        this.touch = [
            x - (itemX - itemWidth * 0.5),
            y - (itemY - itemHeight * 0.5),
            this.touch[2] > -1 ? this.touch[4] : x,
            this.touch[3] > -1 ? this.touch[5] : y,
            x,
            y
        ];
        if (expel.has(this.handler)) {
            this.create();
        } else {
            if (cancelled) {
                this.data[5] = this.data[0] + 1;
            }
            const insideItem = alphaPixel > 0 &&
                this.touch[0] >= 0 && this.touch[0] <= itemWidth &&
                this.touch[1] >= 0 && this.touch[1] <= itemHeight;
            if (pressed) {
                if (this.data[4] > this.data[3]) {
                    this.data[3] = this.data[0] + 1;
                    if (insideItem) this.data[6] = 1;
                }
            } else {
                if (this.data[3] > this.data[4]) {
                    this.data[4] = this.data[0] + 1;
                }
                if (this.data[6]) this.data[6] = this.data[6] === 1 ? 2 : 0;
            }
            if (insideItem) {
                if (this.data[2] > this.data[1]) {
                    this.data[1] = this.data[0] + 1;
                }
            } else {
                if (this.data[1] > this.data[2]) {
                    this.data[2] = this.data[0] + 1;
                }
            }
        }
        this.data[0]++;
        return { data: this.data, touch: this.touch };
    }
    return false
};
