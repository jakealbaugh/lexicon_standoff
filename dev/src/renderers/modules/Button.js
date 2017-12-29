import Module from './Module';

export default class Button extends Module {
  constructor({ clickEvent, content = '', classname = '' }) {
    super();
    this.$el = this.el('button', content, classname);
    if (clickEvent) this.$el.addEventListener('click', () => clickEvent());
  }

  enable() {
    this.$el.removeAttribute('disabled');
  }

  disable() {
    this.$el.setAttribute('disabled', true);
  }

  content(value) {
    this.$el.innerHTML = value;
  }
}
