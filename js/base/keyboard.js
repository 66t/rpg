/**
 * 提供键盘事件处理的静态类。
 * @constructor
 */
function Keyboard() { throw new Error("static class"); }

/**
 * 控制键的映射配置对象。
 * @type {Object}
 */
Keyboard.controlMapper = {};

/**
 * 存储按键被按下的时间。
 * @type {number[]}
 */
Keyboard.down = new Array(256).fill(0);

/**
 * 存储按键被释放的时间。
 * @type {number[]}
 */
Keyboard.up = new Array(256).fill(0);

/**
 * 存储每个按键的状态。
 * @type {Object}
 */
Keyboard.state = {};

/**
 * 当前时间计数器。
 * @type {number}
 */
Keyboard.time = 0;

/**
 * 按键重复时间间隔。
 * @type {number}
 */
Keyboard.repeatTime = 30;

/**
 * 初始化键盘事件监听器和按键映射。
 */
Keyboard.install = function() {
    const data = this.controlMapper;
    data.tab = [9];
    data.start = [65];
    data.home = [83];
    data.back = [8];
    data.a = [13, 32, 90];
    data.b = [88, 27, 45];
    data.select = [17];
    data.x = [18];
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
};

/**
 * 处理按键按下事件。
 * @param {KeyboardEvent} arg - 按键事件对象。
 */
Keyboard.onKeyDown = function(arg) {
    const keyCode = arg.keyCode;
    if (!this.down[keyCode] || this.down[keyCode] < this.up[keyCode]) {
        this.down[keyCode] = this.time;
        this.up[keyCode] = this.time - 1;
    }
};

/**
 * 处理按键释放事件。
 * @param {KeyboardEvent} arg - 按键事件对象。
 */
Keyboard.onKeyUp = function(arg) {
    const keyCode = arg.keyCode;
    if (this.down[keyCode] > this.up[keyCode]) {
        this.up[keyCode] = this.time;
        this.down[keyCode] = this.time - 1;
    }
};

/**
 * 处理窗口失去焦点事件，重置按键状态。
 */
Keyboard.onBlur = function() {
    this.down = [];
    this.up = [];
};

/**
 * 更新按键状态。
 */
Keyboard.update = function() {
    this.time++;
    for (let key in this.controlMapper) {
        const controlMapper = this.controlMapper[key];
        if (!controlMapper) continue;

        let isPress = 0;
        let isPressed = false;
        let isLongPress = false;
        let isRelease = false;
        let dtime = this.time;

        controlMapper.forEach(item => {
            if (this.down[item] > this.up[item]) {
                isPressed = true;
                if (!isPress && this.down[item] === this.time - 1) { isPress = 1; }
                else isPress = 2;
                if (this.down[item] < dtime) dtime = this.down[item];
            }
            if (this.up[item] > this.down[item]) {
                isRelease = true;
                this.down[item] = 0;
                this.up[item] = 0;
            }
        });

        if (this.time - dtime > 0 && (this.time - dtime) % this.repeatTime === 0) {
            isLongPress = true;
        }

        if (isPressed || isPress) isRelease = false;
        this.state[key] = [isPress === 1, isPressed, isLongPress, isRelease];
    }
};

/**
 * 获取按键状态。
 * @param {string} key - 按键的名称。
 * @param {string} code - 状态类型（"long"、"trigger"、"release" 或其他）。
 * @returns {boolean} 按键状态。
 */
Keyboard.get = function (key, code) {
    switch (code) {
        case "long":
            return this.state[key]?this.state[key][2]:false;
        case "trigger":
            return this.state[key]?this.state[key][0]:false;
        case "release":
            return this.state[key]?this.state[key][3]:false;
        default:
            return this.state[key]?this.state[key][1]:false;
    }
};

/**
 * 提供鼠标事件处理的静态类。
 * @constructor
 */
function Mouse() { throw new Error("static class"); }

