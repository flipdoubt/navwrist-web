import * as React from "react";
import { Player } from "../../api";
import Input from "../UI/Input";

type Props = {
  show: boolean;
  player: Player;
  title?: string;
  save?: (player: Player) => void;
  cancel?: () => void;
};
type State = {
  player?: Player
}
export default class PlayerModal extends React.Component <Props, State> {
  render (){
    if (!this.props.show) return null;
    const title = this.props.title ? this.props.title : "Player";
    const {player} = this.props;
    const save = this.props.save
      ? this.props.save
      : player => {
          console.log(player);
        };
    const cancel = this.props.cancel
      ? this.props.cancel
      : () => {
          console.log("Cancel player modal.");
        };
    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              <span className="has-text-primary ">{title}</span>
            </p>
            <button className="delete" onClick={() => cancel()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
              <Input
                type="text"
                name="name"
                title="Full Name"
                value={player.name}
                autoFocus={true}
                handleChange={value => {
                  player.name = value;
                  this.setState({player});
                }}
              />
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-primary is-outlined"
              onClick={e => save(this.state.player || Player.nullPlayer())}
            >
              OK
            </button>
            <button className="button is-outlined " onClick={() => cancel()}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
