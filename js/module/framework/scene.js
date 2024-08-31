function Scene() {throw new Error("static class");}
Scene.scene = null
Scene.nextScene = null
Scene.stack = []
Scene.exiting = false
Scene.previousScene = null
Scene.previousClass = null
Scene.smoothDeltaTime = 1
Scene.elapsedTime = 0
Scene.snapshot=[]
Scene.run=function (sceneClass) {
    try {
        if(!World.app) this.initialize()
        this.goto(sceneClass)
    }
    catch (e){}
}
Scene.initialize=function (){
    this.initWorld()
}
Scene.initWorld=function (){
    World.initialize()
    World.setTick(this.update.bind(this))
    World.startGame()
}

Scene.update = function(deltaTime) {
    try {
        let n = this.determineRepeatNumber(deltaTime);
        for (let i = 0; i < n; i++) this.updateMain(); 
    } 
    catch (e) {}
};
Scene.updateMain=function (){
    this.changeScene()
    this.updateScene()
    this.updateOperate()
    Mouse.resetWheel()
}

Scene.changeScene=function (){
    if(this.isSceneChanging()){
        if(this.exiting) this.terminate()
        this.nextScene.create()
    }
}
Scene.updateScene = function() {
    if (this.nextScene.isReady()) {
        if(this.scene) this.scene.terminate()
        this.scene = this.nextScene
        this.nextScene = null
        this.onSceneStart();
    }
    else if (this.nextScene) {this.nextScene.update()}
    if (this.scene) {this.scene.update()}
};
Scene.updateOperate=function (){
    Keyboard.update();
    Mouse.update();
}
Scene.determineRepeatNumber=function (deltaTime){
    this.smoothDeltaTime *= 0.8
    this.smoothDeltaTime += Math.min(deltaTime, 2) * 0.2
    if(this.smoothDeltaTime >= 0.9){
        this.elapsedTime = 0
        return  Math.round(this.smoothDeltaTime)
    }
    else {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime >= 1) {
            this.elapsedTime -= 1;
            return 1;
        }
        return 0;
    }
}
Scene.terminate=function (){if (Toolkit.isNwjs()) nw.App.quit();}

Scene.isSceneChanging = function() {return this.exiting || (!!this.nextScene&&this.nextScene.changing);};
Scene.onSceneStart = function() {World.setStage(this.scene);}

Scene.pop=function () {
    if(this.stack.length > 0) this.goto(this.stack.pop())
    else this.exit()
}
Scene.goto=function (sceneClass) {
    if(sceneClass) this.nextScene = new sceneClass()
    if(this.scene) this.scene.stop()
}
Scene.push=function (sceneClass) {
    if(this.scene) this.stack.push(this.scene.constructor)
    this.goto(sceneClass)
}
Scene.exit=function (){
    this.goto(null)
    this.exiting = true
}
Scene.stop=function (){
    World.stopGame()
}
Scene.clearStack=function (){
    this.stack = []
}
Scene.snapForBackground = function(index) {
    if (this.snapshot[index]) this.snapshot[index].destroy();
    this.snapshot[index] = Bitmap.snap(this.scene);
};
Scene.destroyForBackground=function (index){
    if (this.snapshot[index]) this.snapshot[index].destroy();
    this.snapshot[index]=null
}


