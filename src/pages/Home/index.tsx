import { useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { ButtonToggleTheme, UserProfile, Button } from "../../components";
import { database } from "../../services/firebase";

import illustrationImg from "../../assets/images/illustration.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg";
import logoImg from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";
import entrarImg from "../../assets/images/entrar.svg";

import styles from "./styles.module.scss";
import useTheme from "../../hooks/useTheme";

const Home = () => {
  const history = useHistory();
  const { isDark } = useTheme();
  const { signInWithGoogle, user } = useAuth();

  const [newRoom, setNewRoom] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [optionSliderButton, setOptionSliderButton] = useState("create");

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`/rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exist.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  };

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  };

  const setCreateRoom = () => {
    setOptionSliderButton("create");
  };

  const setEnterTheRoom = () => {
    setOptionSliderButton("enter");
  };

  return (
    <div className={styles.pageAuth}>
      <header>
        {user && <UserProfile />}
        <ButtonToggleTheme />
      </header>
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        {!user ? (
          <div className={styles.newUser}>
            <img src={isDark ? logoDarkImg : logoImg} alt="Letmeask" />
            <button
              onClick={signInWithGoogle}
              className={styles.buttonCreateRoom}
            >
              <img src={googleIcon} alt="Logo do google" />
              Crie sua sala com o Google
            </button>
          </div>
        ) : (
          <div className={styles.loggedUser}>
            <img src={isDark ? logoDarkImg : logoImg} alt="Letmeask" />
            <div className={styles.sliderButton}>
              <button
                onClick={setCreateRoom}
                className={
                  optionSliderButton === "create" ? styles.buttonActive : ""
                }
              >
                Criar
              </button>
              <button
                onClick={setEnterTheRoom}
                className={
                  optionSliderButton === "enter" ? styles.buttonActive : ""
                }
              >
                Entrar
              </button>
            </div>
            {optionSliderButton === "create" ? (
              <>
                <h2>Crie uma nova sala</h2>
                <form onSubmit={handleCreateRoom}>
                  <input
                    type="text"
                    placeholder="Nome da sala"
                    onChange={(event) => setNewRoom(event.target.value)}
                    value={newRoom}
                  />
                  <Button type="submit">Criar sala</Button>
                </form>
              </>
            ) : (
              <>
                <h2>Entrar em uma sala</h2>
                <form onSubmit={handleJoinRoom}>
                  <input
                    type="text"
                    placeholder="Digite o código da sala"
                    onChange={(event) => setRoomCode(event.target.value)}
                    value={roomCode}
                  />
                  <Button type="submit">
                    <img src={entrarImg} alt="Entrar na sala" />
                    Entrar na sala
                  </Button>
                </form>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
