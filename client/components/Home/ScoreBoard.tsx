import * as React from 'react';
import Section from './../UI/Section';

export default class ScoreBoard extends React.Component<{}, {}> {
  public render() {
    return <Section title="Scoreboard">
      <div className='sub-section'>
        <p>Drag players here.</p>
        <p>Beneath the player and score, show date and elapsed time.</p>
      </div>
    </Section>;
  }
}
