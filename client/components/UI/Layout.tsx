import * as React from "react";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTableTennis } from '@fortawesome/free-solid-svg-icons'

library.add(faTableTennis);

export class Layout extends React.Component<{}, {}> {
  public render() {
    return (
      <React.Fragment>
        <nav className="navbar">
          <section className="container has-text-centered">
            <div className="level-item title has-text-weight-light has-text-primary">
              navwrist.net
            </div>
          </section>
        </nav>
        <section className="section">
          <div className="container">{this.props.children}</div>
        </section>
      </React.Fragment>
    );
  }
}
