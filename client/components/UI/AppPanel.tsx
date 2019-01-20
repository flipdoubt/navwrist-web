import * as React from "react";

type Props = {
  title: string;
};

export default class AppPanel extends React.Component<Props> {
  public render() {
    return (
      <div className="panel">
        <div className="panel-heading">{this.props.title}</div>
        <div className="panel-block">
          <div className="column">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
