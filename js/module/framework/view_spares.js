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
Handler.prototype.updateTouchState = function (x, y, item) {
    const itemWidth = item.width * item.scale.x;
    const itemHeight = item.height * item.scale.y;
    const itemX = item.getX();
    const itemY = item.getY();

    this.touch = [
        x - (itemX - itemWidth * 0.5),
        y - (itemY - itemHeight * 0.5),
        this.touch[2] > -1 ? this.touch[4] : x,
        this.touch[3] > -1 ? this.touch[5] : y,
        x,
        y
    ];
};
Handler.prototype.isInsideItem = function (x, y, item) {
    const itemWidth = item.width * item.scale.x;
    const itemHeight = item.height * item.scale.y;
    const itemX = item.getX();
    const itemY = item.getY();
    const alphaPixel = this.alpha || item.bitmap.getAlphaPixel((x - (itemX - itemWidth * 0.5)) / item.scale.x,(y - (itemY - itemHeight * 0.5)) / item.scale.y);
    return alphaPixel > 0 &&
        this.touch[0] >= 0 && this.touch[0] <= itemWidth &&
        this.touch[1] >= 0 && this.touch[1] <= itemHeight;
};
Handler.prototype.handleCancel = function (cancelled) {
    if (cancelled) {
        this.data[5] = this.data[0] + 1; // 标记为已取消
    }
};
Handler.prototype.handlePressed = function (insideItem) {
    if (this.data[4] > this.data[3]) {
        this.data[3] = this.data[0] + 1;
        if (insideItem) this.data[6] = 1; // 如果在项目内部，标记为 1
    }
};
Handler.prototype.handleReleased = function () {
    if (this.data[3] > this.data[4]) {
        this.data[4] = this.data[0] + 1; // 更新释放状态
    }
    if (this.data[6]) {
        this.data[6] = (this.data[6] === 1) ? 2 : 0; // 切换状态
    }
};
Handler.prototype.updateItemState = function (insideItem) {
    if (insideItem) {
        if (this.data[2] > this.data[1]) {
            this.data[1] = this.data[0] + 1; // 更新内部状态
        }
    } else {
        if (this.data[1] > this.data[2]) {
            this.data[2] = this.data[0] + 1; // 更新外部状态
        }
    }
};