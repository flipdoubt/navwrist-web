import * as React from "react";
import { Card, Content } from "react-bulma-components";
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
  label?: string;
  color: string;
  isServing?: boolean;
  isWinner?: boolean;
  isFinal?: boolean;
  newPlayerWillEnterGame?: (newPlayer: Player) => boolean;
  scoreChanged?: (newScore: number) => void;
};

const initialState = {
  score: 0,
  isDragging: false,
};
type State = Readonly<typeof initialState>;

export default class ScoreBoardPlayer extends React.Component<Props, State> {
  readonly state = initialState;

  constructor(props) {
    super(props);
    this.incrementScore = this.incrementScore.bind(this);
  }

  componentWillReceiveProps(props) {
    if(Player.isNull(props.player)) {
      this.setState({score: 0});
    }
  }

  incrementScore(changeAmount: number) {
    if (this.props.isFinal || this.props.player === Player.nullPlayer()) return;
    const newScore = this.state.score + changeAmount;
    this.setState({ score: newScore });
    if (this.props.scoreChanged) this.props.scoreChanged(newScore);
  }

  render() {
    const color = this.props.isWinner ? "has-background-success" : "";
    const player = this.props.player;
    const name = player.name || "Add Player";
    return (
      <Card
        onDragOverCapture={e=> this.onDragOver(e)}
        onDragLeaveCapture={e => this.onDragLeave(e)}
        onDrop={e => this.onDrop(e)}
      >
        <Card.Header>
          <Card.Header.Title className={Api.getDraggingClass(this.state.isDragging)}>{name}</Card.Header.Title>
        </Card.Header>

        <Score className={color + " has-text-centered"}>
          {this.state.score} {this.props.isServing ? "o" : " "}
        </Score>
        <Card.Footer>
          <Card.Footer.Item
            renderAs="a"
            href="#addPoint"
            title="Add Point"
            onClick={() => this.incrementScore(1)}
          >
            +
          </Card.Footer.Item>
          <Card.Footer.Item
            renderAs="a"
            href="#removePoint"
            title="Remove Point"
            onClick={() => this.incrementScore(-1)}
          >
            -
          </Card.Footer.Item>
        </Card.Footer>
      </Card>
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

      if(this.props.newPlayerWillEnterGame && this.props.newPlayerWillEnterGame(record.player)){
        console.log(`ScoreBoardPlayer: Added ${record.player.id}.`)
        this.setState({ isDragging: false, score: 0 });
        return;
      }
      console.log("onDrop: No handler for newPlayerWillEnterGame.");
      return;
    }

    console.log("onDrop: No data for " + dataName);
  }
}
