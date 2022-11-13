class Model {
  constructor(window) {
    this.canvasWidth = window.innerWidth - 100;
    this.sqWidth = 0;
    this.totalSq = 0;
    this.sqPerSide = 0;
    this.sqColor = 'blue';
  }

  setup(sqPerSide = 16) {
    this.sqPerSide = sqPerSide;
    this.sqWidth = this.canvasWidth / this.sqPerSide;
    this.totalSq = Math.pow(this.sqPerSide, 2);
  }

  setSqColor(color) {
    this.sqColor = color;
  }
}

class View {
  constructor() {
    this.root = document.querySelector(':root');
    this.canvas = document.querySelector('.js-canvas');
    this.sqPerSideInput = document.querySelector('.js-sq-per-side');
    this.createBtn = document.querySelector('.js-create-btn');
    this.randomBtn = document.querySelector('.js-random-btn');
  }

  bindEvent(el, handler, type, ...options) {
    el.addEventListener(type, handler, ...options);
  }

  getInput(inputEl) {
    return inputEl.value;
  }

  clearInput(inputEl) {
    inputEl.value = '';
  }

  createEl(nodeType, ...classNames) {
    let el = document.createElement(nodeType);
    el.classList.add(...classNames);
    return el;
  }

  renderEl(parent, child) {
    parent.append(child);
  }

  removeChildren(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  createSq(totalSq, style) {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < totalSq; i += 1) {
      let el = this.createEl('div', 'square');
      this.bindEvent(el, this.draw(style), 'mouseover', {
        once: true,
      });
      frag.append(el);
    }
    return frag;
  }

  draw = (style) => (e) => {
    if (style === 'random') {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      e.target.style.backgroundColor = `rgb(${r},${g},${b})`;
    } else {
      e.target.classList.add('draw');
    }
  };

  renderCanvas(totalSq, style) {
    const squares = this.createSq(totalSq, style);
    this.removeChildren(this.canvas);
    this.renderEl(this.canvas, squares);
  }

  setCustomProperty(name, value) {
    this.root.style.setProperty(name, value);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    this.model.setup();
    this.view.bindEvent(
      this.view.sqPerSideInput,
      this.handleSqPerSideChange,
      'change'
    );
    this.view.bindEvent(this.view.createBtn, this.handleCreateCanvas, 'click');
    this.view.bindEvent(this.view.randomBtn, this.handleRandomColor, 'click');
    this.view.renderCanvas(this.model.totalSq);
    this.bindCanvas();
  }

  handleSqPerSideChange = (event) => {
    const sqPerSide = Number(event.target.value);
    if (!Number.isInteger(sqPerSide)) return;
    this.model.setup(sqPerSide);
  };

  handleCreateCanvas = () => {
    this.view.clearInput(this.view.sqPerSideInput);
    this.bindCanvas();
    this.view.renderCanvas(this.model.totalSq);
  };

  handleRandomColor = () => {
    this.model.setSqColor('random');
    this.view.renderCanvas(this.model.totalSq, this.model.sqColor);
  };

  bindCanvas() {
    const canvasWidth = `${this.model.canvasWidth}px`;
    const sqWidth = `${this.model.sqWidth}px`;
    const sqColor = this.model.sqColor;
    this.view.setCustomProperty('--canvas-width', canvasWidth);
    this.view.setCustomProperty('--square-width', sqWidth);
    this.view.setCustomProperty('--square-color', sqColor);
  }
}

const app = new Controller(new Model(window), new View());
