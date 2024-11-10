function Weaver1() {
    this.initialize(...arguments);
}

Weaver1.prototype = Object.create(Weaver.prototype);
Weaver1.prototype.constructor = Weaver1;

Weaver1.prototype.initialize = function() {
    Weaver.prototype.initialize.call(this);
};

Weaver1.prototype.stateStore = function() {
    Weaver.prototype.stateStore.call(this);
    this.stateValue(1,"t2",[1,1])
};

Weaver1.prototype.install = function() {
    Weaver.prototype.install.call(this);
    this._window["t1"] = new CottonA(this);
    this._window["t1"].start();
};

Weaver1.prototype.execute = function() {
    Weaver.prototype.execute.call(this);
    this.modifyState(1);
};


function CottonA() {
    this.initialize(...arguments);
}
CottonA.prototype = Object.create(Cotton.prototype);
CottonA.prototype.constructor = CottonA;
CottonA.prototype.initialize = function(orgin) {
    Cotton.prototype.initialize.call(this, orgin);
};
CottonA.prototype.update = function() {
    Cotton.prototype.update.call(this);
};
CottonA.prototype.initImage = function() {
    this.img={
        "图像":["ui/data"],
        "地图":["ui/data"]
    }
}
CottonA.prototype.initAdorn=function (){
    for (let key in Toolkit) {
        if (typeof Toolkit[key] === 'function') {
            console.log(key);
        }
    }
    this.setAdorn("图像","图像","",{},"100%","100%",0,0,0,1,0.5,20)
}


