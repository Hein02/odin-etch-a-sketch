class Model {
  constructor(window) {
    this.canvasWidth = window.innerWidth - 100;
    this.sqWidth = 0;
    this.totalSq = 0;
    this.sqPerSide = 0;
    this.style = 'black';
    this.mode = 'default';
  }

  setup(sqPerSide = 16) {
    this.sqPerSide = sqPerSide;
    this.sqWidth = this.canvasWidth / this.sqPerSide;
    this.totalSq = Math.pow(this.sqPerSide, 2);
  }

  setMode(mode) {
    this.mode = mode;
  }
}

class View {
  constructor() {
    this.root = document.querySelector(':root');
    this.body = document.body;
    this.canvas = document.querySelector('.js-canvas');
    this.sqPerSideInput = document.querySelector('.js-sq-per-side');
    this.createBtn = document.querySelector('.js-create-btn');
    this.randomBtn = document.querySelector('.js-random-btn');
    this.defaultBtn = document.querySelector('.js-default-btn');
    this.enabledDraw = false;
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

  createSq(totalSq, mode) {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < totalSq; i += 1) {
      let el = this.createEl('div', 'square');
      this.bindEvent(el, this.draw(mode), 'mouseover');
      frag.append(el);
    }
    return frag;
  }

  draw = (mode) => (e) => {
    if (this.enabledDraw) {
      if (mode === 'random') {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${r},${g},${b})`;
      } else {
        e.target.classList.add('draw');
      }
    }
  };

  renderCanvas(totalSq, mode) {
    const squares = this.createSq(totalSq, mode);
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
    this.view.bindEvent(this.view.defaultBtn, this.handleNormal, 'click');
    this.view.bindEvent(this.view.body, this.toggleDraw, 'keypress');
    this.view.renderCanvas(this.model.totalSq, this.model.mode);
    this.bindCanvas();
  }

  handleSqPerSideChange = (event) => {
    const sqPerSide = Number(event.target.value);
    if (!Number.isInteger(sqPerSide)) {
      alert('Must be an integer.');
      this.view.clearInput(this.view.sqPerSideInput);
      return;
    }
    if (sqPerSide > 100) {
      alert('Cannot exceed 100.');
      this.view.clearInput(this.view.sqPerSideInput);
      return;
    }
    this.model.setup(sqPerSide);
  };

  handleCreateCanvas = (e) => {
    e.target.blur();
    if (!this.view.sqPerSideInput.value) {
      alert('Cannot be empty.');
      return;
    }
    this.view.clearInput(this.view.sqPerSideInput);
    this.bindCanvas();
    this.view.renderCanvas(this.model.totalSq, this.model.mode);
  };

  handleRandomColor = (e) => {
    e.target.blur();
    this.model.setMode('random');
    this.view.renderCanvas(this.model.totalSq, this.model.mode);
  };

  handleNormal = (e) => {
    e.target.blur();
    this.model.setMode('default');
    this.view.renderCanvas(this.model.totalSq, this.model.mode);
  };

  bindCanvas() {
    const canvasWidth = `${this.model.canvasWidth}px`;
    const sqWidth = `${this.model.sqWidth}px`;
    const style = this.model.style;
    this.view.setCustomProperty('--canvas-width', canvasWidth);
    this.view.setCustomProperty('--square-width', sqWidth);
    this.view.setCustomProperty('--square-color', style);
  }

  toggleDraw = (e) => {
    if (e.code === 'Space') {
      this.view.enabledDraw = !this.view.enabledDraw;
    }
  };
}

const app = new Controller(new Model(window), new View());
