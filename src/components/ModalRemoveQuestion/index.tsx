import Modal from "react-modal";
import { useState } from "react";

import { database } from "../../services/firebase";
import Button from "../Button";

import removeQuestionImg from "../../assets/images/remove-question.svg";
import deleteImg from "../../assets/images/delete.svg";

import styles from "./styles.module.scss";

type Props = {
  questionId: string;
  roomId: string;
};

const ModalRemoveQuestion = ({questionId, roomId}: Props) => {
  const [modalRemoveQuestionIsOpen, setModalRemoveQuestionIsOpen] = useState(false);

  const togleStateModalRemoveQuestion = () => {
    setModalRemoveQuestionIsOpen(!modalRemoveQuestionIsOpen);
  };

  const handleDeleteQuestion = async () => {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .remove();

    togleStateModalRemoveQuestion();
  };

  return (
    <>
      <button type="button" onClick={() => togleStateModalRemoveQuestion()}>
        <img src={deleteImg} alt="Remover pergunta" />
      </button>
      <Modal
        isOpen={modalRemoveQuestionIsOpen}
        onRequestClose={togleStateModalRemoveQuestion}
        className={styles.content}
        overlayClassName={styles.overlay}
        ariaHideApp={false}
      >
        <div>
          <img src={removeQuestionImg} alt="Excluir pergunta" />
          <strong>Excluir pergunta</strong>
          <p>Tem certeza que você deseja excluir esta pergunta?</p>
          <div className={styles.buttons}>
            <Button onClick={togleStateModalRemoveQuestion}>Cancelar</Button>
            <Button onClick={handleDeleteQuestion}>Sim, excluir</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalRemoveQuestion;
