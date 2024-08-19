function ModuleManager() {throw new Error("static class");}

ModuleManager.module =[
    {
        "src": "base",
        "data": [
            {
                "src": "libs",
                "data": [
                    { "src": "crypto-js.min" },
                    { "src": "encoding" },
                    { "src": "localforage.min" },
                    { "src": "pako.min" },
                    { "src": "pixi" },
                    { "src": "pixi-filters" },
                    { "src": "tone" }
                ]
            },
            { "src": "dataManager" },
            { "src": "world" },
            { "src": "scene" },
            { "src": "keyboard" },
        ]
    },
    {
        "src": "module",
        "data": [
            {
                "src": "framework",
                "data": [
                    { "src": "graffiti" },
                    { "src": "toolkit" }
                ]
            }
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
ModuleManager.load = function () {this.setup(this.module, "js");};

var LIM={}
ModuleManager.load();
