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
    this.stateValue(1,"t1",[1,1])
};

Weaver1.prototype.install = function() {
    Weaver.prototype.install.call(this);
    this._window["t1"] = new CottonA(this);
    this._window["t1"].start();
    this._window["t2"] = new CottonB(this);
    this._window["t2"].start();
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
    this.r=new Rhythm(0,0,1000,0)
    this.r.addWave("add",'sqr',0,300,false,100,1,1,0.5,0,0)
    this.bitmap=new Bitmap(World.canvasWidth,World.canvasHeight)
    this.p=[]
    Graffiti.setBitmap(this.bitmap);
    Graffiti.setLineStyle(5);
};
CottonA.prototype.update = function() {
    Cotton.prototype.update.call(this);
    Graffiti.clearCtx()
    this.r.update();
    console.log(this.r.getVal())
    this.p.push(this.r.getVal() + 1100);
    this.r.update();
    this.p.push(this.r.getVal() + 1100);
    this.r.update();
    this.p.push(this.r.getVal() + 1100);
    
    
    if (this.p.length > 1000) this.p.shift();
    for (let i = 1; i < this.p.length; i++) {
        Graffiti.drawLine([(i-1)*(World.canvasWidth/1000), this.p[i-1]], [i*(World.canvasWidth/1000), this.p[i]], 0);
    }
    Graffiti.update()
};




function CottonB() {
    this.initialize(...arguments);
}
CottonB.prototype = Object.create(Cotton.prototype);
CottonB.prototype.constructor = CottonB;
CottonB.prototype.initialize = function(orgin) {
    Cotton.prototype.initialize.call(this, orgin);
};