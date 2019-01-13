import * as React from "react";
import AppPanel from "../UI/AppPanel";
import { Content, Level } from "react-bulma-components";
import { CurrentGame } from "../../api";
import ScoreBoardPlayer from "./ScoreBoardPlayer";

const initialState = {
  currentGame: CurrentGame.nullGame()
};
type State = Readonly<typeof initialState>;
type Props = {
  currentGame: CurrentGame;
};
export default class ScoreBoard extends React.Component<Props, State> {
  readonly state = initialState;

  componentDidMount() {
    const { currentGame } = this.props;
    this.setState({ currentGame });
  }

  public render() {
    return (
      <AppPanel title="Scoreboard">
        <Content>
          <p>Drag players here.</p>
          <p>
            Show the score, buttons to increment, start date, and time elapsed.
          </p>
        </Content>
        <Level>
          <Level.Side align="left">
            <Level.Item>
              <ScoreBoardPlayer
                label="Player 1"
                player={this.state.currentGame.playerOne}
                color="has-background-primary"
              />
            </Level.Item>
            <Level.Item>
              <Content>- vs -</Content>
            </Level.Item>
            <Level.Item>
              <ScoreBoardPlayer
                label="Player 2"
                player={this.state.currentGame.playerTwo}
                color="has-background-info"
              />
            </Level.Item>
          </Level.Side>
        </Level>
      </AppPanel>
    );
  }
}
