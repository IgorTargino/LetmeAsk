import { useEffect } from "react";
import { createContext, ReactNode, useState } from "react";
import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
        }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    }
  }

  const signOut = async () => {
    await firebase.auth().signOut()
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContextProvider, AuthContext };
