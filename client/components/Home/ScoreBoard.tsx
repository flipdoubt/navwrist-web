import * as React from "react";
import AppPanel from "../UI/AppPanel";
import { Content, Level } from "react-bulma-components";
import { CurrentGame, Player, CompletedGame } from "../../api";
import ScoreBoardPlayer from "./ScoreBoardPlayer";

const initialState = {
  currentGame: CurrentGame.nullGame(),
  winner: Player.nullPlayer()
};
type State = Readonly<typeof initialState>;
type Props = {
  currentGame: CurrentGame;
  gameCompleted?: (CompletedGame) => void;
};
export default class ScoreBoard extends React.Component<Props, State> {
  readonly state = initialState;

  constructor(props) {
    super(props);
    this.scoreChanged = this.scoreChanged.bind(this);
  }

  componentDidMount() {
    const { currentGame } = this.props;
    this.setState({ currentGame });
  }

  scoreChanged(player: Player, newScore: number){
    if(player === Player.nullPlayer()) {
      console.log("Score changed for nullPlayer");
      return;
    }

    const {currentGame} = this.state;

    if (currentGame.playerOne.id === player.id){
      currentGame.playerOneScore = newScore;
    } else if(currentGame.playerTwo.id === player.id) {
      currentGame.playerTwoScore = newScore;
    } else {
      console.log(`Could not change score for player-id ${player.id}.`);
      return;
    }

    this.setState({currentGame});

    const winner = currentGame.winnerIs();
    if(winner !== Player.nullPlayer()) {
      // TODO: Something dramatic.
      console.log(`And we have a winner: ${winner.name} with ${newScore}. Congratulations, Franko!`);
      if(this.props.gameCompleted) {
        this.props.gameCompleted(currentGame.getCompletedGame());
      }
      this.setState({winner});
    }
  }

  public render() {
    const {currentGame, winner} = this.state;
    const {playerOne, playerTwo} = currentGame;
    const isFinal = winner !== Player.nullPlayer();
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
                player={playerOne}
                color="has-background-primary"
                scoreChanged={newScore => this.scoreChanged(playerOne, newScore)}
                isWinner={winner.id === playerOne.id}
                isFinal={isFinal}
              />
            </Level.Item>
            <Level.Item>
              <Content>- vs -</Content>
            </Level.Item>
            <Level.Item>
              <ScoreBoardPlayer
                player={playerTwo}
                color="has-background-info"
                scoreChanged={newScore => this.scoreChanged(playerTwo, newScore)}
                isWinner={winner.id === playerTwo.id}
                isFinal={isFinal}
              />
            </Level.Item>
          </Level.Side>
        </Level>
      </AppPanel>
    );
  }
}
