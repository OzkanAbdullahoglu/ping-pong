import { PADDLE_HEIGHT, PADDLE_WIDTH } from '../../constants';
import {
  ROYAL_BLUE,
  TROPICAL_BLUE,
  RED,
  CAVERN_PINK,
} from '../../constants/colors.js';

export const renderPaddleLeft = (context, position) => {
  const gradient = context.createLinearGradient(0, 100, 150, 150);
  gradient.addColorStop(0, TROPICAL_BLUE);
  gradient.addColorStop(1, ROYAL_BLUE);
  context.save();
  context.fillStyle = gradient;
  context.beginPath();
  context.rect(
    position.x,
    position.y - PADDLE_HEIGHT / 2,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  context.fill();
  context.restore();
};
export const renderPaddleRight = (context, position) => {
  const gradient = context.createLinearGradient(500, 50, 650, 375);
  gradient.addColorStop(0, CAVERN_PINK);
  gradient.addColorStop(1, RED);
  context.save();
  context.fillStyle = gradient;
  context.beginPath();
  context.rect(
    position.x,
    position.y - PADDLE_HEIGHT / 2,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  context.fill();
  context.restore();
};
