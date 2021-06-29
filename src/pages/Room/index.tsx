import cx from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { FormEvent, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useRoom from "../../hooks/useRoom";
import { database } from "../../services/firebase";
import { Button, RoomCode, Question } from "../../components";

import logoImg from "../../assets/images/logo.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg";
import perguntasImg from "../../assets/images/perguntas.svg";

import styles from "./styles.module.scss";
import useTheme from "../../hooks/useTheme";

type RoomParams = {
  id: string;
};

const Room = () => {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const { user, signInWithGoogle, signOut } = useAuth();
  const { toggleDarkMode, isDark } = useTheme();
  const [newQuestion, setNewQuestion] = useState("");

  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  const moveToHome = () => {
    history.push("/");
  };

  const loginWithGoogle = async () => {
    if (!user) {
      await signInWithGoogle();
      history.push(`/rooms/${roomId}`)

      toast.success('Login feito com sucesso!')
    }
  }

  const singOutAccount = async () => {
    if (user) {
      await signOut();
      history.push('/');
    }
  }
 
  const handleSendQuesiton = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`/rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
    toast.success('Pergunta criada!')
  };

  const handleLikeQuestion = async (
    questionId: string,
    likeId: string | undefined
  ) => {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  };

  return (
    <div className={styles.pageRoom}>
      <header>
        <div className={styles.content}>
          <Toaster />
          <img src={isDark ? logoDarkImg : logoImg} alt="Letmeask" onClick={moveToHome} />
          <div>
            <RoomCode code={roomId} />
            <button type="button" onClick={toggleDarkMode}>
              {isDark ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className={styles.roomTitle}>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <form onSubmit={handleSendQuesiton}>
          <textarea
            placeholder="O que você quer perguntar"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className={styles.formFooter}>
            {user ? (
              <div className={styles.userInfo}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
                <button onClick={singOutAccount}>(sair)</button>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button onClick={loginWithGoogle}>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar Pergunta
            </Button>
          </div>
        </form>
        {questions.length === 0 && (
          <div className={styles.nothingQuestions}>
            <img src={perguntasImg} alt="Nenhuma pergunta" />
            <strong>Nenhuma pergunta por aqui...</strong>
            <p>
              Envie o código desta sala para seus amigos e comece a respoder
              perguntas!
            </p>
          </div>
        )}
        <div className={styles.questionList}>
          {questions
            .sort((b, a) => a.likeCount - b.likeCount)
            .sort((a, b) => Number(a.isAnswered) - Number(b.isAnswered))
            .sort((b, a) => Number(a.isHighlighted) - Number(b.isHighlighted))
            .map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <button
                      type="button"
                      className={cx(styles.questionButtons, {
                        active: question.likeId,
                      })}
                      onClick={() =>
                        handleLikeQuestion(question.id, question.likeId)
                      }
                      aria-label="Marcar como gostei"
                    >
                      {question.likeCount > 0 && (
                        <span>{question.likeCount}</span>
                      )}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                          stroke="#737380"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </Question>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default Room;
