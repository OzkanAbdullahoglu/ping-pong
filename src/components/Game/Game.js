import React, { useEffect, useRef, useState } from 'react';
import { renderPaddleRight, renderPaddleLeft } from '../Paddle/Paddle';
import renderBall from '../Ball/Ball';
import './Game.css';
import {
  SPEED,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BOT_LEVEL,
  WINNER,
} from '../../constants';
import { RED, GREEN } from '../../constants/colors';

const Game = () => {
  const canvasRef = useRef(null);
  const reqRef = useRef(null);
  const defaultScore = {
    computerScore: 0,
    playerScore: 0,
  };
  const speed = SPEED;
  const beatMe = BOT_LEVEL;
  const [score, setScore] = useState({ ...defaultScore });
  const [restartGame, setRestartGame] = useState(false);
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
      vMax: speed,
      vX: speed,
      vY: -speed,
      freeze: false,
      radius: Math.round((canvas.height / 25 + Number.EPSILON) * 100) / 100,
    };
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      Space: false,
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

    const resetGame = () => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.vMax = speed;
      ball.vX = 0;
      ball.vY = 0;
      ball.freeze = true;
      player.x = 0;
      player.y = canvas.height / 2;
      computer.x = canvas.width - PADDLE_WIDTH;
      computer.y = canvas.height / 2;
    };

    const getWinner = () => {
      const { playerScore, computerScore } = score;
      if (playerScore === WINNER) return 'player';
      if (computerScore === WINNER) return 'computer';
      // if (score.player === 1)setGameEnd(true)
      return false;
    };

    const restartBall = (currSpeed) => {
      ball.freeze = false;
      ball.vX = currSpeed / 2;
      ball.vY = -currSpeed / 2;
    };
    const updateBallPos = () => {
      ball.y += ball.vY;
      ball.x += ball.vX;
    };

    const move = () => {
      // Start a new game
      if (keys.Space && ball.freeze && !getWinner()) {
        restartBall(speed);
      }
      // player paddle position & limitation
      if (keys.ArrowUp && player.y > player.height / 2) {
        player.y -= player.speed;
      } else if (
        keys.ArrowDown &&
        player.y < canvas.height - player.height / 2
      ) {
        player.y += player.speed;
      }
      // update ball position
      updateBallPos(ball);
      // computer speed up to the ball vertical position
      // manipulated computer speed to catch the ball and
      // to give the user a possibility to win
      computer.speed = beatMe * (ball.y - computer.y);
      // computer can't be faster than user
      if (computer.speed < -speed) {
        computer.speed = -speed;
      }
      if (computer.speed > speed) {
        computer.speed = speed;
      }
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
        setScore({ ...score, playerScore: (score.playerScore += 1) });
        resetGame();
      }
      if (ball.x - ball.radius / 2 <= 0) {
        ball.vX *= -1;
        ball.x = ball.radius / 2;
        setScore({ ...score, computerScore: (score.computerScore += 1) });
        resetGame();
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
        ball.vY *= -1;
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      move();
      ctx.fillStyle = '#F9F9F9';
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fill();
      ctx.beginPath();
      renderPaddleLeft(ctx, player);
      renderPaddleRight(ctx, computer);
      renderBall(ctx, ball.radius, { x: ball.x, y: ball.y }, canvas);
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      if (getWinner()) {
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
        if (getWinner() === 'player') {
          ctx.fillStyle = GREEN;
          ctx.fillText('YOU WIN !', canvas.width / 2, 30);
        }
        if (getWinner() === 'computer') {
          ctx.fillStyle = RED;
          ctx.fillText('GAME OVER !', canvas.width / 2, 30);
        }
      }
      requestAnimationFrame(draw);
    };

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    draw();
  };

  const handleRestart = () => {
    setScore({ ...defaultScore });
    setRestartGame(!restartGame);
  };

  useEffect(() => {
    reqRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqRef.current);
  }, [restartGame]);

  const { playerScore, computerScore } = score;

  return (
    <div className="container">
      <>
        <span className="score">
          Player: {playerScore} | Computer: {computerScore}
        </span>
        <span className="controls">
          Use [↑][↓] to MOVE
          <br />
          Use [SPACE] to START
        </span>
      </>
      <canvas
        ref={canvasRef}
        width={window.innerWidth / 2}
        height={window.innerHeight / 2}
        aria-label="Ping Pong Game"
        aria-roledescription="2d game context"
      />
      {playerScore === WINNER || computerScore === WINNER ? (
        <button type="button" className="button" onClick={handleRestart}>
          Play again
        </button>
      ) : null}
    </div>
  );
};

export default Game;
