import * as _ from "lodash";
import { Dictionary, cloneDeep } from "lodash";

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
    const result = await Promise.all([
      fetch("players").then<Dictionary<Player>>(r => r.json()),
      fetch("CompletedGames").then<Dictionary<CompletedGame>>(r => r.json())
    ]);
    const data = new Data();
    data.players = result[0];
    data.completedGames = result[1];
    return data;
  }

  public static getDictionaryValues<T>(input: Dictionary<T>): Array<T> {
    return _.values(input);
  }

  public static async fetchLeaderBoardData(): Promise<
    Array<LeaderBoardRecord>
  > {
    return await fetch("LeaderBoard").then<Array<LeaderBoardRecord>>(result =>
      result.json()
    );
  }

  public static async postCompletedGame(game: CompletedGame): Promise<boolean> {
    return await Api.postJson("CompletedGame", game).then<boolean>(
      response => response.ok
    );
  }

  public static async postPlayer(player: Player): Promise<boolean> {
    return await Api.postJson("Player", player).then<boolean>(
      response => response.ok
    );
  }

  public static updateFetchedLeaderBoardData(
    fetchedData: Array<LeaderBoardRecord>,
    toUpdate: Array<LeaderBoardRecord>
  ): void {
    _.each(fetchedData, fetched => {
      const indexToUpdate = _.findIndex(
        toUpdate,
        record => record.player.id === fetched.player.id
      );
      if (indexToUpdate >= 0) toUpdate[indexToUpdate] = fetched;
      else toUpdate.push(fetched);
    });
  }

  public static postJson<TData>(url: string, data: TData): Promise<Response> {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  public static async fetchLeaderBoardRecord(
    playerId: string
  ): Promise<LeaderBoardRecord> {
    return await fetch(`LeaderBoard\\${playerId}`).then(response =>
      response.ok ? response.json() : LeaderBoardRecord.nullRecord()
    );
  }

  public static sortLeaderBoardData(
    data: Array<LeaderBoardRecord>
  ): Array<LeaderBoardRecord> {
    return _.orderBy(data, r => r.score, ["desc"]);
  }

  public static getDraggingClass(isDragging: boolean): string {
    return isDragging ? "has-background-primary" : "";
  }
}

/**
 * Do not add instance methods.
 */
export class CompletedGame {
  private static _nullGame: CompletedGame;
  constructor(
    public id: string = "",
    public winnerId: string = "",
    public winnerScore: number = 0,
    public loserId: string = "",
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

  public static isNull(player?: Player): boolean {
    return !player || this.nullPlayer().id === player.id;
  }
}

export class LeaderBoardRecord {
  private static _nullRecord: LeaderBoardRecord;

  constructor(
    public player: Player,
    public wins: number = 0,
    public losses: number = 0,
    public score: number = 0
  ) {}

  public static getDragName(): string {
    return "leaderBoardRecord";
  }

  public static getWinningPercentage(record: LeaderBoardRecord): number {
    const count = record.wins + record.losses;
    return count === 0 ? 0 : record.wins / count;
  }

  public static scoreAsString(record: LeaderBoardRecord): string {
    return record.score.toFixed(3);
  }

  public static nullRecord(): LeaderBoardRecord {
    return (LeaderBoardRecord._nullRecord =
      LeaderBoardRecord._nullRecord ||
      new LeaderBoardRecord(Player.nullPlayer()));
  }

  public static isNull(record: LeaderBoardRecord): boolean {
    return (
      !record || record === this._nullRecord || Player.isNull(record.player)
    );
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
    public winByMargin = 2,
    public switchServeEvery = 5,
    public startDate?: Date
  ) {
    this.startDate = startDate || new Date(Date.now());
  }

  public winnerIs(): Player {
    if (this.playerOneScore < this.winAt && this.playerTwoScore < this.winAt)
      return Player.nullPlayer();
    let difference = this.playerOneScore - this.playerTwoScore;
    if (Math.abs(difference) >= this.winByMargin) {
      return this.playerOneScore > this.playerTwoScore
        ? this.playerOne
        : this.playerTwo;
    }
    return Player.nullPlayer();
  }

  public getPlayerHasServe(): number {
    const total = this.playerOneScore + this.playerTwoScore;
    const divFloor = Math.floor(total / this.switchServeEvery);
    const oddOrEven = divFloor % 2; // 0 is odd, 1 is even.
    const playerNumber = oddOrEven + 1;
    const advantageThreshold = this.winAt - 1;

    if (
      this.playerOneScore < advantageThreshold &&
      this.playerTwoScore < advantageThreshold
    ) {
      return playerNumber;
    }

    if (this.playerOneScore === this.playerTwoScore) return playerNumber;
    return this.playerOneScore > this.playerTwoScore ? 2 : 1;
  }

  public getCompletedGame(): CompletedGame {
    const winner = this.winnerIs();
    if (Player.isNull(winner)) return CompletedGame.nullGame();

    const game = CompletedGame.new();
    game.winnerId = winner.id;
    game.startDate = this.startDate;
    game.endDate = new Date(Date.now());

    if (this.playerOne === winner) {
      game.winnerScore = this.playerOneScore;
      game.loserId = this.playerTwo.id;
      game.loserScore = this.playerTwoScore;
      return game;
    }

    game.winnerScore = this.playerTwoScore;
    game.loserId = this.playerOne.id;
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
}
