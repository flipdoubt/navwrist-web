import * as React from 'react';

type SectionProps = {
    title: string;
  }

export default class Section extends React.Component<SectionProps> {

  public render() {
    return <div className='section'>
      <h2>{ this.props.title }</h2>
      { this.props.children }
    </div>;
  }
}
