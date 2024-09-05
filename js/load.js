function ModuleManager() {throw new Error("static class");}
ModuleManager.module =[
    {
        "src": "libs",
        "data": [
            { "src": "crypto-js.min" },
            { "src": "encoding" },
            { "src": "pixi" },
            { "src": "pixi-filters" },
            { "src": "live2d.min" },
            { "src": "live2dcubismcore" },
            { "src": "index.min" },
            { "src": "localforage.min" },
            { "src": "pako.min" },
            { "src": "tone" },
            { "src": "dexie.min" },
            { "src": "effekseer.min" },
            { "src": "vorbisdecoder" },
            { "src": "toolkit" },
        ]
    },
    {
        "src": "module",
        "data": [
            {
                "src": "framework",
                "data": [
                    { "src": "graffiti" },
                    { "src": "scene" },
                    { "src": "view" },
                    { "src": "view_spares" }
                ]
            },
            {
                "src": "stage",
                "data": [
                    { "src": "p1" }
                ]
            }
        ]
    },
    {
        "src": "base",
        "data": [
            { "src": "world" },
            { "src": "manager" },
            { "src": "keyboard" },
            { "src": "identity" },
            { "src": "conductor" },
        ]
    },
    { "src": "main" }
]

ModuleManager._path = '';
ModuleManager._scripts = [];
ModuleManager._errorUrls = [];
ModuleManager.loadScript = function (url) {
   let script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url
   script.async = false;
   script.dataset.url = url
   script.onerror = this.onError.bind(this);
   document.body.appendChild(script);
};
ModuleManager.onError = function (e) {
   let target = e.target;
   this._errorUrls.push(target.dataset.url);
};
ModuleManager.setup = function (modules, src) {
   for (const module of modules) {
       const moduleSrc = `${src}/${module.src}`;
       if (module.data) {this.setup(module.data, moduleSrc);}
       else {
           const name = `${moduleSrc}.js`;
           this.loadScript(name);
           this._scripts.push(name);
       }
   }
};
ModuleManager.load = function () {
    this.setup(this.module, "js");
};

var LIM={}
ModuleManager.load();

