import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Api, { LeaderBoardRecord, Player } from "../../api";
import AppPanel from "../UI/AppPanel";
import LeaderBoardRow from "./LeaderBoardRow";
import PlayerModal from "./PlayerModal";

type Props = {
  records: Array<LeaderBoardRecord>;
  savePlayer: (player: Player) => void;
};
const initialState = {
  showPlayerModal: false
};
type State = typeof initialState;

export default class LeaderBoard extends React.Component<Props, State> {
  readonly state = initialState;

  onAddPlayer(): void {
    this.setState({ showPlayerModal: true });
  }

  onSavePlayer(player: Player): void {
    if (!Player.isNull(player)){
      this.props.savePlayer(player);
    }
    this.setState({ showPlayerModal: false });
  }

  onCancelPlayer() : void {
    this.setState({showPlayerModal: false});
  }

  public render() {
    const sorted = Api.sortLeaderBoardData(this.props.records);
    return (
      <AppPanel title="Leaderboard">
        {!this.state.showPlayerModal
          ? null
        : (
          <PlayerModal
          title="Add Player"
          show={this.state.showPlayerModal}
          player={Player.new()}
          save={player => this.onSavePlayer(player)}
          cancel={() => this.onCancelPlayer()}
        />
        )}

        <div className="field is-grouped">
          <div className="control">
            <button
              className="button is-primary is-outlined"
              onClick={() => this.onAddPlayer()}
            >
              <FontAwesomeIcon icon="user-plus" className="icon" /> <span className="icon-button-text">Add Player</span>
            </button>
          </div>
        </div>

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
              {sorted.map((p, i) => (
                <LeaderBoardRow key={p.player.id} record={p} rank={i + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </AppPanel>
    );
  }
}
