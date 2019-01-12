declare var jest, describe, it, expect;

import Api, {CurrentGame} from '../api';
const crypto = require('crypto');

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
});

describe('CurrentGame.winnerIs()', () => {
  it('should always be Franko.', () => {
    expect.assertions(1);
    expect(() => {
      let data = Api.fetchData();
      data.currentGame = new CurrentGame(data.getPlayerAtIndex(0), data.getPlayerAtIndex(1));
      data.currentGame.playerOneScore = 24;
      data.currentGame.playerTwoScore = 22;
      return data.currentGame.winnerIs().name === "Franko";
    }).toBeTruthy();
  });
});
