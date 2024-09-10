function Conductor() {
    throw new Error("static class");
}
Conductor.path = 'audio';
Conductor.volVolume = 1;
Conductor.trajeVolume = {
    bgm: 1, // 背景音乐
    bgs: 1, // 背景音效
    me: 1,  // 配音
    se: 1   // 声效
};
Conductor.traje = [];  //轨
Conductor.buffer = {}; //缓冲
Conductor.id = 0
Conductor.play = function(id, traje = 100) {
    let data = $Audio[id];
    if (data) {
        if(!Conductor.traje[traje]) Conductor.traje[traje]=new Traje()
        const buffer=Conductor.traje[traje].buffer
        let unrele =  Object.keys(buffer).find(key => buffer[key].name === id);
        if(unrele>0){this.buffer[unrele].recover()}
        else {
             new Near(id,traje,data)
             this.trajePush(traje)
        }
    }
};
// 更新播放缓冲区
Conductor.update = function() {
    const currentTime = performance.now();
    for (let item of Conductor.traje) {
        if (!item || !item.buffer || item.buffer.length === 0) continue;
        let {playId,playTime} = item.buffer.reduce((acc, id) => {
            let bufferItem = this.buffer[id];
            if (bufferItem.timeInit > bufferItem.timeStop && bufferItem.timeInit > acc.playTime) {
                return { playId: id, playTime: bufferItem.initTime };
            }
            return acc;}, {playId: -1,playTime:0});
        if (playId !== item.play) this.trajePlay(item,playId)
    }
    for (let item of Object.keys(Conductor.buffer)) {
        Conductor.buffer[item].update(currentTime);
    }
    setTimeout(()=>{this.update()},10)
};
Conductor.trajePush=function (traje){
    Conductor.traje[traje].buffer.push(this.id)
}
Conductor.trajePlay=function (traje,playid){
    if(traje.play>0){
        this.buffer[traje.play].stop()
    }
    traje.play = playid;
    this.buffer[playid].ready++
}

function Traje() {
    this.initialize.apply(this, arguments);
};
Traje.prototype = Object.create(Traje.prototype);
Traje.prototype.constructor = Traje;
Traje.prototype.initialize = function() {
   this.buffer=[]
   this.play=-1
   this.history={}
}

