function Rhythm(){
    this.initialize.apply(this, arguments);
}
Rhythm.prototype = Object.create(Rhythm.prototype);
Rhythm.prototype.constructor = Rhythm;
Rhythm.prototype.initialize = function (val,stress=0,limit=0,control=0) {
    this.value=val
    this.arr=[]
    
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
    for (let item of this.arr) {
        item.count++;
    }
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