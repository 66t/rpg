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
    sp.rotation = ((data.rota + (correct?.rota || 0)) * Math.PI) / 180;
    let scaleXFactor = (data.ox + ((correct?.ox || 0)) / 100);
    let scaleYFactor = (data.oy + ((correct?.oy || 0)) / 100);
    sp.scale.x = sp.scale.x * (scaleXFactor + ((correct?.sx || 0) / 100));
    sp.scale.y = sp.scale.y * (scaleYFactor + ((correct?.sy || 0) / 100));
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

