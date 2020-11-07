import React, { useEffect, useRef } from 'react';
import { renderPaddleRight, renderPaddleLeft } from '../Paddle/Paddle';
import { SPEED, PADDLE_WIDTH, PADDLE_HEIGHT } from '../../constants';
const Game = () => {
  const canvasRef = useRef(null);
  const reqRef = useRef(null);
  const speed = SPEED;
  const animate = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    const ctx = canvas.getContext('2d');
    const player = {
      x: 0,
      y: canvas.height / 2,
      speed: SPEED,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    };
    const computer = {
      x: canvas.width - PADDLE_WIDTH,
      y: canvas.height / 2,
      speed: SPEED,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    };
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
    };

    const keyDown = (event) => {
      if (event.code in keys) {
        keys[event.code] = true;
      }
    };
    const keyUp = (event) => {
      if (event.code in keys) {
        keys[event.code] = false;
      }
    };

    const move = () => {
      // player paddle position & limitation

      if (keys.ArrowUp && player.y > player.height / 2) {
        player.y -= player.speed;
      } else if (
        keys.ArrowDown &&
        player.y < canvas.height - player.height / 2
      ) {
        player.y += player.speed;
      }
    };
    const draw = () => {
      //  console.log('drawwww');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      move();
      ctx.fillStyle = '#F9F9F9';
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fill();
      ctx.beginPath();
      renderPaddleLeft(ctx, player);
      renderPaddleRight(ctx, computer);
      requestAnimationFrame(draw);
    };
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
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
