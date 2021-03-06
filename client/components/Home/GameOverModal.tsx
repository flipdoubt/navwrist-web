import * as React from "React";
import { CompletedGame } from "client/api";

type Props = {
  winner: string;
  loser: string;
  completedGame: CompletedGame;
  newGame?: () => void;
  rematch?: () => void;
};

export default function GameOverModal(props: Props) {
  const newGame = props.newGame ? props.newGame : () => {};
  const rematch = props.rematch ? props.rematch : () => {};
  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="has-text-primary ">Game Over: </span>
            {props.winner} wins {props.completedGame.winnerScore} to{" "}
            {props.completedGame.loserScore}
          </p>
          <button className="delete" onClick={() => newGame()} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            <p>Sorry, {props.loser}. Ready for a rematch?</p>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-primary is-outlined"
            autoFocus
            onClick={() => rematch()}
          >
            Rematch
          </button>
          <button className="button is-outlined " onClick={() => newGame()}>
            New Game
          </button>
        </footer>
      </div>
    </div>
  );
}
