import { useEffect, useMemo, useState } from 'react';
import socket from './socket';
import Card from './Card';

function App() {
  // const [message, setMessage] = useState('');
  const [numberReceived, setNumberReceived] = useState('');
  const [drawnNums, setDrawnNums] = useState<number[] | null>(null);
  const [countSimilarNums, setCountSimilarNums] = useState(0);
  const [matchedNums, setMatchedNums] = useState<number[]>([]);
  // const [randomArr, setRandomArr] = useState<number[] | null>(null);

  // const onSendMessage = () => {
  //   socket.emit('send_message', { message });
  // };
  // Memoize so it only runs once
  const randomArr = useMemo(() => {
    const uniqueNums = new Set<number>();
    while (uniqueNums.size < 25) {
      const num = Math.floor(Math.random() * 75) + 1;
      uniqueNums.add(num);
    }
    return Array.from(uniqueNums);
  }, []); // empty deps => only once

  useEffect(() => {
    socket.on('receive_message', data => {
      console.log(data);
      setNumberReceived(data.num);
      setDrawnNums(data.allDrawnNumbers);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Winning condition
  useEffect(() => {
    if (drawnNums)
      for (const num of drawnNums) {
        if (randomArr.includes(Number(num)) && !matchedNums.includes(num)) {
          setCountSimilarNums(prev => prev + 1);
          setMatchedNums(prev => [...prev, num]);
        }
      }
  }, [drawnNums, randomArr, matchedNums]);

  // const UniqueNums = new Set<number>();
  // while (UniqueNums.size < 25) {
  //   const num = Math.floor(Math.random() * 75) + 1;
  //   UniqueNums.add(num);
  // }

  // setRandomArr(Array.from(UniqueNums));

  // console.log(randomArr);

  console.log(countSimilarNums);

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
      {randomArr?.map((num, index) => (
        <Card key={index} number={num} drawnNums={drawnNums} />
      ))}
    </div>
  );
}

export default App;
