import * as React from "react";
import { Panel, Box, Heading } from "react-bulma-components";

type Props = {
  title: string;
};

export default class AppPanel extends React.Component<Props> {
  public render() {
    return (
      <Panel>
        <Panel.Header>{this.props.title}</Panel.Header>
        <Panel.Block>
          <div className="column">{this.props.children}</div>
        </Panel.Block>
      </Panel>
    );
  }
}
