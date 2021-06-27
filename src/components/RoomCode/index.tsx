import copyImg from '../../assets/images/copy.svg';

import styles from './styles.module.scss';

type RoomCodeProps = {
  code: string;
}

const RoomCode = (props: RoomCodeProps) => {
  const copyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(props.code)
  }

  return (
    <button onClick={copyRoomCodeToClipboard} className={styles.roomCode}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}

export default RoomCode;