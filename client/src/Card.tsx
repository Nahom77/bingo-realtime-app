interface Props {
  number: number;
  drawnNums: number[] | null;
}

const Card = ({ number, drawnNums }: Props) => {
  const isDrawn = drawnNums?.includes(number);

  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        padding: '20px',
        border: isDrawn ? '4px solid black' : '1px solid black',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2>{number}</h2>
    </div>
  );
};

export default Card;
