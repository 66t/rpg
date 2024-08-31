function Identity() {
    this.initialize.apply(this, arguments);
}
Identity.prototype = Object.create(Identity.prototype);
Identity.prototype.constructor = Identity;
Identity.SEED_COUNT = 32;
Identity.SEED_LINK = "-";
Identity.key = CryptoJS.enc.Hex.parse('123318efc4b6388888af51a6cd932b12');

/**
 * 初始化 Identity 实例。
 * @memberof Identity
 */
Identity.prototype.initialize = function() {
    this.seed = [];
    this.key = "";
    this._number = [];
    this._bool = [];
    this.initSeed();
    this.initKey();
};

/**
 * 初始化加密密钥。
 * @memberof Identity
 */
Identity.prototype.initKey = function() {
    let t = Date.now().toString().split('').reverse().join('');
    while (t > 0) {
        this.key += (Toolkit.radixNum(t % 36, 10, 36));
        t = Math.floor(t / 36);
    }
};

/**
 * 初始化种子数组。
 * @memberof Identity
 */
Identity.prototype.initSeed = function() {
    for (let i = 0; i < Identity.SEED_COUNT; i++) {
        this.seed[i] = this.seedNext(Math.randomInt(65535));
    }
};
/**
 * 生成一个根据模式得到随机数。
 * @memberof Identity
 * @param {number} mode - 模式，用于选择种子。
 * @param {number} [promax=100] - 最大值。
 * @returns {number} 计算的值。
 */
Identity.prototype.pro = function(mode, promax) {
    return this.getSeed(mode) % (promax || 100);
};
/**
 * 根据模式获取种子值。
 * @memberof Identity
 * @param {number} mode - 模式，用于选择种子。
 * @returns {number} 返回种子值。
 */
Identity.prototype.getSeed = function(mode) {
    let index = mode % Identity.SEED_COUNT;
    this.seed[index] = this.seedNext(this.seed[index], index);
    return this.seed[index];
};
/**
 * 计算下一个种子值。
 * @memberof Identity
 * @param {number} seed - 当前种子值。
 * @param {number} mode - 模式，用于选择算法。
 * @returns {number} 新的种子值。
 */
Identity.prototype.seedNext = function(seed, mode) {
    switch (mode % 4) {
        case 0:
            seed = (seed * 3877 + 139968) % 29573;
            break;
        case 1:
            seed = (seed * 421 + 259200) % 54773;
            break;
        case 2:
            seed = (seed * 9301 + 49297) % 233280;
            break;
        case 3:
            seed = (seed * 281 + 134456) % 28411;
            break;
    }
    return Math.round(seed);
};

/**
 * 获取数字值。
 * @memberof Identity
 * @param {number} Id - 数字标识符。
 * @returns {number} 返回相应的数字值。
 */
Identity.prototype.value = function(Id) {
    return this._number[Id] || 0;
};

/**
 * 设置数字值。
 * @memberof Identity
 * @param {number} Id - 数字标识符。
 * @param {number} value - 要设置的值。
 */
Identity.prototype.setValue = function(Id, value) {
    if (typeof value === 'number') {
        this._number[Id] = value;
    }
};

/**
 * 获取布尔值。
 * @memberof Identity
 * @param {number} Id - 布尔标识符。
 * @returns {boolean} 返回相应的布尔值。
 */
Identity.prototype.bool = function(Id) {
    return !!this._bool[Id];
};

/**
 * 设置布尔值。
 * @memberof Identity
 * @param {number} Id - 布尔标识符。
 * @param {boolean} value - 要设置的值。
 */
Identity.prototype.setBool = function(Id, value) {
    if (value) {
        this._bool[Id] = true;
    } else {
        delete this._bool[Id];
    }
};

/**
 * 创建保存文件的内容。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @returns {string} 加密后的保存文件内容。
 */
Identity.prototype.makeSaveContents = function(savefileId, type) {
    let contents = {};
    if (savefileId < 0) contents = {};
    else {
        switch (type){
            case "seed":  contents = this.seed;break
            case "key":   contents = this.key;break
            case "number":contents = this._number;break
            case "bool":  contents = this._bool;break
        }
    }
    const s = pako.deflate(JSON.stringify(contents), { to: 'string', windowBits: -15 });
    return CryptoJS.AES.encrypt(s, Identity.key, { mode: CryptoJS.mode.ECB }).toString();
};

