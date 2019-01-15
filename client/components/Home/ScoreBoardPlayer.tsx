import * as React from "react";
import { Card } from "react-bulma-components";
import styled from "styled-components";
import { Player } from "../../api";

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
  scoreChanged?: (newScore: number) => void;
};
const initialState = {
  score: 0
};

type State = Readonly<typeof initialState>;

export default class ScoreBoardPlayer extends React.Component<Props, State> {
  readonly state = initialState;

  constructor(props) {
    super(props);
    this.incrementScore = this.incrementScore.bind(this);
  }

  incrementScore(changeAmount: number) {
    if(this.props.isFinal) return;
    const newScore = this.state.score + changeAmount;
    this.setState({score: newScore});
    if(this.props.scoreChanged)
      this.props.scoreChanged(newScore);
  }

  render() {
    const color = this.props.color + " has-text-light has-text-centered";
    const player = this.props.player;
    const name = player.name || "Player?";
    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>
            {name}
          </Card.Header.Title>
        </Card.Header>

        <Score className={color}>
          {this.state.score}
          { " " }
          {this.props.isServing ? "o" : " " }
          </Score>
        <Card.Footer>
          <Card.Footer.Item renderAs="a" href="#addPoint" title="Add Point" onClick={() => this.incrementScore(1)}>
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
}
