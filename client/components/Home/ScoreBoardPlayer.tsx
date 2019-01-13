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
};
const initialState = {
  score: 0
};

type State = Readonly<typeof initialState>;

export default class ScoreBoardPlayer extends React.Component<Props, State> {
  readonly state = initialState;
  render() {
    const color = this.props.color + " has-text-light has-text-centered";
    const label = this.props.label || "Player";
    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>
            {this.props.label}: {this.props.player.name}
          </Card.Header.Title>
        </Card.Header>

        <Score className={color}>{this.state.score}</Score>
        <Card.Footer>
          <Card.Footer.Item renderAs="a" href="#addPoint" title="Add Point">
            +
          </Card.Footer.Item>
          <Card.Footer.Item
            renderAs="a"
            href="#removePoint"
            title="Remove Point"
          >
            -
          </Card.Footer.Item>
        </Card.Footer>
      </Card>
    );
  }
}
