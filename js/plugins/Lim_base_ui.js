/*:
 * @target MZ
 * @plugindesc UI核心
 * @author Limpid
 * -----------------------------------------------------------------------------
 * @help
 * 使用 MIT 许可证发布。
 * 
 * ui系统依赖代码
 */
var LIM = LIM || {};
LIM.UTILS=LIM.UTILS||{};
((_)=>{
    _.sinNum=function(max,i){return Math.sin(Math.PI/2/max*i).toFixed(7)}
    _.lengthNum=function(num){
        try {
            if(isNaN(num))
            {
                if(num.split("w").length>1) {
                    let arr = num.split("w")
                    let a = parseFloat(arr[0]) * 0.01 * Graphics.width
                    let b = arr[1] ? parseFloat(arr[1]) : 0
                    return a + b
                }
                else if(num.split("h").length>1) {
                    let arr = num.split("h")
                    let a = parseFloat(arr[0]) * 0.01 * Graphics.height
                    let b = arr[1] ? parseFloat(arr[1]) : 0
                    return a + b
                }
                else return 0
            }
            else return parseFloat(num)
        }
        catch (e) {
            return 0
        }
    }
    _.rpgaReduce=function(r,g,b,a){
        return _.radixNum(Math.min(r,255),10,16)+
            _.radixNum(Math.min(g,255),10,16)+
            _.radixNum(Math.min(b,255),10,16)+
            _.radixNum(Math.min(a,255),10,16)
    }
    _.radixNum = function (num, m, n) {
        num=typeof(num)==='string' ?num:String(num)
        const _DEFAULT_={initNum:10}
        m=m===0?_DEFAULT_.initNum:m
        n=n===0?_DEFAULT_.initNum:n
        n=m&&!n?_DEFAULT_.initNum:n;
        return parseInt(num,m).toString(n)
    }
    _.atBit=function(num,bit){return num>>bit&1}
    _.setBit=function(num,bit,bool) {
        if (bool) return num | (1 << bit);
    }
    _.sortBy=function(property,desc){
        return function (v1,v2) {return (v2[property]>v1[property]?1:-1)*(desc?1:-1)}
    }
    _.union=function(arr1,arr2) {return [...new Set([...arr1, ...arr2])]}
    _.inter=function(arr1,arr2) {return new Set([...arr1].filter(x=>arr2.has(x)))}
    _.diff=function(arr1,arr2) {return new Set([...arr1].filter(x=>!arr2.has(x)))}
    _.azimuth = function(dual, angle, d) {
        return [dual[0] + d * Math.cos(angle),dual[1] + d * Math.sin(angle)];
    };
})(LIM.UTILS);

Bitmap.prototype.clearRoundRect = function(x, y, width, height, radius) {
    const context = this.context;
    const x0 = x;
    const y0 = y;
    const x1 = x + width;
    const y1 = y + height;
    context.beginPath();
    context.moveTo(x0 + radius, y0);
    context.arcTo(x1, y0, x1, y1, radius);
    context.arcTo(x1, y1, x0, y1, radius);
    context.arcTo(x0, y1, x0, y0, radius);
    context.arcTo(x0, y0, x1, y0, radius);
    context.closePath();
    context.save();
    context.clip();
    context.clearRect(x, y, width, height);
    context.restore();
};
Bitmap.prototype.roundedBlt = function(source,radius, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        const image = source._canvas || source._image;
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(dx + radius, dy);
        this.context.arcTo(dx + dw, dy, dx + dw, dy + dh, radius);
        this.context.arcTo(dx + dw, dy + dh, dx, dy + dh, radius);
        this.context.arcTo(dx, dy + dh, dx, dy, radius);
        this.context.arcTo(dx, dy, dx + dw, dy, radius);
        this.context.closePath();
        this.context.clip();
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this.context.restore();
        this._baseTexture.update();
    }
    catch (e) {

    }
};
Bitmap.prototype.circularBlt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        const image = source._canvas || source._image;
        this.context.save();
        this.context.beginPath();
        const radius = Math.min(dw, dh) / 2;
        const centerX = dx + dw / 2;
        const centerY = dy + dh / 2;
        this.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.context.closePath();
        this.context.clip();
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this.context.restore();
        this._baseTexture.update();
    }
    catch (e) {}
};
Bitmap.prototype.diamondBlt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        const image = source._canvas || source._image;
        this.context.beginPath();
        this.context.moveTo(dx + dw / 2, dy);
        this.context.lineTo(dx + dw, dy + dh / 2);
        this.context.lineTo(dx + dw / 2, dy + dh);
        this.context.lineTo(dx, dy + dh / 2);
        this.context.closePath();
        this.context.clip();
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._baseTexture.update();
        this.context.restore();
    } catch (e) {}
};
Bitmap.prototype.drawConnectedLines = function(points, color, lineWidth) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    const lines = [];
    for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];
        lines.push([...startPoint, ...endPoint]);
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [x1, y1, x2, y2] = line;
        if (i === 0) {
            context.moveTo(x1, y1);
        }
        context.lineTo(x2, y2);
    }
    context.stroke();
    context.restore();
}
Bitmap.prototype.drawIrregularLines = function(points, lineTypes, lineColors, lineWidths) {
    const context = this.context;
    context.save();
    context.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];
        const lineType = lineTypes[i];
        context.strokeStyle = lineColors[i];
        context.lineWidth = lineWidths[i];
        switch (lineType) {
            case 'line':
                context.moveTo(startPoint[0], startPoint[1]);
                context.lineTo(endPoint[0], endPoint[1]);
                break;

            case 'arc':
                const [x1, y1] = startPoint;
                const [x2, y2] = endPoint;
                const centerX = (x1 + x2) / 2;
                const centerY = (y1 + y2) / 2;
                const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
                const startAngle = Math.atan2(y1 - centerY, x1 - centerX);
                const endAngle = Math.atan2(y2 - centerY, x2 - centerX);
                context.arc(centerX, centerY, radius, startAngle, endAngle);
                break;
            case 'curve':
                context.quadraticCurveTo(startPoint[0], startPoint[1],endPoint[0], endPoint[1]);
                break;
        }
    }
    context.stroke();
    context.restore();
}

