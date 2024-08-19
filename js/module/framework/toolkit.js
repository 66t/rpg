/**
 * 克隆数组，返回一个新数组，包含原数组的所有元素。
 *
 * @memberof Array.prototype
 * @returns {Array} 克隆后的新数组。
 */
Array.prototype.clone = function() {
    return [...this];
};
/**
 * 检查数组是否包含给定元素。
 *
 * @memberof Array.prototype
 * @param {any} element - 要搜索的元素。
 * @returns {boolean} 如果数组包含给定元素，则返回 true。
 * @deprecated 应使用 includes() 方法。
 */
Array.prototype.contains = function(element) {
    return this.includes(element);
};
/**
 * 检查两个数组是否相等。
 *
 * @memberof Array.prototype
 * @param {Array} array - 要比较的数组。
 * @returns {boolean} 如果两个数组相等，则返回 true。
 */
Array.prototype.equals = function(array) {
    if (!array || this.length !== array.length) return false;
    return this.every((value, index) =>
        Array.isArray(value) && Array.isArray(array[index])
            ? value.equals(array[index])
            : value === array[index]
    );
};
/**
 * 从数组中移除给定元素的所有实例。
 *
 * @memberof Array.prototype
 * @param {any} element - 要移除的元素。
 * @returns {Array} 移除元素后的数组。
 */
Array.prototype.remove = function(element) {
    return this.filter(el => el !== element);
};


/**
 * 生成一个 0 到 max 之间的随机整数。
 *
 * @memberof Math
 * @param {number} max - 最大值（不包括）。
 * @returns {number} 生成的随机整数。
 */
Math.randomInt = function(max) {
    return Math.floor(Math.random() * max);
};
/**
 * 将数字限制在指定范围内。
 *
 * @memberof Number.prototype
 * @param {number} min - 最小值。
 * @param {number} max - 最大值。
 * @returns {number} 限制在范围内的数字。
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
/**
 * 计算数字的模（取余）值，结果始终为非负数。
 *
 * @memberof Number.prototype
 * @param {number} n - 模数。
 * @returns {number} 模值。
 */
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};
/**
 * 用前导零填充数字，使其达到指定长度。
 *
 * @memberof Number.prototype
 * @param {number} length - 目标长度。
 * @returns {string} 填充后的字符串。
 */
Number.prototype.padZero = function(length) {
    return String(this).padZero(length);
};
/**
 * 检查字符串是否包含给定子字符串。
 *
 * @memberof String.prototype
 * @param {string} string - 要搜索的子字符串。
 * @returns {boolean} 如果包含子字符串，则返回 true。
 */
String.prototype.contains = function(string) {
    return this.includes(string);
};
/**
 * 使用参数格式化字符串。
 *
 * @memberof String.prototype
 * @param {...any} arguments - 替换字符串中占位符的参数。
 * @returns {string} 格式化后的字符串。
 */
String.prototype.format = function() {
    return this.replace(/%(\d+)/g, (match, number) => arguments[number - 1] || match);
};
/**
 * 获取字符串的长度，考虑双字节字符（如中文）。
 *
 * @memberof String.prototype
 * @returns {number} 字符串的长度。
 */
String.prototype.getLen = function() {
    return [...this].reduce((len, char) => len + (char.charCodeAt(0) > 255 ? 2 : 1), 0);
};
/**
 * 在字符串的指定位置插入新字符串，或删除一定数量的字符。
 *
 * @memberof String.prototype
 * @param {number} start - 开始的位置。
 * @param {number} del - 要删除的字符数。
 * @param {string} [newStr] - 要插入的新字符串。
 * @returns {string} 修改后的字符串。
 */
String.prototype.splice = function(start, del, newStr) {
    return this.slice(0, start) + (newStr || "") + this.slice(start + del);
};
/**
 * 用前导零填充字符串，使其达到指定长度。
 *
 * @memberof String.prototype
 * @param {number} length - 目标长度。
 * @returns {string} 填充后的字符串。
 */
String.prototype.padZero = function(length) {
    return this.padStart(length, "0");
};

/**
 * 静态工具类，包含各种实用方法。
 *
 * @class Toolkit
 * @throws {Error} 抛出错误，表示这是一个静态类，不能实例化。
 */
function Toolkit() {
    throw new Error("static class");
}
// 用于加密和解密的密钥
Toolkit.Key="e0cbbb04903a2d704e980c9daa321a7bbd0c915967c451c688ca8906a2b226a8"
/**
 * 生成一个随机的256位（32字节）密钥，并以十六进制字符串的形式返回
 *
 * @memberof Toolkit
 * @returns {string} 随机生成的256位密钥，十六进制格式
 */
Toolkit.getKey = function() {return CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.random(32))}
/**
 * 使用pako库压缩字符串
 *
 * @memberof Toolkit
 * @param {string} string - 要压缩的字符串
 * @returns {string} 压缩后的字符串
 */
Toolkit.deflate=function (string){
    return pako.deflate(string, {to: 'string'})
}
/**
 * 使用pako库解压字符串
 *
 * @memberof Toolkit
 * @param {string} string - 要解压的字符串
 * @returns {string} 解压后的字符串
 */
Toolkit.inflate=function (string){
    return pako.inflate(string, {to: 'string'})
}
/**
 * 使用AES算法和预定义的密钥加密字符串，模式为OFB
 *
 * @memberof Toolkit
 * @param {string} string - 要加密的字符串
 * @returns {string} 加密后的字符串，base64格式
 */
Toolkit.encrypt=function (string){
    return CryptoJS.AES.encrypt(string,Toolkit.Key,{mode:CryptoJS.mode.OFB}).toString()
}
/**
 * 使用AES算法和预定义的密钥解密字符串，模式为OFB
 *
 * @memberof Toolkit
 * @param {string} string - 要解密的字符串
 * @returns {string} 解密后的字符串，UTF-8格式
 */
Toolkit.decrypt=function (string){
    return CryptoJS.AES.decrypt(string,Toolkit.Key,{mode:CryptoJS.mode.OFB}).toString(CryptoJS.enc.Utf8)
}
/**
 * 检查当前环境是否为 NW.js。
 *
 * @memberof Toolkit
 * @returns {boolean} 如果当前环境为 NW.js，则返回 true；否则返回 false。
 */
Toolkit.isNwjs = function() {
    return typeof require === "function" && typeof process === "object";
};
/**
 * 检查当前页面是否是从本地文件系统加载的。
 *
 * @memberof Toolkit
 * @returns {boolean} 如果当前页面是从本地文件系统加载的，则返回 true；否则返回 false。
 */
Toolkit.isLocal = function() {
    return window.location.protocol === "file:";
};
/**
 * 对 URI 组件进行编码，但保留斜杠（"/"）字符。
 *
 * @memberof Toolkit
 * @param {string} str - 要编码的字符串。
 * @returns {string} 编码后的字符串。
 */
