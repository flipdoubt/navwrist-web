import * as React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Api, { Player, LeaderBoardRecord } from "../../api";

const Score = styled.div`
  width: 40vw;
  min-width: 250px;
  max-width: 25rem;
`;
const ScoreValue = styled.span`
  font-size: 6.5rem;
`;

const ServeIndicator = styled.span`
  position: absolute;
  top: 50%;
  margin-left: 1rem;
`;

type Props = {
  player: Player;
  title?: string;
  isServing?: boolean;
  isFinal?: boolean;
  score: number;
  newPlayerWillEnterGame?: (newPlayer: Player) => boolean;
  scoreDidChange?: (newScore: number) => void;
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
    if (this.props.isFinal || Player.isNull(this.props.player)) return;
    const newScore = this.props.score + changeAmount;
    if (this.props.scoreDidChange) this.props.scoreDidChange(newScore);
  }

  render() {
    const name = Player.isNull(this.props.player)
      ? this.props.title || "Drag Player"
      : this.props.player.name;
    const headerClass =
      "card-header-title title is-3 has-text-weight-light has-text-centered " +
      Api.getDraggingClass(this.state.isDragging);
    return (
      <div
        className="card"
        onDragOverCapture={e => this.onDragOver(e)}
        onDragLeaveCapture={e => this.onDragLeave(e)}
        onDrop={e => this.onDrop(e)}
      >
        <div className="card-header">
          <div className={headerClass}>{name}</div>
        </div>

        <Score className="has-text-centered has-text-weight-light has-background-primary">
          <ScoreValue>{this.props.score}</ScoreValue>
          {!this.props.isServing ? null : (
            <ServeIndicator>
              <FontAwesomeIcon icon="table-tennis" title="serving" />
            </ServeIndicator>
          )}
        </Score>

        <div className="card-footer">
          <a
            className="card-footer-item has-text-primary title is-4"
            href="#addPoint"
            title="Add Point"
            onClick={() => this.incrementScore(1)}
          >
            +
          </a>
          <a
            className="card-footer-item has-text-primary title is-4"
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
    try {
      if (!data) {
        console.log("onDrop: No data for " + dataName);
        return;
      }
      if (!this.props.newPlayerWillEnterGame) {
        console.log("onDrop: No handler for newPlayerWillEnterGame.");
        return;
      }
      const record = Object.assign(
        JSON.parse(data),
        LeaderBoardRecord.prototype
      );
      this.props.newPlayerWillEnterGame(record.player);
    } finally {
      this.setState({ isDragging: false });
    }
  }
}