/**
 * 加载保存文件的内容。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @param {string} data - 加密的保存文件内容。
 * @returns {boolean|Object} 如果保存文件加载成功则返回解析后的内容，否则返回 false。
 */
Identity.prototype.loadSaveContents = function(savefileId,type, data) {
    if (!data) return false;
    const s = pako.inflate(CryptoJS.AES.decrypt(data, Identity.key, {mode:CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8), {to:'string',windowBits:-15});
    if (savefileId < 0) {
        return JSON.parse(s);
    } else if (savefileId === 0) {
        return JSON.parse(s);
    } else {
        const contents = JSON.parse(s);
        switch (type){
            case "seed":  this.seed = contents;break
            case "key":   this.key = contents;break
            case "number":this._number = contents;break
            case "bool":  this._bool = contents;break
        }
    }
    return false;
};

/**
 * 保存文件。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 */
Identity.prototype.save = function(savefileId,type) {
    if (Toolkit.isNwjs()) {this.saveToLocalFile(savefileId,type,this.makeSaveContents(savefileId,type));} 
    else {this.saveToWebStorage(savefileId,type,this.makeSaveContents(savefileId,type));}
    if (savefileId > 0) {this.save(0);}
};

/**
 * 创建保存文件信息。
 * @memberof Identity
 * @returns {Object} 保存文件信息对象。
 */
Identity.prototype.makeSavefileInfo = function() {
    const info = {};
    info.timestamp = Date.now();
    return info;
};

/**
 * 创建全局信息。
 * @memberof Identity
 * @returns {Object} 全局信息对象。
 */
Identity.prototype.makeGlobalInfo = function() {
    const info = {};
    return info;
};

/**
 * 加载保存文件。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @returns {boolean|Object} 如果保存文件加载成功则返回解析后的内容，否则返回 false。
 */
Identity.prototype.load = function(savefileId,type) {
    if (Toolkit.isNwjs()) {
        return this.loadSaveContents(savefileId,type, this.loadFromLocalFile(savefileId,type))
    } else {
        return this.loadFromWebStorage(savefileId,type).then(data => {return this.loadSaveContents(savefileId,type,data)})
    }
}

/**
 * 保存文件到本地文件系统。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @param {string} json - 要保存的 JSON 字符串。
 */
Identity.prototype.saveToLocalFile = function(savefileId,type, json) {
    let fs = require('fs');
    let dirPath = this.localFileDirectoryPath(savefileId);
    let filePath = this.localFilePath(savefileId,type);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, json);
};

/**
 * 从本地文件系统加载文件。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @returns {string|null} 返回文件内容或 null。
 */
Identity.prototype.loadFromLocalFile = function(savefileId,type) {
    let data = null;
    let fs = require('fs');
    let filePath = this.localFilePath(savefileId,type);
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return data;
};

/**
 * 保存文件到 Web 存储。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @param {string} json - 要保存的 JSON 字符串。
 */
Identity.prototype.saveToWebStorage = function(savefileId,type, json) {
    $Db.put({index: savefileId, type: type||0, data: json})
};

/**
 * 从 Web 存储加载文件。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @returns {string|null} 返回文件内容或 null。
 */
Identity.prototype.loadFromWebStorage = function(savefileId, type) {
    return new Promise((resolve, reject) => {
        $Db.where({index:savefileId, type:type||0}).first().then((result) => {
            if(result){resolve(result.data)} 
            else {resolve(null);}}).catch((err)=>{reject(err)})
        })
};
/**
 * 获取本地文件的路径。
 * @memberof Identity
 * @param {number} savefileId - 保存文件的标识符。
 * @param {number} type - 保存文件的类型。
 * @returns {string} 返回文件路径。
 */
Identity.prototype.localFilePath = function(savefileId,type) {
    let name;
    if (savefileId < 0) name = 'config.lim';
    else if (savefileId === 0) name = 'global.lim';
    else name = '%1.lim'.format(type);
    return this.localFileDirectoryPath(savefileId) + name;
};

/**
 * 获取本地文件的目录路径。
 * @memberof Identity
 * @returns {string} 返回目录路径。
 */
Identity.prototype.localFileDirectoryPath = function(savefileId) {
    let path = require('path');
    let base = path.dirname(process.mainModule.filename);
    return path.join(base, `save/${savefileId > 0 ? `${savefileId}/` : ''}`);
};
LIM.$Identity = new Identity();
