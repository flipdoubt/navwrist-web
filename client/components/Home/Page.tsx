import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import Api, { LeaderBoardRecord, CurrentGame, CompletedGame, Player } from "../../api";
import Scoreboard from "./ScoreBoard";
import Leaderboard from "./LeaderBoard";

// Stateful component SSR needs a non-null initial state:
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
const initialState = {
  leaderBoardData: new Array<LeaderBoardRecord>(),
  showWinner: false
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

  savePlayer(player: Player): void {
    Api.postPlayer(player).then(postResponse => {
      if(!postResponse) return;
      Api.fetchLeaderBoardRecord(player.id).then(fetchResult => {
        const {leaderBoardData} = this.state;
        Api.updateFetchedLeaderBoardData([fetchResult], leaderBoardData);
        this.setState({leaderBoardData});
      })
    });
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
        Api.updateFetchedLeaderBoardData(result, leaderBoardData);
        this.setState({leaderBoardData, showWinner: true});
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
        <Scoreboard gameCompleted={game => this.gameCompleted(game)}/>
        <Leaderboard records={leaderBoardData} savePlayer={(player) => this.savePlayer(player)} />
      </React.Fragment>
    );
  }
}
