import * as React from 'React';
import Api, {LeaderBoardRecord} from '../../api';

const defaultProps = {
  record: LeaderBoardRecord.nullRecord(),
  rank: 0
}
type Props = typeof defaultProps;

const initialState = {
  isDragging : false
}
type State = typeof initialState;

export default class LeaderBoadRow extends React.Component<Props, State>{
  readonly state = initialState;
  render () {
    const {record, rank} = this.props;
    return (
      <tr key={record.player.id}
        draggable
        className={Api.getDraggingClass(this.state.isDragging)}
        onDragStart={(e: React.DragEvent<HTMLTableRowElement>) => this.onDragStart(e, record)}
        onDragEnd={(e: React.DragEvent<HTMLTableRowElement>) => this.onDragEnd(e, record)}
        >
        <td className="has-text-weight-bold">{rank}</td>
        <td>{record.player.name}</td>
        <td>{record.wins}</td>
        <td>{record.losses}</td>
        <td>{record.score.toFixed(3)}</td>
      </tr>);
  }
  onDragEnd(e: React.DragEvent<HTMLTableRowElement>, record: LeaderBoardRecord): void {
    this.setState({isDragging: false})
  }
  onDragStart(e: React.DragEvent<HTMLTableRowElement>, record: LeaderBoardRecord): void {
    this.setState({isDragging: true})
    e.dataTransfer.setData(LeaderBoardRecord.getDragName(), JSON.stringify(record))
  }
}