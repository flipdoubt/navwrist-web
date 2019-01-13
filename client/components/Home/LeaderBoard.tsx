import * as React from "react";
import styled from "styled-components";
import { LeaderBoardRecord } from "../../api";
import Section from "../UI/Section";

type LeaderBoardProps = {
  players: Array<LeaderBoardRecord>;
};

const Table = styled.div`
  padding: 1rem;
`;

export default class LeaderBoard extends React.Component<LeaderBoardProps, {}> {
  public render() {
    return (
      <Section title="Leaderboard">
        <div className="sub-section">
          <p>List players here, sorted by wins or some magical algorithm.</p>
          <p>Drag players up to the scoreboard to play a new game.</p>
          <Table>
            {this.props.players.map((p, i) => {
              return (
                <div key={p.player.id}>
                  {p.player.name}: {p.winCount} - {p.lossCount}
                </div>
              );
            })}
          </Table>
        </div>
      </Section>
    );
  }
}
