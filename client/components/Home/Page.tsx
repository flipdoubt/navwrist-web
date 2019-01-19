import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import Api, { LeaderBoardRecord, CurrentGame, CompletedGame, Player } from "../../api";
import Scoreboard from "./ScoreBoard";
import Leaderboard from "./LeaderBoard";

// Stateful component SSR needs a non-null initial state:
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
const initialState = {
  leaderBoardData: new Array<LeaderBoardRecord>()
};
type State = Readonly<typeof initialState>

export default class Page extends React.Component<
  RouteComponentProps<{}>,
  State
> {
  readonly state = initialState;
  constructor(props: any) {
    super(props);
  }

  gameCompleted(game: CompletedGame) : void {
    Api.postCompletedGame(game).then(response => {
      if (!response) {
        return;
      }

      Promise.all([
        Api.fetchLeaderBoardRecord(game.winner),
        Api.fetchLeaderBoardRecord(game.loser)
      ]).then(result => {
        const {leaderBoardData} = this.state;
        const i1 = result.length > 0
          ? LeaderBoardRecord.indexOfPlayerId(leaderBoardData, result[0].player.id)
          : -1;
        const i2 = result.length > 1
          ? LeaderBoardRecord.indexOfPlayerId(leaderBoardData, result[1].player.id)
          : -1;
        if(i1 >= 0) leaderBoardData[i1] = result[0];
        if(i2 >= 0) leaderBoardData[i2] = result[1];
        this.setState({leaderBoardData});
      });
    });
  }

  public componentDidMount(): void {
    Api.fetchLeaderBoardData().then(leaderBoardData => {
      this.setState({leaderBoardData});
    });
  }

  public render() {
    const {leaderBoardData} = this.state;
    return (
      <React.Fragment>
        <Scoreboard gameCompleted={game => this.gameCompleted(game)} />
        <Leaderboard records={leaderBoardData} />
      </React.Fragment>
    );
  }
}
