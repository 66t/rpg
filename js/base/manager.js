/**
 * DataManager 是一个静态类，负责管理游戏的数据文件加载和处理。
 * 该类包含一系列方法，用于加载、解析和管理游戏中的数据文件，确保数据的正确加载和可用性。
 */
function DataManager() {
    throw new Error("static class");
}

DataManager.path = 'db';
DataManager.inkPath = 'ink';
DataManager.inkPointer = '_';
DataManager.dataFile = [
    { name: "$PM", src: "ParamMap" },
    { name: "$ST", src: "SystemTable" },
    { name: "$SV", src: "SystemVar" }
];

DataManager._globalInfo = null;
DataManager._errors = [];

/**
 * 加载数据库中的所有数据文件。
 * @returns {Promise} 返回一个 Promise，当所有数据文件加载完成时解析。
 */
DataManager.loadDatabase = function() {
    const loadPromises = this.dataFile.map(file => this.loadDataFile(file.name, file.src));
    return Promise.all(loadPromises);
};

/**
 * 加载指定的数据文件。
 * @param {string} name - 数据文件的变量名。
 * @param {string} src - 数据文件的源文件名（不带扩展名）。
 * @returns {Promise} 返回一个 Promise，当数据文件加载完成时解析。
 */
DataManager.loadDataFile = function(name, src) {
    const url = `${DataManager.path}/${src}.json`;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.timeout = 5000;
        xhr.onload = this.createOnLoadHandler(name, resolve, reject, xhr);
        xhr.onerror = this.createOnErrorHandler(reject, url);
        xhr.ontimeout = this.createOnTimeoutHandler(reject, url);
        xhr.send();
    });
};

/**
 * 创建一个加载事件的处理函数。
 * @param {string} name - 数据文件的变量名。
 * @param {function} resolve - Promise 的 resolve 函数。
 * @param {function} reject - Promise 的 reject 函数。
 * @param {XMLHttpRequest} xhr - XMLHttpRequest 对象。
 * @returns {function} 返回一个加载处理函数。
 */
DataManager.createOnLoadHandler = function(name, resolve, reject, xhr) {
    return () => {
        if (xhr.status < 400) {
            try {
                window[name] = JSON.parse(xhr.responseText);
                resolve();
            } catch (e) {
                reject(new Error(`Failed to parse JSON: ${e.message}`));
            }
        } else {
            reject(new Error(`Failed to load file, status code: ${xhr.status}`));
        }
    };
};

/**
 * 创建一个请求错误的处理函数。
 * @param {function} reject - Promise 的 reject 函数。
 * @param {string} url - 请求的 URL。
 * @returns {function} 返回一个请求错误处理函数。
 */
DataManager.createOnErrorHandler = function(reject, url) {
    return () => reject(new Error(`Request error, source: ${url}`));
};

/**
 * 创建一个请求超时的处理函数。
 * @param {function} reject - Promise 的 reject 函数。
 * @param {string} url - 请求的 URL。
 * @returns {function} 返回一个请求超时处理函数。
 */
DataManager.createOnTimeoutHandler = function(reject, url) {
    return () => reject(new Error(`Request timed out, source: ${url}`));
};

/**
 * 检查全局数据是否已加载。
 * @returns {boolean} 如果全局数据已加载则返回 true，否则返回 false。
 */
DataManager.isGlobalLoad = function() {
    return !!this._globalInfo;
};

/**
 * 检查是否有保存数据。
 * @returns {boolean} 如果存在保存数据则返回 true，否则返回 false。
 */
DataManager.isSave = function() {
    return this._globalInfo.info.some(x => x);
};

/**
 * ImageManager 是一个静态类，负责管理游戏中的图像加载和缓存。
 * 该类包含一系列方法，用于加载、缓存和管理游戏中的图像资源，确保图像的高效加载和使用。
 */
function ImageManager() {
    throw new Error("static class");
}

ImageManager._cache = {};
ImageManager._system = {};
ImageManager._emptyBitmap = new Bitmap(1, 1);

