function Conductor() {
    throw new Error("static class"); 
}
// 静态属性
Conductor.path = 'audio'; 
Conductor.volVolume = 1; 
Conductor.trajeVolume = { 
    bgm: 1, // 背景音乐
    bgs: 1, // 背景音效
    me: 1,  // 配音
    se: 1   // 声效
};
Conductor.traje = [];
Conductor.buffer = {}; 
Conductor.id = 0; 
// 播放音频方法
Conductor.play = function(id, traje = 100) {
    let data = $Audio[id]; 
    if (data) {
        if(!Conductor.traje[traje]) Conductor.traje[traje]={buffer:[],play:-1,history:{}}
        
        //未释放的
        let old=0
        for(let item of Conductor.traje[traje].buffer){if(this.buffer[item].name===id){old=item}}
        
        if(old){this.buffer[old].recover()}
        else {
            this.buffer[++this.id] = new Near(id, data, traje, this.id)
            Conductor.traje[traje].buffer.push(this.id)
        }
    }
};
// 更新播放缓冲区
Conductor.update = function() {
    const currentTime = performance.now();
    for (let item of Object.keys(Conductor.buffer)) {
        Conductor.buffer[item].update(currentTime); 
    }
    for (let item of Conductor.traje) {
        if (!item || !item.buffer || item.buffer.length === 0) continue;
        let {playid,playtime} = item.buffer.reduce((acc, id) => { 
            let bufferItem = this.buffer[id];
            if (bufferItem.initTime > bufferItem.stopTime && bufferItem.initTime > acc.playtime) {
                return { playid: id, playtime: bufferItem.initTime };
            }
            return acc;}, { playid: -1, playtime: 0 });
        if (playid !== item.play) this.trajePlay(item,playid)
        
    }
    setTimeout(()=>{this.update()},10)
};
Conductor.trajePlay=function (traje,playid){
    if(traje.play>0){
        this.buffer[traje.play].stop()
    }
    traje.play = playid;
    this.run=true
    this.buffer[playid].ready++
}


function Near() {
    this.initialize.apply(this, arguments);
}
Near.prototype = Object.create(Near.prototype);
Near.prototype.constructor = Near;
Near.prototype.initialize = function(name,data,traje,id) {
    this.audio = new Tone.Player().toDestination(); // 创建音频播放器
    this.audio.volume.value = 0; // 初始音量为0
    this.name = name
    this.traje = traje; // 音轨参数
    this.id = id
    this.ready=0
    this.data = data; // 音频数据
    this.mark = 0; // 播放标记，用于判断当前状态
    this.type = data.type; // 音频类型
    this.volume = data.volume; // 音频初始音量
    this.initTime = performance.now();
    this.stopTime=0
    // 设置音量和其他参数
    this.setVol(0);
    if (data.rate) this.setRate(data.rate); // 设置播放速度
    if (data.rever) this.setRever(data.rever); // 设置正播/倒播
    // 构建音频文件路径并加载音频
    const src = `${Conductor.path}/${data.type}/${data.name}.ogg`;
    this.audio.load(src).then(() => {
        this.start(); // 加载完成后开始播放
    });
};
// 开始播放音频
Near.prototype.start = function() {
    this.duration = this.audio.buffer.duration; // 音频原始时长
    this.realDuration = this.audio.buffer.duration / this.audio.playbackRate; // 根据播放速率计算的实际时长
    this.setLoop(this.data.loop); // 设置是否循环播放
    this.setMark(0);
    this.ready++
};
// 播放音频
Near.prototype.play = function() {
    this.ready=1
    let stime = (Conductor.traje[this.traje].history[this.name]||this.data.startTime) % this.duration; 
    if (this.audio.reverse) stime = this.duration - stime; 
    this.playTime = performance.now(); 
    this.stopTime = 0; 
    this.audio.start("+0", stime); 
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
        case 1:this.fadeInTime = time - (this.fadeOut ? this.calcInCorr() : 0);break;
        case -1:this.fadeOutTime = time- (this.fadeIn ? this.calcOutCorr() : 0);break;
    }
};
// 计算校正值
Near.prototype.calcInCorr = function() {
    return this.fadeIn * Toolkit.inverseSinNum(Math.pow(this.volval/ this.data.volume, 1 / 4));
};
Near.prototype.calcOutCorr = function() {
    return this.fadeOut * Toolkit.inverseSinNum(1 - Math.pow((this.volval / this.data.volume), 1 / 4));
};
// 设置淡出时间
Near.prototype.setFadeOut = function(time) {this.fadeOut = time * 1000;};
// 设置淡入时间
Near.prototype.setFadeIn = function(time) {this.fadeIn = time * 1000;};
// 更新播放状态
Near.prototype.update = function(time) {
    if(this.ready===2) this.play()
    switch (this.mark) {
        case 1:this.updateFadeIn(time);break;
        case -1:this.updateFadeOut(time);break;
    }
    if (this.mark > 0) {this.listenerFadeOut(time);}
};
// 更新淡入效果
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
// 淡入结束处理
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
// 淡出结束处理
Near.prototype.fadeOutEnd = function() {
    this.setVol(0);
    this.audio.dispose();
    delete Conductor.buffer[this.id];
    const trajeBuffer = Conductor.traje[this.traje].buffer;
    const index = trajeBuffer.indexOf(this.id);
    if (index > -1) {trajeBuffer.splice(index, 1);}
    for (let key in this) {
        if (this.hasOwnProperty(key)) {
            delete this[key];
        }
    }
};
// 监听是否需要自动淡出
Near.prototype.listenerFadeOut = function(time) {
    let t = (time - this.playTime - this.stopTime) - (this.realDuration * 1000 - this.fadeOut);
    if (!this.audio.loop && t >= 0) {this.stop(performance.now() - t);}
};
// 设置音量
Near.prototype.setVol = function(val) {
    this.volval = val;
    const tv = Conductor.trajeVolume[this.type];
    const computedVolume = val * Conductor.volVolume * tv;
    this.audio.volume.value = 12 * Math.log10(computedVolume); 
    this.audio.mute = computedVolume === 0; 
};
// 设置播放速度
Near.prototype.setRate = function(val) {this.audio.playbackRate = val;};
// 设置正播或倒播
Near.prototype.setRever = function(val) {this.audio.reverse = val;};
// 设置播放循环
Near.prototype.setLoop = function(val) {if (val) {this.audio.loop = val;}}