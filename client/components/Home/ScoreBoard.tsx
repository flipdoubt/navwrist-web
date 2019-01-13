import * as React from 'react';
import Section from './../UI/Section';
import { CurrentGame } from '../../api';

const initialState = {
  currentGame : CurrentGame.nullGame()
}
type State = Readonly<typeof initialState>;
type Props = {
  currentGame : CurrentGame
}
export default class ScoreBoard extends React.Component<Props, State> {
  readonly state = initialState;

  componentDidMount(){
    const {currentGame} = this.props;
    this.setState({currentGame});
  }

  public render() {
    return <Section title="Scoreboard">
      <div className='sub-section'>
        <p>Drag players here.</p>
        <p>Show the score, buttons to increment, start date, and time elapsed.</p>
        <p>Player 1: {this.state.currentGame.playerOneScore} -vs- Player 2: {this.state.currentGame.playerTwoScore}</p>
      </div>
    </Section>;
  }
}
