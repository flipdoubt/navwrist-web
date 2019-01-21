import * as React from "react";
import AppPanel from "../UI/AppPanel";
import { CurrentGame, Player, CompletedGame } from "../../api";
import ScoreBoardPlayer from "./ScoreBoardPlayer";
import WinnerModal from "./WinnerModal";

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
    this.setState({ currentGame, winner: Player.nullPlayer() });
  }

  onNewPlayerOne(newPlayer: Player): boolean {
    const { currentGame } = this.state;
    currentGame.playerOne = newPlayer;
    if (this.state.winner === currentGame.playerTwo) {
      currentGame.playerTwo = Player.nullPlayer();
    }
    this.setStateNewGame(currentGame);
    return true;
  }

  onNewPlayerTwo(newPlayer: Player): boolean {
    const { currentGame } = this.state;
    currentGame.playerTwo = newPlayer;
    if (this.state.winner === currentGame.playerOne) {
      currentGame.playerOne = Player.nullPlayer();
    }
    this.setStateNewGame(currentGame);
    return true;
  }

  onCloseModal() : void {
    this.setState({winner: Player.nullPlayer()});
  }

  onNewGame(): void {
    const { currentGame } = this.state;
    currentGame.playerOne = Player.nullPlayer();
    currentGame.playerTwo = Player.nullPlayer();
    this.setStateNewGame(currentGame);
  }

  onRematch(): void {
    const { currentGame } = this.state;
    const rematch = new CurrentGame(currentGame.playerOne, currentGame.playerTwo);
    this.setStateNewGame(currentGame);
  }

  scoreChanged(player: Player, newScore: number) {
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
    this.props.gameCompleted(currentGame.getCompletedGame());
  }

  public render() {
    const { currentGame, winner } = this.state;
    const { playerOne, playerTwo } = currentGame;
    const isFinal = !Player.isNull(winner);
    return (
      <AppPanel title="Scoreboard">
        {!isFinal ? null : (
            <WinnerModal
            show={true}
            winner={winner.name}
            loser={(winner === playerOne ? playerTwo.name : playerOne.name)}
            completedGame={currentGame.getCompletedGame()}
            newGame={() => this.onNewGame()}
            rematch={() => this.onRematch()}
            close={() => this.onCloseModal()}
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
              player={playerOne}
              score={currentGame.playerOneScore}
              isFinal={isFinal}
              isServing={currentGame.getPlayerHasServe() === 1}
              newPlayerWillEnterGame={newPlayer =>
                this.onNewPlayerOne(newPlayer)
              }
              scoreChanged={newScore => this.scoreChanged(playerOne, newScore)}
            />
          </div>
          <div className="level-item">
            <div className="content">- vs -</div>
          </div>
          <div className="level-item">
            <ScoreBoardPlayer
              player={playerTwo}
              score={currentGame.playerTwoScore}
              isFinal={isFinal}
              isServing={currentGame.getPlayerHasServe() === 2}
              newPlayerWillEnterGame={newPlayer =>
                this.onNewPlayerTwo(newPlayer)
              }
              scoreChanged={newScore => this.scoreChanged(playerTwo, newScore)}
            />
          </div>
        </div>
      </AppPanel>
    );
  }
}
