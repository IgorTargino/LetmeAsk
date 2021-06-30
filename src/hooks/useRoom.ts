import { useEffect, useState } from 'react'

import useAuth from './useAuth';
import { database } from '../services/firebase';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string
  }>
}> 

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

const useRoom = (roomId: string) => {
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      });

      setTitle(databaseRoom.title);
      setAuthorId(databaseRoom.authorId);
      setQuestions(parsedQuestions);
    })
      
  return () => {
    roomRef.off('value');
  }

  }, [roomId, user?.id]);


  return { title, authorId, questions };
}

export default useRoom
