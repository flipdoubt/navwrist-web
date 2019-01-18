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
    this.gameCompleted = this.gameCompleted.bind(this);
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

      // this.setState(state => {
      //   const {leaderBoardData} = state;
      //   const winner = LeaderBoardRecord.find(state.leaderBoardData, game.winner);
      //   const loser = LeaderBoardRecord.find(state.leaderBoardData, game.loser);
      //   const wIndex = state.leaderBoardData.indexOf(winner);
      //   const lIndex = state.leaderBoardData.indexOf(loser);


      //   console.log(wIndex);
      //   console.log(lIndex);

      //   if(wIndex >= 0){
      //     const wCopy = {...leaderBoardData[wIndex]};
      //     wCopy.wins++;
      //     leaderBoardData[wIndex] = wCopy;
      //   }

      //   if(lIndex >= 0){
      //     const lCopy = {...leaderBoardData[lIndex]};
      //     lCopy.losses++;
      //     leaderBoardData[lIndex] = lCopy;
      //   }
      //   return {leaderBoardData};
      // });
    });
  }

  public componentDidMount(): void {
    Api.fetchLeaderBoardData().then(leaderBoardData => {
      this.setState({leaderBoardData});
    });
  }

  public render() {
    const {leaderBoardData} = this.state;
    const record1 = leaderBoardData.length > 0 ? leaderBoardData[0] : LeaderBoardRecord.nullRecord();
    const record2 = leaderBoardData.length > 1 ? leaderBoardData[1] : LeaderBoardRecord.nullRecord();
    return (
      <React.Fragment>
        <Scoreboard record1={record1} record2={record2} gameCompleted={this.gameCompleted} />
        <Leaderboard players={leaderBoardData} />
      </React.Fragment>
    );
  }
}
