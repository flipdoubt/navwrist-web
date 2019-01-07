import * as React from 'react';
import Styled from 'styled-components';

const Container = Styled.div`
  padding: 1em;
  min-height: 100vh;
`;

// Navbar and footer would go here.
export class Layout extends React.Component<{}, {}> {
  public render() {
    return (
      <Container className='layout'>
        <h1>Ping Pong Pi</h1>
        { this.props.children }
      </Container>
    );
  }
}

