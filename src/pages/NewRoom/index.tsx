import { useState } from "react";
import { FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { Button } from "../../components";
import { database } from "../../services/firebase";
import { FaMoon, FaSun } from "react-icons/fa";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import logoDarkImg from "../../assets/images/logo-dark.svg"

import styles from "./styles.module.scss";
import useTheme from "../../hooks/useTheme";

const Home = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");
  const { isDark, toggleDarkMode } = useTheme();

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
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className={styles.mainContent}>
          <img src={isDark ? logoDarkImg : logoImg} alt="Letmeask" />
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
          <p>
            Quer entrar em um sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
