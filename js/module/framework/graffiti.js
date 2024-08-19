/**
 * Graffiti 类，用于在画布上绘制涂鸦。
 */
function Graffiti() {throw new Error("static class");}
Graffiti.ctx=null
Graffiti.contPaint=false
Graffiti.setCtx=function (ctx){
    Graffiti.ctx=ctx
}
/**
 * 设置画布的透明度。
 *
 * @param {number} alpha - 透明度值，范围在 0 到 1 之间。
 */
Graffiti.setAlpha=function (alpha=1){
    if(Graffiti.ctx) {
        Graffiti.ctx.globalAlpha = alpha;
    }
}

/**
 * 清除画布的透明度设置，将透明度重置为 1。
 */
Graffiti.clearAlpha=function (alpha){
    Graffiti.setAlpha()
}

/**
 * 设置画布的填充样式。
 *
 * @param {string|CanvasGradient|CanvasPattern} style - 填充样式，可以是颜色、渐变或图案。
 */
Graffiti.setFillStyle=function (style="#fff"){
    if(Graffiti.ctx) {
        Graffiti.ctx.fillStyle=style
    }
}
/**
 * 清除画布的填充样式，将填充样式重置为白色。
 */
Graffiti.clearFillStyle=function (){
   Graffiti.setFillStyle()
}
/**
 * 设置画布的描边样式。
 *
 * @param {string|CanvasGradient|CanvasPattern} style - 描边样式，可以是颜色、渐变或图案。
 */
Graffiti.setStrokeStyle=function (style="#000"){
    if(Graffiti.ctx) {
        Graffiti.ctx.strokeStyle=style
    }
}
/**
 * 清除画布的描边样式，将描边样式重置为黑色。
 */
Graffiti.clearStrokeStyle=function (){
    Graffiti.setStrokeStyle()
}
/**
 * 设置画布的线条样式。
 *
 * @param {number} [width=1] - 线条宽度。
 * @param {number[]} [dash=[]] - 虚线数组，格式为 [长度, 间隔, 长度, 间隔, ...]，例如 [5, 15] 表示线段长度为 5，间隔为 15。
 * @param {number} [offset=0] - 虚线偏移量。
 * @param {CanvasLineCap} [cap='butt'] - 线条末端样式，可选值：
 *    'butt' - 线条末端平滑，不添加额外宽度。
 *    'round' - 线条末端为圆形，添加半径为线宽一半的圆。
 *    'square' - 线条末端为方形，添加一个线宽一半的正方形。
 * @param {CanvasLineJoin} [join='miter'] - 线条连接处样式，可选值：
 *    'bevel' - 连接处为斜角。
 *    'round' - 连接处为圆角。
 *    'miter' - 连接处为尖角，可能会延伸到外部。
 */
Graffiti.setLineStyle = function (width = 1, dash = [], offset = 0, cap = 'butt', join = 'miter') {
    if(Graffiti.ctx) {
        Graffiti.ctx.lineWidth=width
        Graffiti.ctx.lineCap = cap
        Graffiti.ctx.lineJoin = join
        Graffiti.ctx.setLineDash(dash)
        Graffiti.ctx.lineDashOffset=offset
    }
};

/**
 * 设置画布的阴影样式。
 *
 * @param {string} [color="#000"] - 阴影颜色。
 * @param {number} [blur=0] - 阴影模糊程度。
 * @param {number} [ox=0] - 阴影在 X 轴上的偏移量。
 * @param {number} [oy=0] - 阴影在 Y 轴上的偏移量。
 */
Graffiti.setShadowStyle = function (color = "#000", blur = 0, ox = 0, oy = 0) {
    if(Graffiti.ctx) {
        Graffiti.ctx.shadowColor = color
        Graffiti.ctx.shadowBlur = blur
        Graffiti.ctx.shadowOffsetX = ox;
        Graffiti.ctx.shadowOffsetY = oy;
    }
};

/**
 * 创建线性渐变。
 *
 * @param {[number, number]} p1 - 起点坐标 [x0, y0]。
 * @param {[number, number]} p2 - 终点坐标 [x1, y1]。
 * @param {[number, string][]} arr - 渐变色数组，每个元素为 [偏移量, 颜色]。
 * @returns {CanvasGradient} 创建的线性渐变。
 */
Graffiti.linearGradient = function (p1, p2, arr) {
    if (Graffiti.ctx) {
        const [x0, y0] = p1;
        const [x1, y1] = p2;
        const gradient = Graffiti.ctx.createLinearGradient(x0, y0, x1, y1);
        arr.forEach(([offset, color]) => gradient.addColorStop(offset, color));
        return gradient;
    }
};

