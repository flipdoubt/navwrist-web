declare var jest, describe, it, expect;

import { CurrentGame, Data, Player, CompletedGame } from "../api";
const crypto = require("crypto");

Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length)
  }
});

describe("CurrentGame.winnerIs()", () => {
  it("should always be Franko.", () => {
    expect.assertions(1);
    expect(() => {
      const data = getSampleData();
      data.currentGame = new CurrentGame(
        data.getPlayerAtIndex(0),
        data.getPlayerAtIndex(1)
      );
      data.currentGame.playerOneScore = 24;
      data.currentGame.playerTwoScore = 22;
      return data.currentGame.winnerIs().name === "Franko";
    }).toBeTruthy();
  });
});

function getSampleData(success = true): Data {
  const data = new Data();
  const player1 = Player.new("Franko");
  const player2 = Player.new("Everyone Else");
  data.players[player1.id] = player1;
  data.players[player2.id] = player2;
  const game1 = CompletedGame.new();
  game1.winnerId = player1.id;
  game1.winnerScore = 21;
  game1.loserId = player2.id;
  data.completedGames[game1.id] = game1;
  return data;
}