/**
 * 控制鼠标按键的映射配置对象。
 * @type {Object}
 */
Mouse.controlMapper = {};

/**
 * 存储鼠标按键被按下的时间。
 * @type {number[]}
 */
Mouse.down = [0, 0, 0];

/**
 * 存储鼠标按键被释放的时间。
 * @type {number[]}
 */
Mouse.up = [0, 0, 0];

/**
 * 存储每个鼠标按键的状态。
 * @type {Object}
 */
Mouse.state = {};

/**
 * 当前时间计数器。
 * @type {number}
 */
Mouse.time = 0;

/**
 * 鼠标重复时间间隔。
 * @type {number}
 */
Mouse.repeatTime = 30;

/**
 * 鼠标光标的位置。
 * @type {Object}
 */
Mouse.cursor = World.cursor;

/**
 * 鼠标滚轮的状态。
 * @type {Object}
 */
Mouse.wheel = {y: 0, state: 0};

/**
 * 初始化鼠标事件监听器和按键映射。
 */
Mouse.install = function() {
    const data = this.controlMapper;
    data.L = [0];
    data.R = [2];
    data.wheel = [1];
    document.addEventListener('mouseup', this.onKeyUp.bind(this));
    document.addEventListener('mousedown', this.onKeyDown.bind(this));
    document.addEventListener('wheel', this.onWheel.bind(this));
};

/**
 * 处理鼠标滚轮事件。
 * @param {WheelEvent} event - 滚轮事件对象。
 */
Mouse.onWheel = function(event) {
    this.wheel.y += event.deltaY;
};

/**
 * 重置鼠标滚轮状态。
 */
Mouse.resetWheel = function() {
    if (Mouse.wheel.active) this.wheel = {y: 0, state: 0};
};

/**
 * 处理鼠标按下事件。
 * @param {MouseEvent} arg - 鼠标事件对象。
 */
Mouse.onKeyDown = function(arg) {
    const keyCode = arg.button;
    if (!this.down[keyCode] || this.down[keyCode] < this.up[keyCode]) {
        this.down[keyCode] = this.time;
        this.up[keyCode] = this.time - 1;
    }
};

/**
 * 处理鼠标释放事件。
 * @param {MouseEvent} arg - 鼠标事件对象。
 */
Mouse.onKeyUp = function(arg) {
    const keyCode = arg.button;
    if (this.down[keyCode] > this.up[keyCode]) {
        this.up[keyCode] = this.time;
        this.down[keyCode] = this.time - 1;
    }
};

/**
 * 处理窗口失去焦点事件，重置鼠标状态。
 */
Mouse.onBlur = function() {
    this.down = [0, 0, 0];
    this.up = [0, 0, 0];
};

/**
 * 更新鼠标状态。
 */
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
                if (this.down[item] === this.time - 1) { isPress = true; }
                if ((this.time - this.down[item]) % this.repeatTime === 0) { isLongPress = true; }
            }

            if (this.up[item] > this.down[item]) {
                isRelease = true;
                this.down[item] = 0;
                this.up[item] = 0;
            }
        });
        this.state[key] = [isPress, isPressed, isLongPress, isRelease];
    }
    Mouse.wheel.state = Mouse.wheel.active === 0 ? Math.sign(Mouse.wheel.y) : 0;
    Mouse.wheel.y=0
};


/**
 * 获取鼠标状态。
 * @param {number} key - 按键的名称。
 * @param {string} code - 状态类型（"long"、"trigger"、"release" 或其他）。
 * @returns {boolean} 鼠标状态。
 */
Mouse.get = function (key, code) {
    switch (code) {
        case "long":
            return this.state[key]?this.state[key][2]:false;
        case "trigger":
            return this.state[key]?this.state[key][0]:false;
        case "release":
            return this.state[key]?this.state[key][3]:false;
        default:
            return this.state[key]?this.state[key][1]:false;
    }
};