import { useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { Button } from "../../components";
import { database } from "../../services/firebase";
import { FaMoon, FaSun } from "react-icons/fa";

import illustrationImg from "../../assets/images/illustration.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg"
import logoImg from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";
import entrarImg from "../../assets/images/entrar.svg";

import styles from "./styles.module.scss";
import useTheme from "../../hooks/useTheme";

const Home = () => {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState("");
  const { signInWithGoogle, user } = useAuth();
  const { toggleDarkMode, isDark } = useTheme();

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  };

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

  return (
    <div className={styles.pageAuth}>
      <aside>
        <button type="button" onClick={toggleDarkMode}>
          {isDark ? <FaMoon /> : <FaSun />}
        </button>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className={styles.mainContent}>
          <img src={isDark ? logoDarkImg : logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className={styles.createRoom}>
            <img src={googleIcon} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className={styles.separator}>ou entre em um sala</div>
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
        </div>
      </main>
    </div>
  );
};

export default Home;
