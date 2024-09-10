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



Cotton.prototype.setRun=function (key,init,cond,done){this.run.set(key,init,cond,done)}
Cotton.prototype.work=function (work){this.run.install(work)}

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