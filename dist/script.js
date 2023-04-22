"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Drawer_instances, _Drawer_drawFillRect, _Drawer_drawStrokeRect, _ImageArtist_instances, _ImageArtist_initElements, _ImageArtist_initEvents;
const IMAGE_ARTIST_SHAPE_TYPES = {
    Rect: "rect",
    Circle: "circle",
    Arc: "arc",
    Line: "line",
    Triangle: "triangle",
    Polygone: "polygone",
};
function log(...msg) {
    const debug = true;
    if (debug) {
        console.log(...msg);
    }
}
function createLabel(text) {
    let label = document.createElement('div');
    label.className = ('artist-label');
    let textNode = document.createTextNode(text);
    label.appendChild(textNode);
    return label;
}
function calculateLableAlignPoint(mark) {
    let x = 0, y = 0;
    switch (mark.shape) {
        case IMAGE_ARTIST_SHAPE_TYPES.Rect:
            x = mark.coords[0] + (mark.coords[2] / 2);
            y = mark.coords[1] + (mark.coords[3] / 2);
            break;
        case IMAGE_ARTIST_SHAPE_TYPES.Arc:
        case IMAGE_ARTIST_SHAPE_TYPES.Circle:
        case IMAGE_ARTIST_SHAPE_TYPES.Polygone:
            x = mark.coords[0];
            y = mark.coords[1];
            break;
        case IMAGE_ARTIST_SHAPE_TYPES.Line:
            x = (mark.coords[0] + mark.coords[2]) / 2;
            y = (mark.coords[1] + mark.coords[3]) / 2;
            break;
        case IMAGE_ARTIST_SHAPE_TYPES.Triangle:
            x = (mark.coords[0] + mark.coords[2] + mark.coords[4]) / 3;
            y = (mark.coords[1] + mark.coords[3] + mark.coords[5]) / 3;
            break;
        default:
            throw new Error('Invalid shape');
    }
    return { x, y };
}
class Drawer {
    constructor(context) {
        _Drawer_instances.add(this);
        this.ctx = context;
    }
    drawText(text, x, y, color = "black", size = 10, font = "serif", width = 100) {
        this.ctx.fillStyle = color;
        this.ctx.font = "" + size + " " + font;
        this.ctx.fillText(text, x, y, width);
    }
    drawStrokeRect(x, y, x2, y2, fillColor = "rgba(0,0,0,0)", borderColor = "red", width = 2) {
        __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_drawFillRect).call(this, x, y, x2, y2, fillColor, width);
        __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_drawStrokeRect).call(this, x, y, x2, y2, borderColor, width);
    }
    drawLine(x, y, x2, y2, color = "red", width = 2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    drawArc(x, y, radius, startAngle = 0, endAngle = Math.PI / 2, isCounterClockwise = false, borderColor = "red", lineWidth = 2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.arc(x, y, radius, startAngle, endAngle, isCounterClockwise);
        this.ctx.stroke();
    }
    drawTriangle(x1, y1, x2, y2, x3, y3, borderColor = "red", lineWidth = 2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawPolygone(coords, borderColor, lineWidth) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = lineWidth;
        let index = 0;
        this.ctx.moveTo(coords[index++], coords[index++]);
        for (; index < coords.length; index += 2) {
            this.ctx.lineTo(coords[index], coords[index + 1]);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }
    clearRect(x1, y1, x2, y2) {
        this.ctx.clearRect(x1, y1, x2, y2);
    }
}
_Drawer_instances = new WeakSet(), _Drawer_drawFillRect = function _Drawer_drawFillRect(x, y, x2, y2, color = "green", width = 2) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, x2, y2);
}, _Drawer_drawStrokeRect = function _Drawer_drawStrokeRect(x, y, x2, y2, color = "red", width = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(x, y, x2, y2);
};
class ImageArtist extends HTMLElement {
    constructor() {
        super();
        _ImageArtist_instances.add(this);
        this.marks = [];
        // @ts-ignore
        this.canvas = {}; // @ts-ignore
        this.img = {}; // @ts-ignore
        this.wrapper = {}; // @ts-ignore
        this.labelLayout = {};
        let src = this.dataset.src, 
        //@ts-ignore
        width = parseInt(this.dataset.width), 
        //@ts-ignore
        height = parseInt(this.dataset.height), title = this.dataset.title;
        if (!src) {
            console.error("[IMAGE ARTIST]: Source is empty!");
            src = "";
        }
        if (!width) {
            width = 400;
        }
        if (!height) {
            height = 300;
        }
        if (!title) {
            title = "image not found!";
        }
        this.marks = [];
        __classPrivateFieldGet(this, _ImageArtist_instances, "m", _ImageArtist_initElements).call(this, { src, width, height, title });
        __classPrivateFieldGet(this, _ImageArtist_instances, "m", _ImageArtist_initEvents).call(this);
        //@ts-nocheck 
        let ctx = this.canvas.getContext("2d");
        if (ctx == null) {
            throw new Error('[IMAGE ARTIST]: Canvas doesnt created!');
        }
        this.drawer = new Drawer(ctx);
    }
    draw(mark) {
        if (!mark || Object.keys(mark).length < 1) {
            return console.warn("[IMAGE ARTIST]: I can not draw fasly values or empty object :)");
        }
        if (!mark.id) {
            throw new Error("[IMAGE ARTIST]: Mark should have id field!");
        }
        if (!Object.values(IMAGE_ARTIST_SHAPE_TYPES).includes(mark.shape)) {
            throw new Error('[IMAGE ARTIST]: Incorrect shape type: "' +
                mark.shape +
                '". Valid types: ' +
                Object.values(IMAGE_ARTIST_SHAPE_TYPES).join(", "));
        }
        if (this.marks && this.marks.filter(m => m.id === mark.id).length > 0) {
            throw new Error(`[IMAGE ARTIST]: Shape id must be unique: "${mark.id}"`);
        }
        switch (mark.shape) {
            // case IMAGE_ARTIST_SHAPE_TYPES.FilledRect:
            //   this.drawer.drawFillRect(
            //     mark.coords[0],
            //     mark.coords[1],
            //     mark.coords[2],
            //     mark.coords[3],
            //     mark.fillColor,
            //     mark.lineWidth
            //   );
            //   break;
            case IMAGE_ARTIST_SHAPE_TYPES.Rect:
                this.drawer.drawStrokeRect(mark.coords[0], mark.coords[1], mark.coords[2], mark.coords[3], mark.fillColor, mark.borderColor, mark.lineWidth);
                break;
            case IMAGE_ARTIST_SHAPE_TYPES.Line:
                this.drawer.drawLine(mark.coords[0], mark.coords[1], mark.coords[2], mark.coords[3], mark.fillColor, mark.lineWidth);
                break;
            case IMAGE_ARTIST_SHAPE_TYPES.Circle:
                this.drawer.drawArc(mark.coords[0], mark.coords[1], mark.radius, 0, 2 * Math.PI, true, mark.borderColor, mark.lineWidth);
                break;
            case IMAGE_ARTIST_SHAPE_TYPES.Arc:
                this.drawer.drawArc(mark.coords[0], mark.coords[1], mark.radius, mark.startAngle, mark.endAngle, mark.isCounterClockwise, mark.borderColor, mark.lineWidth);
                break;
            case IMAGE_ARTIST_SHAPE_TYPES.Triangle:
                this.drawer.drawTriangle(mark.coords[0], mark.coords[1], mark.coords[2], mark.coords[3], mark.coords[4], mark.coords[5], mark.borderColor, mark.lineWidth);
                break;
            case IMAGE_ARTIST_SHAPE_TYPES.Polygone:
                this.drawer.drawPolygone(mark.coords, mark.borderColor, mark.lineWidth);
                break;
        }
        this.marks.push(mark);
        if (mark.title) {
            this.setLabel(mark.id, mark.title, mark.events);
        }
    }
    drawArray(shapes) {
        if (!shapes || shapes.length < 1) {
            return console.warn("[IMAGE ARTIST]: I can not draw fasly values or empty array :)");
        }
        shapes.map((shape) => {
            this.draw(shape);
        });
    }
    drawText({ text, x, y, color, font, size, width }) {
        this.drawer.drawText(text, x, y, color, size, font, width);
    }
    clear(id) {
        let temp = this.marks.filter(m => m.id !== id);
        this.marks = [];
        this.clearAll();
        this.drawArray(temp);
    }
    clearArea(x1, y1, x2, y2) {
        this.drawer.clearRect(x1, y1, x2, y2);
    }
    clearAll() {
        this.drawer.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    setLabel(id, text, events) {
        if (id === '') {
            throw new Error('[IMAGE ARTIST]: Label id cant be empty!');
        }
        let marker = this.marks.filter(m => m.id === id)[0];
        if (!marker) {
            throw new Error(`[IMAGE ARTIST]: Invalid shape id! Label id must be belong to a shape. Id: ${id}`);
        }
        let label = createLabel(text);
        const { x, y } = calculateLableAlignPoint(marker);
        label.id = `image-artist-label-${id}`;
        label.style.top = `${y}px`;
        label.style.left = `${x}px`;
        // Set events
        if (events) {
            Object.entries(events)
                .forEach(([event, func]) => {
                label.addEventListener(event.replace('on', '').toLowerCase(), func);
            });
        }
        this.labelLayout.append(label);
    }
    removeLabel(id) {
        if (id === '') {
            throw new Error('[IMAGE ARTIST]: Label id cant be empty!');
        }
        const label = document.getElementById(`image-artist-label-${id}`);
        label === null || label === void 0 ? void 0 : label.remove();
    }
    setHtmlLabel(id, htmlSetter, events) {
        if (id === '') {
            throw new Error('[IMAGE ARTIST]: Label id cant be empty!');
        }
        let mark = this.marks.filter(m => m.id === id)[0];
        if (!mark) {
            throw new Error(`[IMAGE ARTIST]: Invalid shape id! Label id must be belong to a shape. Id: ${id}`);
        }
        const { x, y } = calculateLableAlignPoint(mark);
        let elem = htmlSetter(x, y);
        if (events) {
            Object.entries(events)
                .forEach(([event, func]) => {
                elem.addEventListener(event.replace('on', '').toLowerCase(), func);
            });
        }
        console.log({ elem });
        this.labelLayout.appendChild(elem);
    }
}
_ImageArtist_instances = new WeakSet(), _ImageArtist_initElements = function _ImageArtist_initElements({ src, width, height, title }) {
    function createWrapper({ width, height }) {
        let wrapper = document.createElement("div");
        wrapper.id = "image-artist-wrapper";
        wrapper.style.width = width + "px";
        wrapper.style.height = height + "px";
        // wrapper.style.border = "3px solid red";
        return wrapper;
    }
    function createImage({ src, title }) {
        let img = document.createElement("img");
        img.id = "image-artist-image";
        img.src = src;
        img.style.width = "100%";
        img.style.height = "100%";
        img.alt = title ? title : "Image";
        return img;
    }
    function createCanvas({ width, height }) {
        // Create canvas then add it in to wrapper
        let canvas = document.createElement("canvas");
        canvas.id = "image-artist-canvas";
        canvas.width = width;
        canvas.height = height;
        canvas.style.bottom = height + 5 + "px";
        return canvas;
    }
    function createLabelLayout() {
        let layout = document.createElement('div');
        layout.id = 'lable-layout';
        layout.style.bottom = width + 'px';
        return layout;
    }
    // Create main element
    // this.attachShadow({ mode: "open" });
    this.style.width = width + "px";
    this.style.height = height + "px";
    this.wrapper = createWrapper({ width, height });
    // Create image then add it in to wrapper
    this.img = createImage({ src, title });
    this.labelLayout = createLabelLayout();
    this.canvas = createCanvas({ width, height });
    this.wrapper.append(this.img, this.canvas, this.labelLayout);
    // @ts-ignore
    // shadow mode is open
    this.append(this.wrapper);
}, _ImageArtist_initEvents = function _ImageArtist_initEvents() {
    this.wrapper.addEventListener("click", (e) => {
        if (!this.dataset.onclick) {
            return;
        }
        // @ts-ignore
        globalThis[this.dataset.onclick](e);
    });
    this.wrapper.addEventListener("mousemove", (e) => {
        if (!this.dataset.onmousemove) {
            return;
        }
        // @ts-ignore
        globalThis[this.dataset.onmousemove](e);
    });
    this.wrapper.addEventListener("mouseenter", (e) => {
        if (!this.dataset.onmouseenter) {
            return;
        }
        // @ts-ignore
        globalThis[this.dataset.onmouseenter](e);
    });
    this.wrapper.addEventListener("mouseleave", (e) => {
        if (!this.dataset.onmouseleave) {
            return;
        }
        // @ts-ignore
        globalThis[this.dataset.onmouseleave](e);
    });
    this.wrapper.addEventListener("mousedown", (e) => {
        if (!this.dataset.onmousedown) {
            return;
        }
        // @ts-ignore
        globalThis[this.dataset.onmousedown](e);
    });
    this.wrapper.addEventListener("mouseup", (e) => {
        if (!this.dataset.onmouseup) {
            return;
        }
        // @ts-ignore
        globalThis[this.dataset.onmouseup](e);
    });
};
let css = window.document.createElement("link");
css.rel = "stylesheet";
css.href = "style.css";
window.document.getElementsByTagName("head")[0].append(css);
customElements.define("image-artist", ImageArtist);
