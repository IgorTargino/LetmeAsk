import { useHistory } from "react-router";

import useAuth from "../../hooks/useAuth";

import styles from "./styles.module.scss";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const history = useHistory();

  const singOutAccount = async () => {
    if (user) {
      await signOut();
    }

    history.push("/");
  };

  return (
    <div className={styles.userProfile}>
      <img src={user?.avatar} alt={user?.name} />

      <span>{user?.name}</span>
      <button onClick={singOutAccount}>(sair)</button>
    </div>
  );
};

export { UserProfile };