Toolkit.encodeURI = function(str) {
    return encodeURIComponent(str).replace(/%2F/g, "/");
};
/**
 * 转义字符串中的 HTML 特殊字符，以防止 XSS 攻击。
 *
 * @memberof Toolkit
 * @param {string} str - 要转义的字符串。
 * @returns {string} 转义后的字符串。
 */
Toolkit.escapeHtml = function(str) {
    const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    return String(str).replace(/[&<>"'/]/g, match => entityMap[match]);
};
/**
 * 将一个数从 m 进制转换为 n 进制。
 *
 * @param {string|number} num - 要转换的数。
 * @param {number} m - 当前进制。
 * @param {number} n - 目标进制。
 * @returns {string} 转换后的字符串表示的数。
 */
Toolkit.radixNum = function(num, m = 10, n = 10) {
    return parseInt(num, m).toString(n);
};
/**
 * 将 RGBA 颜色值转换为十六进制表示。
 *
 * @param {number} r - 红色分量 (0-255)。
 * @param {number} g - 绿色分量 (0-255)。
 * @param {number} b - 蓝色分量 (0-255)。
 * @param {number} a - 透明度分量 (0-255)。
 * @returns {string} 十六进制表示的颜色值。
 */
Toolkit.rpgaReduce = function(r, g, b, a) {
    const toHex = (value) => this.radixNum(Math.min(value, 255), 10, 16).padStart(2, '0');
    return `${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
};
/**
 * 计算两个数的最大公约数。
 *
 * @param {number} a - 第一个数。
 * @param {number} b - 第二个数。
 * @returns {number} 最大公约数。
 */
Toolkit.gcd = function(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
};
/**
 * 计算两个数的最小公倍数。
 *
 * @param {number} a - 第一个数。
 * @param {number} b - 第二个数。
 * @returns {number} 最小公倍数。
 */
Toolkit.lcm = function(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
};
/**
 * 计算 a 的 b 次根。
 *
 * @param {number} a - 被开方数。
 * @param {number} b - 根指数。
 * @returns {number} a 的 b 次根。
 */
Toolkit.root = (a, b) => Math.pow(Math.abs(a), 1 / b);
/**
 * 计算以 b 为底的 a 的对数。
 *
 * @param {number} a - 真数。
 * @param {number} b - 底数。
 * @returns {number} 以 b 为底的 a 的对数。
 */
Toolkit.bottnum = (a, b) => Math.log(a) / Math.log(b);
/**
 * 根据角度和距离计算新的坐标。
 *
 * @param {Object} dual - 初始坐标，包含 x 和 y 属性。
 * @param {number} angle - 角度（弧度）。
 * @param {number} d - 距离。
 * @returns {Object} 新的坐标，包含 x 和 y 属性。
 */
Toolkit.azimuth = function(point, angle, distance) {
    return {
        x: point.x + distance * Math.cos(angle),
        y: point.y + distance * Math.sin(angle)
    };
}
/**
 * 计算两点之间的角度（0 到 360 度）。
 *
 * @param {number} x1 - 第一个点的 x 坐标。
 * @param {number} y1 - 第一个点的 y 坐标。
 * @param {number} x2 - 第二个点的 x 坐标。
 * @param {number} y2 - 第二个点的 y 坐标。
 * @returns {number} 两点之间的角度。
 */
Toolkit.calcAngle = function(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    return angle < 0 ? angle + 360 : angle;
};
/**
 * 计算两点之间的欧几里得距离。
 *
 * @param {number} x1 - 第一个点的 x 坐标。
 * @param {number} y1 - 第一个点的 y 坐标。
 * @param {number} x2 - 第二个点的 x 坐标。
 * @param {number} y2 - 第二个点的 y 坐标。
 * @returns {number} 两点之间的距离。
 */
Toolkit.distanceEucle = function(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
};
/**
 * 计算两点之间的曼哈顿距离。
 *
 * @param {number} x1 - 第一个点的 x 坐标。
 * @param {number} y1 - 第一个点的 y 坐标。
 * @param {number} x2 - 第二个点的 x 坐标。
 * @param {number} y2 - 第二个点的 y 坐标。
 * @returns {number} 两点之间的距离。
 */
Toolkit.distanceManh = function(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};
/**
 * 将分数约简。
 *
 * @param {number} son - 分子。
 * @param {number} mum - 分母。
 * @returns {Array} 约简后的分子和分母数组。
 */
Toolkit.simplifyFraction = function(numerator, denominator) {
    const gcd = this.gcd(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
};
/**
 * 将小数转换为分数表示。
 *
 * @param {number} num - 要转换的小数。
 * @returns {Array} 分子和分母数组。
 */
Toolkit.decimalToFraction = function(decimal) {
    const [integerPart, decimalPart] = decimal.toString().split('.');
    if (!decimalPart) return [parseInt(integerPart, 10), 1];
    const denominator = Math.pow(10, decimalPart.length);
    const numerator = parseInt(decimalPart, 10) + parseInt(integerPart, 10) * denominator;
    return this.simplifyFraction(numerator, denominator);
};

/**
 * 线性插值函数。
 *
 * @memberof Toolkit
 * @param {number} start - 起始值。
 * @param {number} end - 结束值。
 * @param {number} t - 插值因子（0 到 1）。
 * @returns {number} 插值结果。
 */
Toolkit.lerp = function(start, end, t) {
    return start + (end - start) * t;
};
/**
 * 计算二维向量的点积。
 *
 * @memberof Toolkit
 * @param {number} x1 - 第一个向量的 x 分量。
 * @param {number} y1 - 第一个向量的 y 分量。
 * @param {number} x2 - 第二个向量的 x 分量。
 * @param {number} y2 - 第二个向量的 y 分量。
 * @returns {number} 点积。
 */
Toolkit.dotProduct = function(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
};
/**
 * 计算二维向量的叉积。
 *
 * @memberof Toolkit
 * @param {number} x1 - 第一个向量的 x 分量。
 * @param {number} y1 - 第一个向量的 y 分量。
 * @param {number} x2 - 第二个向量的 x 分量。
 * @param {number} y2 - 第二个向量的 y 分量。
 * @returns {number} 叉积。
 */
Toolkit.crossProduct = function(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
};
/**
 * 获取前 num 个素数。
 *
 * @memberof Toolkit
 * @param {number} num - 要获取的素数的数量。
 * @returns {Array} 前 num 个素数组成的数组。
 */
Toolkit.angelPrime = function(num) {
    const arr = [2, 3];
    let i = 5;
    while (arr.length < num) {
        if (!arr.some(n => i % n === 0 && n * n <= i)) {
            arr.push(i);
        }
        i += i % 6 === 1 ? 4 : 2;
    }
    return arr;
};
/**
 * 生成一个服从正态分布的随机数。
 *
 * @memberof Toolkit
 * @returns {number} 随机数。
 */
Toolkit.normalRandom = function(mu, sigma) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mu + z * sigma;
};
/**
 * 检查一个值是否为数字。
 *
 * @memberof Toolkit
 * @param {*} num - 要检查的值。
 * @returns {boolean} 如果是数字则返回 true，否则返回 false。
 */
Toolkit.isNum = function(num) {
    return num !== null && num !== '' && !isNaN(num);
};
/**
 * 解析骰子表达式并计算结果。
 *
 * @memberof Toolkit
 * @param {string} s - 骰子表达式（如 "3d6"）。
 * @returns {number} 骰子总和。
 */
Toolkit.D = function(s) {
    const [numDice, numSides] = s.match(/(\d+)d(\d+)/).slice(1, 3).map(Number);
    let total = 0;
    for (let k = 1; k <= numDice; k++) {
        total += Math.floor(Math.random() * numSides) + 1;
    }
    return total;
};
/**
 * 正弦值。
 *
 * @memberof Toolkit
 * @param {number} max - 最大值。
 * @param {number} i - 索引。
 * @returns {number} 计算结果。
 */
Toolkit.sinNum = function(max, i) {
    return Math.sin((Math.PI / 2) / max * i);
};
/**
 * 将长度字符串转换为具体数值。
 *
 * @memberof Toolkit
 * @param {string|number} num - 长度字符串或数值。
 * @returns {number} 转换后的数值。
 */
Toolkit.lengthNum = function(num) {
    try {
        if (isNaN(num)) {
            if (num.includes("w")) {
                const [a, b = 0] = num.split("w").map(parseFloat);
                return a * 0.01 * Graphics.width + b;
            } else if (num.includes("h")) {
                const [a, b = 0] = num.split("h").map(parseFloat);
                return a * 0.01 * Graphics.height + b;
            } else {
                return 0;
            }
        } else {
            return parseFloat(num);
        }
    } catch (e) {
        return 0;
    }
};
/**
 * 将角度转换为弧度。
 *
 * @memberof Toolkit
 * @param {number} degrees - 角度值。
 * @returns {number} 弧度值。
 */
Toolkit.toRadians = function(degrees) {
    return degrees * Math.PI / 180;
};
/**
 * 将弧度转换为角度。
 *
 * @memberof Toolkit
 * @param {number} radians - 弧度值。
 * @returns {number} 角度值。
 */
Toolkit.toDegrees = function(radians) {
    return radians * 180 / Math.PI;
};
/**
 * 计算多个点的相对位置。
 *
 * @memberof Toolkit
 * @param {Array<number>} point - 初始点的坐标 [x, y]。
 * @param {Array<number>} angle - 角度数组（单位：度）。每个角度将被转换为弧度，用于计算相应的目标位置。
 * @param {Array<number>} distance - 距离数组，每个距离对应一个角度，表示从初始点到目标点的距离。
 * @returns {Array<Array<number>>} 返回目标点的坐标数组，每个目标点坐标为 [x, y]。
 */
Toolkit.calculatePositions = function(point, angle, distance) {
    return angle.map((ang, i) => {
        let {x, y} = Toolkit.azimuth({x: point[0], y: point[1]}, Toolkit.toRadians(ang), distance[i]);
        return [x, y];
    });
}
/**
 * 获取某个位上的值。
 *
 * @memberof Toolkit
 * @param {number} num - 数值。
 * @param {number} bit - 位索引。
 * @returns {number} 位上的值（0 或 1）。
 */
Toolkit.atBit = function(num, bit) {
    return (num >> bit) & 1;
};
/**
 * 设置某个位上的值。
 *
 * @memberof Toolkit
 * @param {number} num - 数值。
 * @param {number} bit - 位索引。
 * @param {boolean} bool - 设置的值（true 或 false）。
 * @returns {number} 修改后的数值。
 */
Toolkit.setBit = function(num, bit, bool) {
    return bool ? (num | (1 << bit)) : (num & ~(1 << bit));
};
/**
 * 生成数组的所有组合。
 *
 * @memberof Toolkit
 * @param {Array} array - 原数组。
 * @param {number} s - 组合的长度。
 * @returns {Array} 组合的数组。
 */
Toolkit.combinations = function(array, s) {
    const result = [];
    const length = array.length;
    if (s <= 0 || s > length) return result;

    const indices = Array.from({ length: s }, (_, i) => i);
    while (indices[0] <= length - s) {
        result.push(indices.map(i => array[i]));
        let i = s - 1;
        while (i >= 0 && indices[i] === i + length - s) i--;
        if (i < 0) break;
        indices[i]++;
        for (let j = i + 1; j < s; j++) {
            indices[j] = indices[j - 1] + 1;
        }
    }
    return result;
};
/**
 * 生成数组的所有排列。
 *
 * @memberof Toolkit
 * @param {Array} array - 原数组。
 * @returns {Array} 排列的数组。
 */
Toolkit.permute = function(array) {
    const result = [];
    const n = array.length;
    result.push(array.slice());

    let i = 0;
    let c = Array(n).fill(0);

    while (i < n) {
        if (c[i] < i) {
            if (i % 2 === 0) {
                [array[0], array[i]] = [array[i], array[0]];
            } else {
                [array[c[i]], array[i]] = [array[i], array[c[i]]];
            }
            result.push(array.slice());
            c[i]++;
            i = 0;
        } else {
            c[i] = 0;
            i++;
        }
    }
    return result;
};
/**
 * 计算多个数组的笛卡尔积。
 *
 * @memberof Toolkit
 * @param {...Array} arrays - 需要进行笛卡尔积的多个数组。
 * @returns {Array[]} 包含所有组合的数组。
 */
Toolkit.cartesianProduct = function(...arrays) {
    return arrays.reduce((acc, curr) => {
        return acc.flatMap(a => curr.map(b => [...a, b]))
    }, [[]]);
};

/**
 * 创建一个填充特定值的数组。
 *
 * @memberof Toolkit
 * @param {number} num - 数组长度。
 * @param {*} item - 填充值。
 * @returns {Array} 填充后的数组。
 */
Toolkit.fillArray = function(num, item) {
    return Array(num).fill(item);
};
/**
 * 反转字符串。
 *
 * @memberof Toolkit
 * @param {string} str - 原字符串。
 * @returns {string} 反转后的字符串。
 */
Toolkit.stringReverse = function(str) {
    return str.split("").reverse().join("");
};
/**
 * 快速排序算法。
 *
 * @memberof Toolkit
 * @param {Array} arr - 原数组。
 * @returns {Array} 排序后的数组。
 */
Toolkit.quickSort = function(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr.splice(Math.floor(arr.length / 2), 1)[0];
    const left = [], right = [];
    for (const val of arr) {
        (val < pivot ? left : right).push(val);
    }
    return Toolkit.quickSort(left).concat(pivot, Toolkit.quickSort(right));
};

/**
 * 计数排序算法。
 *
 * @memberof Toolkit
 * @param {Array} arr - 原数组。
 * @returns {Array} 排序后的数组。
 */
Toolkit.countingSort = function(arr) {
    if (arr.length <= 1) return arr;
    const min = Math.min(...arr);
    const count = [], result = [];
    for (const num of arr) {
        count[num - min] = (count[num - min] || 0) + 1;
    }
    for (let i = 0; i < count.length; i++) {
        while (count[i]-- > 0) {
            result.push(i + min);
        }
    }
    return result;
};

/**
 * 随机打乱数组。
 *
 * @memberof Toolkit
 * @param {Array} arr - 原数组。
 * @returns {Array} 打乱后的数组。
 */
Toolkit.shuffleArr = function(arr) {
    if (!Array.isArray(arr)) return [];
    const newArr = arr.slice(); 
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};
/**
 * 合并两个数组并去重。
 *
 * @memberof Toolkit
 * @param {Array} arr1 - 第一个数组。
 * @param {Array} arr2 - 第二个数组。
 * @returns {Array} 合并后的数组。
 */
Toolkit.union = function(arr1, arr2) {
    return Array.from(new Set([...arr1, ...arr2]));
};
/**
 * 获取两个数组的交集。
 *
 * @memberof Toolkit
 * @param {Array} arr1 - 第一个数组。
 * @param {Array} arr2 - 第二个数组。
 * @returns {Array} 交集数组。
 */
Toolkit.inter = function(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(x => set2.has(x));
};
/**
 * 获取两个数组的差集。
 *
 * @memberof Toolkit
 * @param {Array} arr1 - 第一个数组。
 * @param {Array} arr2 - 第二个数组。
 * @returns {Array} 差集数组。
 */
Toolkit.diff = function(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(x => !set2.has(x));
};
/**
 * 判断一个数是否为质数。
 * @memberof Toolkit
 * @param {number} num - 要判断的数。
 * @returns {boolean} 如果是质数返回 true，否则返回 false。
 */
Toolkit.isPrime = function(num) {
    if (num <= 1) {return false;}
    if (num <= 3) {return true;}
    if (num % 2 === 0 || num % 3 === 0) {return false;}
    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) {return false;}
        i += 6;
    }
    return true;
};
/**
 * 质因数分解
 *
 * @memberof Toolkit
 * @param {number} num - 要拆分的整数。
 * @returns {Array} 质数数组
 */
Toolkit.factorizationPrimes = function(num) {
    const result = [];
    let factor = 2;
    while (factor * factor <= num) {
        while (num % factor === 0) {
            result.push(factor);
            num /= factor;
        }
        factor++;
    }
    if (num > 1) {
        result.push(num);
    }
    return result;
};

/**
 * 计算平均值。
 *
 * @memberof Toolkit
 * @param {number[]} data - 数据数组。
 * @returns {number} 平均值。
 */
Toolkit.statMean = function(data) {
    const n = data.length;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / n;
};

/**
 * 计算中位数。
 *
 * @memberof Toolkit
 * @param {number[]} data - 数据数组。
 * @returns {number} 中位数。
 */
Toolkit.statMedian = function(data) {
    const sortedData = data.slice().sort((a, b) => a - b);
    const n = sortedData.length;
    if (n % 2 === 0) {
        // 如果数据个数是偶数，取中间两个数的平均值
        const mid = n / 2;
        return (sortedData[mid - 1] + sortedData[mid]) / 2;
    } else {
        // 如果数据个数是奇数，直接取中间的数
        const mid = Math.floor(n / 2);
        return sortedData[mid];
    }
};

/**
 * 计算标准差。
 *
 * @memberof Toolkit
 * @param {number[]} data - 数据数组。
 * @returns {number} 标准差。
 */
Toolkit.statStdDev = function(data) {
    const n = data.length;
    const meanVal = Toolkit.mean(data);
    const variance = data.reduce((acc, val) => acc + Math.pow(val - meanVal, 2), 0) / n;
    return Math.sqrt(variance);
};

/**
 * 计算偏度。
 *
 * @memberof Toolkit
 * @param {number[]} data - 数据数组。
 * @returns {number} 偏度。
 */
Toolkit.statSkew = function(data) {
    const n = data.length;
    const meanVal = Toolkit.mean(data);
    const stdDevVal = Toolkit.stdDev(data);
    const skewness = data.reduce((acc, val) => acc + Math.pow(val - meanVal, 3), 0) / (n * Math.pow(stdDevVal, 3));
    return skewness;
};

/**
 * 计算峰度。
 *
 * @memberof Toolkit
 * @param {number[]} data - 数据数组。
 * @returns {number} 峰度。
 */
Toolkit.statKurt = function(data) {
    const n = data.length;
    const meanVal = Toolkit.mean(data);
    const stdDevVal = Toolkit.stdDev(data);
    const kurtosis = data.reduce((acc, val) => acc + Math.pow(val - meanVal, 4), 0) / (n * Math.pow(stdDevVal, 4)) - 3;
    return kurtosis;
};

/**
 * 根据权重随机选择一个对象并返回其ID
 *
 * @memberof Toolkit
 * @param {Array} arr - 包含对象的数组，每个对象必须有一个id属性和一个权重属性
 * @returns {number} 随机选择的对象的ID
 */
Toolkit.weightedRandom = function(arr) {
    const totalWeight = arr.reduce((sum, obj) => sum + obj.weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (const obj of arr) {
        randomNum -= obj.weight;
        if (randomNum <= 0) {
            return obj.id;
        }
    }
}


/**
 * 生成两个点之间均匀分布的点的数组。
 *
 * @param {{x: number, y: number}} p1 - 第一个点的坐标，包含 x 和 y。
 * @param {{x: number, y: number}} p2 - 第二个点的坐标，包含 x 和 y。
 * @param {number} number - 要生成的点的数量。
 * @returns {Array<{x: number, y: number}>} 一个包含生成的点的数组，每个点有 x 和 y 坐标。
 */
Toolkit.interPoints=function (p1, p2, number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
        let r = i / number;
        arr.push({ x: p1.x + r * (p2.x - p1.x), y: p1.y + r * (p2.y - p1.y) });
    }
    return arr;
}
/**
 * 在给定的控制点和端点之间生成贝塞尔曲线上的点的数组。
 *
 * @param {{x: number, y: number}} p1 - 贝塞尔曲线的起始端点，包含 x 和 y 坐标。
 * @param {{x: number, y: number}} p2 - 贝塞尔曲线的终点，包含 x 和 y 坐标。
 * @param {Array<{x: number, y: number}>} cps - 控制点数组，每个控制点包含 x 和 y 坐标。
 * @param {number} number - 要生成的点的数量。
 * @returns {Array<{x: number, y: number}>} 一个包含生成的贝塞尔曲线上点的数组，每个点有 x 和 y 坐标。
 */
Toolkit.bezierPoints = function(p1, p2, cps, number) {
    let arr = [];
    let n = cps.length;
    function binomialCoefficient(n, k) {
        let coeff = 1;
        for (let i = n; i > n - k; i--) {
            coeff *= i;
        }
        for (let i = 1; i <= k; i++) {
            coeff /= i;
        }
        return coeff;
    }
    function bernsteinPolynomial(t, i, n) {
        return binomialCoefficient(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
    }
    for (let i = 0; i <= number; i++) {
        let t = i / number;
        let x = bernsteinPolynomial(t, 0, n + 1) * p1.x +
            bernsteinPolynomial(t, n + 1, n + 1) * p2.x;
        let y = bernsteinPolynomial(t, 0, n + 1) * p1.y +
            bernsteinPolynomial(t, n + 1, n + 1) * p2.y;

        for (let j = 0; j < n; j++) {
            x += bernsteinPolynomial(t, j + 1, n + 1) * cps[j].x;
            y += bernsteinPolynomial(t, j + 1, n + 1) * cps[j].y;
        }

        arr.push({ x: x, y: y });
    }
    return arr;
}

/**
 * 计算由给定点数组构成的多边形的面积。
 *
 * @param {Array<{x: number, y: number}>} points - 多边形的顶点数组，每个点包含 x 和 y 坐标。
 * @returns {number} 多边形的面积。
 */
Toolkit.calcArea = function(points) {
    if (points.length < 3) {
      return 0
    }
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        let p1 = points[i];
        let p2 = points[(i + 1) % points.length];
        area += (p1.x * p2.y) - (p2.x * p1.y);
    }
    area = Math.abs(area) / 2;
    return area;
}
/**
 * 计算由给定点数组构成的多边形的周长。
 *
 * @param {Array<{x: number, y: number}>} points - 多边形的顶点数组，每个点包含 x 和 y 坐标。
 * @returns {number} 多边形的周长。
 */
Toolkit.calcPerimeter = function(points) {
    if (points.length < 3) {return 0}
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
        let p1 = points[i];
        let p2 = points[(i + 1) % points.length];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    return perimeter;
}
/**
 * 计算圆的面积。
 *
 * @param {number} r - 圆的半径。
 * @returns {number} 圆的面积。
 */
Toolkit.areaCircle = function(r) {
    return Math.PI * r * r;
};

/**
 * 计算圆的周长。
 *
 * @param {number} r - 圆的半径。
 * @returns {number} 圆的周长。
 */
Toolkit.perimeterCircle = function(r) {
    return 2 * Math.PI * r;
};

/**
 * 计算椭圆的面积。
 *
 * @param {number} a - 椭圆的长轴半径。
 * @param {number} b - 椭圆的短轴半径。
 * @returns {number} 椭圆的面积。
 */
Toolkit.areaEllipse = function(a, b) {
    return Math.PI * a * b;
};

/**
 * 计算椭圆的周长（近似公式）。
 *
 * @param {number} a - 椭圆的长轴半径。
 * @param {number} b - 椭圆的短轴半径。
 * @returns {number} 椭圆的周长。
 */
Toolkit.perimeterEllipse = function(a, b) {
    return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
};

/**
 * 根据圆的周长计算半径。
 *
 * @param {number} c - 圆的周长。
 * @returns {number} 圆的半径。
 */
Toolkit.radiusFromCircumference = function(c) {
    return c / (2 * Math.PI);
};

/**
 * 根据圆的面积计算半径。
 *
 * @param {number} a - 圆的面积。
 * @returns {number} 圆的半径。
 */
Toolkit.radiusFromArea = function(a) {
    return Math.sqrt(a / Math.PI);
};
/**
 * 计算两点之间的斜率。
 *
 * @param {{x: number, y: number}} p1 - 第一个点的坐标。
 * @param {{x: number, y: number}} p2 - 第二个点的坐标。
 * @returns {number} 斜率。
 */
Toolkit.slope= function(p1,p2) {
    if (p2.x === p1.x||p2.y === p1.y) {return 0}
    return (p2.y - p1.y) / (p2.x - p1.x);
}

/**
 * 检查两条线段是否平行。
 *
 * @param {{x: number, y: number}} p1 - 第一条线段的第一个点。
 * @param {{x: number, y: number}} p2 - 第一条线段的第二个点。
 * @param {{x: number, y: number}} p3 - 第二条线段的第一个点。
 * @param {{x: number, y: number}} p4 - 第二条线段的第二个点。
 * @returns {boolean} 是否平行。
 */
Toolkit.areParallel = function(p1, p2, p3, p4) {
    const slope1 = Toolkit.slope(p1, p2);
    const slope2 = Toolkit.slope(p3, p4);
    return slope1 === slope2;
};

/**
 * 检查两条线段是否垂直。
 *
 * @param {{x: number, y: number}} p1 - 第一条线段的第一个点。
 * @param {{x: number, y: number}} p2 - 第一条线段的第二个点。
 * @param {{x: number, y: number}} p3 - 第二条线段的第一个点。
 * @param {{x: number, y: number}} p4 - 第二条线段的第二个点。
 * @returns {boolean} 是否垂直。
 */
Toolkit.arePerpendicular = function(p1, p2, p3, p4) {
    const slope1 = Toolkit.slope(p1, p2);
    const slope2 = Toolkit.slope(p3, p4);
    if ((slope1 === Infinity && slope2 === 0) || (slope1 === 0 && slope2 === Infinity)) {return true;}
    return slope1 * slope2 === -1;
};


Toolkit.findIntersection=function (p1, p2, p3, p4) {
    const slope1 = (p2.y - p1.y) / (p2.x - p1.x);
    const intercept1 = p1.y - slope1 * p1.x;

    const slope2 = (p4.y - p3.y) / (p4.x - p3.x);
    const intercept2 = p3.y - slope2 * p3.x;

    if (slope1 === slope2) {
        return null;
    }

    const x = (intercept2 - intercept1) / (slope1 - slope2);
    const y = slope1 * x + intercept1;

    return { x: x, y: y };
}


/**
 * 射线延伸
 *
 * @param {{x: number, y: number}} a - 射线起点。
 * @param {{x: number, y: number}} b - 射线终点。
 * @param {number} d - 延伸的距离。
 * @returns {{x: number, y: number}} 延伸后的点c的坐标。
 */
Toolkit.extendRay = function(a, b, d) {
    let distance = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    let angle = Math.atan2(b.y - a.y, b.x - a.x);
    let c = {
        x: b.x + d * Math.cos(angle),
        y: b.y + d * Math.sin(angle)
    };
    return c;
}
/**
 * 将点数组中的点绕着控制点旋转指定的角度。
 *
 * @param {Array<{x: number, y: number}>} points - 多个点的数组，每个点包含 x 和 y 坐标。
 * @param {{x: number, y: number}} rotatePoint - 控制点的坐标，包含 x 和 y。
 * @param {number} angle - 旋转的角度，以度数为单位。
 * @returns {Array<{x: number, y: number}>} 旋转后的点的数组。
 */
Toolkit.rotatePoint = function(points, rotatePoint, angle) {
    let radians = Toolkit.toRadians(angle);
    return  points.map(point => {
        let translatedX = point.x - controlPoint.x;
        let translatedY = point.y - controlPoint.y;
        let rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
        let rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);
        return {
            x: rotatedX + controlPoint.x,
            y: rotatedY + controlPoint.y
        };
    });
}

/**
 * 计算直线的截距。
 *
 * @param {{x: number, y: number}} p - 直线上的一点。
 * @param {number} slope - 直线的斜率。
 * @returns {number} 截距。
 */
Toolkit.intercept = function(p, slope) {
    if (slope === Infinity) return p.x;
    return p.y - slope * p.x; 
};
/**
 * 计算两条平行直线之间的距离。
 *
 * @param {{x: number, y: number}} p1 - 第一条直线的第一个点。
 * @param {{x: number, y: number}} p2 - 第一条直线的第二个点。
 * @param {{x: number, y: number}} p3 - 第二条直线的第一个点。
 * @param {{x: number, y: number}} p4 - 第二条直线的第二个点。
 * @returns {number} 两条平行直线之间的距离。
 */
Toolkit.distanceLines = function(p1, p2, p3, p4) {
    const slope1 = Toolkit.slope(p1, p2);
    const slope2 = Toolkit.slope(p3, p4);
    if (slope1 !== slope2) return 0
    const intercept1 = Toolkit.intercept(p1, slope1);
    const intercept2 = Toolkit.intercept(p3, slope2);
    return Math.abs(intercept2 - intercept1) / Math.sqrt(1 + slope1 * slope1);
};



/**
 * 获取部分匹配表（LPS数组）。
 *
 * @param {string} pattern - 需要匹配的模式。
 * @returns {number[]} LPS数组。
 */
Toolkit.getLPS=function(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length !== 0) {
                length = lps[length - 1];
            } else {
                i++;
            }
        }
    }
    return lps;
}
/**
 * 使用KMP算法在文本中查找模式第一次出现的起始索引。
 *
 * @param {string} text - 搜索的文本。
 * @param {string} pattern - 需要匹配的模式。
 * @returns {number} 模式在文本中第一次出现的起始索引，如果未找到则返回-1。
 */
Toolkit.searchKMP=function (text, pattern) {
    const lps =  Toolkit.getLPS(pattern);
    let textIndex = 0; // index for text
    let patternIndex = 0; // index for pattern
    while (textIndex < text.length) {
        if (text[textIndex] === pattern[patternIndex]) {
            textIndex++;
            patternIndex++;
        }
        if (patternIndex === pattern.length) {
            return textIndex - patternIndex; 
        } else if (textIndex < text.length && text[textIndex] !== pattern[patternIndex]) {
            if (patternIndex !== 0) {
                patternIndex = lps[patternIndex - 1];
            } else {
                textIndex++;
            }
        }
    }
    return -1;
}

/**
 * 计算一组概率的乘积。
 *
 * @param {number[]} prob - 一个包含概率值的数组，值在0到1之间。
 * @returns {number} 概率乘积的结果。
 */
Toolkit.mulProb=function (prob) {
    return prob.reduce((acc, probability) => acc * probability, 1);
}
/**
 * 计算联合倍率。
 *
 * @param {number[]} prob - 一个包含概率值的数组，值在0到1之间。
 * @returns {number} 联合倍率。
 */
Toolkit.combinedProb=function (prob) {
    return 1-Toolkit.mulProb(prob.map(value => 1 - value));
}
/**
* 计算期望值。
*
* @param {number[]} values - 可能结果的数组。
* @param {number[]} probabilities - 对应结果的概率数组。
* @returns {number} 期望值。
*/
Toolkit.expectedValue = function(values, probabilities) {
    return values.reduce((acc, value, index) => acc + value * probabilities[index], 0);
}
/**
 * 计算减免率。
 *
 * @param {number} val - 输入值。
 * @param {number} rate - 系数。
 * @returns {number} 减免值。
 */
Toolkit.compRate=function(val,rate) {
    let r = rate * Math.abs(val) / (1 + rate * Math.abs(val))
    return val >= 0 ? r : -r
}
/**
 * 生成伪随机数。
 *
 * @param {number} seed - 随机种子。
 * @returns {number} 介于0和1之间的伪随机数。
 */
Toolkit.sineRandom=function (seed){
    let x = Math.sin(seed) * 10000*Math.E;
    return x - Math.floor(x);
}
/**
 * Base64字符集。
 */
Toolkit.Base64String="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
/**
 * 打乱字符串。
 *
 * @param {string} input - 要打乱的字符串。
 * @param {number} seed - 随机种子。
 * @returns {string} 打乱后的字符串。
 */
Toolkit.shuffleString = function (input, seed) {
    let array = input.split('');
    let n = array.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Toolkit.sineRandom(seed + i) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}
/**
 * 字符编码列表。
 */
Toolkit.encodings = ['utf-8','utf-16le','iso-8859-1','windows-1253','koi8-r','gbk'];
/**
 * 将文本进行编码。
 *
 * @param {string} text - 要编码的文本。
 * @returns {Uint8Array} 编码后的字节数组。
 */
Toolkit.textEncoders=function (text) {return new TextEncoder().encode(text)}
/**
 * 将字节数组进行解码。
 *
 * @param {string} encoding - 字符编码。
 * @param {Uint8Array} byte - 要解码的字节数组。
 * @returns {string} 解码后的文本。
 */
Toolkit.textDecoder=function (encoding,byte) {return new TextDecoder(encoding).decode(byte)}
/**
 * 将字符串编码为Base64。
 *
 * @param {string} str - 要编码的字符串。
 * @returns {string} 编码后的Base64字符串。
 */
Toolkit.btoa=function (str) {
    return btoa(unescape(encodeURIComponent(str)));
}
/**
 * 将Base64字符串解码为普通字符串。
 *
 * @param {string} base64Str - 要解码的Base64字符串。
 * @returns {string} 解码后的普通字符串。
 */
Toolkit.atob=function (base64Str) {
    console.log(atob(base64Str))
    return decodeURIComponent(escape(atob(base64Str)));
}
/**
 * 返回对应的var值。
 *
 * @param {Array<{ val: number, thld: number }>} arr - 包含val和阈值(thld)的对象数组。
 * @param {number} val - 用于查找的熟练度值。
 * @returns {number} 对应的var值，如果没有找到合适的阈值则返回0。
 */
Toolkit.getThreshold=function (arr,val) {
    for (const item of arr) {
        if (val >= item.thld) {
            return item.val;
        }
    }
    return 0;
}


function BLAKE2s() {
    throw new Error("static class");
}
BLAKE2s.rotr32 = function(x, y) {
    return (x >>> y) | (x << (32 - y));
};
/**
 * BLAKE2s算法中的G函数，用于混淆操作。
 *
 * @param {Uint32Array} v - 16个32位整数的数组。
 * @param {number} a - 索引a。
 * @param {number} b - 索引b。
 * @param {number} c - 索引c。
 * @param {number} d - 索引d。
 * @param {number} x - 输入x。
 * @param {number} y - 输入y。
 */
BLAKE2s.G = function(v, a, b, c, d, x, y) {
    v[a] = (v[a] + v[b] + x) >>> 0;
    v[d] = BLAKE2s.rotr32(v[d] ^ v[a], 16);
    v[c] = (v[c] + v[d]) >>> 0;
    v[b] = BLAKE2s.rotr32(v[b] ^ v[c], 12);
    v[a] = (v[a] + v[b] + y) >>> 0;
    v[d] = BLAKE2s.rotr32(v[d] ^ v[a], 8);
    v[c] = (v[c] + v[d]) >>> 0;
    v[b] = BLAKE2s.rotr32(v[b] ^ v[c], 7);
};
/**
 * BLAKE2s压缩函数。
 *
 * @param {Object} ctx - BLAKE2s上下文对象。
 * @param {boolean} last - 是否是最后一个块。
 */
BLAKE2s.compress = function(ctx, last) {
    let v = new Uint32Array(16);
    let m = new Uint32Array(16);
    for (let i = 0; i < 8; i++) {
        v[i] = ctx.h[i];
        v[i + 8] = BLAKE2S_IV[i];
    }

    v[12] ^= ctx.t;
    v[13] ^= (ctx.t / 0x100000000) >>> 0;
    if (last) {
        v[14] = ~v[14];
    }

    for (let i = 0; i < 16; i++) {
        m[i] = ctx.b[i * 4] | (ctx.b[i * 4 + 1] << 8) | (ctx.b[i * 4 + 2] << 16) | (ctx.b[i * 4 + 3] << 24);
    }

    for (let i = 0; i < 10; i++) {
        BLAKE2s.G(v, 0, 4, 8, 12, m[SIGMA[i][0]], m[SIGMA[i][1]]);
        BLAKE2s.G(v, 1, 5, 9, 13, m[SIGMA[i][2]], m[SIGMA[i][3]]);
        BLAKE2s.G(v, 2, 6, 10, 14, m[SIGMA[i][4]], m[SIGMA[i][5]]);
        BLAKE2s.G(v, 3, 7, 11, 15, m[SIGMA[i][6]], m[SIGMA[i][7]]);
        BLAKE2s.G(v, 0, 5, 10, 15, m[SIGMA[i][8]], m[SIGMA[i][9]]);
        BLAKE2s.G(v, 1, 6, 11, 12, m[SIGMA[i][10]], m[SIGMA[i][11]]);
        BLAKE2s.G(v, 2, 7, 8, 13, m[SIGMA[i][12]], m[SIGMA[i][13]]);
        BLAKE2s.G(v, 3, 4, 9, 14, m[SIGMA[i][14]], m[SIGMA[i][15]]);
    }

    for (let i = 0; i < 8; i++) {
        ctx.h[i] ^= v[i] ^ v[i + 8];
    }
};
/**
 * 初始化BLAKE2s上下文。
 *
 * @param {number} outlen - 输出哈希值的长度。
 * @returns {Object} BLAKE2s上下文对象。
 */
BLAKE2s.blake2sInit = function(outlen) {
    let ctx = {
        h: new Uint32Array(BLAKE2S_IV),
        b: new Uint8Array(64),
        c: 0,
        t: 0,
        outlen: outlen
    };
    ctx.h[0] ^= 0x01010000 ^ outlen;
    return ctx;
};
/**
 * 更新BLAKE2s上下文，处理输入数据。
 *
 * @param {Object} ctx - BLAKE2s上下文对象。
 * @param {Uint8Array} input - 输入数据。
 */
BLAKE2s.blake2sUpdate = function(ctx, input) {
    for (let i = 0; i < input.length; i++) {
        if (ctx.c === 64) {
            ctx.t += ctx.c;
            BLAKE2s.compress(ctx, false);
            ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i];
    }
};
/**
 * 完成BLAKE2s哈希计算，返回哈希值。
 *
 * @param {Object} ctx - BLAKE2s上下文对象。
 * @returns {Uint8Array} 哈希值。
 */
BLAKE2s.blake2sFinal = function(ctx) {
    ctx.t += ctx.c;
    while (ctx.c < 64) {
        ctx.b[ctx.c++] = 0;
    }
    BLAKE2s.compress(ctx, true);
    let out = new Uint8Array(ctx.outlen);
    for (let i = 0; i < ctx.outlen; i++) {
        out[i] = (ctx.h[i >> 2] >> (8 * (i & 3))) & 0xFF;
    }
    return out;
};
/**
 * BLAKE2s哈希函数，处理输入数据并返回指定长度的哈希值。
 *
 * @param {Uint8Array} input - 输入数据。
 * @param {number} [outlen=32] - 输出哈希值的长度，默认为32。
 * @returns {Uint8Array} 哈希值。
 */
BLAKE2s.blake2s = function(input, outlen = 32) {
    let ctx = BLAKE2s.blake2sInit(outlen);
    BLAKE2s.blake2sUpdate(ctx, input);
    return BLAKE2s.blake2sFinal(ctx);
};


function EnigmaMachine() {
    this.initialize.apply(this, arguments);
}
/**
 * 初始化恩格玛机。
 *
 * @param {string[]} parms - 初始化参数数组，第一个参数为反射器密码，第二个参数为插线板密码，后续参数为转子密码。
 */
EnigmaMachine.prototype.initialize = function (parms) {
    this.reflector = this.createArrayMap(parms[0]);
    this.plugboard = this.createArrayMap(parms[1]);
    this.createRotors(parms);
    this.index = 0;
};

/**
 * 创建映射数组。
 *
 * @param {string} pass - 密码字符串。
 * @returns {Array} 映射数组。
 */
EnigmaMachine.prototype.createArrayMap = function (pass) {
    const chars = Toolkit.shuffleString(Toolkit.Base64String, pass);
    const map = new Array(64);
    for (let i = 0; i < chars.length; i += 2) {
        map[Toolkit.Base64String.indexOf(chars[i])] = chars[i + 1];
        map[Toolkit.Base64String.indexOf(chars[i + 1])] = chars[i];
    }
    return map;
};

/**
 * 创建转子。
 *
 * @param {string[]} parms - 初始化参数数组。
 */
EnigmaMachine.prototype.createRotors = function (parms) {
    this.rotors = [];
    this.rotorSteps = [];
    for (let i = 2; i < parms.length; i++) {
        this.rotors.push(Toolkit.shuffleString(Toolkit.Base64String, parms[i]).split(''));
    }
    this.precomputeRotorSteps();
};

/**
 * 预计算转子步进。
 */
EnigmaMachine.prototype.precomputeRotorSteps = function () {
    const length = this.rotors.length;
    this.rotorSteps = Array.from({ length: length }, (_, i) => []);
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < this.rotors[i].length; j++) {
            this.rotorSteps[i].push(j);
        }
    }
};

/**
 * 编码消息。
 *
 * @param {string} message - 要编码的消息。
 * @param {number} [index=0] - 初始索引。
 * @returns {string} 编码后的消息。
 */
EnigmaMachine.prototype.encodeMessage = function (message, index) {
    this.index = index || 0;
    return message.split('').map(char => this.encodeCharacter(char)).join('');
};

/**
 * 解码消息。
 *
 * @param {string} message - 要解码的消息。
 * @param {number} [index=0] - 初始索引。
 * @returns {string} 解码后的消息。
 */
EnigmaMachine.prototype.decodeMessage = function (message, index) {
    this.index = index || 0;
    return message.split('').map(char => this.decodeCharacter(char)).join('');
};

/**
 * 编码字符。
 *
 * @param {string} char - 要编码的字符。
 * @returns {string} 编码后的字符。
 */
EnigmaMachine.prototype.encodeCharacter = function (char) {
    if (Toolkit.Base64String.includes(char)) {
        char = this.plugboard[Toolkit.Base64String.indexOf(char)] || char;
        char = this.processThroughRotors(char, true);
        char = this.reflector[Toolkit.Base64String.indexOf(char)] || char;
        char = this.processThroughRotors(char, false);
    }
    this.index++;
    return char;
};

/**
 * 解码字符。
 *
 * @param {string} char - 要解码的字符。
 * @returns {string} 解码后的字符。
 */
EnigmaMachine.prototype.decodeCharacter = function (char) {
    if (Toolkit.Base64String.includes(char)) {
        char = this.processThroughRotors(char, true, true);
        char = this.reflector[Toolkit.Base64String.indexOf(char)] || char;
        char = this.processThroughRotors(char, false, true);
        char = this.plugboard[Toolkit.Base64String.indexOf(char)] || char;
    }
    this.index++;
    return char;
};

/**
 * 通过转子处理字符。
 *
 * @param {string} char - 要处理的字符。
 * @param {boolean} forward - 是否正向处理。
 * @param {boolean} [reverse=false] - 是否反向处理。
 * @returns {string} 处理后的字符。
 */
EnigmaMachine.prototype.processThroughRotors = function (char, forward, reverse) {
    let step, rotor;
    const length = this.rotors.length;
    if (forward) {
        for (let i = 0; i < length; i++) {
            step = this.rotorSteps[i][this.index % this.rotors[i].length];
            rotor = this.rotors[i];
            if (reverse) {
                char = rotor[(Toolkit.Base64String.indexOf(char) + rotor.length - step) % rotor.length];
            } else {
                char = rotor[(Toolkit.Base64String.indexOf(char) + step) % rotor.length];
            }
        }
    }
    else {
        for (let i = length - 1; i >= 0; i--) {
            step = this.rotorSteps[i][this.index % this.rotors[i].length];
            rotor = this.rotors[i];
            if (reverse) {
                char = Toolkit.Base64String[(rotor.indexOf(char) + rotor.length - step) % rotor.length];
            } else {
                char = Toolkit.Base64String[(rotor.indexOf(char) + step) % rotor.length];
            }
        }
    }
    return char;
};

/**
 * PRD 类，用于概率随机分布。
 */
function PRD() {
    this.initialize.apply(this, arguments);
}

/**
 * 初始化 PRD 实例。
 *
 * @param {number} bRate - 基本概率。
 * @param {number} lRate - 线性增加率。
 * @param {number} qRate - 二次增加率。
 */
PRD.prototype.initialize = function (bRate, lRate, qRate) {
    this.cont = 0;
    this.bRate = bRate;
    this.lRate = lRate;
    this.qRate = qRate;
};

/**
 * 生成随机概率结果。
 *
 * @returns {boolean} 随机结果是否为真。
 */
PRD.prototype.random = function () {
    let rate = this.bRate + (this.cont * this.lRate) + (this.cont * (this.cont + 1) / 2) * this.qRate;
    if (Math.random() < rate) {
        this.cont = 0;
        return true;
    } else {
        this.cont++;
        return false;
    }
};

/**
 * 测试指定次数的概率。
 *
 * @param {number} trials - 试验次数。
 * @returns {number} 成功概率。
 */
PRD.prototype.testProbability = function (trials) {
    let successCount = 0;
    for (let i = 0; i < trials; i++) {
        if (this.random()) {
            successCount++;
        }
    }
    return successCount / trials;
};

/**
 * 马尔科夫链类。
 */
function MarkovChain() {
    this.initialize.apply(this, arguments);
}

/**
 * 初始化马尔科夫链实例。
 *
 * @param {Array<string>} states - 状态数组。
 * @param {Array<Array<number>>} transitionMatrix - 状态转移矩阵。
 */
MarkovChain.prototype.initialize = function (states, transitionMatrix) {
    this.states = states;
    this.transitionMatrix = transitionMatrix;
    this.currentState = this.states[0];
    this.random();
};

/**
 * 随机选择下一个状态。
 *
 * @returns {string} 当前状态。
 */
MarkovChain.prototype.random = function () {
    let stateIndex = this.states.indexOf(this.currentState);
    let probabilities = this.transitionMatrix[stateIndex];
    let randomValue = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (randomValue < cumulativeProbability) {
            this.currentState = this.states[i];
            return this.currentState;
        }
    }
};

/**
 * 测试指定次数的状态概率。
 *
 * @param {number} trials - 试验次数。
 * @returns {Array<number>} 各状态的概率。
 */
MarkovChain.prototype.testProbability = function (trials) {
    let stateCounts = new Array(this.states.length).fill(0);

    for (let i = 0; i < trials; i++) {
        let result = this.random();
        let stateIndex = this.states.indexOf(result);
        stateCounts[stateIndex]++;
    }
    return stateCounts.map(count => count / trials);
};