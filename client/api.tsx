import * as _ from "lodash";
import { Dictionary } from "lodash";
import { string } from "prop-types";

export default class Api {
  public static newId(): string {
    /**
     * https://stackoverflow.com/questions/13212521/typescript-static-classes.
     */
    return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  public static async fetchData(): Promise<Data> {
    const data = new Data();
    data.players = await fetch("players").then<Dictionary<Player>>(r => r.json());
    data.completedGames = await fetch("CompletedGames").then<Dictionary<CompletedGame>>(r => r.json());
    return data;
  }

  public static getDictionaryValues<T>(input: Dictionary<T>): Array<T> {
    return _.values(input);
  }
}

/**
 * Do not add instance methods.
 */
export class CompletedGame {
  private static _nullGame: CompletedGame;
  constructor(
    public id: string = "",
    public winner: string = "",
    public winnerScore: number = 0,
    public loser: string = "",
    public loserScore: number = 0,
    public startDate?: Date,
    public endDate?: Date
  ) {}

  public static new(): CompletedGame {
    return new CompletedGame(Api.newId());
  }

  public static nullGame(): CompletedGame {
    return (this._nullGame = this._nullGame || new CompletedGame());
  }
}

/**
 * Do not add instance methods.
 */
export class Player {
  private static _nullPlayer: Player;
  constructor(public name: string = "", public id: string = "") {}

  public static new(name: string = ""): Player {
    return new Player(name, Api.newId());
  }

  public static nullPlayer(): Player {
    return (this._nullPlayer = this._nullPlayer || new Player());
  }
}

export class LeaderBoardRecord {
  constructor(
    public player: Player,
    public winCount: number = 0,
    public lossCount: number = 0
  ) {}

  public getWinningPercentage(): number {
    const count = this.winCount + this.lossCount;
    return count === 0 ? 0 : this.winCount / count;
  }
}

export class CurrentGame {
  private static _nullGame;
  public playerOneScore: number = 0;
  public playerTwoScore: number = 0;
  constructor(
    public playerOne: Player,
    public playerTwo: Player,
    public winAt = 21,
    public startDate?: Date
  ) {
    this.startDate = startDate || new Date(Date.now());
  }

  public winnerIs(): Player {
    if (this.playerOneScore < this.winAt && this.playerTwoScore < this.winAt)
      return Player.nullPlayer();
    let difference = this.playerOneScore - this.playerTwoScore;
    if (Math.abs(difference) >= 2) {
      return this.playerOneScore > this.playerTwoScore
        ? this.playerOne
        : this.playerTwo;
    }
    return Player.nullPlayer();
  }

  public getCompletedGame(): CompletedGame {
    const winner = this.winnerIs();
    if (winner === Player.nullPlayer()) return CompletedGame.nullGame();

    const game = CompletedGame.new();
    game.winner = winner.id;

    if (this.playerOne === winner) {
      game.winnerScore = this.playerOneScore;
      game.loser = this.playerTwo.id;
      game.loserScore = this.playerTwoScore;
      return game;
    }

    game.winnerScore = this.playerTwoScore;
    game.loser = this.playerOne.id;
    game.loserScore = this.playerOneScore;
    return game;
  }

  public static nullGame(): CurrentGame {
    return (this._nullGame =
      this._nullGame ||
      new CurrentGame(Player.nullPlayer(), Player.nullPlayer()));
  }
}

/**
 * @property players {Player}
 * @property games {Game}
 * @property currentGame {CurrentGame}
 */
export class Data {
  public currentGame?: CurrentGame;

  constructor(
    public players: Dictionary<Player> = {},
    public completedGames: Dictionary<CompletedGame> = {}
  ) {}

  public getNumberOfPlayers(): number {
    return _.size(this.players);
  }

  public getPlayerAtIndex(index: number = 0): Player {
    if (index >= this.getNumberOfPlayers()) return new Player();
    return _.values(this.players)[index];
  }

  public getLeaderBoardData(): Array<LeaderBoardRecord> {
    const dictionary: Dictionary<LeaderBoardRecord> = {};
    _.forEach(this.players, p => (dictionary[p.id] = new LeaderBoardRecord(p)));
    _.forEach(this.completedGames, game => {
      dictionary[game.winner].winCount += 1;
      dictionary[game.loser].lossCount += 1;
    });
    return _.sortBy(dictionary, record => record.getWinningPercentage());
  }
}
