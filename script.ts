const IMAGE_MARKER_SHAPE_TYPES = {
  Rect:  "rect",
  Circle:  "circle",
  Arc:  "arc",
  Line:  "line",
  Triangle:  "triangle",
  Polygone:  "polygone",
};

type ShapseKeys = keyof typeof IMAGE_MARKER_SHAPE_TYPES;
type ImageMarkShapes = typeof IMAGE_MARKER_SHAPE_TYPES[ShapseKeys];

interface MarkTitle {
  text: string,
  font?: "sans",
  size?: 10,
  color?: "white"
}

interface MarkEvents{
  onClick: Function,
  onMouseEnter: Function,
  onMouseLeave: Function,
}

interface Mark {
  id: number | string | Symbol;
  title?: string | MarkTitle,
  shape: ImageMarkShapes,
  coords: Array<number>,
  borderColor: string,
  fillColor: string,
  lineWidth: 2,
  events: MarkEvents
  radius: number,
  startAngle: number,
  endAngle: number,
  isCounterClockwise: boolean,
}

class Drawer {
  ctx: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
    console.log({ t: this, context });
  }

  #drawFillRect(x: number, y: number, x2: number, y2: number, color: string = "green", width: number = 2) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, x2, y2);
  }

  #drawStrokeRect(x: number, y: number, x2: number, y2: number, color = "red", width: number = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(x, y, x2, y2);
  }

  drawText(text: string, x: number, y: number, color = "black", size = 10, font = "serif", width = 100) {
    this.ctx.font = "" + size + " " + font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y, width);
  }

  drawStrokeRect(
    x: number, y: number, x2: number, y2: number,
    fillColor = "rgba(0,0,0,0)",
    borderColor = "red",
    width = 2
  ) {
    this.#drawFillRect(x, y, x2, y2, fillColor, width);
    this.#drawStrokeRect(x, y, x2, y2, borderColor, width);
  }

  drawLine(x: number, y: number, x2: number, y2: number, color = "red", width = 2) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  drawArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number = 0,
    endAngle: number = Math.PI / 2,
    isCounterClockwise: boolean = false,
    borderColor = "red",
    lineWidth = 2
  ) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.arc(x, y, radius, startAngle, endAngle, isCounterClockwise);
    this.ctx.stroke();
  }

  drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, borderColor = "red", lineWidth = 2) {
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

  drawPolygone(coords: Array<number>, borderColor: string, lineWidth: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = lineWidth;
    let index = 0;
    this.ctx.moveTo(coords[index++], coords[index++]);
    for (; index < coords.length; index += 2) {
      console.log(coords[index], coords[index + 1]);
      this.ctx.lineTo(coords[index], coords[index + 1]);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

function log(...msg: any) {
  const debug = true;
  if (debug) {
    console.log(...msg);
  }
}

class ImageMarker extends HTMLElement {
  wrapper: HTMLDivElement;
  img: HTMLImageElement;
  canvas: HTMLCanvasElement;
  drawer: Drawer;
  marks: Array<Mark> = [];
  constructor() {
    super();
    // @ts-ignore
    this.canvas = {};    // @ts-ignore
    this.img = {};    // @ts-ignore
    this.wrapper = {};
    let src = this.dataset.src,
      //@ts-ignore
      width = parseInt(this.dataset.width),
      //@ts-ignore
      height = parseInt(this.dataset.height),
      title = this.dataset.title;
    log("start", this.dataset);
    if (!src) {
      console.error("[IMAGE MARKER]: Source is empty!");
      src = ""
    }

    if (!width) {
      width = 400;
    }
    if (!height) {
      height = 300;
    }

    if (!title) {
      title = "image don't found!";
    }

    this.marks = [];
    this.initElements({ src, width, height, title });
    this.initEvents();
    //@ts-nocheck 
    let ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      throw new Error('[IMAGE MARKER]: Canvas doesnt created!');
    }
    this.drawer = new Drawer(ctx);
  }

  initElements({ src, width, height, title }: { src: string, width: number, height: number, title?: string }) {
    function createWrapper({ width, height }: { width: number, height: number }) {
      let wrapper = document.createElement("div");
      wrapper.id = "image-marker-wrapper";
      wrapper.style.width = width + "px";
      wrapper.style.height = height + "px";
      // wrapper.style.border = "3px solid red";
      return wrapper;
    }

    function createImage({ src, title }: { src: string, title?: string }) {
      let img = document.createElement("img");
      img.id = "image-marker-image";
      img.src = src;
      img.style.width = "100%";
      img.style.height = "100%";
      img.title = title ? title : "Image";
      return img;
    }

    function createCanvas({ width, height }: { width: number, height: number }) {
      // Create canvas then add it in to wrapper
      let canvas = document.createElement("canvas");
      canvas.id = "image-marker-canvas";
      canvas.width = width;
      canvas.height = height;
      canvas.style.position = "relative";
      canvas.style.bottom = height + 5 + "px";
      return canvas;
    }

    // Create main element
    this.attachShadow({ mode: "open" });
    this.style.width = width + "px";
    this.style.height = height + "px";
    this.style.display = "inline-block";
    this.style.overflow = "hidden";

    this.wrapper = createWrapper({ width, height });

    // Create image then add it in to wrapper
    this.img = createImage({ src, title });
    this.wrapper.append(this.img);

    this.canvas = createCanvas({ width, height });
    this.wrapper.append(this.canvas);
    // @ts-ignore
    // shadow mode is open
    this.shadowRoot.append(this.wrapper);
  }

  initEvents() {
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
  }

  draw(marks: Array<Mark>) {
    if (!marks || marks.length < 1) {
      return console.warn(
        "[IMAGE MARKER]: I can not draw fasly values or empty array :)"
      );
    }
    marks.map((mark) => {
      if (!mark.id) {
        throw new Error("[IMAGE MARKER]: Mark should have id field!");
      }
      if (!Object.values(IMAGE_MARKER_SHAPE_TYPES).includes(mark.shape)) {
        throw new Error(
          '[IMAGE MARKER]: Incorrect shape type: "' +
          mark.shape +
          '". Valid types: ' +
          Object.values(IMAGE_MARKER_SHAPE_TYPES).join(", ")
        );
      }

      if(this.marks && this.marks.filter(m=> m.id === mark.id).length >0){
        throw new Error(`[IMAGE MARKER]: Shape id must be unique: "${mark.id}"`)
      }

      switch (mark.shape) {
        // case IMAGE_MARKER_SHAPE_TYPES.FilledRect:
        //   this.drawer.drawFillRect(
        //     mark.coords[0],
        //     mark.coords[1],
        //     mark.coords[2],
        //     mark.coords[3],
        //     mark.fillColor,
        //     mark.lineWidth
        //   );
        //   break;
        case IMAGE_MARKER_SHAPE_TYPES.Rect:
          this.drawer.drawStrokeRect(
            mark.coords[0],
            mark.coords[1],
            mark.coords[2],
            mark.coords[3],
            mark.fillColor,
            mark.borderColor,
            mark.lineWidth
          );
          break;
        case IMAGE_MARKER_SHAPE_TYPES.Line:
          this.drawer.drawLine(
            mark.coords[0],
            mark.coords[1],
            mark.coords[2],
            mark.coords[3],
            mark.borderColor,
            mark.lineWidth
          );
          break;
        case IMAGE_MARKER_SHAPE_TYPES.Circle:
          this.drawer.drawArc(
            mark.coords[0],
            mark.coords[1],
            mark.radius,
            0,
            2 * Math.PI,
            true,
            mark.borderColor,
            mark.lineWidth
          );
          break;
        case IMAGE_MARKER_SHAPE_TYPES.Arc:
          this.drawer.drawArc(
            mark.coords[0],
            mark.coords[1],
            mark.radius,
            mark.startAngle,
            mark.endAngle,
            mark.isCounterClockwise,
            mark.borderColor,
            mark.lineWidth
          );
          break;
        case IMAGE_MARKER_SHAPE_TYPES.Triangle:
          this.drawer.drawTriangle(
            mark.coords[0],
            mark.coords[1],
            mark.coords[2],
            mark.coords[3],
            mark.coords[4],
            mark.coords[5],
            mark.borderColor,
            mark.lineWidth
          );
          break;
        case IMAGE_MARKER_SHAPE_TYPES.Polygone:
          this.drawer.drawPolygone(
            mark.coords,
            mark.borderColor,
            mark.lineWidth
          );
          break;
      }

      if (mark.title) {
        if (typeof mark.title === "object") {
          this.drawer.drawText(
            mark.title.text,
            mark.coords[0] + (mark.coords[2] - mark.coords[0]) / 2,
            mark.coords[1] + (mark.coords[3] - mark.coords[1]) / 2,
            mark.title.color,
            mark.title.size,
            mark.title.font
          );
        } else {
        }
      }
      this.marks.push(mark);
    });
  }
}
let css = window.document.createElement("link");
css.rel = "stylesheet";
css.href = "style.css";
window.document.getElementsByTagName("head")[0].append(css);

customElements.define("image-marker", ImageMarker);
