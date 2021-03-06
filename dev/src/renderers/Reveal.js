import Renderer from './Renderer';
import Button from './modules/Button';
import List from './modules/List';

export default class Reveal extends Renderer {
  renderInitial() {
    this.$h1 = this.el('h1');
    this.$header.appendChild(this.$h1);

    this.$topics = this.el('p', null, 'topics');
    this.$desc = this.el('p', null, 'description');

    this.append(this.$main, [this.$topics, this.$desc]);

    this.selections = new List(
      'flex-list flex-list-small flex-list-selections'
    );
    this.selections.title('Selections');
    this.append(this.$main, this.selections.elements);

    if (this.player.isMaster) {
      let $inst = this.el(
        'p',
        `Players discuss their answers. Proceed once everyone is ready to vote.`,
        'instruction'
      );
      let $grp = this.el('div', null, 'item-group'),
        proceed = new Button({
          content: 'Proceed',
          clickEvent: this.events.dispatchActions.bind(this),
          classname: 'flex'
        }),
        cancel = new Button({
          content: 'End',
          clickEvent: this.handleConfirmEnd.bind(this),
          classname: 'warning'
        });
      this.append($grp, [cancel.$el, proceed.$el]);
      this.append(this.$footer, [$inst, $grp]);
    }
  }

  render(game, players) {
    let {
      topics,
      playerCount,
      imposterCount,
      selections,
      selectionStart
    } = game;

    this.selections.reset();
    let playerIds = Object.keys(selections).sort((a, b) => {
      let sa = selections[a].time,
        sb = selections[b].time;
      if (sa < sb) return 1;
      if (sa > sb) return -1;
      sa = selections[a].selection.toLowerCase();
      sb = selections[b].selection.toLowerCase();
      if (sa < sb) return -1;
      if (sa > sb) return 1;
      return 0;
    });
    playerIds.forEach(playerId => {
      let { selection, time } = selections[playerId];
      this.selections.add(`
        ${this.userSpan(players[playerId])}
        <span class="selection">
          ${selection}
          <span class="seconds">${this.renderTime(
            (time - selectionStart) / 1000
          )}</span>
        </span>
      `);
    });

    this.$h1.innerHTML = this.roleHeader('Reveal');
    this.$topics.innerHTML = `“${topics[0]}” &amp; “${topics[1]}”`;
    let playerS = imposterCount === 1 ? 'Player' : 'Players';
    this.$desc.innerHTML = `
      These were the two Topics. Explain and argue your choice.
      You'll need to vote to kill <strong>${imposterCount}</strong> ${playerS}.
    `;
    this.toggleSections();
  }

  get _name() {
    return 'reveal';
  }

  get _eventsList() {
    return ['dispatchActions', 'dispatchEnd'];
  }
}
