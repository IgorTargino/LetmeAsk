import { useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { Button } from "../../components";
import { database } from "../../services/firebase";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";

import styles from "./styles.module.scss";

const Home = () => {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState("");
  const { signInWithGoogle, user } = useAuth();

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

    if (roomRef.val().endedAt){
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  };

  return (
    <div className={styles.pageAuth}>
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className={styles.mainContent}>
          <img src={logoImg} alt="Letmeask" />
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
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
