import * as React from "react";
import styled from "styled-components";

const Logo = styled.div`
  font-size: 2rem;
`;

export class Layout extends React.Component<{}, {}> {
  public render() {
    return (
      <React.Fragment>
        <nav className="level has-background-warning panel-block is-fixed-top">
          <h1 className="level-item title is-2 has-text-weight-light has-text-centered has-text-grey">
            navwrist.net
          </h1>
        </nav>
        <section className="section is-paddingless">
          <div className="container">{this.props.children}</div>
        </section>
      </React.Fragment>
    );
  }
}
