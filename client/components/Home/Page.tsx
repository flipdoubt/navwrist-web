import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import Api, { LeaderBoardRecord, CurrentGame, CompletedGame, Player } from "../../api";
import Scoreboard from "./ScoreBoard";
import Leaderboard from "./LeaderBoard";

// Stateful component SSR needs a non-null initial state:
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
const initialState = {
  completedGames: new Array<CompletedGame>(),
  currentGame: CurrentGame.nullGame(),
  leaderBoardData: new Array<LeaderBoardRecord>(),
  players: new Array<Player>()
};
type State = Readonly<typeof initialState>

export default class Page extends React.Component<
  RouteComponentProps<{}>,
  State
> {
  readonly state = initialState;
  constructor(props: any) {
    super(props);
    this.gameCompleted = this.gameCompleted.bind(this);
  }

  gameCompleted(game: CompletedGame) {
    const{completedGames, players} = this.state;
    completedGames.push(game);
    const leaderBoardData = Api.getLeaderBoardData(players, completedGames);
    this.setState({completedGames, leaderBoardData});
  }

  public componentDidMount(): void {
    Api.fetchData().then(data => {
      const players = Api.getDictionaryValues(data.players);
      const completedGames = Api.getDictionaryValues(data.completedGames);
      const leaderBoardData = Api.getLeaderBoardData(players, completedGames);
      // TODO: Remove hardcoding of current game when dragging is implemented.
      const {currentGame} = this.state;
      const playerValues = Api.getDictionaryValues(data.players);
      currentGame.playerOne = playerValues[0];
      currentGame.playerTwo = playerValues[1];
      this.setState({completedGames, currentGame, leaderBoardData, players});
    });
  }

  public render() {
    return (
      <React.Fragment>
        <Scoreboard currentGame={this.state.currentGame} gameCompleted={this.gameCompleted} />
        <Leaderboard players={this.state.leaderBoardData} />
      </React.Fragment>
    );
  }
}
