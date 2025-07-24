import { useEffect, useMemo, useState } from 'react';
import socket from './socket';
import Card from './Card';

function App() {
  // const [message, setMessage] = useState('');
  const [numberReceived, setNumberReceived] = useState('');
  // const [randomArr, setRandomArr] = useState<number[] | null>(null);

  // const onSendMessage = () => {
  //   socket.emit('send_message', { message });
  // };

  useEffect(() => {
    socket.on('receive_message', data => {
      console.log(data);
      setNumberReceived(data);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receive_message');
    };
  }, []);

  // const UniqueNums = new Set<number>();
  // while (UniqueNums.size < 25) {
  //   const num = Math.floor(Math.random() * 75) + 1;
  //   UniqueNums.add(num);
  // }

  // setRandomArr(Array.from(UniqueNums));

  // Memoize so it only runs once
  const randomArr = useMemo(() => {
    const uniqueNums = new Set<number>();
    while (uniqueNums.size < 25) {
      const num = Math.floor(Math.random() * 75) + 1;
      uniqueNums.add(num);
    }
    return Array.from(uniqueNums);
  }, []); // empty deps => only once

  console.log(randomArr);
  // let index = 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        width: 'fit-content',
        margin: 'auto',
      }}
    >
      {randomArr?.map(num => (
        <Card number={num} numberReceived={Number(numberReceived)} />
      ))}
    </div>
  );
}

export default App;
