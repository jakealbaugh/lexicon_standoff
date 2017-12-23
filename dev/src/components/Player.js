export default class Player {
  constructor(state, { id, gameId, name, image, master }) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.gameId = gameId;
    this.state = state;
    this._ = {};
  }

  update(values) {
    this._ = values;
  }

  get capitalizedRole() {
    return this._.role.charAt(0).toUpperCase() + this._.role.slice(1);
  }

  get key() {
    return `${this.gameId}/${this.id}`;
  }

  get _ref() {
    return `/players/${this.key}`;
  }
}