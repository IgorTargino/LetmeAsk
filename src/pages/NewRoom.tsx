import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg'; 
import logoImg from '../assets/images/logo.svg';

import Button from '../components/Button';
import { useAuthContext } from '../context/authContext';

import '../styles/auth.scss';

const Home = () => {
  // const history = useHistory();
  const {user} = useAuthContext();

  // if(!user) {
  //   history.push('/');
  // }

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
          <form>
            <input 
            type="text"
              placeholder="Nome da sala"
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
