import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Scoreboard from './ScoreBoard';
import Leaderboard from './LeaderBoard';

export default class Page extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return (
          <React.Fragment>
            <Scoreboard/>
            <Leaderboard/>
          </React.Fragment>
        );
    }
}
