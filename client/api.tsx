import * as _ from 'lodash';
import {Dictionary} from 'lodash';

export default class Api {
  public static newId () : string {
    /**
     * From https://stackoverflow.com/questions/13212521/typescript-static-classes.
     */
    return ([1e7] as any +-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  /**
   * TODO: Get from database.
   */
  public static fetchData () : Data {
    return this.getSampleData();
  }

  public static getSampleData() : Data {
    const data = new Data();
    const player1 = Player.new("Franko");
    const player2 = Player.new("Everyone Else");
    data.players[player1.id] = player1;
    data.players[player2.id] = player2;
    return data;
  }

  public static getDictionaryValues<T>(input : Dictionary<T>) : Array<T> {
    return _.values(input);
  }
}

export class Game {
  constructor(
    public id: string = "",
    public playerOne: string = "", public playerOneScore: number = 0,
    public playerTwo: string = "", public playerTwoScore: number = 0,
    public startDate?: Date, public endDate?: Date
  ) {}

  public containsPlayer(id: string) : Boolean{
    return this.playerOne === id || this.playerTwo === id;
  }

  public static new() : Game {
    return new Game(Api.newId());
  }
}

export class Player {
  private static _nullPlayer = new Player();
  constructor(
    public name: string = "", public id: string = ""
  ) {}

  public static new (name: string = "") : Player {
    return new Player(name, Api.newId());
  }

  public static nullPlayer () : Player {
    return this._nullPlayer;
  }
}

export class CurrentGame {
  public playerOneScore : number = 0;
  public playerTwoScore : number = 0;
  constructor(
    public playerOne : Player, public playerTwo : Player, public winAt = 21, public startDate? : Date){
      this.startDate = startDate || new Date(Date.now());
  }

  public winnerIs() : Player {
    if (this.playerOneScore < this.winAt && this.playerTwoScore < this.winAt) return Player.nullPlayer();
    let difference = this.playerOneScore - this.playerTwoScore;
    if (Math.abs(difference) >= 2) {
      return this.playerOneScore > this.playerTwoScore
        ? this.playerOne
        : this.playerTwo;
    }
    return Player.nullPlayer();
  }
}

export class Data {
  public currentGame? : CurrentGame;

  constructor(
    public players: Dictionary<Player> = {},
    public games: Dictionary<Game> = {}
    ) {}

    public getNumberOfPlayers() : number {
      return _.size(this.players);
    }

  public getPlayerAtIndex(index : number = 0) : Player {
    if(index >= this.getNumberOfPlayers()) return new Player();
    return _.values(this.players)[index];
  }
}
