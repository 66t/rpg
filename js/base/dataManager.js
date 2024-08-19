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
