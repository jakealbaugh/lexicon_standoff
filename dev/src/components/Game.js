import Adapters from '../adapters/Adapters';
import Topics from '../generators/Topics';
import shuffle from '../utils/shuffle';

export default class Game {
  constructor({ state }) {
    this.state = state;
    this.id = state.gameId;
    this.playerId = state.playerId;
    this._ = {};
    this.topicGenerator = new Topics();
  }

  detectAllVotesSubmitted() {
    return Object.keys(this._.votes).length === this._.playerCountAlive;
  }

  calculateRoundOverData(players) {
    let deadCounts = { imposter: 0, agent: 0 },
      aliveCounts = { imposter: 0, agent: 0 },
      aliveIds = [],
      deadIds = [];
    for (let playerId in players) {
      let role = players[playerId]._.role;
      if (players[playerId]._.alive) {
        aliveCounts[role]++;
        aliveIds.push(playerId);
      } else {
        deadCounts[role]++;
        deadIds.push(playerId);
      }
    }
    let roundOver =
      aliveCounts.imposter === 0 ||
      aliveCounts.agent === 0 ||
      (aliveCounts.imposter === 1 && aliveCounts.agent === 1);
    return { aliveCounts, aliveIds, deadCounts, deadIds, roundOver };
  }

  calculatePoints(players, { aliveCounts, aliveIds, roundOver }) {
    let points = {},
      winRole = null;
    if (roundOver) {
      if (aliveCounts.imposter === 1 && aliveCounts.agent === 1);
      else if (aliveCounts.imposter > 0)
        // Nothing. Draw.
        winRole = 'imposter';
      else if (aliveCounts.agent > 0) winRole = 'agent';
    }
    // Alive Imposters score two, alive Agents score one
    for (let playerId in players) {
      let player = players[playerId],
        role = player._.role,
        survivePts = Game.survivePoints[role];
      // If winning Team
      if (winRole && winRole === role) {
        // If alive, extra points
        let pts = player._.alive ? Game.winPoints + survivePts : Game.winPoints;
        points[playerId] = pts;
      } else if (winRole) {
        // If Loser,
      } else {
        // Game Still playing
        if (player._.alive) points[playerId] = survivePts;
      }
    }
    return points;
  }

  update(values) {
    this.changes = {};
    ['status', 'votes', 'killedIds'].forEach(type => {
      this.changes[type] = values[type] !== this._[type];
    });
    this._ = values;
  }

  // Generators

  generateRoundData() {
    let playerIds = Object.keys(this.state.players);
    let {
      playerIdsImposters,
      playerIdsAgents,
      imposterCount
    } = this._generateRoles(playerIds);
    this.imposterCount = imposterCount;
    let playerCount = playerIds.length,
      topics = this.generateTopics(),
      playerCountAlive = playerCount,
      votes = {},
      killVotes = {},
      killedIds = [],
      roundOver = false,
      aliveCounts = { imposter: 0, agent: 0 },
      aliveIds = [],
      deadCounts = { imposter: 0, agent: 0 },
      deadIds = [];
    return {
      game: {
        playerCountAlive,
        playerCount,
        votes,
        killVotes,
        killedIds,
        aliveCounts,
        aliveIds,
        deadCounts,
        deadIds,
        imposterCount,
        topics,
        roundOver
      },
      players: { playerIdsImposters, playerIdsAgents }
    };
  }

  generateTopics() {
    return [1, 2, 3, 4].map(_ => this.topicGenerator.loadTopic());
  }

  generateKilledIds() {
    let killVotes = {},
      killedIds = [],
      most = 0;
    for (let playerId in this._.votes) {
      let killedId = this._.votes[playerId];
      killVotes[killedId] = killVotes[killedId] || 0;
      killVotes[killedId]++;
    }
    for (let playerId in killVotes) {
      let votes = killVotes[playerId];
      if (votes > most) {
        most = votes;
        killedIds = [playerId];
      } else if (votes === most) {
        killedIds.push(playerId);
      }
    }
    return { killVotes, killedIds };
  }

  // Generators

  _generateRoles(playerIds) {
    let ids = shuffle(Array.from(playerIds)),
      counts = this._distributor(playerIds.length),
      agentCount = counts[0],
      imposterCount = counts[1];
    let playerIdsAgents = ids.slice(0, agentCount);
    ids = ids.slice(agentCount);
    let playerIdsImposters = ids;
    return {
      playerIdsImposters,
      playerIdsAgents,
      imposterCount
    };
  }

  // Private

  _distributor(number) {
    // Going for 2 to 1
    let agents = Math.floor(number * 0.66667),
      imposters = number - agents;
    return [agents, imposters];
  }

  get _ref() {
    return `/games/${this.id}`;
  }

  get _playersRef() {
    return `/players/${this.id}`;
  }

  // Class

  static get survivePoints() {
    return { agent: 1, imposter: 2 };
  }

  static get winPoints() {
    return 3;
  }
}
