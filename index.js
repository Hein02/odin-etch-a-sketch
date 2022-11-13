class Model {
  constructor(window) {
    this.canvasWidth = window.innerWidth - 100;
    this.sqWidth = 0;
    this.totalSq = 0;
    this.sqPerSide = 0;
  }

  setup(sqPerSide = 16) {
    this.sqPerSide = sqPerSide;
    this.sqWidth = this.canvasWidth / this.sqPerSide;
    this.totalSq = Math.pow(this.sqPerSide, 2);
  }
}

class View {
  constructor() {
    this.root = document.querySelector(':root');
    this.canvas = document.querySelector('.js-canvas');
    this.sqPerSideInput = document.querySelector('.js-sq-per-side');
    this.createBtn = document.querySelector('.js-create-btn');
  }

  bindEvent(el, handler, type) {
    el.addEventListener(type, handler);
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

  renderCanvas(totalSq) {
    while (this.canvas.firstChild) {
      this.canvas.removeChild(this.canvas.firstChild);
    }
    let frag = document.createDocumentFragment();
    for (let i = 0; i < totalSq; i += 1) {
      let el = this.createEl('div', 'square');
      el.addEventListener('mouseover', (e) => {
        e.target.classList.add('draw');
      });
      frag.append(el);
    }
    this.renderEl(this.canvas, frag);
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
    this.view.bindEvent(this.view.createBtn, this.handleCreate, 'click');
    this.view.renderCanvas(this.model.totalSq);
    this.bindCanvas();
  }

  handleSqPerSideChange = (event) => {
    const sqPerSide = Number(event.target.value);
    if (!Number.isInteger(sqPerSide)) return;
    this.model.setup(sqPerSide);
  };

  handleCreate = () => {
    this.view.clearInput(this.view.sqPerSideInput);
    this.bindCanvas();
    this.view.renderCanvas(this.model.totalSq);
  };

  bindCanvas() {
    const canvasWidth = `${this.model.canvasWidth}px`;
    const sqWidth = `${this.model.sqWidth}px`;
    this.view.setCustomProperty('--canvas-width', canvasWidth);
    this.view.setCustomProperty('--square-width', sqWidth);
  }
}

const app = new Controller(new Model(window), new View());
