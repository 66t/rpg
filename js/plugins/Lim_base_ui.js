

Weaver.prototype = Object.create(Sprite.prototype);
Weaver.prototype.constructor = Weaver;
Weaver.prototype.initialize = function (orgin) {
    Sprite.prototype.initialize.call(this)
    this.alpha =0
    this._orgin=orgin
    this._load = 0
    this._mod = -1
    this._stack = []
    this._mode = 0
    this.install()
    this.hatch()
    this.stateStore()
}
Weaver.prototype.install = function (){
    this._window={}
}
Weaver.prototype.stateStore=function (){
    this._state={}
}
Weaver.prototype.modify=function (mode){
    if(this._state[mode]&&this._mod!==mode){
        this._stack.push(this._mod)
        this._mod=mode
        for(let name of Object.keys(this._state[mode])){
            if(this._state[mode][name][0]) this._window[name].start()
            else this._window[name].stop()
            if(this._state[mode][name][1]) this._window[name].show()
            else this._window[name].hide()
        }
    }
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
    for(let key of Object.keys(this._window)) this._window[key] .destroy()
    this.removeChildren()
    this.destroy()
}
Weaver.prototype.prevMod=function (){
    if(this._stack.length)
        return this._stack[this._stack.length-1]
    else
        return -1
}
////
function Cotton() {
    this.initialize.apply(this, arguments);
}
Cotton.prototype = Object.create(Sprite.prototype);
Cotton.prototype.constructor = Cotton;
Cotton.prototype.initialize = function (orgin) {
    Sprite.prototype.initialize.call(this)
    this._orgin=orgin
    this._bit = {"n":new Bitmap(1,1)}
    this._delay = 0
    this._wheelTime = 0
    this._wheelInter= 25
    
    this._stop = true
    this._input=[]
    this._animationSprites = [];
    this.initImage()
};
Cotton.prototype.execute = function () {
    this.threshold = 20
    this._page = 0
    this._note = {}
    this._sprite= []
    this._expel= new Set()
    this.run = new Runflow(this)
    this.adorn = new Adorn(this)
    this.initWork()
    this.initAdorn()
    this.drawAdorn()
    this.initHandler()
    this._orgin.addChild(this)
}

Cotton.prototype.initImage = function() {this.img={}}
Cotton.prototype.delay=function (val){this._delay=val}
Cotton.prototype.stop=function (){this._stop=true}
Cotton.prototype.start=function (){this._stop=false}

Cotton.prototype.initHandler=function (){}
Cotton.prototype.setInput=function (arr){this._input = this._input.concat(arr);}

