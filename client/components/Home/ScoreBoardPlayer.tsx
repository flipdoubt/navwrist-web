import * as React from "react";
import styled from "styled-components";
import Api, { Player, LeaderBoardRecord } from "../../api";

const Score = styled.div`
  font-size: 6rem;
  width: 40vw;
  min-width: 250px;
  max-width: 25rem;
`;

type Props = {
  player: Player;
  isServing?: boolean;
  isFinal?: boolean;
  score: number;
  newPlayerWillEnterGame?: (newPlayer: Player) => boolean;
  scoreChanged?: (newScore: number) => void;
};

const initialState = {
  isDragging: false
};
type State = Readonly<typeof initialState>;

export default class ScoreBoardPlayer extends React.Component<Props, State> {
  readonly state = initialState;

  constructor(props) {
    super(props);
    this.incrementScore = this.incrementScore.bind(this);
  }

  incrementScore(changeAmount: number) {
    if (this.props.isFinal || this.props.player === Player.nullPlayer()) return;
    const newScore = this.props.score + changeAmount;
    if (this.props.scoreChanged) this.props.scoreChanged(newScore);
  }

  render() {
    const player = this.props.player;
    const name = player.name || "Add Player";
    const draggingClass = "card-header-title title is-3 " + Api.getDraggingClass(this.state.isDragging);
    return (
      <div className="card"
        onDragOverCapture={e => this.onDragOver(e)}
        onDragLeaveCapture={e => this.onDragLeave(e)}
        onDrop={e => this.onDrop(e)}
      >
        <div className="card-header">
          <div className={draggingClass}>
            {name}
          </div>
        </div>

        <Score className="has-text-centered">
          {this.props.score} {this.props.isServing ? "o" : " "}
        </Score>
        <div className="card-footer">
          <a className="card-footer-item"
            href="#addPoint"
            title="Add Point"
            onClick={() => this.incrementScore(1)}
          >+</a>
          <a
            className="card-footer-item"
            href="#removePoint"
            title="Remove Point"
            onClick={() => this.incrementScore(-1)}
          >
            -
          </a>
        </div>
      </div>
    );
  }
  onDragLeave(e: React.DragEvent<Element>): any {
    this.setState({ isDragging: false });
  }

  onDragOver(e: React.DragEvent<Element>): any {
    this.setState({ isDragging: true });
    e.preventDefault();
  }

  onDrop(e: React.DragEvent<Element>): any {
    const dataName = LeaderBoardRecord.getDragName();
    const data = e.dataTransfer.getData(dataName);
    if (data) {
      const record = Object.assign(
        JSON.parse(data),
        LeaderBoardRecord.prototype
      );

      if (
        this.props.newPlayerWillEnterGame &&
        this.props.newPlayerWillEnterGame(record.player)
      ) {
        console.log(`ScoreBoardPlayer: Added ${record.player.id}.`);
        this.setState({ isDragging: false });
        return;
      }
      console.log("onDrop: No handler for newPlayerWillEnterGame.");
      return;
    }

    console.log("onDrop: No data for " + dataName);
  }
}
