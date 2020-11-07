import React, { useEffect, useRef } from 'react';
import { renderPaddleRight, renderPaddleLeft } from '../Paddle/Paddle';
import renderBall from '../Ball/Ball';
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
    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vX: speed,
      vY: -speed,
      radius: Math.round((canvas.height / 25 + Number.EPSILON) * 100) / 100,
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

    const updateBallPos = () => {
      ball.y += ball.vY;
      ball.x += ball.vX;
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
      // ball position
      updateBallPos(ball);
      // computer speed up to the ball vertical position
      computer.speed = ball.y - computer.y;
      // computer paddle position
      computer.y += computer.speed;
      // computer paddle limitation
      if (computer.y < computer.height / 2) {
        computer.y = computer.height / 2;
      }
      if (computer.y > canvas.height - computer.height / 2) {
        computer.y = canvas.height - computer.height / 2;
      }
      // ball collusion with borders
      if (ball.y + ball.radius / 2 >= canvas.height) {
        ball.vY *= -1;
        ball.y = canvas.height - ball.radius / 2;
      }
      if (ball.y - ball.radius / 2 <= 0) {
        ball.vY *= -1;
        ball.y = ball.radius / 2;
      }
      if (ball.x + ball.radius / 2 >= canvas.width) {
        ball.vX *= -1;
        ball.x = canvas.width - ball.radius / 2;
      }
      if (ball.x - ball.radius / 2 <= 0) {
        ball.vX *= -1;
        ball.x = ball.radius / 2;
      }
      // ball collusion with paddles && bouncing back
      if (
        ball.x - ball.radius / 2 <= player.x + player.width &&
        ball.y >= player.y - player.height / 2 &&
        ball.y <= player.y + player.height / 2
      ) {
        ball.vY *= -1;
      }
      if (
        ball.x + ball.radius / 2 >= canvas.width - player.width &&
        ball.y >= computer.y - computer.height / 2 &&
        ball.y <= computer.y + computer.height / 2
      ) {
        ball.vX *= -1;
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
      renderBall(ctx, ball.radius, { x: ball.x, y: ball.y }, canvas);
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