Cotton.prototype.initWork=function (){}
Cotton.prototype.setRun=function (key,init,cond,done){this.run.set(key,init,cond,done)}
Cotton.prototype.work=function (work){this.run.install(work)}
Cotton.prototype.initAdorn=function (){}
Cotton.prototype.setAdorn=function (key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota){
    this.adorn.set(key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota)
}
Cotton.prototype.setData=function (key,k,v){this.adorn.setData(key,k,v)}
Cotton.prototype.delAdorn=function (key){this.adorn.delete(key)}
Cotton.prototype.refAdorn=function (key){this.adorn.ref(key)}
Cotton.prototype.swapAdorn=function (key1,key2){this.adorn.swap(key1,key2)}
Cotton.prototype.evokeAdorn=function (key,bool){
    if(this.adorn) {
        if (bool) this.adorn.on(key)
        else this.adorn.off(key)
    }
}
Cotton.prototype.touchAdorn=function (key,bool){this.adorn.setTouch(key,bool)}
Cotton.prototype.bitAdorn=function (bit,key){if(this.adorn) this.adorn.setBit(bit,key)}
Cotton.prototype.drawAdorn=function (){
    if(this.adorn) this.adorn.draw()
}
Cotton.prototype.update = function () {
    if(this._stop) return
    else if(this.run.active) this.run.update()
    else {
        if(this._delay===0) {
            this.processTouch()
            if(this.processKey()||this.processWheel()){this._delay=Math.max(this._delay,4)}
        }
        else this._delay--
        this.innerListen()
    }
    this.adorn.update()
    for (const sprite of this._animationSprites) {
        sprite.update()
        if (!sprite.isPlaying()) {this.removeAnimation(sprite);}
    }
    this.outerListen()
}
Cotton.prototype.removeAnimation = function(sprite) {
    this._animationSprites.remove(sprite);
    this.removeChild(sprite);
    sprite.destroy();
};
Cotton.prototype.createAnimationSprite = function(targets1, animation, mirror, delay,targets2) {
    const sprite = new Sprite_Animation();
    const baseDelay = 8
    const previous = null;
    sprite.targetObjects = [targets1];
    sprite.setup([targets1], animation, mirror, delay,null,targets2);
    this.addChild(sprite);
    this._animationSprites.push(sprite);
};
Cotton.prototype.playAnimation=function (name,animationId,mirror){
    const animation = $dataAnimations[animationId];
    const targets1=this.getsp(name)
    const targets2=this.getsp("re_"+name)
    this.createAnimationSprite(targets1, animation,mirror,0,targets2);
}
Cotton.prototype.setAnime =function (sp,key,val,time,cycle,num,mode,lossNir,out) {
    this.adorn.setAnime(sp,key,val,time,cycle,num,mode,lossNir,out)
}
Cotton.prototype.stopAnime =function (sp,key,del) {
    this.adorn.stopAnime(sp,key,del)
}
Cotton.prototype.spHandler=function (key,handler){this.adorn.spHandler(key,handler)}
Cotton.prototype.delHandler=function (key){this.adorn.delHandler(key)}
Cotton.prototype.getsp=function (key){
    return this.adorn.sp[key]
}
Cotton.prototype.loadBit = function (key, val) {
    this._orgin._load++
    this._bit[key] = ImageManager.loadBitmap(`img/${val[0]}/`, val[1]||key)
    this._bit[key].addLoadListener(() => { this._orgin._load-- })
}
Cotton.prototype.setNineTile=function (key,source,w,h,color1,color2){
    if(this._bit[source]){
        const bit=new Bitmap(w,h)
        const pic =this.getBit(source)
        const sw=pic.width
        const sh=pic.height
        if(color1&&color2){
            bit.fillStripedRoundedRect(0, 0,w,h,0,2,color1,color2)
        }
        else if(color1) bit.fillAll(color1)
        for(let uw=sw/3;uw<w-sw/3;uw+=sw/3){
            bit.blt(pic,sw/3,0,sw/3,sh/3,uw,0,sw/3,sh/3)
            bit.blt(pic,sw/3,sh/3*2,sw/3,sh/3,uw,h-sh/3,sw/3,sh/3)
        }
        for(let uh=sh/3;uh<h-sh/3;uh+=sh/3){
            bit.blt(pic,0,sh/3,sw/3,sh/3,0,uh,         sw/3,sh/3)
            bit.blt(pic,sw/3*2,sh/3,sw/3,sh/3,w-sw/3,uh,sw/3,sh/3)
        }
        bit.blt(pic,0,0,sw/3,sh/3,0,0,sw/3,sh/3)
        bit.blt(pic,sw-sw/3,0,sw/3,sw/3,w-sw/3,0,sw/3,sh/3)
        bit.blt(pic,sw-sw/3,sh-sh/3,sw/3,sw/3,w-sw/3,h-sh/3,sw/3,sh/3)
        bit.blt(pic,0,sh-sh/3,sw/3,sw/3,0,h-sh/3,sw/3,sh/3)
        this.addBit(key,bit)
    }
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
Cotton.prototype.addBit = function (key,bit) {
    if(this.adorn) {
        this._bit[key] = bit
        this.adorn.refBit(key)
    }
}
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
Cotton.prototype.processTouch = function () {
    const cancelled=TouchInput.isCancelled()
    const pressed =TouchInput.isPressed()

    if(cancelled&&this.cancelled()) return
    const x= TouchInput.x
    const y= TouchInput.y
    for (let key of this.adorn.list.slice().reverse()) {
        const item = this.adorn.sp[key];
        const data = this.adorn.data[key];
        const bound= this.adorn.handler[key]
        if(bound) {
            const handler =bound.handler
            const res=bound.update(x,y,cancelled,pressed,item,this._expel)
            const pos=[res.touch[0],res.touch[1],res.touch[4]-res.touch[2],res.touch[5]-res.touch[3]]
            const bool =res.data
            let region=0
            if (bool[0] === bool[1]) {region = 2;}
            else if (bool[1] > bool[2]) {region = 1;}
            else if (bool[0] === bool[2]) {region = 3;}
            if(bool[6]===2&&data.touch){
                if (region===1&&this.triggerHandler(handler,"K",data.data,pos)) return
            }
            if(region===1&&data.touch){
                if (bool[0]===bool[5]&&this.triggerHandler(handler,"R",data.data,pos)) return
                if (bool[0]===bool[3]&&this.triggerHandler(handler,"L",data.data,pos)) return
            }
            if(bool[0]===bool[4]){
                if(bool[6]===2) {
                    if (this.triggerHandler(handler,"G",data.data,pos)) return
                    if (region===1&&this.triggerHandler(handler,"F",data.data,pos)) return
                    if (region!==1&&this.triggerHandler(handler,"H",data.data,pos)) return
                }
                if((region===1||region===2)) {
                    if (this.triggerHandler(handler,"D",data.data,pos)) return
                }
            }
            else if(bool[3]>bool[4]){
                if(data.touch&&bool[6]===1) if (this.triggerHandler(handler,"C",data.data,pos)) return
                if(region===0) {if (this.triggerHandler(handler,"P",data.data,pos)) return}
                else if(region===2) {if (this.triggerHandler(handler, "E", data.data, pos)) return}
                else if(region===3) {if (this.triggerHandler(handler, "Q", data.data, pos)) return}
            }
            else {
                if(region===0) {if (this.triggerHandler(handler,"U",data.data,pos)) return}
                else if(region===2) {if (this.triggerHandler(handler,"E",data.data,pos)) return}
                else if(region===3) {if (this.triggerHandler(handler, "Q", data.data, pos)) return}
                else if(data.touch&&region===1) {
                    if (this.triggerHandler(handler,"T",data.data,pos)) return
                }
            }
        }
    }
}
Cotton.prototype.processWheel = function() {
    if(performance.now()-this._wheelTime>this._wheelInter){
        if (this[`WheelDown_${this._page}`]&&TouchInput.wheelY >= this.threshold) {
            this[`WheelDown_${this._page}`]()
            return true
        }
        if (this[`WheelUp_${this._page}`]&&TouchInput.wheelY <= -this.threshold) {
            this[`WheelUp_${this._page}`]()
            return true
        }
        this._wheelTime=performance.now()
    }
    return false
}
Cotton.prototype.processKey = function () {
    for(let key of this._input) {
        if (this[`Trigger_${key}_${this._page}`] && Input.isTriggered(key)) {
            this[`Trigger_${key}_${this._page}`]()
            return true
        }
        else if (this[`Key_${key}_${this._page}`] && Input.isPressed(key)) {
            this[`Key_${key}_${this._page}`]()
            return true
        }
        else if (this[`Repe_${key}_${this._page}`] && Input.isRepeated(key)) {
            this[`Repe_${key}_${this._page}`]()
            return true
        }
        else if (this[`Longkey_${key}_${this._page}`] && Input.isLongPressed(key)) {
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
Cotton.prototype.cancelled = function () {
    if(this[`Back_${this._page}`]) return this[`Back_${this._page}`]()
    return false;
};
Cotton.prototype.innerListen =function (){}
Cotton.prototype.outerListen =function (){}

////
function Runflow() {
    this.initialize.apply(this, arguments);
}
Runflow.prototype = Object.create(Runflow.prototype);
Runflow.prototype.constructor = Runflow;
Runflow.prototype.initialize = function (orgin) {
    this._orgin=orgin
    this.active=false
    this.time=0
    this.arr=[]
    this.work={}
    this.init=""
    this.cond=""
    this.done=""
}

Runflow.prototype.set=function (key,init,cond,done){
    this.work[key] = {init: init || "",cond: cond || "", done: done || "",}
}
Runflow.prototype.install = function (work) {
    if (this.work[work]) {
        if(!this.active) {
            this.time=0
            this.active=true
            this.init=this.work[work].init
            this.cond=this.work[work].cond
            this.done=this.work[work].done
            return true
        }
        else this.arr.push(work)
    }
    return false
}
Runflow.prototype.update=function (){
    if (this.time === 0) {
        this.time++;
        if (this.init && this._orgin[this.init]) this._orgin[this.init](); // 执行初始化方法
    }
    else {
        if (!this.cond||(this._orgin[this.cond]&&this._orgin[this.cond]())){
            this.active = false;
            if(this.done&&this._orgin[this.done]){
                this._orgin[this.done]()
                let bool=true
                while (bool&&this.arr.length)
                    if(this.install(this.arr.shift()))
                        bool=false
            }
        }
        else this.time++
    }
}

////
function Adorn() {
    this.initialize.apply(this, arguments);
}
Adorn.prototype = Object.create(Adorn.prototype);
Adorn.prototype.constructor = Adorn;
Adorn.prototype.initialize = function (orgin) {
    this._orgin=orgin
    this.data={}
    this.list=[]
    this.map={}
    this.sp={}
    this.anime={}
    this.handler={}
}

Adorn.prototype.set=function (key,bit,handler,data,w,h,x,y,cover,adso,alpha,rota){
    this.data[key]={
        bit:bit,
        data:data||{},
        w:w||0,
        h:h||0,
        x:x||0,
        y:y||0,
        cover: cover||0,
        adso: adso!==undefined?adso:7,
        alpha: alpha!==undefined?alpha:1,
        hide:0,
        rota: rota || 0,
        ox:1, //缩放
        oy:1,
        sx:0,
        sy:0,
        fx:0,
        fy:0,
        fw:100,
        fh:100,
        touch:false,
        trans:true,
        refresh:true
    }
    this.connectBit(bit,key)
    if(handler) this.spHandler(key,handler)
    this.list.push(key)
}
Adorn.prototype.setData=function (key,k,v){
    if(this.data[key])
        this.data[key].data[k]=v
}
Adorn.prototype.delete =function (key){
    if(this.data[key]){
        delete this.data[key]
        if(this.list.indexOf(key)>-1)
            this.list.splice(this.list.indexOf(key),1)
        this.draw()
    }
}

Adorn.prototype.ref=function (key){if(this.data[key]) this.data[key].refresh=true}
Adorn.prototype.update=function (){
    for(let item in this.anime)
        for(let key of Object.keys(this.anime[item]))
            if(this.anime[item][key].update()) {
                delete this.anime[item][key]
            }

    for (let key of this.list)
        if (this.anime[key]||this.data[key].trans)
            this.trans(key)
}
Adorn.prototype.swap=function (v1,v2){
    const i1 = this.list.indexOf(v1);
    const i2 = this.list.indexOf(v2);
    if (i1 === -1 || i2 === -1) return
    this.list.splice(i1, 1);
    this.list.splice(i2, 0, v1);
}
Adorn.prototype.off=function (key){if(this.data[key]) this.data[key].touch=false}
Adorn.prototype.on=function (key) {if(this.data[key]) this.data[key].touch=true }
Adorn.prototype.setBit=function (bit,key){
    if(this.data[key]) {
        if (this.data[key].bit) {
            let index = this.map[this.data[key].bit].indexOf(key)
            if (index > -1) this.map[this.data[key].bit].splice(index, 1)
        }
        this.data[key].bit = bit
        this.connectBit(bit, key)
        this.data[key].refresh = true
    }
}
Adorn.prototype.connectBit=function (bit,key){
    if(this.map[bit]) this.map[bit].push(key)
    else  this.map[bit]=[key]
}
Adorn.prototype.refBit=function (bit){
    if(this.map[bit])
        for(let key of this.map[bit])
            if(this.data[key]) this.data[key].refresh=true
}

Adorn.prototype.setAnime =function (sp,key,val,time,cycle,num,mode,lossNir,out) {
    if (this.data[sp]) {
        if (!this.anime[sp]) {
            this.anime[sp] = {}
        }
        let data = this.anime[sp]
        for (let i = 0; i < key.length; i++) {
            data[key[i]] =  new Rhythm(val[i],time,cycle,num,mode,lossNir,out)
        }
    }
}
Adorn.prototype.stopAnime=function (sp,key,del){
    if(this.anime[sp]) {
        for (let i = 0; i < key.length; i++) {
            if (this.anime[sp][key[i]]) {
                if(del) delete this.anime[sp][key[i]]
                else  this.anime[sp][key[i]].run = false
            }
        }
    }
}
Adorn.prototype.getAnime=function (sp){
    const correct={}
    if(this.anime[sp]) {
        const item = this.anime[sp]
        for (let key in item) {
            correct[key]=item[key].getVal()
        }
    }
    return correct
}

Adorn.prototype.getRef = function() {
    return this.list.filter(function(key) {return this.data[key].refresh;}, this);
};
Adorn.prototype.getLapse = function() {
    let spKeys = Object.keys(this.sp);
    let dataKeys = Object.keys(this.data);
    return spKeys.filter(function(key) { return !dataKeys.includes(key);}, this);
};
Adorn.prototype.draw = function () {
    const ref=LIM.UTILS.union(this.getRef(),this.getLapse())
    for(let i=0;i<this._orgin.children.length;i++){
        if (this._orgin.children[i].adorn){
            const adorn= this._orgin.children[i].adorn
            if(ref.indexOf(adorn)>-1&&this.sp[adorn]){
                this._orgin.children.splice(i--, 1)
                this.sp[adorn].destroy()
                delete this.sp[adorn]
            }
        }
    }
    this._orgin.children=[]
    for (let key of this.list) {
        if (this.data[key]){
            if(this.data[key].refresh){
                this.data[key].refresh=false
                const bit = this._orgin.grabBit(this.data[key].bit);
                if(bit){
                    const sp = new Sprite(bit);

                    sp._colorFilter = new ColorFilter();
                    if (!sp.filters) {sp.filters = [];}
                    sp.filters.push(sp._colorFilter);
                    sp._colorFilter.setHue(sp._hue);
                    sp._colorFilter.setBlendColor(sp._blendColor);
                    sp._colorFilter.setColorTone(sp._colorTone);
                    sp.adorn=key
                    this.sp[key]=sp
                    this.trans(key)

                }
            }
            this._orgin.addChild(this.sp[key])
        }
    }
}

Adorn.prototype.trans =function (key) {
    this.data[key].trans=false
    if(this.data[key]&&this.sp[key]) {
        let correct = this.getAnime(key)
        const sp = this.sp[key]
        const data = this.data[key]
        sp.anchor.set(0.5, 0.5);
        //隐藏
        if (data.hide) {
            sp.hide()
            return
        }
        sp.show()
        //缩放
        let w = 1
        let h = 1
        if (String(data.w).indexOf("%") > -1) w = parseFloat(data.w.replace('%', '')) / 100 || 1
        else w = LIM.UTILS.lengthNum(data.w) / sp.bitmap.width

        if (String(data.h).indexOf("%") > -1) h = parseFloat(data.h.replace('%', '')) / 100 || 1
        else h = LIM.UTILS.lengthNum(data.h) / sp.bitmap.height
        switch (data.cover) {
            case 1:
                sp.scale.x = Math.max(w, h)
                sp.scale.y = sp.scale.x
                break
            case 2:
                sp.scale.x = Math.min(w, h)
                sp.scale.y = sp.scale.x
                break
            default:
                sp.scale.x = w
                sp.scale.y = h
                break
        }
        let fx = data.fx + (correct.fx || 0)
        let fy = data.fy + (correct.fy || 0)
        let fw = data.fw + (correct.fw || 0)
        let fh = data.fh + (correct.fh || 0)
        //定位
        let qx = sp.scale.x
        let qy = sp.scale.y
        w = sp.bitmap.width
        h = sp.bitmap.height
        let sx = data.adso % 3 === 1 ? (w*fw/100) * qx * 0.5 :
            data.adso % 3 === 2 ? Graphics.width * 0.5 :
                Graphics.width - (w*fw/100) * qx * 0.5;
        let sy = data.adso > 6 ? (h*fh/100) * qy * 0.5 :
            data.adso < 4 ? Graphics.height - (h*fh/100) * qy * 0.5 :
                Graphics.height * 0.5;
        //裁剪
        sp.setFrame(w * fx / 100, h * fy / 100, w * fw / 100, h * fh / 100)

        //设定值
        sp.rx = (typeof data.x === 'string' && data.x.includes("%")) ? (parseFloat(data.x) / 100) * sp.bitmap.width : LIM.UTILS.lengthNum(data.x);
        sp.x = sp.rx + sx + (correct.x || 0);
        sp.ry = (typeof data.y === 'string' && data.y.includes("%")) ? (parseFloat(data.y) / 100) * sp.bitmap.height : LIM.UTILS.lengthNum(data.y);
        sp.y = sp.ry + sy + (correct.y || 0);
        sp.alpha = data.alpha + (correct.alpha || 0) / 100;
        sp.rotation = ((data.rota + (correct.rota || 0)) / 180) * Math.PI;
        sp.scale.x *= data.ox + (correct.ox || 0) / 100
        sp.scale.y *= data.oy + (correct.oy || 0) / 100
        sp.scale.x+=(correct.sx || 0) / 100
        sp.scale.y+=(correct.sy || 0) / 100


        //颜色
        sp._hue = data.hue || 0
        sp._blendColor = [data.br || 0, data.bg || 0, data.bb || 0, data.ba || 0]
        sp._colorTone = [data.cr || 0, data.cg || 0, data.cb || 0, data.ca || 0]
        sp._colorFilter.setHue(sp._hue);
        sp._colorFilter.setBlendColor(sp._blendColor);
        sp._colorFilter.setColorTone(sp._colorTone);
    }
}
Adorn.prototype.move=function (key,data){
    if(this.data[key]) {
        for (let k of Object.keys(data)) this.data[key][k] = data[k]
        this.data[key].trans = true
    }
}
Adorn.prototype.setTouch =function (key,bool){
    if(this.handler[key]) this.handler[key].alpha=bool||false
}
Adorn.prototype.spHandler=function (key,handler){
    this.delHandler(key)
    if(this.data[key]) this.handler[key]=new Handler(this,handler)
}
Adorn.prototype.delHandler=function (key){
    if(this.handler[key]) delete this.handler[key]
}

/////
function Handler() {
    this.initialize.apply(this, arguments);
}
Handler.prototype = Object.create(Handler.prototype);
Handler.prototype.constructor = Handler;
Handler.prototype.initialize = function (orgin,handler) {
    this._orgin=orgin
    this.handler=handler
    this.create()
}
Handler.prototype.create=function (){
    this.alpha=false    //是否判断颜色
    this.touch=[-1,-1,-1,-1,-1,-1]
    this.data=[0,-1,0,-1,0,-1,0]
    this.activa=true
}
Handler.prototype.update=function (x,y,cancelled,pressed,item,expel) {
    if (this.activa) {
        let itemWidth = item.width*item.scale.x;
        let itemHeight = item.height*item.scale.y;
        let itemX = item.getX()
        let itemY = item.getY()
        let alphaPixel = this.alpha||item.bitmap.getAlphaPixel((x - (itemX - itemWidth * 0.5))/item.scale.x, (y - (itemY - itemHeight * 0.5))/item.scale.y);
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
        }
        else {
            if (cancelled) {
                this.data[5] = this.data[0]+1;
            }
            let insideItem = alphaPixel > 0 && this.touch[0] >= 0 && this.touch[0] <= itemWidth && this.touch[1] >= 0 && this.touch[1] <= itemHeight;
            if (pressed) {
                if(this.data[4]>this.data[3]) {
                    this.data[3] = this.data[0] + 1
                    if(insideItem){this.data[6]=1}
                }
            }
            else {
                if(this.data[3]>this.data[4]) {this.data[4]=this.data[0]+1}
                if(this.data[6]) this.data[6]=this.data[6]===1?2:0
            }
            if (insideItem) {
                if(this.data[2]>this.data[1]){this.data[1]=this.data[0]+1}
            }
            else {
                if(this.data[1]>this.data[2]){this.data[2]=this.data[0]+1}
            }
        }
        this.data[0]++;  // 更新时间
        return {data:this.data,touch:this.touch}
    }
    else if (!expel.has(this.handler)) {
        this.activa = true
        return this.update(x,y,cancelled,pressed,item,expel)
    }
}
