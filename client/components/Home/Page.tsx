import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import Api, { Data, LeaderBoardRecord, CurrentGame } from "../../api";
import Scoreboard from "./ScoreBoard";
import Leaderboard from "./LeaderBoard";

// Stateful component SSR needs a non-null initial state:
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
const initialState = { players: new Array<LeaderBoardRecord>(), currentGame: CurrentGame.nullGame()};
type State = Readonly<typeof initialState>

export default class Page extends React.Component<
  RouteComponentProps<{}>,
  State
> {
  readonly state = initialState;
  constructor(props: any) {
    super(props);
  }

  public componentDidMount(): void {
    Api.fetchData().then(data => {
      const players = data.getLeaderBoardData();
      this.setState({ players });
    });
  }

  public render() {
    return (
      <React.Fragment>
        <Scoreboard currentGame={this.state.currentGame} />
        <Leaderboard players={this.state.players} />
      </React.Fragment>
    );
  }
}
