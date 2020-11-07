import React, { useEffect, useRef } from 'react';
const Game = () => {
  const canvasRef = useRef(null);
  const reqRef = useRef(null);

  const animate = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      //  console.log('drawwww');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#F9F9F9';
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fill();
      ctx.beginPath();
      requestAnimationFrame(draw);
    };
    draw();
  };

  useEffect(() => {
    reqRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqRef.current);
  }, []);

  return (
    <div className="container">
      <canvas
        ref={canvasRef}
        width={window.innerWidth / 2}
        height={window.innerHeight / 2}
        aria-label="Ping Pong Game"
        aria-roledescription="2d game context"
      />
    </div>
  );
};

export default Game;
