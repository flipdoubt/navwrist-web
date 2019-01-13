import * as React from "react";
import { Section, Container, Navbar, Header } from "react-bulma-components";
import styled from "styled-components";

const Logo = styled.div`
  font-size: 2rem;
`;

export class Layout extends React.Component<{}, {}> {
  public render() {
    return (
      <React.Fragment>
        <Navbar className="is-dark is-fixed">
          <Navbar.Brand>
            <Navbar.Item>
              <Logo>navwrist-web</Logo>
            </Navbar.Item>
          </Navbar.Brand>
        </Navbar>
        <Section>
          <Container>{this.props.children}</Container>
        </Section>
      </React.Fragment>
    );
  }
}