/**
 * 创建径向渐变。
 *
 * @param {[number, number, number]} c1 - 内圆参数 [x0, y0, r0]。
 * @param {[number, number, number]} c2 - 外圆参数 [x1, y1, r1]。
 * @param {[number, string][]} arr - 渐变色数组，每个元素为 [偏移量, 颜色]。
 * @returns {CanvasGradient} 创建的径向渐变。
 */
Graffiti.radialGradient = function (c1, c2, arr) {
    if (Graffiti.ctx) {
        const [x0, y0, r0] = c1;
        const [x1, y1, r1] = c2;
        const gradient = Graffiti.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        arr.forEach(([offset, color]) => gradient.addColorStop(offset, color));
        return gradient;
    }
};

/**
 * 绘制一条线段。
 *
 * @param {[number, number]} p1 - 起点坐标 [x, y]。
 * @param {[number, number]} p2 - 终点坐标 [x, y]。
 */
Graffiti.drawLine = function (p1, p2,contPaint) {
    if (Graffiti.ctx) {
        if(!Graffiti.contPaint) {
            Graffiti.ctx.save();
            Graffiti.ctx.beginPath();
        }
        if(!contPaint) Graffiti.ctx.moveTo(p1[0], p1[1]);
        Graffiti.ctx.lineTo(p2[0], p2[1]);

        if(!Graffiti.contPaint) {
            Graffiti.ctx.stroke();
            Graffiti.ctx.restore();
        }
    }
};
/**
 * 绘制一条圆弧。
 *
 * @param {[number, number]} p1 - 起点坐标 [x, y]。
 * @param {[number, number]} p2 - 终点坐标 [x, y]。
 * @param {boolean} [reverse=false] - 是否逆时针绘制圆弧。
 */
Graffiti.drawArc=function (p1,p2,reverse=false){
    if(Graffiti.ctx) {
        if(!Graffiti.contPaint) {
            Graffiti.ctx.save();
            Graffiti.ctx.beginPath();
        }
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / 2;
        const startAngle = Math.atan2(y1 - centerY, x1 - centerX);
        const endAngle = Math.atan2(y2 - centerY, x2 - centerX);
        Graffiti.ctx.arc(centerX, centerY, radius, reverse ? startAngle : endAngle, reverse ? endAngle : startAngle);

        if(!Graffiti.contPaint) {
            Graffiti.ctx.stroke();
            Graffiti.ctx.restore();
        }
        
    }
}
/**
 * 绘制一条二次贝塞尔曲线。
 *
 * @param {[number, number]} p1 - 起点坐标 [x, y]。
 * @param {[number, number]} p2 - 终点坐标 [x, y]。
 * @param {number} [angleDegrees=0] - 控制点偏移角度（度数），以起点和终点的连线为基准。
 * @param {number} [offset=0.5] - 控制点的偏移比例，0 到 1 之间。
 */
Graffiti.drawCurve = function(p1, p2, angleDegrees = 0, offset = 0.5,contPaint) {
    if (Graffiti.ctx) {
        if(!Graffiti.contPaint) {
            Graffiti.ctx.save();
            Graffiti.ctx.beginPath();
        }
        if(!contPaint) Graffiti.ctx.moveTo(p1[0], p1[1]);
        const midX = (p1[0] + p2[0]) / 2;
        const midY = (p1[1] + p2[1]) / 2;
        const lineAngle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        const controlAngle = lineAngle + angleDegrees * (Math.PI / 180);
        const distance = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * offset;
        Graffiti.ctx.quadraticCurveTo(
            midX + distance * Math.cos(controlAngle),
            midY + distance * Math.sin(controlAngle),
            p2[0], p2[1]
        );
        if(!Graffiti.contPaint) {
            Graffiti.ctx.stroke();
            Graffiti.ctx.restore();
        }
        
    }
}
/**
 * 绘制一条三次贝塞尔曲线。
 *
 * @param {[number, number]} p1 - 起点坐标 [x, y]。
 * @param {[number, number]} p2 - 终点坐标 [x, y]。
 * @param {number} [angleDegrees1=0] - 第一个控制点的偏移角度（度数），以起点和终点的连线为基准。
 * @param {number} [offset1=0.5] - 第一个控制点的偏移比例，0 到 1 之间。
 * @param {number} [angleDegrees2=0] - 第二个控制点的偏移角度（度数），以起点和终点的连线为基准。
 * @param {number} [offset2=0.5] - 第二个控制点的偏移比例，0 到 1 之间。
 */
