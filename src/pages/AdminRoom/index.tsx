import { useHistory, useParams } from "react-router-dom";

import useRoom from "../../hooks/useRoom";

import { RoomCode, Question, Button } from "../../components";
import logoImg from "../../assets/images/logo.svg";
import deleteImg from '../../assets/images/delete.svg';

import "./styles.scss";
import { database } from "../../services/firebase";

type RoomParams = {
  id: string;
};

const AdminRoom = () => {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;
  
  const { questions, title } = useRoom(roomId);

  const handleEndRoom = async () => {
    await database.ref(`/rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  const moveToHome = () => {
    history.push('/');
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={moveToHome}/>
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
         
        </div>
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question 
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminRoom;
