import { useHistory } from 'react-router-dom';


import illustrationImg from '../assets/images/illustration.svg'; 
import logoImg from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';

import Button from '../components/Button';

import '../styles/auth.scss';
import { useAuthContext } from '../context/authContext';

const Home = () => {
  const history = useHistory();
  const {signInWithGoogle, user} = useAuthContext();

  const handleCreateRoom = async () => {
    if(!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>TIre as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIcon} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em um sala</div>
          <form>
            <input 
            type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Home
