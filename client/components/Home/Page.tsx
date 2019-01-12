import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Api, {Data} from '../../api';
import Scoreboard from './ScoreBoard';
import Leaderboard from './LeaderBoard';

type PageState = {
  data: Data;
}

export default class Page extends React.Component<RouteComponentProps<{}>, PageState> {

    public componentWillMount(): void {
      const data = Api.fetchData();
      this.setState({data});
    }

  public render() {
    const players = Api.getDictionaryValues(this.state.data.players);
        return (
          <React.Fragment>
            <Scoreboard/>
            <Leaderboard players={players} />
          </React.Fragment>
        );
    }
}
