import * as React from "react";
import Api, { LeaderBoardRecord } from "../../api";
import AppPanel from "../UI/AppPanel";
import LeaderBoardRow from "./LeaderBoardRow";

type LeaderBoardProps = {
  records: Array<LeaderBoardRecord>;
};

export default class LeaderBoard extends React.Component<LeaderBoardProps, {}> {
  public render() {
    const sorted = Api.sortLeaderBoardData(this.props.records);
    return (
      <AppPanel title="Leaderboard">
        <div className="table-container">
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) =>
                <LeaderBoardRow key={p.player.id} record={p} rank={i + 1} />
              )}
            </tbody>
          </table>
        </div>
      </AppPanel>
    );
  }
}
