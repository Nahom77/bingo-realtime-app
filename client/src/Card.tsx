interface Props {
  number: number;
  drawnNums: number[] | null;
}

const Card = ({ number, drawnNums }: Props) => {
  const isDrawn = drawnNums?.includes(number);

  return (
    <div
      style={{
        width: 'clamp(10px, 10px + 1vw, 30px)',
        height: 'clamp(10px, 10px + 1vw, 30px)',
        padding: '20px',
        border: isDrawn
          ? '2px solid rgba(46, 45, 45, 0.79)'
          : '1px solid rgba(233, 228, 228, 0.79)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // color: '#000000',
        background: isDrawn ? 'rgba(0, 0, 0, 0.466)' : '',
        // border: '1px solid rgba(0, 0, 0, 0)',
        boxShadow: '0 1rem 2rem rgba(0, 0, 0, 0.466)',
        transition: 'all 0.1s ease',
      }}
    >
      <h2 style={{ color: isDrawn ? 'white' : 'rgba(0, 0, 0, 0.98)' }}>
        {number}
      </h2>
    </div>
  );
};

export default Card;
