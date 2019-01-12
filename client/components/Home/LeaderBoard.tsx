import * as React from 'react';
import {Player} from '../../api';
import Section from '../UI/Section';

type LeaderBoardProps = {
  players: Array<Player>;
}

export default class LeaderBoard extends React.Component<LeaderBoardProps, {}> {
  public render() {
    return <Section title="Leaderboard">
      <div className='sub-section'>
        <p>List players here, sorted by wins or some magical algorithm.</p>
        <p>Drag players up to the scoreboard to play a new game.</p>
        {this.props.players.map((p, i) => {
          return <div>{p.id}: {p.name}</div>;
        })}
      </div>
    </Section>;
  }
}
