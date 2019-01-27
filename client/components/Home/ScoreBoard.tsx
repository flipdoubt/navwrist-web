import * as React from "react";
import AppPanel from "../UI/AppPanel";
import { CurrentGame, Player, CompletedGame } from "../../api";
import ScoreBoardPlayer from "./ScoreBoardPlayer";
import GameOverModal from "./GameOverModal";

type Props = {
  gameCompleted?: (CompletedGame) => void;
};

const initialState = {
  currentGame: CurrentGame.nullGame(),
  winner: Player.nullPlayer()
};
type State = Readonly<typeof initialState>;

export default class ScoreBoard extends React.Component<Props, State> {
  readonly state = initialState;

  constructor(props) {
    super(props);
    this.setStateNewGame = this.setStateNewGame.bind(this);
  }

  setStateNewGame(playerOne: Player, playerTwo: Player) : void {
    const { currentGame } = this.state;
    currentGame.newGame(playerOne, playerTwo);
    this.setState({ currentGame, winner: Player.nullPlayer() });
  }

  onNewPlayerOne(playerOne: Player): boolean {
    const playerTwo = this.state.winner === this.state.currentGame.playerTwo
      ? Player.nullPlayer()
      : this.state.currentGame.playerTwo;

    this.setStateNewGame(playerOne, playerTwo);
    return true;
  }

  onNewPlayerTwo(playerTwo: Player): boolean {
    const { currentGame } = this.state;
    const playerOne = this.state.winner === currentGame.playerOne
      ? Player.nullPlayer()
      : currentGame.playerOne;
    this.setStateNewGame(playerOne, playerTwo);
    return true;
  }

  onNewGame(): void {
    this.setStateNewGame(Player.nullPlayer(), Player.nullPlayer());
  }

  onRematch(): void {
    this.setStateNewGame(
      this.state.currentGame.playerOne, this.state.currentGame.playerTwo);
  }

  onScoreChanged(player: Player, newScore: number) {
    if (
      Player.isNull(player) ||
      Player.isNull(this.state.currentGame.playerOne) ||
      Player.isNull(this.state.currentGame.playerTwo)
    ) {
      return;
    }

    const { currentGame } = this.state;

    if (currentGame.playerOne.id === player.id) {
      currentGame.playerOneScore = newScore;
    } else if (currentGame.playerTwo.id === player.id) {
      currentGame.playerTwoScore = newScore;
    } else {
      console.log(`Could not change score for player-id ${player.id}.`);
      return;
    }

    const winner = currentGame.winnerIs();
    if (Player.isNull(winner)) {
      return;
    }

    this.setState({ currentGame, winner });
    if (!this.props.gameCompleted) return;
    const completedGame = currentGame.getCompletedGame();
    this.props.gameCompleted(completedGame);
  }

  public render() {
    const { currentGame, winner } = this.state;
    const { playerOne, playerTwo } = currentGame;
    const isFinal = !Player.isNull(winner);
    return (
      <AppPanel title="Scoreboard">
        {!isFinal ? null : (
            <GameOverModal
            winner={winner.name}
            loser={(winner === playerOne ? playerTwo.name : playerOne.name)}
            completedGame={currentGame.getCompletedGame()}
            newGame={() => this.onNewGame()}
            rematch={() => this.onRematch()}
          />
        )}

        <div className="content">
          <p>
            Drag players here. Show the score, buttons to increment, ranking,
            and time elapsed.
          </p>
        </div>
        <div className="level">
          <div className="level-item">
            <ScoreBoardPlayer
              title="Player One"
              player={playerOne}
              score={currentGame.playerOneScore}
              isFinal={isFinal}
              isServing={currentGame.getPlayerHasServe() === 1}
              newPlayerWillEnterGame={newPlayer =>
                this.onNewPlayerOne(newPlayer)
              }
              scoreDidChange={newScore => this.onScoreChanged(playerOne, newScore)}
            />
          </div>
          <div className="level-item">
            <div className="content">- vs -</div>
          </div>
          <div className="level-item">
            <ScoreBoardPlayer
              title="Player Two"
              player={playerTwo}
              score={currentGame.playerTwoScore}
              isFinal={isFinal}
              isServing={currentGame.getPlayerHasServe() === 2}
              newPlayerWillEnterGame={newPlayer =>
                this.onNewPlayerTwo(newPlayer)
              }
              scoreDidChange={newScore => this.onScoreChanged(playerTwo, newScore)}
            />
          </div>
        </div>
      </AppPanel>
    );
  }
}
