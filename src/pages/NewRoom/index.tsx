import { useState } from 'react';
import { FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import { Button } from '../../components';
import { database } from '../../services/firebase';

import illustrationImg from '../../assets/images/illustration.svg'; 
import logoImg from '../../assets/images/logo.svg';

import './styles.scss';

const Home = () => {
  const {user} = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if(newRoom.trim() === ''){
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/admin/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em um sala existente? <Link  to="/">Clique aqui</Link >
          </p>

        </div>
      </main>
    </div>
  )
}

export default Home
