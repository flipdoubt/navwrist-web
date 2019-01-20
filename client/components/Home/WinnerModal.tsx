import * as React from "React";

type Props = {
  show?: boolean;
  gameInfo?: string;
  newGame?: () => void;
  rematch?: () => void;
};

export default function WinnerModal(props: Props) {
  if (!props.show) {
    return null;
  }
  const gameInfo = props.gameInfo || "Probably Franko.";
  const newGame = props.newGame
    ? props.newGame
    : () => {};
    const rematch = props.rematch
    ? props.rematch
    : () => {};
  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">Winner, winner, chicken dinner.</h1>
          <h2 className="sub-title">{gameInfo}</h2>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={() => newGame()}>New Game</button>
          <button className="button" onClick={() => rematch()}>Rematch</button>
        </footer>
      </div>
    </div>
  );
}