Graffiti.drawBezier = function(p1, p2, angleDegrees1 = 0, offset1 = 0.5, angleDegrees2 = 0, offset2 = 0.5,contPaint) {
    if (Graffiti.ctx) {
        if(!Graffiti.contPaint) {
            Graffiti.ctx.save();
            Graffiti.ctx.beginPath();
        }
        if(!contPaint) Graffiti.ctx.moveTo(p1[0], p1[1]);
        const midX = (p1[0] + p2[0]) / 2;
        const midY = (p1[1] + p2[1]) / 2;
        const lineAngle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        const controlAngle1 = lineAngle + angleDegrees1 * (Math.PI / 180);
        const controlAngle2 = lineAngle + angleDegrees2 * (Math.PI / 180);
        const distance1 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * offset1;
        const distance2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * offset2;
        const controlPoint1 = [
            midX + distance1 * Math.cos(controlAngle1),
            midY + distance1 * Math.sin(controlAngle1)
        ];

        const controlPoint2 = [
            midX + distance2 * Math.cos(controlAngle2),
            midY + distance2 * Math.sin(controlAngle2)
        ];
        Graffiti.ctx.bezierCurveTo(
            controlPoint1[0], controlPoint1[1],
            controlPoint2[0], controlPoint2[1],
            p2[0], p2[1]
        );
        if(!Graffiti.contPaint) {
            Graffiti.ctx.stroke();
            Graffiti.ctx.restore();
        }
    }
}
/**
 * 连接一组点，绘制由线段、弧、二次曲线和三次贝塞尔曲线组成的图形。
 *
 * @param {Array} arr - 一个包含绘制指令的数组。数组中的每个元素是一个对象，包含以下属性：
 *    - `p`: [number, number] - 点的坐标，格式为 [x, y]。
 *    - `line`: string - 绘制的线段类型，可以是 "line"（直线）、"arc"（弧）、"curve"（二次曲线）或 "bezier"（三次贝塞尔曲线）。
 *    - `angle`: number (可选) - 对于曲线类型（"curve"、"bezier"），控制点偏移角度（度数）。
 *    - `offset`: number (可选) - 对于曲线类型（"curve"、"bezier"），控制点的偏移比例，0 到 1 之间。
 *    - `angle1`: number (可选) - 对于三次贝塞尔曲线（"bezier"），第一个控制点的偏移角度（度数）。
 *    - `offset1`: number (可选) - 对于三次贝塞尔曲线（"bezier"），第一个控制点的偏移比例，0 到 1 之间。
 *    - `angle2`: number (可选) - 对于三次贝塞尔曲线（"bezier"），第二个控制点的偏移角度（度数）。
 *    - `offset2`: number (可选) - 对于三次贝塞尔曲线（"bezier"），第二个控制点的偏移比例，0 到 1 之间。
 *    - `reverse`: boolean (可选) - 对于弧线（"arc"），指示是否反向绘制。
 */
Graffiti.connect = function (arr) {
    Graffiti.contPaint = true;
    if (Graffiti.ctx) {
        Graffiti.ctx.save();
        Graffiti.ctx.beginPath();
        for (let i = 1; i < arr.length; i++) {
            switch (arr[i].line) {
                case "line":
                    Graffiti.drawLine(arr[i - 1].point, arr[i].point,i>1);
                    break;
                case "arc":
                    Graffiti.drawArc(arr[i - 1].point, arr[i].point, arr[i].reverse);
                    break;
                case "curve":
                    Graffiti.drawCurve(arr[i - 1].point, arr[i].point, arr[i].angle, arr[i].offset,i>1);
                    break;
                case "bezier":
                    Graffiti.drawBezier(arr[i - 1].point, arr[i].point, arr[i].angle, arr[i].offset, arr[i].angle2, arr[i].offset2,i>1);
                    break;
            }
        }
        Graffiti.ctx.fill()
        Graffiti.ctx.stroke();
        Graffiti.ctx.restore();
    }
    Graffiti.contPaint = false;
}
Graffiti.location = function(point, angle, distance) {
    return angle.map((ang, i) => {
        let { x, y } = Toolkit.azimuth({ x: point[0], y: point[1] }, Toolkit.toRadians(ang), distance[i]);
        return [x, y];
    });
};