Bitmap.prototype.drawLine=function (x1, y1, x2, y2, color, lineWidth) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.restore();
}
Bitmap.prototype.drawArc=function (x1, y1, x2, y2, color, lineWidth) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
    const startAngle = Math.atan2(y1 - centerY, x1 - centerX);
    const endAngle = Math.atan2(y2 - centerY, x2 - centerX);
    context.arc(centerX, centerY, radius, startAngle, endAngle);
    context.stroke();
    context.restore();
}
Bitmap.prototype.drawCurve=function (x1,y1,x2,y2, color, lineWidth) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.quadraticCurveTo(x1 + (x2 - x1) / 2, y1, x2, y2);
    context.stroke();
    context.restore();
}
Bitmap.prototype.strokeRect = function(x, y, width, height, color, lineWidth) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth; // 设置线宽属性
    context.strokeRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
}

Bitmap.prototype.fillRoundedRect = function(x, y, width, height, radius, color) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();

    context.fill();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.strokeRoundedRect = function(x, y, width, height, radius, color, lineWidth) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;

    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();

    context.stroke();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3, color) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.closePath();
    context.fill();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.gradientRoundedRect = function(x, y, width, height, radius, color1, color2, vertical) {
    const context = this.context;
    const cornerRadius = Math.min(Math.min(width, height) / 2, radius);
    const grad = context.createLinearGradient(x, y, x + (vertical ? 0 : width), y + (vertical ? height : 0));
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.beginPath();
    context.moveTo(x + cornerRadius, y);
    context.lineTo(x + width - cornerRadius, y);
    context.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
    context.lineTo(x + width, y + height - cornerRadius);
    context.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius);
    context.lineTo(x + cornerRadius, y + height);
    context.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);
    context.lineTo(x, y + cornerRadius);
    context.arcTo(x, y, x + cornerRadius, y, cornerRadius);
    context.closePath();
    context.fill();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.fillStripedRoundedRect = function(x, y, width, height, radius, stripeHeight, color1, color2) {
    const context = this.context;
    context.save();
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    patternCanvas.width = width;
    patternCanvas.height = stripeHeight * 2;
    patternCtx.fillStyle = color1;
    patternCtx.fillRect(0, 0, width, stripeHeight);
    patternCtx.fillStyle = color2;
    patternCtx.fillRect(0, stripeHeight, width, stripeHeight);

    context.fillStyle = context.createPattern(patternCanvas, 'repeat');
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
    context.fill();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.fillLatticeRoundedRect = function(x, y, width, height, radius, stripeWidth, stripeHeight, color1, color2) {
    const context = this.context;
    context.save();
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    patternCanvas.width = stripeWidth * 2;
    patternCanvas.height = stripeHeight * 2;

    patternCtx.fillStyle = color1;
    patternCtx.fillRect(0,0, stripeWidth, stripeHeight);
    patternCtx.fillRect(stripeWidth, stripeHeight, stripeWidth, stripeHeight);
    patternCtx.fillStyle = color2;
    patternCtx.fillRect(stripeWidth, 0, stripeWidth, stripeHeight);
    patternCtx.fillRect(0, stripeHeight, stripeWidth, stripeHeight);

    context.fillStyle = context.createPattern(patternCanvas, 'repeat');
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
    context.fill();
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
Bitmap.prototype.drawSector = function(x, y, radius, startAngleDegree, endAngleDegree, color, borderColor, lineWidth) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.lineWidth = lineWidth || 0;
    context.strokeStyle = borderColor || color;
    context.beginPath();
    const startAngle = startAngleDegree * Math.PI / 180;
    const endAngle = (startAngleDegree+endAngleDegree) * Math.PI / 180;
    context.moveTo(x, y);
    context.arc(x, y, radius, startAngle, endAngle, false);
    context.lineTo(x, y);
    context.fill();
    if (lineWidth) context.stroke();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawPolygon = function(points, color, borderColor, lineWidth) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.lineWidth = lineWidth || 0;
    context.strokeStyle = borderColor || color;
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    context.fill();
    if (lineWidth) context.stroke();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawRegularPolygon = function(x, y,side, size, color,borderColor,lineWidth) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.lineWidth = lineWidth||0;
    context.strokeStyle = borderColor || color;
    context.beginPath();
    for (let i = 0; i < side; i++) {
        const angleRad = Math.PI /(side/2) * i+22.5;
        const xx = x + size * Math.cos(angleRad);
        const yy = y + size * Math.sin(angleRad);
        if (i === 0) {
            context.moveTo(xx, yy);
        } else {
            context.lineTo(xx, yy);
        }
    }
    context.closePath();
    if(lineWidth) context.stroke();
    context.fill();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawStar = function(x, y,side, size,color,borderColor,lineWidth) {
    const context = this.context;
    const innerRadius = size / 2;
    const outerRadius = size;
    const numPoints = side;
    const angle = Math.PI / numPoints;
    context.save();
    context.beginPath();
    context.translate(x, y);
    context.moveTo(0, -outerRadius);
    for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const currentAngle = angle * i;
        const xCoordinate = radius * Math.sin(currentAngle);
        const yCoordinate = radius * -Math.cos(currentAngle);
        context.lineTo(xCoordinate, yCoordinate);
    }
    context.closePath();
    context.fillStyle = color;
    context.lineWidth = lineWidth||0;
    context.strokeStyle = borderColor || color;
    if(lineWidth) context.stroke();
    context.fill();
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawRing = function(x, y, innerRadius, outerRadius, color, borderColor, lineWidth) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.strokeStyle = borderColor || color;
    context.lineWidth = lineWidth || 0;
    context.beginPath();
    context.arc(x, y, outerRadius, 0, Math.PI * 2, false);
    context.arc(x, y, innerRadius, 0, Math.PI * 2, true); // 内部圆弧
    context.closePath();
    if (lineWidth) context.stroke();
    context.fill(); // 填充颜色
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawTextWithGradient = function(text,x,y,maxWidth,lineHeight,align,gradientColors) {
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") { tx += maxWidth / 2;}
    if (align === "right") {tx += maxWidth;}
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    const gradient = context.createLinearGradient(tx, ty - this.fontSize, tx, ty + this.fontSize);
    for (let i = 0; i < gradientColors.length; i++) {gradient.addColorStop((i) / (gradientColors.length), gradientColors[i]);}
    context.fillStyle = gradient;
    this._drawTextOutline(text, tx, ty, maxWidth);
    this._drawTextBody(text, tx, ty, maxWidth, gradient);
    context.globalAlpha = alpha;
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype._drawTextBody = function(text,tx,ty,maxWidth,gradient) {
    const context = this.context;
    if (gradient) {
        const metrics = context.measureText(text);
        const textWidth = metrics.width;
        context.fillText(text, tx , ty, maxWidth);
    } else {
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }
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
function Weaver() {
    this.initialize.apply(this, arguments);
}
Weaver.prototype = Object.create(Sprite.prototype);
Weaver.prototype.constructor = Weaver;
Weaver.prototype.initialize = function (orgin) {
    Sprite.prototype.initialize.call(this)
    this.alpha =0
    this._orgin=orgin
    this._load = 0
    this._mod = -1
    this._stack = []
    this._mode = 0
    this.install()
    this.hatch()
    this.stateStore()
}
Weaver.prototype.install = function (){
    this._window={}
}
Weaver.prototype.stateStore=function (){
    this._state={}
}
Weaver.prototype.modify=function (mode){
    if(this._state[mode]&&this._mod!==mode){
        this._stack.push(this._mod)
        this._mod=mode
        for(let name of Object.keys(this._state[mode])){
            if(this._state[mode][name][0]) this._window[name].start()
            else this._window[name].stop()
            if(this._state[mode][name][1]) this._window[name].show()
            else this._window[name].hide()
        }
    }
}
Weaver.prototype.update=function (){
    if(this._load) return
    switch (this._mode){
        case 0: this.execute();break
        case 1:
            for (const child of this.children) {
                if (child.update) {
                    child.update();
                }
            }
    }
}
Weaver.prototype.execute = function() {
    this._mode =1
    this.alpha=1
    for(let key in this._window)
        this._window[key].execute()
}
Weaver.prototype.hatch=function (){
    for (let key in this._window){
        let item=this._window[key]
        for(let img in item.img)
            item.loadBit(img,item.img[img])
    }
    this._orgin.addChild(this)
}
Weaver.prototype.death=function (){
    const children=this._orgin.children
    for(let i=0;i<children.length;i++){
        if(children[i]===this){
            children.splice(i,1)
            break
        }
    }
    for(let key of Object.keys(this._window)) this._window[key] .destroy()
    this.removeChildren()
    this.destroy()
}
Weaver.prototype.prevMod=function (){
    if(this._stack.length)
        return this._stack[this._stack.length-1]
    else
        return -1
}
////


////
