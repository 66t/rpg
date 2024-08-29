function DataManager() {throw new Error("static class");}
DataManager.path = 'db';
DataManager.inkPath = 'ink';
DataManager.inkPointer = '_';
DataManager.dataFile=[
    {name:"$PM",src:"ParamMap"},
    {name:"$ST",src:"SystemTable"},
    {name:"$SV",src:"SystemVar"},
]
DataManager._globalInfo = null
DataManager._errors = [];
DataManager.loadDatabase = function() {
    const loadPromises = this.dataFile.map(file => this.loadDataFile(file.name, file.src));
    return Promise.all(loadPromises);
};
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
DataManager.createOnErrorHandler = function(reject, url) {return () => reject(new Error(`Request error, source: ${url}`));};
DataManager.createOnTimeoutHandler = function(reject, url) {return () => reject(new Error(`Request timed out, source: ${url}`));};
DataManager.isGlobalLoad = function() {return !!this._globalInfo;};
DataManager.isSave = function() {return this._globalInfo.info.some(x => x);};


function ImageManager() {throw new Error("static class");}
ImageManager._cache = {};
ImageManager._system = {};
ImageManager._emptyBitmap = new Bitmap(1, 1);
ImageManager.loadBitmap = function(folder, filename, extension = "png") {
    if (filename) {
        const url = folder + Toolkit.encodeURI(filename)+"."+extension;
        return this.loadBitmapFromUrl(url);
    } else {
        return this._emptyBitmap;
    }
};
ImageManager.loadBitmapFromUrl = function(url) {
    const cache = url.includes("/system/") ? this._system : this._cache;
    if (!cache[url]) {cache[url] = Bitmap.load(url);}
    return cache[url];
};
ImageManager.clear = function() {
    const cache = this._cache;
    for (const url in cache) {
        cache[url].destroy();
    }
    this._cache = {};
};
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
ImageManager.throwLoadError = function(bitmap) {
    const retry = bitmap.retry.bind(bitmap);
    throw ["LoadError", bitmap.url, retry];
};


function FontManager() {throw new Error("static class");}
FontManager._urls = {};
FontManager._states = {};
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
FontManager.isReady = function() {
    for (const family in this._states) {
        const state = this._states[family];
        if (state === "loading") {return false;}
        if (state === "error") {this.throwLoadError(family);}
    }
    return true;
};
FontManager.throwLoadError = function(family) {
    const url = this._urls[family];
    const retry = () => this.startLoading(family, url);
    throw ["LoadError", url, retry];
};
FontManager.makeUrl = function(filename) {return "fonts/" + Toolkit.encodeURI(filename);};
