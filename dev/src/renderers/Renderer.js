export default class Renderer {
  constructor(player, events = {}) {
    this.player = player;
    this.events = events;
    this.$container = document.querySelector('.container > div');
    this.$section = this.el('section');
    this.$header = this.el('header');
    this.$main = this.el('main');
    this.$footer = this.el('footer');
    this.$container.appendChild(this.$section);
    this.$section.appendChild(this.$header);
    this.$section.appendChild(this.$main);
    this.$section.appendChild(this.$footer);
    this.$section.classList.add(this._name);
    this._activeSection = null;
  }

  toggleSections() {
    let $existing = this.$container.querySelector('section.active');
    if ($existing) $existing.classList.remove('active');
    this.$section.classList.add('active');
    this.$container.className = `active-${this._name}`;
    this._activeSection = this._name;
  }

  remove() {
    this.$section.remove();
  }

  userSpan(player, extraClassname) {
    let classname = player.id === this.player.id ? 'you' : '',
      name = player.id === this.player.id ? 'You' : player.name;
    if (extraClassname) classname += ` ${extraClassname}`;
    return `<span class="user ${classname}"><img src="${player.avatar}" /> ${name}</span>`;
  }

  renderDead($el) {
    let role = this.player.capitalizedRole;
    $el.innerHTML = `You're dead and will resurrect at the end of the Round.`;
  }

  el(tagname, inner, classname) {
    let $el = document.createElement(tagname);
    if (inner) $el.innerHTML = inner;
    if (classname) $el.className = classname;
    return $el;
  }

  append($parent, $children) {
    $children.forEach($child => {
      $parent.appendChild($child);
    });
  }

  set events(events) {
    this._eventsList.forEach(eventName => {
      if (!events[eventName])
        console.error(`Renderer Missing Event "${eventName}"`);
    });
    this._events = events;
  }

  get events() {
    return this._events;
  }

  _capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
