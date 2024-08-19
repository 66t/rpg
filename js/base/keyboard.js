function Keyboard() {throw new Error("static class");}
Keyboard.controlMapper = {};
Keyboard.down = new Array(256).fill(0);
Keyboard.up = new Array(256).fill(0);
Keyboard.state={}
Keyboard.time = 0;
Keyboard.repeatTime = 30;

Keyboard.install = function() {
    const data = this.controlMapper;
    
    data.tab = [9];
    data.start = [65];
    data.home = [83];
    data.select = [33];
    data.back = [34];
    data.a = [13, 32, 90];
    data.b = [88, 27, 45];
    data.x = [17, 18];
    data.y = [16];
    data.up = [38, 104];
    data.down = [40, 98];
    data.left = [37, 100];
    data.right = [39, 102];
    data.pageup = [33, 81];
    data.pagedown = [34, 87];

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('blur', this.onBlur.bind(this));
}
Keyboard.onKeyDown = function(arg) {
    const keyCode = arg.keyCode;
    if (!this.down[keyCode] || this.down[keyCode] < this.up[keyCode]) {
        this.down[keyCode] = this.time;
        this.up[keyCode] = this.time - 1;
    }
};
Keyboard.onKeyUp = function(arg) {
    const keyCode = arg.keyCode;
    if (this.down[keyCode] > this.up[keyCode]) {
        this.up[keyCode] = this.time;
        this.down[keyCode] = this.time - 1;
    }
};
Keyboard.onBlur = function() {
    this.down = [];
    this.up = [];
};
Keyboard.update = function() {
    this.time++;
    for (let key in this.controlMapper) {
        const controlMapper = this.controlMapper[key];
        if (!controlMapper) continue;
        let isPress = 0;
        let isPressed = false;
        let isLongPress = false;
        let isRelease = false;
        let dtime=this.time
        controlMapper.forEach(item => {
            if (this.down[item] > this.up[item]) {
                isPressed = true;
                if (!isPress&&this.down[item] === this.time - 1) {isPress = 1;}
                else isPress=2
                if(this.down[item]<dtime) dtime=this.down[item]
            }
            if (this.up[item] > this.down[item]) {
                isRelease = true;
                this.down[item] = 0; 
                this.up[item] = 0;
            }
        });
        if (this.time - dtime>0&&(this.time - dtime) % this.repeatTime === 0) {
            isLongPress = true;
        }
        if(isPressed||isPress) isRelease=false
        this.state[key] = [isPress===1, isPressed, isLongPress, isRelease];
    }
};
Keyboard.get=function (key,code){
    switch (code){
        case "long":
            return this.state[key][2];
        case "trigger":
            return this.state[key][0];
        case "release":
            return this.state[key][3];
        default:
            return this.state[key][1];
    }
}


function Mouse() {throw new Error("static class");}
Mouse.controlMapper = {};
Mouse.down = [0,0,0]
Mouse.up = [0,0,0]
Mouse.state={}
Mouse.time = 0;
Mouse.repeatTime = 30;
Mouse.cursor = World.cursor;
Mouse.wheel = {x:0,y:0,active:false};
Mouse.install = function() {
    const data = this.controlMapper;
    data.left = [0];
    data.whell = [1];
    data.right = [2];
    document.addEventListener('mouseup', this.onKeyUp.bind(this));
    document.addEventListener('mousedown', this.onKeyDown.bind(this));
    document.addEventListener('wheel', this.onWheel.bind(this));
}

Mouse.onWheel = function(event) {
    this.wheel.x += event.deltaX;
    this.wheel.y += event.deltaY;
};
Mouse.resetWheel = function(event) {
    if(Mouse.wheel.active) this.wheel = {x:0,y:0,active:false}
};
Mouse.onKeyDown = function(arg) {
    const keyCode = arg.button;
    if (!this.down[keyCode] || this.down[keyCode] < this.up[keyCode]) {
        this.down[keyCode] = this.time;
        this.up[keyCode] = this.time - 1;
    }
};
Mouse.onKeyUp = function(arg) {
    const keyCode = arg.button;
    if (this.down[keyCode] > this.up[keyCode]) {
        this.up[keyCode] = this.time;
        this.down[keyCode] = this.time - 1;
    }
};
Mouse.onBlur = function() {
    this.down = [];
    this.up = [];
};
Mouse.update = function() {
    this.time++;
    for (let key in this.controlMapper) {
        const controlMapper = this.controlMapper[key];
        if (!controlMapper) continue;

        let isPress = false;
        let isPressed = false;
        let isLongPress = false;
        let isRelease = false;

        controlMapper.forEach(item => {
            if (this.down[item] > this.up[item]) {
                isPressed = true;
                if (this.down[item] === this.time - 1) {isPress = true;}
                if ((this.time - this.down[item]) % this.repeatTime === 0) {isLongPress = true;}
            }

            if (this.up[item] > this.down[item]) {
                isRelease = true;
                this.down[item] = 0;
                this.up[item] = 0;
            }
        })
        this.state[key] = [isPress, isPressed, isLongPress, isRelease];
    }
};
Mouse.get=function (key,code){
    switch (code){
        case "long":
            return this.state[key][2]
        case "trigger":
            return this.state[key][0]
        case "release":
            return this.state[key][3]
        default:
            return this.state[key][1]
    }
}

Mouse.install();
Keyboard.install();