function Bitmap() {
    this.initialize(...arguments);
}
Bitmap.prototype.initialize = function(width, height) {
    this._canvas = null;
    this._context = null;
    this._baseTexture = null;
    this._image = null;
    this._url = "";
    this._paintOpacity = 255;
    this._smooth = true;
    this._loadListeners = [];
    this._loadingState = "none";
    if (width > 0 && height > 0) {this._createCanvas(width, height);}
    this.fontFace = "sans-serif";
    this.fontSize = 16;
    this.fontBold = false;
    this.fontItalic = false;
    this.textColor = "#ffffff";
    this.outlineColor = "rgba(0, 0, 0, 0.5)";
    this.outlineWidth = 3;
};
Bitmap.load = function(url) {
    const bitmap = Object.create(Bitmap.prototype);
    bitmap.initialize();
    bitmap._url = url;
    bitmap._startLoading();
    return bitmap;
};
Bitmap.snap = function(stage) {
    const width = World.canvasWidth;
    const height = World.canvasHeight;
    const bitmap = new Bitmap(width, height);
    const renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
        const renderer = World.app.renderer;
        renderer.render(stage, renderTexture);
        stage.worldTransform.identity();
        const canvas = renderer.extract.canvas(renderTexture);
        bitmap.context.drawImage(canvas, 0, 0);
        canvas.width = 0;
        canvas.height = 0;
    }
    renderTexture.destroy({ destroyBase: true });
    bitmap.baseTexture.update();
    return bitmap;
};
Bitmap.prototype.isReady = function() {
    return this._loadingState === "loaded" || this._loadingState === "none";
};
Bitmap.prototype.isError = function() {
    return this._loadingState === "error";
};
Object.defineProperty(Bitmap.prototype, "url", {
    get: function() {
        return this._url;
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "baseTexture", {
    get: function() {
        return this._baseTexture;
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "image", {
    get: function() {
        return this._image;
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "canvas", {
    get: function() {
        this._ensureCanvas();
        return this._canvas;
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "context", {
    get: function() {
        this._ensureCanvas();
        return this._context;
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "width", {
    get: function() {
        const image = this._canvas || this._image;
        return image ? image.width : 0;
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "height", {
    get: function() {
        const image = this._canvas || this._image;
        return image ? image.height : 0;
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "rect", {
    get: function() {
        return new Rectangle(0, 0, this.width, this.height);
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "smooth", {
    get: function() {
        return this._smooth;
    },
    set: function(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            this._updateScaleMode();
        }
    },
    configurable: true
});
Object.defineProperty(Bitmap.prototype, "paintOpacity", {
    get: function() {
        return this._paintOpacity;
    },
    set: function(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this.context.globalAlpha = this._paintOpacity / 255;
        }
    },
    configurable: true
});
Bitmap.prototype.destroy = function() {
    if (this._baseTexture) {
        this._baseTexture.destroy();
        this._baseTexture = null;
    }
    this._destroyCanvas();
};
Bitmap.prototype.resize = function(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this.canvas.width = width;
    this.canvas.height = height;
    this.baseTexture.width = width;
    this.baseTexture.height = height;
};
Bitmap.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        const image = source._canvas || source._image;
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._baseTexture.update();
    } catch (e) {
        //
    }
};
Bitmap.prototype.getPixel = function(x, y) {
    const data = this.context.getImageData(x, y, 1, 1).data;
    let result = "#";
    for (let i = 0; i < 3; i++) {
        result += data[i].toString(16).padZero(2);
    }
    return result;
};
Bitmap.prototype.getAlphaPixel = function(x, y) {
    const data = this.context.getImageData(x, y, 1, 1).data;
    return data[3];
};
Bitmap.prototype.clearRect = function(x, y, width, height) {
    this.context.clearRect(x, y, width, height);
    this._baseTexture.update();
};
Bitmap.prototype.clear = function() {
    this.clearRect(0, 0, this.width, this.height);
};
Bitmap.prototype.fillAll = function(color) {
    this.fillRect(0, 0, this.width, this.height, color);
};
Bitmap.prototype.fillRect = function(x, y, width, height, color) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.strokeRect = function(x, y, width, height, color,lineWidth) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.strokeRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawCircle = function(x, y, radius, color,borderColor,lineWidth) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.lineWidth = lineWidth||0;
    context.strokeStyle = borderColor || color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    if(lineWidth) context.stroke();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
        tx += maxWidth / 2;
    }
    if (align === "right") {
        tx += maxWidth;
    }
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    this._drawTextOutline(text, tx, ty, maxWidth);
    context.globalAlpha = alpha;
    this._drawTextBody(text, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.measureTextWidth = function(text) {
    const context = this.context;
    context.save();
    context.font = this._makeFontNameText();
    const width = context.measureText(text).width;
    context.restore();
    return width;
};
Bitmap.prototype.addLoadListener = function(listner) {
    if (!this.isReady()) {
        this._loadListeners.push(listner);
    } else {
        listner(this);
    }
};
Bitmap.prototype.retry = function() {
    this._startLoading();
};
Bitmap.prototype._makeFontNameText = function() {
    const italic = this.fontItalic ? "Italic " : "";
    const bold = this.fontBold ? "Bold " : "";
    return italic + bold + this.fontSize + "px " + this.fontFace;
};
Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {
    const context = this.context;
    context.strokeStyle = this.outlineColor;
    context.lineWidth = this.outlineWidth;
    context.lineJoin = "round";
    context.strokeText(text, tx, ty, maxWidth);
};
Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth, gradient) {
    const context = this.context;
    if (gradient) {
        const metrics = context.measureText(text);
        const textWidth = metrics.width;
        context.fillText(text, tx , ty, maxWidth); // Offset for centered text
    } else {
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }
};
Bitmap.prototype._createCanvas = function(width, height) {
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext("2d");
    this._canvas.width = width;
    this._canvas.height = height;
    this._createBaseTexture(this._canvas);
};
Bitmap.prototype._ensureCanvas = function() {
    if (!this._canvas) {
        if (this._image) {
            this._createCanvas(this._image.width, this._image.height);
            this._context.drawImage(this._image, 0, 0);
        } else {
            this._createCanvas(0, 0);
        }
    }
};
Bitmap.prototype._destroyCanvas = function() {
    if (this._canvas) {
        this._canvas.width = 0;
        this._canvas.height = 0;
        this._canvas = null;
    }
};
Bitmap.prototype._createBaseTexture = function(source) {
    this._baseTexture = new PIXI.BaseTexture(source);
    this._baseTexture.mipmap = false;
    this._baseTexture.width = source.width;
    this._baseTexture.height = source.height;
    this._updateScaleMode();
};
Bitmap.prototype._updateScaleMode = function() {
    if (this._baseTexture) {
        if (this._smooth) {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        } else {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
    }
};
Bitmap.prototype._startLoading = function() {
    this._image = new Image();
    this._image.onload = this._onLoad.bind(this);
    this._image.onerror = this._onError.bind(this);
    this._destroyCanvas();
    this._loadingState = "loading";
    this._image.src = this._url;
};
Bitmap.prototype._startDecrypting = function() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this._url + "_");
    xhr.responseType = "arraybuffer";
    xhr.onload = () => this._onXhrLoad(xhr);
    xhr.onerror = this._onError.bind(this);
    xhr.send();
};
Bitmap.prototype._onXhrLoad = function(xhr) {
    if (xhr.status < 400) {
        const arrayBuffer = xhr.response;
        const blob = new Blob([arrayBuffer]);
        this._image.src = URL.createObjectURL(blob);
    } else {
        this._onError();
    }
};
Bitmap.prototype._onLoad = function() {
    this._loadingState = "loaded";
    this._createBaseTexture(this._image);
    this._callLoadListeners();
}
Bitmap.prototype._callLoadListeners = function() {
    while (this._loadListeners.length > 0) {
        const listener = this._loadListeners.shift();
        listener(this);
    }
}
Bitmap.prototype._onError = function() {this._loadingState = "error"}


function Sprite() {
    this.initialize(...arguments);
}
Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;
Sprite.prototype.initialize = function(bitmap) {
    if (!Sprite._emptyBaseTexture) {
        Sprite._emptyBaseTexture = new PIXI.BaseTexture();
        Sprite._emptyBaseTexture.setSize(1, 1);
    }
    const frame = new Rectangle();
    const texture = new PIXI.Texture(Sprite._emptyBaseTexture, frame);
    PIXI.Sprite.call(this, texture);
    this.spriteId = Sprite._counter++;
    this._bitmap = bitmap;
    this._frame = frame;
    this._hue = 0;
    this._blendColor = [0, 0, 0, 0];
    this._colorTone = [0, 0, 0, 0];
    this._colorFilter = null;
    this._blendMode = PIXI.BLEND_MODES.NORMAL;
    this._hidden = false;
    this._onBitmapChange();
};
Sprite._emptyBaseTexture = null;
Sprite._counter = 0;
Object.defineProperty(Sprite.prototype, "bitmap", {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    },
    configurable: true
});
Object.defineProperty(Sprite.prototype, "width", {
    get: function() {
        return this._frame.width;
    },
    set: function(value) {
        this._frame.width = value;
        this._refresh();
    },
    configurable: true
});
Object.defineProperty(Sprite.prototype, "height", {
    get: function() {
        return this._frame.height;
    },
    set: function(value) {
        this._frame.height = value;
        this._refresh();
    },
    configurable: true
});
Object.defineProperty(Sprite.prototype, "opacity", {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});
Object.defineProperty(Sprite.prototype, "blendMode", {
    get: function() {
        if (this._colorFilter) {
            return this._colorFilter.blendMode;
        } else {
            return this._blendMode;
        }
    },
    set: function(value) {
        this._blendMode = value;
        if (this._colorFilter) {
            this._colorFilter.blendMode = value;
        }
    },
    configurable: true
});
Sprite.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Sprite.prototype.destroy.call(this, options);
};
Sprite.prototype.update = function() {
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};
Sprite.prototype.hide = function() {
    this._hidden = true;
    this.updateVisibility();
};
Sprite.prototype.show = function() {
    this._hidden = false;
    this.updateVisibility();
};
Sprite.prototype.updateVisibility = function() {
    this.visible = !this._hidden;
};
Sprite.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};
Sprite.prototype.setFrame = function(x, y, width, height) {
    this._refreshFrame = false;
    const frame = this._frame;
    if (
        x !== frame.x ||
        y !== frame.y ||
        width !== frame.width ||
        height !== frame.height
    ) {
        frame.x = x;
        frame.y = y;
        frame.width = width;
        frame.height = height;
        this._refresh();
    }
};
Sprite.prototype.setHue = function(hue) {
    if (this._hue !== Number(hue)) {
        this._hue = Number(hue);
        this._updateColorFilter();
    }
};
Sprite.prototype.getBlendColor = function() {
    return this._blendColor.clone();
};
Sprite.prototype.setBlendColor = function(color) {
    if (!(color instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    if (!this._blendColor.equals(color)) {
        this._blendColor = color.clone();
        this._updateColorFilter();
    }
};
Sprite.prototype.getColorTone = function() {
    return this._colorTone.clone();
};
Sprite.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    if (!this._colorTone.equals(tone)) {
        this._colorTone = tone.clone();
        this._updateColorFilter();
    }
};
Sprite.prototype._onBitmapChange = function() {
    if (this._bitmap) {
        this._refreshFrame = true;
        this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
    } else {
        this._refreshFrame = false;
        this.texture.frame = new Rectangle();
    }
};
Sprite.prototype._onBitmapLoad = function(bitmapLoaded) {
    if (bitmapLoaded === this._bitmap) {
        if (this._refreshFrame && this._bitmap) {
            this._refreshFrame = false;
            this._frame.width = this._bitmap.width;
            this._frame.height = this._bitmap.height;
        }
    }
    this._refresh();
};
Sprite.prototype._refresh = function() {
    const texture = this.texture;
    const frameX = Math.floor(this._frame.x);
    const frameY = Math.floor(this._frame.y);
    const frameW = Math.floor(this._frame.width);
    const frameH = Math.floor(this._frame.height);
    const baseTexture = this._bitmap ? this._bitmap.baseTexture : null;
    const baseTextureW = baseTexture ? baseTexture.width : 0;
    const baseTextureH = baseTexture ? baseTexture.height : 0;
    const realX = frameX.clamp(0, baseTextureW);
    const realY = frameY.clamp(0, baseTextureH);
    const realW = (frameW - realX + frameX).clamp(0, baseTextureW - realX);
    const realH = (frameH - realY + frameY).clamp(0, baseTextureH - realY);
    const frame = new Rectangle(realX, realY, realW, realH);
    if (texture) {
        this.pivot.x = frameX - realX;
        this.pivot.y = frameY - realY;
        if (baseTexture) {
            texture.baseTexture = baseTexture;
            try {
                texture.frame = frame;
            } catch (e) {
                texture.frame = new Rectangle();
            }
        }
        texture._updateID++;
    }
};
Sprite.prototype._createColorFilter = function() {
    this._colorFilter = new ColorFilter();
    if (!this.filters) {
        this.filters = [];
    }
    this.filters.push(this._colorFilter);
};
Sprite.prototype._updateColorFilter = function() {
    if (!this._colorFilter) {
        this._createColorFilter();
    }
    this._colorFilter.setHue(this._hue);
    this._colorFilter.setBlendColor(this._blendColor);
    this._colorFilter.setColorTone(this._colorTone);
};
Sprite.prototype.getTotalValue = function(propertyName) {
    let total = this[propertyName];
    for (let current = this; current && current.parent && current.parent[propertyName]; current = current.parent) {
        total += current.parent[propertyName];
    }
    return total;
}
Sprite.prototype.getX = function() {return this.getTotalValue('x')}
Sprite.prototype.getY = function() {return this.getTotalValue('y')}

function Rectangle() {this.initialize(...arguments);}
Rectangle.prototype = Object.create(PIXI.Rectangle.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.initialize = function(x, y, width, height) {PIXI.Rectangle.call(this, x, y, width, height);};

function ColorFilter() {
    this.initialize(...arguments);
}
ColorFilter.prototype = Object.create(PIXI.Filter.prototype);
ColorFilter.prototype.constructor = ColorFilter;
ColorFilter.prototype.initialize = function() {
    this.uniforms={}
    PIXI.Filter.call(this, null, this._fragmentSrc());
    this.uniforms.hue = 0;
    this.uniforms.colorTone = [0, 0, 0, 0];
    this.uniforms.blendColor = [0, 0, 0, 0];
    this.uniforms.brightness = 255;
};
ColorFilter.prototype.setHue = function(hue) {
    this.uniforms.hue = Number(hue);
};
ColorFilter.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    this.uniforms.colorTone = tone.clone();
};
ColorFilter.prototype.setBlendColor = function(color) {
    if (!(color instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    this.uniforms.blendColor = color.clone();
};
ColorFilter.prototype.setBrightness = function(brightness) {
    this.uniforms.brightness = Number(brightness);
};
ColorFilter.prototype._fragmentSrc = function() { return "varying vec2 vTextureCoord;uniform sampler2D uSampler;uniform float hue;uniform vec4 colorTone;uniform vec4 blendColor;uniform float brightness;vec3 rgbToHsl(vec3 rgb){float r=rgb.r;float g=rgb.g;float b=rgb.b;float cmin=min(r,min(g,b));float cmax=max(r,max(g,b));float h=0.0;float s=0.0;float l=(cmin+cmax)/2.0;float delta=cmax-cmin;if(delta>0.0){if(r==cmax){h=mod((g-b)/delta+6.0,6.0)/6.0;}else if(g==cmax){h=((b-r)/delta+2.0)/6.0;}else{h=((r-g)/delta+4.0)/6.0;}if(l<1.0){s=delta/(1.0-abs(2.0*l-1.0));}}return vec3(h,s,l);}vec3 hslToRgb(vec3 hsl){float h=hsl.x;float s=hsl.y;float l=hsl.z;float c=(1.0-abs(2.0*l-1.0))*s;float x=c*(1.0-abs((mod(h*6.0,2.0))-1.0));float m=l-c/2.0;float cm=c+m;float xm=x+m;if(h<1.0/6.0){return vec3(cm,xm,m);}else if(h<2.0/6.0){return vec3(xm,cm,m);}else if(h<3.0/6.0){return vec3(m,cm,xm);}else if(h<4.0/6.0){return vec3(m,xm,cm);}else if(h<5.0/6.0){return vec3(xm,m,cm);}else{return vec3(cm,m,xm);}}void main(){vec4 sample=texture2D(uSampler,vTextureCoord);float a=sample.a;vec3 hsl=rgbToHsl(sample.rgb);hsl.x=mod(hsl.x+hue/360.0,1.0);hsl.y=hsl.y*(1.0-colorTone.a/255.0);vec3 rgb=hslToRgb(hsl);float r=rgb.r;float g=rgb.g;float b=rgb.b;float r2=colorTone.r/255.0;float g2=colorTone.g/255.0;float b2=colorTone.b/255.0;float r3=blendColor.r/255.0;float g3=blendColor.g/255.0;float b3=blendColor.b/255.0;float i3=blendColor.a/255.0;float i1=1.0-i3;r=clamp((r/a+r2)*a,0.0,1.0);g=clamp((g/a+g2)*a,0.0,1.0);b=clamp((b/a+b2)*a,0.0,1.0);r=clamp(r*i1+r3*i3*a,0.0,1.0);g=clamp(g*i1+g3*i3*a,0.0,1.0);b=clamp(b*i1+b3*i3*a,0.0,1.0);r=r*brightness/255.0;g=g*brightness/255.0;b=b*brightness/255.0;gl_FragColor=vec4(r,g,b,a);}"; };