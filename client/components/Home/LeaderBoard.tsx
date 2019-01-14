import * as React from "react";
import { Section, Table } from "react-bulma-components";
import { LeaderBoardRecord } from "../../api";
import AppPanel from "../UI/AppPanel";

type LeaderBoardProps = {
  players: Array<LeaderBoardRecord>;
};

export default class LeaderBoard extends React.Component<LeaderBoardProps, {}> {
  public render() {
    return (
      <AppPanel title="Leaderboard">
        <div className="table-container">
          <p>
            List players here, sorted by wins or some magical algorithm. Drag
            players up to the scoreboard to play a new game.
          </p>

          <Table>
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
              {this.props.players.map((p, i) => {
                return (
                  <tr key={p.player.id}>
                    <td>{i + 1}</td>
                    <td>{p.player.name}</td>
                    <td>{p.winCount}</td>
                    <td>{p.lossCount}</td>
                    <td>{p.getWinningPercentage()}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </AppPanel>
    );
  }
}