function Near() {
    this.initialize.apply(this, arguments);
}
Near.prototype = Object.create(Near.prototype);
Near.prototype.constructor = Near;
Near.prototype.initialize = function(name,traje,data) {
    this.id =  ++Conductor.id
    Conductor.buffer[this.id] = this
    this.data = data
    this.name = name
    this.traje = traje
    this.audio = new Tone.Player().toDestination()
    this.setVol(0)

    this.ready=0
    this.setMark(0);
    this.type = data.type
    this.volume = data.volume; 
    
    this.timeInit = performance.now();
    this.timeStop=0
    this.timePlay=0

    if (data.rate) this.setRate(data.rate)
    if (data.rever) this.setRever(data.rever)
    
    const src = `${Conductor.path}/${data.type}/${data.name}.ogg`
    this.audio.load(src).then(() => {this.start()})
}
// 音频已准备
Near.prototype.start = function() {
    this.duration = this.audio.buffer.duration; 
    this.realDuration = this.audio.buffer.duration / this.audio.playbackRate; 
    this.setLoop(this.data.loop);
    this.ready++
};
// 播放音频
Near.prototype.play = function() {
    this.ready=1
    let time = (Conductor.traje[this.traje].history[this.name]||this.data.startTime) % this.duration;
    if (this.audio.reverse) time = this.duration - time;
    this.timePlay = performance.now();
    this.audio.start("+0", time);
    
    this.setFadeIn(this.data.fade[0]);
    this.setFadeOut(this.data.fade[1]);
    this.setMark(1);
};
// 重启音频
Near.prototype.recover=function (){
    this.initTime = performance.now();
    this.playTime = performance.now();
    this.setFadeIn(this.data.fade[0]);
    this.setFadeOut(this.data.fade[1]);
    this.setMark(1);
}
// 停止音频
Near.prototype.stop=function (time){
    Conductor.traje[this.traje].history[this.name]=(performance.now()-this.playTime+this.fadeOut)/1000 * this.audio.playbackRate
    this.setMark(-1,time||performance.now())
}
// 设置播放标记和时间戳
Near.prototype.setMark = function(mark, time=performance.now()) {
    this.mark = mark;
    switch (mark) {
        case 1:this.fadeInTime = time - (this.fadeOut ? this.calcInCorr():0);break;
        case -1:this.fadeOutTime = time - (this.fadeIn ? this.calcOutCorr():0);break;
    }
};
Near.prototype.calcInCorr = function() {
    return this.fadeIn * Toolkit.inverseSinNum(Math.pow(this.volval/ this.data.volume, 1 / 4));
};
Near.prototype.calcOutCorr = function() {
    return this.fadeOut * Toolkit.inverseSinNum(1 - Math.pow((this.volval / this.data.volume), 1 / 4));
};
// 更新播放状态
Near.prototype.update = function(time) {
    switch (this.ready) {
        case 2:this.play();break;
    }
    switch (this.mark) {
        case 1:this.updateFadeIn(time);break;
        case -1:this.updateFadeOut(time);break;
    }
    if (this.mark > 0) {this.listenerFadeOut(time);}
};
// 监听是否需要自动淡出
Near.prototype.listenerFadeOut = function(time) {
    let t = (time - this.timePlay - this.timeStop) - (this.realDuration * 1000 - this.fadeOut);
    if (!this.audio.loop && t >= 0) {this.stop(performance.now() - t);}
};
// 设置淡出时间
Near.prototype.setFadeOut = function(time) {this.fadeOut = time * 1000;};
// 设置淡入时间
Near.prototype.setFadeIn = function(time) {this.fadeIn = time * 1000;};
Near.prototype.updateFadeIn = function(time) {
    if (this.fadeIn) {
        if (this.fadeIn >= time - this.fadeInTime) {
            const vol = Math.floor(this.data.volume * Math.pow(Toolkit.sinNum(this.fadeIn, time - this.fadeInTime), 4) * 10000);
            this.setVol(vol / 10000);
        } else {
            this.fadeInEnd();
        }
    }
};
Near.prototype.fadeInEnd = function() {
    this.setVol(this.data.volume);
    this.fadeIn = 0;
    this.mark = 2; // 设置状态标记为2（淡入结束，正常播放）
};
// 更新淡出效果
Near.prototype.updateFadeOut = function(time) {
    if (this.fadeOut) {
        if (this.fadeOut >= time - this.fadeOutTime) {
            const vol = Math.floor(this.data.volume * Math.pow(1 - Toolkit.sinNum(this.fadeOut, time - this.fadeOutTime), 4) * 10000);
            this.setVol(vol / 10000);
        } else {
            this.fadeOutEnd();
        }
    }
};
Near.prototype.fadeOutEnd = function() {
    this.setVol(0);
    this.dispose()
};
Near.prototype.dispose = function() {
    this.audio.dispose();
    delete Conductor.buffer[this.id];
    Conductor.traje[this.traje].play=0
    const buffers = Conductor.traje[this.traje].buffer;
    Conductor.traje[this.traje].history[this.name]=0
    const index = buffers.indexOf(this.id);
    if (index > -1) {buffers.splice(index, 1);}
    for (let key in this) {
        if (this.hasOwnProperty(key)) {
            delete this[key];
        }
    }
}

// 设置音量
Near.prototype.setVol = function(val) {
    this.volval = val;
    const tv = Conductor.trajeVolume[this.type]||0;
    const computedVolume = val * Conductor.volVolume * tv;
    this.audio.volume.value = 12 * Math.log10(computedVolume);
    this.audio.mute = computedVolume === 0;
};
// 设置播放速度
Near.prototype.setRate = function(val) {this.audio.playbackRate = val;}
// 设置正播或倒播
Near.prototype.setRever = function(val) {this.audio.reverse = val;}
// 设置播放循环
Near.prototype.setLoop = function(val) {if (val) {this.audio.loop = val;}}