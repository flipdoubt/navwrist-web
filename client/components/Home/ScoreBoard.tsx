import * as React from "react";
import AppPanel from "../UI/AppPanel";
import { Content, Level } from "react-bulma-components";
import { CurrentGame, Player, CompletedGame, LeaderBoardRecord } from "../../api";
import ScoreBoardPlayer from "./ScoreBoardPlayer";

const initialState = {
  currentGame: CurrentGame.nullGame(),
  winner: Player.nullPlayer()
};
type State = Readonly<typeof initialState>;
type Props = {
  gameCompleted?: (CompletedGame) => void;
};
export default class ScoreBoard extends React.Component<Props, State> {
  readonly state = initialState;

  constructor(props) {
    super(props);
    this.setStateNewGame = this.setStateNewGame.bind(this);
  }

  setStateNewGame(currentGame: CurrentGame) {
    currentGame.playerOneScore = 0;
    currentGame.playerTwoScore = 0;
    this.setState({currentGame, winner: Player.nullPlayer()});
  }

  onNewPlayerOne(newPlayer: Player): boolean {
    const {currentGame} = this.state;
    currentGame.playerOne = newPlayer;
    if (this.state.winner === currentGame.playerTwo) currentGame.playerTwo = Player.nullPlayer();
    this.setStateNewGame(currentGame);
    return true;
  }

  onNewPlayerTwo(newPlayer: Player): boolean {
    const {currentGame} = this.state;
    currentGame.playerTwo = newPlayer;
    if (this.state.winner === currentGame.playerOne) currentGame.playerOne = Player.nullPlayer();
    this.setStateNewGame(currentGame);
    return true;
  }

  scoreChanged(player: Player, newScore: number){
    if (Player.isNull(player)) {
      console.log("Score changed for nullPlayer");
      return;
    }

    if (Player.isNull(this.state.currentGame.playerOne)) {
      console.log("Cannot play without Player One.");
      return;
    }

    if (Player.isNull(this.state.currentGame.playerTwo)) {
      console.log("Cannot play without Player Two.");
      return;
    }

    const {currentGame} = this.state;

    if (currentGame.playerOne.id === player.id){
      currentGame.playerOneScore = newScore;
    } else if (currentGame.playerTwo.id === player.id) {
      currentGame.playerTwoScore = newScore;
    } else {
      console.log(`Could not change score for player-id ${player.id}.`);
      return;
    }

    const winner = currentGame.winnerIs();
    if (Player.isNull(winner)) {
      this.setState({currentGame});
      return;
    }

    // TODO: Something dramatic.
    console.log(`And we have a winner: ${winner.name} with ${newScore}.`);
    this.setState({currentGame, winner});
    if (!this.props.gameCompleted) return;
    this.props.gameCompleted(currentGame.getCompletedGame());
  }

  public render() {
    const {currentGame, winner} = this.state;
    const {playerOne, playerTwo} = currentGame;
    const isFinal = !Player.isNull(winner);
    return (
      <AppPanel title="Scoreboard">
        <Content>
          <p>
            Drag players here. Show the score, buttons to increment, start date, and time elapsed.
          </p>
        </Content>
        <Level>
          <Level.Side align="left">
            <Level.Item>
              <ScoreBoardPlayer
                player={playerOne}
                color="has-text-black"
                isWinner={isFinal && (winner.id === playerOne.id)}
                isFinal={isFinal}
                newPlayerWillEnterGame={newPlayer => this.onNewPlayerOne(newPlayer)}
                scoreChanged={newScore => this.scoreChanged(playerOne, newScore)}
              />
            </Level.Item>
            <Level.Item>
              <Content>- vs -</Content>
            </Level.Item>
            <Level.Item>
              <ScoreBoardPlayer
                player={playerTwo}
                color="has-text-danger"
                isWinner={isFinal && (winner.id === playerTwo.id)}
                isFinal={isFinal}
                newPlayerWillEnterGame={newPlayer => this.onNewPlayerTwo(newPlayer)}
                scoreChanged={newScore => this.scoreChanged(playerTwo, newScore)}
              />
            </Level.Item>
          </Level.Side>
        </Level>
      </AppPanel>
    );
  }
}
