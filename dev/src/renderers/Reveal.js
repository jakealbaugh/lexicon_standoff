import Renderer from './Renderer';
import Button from './modules/Button';

export default class Reveal extends Renderer {
  renderInitial() {
    this.$h1 = this.el('h1');
    this.$topics = this.el('p', null, 'topics');
    this.$desc = this.el('p', null, 'description');
    this.$header.appendChild(this.$h1);
    this.append(this.$main, [this.$topics, this.$desc]);
    if (this.player._.master) {
      let $inst = this.el(
        'p',
        `Players question each other's word selections and discuss who they think is an Impostor.
          Once everyone is ready to vote, proceed.`,
        'instruction'
      );
      let proceed = new Button({
        content: 'Proceed',
        clickEvent: this.events.dispatchVotes.bind(this)
      });
      this.append(this.$footer, [$inst, proceed.$el]);
    }
  }

  render({ topics }) {
    let role = this.player.capitalizedRole;
    this.$h1.innerHTML = `
      <span class="status">Reveal</span> <span class="info"><span class="throb">${role}</span></span>`;
    this.$topics.innerHTML = `${topics[0]} &amp; ${topics[1]}`;
    if (this.player._.alive) {
      this.$desc.innerHTML =
        "If questioned, explain your association for the Topics. Question other's choices.";
    } else {
      this.renderDead(this.$desc);
    }
    this.toggleSections();
  }

  get _name() {
    return 'reveal';
  }

  get _eventsList() {
    return ['dispatchVotes'];
  }
}