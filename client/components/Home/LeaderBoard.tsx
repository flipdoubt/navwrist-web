import * as React from 'react';
import Section from './../UI/Section';

export default class LeaderBoard extends React.Component<{}, {}> {
  public render() {
    return <Section title="Leaderboard">
      <div className='sub-section'>
        <p>List players here, sorted by wins or some magical algorithm.</p>
        <p>Drag players up to the scoreboard to play a new game.</p>
      </div>
    </Section>;
  }
}
