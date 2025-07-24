import { useEffect, useMemo, useRef, useState } from 'react';
import socket from './socket';
import Card from './Card';
import api from './lib/axios';
import type { AxiosError } from 'axios';

function App() {
  // const SOCKET_URL = 'http://localhost:3001';

  // const [message, setMessage] = useState('');
  const [drawnNums, setDrawnNums] = useState<number[] | null>(null);
  const [matchedNums, setMatchedNums] = useState<number[]>([]);
  const [userName, setUserName] = useState('');
  const [winnerUser, setWinnerUser] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);

  // const SOCKET_URL = useMemo(() => {
  //   if (userName) return 'http://localhost:3001';
  //   else return '';
  // }, []);

  // const [randomArr, setRandomArr] = useState<number[] | null>(null);

  //
  // Handling restarting
  async function handleRestart() {
    try {
      await api.post('/restart');
      setDrawnNums(null);
      setMatchedNums([]);
      setWinnerUser('');
    } catch (error) {
      console.log(
        'Error restarting the game - ',
        (error as AxiosError).message
      );
    }
  }

  // Memoize so it only runs once
  const randomArr = useMemo(() => {
    const uniqueNums = new Set<number>();
    while (uniqueNums.size < 25) {
      const num = Math.floor(Math.random() * 75) + 1;
      uniqueNums.add(num);
    }
    return Array.from(uniqueNums);
  }, []); // empty deps => only once

  // Receiving the numbers from backend
  useEffect(() => {
    if (userName) {
      socket.connect();

      socket.on('receive_message', data => {
        console.log(data);
        setDrawnNums(data.allDrawnNumbers);
      });
    }
    // Cleanup on unmount
    return () => {
      socket.off('receive_message');
    };
  }, [userName]);

  // Getting A winner Name
  useEffect(() => {
    socket.on('game_ended', data => {
      setWinnerUser(data.message);
    });
  });

  // Winning condition
  useEffect(() => {
    if (drawnNums)
      for (const num of drawnNums) {
        if (randomArr.includes(Number(num)) && !matchedNums.includes(num)) {
          setMatchedNums(prev => [...prev, num]);
        }
      }
  }, [drawnNums, randomArr, matchedNums]);

  if (matchedNums.length >= 5) {
    socket.emit('send_message', { message: userName });
  }

  if (userName) {
    socket.emit('user_enterd', { userName });
  }

  if (winnerUser)
    return (
      <>
        {' '}
        <h1>You lose , {winnerUser} wins the game.</h1>{' '}
        <button onClick={handleRestart}>Restart</button>
      </>
    );

  if (matchedNums.length >= 5)
    return (
      <>
        <h1>You win</h1> <button onClick={handleRestart}>Restart</button>
      </>
    );

  return (
    <>
      {userName ? (
        <>
          <div className='title'>
            <h1>Bingo Game</h1>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',

              gap: '10px',
              width: 'fit-content',
              margin: 'auto',
              backgroundColor: 'rgba(24, 23, 22, 0.2)',
              boxShadow: ' 0 1rem 2rem rgba(0, 0, 0, 0.61)',
              mixBlendMode: 'overlay',
              border: '1px solid white',
              padding: 'clamp(1rem, 1rem + 1vw, 2.5rem)',
              borderRadius: '2rem',
            }}
          >
            {randomArr?.map((num, index) => (
              <Card key={index} number={num} drawnNums={drawnNums} />
            ))}
          </div>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (nameRef.current !== null) setUserName(nameRef.current.value);
          }}
        >
          <input placeholder='username' required ref={nameRef} />
          <button type='submit'>Start the Game</button>
        </form>
      )}
    </>
  );
}

export default App;