/**
 * 加载位图。
 * @param {string} folder - 图像文件夹路径。
 * @param {string} filename - 图像文件名。
 * @param {string} [extension="png"] - 图像文件扩展名。
 * @returns {Bitmap} 返回加载的位图对象。
 */
ImageManager.loadBitmap = function(folder, filename, extension = "png") {
    if (filename) {
        const url = folder + Toolkit.encodeURI(filename) + "." + extension;
        return this.loadBitmapFromUrl(url);
    } else {
        return this._emptyBitmap;
    }
};

/**
 * 从 URL 加载位图。
 * @param {string} url - 图像的 URL。
 * @returns {Bitmap} 返回加载的位图对象。
 */
ImageManager.loadBitmapFromUrl = function(url) {
    const cache = url.includes("/system/") ? this._system : this._cache;
    if (!cache[url]) {
        cache[url] = Bitmap.load(url);
    }
    return cache[url];
};

/**
 * 清除图像缓存。
 */
ImageManager.clear = function() {
    const cache = this._cache;
    for (const url in cache) {
        cache[url].destroy();
    }
    this._cache = {};
};

/**
 * 检查所有图像是否已准备就绪。
 * @returns {boolean} 如果所有图像都已准备好则返回 true，否则返回 false。
 */
ImageManager.isReady = function() {
    for (const cache of [this._cache, this._system]) {
        for (const url in cache) {
            const bitmap = cache[url];
            if (bitmap.isError()) {
                this.throwLoadError(bitmap);
            }
            if (!bitmap.isReady()) {
                return false;
            }
        }
    }
    return true;
};

/**
 * 抛出图像加载错误。
 * @param {Bitmap} bitmap - 发生错误的位图对象。
 * @throws 抛出加载错误的异常。
 */
ImageManager.throwLoadError = function(bitmap) {
    const retry = bitmap.retry.bind(bitmap);
    throw ["LoadError", bitmap.url, retry];
};

/**
 * FontManager 是一个静态类，负责管理字体的加载和状态跟踪。
 * 该类包含一系列方法，用于加载自定义字体，跟踪加载状态，并确保字体在游戏中的正确使用。
 */
function FontManager() {
    throw new Error("static class");
}

FontManager._urls = {};
FontManager._states = {};

/**
 * 加载字体。
 * @param {string} family - 字体的族名称。
 * @param {string} filename - 字体文件名。
 */
FontManager.load = function(family, filename) {
    if (this._states[family] !== "loaded") {
        if (filename) {
            const url = this.makeUrl(filename);
            this.startLoading(family, url);
        } else {
            this._urls[family] = "";
            this._states[family] = "loaded";
        }
    }
};

/**
 * 开始加载字体。
 * @param {string} family - 字体的族名称。
 * @param {string} url - 字体文件的 URL。
 */
FontManager.startLoading = function(family, url) {
    const source = `url(${url})`;
    const font = new FontFace(family, source);
    this._urls[family] = url;
    this._states[family] = "loading";
    font.load()
        .then(() => {
            document.fonts.add(font);
            this._states[family] = "loaded";
        })
        .catch(() => {
            this._states[family] = "error";
        });
};

/**
 * 检查所有字体是否已准备就绪。
 * @returns {boolean} 如果所有字体都已准备好则返回 true，否则返回 false。
 */
FontManager.isReady = function() {
    for (const family in this._states) {
        const state = this._states[family];
        if (state === "loading") {
            return false;
        }
        if (state === "error") {
            this.throwLoadError(family);
        }
    }
    return true;
};

/**
 * 抛出字体加载错误。
 * @param {string} family - 发生错误的字体族名称。
 * @throws 抛出加载错误的异常。
 */
FontManager.throwLoadError = function(family) {
    const url = this._urls[family];
    const retry = () => this.startLoading(family, url);
    throw ["LoadError", url, retry];
};

/**
 * 生成字体文件的 URL。
 * @param {string} filename - 字体文件名。
 * @returns {string} 返回生成的 URL。
 */
FontManager.makeUrl = function(filename) {
    return "fonts/" + Toolkit.encodeURI(filename);
};